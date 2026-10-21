/**
 * The ClearAuth assistant.
 *
 * Every answer is built from the selected case, the coverage-policy
 * evaluation and the drug reference table, so it changes when the case
 * changes. When an LLM is configured (see llm.ts) these grounded answers are
 * passed to the model as context and it writes the final response; without
 * one, the grounded answer is returned as is.
 */
import { findDrug } from "./drugs";
import { ALTERNATIVES, evaluateCase, indicationFor, type PolicyResult } from "./policies";
import { getCases } from "./store";
import type { PACase } from "./types";

export type Role = "provider" | "patient" | "payer";

const STATUS_LABEL: Record<string, string> = {
  pending: "Submitted, waiting for the plan to pick it up",
  review: "Under clinical review by the plan",
  approved: "Approved",
  denied: "Denied",
};

const ICON = { met: "✓", not_met: "✗", unclear: "?" } as const;

// ---------------------------------------------------------------------------
// Routing a free-text message to a feature
// ---------------------------------------------------------------------------

const ROUTES: Record<Role, [RegExp, string][]> = {
  provider: [
    [/appeal letter|draft (an )?appeal|write (an )?appeal/, "appeal_gen"],
    [/how (do|to|can) i appeal|appeal process|file (an )?appeal/, "appeal"],
    [/why.*den|denial reason|was denied|fix (the )?denial/, "why_denied"],
    [/evidence|literature|trial|study|studies/, "evidence_search"],
    [/likelihood|chance|predict|insight|approv/, "pa_insights"],
    [/summar/, "summarise_docs"],
    [/document|checklist|need to submit|required|attach/, "what_documents"],
    [/letter of medical necessity|justification|clinical doc|generate/, "clinical_doc"],
  ],
  patient: [
    [/side effect|watch out|safe|risk/, "side_effects"],
    [/how long|when will|timeline|how many days|decision/, "how_long"],
    [/if.*denied|appeal|my rights/, "what_if_denied"],
    [/status|what does.*mean|in review|pending/, "pa_status"],
    [/why do i need|prior auth|treatment/, "treatment_explain"],
    [/explain|what is|medication|drug|cost|copay/, "explain_medication"],
  ],
  payer: [
    [/denial letter|deny letter|draft.*letter/, "denial_letter"],
    [/alternative|formulary|covered|tier|cheaper/, "alt_suggest"],
    [/full policy|checklist|complete/, "match_guidelines"],
    [/guideline|criteria|policy|match/, "guideline_match"],
    [/faster|speed|queue|backlog|workload|sla/, "process_faster"],
    [/summary|summar|overview|recommend/, "review_case"],
    [/review|clinical|analy/, "clinical_review"],
  ],
};

export function routeFeature(role: Role, feature: string | undefined, message: string): string {
  if (feature && feature !== "general") return feature;
  const lower = message.toLowerCase();
  if (/^(hi|hello|hey)\b|^help$/.test(lower.trim())) return "hello";
  for (const [re, f] of ROUTES[role] ?? ROUTES.provider) if (re.test(lower)) return f;
  return "general";
}

/** Choose a sensible case when the user has not picked one. */
export function defaultCase(feature: string, role: Role, patientId?: string): PACase | undefined {
  let cases = getCases();
  if (role === "patient" && patientId) cases = cases.filter((c) => c.patientId === patientId);
  const wantsDenied = ["appeal_gen", "why_denied", "what_if_denied"].includes(feature);
  const order = wantsDenied ? ["denied", "review", "pending", "approved"] : ["review", "pending", "denied", "approved"];
  for (const s of order) {
    const hit = [...cases].reverse().find((c) => c.status === s);
    if (hit) return hit;
  }
  return cases[0];
}

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

const header = (c: PACase) => `Case ${c.id} · ${c.patientName} · ${c.drug} for ${c.condition} (${c.icd10Code}) · ${c.payer}`;

function criteriaLines(p: PolicyResult): string[] {
  return p.criteria.map((cr) => `${ICON[cr.status]} **${cr.text}** — ${cr.evidence}`);
}

function gaps(p: PolicyResult) {
  return p.criteria.filter((cr) => cr.status !== "met");
}

function recommendationText(p: PolicyResult): string {
  if (p.recommendation === "approve") return "**Recommendation: approve.** All criteria are met with documentation.";
  if (p.recommendation === "request_information")
    return "**Recommendation: request more information** before deciding. The gaps below can likely be closed by the provider.";
  return "**Recommendation: refer to a medical director.** The request does not meet the core criteria as submitted.";
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

// ---------------------------------------------------------------------------
// Feature answers
// ---------------------------------------------------------------------------

type Builder = (c: PACase, p: PolicyResult) => string;

const PROVIDER: Record<string, Builder> = {
  pa_insights: (c, p) =>
    [
      `**Approval outlook — ${c.id}**`,
      header(c),
      "",
      `**Policy fit score: ${p.score}/100** (share of coverage criteria met; 100 means every criterion is documented)`,
      p.summary,
      "",
      ...criteriaLines(p),
      "",
      gaps(p).length ? "**To raise the chance of approval:**" : "**Next step:** submit as is; the request is complete.",
      ...gaps(p).map((g, i) => `${i + 1}. ${g.fix}`),
    ].join("\n"),

  what_documents: (c, p) =>
    [
      `**Document checklist — ${c.drug} for ${p.indication ?? c.condition}**`,
      header(c),
      "",
      ...(p.documents.length
        ? p.documents.map((d) => `${d.present ? "✓" : "✗"} ${d.name}${d.present ? "" : " — missing"}`)
        : ["No policy-specific checklist; attach clinical notes and the reason for the request."]),
      "",
      `Attached now: ${c.documents.length ? c.documents.join(", ") : "nothing"}`,
      ...(gaps(p).length ? ["", "**Also address in the request:**", ...gaps(p).map((g) => `- ${g.fix}`)] : []),
    ].join("\n"),

  clinical_doc: (c, p) => {
    const info = findDrug(c.drug);
    return [
      `**Letter of medical necessity — draft**`,
      header(c),
      "",
      `To: Utilization Management, ${c.payer}`,
      `Re: Prior authorization for ${c.drug}${info ? ` (${info.generic})` : ""}${c.dosage ? `, ${c.dosage}` : ""}`,
      "",
      `I am requesting coverage of ${c.drug} for ${c.patientName} (DOB ${c.patientDob}), who has ${c.condition.toLowerCase()} (ICD-10 ${c.icd10Code}).`,
      "",
      `**Clinical picture:** ${c.clinicalJustification || "[add disease severity and functional impact]"}`,
      `**Treatment history:** ${c.previousTreatments || "[add prior therapies, doses, durations and outcomes]"}`,
      "",
      `**How the request meets ${c.payer}'s criteria:**`,
      ...p.criteria.filter((cr) => cr.status === "met").map((cr) => `- ${cr.text}: ${cr.evidence}`),
      ...(gaps(p).length ? ["", "**Before sending, complete these items:**", ...gaps(p).map((g) => `- [ ] ${g.fix}`)] : []),
      "",
      `Sincerely,`,
      `${c.provider}, NPI ${c.npi}`,
    ].join("\n");
  },

  evidence_search: (c) => {
    const info = findDrug(c.drug);
    const key = indicationFor(c)?.key;
    const studies = info && key ? info.evidence[key] ?? [] : [];
    return [
      `**Supporting evidence — ${c.drug} for ${c.condition}**`,
      header(c),
      "",
      ...(studies.length
        ? studies.map((s) => `- **${s.trial}:** ${s.finding}`)
        : [`No curated studies for ${c.drug} in this indication. Cite the prescribing information and the relevant specialty society guideline.`]),
      "",
      "Cite the trial publication and the prescribing information in the request, and check each reference before submitting.",
    ].join("\n");
  },

  appeal_gen: (c, p) => {
    if (c.status !== "denied") {
      return `**Appeal letter**\n${header(c)}\n\nThis case is ${STATUS_LABEL[c.status].toLowerCase()}, so there is nothing to appeal yet. Pick a denied case to draft an appeal.`;
    }
    return [
      `**First-level appeal — draft**`,
      header(c),
      "",
      `To: Appeals Department, ${c.payer}`,
      `Re: Appeal of prior authorization denial ${c.id} for ${c.drug}`,
      "",
      `The request was denied for this reason: "${c.denialReason ?? "not stated"}". I am asking for reconsideration.`,
      "",
      `**Add before sending (each item answers part of the denial):**`,
      ...gaps(p).map((g) => `- ${g.text}: ${g.fix}`),
      ...(gaps(p).length === 0 ? ["- All coverage criteria are met with the documents now attached; see below."] : []),
      "",
      `**Criteria now met:**`,
      ...p.criteria.filter((cr) => cr.status === "met").map((cr) => `- ${cr.text} (${cr.evidence})`),
      "",
      `I request a peer-to-peer review if the plan does not overturn the decision on the record.`,
      "",
      `${c.provider}, NPI ${c.npi}`,
    ].join("\n");
  },

  why_denied: (c, p) => {
    if (c.status !== "denied") return `**Denial analysis**\n${header(c)}\n\nThis case has not been denied (status: ${STATUS_LABEL[c.status]}).`;
    return [
      `**Denial analysis — ${c.id}**`,
      header(c),
      "",
      `**Plan's stated reason:** ${c.denialReason ?? "not stated"}`,
      "",
      `**What the rules engine finds:** ${p.summary}`,
      ...criteriaLines(p).filter((l) => !l.startsWith("✓")),
      "",
      "**How to fix it:**",
      ...gaps(p).map((g, i) => `${i + 1}. ${g.fix}`),
      "",
      "Most plans allow 180 days to file a first-level appeal for commercial coverage. Fixing documentation gaps and resubmitting is often faster than a formal appeal.",
    ].join("\n");
  },

  summarise_docs: (c, p) =>
    [
      `**Case summary — ${c.id}**`,
      header(c),
      "",
      `- **Status:** ${STATUS_LABEL[c.status]} (submitted ${c.submittedDate}, due ${c.dueDate})`,
      `- **Requested:** ${c.drug}${c.dosage ? `, ${c.dosage}` : ""}`,
      `- **Clinical picture:** ${c.clinicalJustification || "not provided"}`,
      `- **Prior treatment:** ${c.previousTreatments || "not provided"}`,
      `- **Documents:** ${c.documents.length ? c.documents.join(", ") : "none attached"}`,
      `- **Policy fit:** ${p.score}/100. ${p.summary}`,
      ...(c.denialReason ? [`- **Denial reason:** ${c.denialReason}`] : []),
    ].join("\n"),

  appeal: (c) =>
    [
      `**How to appeal a prior authorization denial**`,
      "",
      "1. **Read the denial notice.** It must state the reason and the criteria used. Ask the plan for the policy if it is not attached.",
      "2. **Fix what can be fixed.** Missing documents or step-therapy records are often resolved by resubmitting rather than appealing.",
      "3. **Request a peer-to-peer review** with the plan's medical director, usually within a few days of the denial.",
      "4. **File a first-level (internal) appeal** with a letter of medical necessity and the missing evidence. Commercial plans generally allow 180 days.",
      "5. **Ask for an expedited appeal** if waiting could seriously harm the patient; plans must decide these within 72 hours.",
      "6. **External review:** if the internal appeal is upheld, the patient can request an independent external review.",
      "",
      c.status === "denied" ? `Case ${c.id} is denied; use "Appeal Generator" to draft the letter from its record.` : "",
    ].join("\n"),
};

const PATIENT: Record<string, Builder> = {
  explain_medication: (c) => {
    const info = findDrug(c.drug);
    return [
      `**About ${c.drug}${info ? ` (${info.generic})` : ""}**`,
      "",
      info ? `${c.drug} is ${info.plainClass}. Your doctor has requested it for ${c.condition.toLowerCase()}.` : `Your doctor has requested ${c.drug} for ${c.condition.toLowerCase()}.`,
      info ? `**How it is taken:** ${info.route}.` : "",
      c.dosage ? `**Your prescribed dose:** ${c.dosage}.` : "",
      "",
      `**Why your plan needs a prior authorization:** ${c.payer} asks for approval before covering some medicines, usually expensive ones or ones with cheaper alternatives. Your doctor's office sends your medical history to show the medicine is the right choice for you.`,
      "",
      "Questions about cost? Ask the pharmacy for your copay once it is approved, and ask the manufacturer about copay support programmes if you have commercial insurance.",
    ].join("\n");
  },
  treatment_explain: (c) => PATIENT.explain_medication(c, evaluateCase(c)),

  pa_status: (c) => {
    const last = c.timeline[c.timeline.length - 1];
    const lines = [`**Your request for ${c.drug}: ${STATUS_LABEL[c.status]}**`, ""];
    if (c.status === "approved") {
      lines.push(`Good news: it is approved${c.authNumber ? ` (authorization ${c.authNumber})` : ""}${c.authValidUntil ? `, valid until ${c.authValidUntil}` : ""}. You can fill the prescription.`);
    } else if (c.status === "denied") {
      lines.push(`The plan said no for this reason: "${c.denialReason ?? "not stated"}". This is often fixable — your doctor can send more information or appeal. See "If Denied — My Rights".`);
    } else {
      lines.push(`The plan is checking your doctor's request against its rules. A decision is due by **${c.dueDate}**.`);
      lines.push("You do not need to do anything right now. If the plan asks for more information, your doctor's office will handle it.");
    }
    if (last) lines.push("", `**Latest update (${last.date}):** ${last.title} — ${last.description}`);
    return lines.join("\n");
  },

  side_effects: (c) => {
    const info = findDrug(c.drug);
    if (!info) return `I don't have side-effect information for ${c.drug}. Please ask your pharmacist or read the medication guide.`;
    return [
      `**${c.drug} (${info.generic}): what to watch for**`,
      "",
      "**Common side effects:**",
      ...info.common.map((s) => `- ${s}`),
      "",
      "**Call your doctor promptly if you notice signs of:**",
      ...info.serious.map((s) => `- ${s}`),
      ...(info.boxedWarning ? ["", `**Boxed warning:** ${info.boxedWarning}. Your doctor will go through this with you.`] : []),
      "",
      `**Checks your doctor may do:** ${info.monitoring.join("; ")}.`,
      "",
      "This is a summary. Read the medication guide that comes with your prescription, and call 911 for any severe allergic reaction.",
    ].join("\n");
  },

  how_long: (c) => {
    const submitted = new Date(c.submittedDate);
    const due = new Date(c.dueDate);
    const span = Number.isNaN(submitted.getTime()) || Number.isNaN(due.getTime()) ? null : daysBetween(submitted, due);
    return [
      `**How long your prior authorization takes**`,
      "",
      `Your request for ${c.drug} was sent on ${c.submittedDate}. ${c.payer}'s decision is due by **${c.dueDate}**${span !== null ? ` (${span} days)` : ""}.`,
      "",
      "- Medicare Part D drug requests: within 72 hours, or 24 hours if your doctor says it is urgent.",
      "- Commercial plans: usually a few days to two weeks, depending on the plan and state rules; urgent requests are faster.",
      "- Requests sent electronically with complete documents are usually fastest.",
      "",
      c.status === "approved" || c.status === "denied" ? `A decision has been made: **${STATUS_LABEL[c.status]}**.` : "If you have heard nothing two days after the due date, call the number on your insurance card.",
    ].join("\n");
  },

  what_if_denied: (c) =>
    [
      `**If your prior authorization is denied**`,
      "",
      c.status === "denied" ? `Your request for ${c.drug} was denied: "${c.denialReason ?? "no reason stated"}".` : `Your request for ${c.drug} has not been denied (status: ${STATUS_LABEL[c.status]}).`,
      "",
      "**Your rights:**",
      "- You must be told the reason in writing.",
      "- Your doctor can send more information or ask to speak with the plan's doctor (a peer-to-peer review).",
      "- You can file an internal appeal; most commercial plans allow 180 days.",
      "- If waiting could seriously harm your health, ask for an expedited appeal (decided within 72 hours).",
      "- If the plan upholds the denial, you can ask for an independent external review.",
      "",
      "Ask your doctor's office whether they will file the appeal for you; most do.",
    ].join("\n"),
};

const PAYER: Record<string, Builder> = {
  guideline_match: (c, p) =>
    [`**Coverage criteria match — ${c.id}**`, header(c), "", ...criteriaLines(p), "", recommendationText(p)].join("\n"),

  match_guidelines: (c, p) =>
    [
      `**Full policy checklist — ${c.drug}${p.indication ? ` / ${p.indication}` : ""}**`,
      header(c),
      "",
      "**Criteria**",
      ...criteriaLines(p),
      "",
      "**Documents**",
      ...p.documents.map((d) => `${d.present ? "✓" : "✗"} ${d.name}`),
      "",
      `Policy fit score: ${p.score}/100`,
      recommendationText(p),
    ].join("\n"),

  clinical_review: (c, p) => {
    const info = findDrug(c.drug);
    return [
      `**Clinical review — ${c.id}**`,
      header(c),
      "",
      `**Request:** ${c.drug}${info ? ` (${info.generic}, ${info.drugClass})` : ""}${c.dosage ? `, ${c.dosage}` : ""}`,
      `**Clinical picture:** ${c.clinicalJustification || "not provided"}`,
      `**Prior treatment:** ${c.previousTreatments || "not provided"}`,
      "",
      ...criteriaLines(p),
      "",
      ...(info?.boxedWarning ? [`**Safety:** boxed warning for ${info.boxedWarning.toLowerCase()}. Required screening: ${info.monitoring[0]}.`, ""] : []),
      recommendationText(p),
    ].join("\n");
  },

  alt_suggest: (c, p) => {
    const key = indicationFor(c)?.key;
    const alts = key ? ALTERNATIVES[key] ?? [] : [];
    return [
      `**Formulary alternatives — ${p.indication ?? c.condition}**`,
      header(c),
      "",
      ...(alts.length ? alts.map((a) => `- **${a.drug}:** ${a.note}`) : ["No alternatives configured for this indication."]),
      "",
      "Illustrative formulary. Confirm tier and step rules against the member's plan before suggesting a switch to the prescriber.",
    ].join("\n");
  },

  denial_letter: (c, p) => {
    const open = gaps(p);
    if (open.length === 0) {
      return `**Denial letter**\n${header(c)}\n\nAll coverage criteria are met, so the rules engine does not support a denial. Recommend approval instead.`;
    }
    return [
      `**Adverse determination notice — draft**`,
      header(c),
      "",
      `Dear ${c.patientName} and ${c.provider},`,
      "",
      `${c.payer} has reviewed the request for ${c.drug} for ${c.condition.toLowerCase()}. We are unable to approve it at this time because the following coverage criteria were not met:`,
      ...open.map((g) => `- ${g.text} (${g.evidence})`),
      "",
      "**What can change this decision:**",
      ...open.map((g) => `- ${g.fix}`),
      "",
      "You have the right to appeal within 180 days of this notice, to request an expedited appeal if waiting could seriously jeopardise health, and to request an independent external review. The prescriber may request a peer-to-peer discussion with our medical director.",
      "",
      "A licensed clinician must review and sign any adverse determination before it is sent.",
    ].join("\n");
  },

  review_case: (c, p) =>
    [
      `**Case summary and recommendation — ${c.id}**`,
      header(c),
      "",
      `- **Status:** ${STATUS_LABEL[c.status]}; decision due ${c.dueDate}`,
      `- **Priority:** ${c.priority}; channel: ${c.submissionChannel.toUpperCase()}`,
      `- **Policy fit:** ${p.score}/100 — ${p.summary}`,
      "",
      recommendationText(p),
    ].join("\n"),

  process_faster: () => {
    const open = getCases().filter((c) => c.status === "pending" || c.status === "review");
    const scored = open.map((c) => ({ c, p: evaluateCase(c) }));
    const ready = scored.filter((x) => x.p.recommendation === "approve");
    const info = scored.filter((x) => x.p.recommendation === "request_information");
    const md = scored.filter((x) => x.p.recommendation === "medical_director_review");
    const list = (xs: typeof scored) => (xs.length ? xs.map((x) => `${x.c.id} (${x.c.drug})`).join(", ") : "none");
    return [
      `**Queue triage — ${open.length} open cases**`,
      "",
      `- **Ready to approve (${ready.length}):** ${list(ready)}. All criteria met; a nurse reviewer can sign these off.`,
      `- **Request information (${info.length}):** ${list(info)}. Send one consolidated request listing every gap.`,
      `- **Medical director (${md.length}):** ${list(md)}.`,
      "",
      "**Ways to cut turnaround:**",
      "1. Auto-approve requests that meet every criterion with documents attached.",
      "2. Exempt prescribers with consistently high approval rates from routine review (gold-carding).",
      "3. Ask for all missing items in one message instead of several rounds.",
      "4. Take requests through FHIR-based electronic prior authorization so documents arrive structured.",
    ].join("\n");
  },
};

const GENERAL = {
  hello: (role: Role) =>
    `Hi, I'm the ClearAuth assistant. I answer from the case you select and the plan's coverage criteria.\n\nTry one of the features on the left, or ask something like:\n${
      role === "patient"
        ? '- "What does my status mean?"\n- "What side effects should I watch for?"'
        : role === "payer"
          ? '- "Match this case to our criteria"\n- "Which cases can we approve today?"'
          : '- "What documents are missing?"\n- "Why was this denied and how do I fix it?"'
    }`,
  general: (c: PACase, p: PolicyResult) =>
    `I can help with this case (${c.id}, ${c.drug}). ${p.summary}\n\nChoose a feature on the left for a full answer, or ask about documents, approval chances, denials, side effects or alternatives.`,
};

export interface AssistantResult {
  response: string;
  feature: string;
  caseId?: string;
  policy?: PolicyResult;
}

export function groundedAnswer(role: Role, feature: string, c: PACase | undefined): AssistantResult {
  if (feature === "hello") return { response: GENERAL.hello(role), feature };
  if (!c) return { response: "There are no cases to work with yet. Create a PA request first.", feature };
  const p = evaluateCase(c);
  const table = role === "patient" ? PATIENT : role === "payer" ? PAYER : PROVIDER;
  const builder = table[feature] ?? PROVIDER[feature] ?? PAYER[feature] ?? PATIENT[feature];
  const response = builder ? builder(c, p) : GENERAL.general(c, p);
  return { response: response.replace(/\n{3,}/g, "\n\n").trim(), feature, caseId: c.id, policy: p };
}
