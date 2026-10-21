type RoleResponses = Record<string, string>;

const PROVIDER_RESPONSES: RoleResponses = {
  clinical_doc: `**Clinical Documentation Generated**

**Patient:** John Smith | **DOB:** 01/15/1972 | **ID:** ATN-112233
**ICD-10 Auto-Pulled:** M05.79 — Rheumatoid Arthritis with involvement of multiple sites

---

**Prior Authorization Justification — Rinvoq (upadacitinib 15mg daily)**

Patient John Smith has been diagnosed with Rheumatoid Arthritis, moderate-to-severe (DAS28-CRP: 5.4), confirmed by rheumatologist evaluation, positive RF/anti-CCP antibodies, and elevated CRP (38 mg/L).

**Step Therapy Documentation:**
- Methotrexate 20mg weekly × 24 months — Inadequate response (DAS28 remained >3.2)
- Hydroxychloroquine 400mg daily × 12 months — Added to MTX, still inadequate response (ACR20 not achieved)

**Clinical Justification:**
Rinvoq (upadacitinib) is medically necessary due to: (1) failure of two csDMARDs at adequate doses and durations, (2) high disease activity with functional impairment (HAQ-DI: 1.8), (3) specialist rheumatology recommendation per ACR 2024 guidelines.

**Documents Attached:**
- ✓ DAS28-CRP disease activity score
- ✓ Step therapy records (MTX + HCQ)
- ✓ Specialist rheumatology note
- ✓ Anti-CCP and RF lab results
- ⚠ CBC with differential (recommended within 90 days)`,

  evidence_search: `**Evidence Search Results — Rinvoq (upadacitinib) for Rheumatoid Arthritis**

---

**Supporting Clinical Evidence Found:**

**1. SELECT-COMPARE Trial (NEJM, 2019)**
*"Upadacitinib vs. adalimumab in patients with RA and an inadequate response to methotrexate"*
- Rinvoq demonstrated superior ACR50 response vs. adalimumab at 26 weeks
- 72% ACR20 response rate; statistically significant vs. comparator (p<0.001)
- Low disease activity achieved in 48% of patients

**2. ACR Guidelines 2024**
*American College of Rheumatology — RA Treatment Guidelines*
- JAK inhibitors (including upadacitinib) recommended after csDMARD failure
- Step therapy: MTX → ≥1 additional csDMARD → biologic or JAK inhibitor

**3. Payer-Specific Requirements (Aetna)**
Per Aetna policy ATN-RA-2024, documentation must show:
- ≥ 2 csDMARDs tried and failed (e.g., methotrexate + hydroxychloroquine)
- Intolerance or inadequate response documented at adequate dose/duration
- DAS28 > 3.2 or equivalent disease activity measure

**Recommendation:** Include ACR DAS28 score and specialty consultation note to strengthen the case. Current documentation scores 82% — adding specialist letter increases approval likelihood by ~23%.`,

  appeal_gen: `**Formal Appeal Letter — Generated**

---

[Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}]

Dear Medical Director,
Aetna Better Health Prior Authorization Appeals Department

I am writing to formally appeal the denial of prior authorization for **Rinvoq (upadacitinib 15mg daily)** for my patient **John Smith** (DOB: 01/15/1972, Member ID: ATN-112233).

**Denial Reference:** Case PA-127904
**Stated Reason:** "Not medically necessary based on provided documentation"

**Clinical Background:**
Mr. Smith has been diagnosed with Rheumatoid Arthritis, moderate-to-severe (ICD-10: M05.79), confirmed by rheumatologist evaluation, positive RF/anti-CCP antibodies, and elevated CRP (38 mg/L). His DAS28-CRP score of 5.4 reflects high disease activity with significant functional impairment (HAQ-DI: 1.8).

**Step Therapy Completed:**
1. Methotrexate 20mg weekly × 24 months — Inadequate response (DAS28 remained >3.2)
2. Hydroxychloroquine 400mg daily × 12 months — Combined with MTX, still inadequate

**Clinical Evidence:**
The SELECT-COMPARE trial (NEJM 2019) demonstrated Rinvoq's superior efficacy vs. adalimumab in patients with inadequate MTX response. ACR 2024 guidelines explicitly support JAK inhibitors after failure of ≥2 csDMARDs.

I respectfully request reconsideration and am available for a peer-to-peer review.

Respectfully,
**Dr. Sarah Mitchell, MD**
NPI: 1234567890 | Tel: (555) 100-2000`,

  pa_insights: `**AI-Powered PA Insights — Case PA-127904**

---

**Approval Likelihood: 78%** 🟢 HIGH

**Average Processing Time:** 3.2 days (similar RA cases at Aetna)
**Documentation Score: 82%** — Good, improving to 94% with additional docs

---

**⚡ Key Success Factors for This Case:**
- Detailed clinical documentation with ICD-10 codes ✓
- Previous treatment failure evidence — MTX + HCQ documented ✓
- Specialist rheumatology note attached ✓
- Objective disease severity measures (DAS28) ✓

**→ Recommendations to Increase Approval Rate:**
- Include recent lab results showing active disease (CRP, ESR, CBC)
- Add documentation of functional impairment (HAQ-DI score)
- Attach pharmacy records confirming medication compliance
- Submit any prior specialist consultation notes

**🔍 Similar Cases Analysis:**
Analysis of 247 similar RA cases with upadacitinib shows that including functional impairment documentation increases approval rates by ~35%. Aetna typically approves within 2 business days when step therapy is fully documented.`,

  summarise_docs: `**Clinical Document Summary**

---

**Documents Reviewed:** Clinical Notes, Lab Results, Step Therapy Records

**Diagnosis:** Rheumatoid Arthritis, moderate-to-severe (M05.79)
**Disease Activity:** DAS28-CRP 5.4 — High
**Functional Status:** HAQ-DI 1.8 — Moderate-to-severe impairment

**Step Therapy Timeline:**
• Methotrexate 20mg QW — 24 months — Inadequate response
• Hydroxychloroquine 400mg QD — 12 months — Inadequate combined response

**Key Lab Values:**
• CRP: 38 mg/L (elevated, normal <5)
• RF: Positive (1:320)
• Anti-CCP: Positive (>250 U/mL)
• CBC: Within normal limits

**PA Readiness Score: 82%**
Missing: Recent CBC within 90 days, spirometry for biologic safety screening.

**Recommendation:** Submit CBC and consider adding functional assessment scores before submitting. Current documentation strongly supports medical necessity.`,

  what_documents: `**Documents Required for Prior Authorization**

---

**For Rinvoq (RA) — Aetna Standard Requirements:**

**Required Documents:**
- ✓ Completed PA request form with ICD-10 code (M05.79)
- ✓ Physician office notes documenting RA diagnosis
- ✓ Step therapy records (MTX + at least 1 other csDMARD)
- ✓ Disease activity score (DAS28, CDAI, or SDAI)
- ✓ Lab results: RF, anti-CCP, CRP/ESR within 6 months
- ✓ Specialist rheumatology consultation note

**Recommended (Increases Approval Rate):**
- CBC with differential within 90 days
- HAQ-DI functional assessment score
- Pharmacy records confirming prior medication compliance
- Spirometry or pulmonary clearance note

**Optional but Helpful:**
- Patient's response journals documenting symptom history
- Radiology reports showing joint damage progression

**Tip:** All documents can be uploaded directly in ClearAuth. The system auto-analyzes them for completeness before submission.`,

  appeal: `**How to File an Appeal — Step-by-Step**

---

**Your Denied Case: PA-127904 — Rinvoq**

**Step 1: Internal Appeal (Most Common First Step)**
- File within 60 days of the denial date
- Success rate: ~42% overall, ~58% with peer-to-peer
- Timeline: Standard 30 days, Urgent 72 hours
- Use the "File Appeal" button in ClearAuth → Appeals page

**Step 2: Peer-to-Peer Review (Most Effective)**
- Call Aetna provider relations: 1-800-AETNA-PA
- Request a physician-to-physician review
- Success rate: ~62% when specialist is involved
- Prepare: clinical evidence summary, DAS28 score, step therapy records

**Step 3: External Independent Review**
- Triggered automatically if internal appeal is denied
- Success rate: ~35%
- Binding decision — insurer must comply

**What to Include in Your Appeal:**
1. Step therapy documentation (24 months MTX + 12 months HCQ)
2. Current DAS28 score (5.4)
3. ACR 2024 guideline reference
4. SELECT-COMPARE trial citation

Would you like me to generate a formal appeal letter now?`,

  why_denied: `**Denial Analysis — Case PA-127904**

---

**Denial Reason:** "Not medically necessary based on provided documentation"

**Root Cause Analysis:**
The denial was triggered because Aetna's automated review system flagged incomplete step therapy documentation. Specifically:

**What Was Missing:**
- Step therapy documentation was present but lacked specific duration records
- No functional impairment score (HAQ-DI) was submitted
- Specialist letter referenced but not attached in original submission

**How to Fix:**
1. **Add duration records** — document exact start/end dates for MTX and HCQ
2. **Attach HAQ-DI score** — shows functional impact, critical for medical necessity
3. **Upload specialist letter** — rheumatologist must co-sign the medical necessity statement
4. **Re-submit as appeal** — include SELECT-COMPARE trial reference

**Predicted Outcome After Correction:** 
With these additions, approval likelihood increases from 42% to 78%.

Would you like me to draft the appeal letter with these corrections included?`,
};

const PATIENT_RESPONSES: RoleResponses = {
  treatment_explain: `**Understanding Your Medication — Humira (adalimumab)**

---

**What is Humira in plain language?**
Humira is a "biologic" medicine — a special type of treatment made from living cells. It works by blocking a protein in your immune system called TNF-alpha that's causing inflammation in your body. It's used for conditions like asthma, Crohn's disease, psoriasis, and arthritis.

**Why Does Your Doctor Want This Medication?**
Your doctor (Dr. Sarah Mitchell) has determined that Humira is the right treatment for your condition after trying other medications first. Prior authorization is required because your insurance needs to confirm this is medically appropriate before they'll cover it.

**What is Prior Authorization?**
Prior authorization (PA) is your insurance company's review process for certain medications. They check:
- Is this medication medically necessary for your specific condition?
- Has your doctor followed required "step therapy" (trying less expensive treatments first)?
- Does this medication meet their coverage guidelines?

**What Happens After Approval?**
Once approved, you'll get an authorization number. You can take this to any in-network pharmacy and they'll be able to fill your prescription. Coverage usually begins within 24 hours of approval.

**Need Help?** Talk to Dr. Mitchell's office or call BlueCross at 1-888-382-8888.`,

  pa_status: `**What Your "In Review" Status Means**

---

**Your Case: PA-554089 — Humira**
**Current Status: Under Clinical Review** 🔵

**In simple terms:** A medical professional at your insurance company is currently reading your doctor's notes and deciding if Humira is the right medication for you.

**Who is reviewing it?**
A clinical reviewer — usually a nurse, pharmacist, or doctor — at BlueCross Health is evaluating your case against their coverage guidelines.

**How long will this take?**
- Standard review: 3–5 business days
- Your case was submitted April 4, 2025
- Expected decision: **April 9–11, 2025**

**What will happen next?**
- **If approved:** Your doctor gets an authorization number and calls you. You can pick up your medication right away.
- **If more info needed:** BlueCross may ask your doctor for additional records (1–2 more days)
- **If denied:** Your doctor can file an appeal. About 58% of appeals are successful.

**How do you check your status?**
- Log into BlueCross member portal
- Call member services: 1-888-382-8888
- Or check this app — your status updates automatically!

**Don't worry** — being "In Review" is completely normal and doesn't mean anything is wrong.`,

  side_effects: `**Humira Side Effects — What to Watch For**

---

**Common Side Effects (Happen to Many People):**
- 💉 Injection site reactions — redness, itching, or mild swelling where you inject. Usually goes away in a few hours.
- 🤧 Cold symptoms — runny nose, sore throat, mild cough
- 🤕 Mild headaches
- 😴 Feeling more tired than usual

These are normal and usually mild. Most people get used to them after the first few injections.

---

**Warning Signs — Call Your Doctor If You Notice:**
- 🌡 Fever over 100.4°F (38°C) — Humira affects your immune system
- 💊 Any signs of infection that don't improve
- 🩹 Unusual bruising or bleeding
- 😮‍💨 Chest pain or trouble breathing

---

**🚨 Go to the ER or Call 911 If:**
- Severe allergic reaction — difficulty breathing, face/throat swelling, hives spreading rapidly
- Sudden numbness or weakness on one side of your body
- Severe stomach pain
- Signs of a serious infection: high fever with chills, confusion

---

**Important Rules While on Humira:**
- No live vaccines (ask your doctor before any vaccinations)
- Tell all your healthcare providers you're taking Humira
- Continue other medications your doctor prescribed unless told otherwise

**Questions?** Call Dr. Mitchell's office at any time.`,

  how_long: `**PA Processing Times Explained**

---

**Your Case (PA-554089):**
- **Submitted:** April 4, 2025
- **Expected Decision:** April 9–11, 2025 (3–5 business days)

---

**What Affects How Long It Takes:**

**Things that speed it up ✅**
- All documents submitted correctly the first time
- Your doctor marked the request as "urgent" (if medically needed)
- Routine cases with clear medical necessity

**Things that cause delays ⚠️**
- Missing documentation (insurance asks for more info)
- Submission at end of week (may delay to following week)
- Complex cases requiring specialist medical review

---

**What You Can Do:**
- **Check your status here** — the portal updates in real time
- **Call BlueCross:** 1-888-382-8888 for status updates
- **Talk to Dr. Mitchell's office** — they can follow up with the insurance company directly

**If the decision takes longer than expected:**
Ask Dr. Mitchell's office to call and request an expedited review, especially if the delay is affecting your health.`,

  what_if_denied: `**What Happens If Your PA Is Denied?**

---

**First — Don't Panic!** Denials happen often and are frequently overturned on appeal.

---

**Step 1: Internal Appeal**
Your doctor will file a formal appeal explaining why you need this medication. **Success rate: ~42–58%**

This is done for you automatically — Dr. Mitchell's office handles this.

**Step 2: Peer-to-Peer Review**
Dr. Mitchell speaks directly with BlueCross's physician to explain your case.
**Success rate: ~58–62%** — this is often the most effective step.

**Step 3: External Review**
An independent medical organization reviews your case. Their decision is legally binding.
**Success rate: ~35%**

---

**Your Rights:**
- You must receive a written explanation of the denial
- You have the right to see all clinical records used to make the decision
- You can submit additional medical evidence at any point
- Appeals must be reviewed within 30 days (standard) or 72 hours (urgent)

---

**In the Meantime:**
- Ask Dr. Mitchell about a "bridge prescription" — samples or alternative coverage while you appeal
- Check if a patient assistance program is available for your medication
- Some pharmacies offer short-term supply while appeals are processed

**You're not alone in this process — your care team at ClearAuth is tracking your case.**`,

  explain_medication: `**About Your Medication — Plain Language Guide**

---

**Humira (adalimumab)** is a biologic medication used to treat inflammatory conditions. Your doctor chose this because it targets the specific cause of your condition.

**How It Works:**
Your immune system creates a protein called TNF-alpha that causes inflammation. Humira blocks this protein, reducing inflammation and the damage it causes to your body.

**How You Take It:**
- Injected under the skin (subcutaneous injection)
- Every 2 weeks for most conditions
- You can learn to inject it yourself at home (your doctor's nurse will teach you)
- Keep it refrigerated — remove 30 minutes before injecting

**How Long Until It Works:**
- Some improvement: 2–4 weeks
- Full effect: 3–6 months
- Your doctor will monitor you with lab tests every few months

**Cost Without Insurance:**
Humira costs approximately $6,000–$7,000/month without insurance. With your BlueCross coverage, your cost will typically be a $50–$150 copay per prescription (or possibly free with copay assistance programs).

**Patient Assistance:** The manufacturer offers a copay card at humira.com — this can reduce your out-of-pocket cost to as little as $5/month even with insurance.`,
};

const PAYER_RESPONSES: RoleResponses = {
  clinical_review: `**Coverage Policy Analysis — BlueCross Health**

---

**Policy:** BCH-SPECIALTY-2024-RA | Biologic Therapy for Rheumatoid Arthritis
**Case Under Review:** PA-554089 | Drug: Humira (adalimumab)

---

**Required Criteria Checklist:**

✅ **Criteria Met:**
- Diagnosis of moderate-to-severe RA (DAS28 > 3.2) — *Confirmed*
- Positive RF or anti-CCP antibody test — *Documented*
- Current treatment with MTX or contraindication — *Confirmed (24 months)*
- Specialist rheumatology note — *Attached*

⚠️ **Criteria Partially Met:**
- Step therapy: MTX documented, second csDMARD not clearly stated — *Request clarification*

❌ **Criteria NOT Met:**
- Eosinophil count (required for biologic safety screening) — *Missing*
- Spirometry or pulmonary function test — *Missing*

---

**Recommended Action:**
Request additional documentation from the provider:
1. Second csDMARD trial records (hydroxychloroquine or leflunomide)
2. CBC with differential within 90 days (for safety screening)
3. Pulmonary function or chest X-ray

**Suggested Status:** Additional Information Requested (AIR)`,

  guideline_match: `**Guideline Match Analysis**

---

**Case:** PA-554089 | Humira for Rheumatoid Arthritis
**Policy:** BCH-RA-BIOLOGIC-2024

---

**Coverage Criteria Review:**

✅ ICD-10 code M05.79 matches covered indication
✅ Prescriber is a licensed rheumatologist (specialty verified)
✅ MTX step therapy documented — 24 months confirmed
✅ DAS28-CRP 5.4 exceeds threshold for biologic eligibility (>3.2)
✅ Diagnosis confirmed ≥ 6 months ago

⚠️ **Gaps Identified:**
- Second csDMARD trial not explicitly documented in uploaded records
- CBC with differential not included (required within 90 days per BCH-BIOLOGIC-SAFETY-001)

---

**Match Score: 78/100** — Likely to Approve with Additional Documentation

**Recommendation:** Contact provider to submit second csDMARD records and recent CBC. Once received, case qualifies for approval under BCH policy.

**Alternative:** If provider confirms oral step therapy is contraindicated, policy allows biologic approval with single csDMARD + contraindication documentation.`,

  alt_suggest: `**Alternative Medications for Rheumatoid Arthritis — Formulary Analysis**

---

**Case:** PA-554089 | Requested: Humira (adalimumab)
**Formulary Status:** Tier 3 — Specialty (PA Required)

---

**Tier 1 — Preferred (Lowest Member Cost):**
1. **Methotrexate** — $10–15/month
   - First-line RA therapy, BCH prefers as initial treatment
   - Requires LFT monitoring

2. **Hydroxychloroquine** — $15/month (generic)
   - Combined with MTX as step therapy
   - Annual eye exam required

**Tier 2 — Non-Preferred:**
3. **Leflunomide** — $40–60/month
   - Alternative csDMARD if MTX not tolerated
   - Patient has documented MTX/HCQ failure

**Tier 3 — Specialty Biologics (All Require PA):**
4. **Enbrel (etanercept)** — Preferred biologic, lower cost
5. **Humira (adalimumab)** — Requested, Tier 3 formulary
6. **Orencia (abatacept)** — Alternative MOA, favorable for certain comorbidities

**Recommendation:** Humira is appropriate given documented csDMARD failure. Approve pending receipt of CBC and second csDMARD records. If cost optimization needed, offer Enbrel as preferred biologic alternative.`,

  denial_letter: `**AI-Drafted Denial Letter**

---

[Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}]

Dear Dr. Sarah Mitchell,

This letter is to inform you that BlueCross Health has conducted a review of the prior authorization request for **Humira (adalimumab)** for patient **John Smith** (Member ID: BCH-789011).

**Determination:** Additional Information Required

**Reason for Determination:**
Upon clinical review, the submitted documentation does not fully satisfy BlueCross Health policy BCH-RA-BIOLOGIC-2024 due to the following:

1. **Step Therapy Gap:** While methotrexate use is documented (24 months), records for a second conventional synthetic DMARD (csDMARD) are not included in the submitted documentation.

2. **Safety Screening:** A CBC with differential within the past 90 days is required per BCH Biologic Safety Policy (BCH-BIOLOGIC-SAFETY-001). This was not included in the submitted documents.

**Next Steps:**
To complete our review, please submit:
- Documentation of a second csDMARD trial (hydroxychloroquine, leflunomide, or other)
- Recent CBC with differential (within 90 days)

Please submit additional documentation within **14 days** to avoid automatic denial.

Sincerely,
**BlueCross Health Prior Authorization Department**
Reference: BCH-PA-2025-554089`,

  match_guidelines: `**Coverage Policy Match — Checking All Criteria**

---

**Drug:** Humira (adalimumab) — **Indication:** Rheumatoid Arthritis
**Member:** John Smith | **Plan:** BlueCross PPO Gold

---

**BCH Policy BCH-RA-BIOLOGIC-2024 Checklist:**

| Criterion | Status | Notes |
|-----------|--------|-------|
| Active RA diagnosis (ICD-10 M05-M06) | ✅ Met | M05.79 confirmed |
| DAS28 > 3.2 or equivalent | ✅ Met | DAS28-CRP: 5.4 |
| Prescriber is rheumatologist | ✅ Met | Specialty verified |
| MTX trial ≥ 3 months | ✅ Met | 24 months documented |
| Second csDMARD trial | ⚠️ Incomplete | Records missing |
| Safety labs (CBC, LFTs) | ❌ Missing | Required within 90 days |
| No active infection or TB | ✅ Met | Negative screening |

**Overall Match: 71%**

**Policy Decision:** Cannot approve without second csDMARD records and safety labs. Recommend sending AIR (Additional Information Request) to provider with 14-day response deadline.`,

  review_case: `**AI-Assisted Case Review — PA-554089**

---

**Case Summary:**
- **Patient:** John Smith, DOB 01/15/1972
- **Drug:** Humira (adalimumab 40mg every 2 weeks)
- **Condition:** Rheumatoid Arthritis (M05.79), high disease activity
- **Prescriber:** Dr. Sarah Mitchell (Rheumatology, NPI: 1234567890)

**Documentation Analysis:**
- Clinical notes: Complete ✅
- Step therapy (MTX, 24 months): Documented ✅
- Lab results (CRP, RF, anti-CCP): Present ✅
- DAS28 score (5.4): Documented ✅
- Second csDMARD: NOT found in submitted records ⚠️
- Safety labs (CBC): NOT found ❌

**AI Risk Score:** Low risk for adverse outcome
**Coverage Match:** 71% — Additional information needed

**Recommended Action:**
Send AIR (Additional Information Request) to Dr. Mitchell requesting:
1. Second csDMARD records
2. CBC with differential within 90 days

**Estimated Resolution:** 2–3 business days after document submission`,

  process_faster: `**How to Process Cases Faster — AI Recommendations**

---

**Current Queue Status:**
- Pending Reviews: ${Math.floor(Math.random() * 5) + 3} cases
- Average Processing: 1.8 days
- Approaching Deadline: 2 urgent cases

---

**Top Strategies to Reduce Processing Time:**

**1. Use AI Pre-Screening (60% time savings)**
Let ClearAuth AI pre-check all submitted documentation before it reaches a reviewer. Cases that pass pre-screening can be approved in minutes.

**2. Set Up Automated AIR Requests**
When documentation is incomplete, automatically send template requests to providers instead of manually drafting letters. This alone saves 45 minutes per case.

**3. Prioritize by Risk Score**
Use AI-generated risk scores to prioritize high-complexity cases for senior reviewers and route routine cases to junior staff.

**4. Enable Real-Time FHIR Integration**
Connect with EHR systems to pull patient data automatically — eliminating 70% of document requests.

**5. Batch Similar Cases**
Group similar drug/diagnosis combinations for review — reviewers become faster on repeated case types.

**Projected Impact:** Implementing all 5 strategies reduces average processing time from 1.8 days to 0.4 days.`,
};

const GENERAL_RESPONSES: Record<string, string> = {
  hello: `👋 Hi! I'm the ClearAuth AI Assistant. I'm here to help streamline your prior authorization process.

How can I help you today? You can ask me about:
- Case status and processing times
- Documentation requirements
- Prior authorization guidelines
- Coverage criteria and policies
- Appeal processes

Or select a feature from the sidebar to get started.`,

  default: `I'm the ClearAuth AI Assistant. I can help with prior authorization questions, documentation guidance, and case management.

Could you be more specific about what you need? For example:
- "What documents do I need for a Humira PA?"
- "How do I appeal a denial?"
- "How long does a review take?"

Or select a feature from the sidebar for guided assistance.`,
};

export function getAIResponse(feature: string, message: string, role = 'provider'): { response: string; feature: string } {
  const lower = message.toLowerCase();

  const roleMap: Record<string, RoleResponses> = {
    provider: PROVIDER_RESPONSES,
    patient: PATIENT_RESPONSES,
    payer: PAYER_RESPONSES,
  };
  const roleResponses = roleMap[role] ?? PROVIDER_RESPONSES;

  let matchedFeature = feature;

  if (matchedFeature && matchedFeature !== "general" && roleResponses[matchedFeature]) {
    return { response: roleResponses[matchedFeature], feature: matchedFeature };
  }

  if (role === 'provider') {
    if (lower.includes("appeal") || lower.includes("denied") || lower.includes("why denied") || lower.includes("denial")) matchedFeature = "appeal_gen";
    else if (lower.includes("evidence") || lower.includes("literature") || lower.includes("trial")) matchedFeature = "evidence_search";
    else if (lower.includes("likelihood") || lower.includes("insight") || lower.includes("predict") || lower.includes("chance")) matchedFeature = "pa_insights";
    else if (lower.includes("summary") || lower.includes("summarise") || lower.includes("summarize")) matchedFeature = "summarise_docs";
    else if (lower.includes("what document") || lower.includes("which document") || lower.includes("need to submit") || lower.includes("required")) matchedFeature = "what_documents";
    else if (lower.includes("appeal") || lower.includes("file appeal") || lower.includes("how to appeal")) matchedFeature = "appeal";
    else if (lower.includes("clinical") || lower.includes("generate") || lower.includes("doc")) matchedFeature = "clinical_doc";
    else if (lower.includes("why") && lower.includes("deny")) matchedFeature = "why_denied";
  } else if (role === 'patient') {
    if (lower.includes("status") || lower.includes("mean") || lower.includes("what does") || lower.includes("in review")) matchedFeature = "pa_status";
    else if (lower.includes("side effect") || lower.includes("watch out") || lower.includes("dangerous")) matchedFeature = "side_effects";
    else if (lower.includes("how long") || lower.includes("when") || lower.includes("timeline") || lower.includes("how many days")) matchedFeature = "how_long";
    else if (lower.includes("what if") || lower.includes("denied") || lower.includes("appeal") || lower.includes("rights")) matchedFeature = "what_if_denied";
    else if (lower.includes("explain") || lower.includes("what is") || lower.includes("medication") || lower.includes("humira") || lower.includes("drug")) matchedFeature = "explain_medication";
    else if (lower.includes("treatment") || lower.includes("why") || lower.includes("need")) matchedFeature = "treatment_explain";
    else if (lower.includes("cost") || lower.includes("copay") || lower.includes("pay")) matchedFeature = "explain_medication";
  } else if (role === 'payer') {
    if (lower.includes("guideline") || lower.includes("criteria") || lower.includes("match") || lower.includes("policy")) matchedFeature = "guideline_match";
    else if (lower.includes("alternative") || lower.includes("formulary") || lower.includes("covered") || lower.includes("tier")) matchedFeature = "alt_suggest";
    else if (lower.includes("denial") || lower.includes("letter") || lower.includes("draft")) matchedFeature = "denial_letter";
    else if (lower.includes("review") || lower.includes("clinical") || lower.includes("analyse") || lower.includes("analyze")) matchedFeature = "clinical_review";
    else if (lower.includes("faster") || lower.includes("speed") || lower.includes("process") || lower.includes("queue")) matchedFeature = "process_faster";
    else if (lower.includes("check") || lower.includes("criteria") || lower.includes("does it match")) matchedFeature = "match_guidelines";
    else if (lower.includes("summary") || lower.includes("summarise") || lower.includes("case")) matchedFeature = "review_case";
  }

  if (lower.includes("hello") || lower.includes("hi ") || lower === "hi" || lower.includes("help")) {
    matchedFeature = "hello";
    return { response: GENERAL_RESPONSES.hello, feature: matchedFeature };
  }

  const response = roleResponses[matchedFeature] ?? GENERAL_RESPONSES.default;
  return { response, feature: matchedFeature };
}
