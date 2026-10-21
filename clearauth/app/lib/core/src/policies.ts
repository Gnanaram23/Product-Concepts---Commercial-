/**
 * A small, explainable coverage-policy engine.
 *
 * Each drug has illustrative criteria per indication, modelled on how US
 * commercial plans commonly write prior authorization policies (on-label
 * diagnosis, step therapy, severity, safety screening, supporting documents).
 * They are examples for the prototype, not any real payer's policy.
 *
 * Every criterion is checked against the case's own fields, so the result
 * shows exactly which text or document satisfied it.
 */
import type { PACase } from "./types";

export type CriterionStatus = "met" | "not_met" | "unclear";

export interface CriterionResult {
  id: string;
  text: string;
  status: CriterionStatus;
  evidence: string;
  fix: string;
}

export interface PolicyResult {
  drug: string;
  indication: string | null;
  onLabel: boolean;
  criteria: CriterionResult[];
  documents: { name: string; present: boolean }[];
  score: number;
  recommendation: "approve" | "request_information" | "medical_director_review";
  summary: string;
}

interface CaseText {
  history: string;
  justification: string;
  docs: string[];
  all: string;
}

interface Criterion {
  id: string;
  text: string;
  fix: string;
  check: (t: CaseText) => { status: CriterionStatus; evidence: string };
}

interface Indication {
  key: string;
  label: string;
  icd: string[];
  criteria: Criterion[];
  documents: { name: string; pattern: RegExp }[];
}

interface DrugPolicy {
  drug: string;
  indications: Indication[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function firstMatch(text: string, pattern: RegExp): string | null {
  const m = text.match(pattern);
  return m ? m[0] : null;
}

/** Longest treatment duration mentioned, in months ("for 6 months", "for 2 years"). */
function longestDurationMonths(text: string): number {
  let best = 0;
  const re = /(\d+(?:\.\d+)?)\s*(month|year|week)s?/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const n = Number(m[1]);
    const unit = m[2].toLowerCase();
    const months = unit === "year" ? n * 12 : unit === "week" ? n / 4.345 : n;
    best = Math.max(best, months);
  }
  return best;
}

function tried(label: string, pattern: RegExp, fix: string, minMonths = 0): Criterion {
  return {
    id: `step_${label.replace(/\W+/g, "_").toLowerCase()}`,
    text: minMonths ? `Trial of ${label} for at least ${minMonths} months` : `Trial of ${label}`,
    fix,
    check: (t) => {
      const hit = firstMatch(t.history, pattern);
      if (!hit) {
        return { status: "not_met", evidence: t.history ? `Treatment history lists: "${t.history}"` : "No treatment history provided" };
      }
      if (minMonths && longestDurationMonths(t.history) < minMonths) {
        return { status: "unclear", evidence: `${hit} is documented, but the duration is not clear` };
      }
      return { status: "met", evidence: `Treatment history: "${t.history}"` };
    },
  };
}

function documented(id: string, text: string, pattern: RegExp, fix: string): Criterion {
  return {
    id,
    text,
    fix,
    check: (t) => {
      const doc = t.docs.find((d) => pattern.test(d));
      if (doc) return { status: "met", evidence: `Attached: ${doc}` };
      const hit = firstMatch(`${t.justification} ${t.history}`, pattern);
      if (hit) return { status: "met", evidence: `Stated in the request: "${hit}"` };
      return { status: "not_met", evidence: "Not found in the attached documents or the clinical justification" };
    },
  };
}

function numberAtLeast(id: string, text: string, pattern: RegExp, min: number, fix: string): Criterion {
  return {
    id,
    text,
    fix,
    check: (t) => {
      const m = t.all.match(pattern);
      if (!m) return { status: "not_met", evidence: "No value found in the request" };
      const value = Number(m[1]);
      return value >= min
        ? { status: "met", evidence: `Request states "${m[0]}"` }
        : { status: "not_met", evidence: `Request states "${m[0]}", below the threshold of ${min}` };
    },
  };
}

const TB = documented("tb_screen", "Negative TB screening within 12 months", /\btb\b|tb_test|quantiferon|igra|ppd|tuberculosis/i, "Attach a TB test result (QuantiFERON or PPD) from the last 12 months.");
const NOTES = { name: "Clinical notes", pattern: /clinical_notes|note/i };

const CSDMARD = /methotrexate|leflunomide|sulfasalazine|hydroxychloroquine/i;
const TNF = /adalimumab|humira|etanercept|enbrel|infliximab|remicade|certolizumab|cimzia|golimumab|simponi|tnf/i;

// ---------------------------------------------------------------------------
// Policies
// ---------------------------------------------------------------------------

const POLICIES: DrugPolicy[] = [
  {
    drug: "Humira",
    indications: [
      {
        key: "ra",
        label: "Rheumatoid arthritis",
        icd: ["M05", "M06"],
        criteria: [
          tried("a conventional DMARD (methotrexate, leflunomide, sulfasalazine or hydroxychloroquine)", CSDMARD, "Document the conventional DMARD, dose and duration, and why it failed or was not tolerated.", 3),
          documented("activity", "Moderate-to-severe disease activity documented (DAS28, CDAI or SDAI)", /das28|cdai|sdai/i, "Add a disease activity score from the last visit."),
          TB,
        ],
        documents: [NOTES, { name: "Disease activity score", pattern: /das28|cdai|sdai/i }, { name: "TB screening result", pattern: /tb|quantiferon/i }],
      },
      {
        key: "crohns",
        label: "Crohn's disease",
        icd: ["K50"],
        criteria: [
          tried("conventional therapy (corticosteroids or an immunomodulator)", /predniso|budesonide|steroid|azathioprine|mercaptopurine|methotrexate/i, "Document the steroid course or immunomodulator tried and the response.", 3),
          documented("objective", "Objective evidence of active disease (endoscopy, imaging or CDAI)", /colonoscopy|endoscop|mri|ct enterography|cdai/i, "Attach the colonoscopy or imaging report."),
          TB,
        ],
        documents: [NOTES, { name: "Endoscopy or imaging report", pattern: /colonoscopy|endoscop|mri|imaging/i }, { name: "TB screening result", pattern: /tb|quantiferon/i }],
      },
      {
        key: "psa",
        label: "Psoriatic arthritis",
        icd: ["L40.5"],
        criteria: [
          tried("an NSAID or conventional DMARD", /methotrexate|leflunomide|sulfasalazine|naproxen|ibuprofen|nsaid|celecoxib|diclofenac/i, "Document the NSAID or DMARD tried and the response."),
          TB,
        ],
        documents: [NOTES, { name: "TB screening result", pattern: /tb|quantiferon/i }],
      },
    ],
  },
  {
    drug: "Rinvoq",
    indications: [
      {
        key: "ra",
        label: "Rheumatoid arthritis",
        icd: ["M05", "M06"],
        criteria: [
          tried("one or more TNF blockers (required by the Rinvoq label for RA)", TNF, "Document the TNF blocker tried, its duration and the reason it was stopped, or request a TNF blocker first."),
          tried("a conventional DMARD", CSDMARD, "Document methotrexate or another conventional DMARD."),
          documented("activity", "Moderate-to-severe disease activity documented (DAS28, CDAI or SDAI)", /das28|cdai|sdai/i, "Add a disease activity score from the last visit."),
          TB,
          documented("labs", "Baseline CBC, liver enzymes and lipids", /cbc|lipid|lab/i, "Attach baseline CBC, liver function and lipid results."),
        ],
        documents: [NOTES, { name: "Disease activity score", pattern: /das28|cdai|sdai/i }, { name: "TB screening result", pattern: /tb|quantiferon/i }, { name: "Baseline labs", pattern: /lab|cbc|lipid/i }],
      },
    ],
  },
  {
    drug: "Skyrizi",
    indications: [
      {
        key: "pso",
        label: "Plaque psoriasis",
        icd: ["L40.0"],
        criteria: [
          tried("phototherapy or a conventional systemic agent", /phototherapy|uvb|puva|methotrexate|cyclosporine|acitretin/i, "Document phototherapy or a systemic agent and the response."),
          numberAtLeast("bsa", "Body surface area of at least 3% (or PASI of 10 or more)", /(\d+(?:\.\d+)?)\s*%\s*BSA/i, 3, "Record BSA or PASI from the most recent examination."),
          TB,
        ],
        documents: [NOTES, { name: "TB screening result", pattern: /tb|quantiferon/i }, { name: "Photographs or severity assessment", pattern: /photo|pasi|bsa/i }],
      },
    ],
  },
  {
    drug: "Dupixent",
    indications: [
      {
        key: "ad",
        label: "Atopic dermatitis",
        icd: ["L20"],
        criteria: [
          tried("a medium-to-high potency topical corticosteroid", /triamcinolone|clobetasol|betamethasone|mometasone|fluocinonide|corticosteroid/i, "Document the topical steroid, potency and duration.", 1),
          tried("a topical calcineurin or PDE-4 inhibitor", /tacrolimus|pimecrolimus|crisaborole|ruxolitinib cream/i, "Document a trial of tacrolimus, pimecrolimus or crisaborole, or why it is unsuitable."),
          documented("severity", "Moderate-to-severe disease documented (EASI, IGA or BSA)", /easi|iga|bsa/i, "Add EASI, IGA or BSA from the latest visit."),
        ],
        documents: [NOTES, { name: "Severity score (EASI or IGA)", pattern: /easi|iga|severity/i }],
      },
      {
        key: "asthma",
        label: "Moderate-to-severe asthma",
        icd: ["J45.4", "J45.5"],
        criteria: [
          numberAtLeast("eos", "Blood eosinophils of at least 150 cells/µL (or oral steroid dependence)", /eosinophils?\s*(\d+)/i, 150, "Attach a recent blood eosinophil count."),
          tried("a medium-to-high dose inhaled corticosteroid plus a second controller", /fluticasone|budesonide|mometasone|beclomethasone|ciclesonide/i, "Document the ICS dose and the second controller (LABA, LAMA or montelukast)."),
          documented("exac", "Exacerbation history in the last 12 months", /exacerbation/i, "Record the number of exacerbations needing oral steroids in the last year."),
        ],
        documents: [NOTES, { name: "Eosinophil count", pattern: /eosinophil/i }],
      },
    ],
  },
  ...["Ozempic", "Mounjaro"].map((drug) => ({
    drug,
    indications: [
      {
        key: "t2d",
        label: "Type 2 diabetes",
        icd: ["E11"],
        criteria: [
          tried("metformin (or a documented contraindication)", /metformin/i, "Document the metformin trial, or the contraindication or intolerance.", 3),
          documented("a1c", "Recent A1c above goal", /a1c|hba1c/i, "Attach an A1c result from the last 3 months."),
        ],
        documents: [NOTES, { name: "A1c result", pattern: /a1c/i }, { name: "Medication history", pattern: /medication_history|pharmacy/i }],
      },
    ],
  })),
  {
    drug: "Keytruda",
    indications: [
      {
        key: "nsclc",
        label: "Non-small cell lung cancer",
        icd: ["C34"],
        criteria: [
          documented("pdl1", "PD-L1 expression result (TPS)", /pd-?l1|tps/i, "Attach the PD-L1 IHC 22C3 report."),
          documented("drivers", "EGFR and ALK status reported for first-line use", /egfr/i, "Attach EGFR and ALK testing results."),
          documented("ecog", "Performance status documented (ECOG 0–1)", /ecog/i, "Record ECOG performance status."),
          documented("onc", "Oncology consult or pathology report", /oncology|pathology/i, "Attach the oncology note or pathology report."),
        ],
        documents: [NOTES, { name: "Pathology or oncology report", pattern: /oncology|pathology/i }, { name: "PD-L1 biomarker report", pattern: /pdl1|pd-l1|biomarker/i }],
      },
    ],
  },
];

export function findPolicy(drug: string): DrugPolicy | undefined {
  const d = drug.toLowerCase();
  return POLICIES.find((p) => d.startsWith(p.drug.toLowerCase()));
}

export function indicationFor(c: PACase) {
  const policy = findPolicy(c.drug);
  const icd = (c.icd10Code || "").toUpperCase();
  return policy?.indications.find((i) => i.icd.some((p) => icd.startsWith(p)));
}

export function evaluateCase(c: PACase): PolicyResult {
  const policy = findPolicy(c.drug);
  const text: CaseText = {
    history: c.previousTreatments ?? "",
    justification: c.clinicalJustification ?? "",
    docs: c.documents ?? [],
    all: `${c.previousTreatments ?? ""} ${c.clinicalJustification ?? ""} ${(c.documents ?? []).join(" ")}`,
  };

  if (!policy) {
    return {
      drug: c.drug,
      indication: null,
      onLabel: false,
      criteria: [],
      documents: [{ name: "Clinical notes", present: text.docs.some((d) => NOTES.pattern.test(d)) }],
      score: 50,
      recommendation: "medical_director_review",
      summary: `No coverage policy is configured for ${c.drug}, so the case needs manual clinical review.`,
    };
  }

  const ind = indicationFor(c);
  if (!ind) {
    const covered = policy.indications.map((i) => i.label).join(", ");
    return {
      drug: policy.drug,
      indication: null,
      onLabel: false,
      criteria: [
        {
          id: "diagnosis",
          text: `Diagnosis is a covered indication (${covered})`,
          status: "not_met",
          evidence: `ICD-10 ${c.icd10Code || "not provided"} (${c.condition}) is not a covered indication for ${policy.drug}`,
          fix: "Confirm the diagnosis code, or submit a medical exception with supporting literature.",
        },
      ],
      documents: [],
      score: 10,
      recommendation: "medical_director_review",
      summary: `${c.condition} is not a covered indication for ${policy.drug} under this policy.`,
    };
  }

  const criteria: CriterionResult[] = [
    {
      id: "diagnosis",
      text: `Diagnosis is a covered indication (${ind.label})`,
      status: "met",
      evidence: `ICD-10 ${c.icd10Code} — ${c.condition}`,
      fix: "",
    },
    ...ind.criteria.map((cr) => ({ id: cr.id, text: cr.text, fix: cr.fix, ...cr.check(text) })),
  ];

  const documents = ind.documents.map((d) => ({ name: d.name, present: text.docs.some((f) => d.pattern.test(f)) }));

  const points = criteria.reduce((s, cr) => s + (cr.status === "met" ? 1 : cr.status === "unclear" ? 0.5 : 0), 0);
  const ratio = points / criteria.length;
  const score = Math.round(20 + 80 * ratio);
  const unmet = criteria.filter((cr) => cr.status !== "met");
  const recommendation = unmet.length === 0 ? "approve" : ratio >= 0.5 ? "request_information" : "medical_director_review";

  const summary =
    unmet.length === 0
      ? `All ${criteria.length} criteria for ${policy.drug} in ${ind.label} are met.`
      : `${criteria.length - unmet.length} of ${criteria.length} criteria met. Open: ${unmet.map((u) => u.text).join("; ")}.`;

  return { drug: policy.drug, indication: ind.label, onLabel: true, criteria, documents, score, recommendation, summary };
}

/** Illustrative formulary alternatives by indication key. */
export const ALTERNATIVES: Record<string, { drug: string; note: string }[]> = {
  ra: [
    { drug: "Adalimumab biosimilar (e.g. Hadlima, Hyrimoz)", note: "Preferred TNF blocker on many 2025 formularies; usually the first biologic step" },
    { drug: "Etanercept (Enbrel)", note: "TNF blocker, weekly injection" },
    { drug: "Tocilizumab (Actemra)", note: "IL-6 receptor blocker, an option after TNF blocker failure" },
    { drug: "Abatacept (Orencia)", note: "T-cell co-stimulation modulator, no JAK or TNF class risks" },
  ],
  crohns: [
    { drug: "Adalimumab biosimilar", note: "Same molecule at lower net cost; often preferred" },
    { drug: "Infliximab biosimilar (Inflectra, Renflexis)", note: "IV TNF blocker, weight-based dosing" },
    { drug: "Ustekinumab (Stelara) or biosimilar", note: "IL-12/23 inhibitor, option after TNF failure" },
    { drug: "Vedolizumab (Entyvio)", note: "Gut-selective integrin blocker" },
  ],
  psa: [
    { drug: "Adalimumab biosimilar", note: "Preferred TNF blocker" },
    { drug: "Secukinumab (Cosentyx)", note: "IL-17A inhibitor; also treats skin disease" },
    { drug: "Apremilast (Otezla)", note: "Oral PDE-4 inhibitor for milder disease" },
  ],
  pso: [
    { drug: "Adalimumab biosimilar", note: "Lowest-cost biologic step on many formularies" },
    { drug: "Ustekinumab biosimilar", note: "IL-12/23 inhibitor, dosing every 12 weeks" },
    { drug: "Secukinumab (Cosentyx)", note: "IL-17A inhibitor" },
    { drug: "Deucravacitinib (Sotyktu)", note: "Oral TYK2 inhibitor" },
  ],
  ad: [
    { drug: "Tacrolimus or pimecrolimus (topical)", note: "Step before a biologic on most policies" },
    { drug: "Tralokinumab (Adbry)", note: "IL-13 inhibitor" },
    { drug: "Lebrikizumab (Ebglyss)", note: "IL-13 inhibitor, monthly maintenance" },
  ],
  asthma: [
    { drug: "Mepolizumab (Nucala)", note: "Anti-IL-5, eosinophilic asthma" },
    { drug: "Benralizumab (Fasenra)", note: "Anti-IL-5 receptor, dosing every 8 weeks" },
    { drug: "Tezepelumab (Tezspire)", note: "Anti-TSLP, no eosinophil threshold" },
  ],
  t2d: [
    { drug: "Metformin", note: "First-line unless contraindicated" },
    { drug: "Empagliflozin (Jardiance) or dapagliflozin (Farxiga)", note: "SGLT2 inhibitors with heart and kidney benefits" },
    { drug: "Dulaglutide (Trulicity)", note: "Weekly GLP-1, often a preferred alternative" },
  ],
  nsclc: [
    { drug: "Pembrolizumab plus platinum chemotherapy", note: "If PD-L1 is below 50%" },
    { drug: "Atezolizumab (Tecentriq) or cemiplimab (Libtayo)", note: "Other first-line PD-(L)1 options for PD-L1-high disease" },
  ],
};
