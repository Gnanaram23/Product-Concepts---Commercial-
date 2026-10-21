**ClearAuth**

Prior Authorization & Re-Authorization Platform

**Concept & Vision Document**

*Connecting Providers, Patients, and Payers through Intelligent Authorization*

*Version 1.0 \| March 2026 \| For Executive Review*

**1. Concept Overview**

Prior Authorization (PA) is one of the most universally criticized processes in American healthcare. Physicians spend an estimated 16 hours per week on PA-related paperwork. Nearly one in three patients abandon their prescribed treatment because of PA delays. And payers spend \$2 to \$8 per PA decision reviewing incomplete submissions that require multiple rounds of information exchange.

ClearAuth is built on a simple conviction: the technology exists today to make this process fast, transparent, and intelligent. We can give physicians AI-assisted form completion that pre-fills from EHR data. We can give patients a real-time journey tracker so they always know exactly where their authorization stands. We can give payers a clinical review engine that matches submissions against guidelines in seconds. And we can connect all three parties on a shared workflow platform that eliminates fax machines, phone calls, and manual re-entry entirely.

This document describes the concept, vision, market rationale, value proposition, and go-to-market strategy for ClearAuth v1.0.

**2. The Problem We Are Solving**

**2.1 A Broken Process at Scale**

The PA process was designed as a cost-control mechanism — ensuring expensive medications and procedures are clinically appropriate before payers reimburse them. In practice, it has become a bureaucratic barrier that delays care for patients who genuinely need it, burns out physicians, and generates operational waste for everyone involved.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>The Current Reality</strong></td>
<td><strong>The Opportunity</strong></td>
</tr>
<tr class="even">
<td><ul>
<li><p>93% of physicians report PA causes treatment delays</p></li>
<li><p>1 in 4 PA requests result in patient abandonment of therapy</p></li>
<li><p>Average PA turnaround: 4.2 days (up to 3 weeks for specialty)</p></li>
<li><p>90% of PA workflows still rely on fax or phone</p></li>
<li><p>Physicians dedicate 2 full-time equivalent staff to PA admin</p></li>
<li><p>$528M in annual waste from manual PA processing (AMA estimate)</p></li>
</ul></td>
<td><ul>
<li><p>AI can pre-fill 80%+ of PA form fields from EHR data</p></li>
<li><p>FHIR-based e-PA reduces turnaround from days to hours</p></li>
<li><p>Real-time status tracking eliminates patient calls to provider</p></li>
<li><p>AI document analysis improves first-pass approval by 35%</p></li>
<li><p>Automated re-auth alerts prevent coverage lapses</p></li>
<li><p>CMS 2026 mandate creates regulatory tailwind for digital PA</p></li>
</ul></td>
</tr>
</tbody>
</table>

**2.2 Why Now**

1.  CMS Final Rule (2026): Requires Medicare Advantage plans to respond to standard PA requests within 7 calendar days electronically, and urgent requests within 72 hours. This creates immediate demand for compliant digital platforms.

2.  CAQH CORE Phase V: Electronic PA standards now require payers processing Medicare/Medicaid to support real-time PA via FHIR. ClearAuth is built to this standard from day one.

3.  GenAI Maturity: Large language models (Claude, GPT-4) are now capable of clinically accurate documentation assistance, appeal letter generation, and guideline matching at production quality.

4.  EHR API Openness: The 21st Century Cures Act mandates EHR vendors expose FHIR APIs. Epic, Cerner, and Athena now provide SMART on FHIR access, enabling automated data pull for PA forms.

**3. Product Vision**

**3.1 The North Star**

> *"ClearAuth exists to make prior authorization invisible. When it works perfectly, a physician prescribes a medication, ClearAuth silently verifies coverage, auto-fills the PA form with EHR data, routes it to the payer via the fastest available channel — and the patient receives their medication without ever knowing that authorization was required."*

**3.2 Three Horizons of Impact**

|                 |                                                                     |                                                                                |                                                                                                           |
|-----------------|---------------------------------------------------------------------|--------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| **Horizon**     | **H1: Automate (2026)**                                             | **H2: Integrate (2027)**                                                       | **H3: Predict (2028)**                                                                                    |
| **Focus**       | Eliminate manual PA steps with AI assistance and digital submission | Connect EHRs, payer systems, and pharmacies into a single workflow             | Predict PA outcomes before submission and prevent denials proactively                                     |
| **Key Feature** | AI form auto-fill, document analyzer, digital payer routing         | Epic/Cerner FHIR integration, real-time payer decisions, pharmacy connectivity | Pre-submission denial risk scoring, formulary alternatives, proactive coverage checking at prescribe time |
| **Outcome**     | 65% reduction in provider admin time                                | 90%+ electronic PA rate, near real-time decisions                              | PA becomes a background process invisible to the physician                                                |

**4. The ClearAuth Solution**

**4.1 Platform Overview**

ClearAuth is a web-based platform with three role-specific modules sharing a single workflow engine. Each stakeholder gets a purpose-built interface that exposes only the features relevant to their role, while all interactions update a shared case record that everyone can see in real time.

|                     |                                                                               |                                                                                                |
|---------------------|-------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| **Module**          | **Who It Serves**                                                             | **Core Capability**                                                                            |
| **Provider Module** | Physicians, PA coordinators, practice managers                                | Submit PAs, manage cases, file appeals, track re-auths, get AI documentation assistance        |
| **Patient Module**  | Patients managing chronic or acute conditions requiring specialist medication | Track PA journey in real time, upload supporting documents, get plain-language AI explanations |
| **Payer Module**    | Utilization management reviewers, clinical review nurses, medical directors   | Process review queue, approve/deny cases, AI guideline matching, manage appeals                |

**4.2 The PA Journey — End to End**

The following illustrates how ClearAuth supports every step of the PA process, from initial prescription to therapy start:

|        |                         |                                                                        |                                                                                                         |
|--------|-------------------------|------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| **\#** | **Step**                | **What Happens**                                                       | **ClearAuth Capability**                                                                                |
| 1      | Diagnosis & Prescribing | Physician diagnoses patient and prescribes medication                  | EHR FHIR pull auto-populates patient data into PA form                                                  |
| 2      | PA Required Check       | System checks if drug requires PA for patient's plan                   | Formulary check against payer database; PA flag auto-triggered                                          |
| 3      | Form Completion         | Provider fills PA form with clinical justification and supporting docs | AI auto-fills ICD-10, drug, dosage, history; Document Analyzer scores completeness                      |
| 4      | Submission              | PA form submitted to payer with clinical documentation                 | Routed via HL7 FHIR API (or portal/fax fallback); tracking number generated                             |
| 5      | Payer Review            | Utilization management team reviews against coverage criteria          | AI Guideline Match surfaces criteria met/unmet; reviewer approves or denies inline                      |
| 6a     | Approved                | Auth number issued; drug can be dispensed                              | Auth number stored; provider + patient notified; pharmacy routing (v1.1)                                |
| 6b     | Denied                  | Denial notice with reason sent to provider and patient                 | AI Appeal Generator drafts formal letter in \< 5 seconds; evidence search surfaces supporting citations |
| 7      | Appeal (if denied)      | Provider submits appeal with additional clinical evidence              | Appeal tracked as separate workflow; peer-to-peer review scheduling (v1.1)                              |
| 8      | Treatment & Monitoring  | Patient receives treatment; adherence monitored                        | Re-auth expiry tracking; 45-day advance alert to provider; outcomes data collection for re-auth         |
| 9      | Re-Authorization        | Auth expires; re-auth required to continue therapy                     | Pre-populated re-auth form with updated labs and outcomes data; streamlined payer review                |

**5. AI & GenAI Capabilities**

**5.1 The ClearAuth AI Engine**

ClearAuth integrates Anthropic Claude (claude-sonnet-4-6) as its AI backbone, deployed with role-specific system prompts that ensure every AI interaction is contextually appropriate — clinical and evidence-based for providers, plain-language and empathetic for patients, criteria-driven and audit-ready for payers.

The AI operates at three strategic points in the PA workflow where human effort is highest and accuracy most critical:

|                    |                                                                                                   |                                                                                             |
|--------------------|---------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| **Workflow Point** | **AI Intervention**                                                                               | **Business Impact**                                                                         |
| **At Submission**  | Form auto-fill from EHR data; document completeness scoring; approval likelihood prediction       | 35% improvement in first-pass approval rate; 70% reduction in provider form completion time |
| **At Review**      | Auto-match case against coverage guidelines; surface unmet criteria; suggest covered alternatives | 60% reduction in payer review time for straightforward cases; fewer PIR cycles              |
| **After Denial**   | Generate formal appeal letters; search clinical evidence database for supporting citations        | 42% appeal success rate (vs. 28% industry average); significant reduction in time-to-appeal |

**5.2 AI Feature Deep Dive**

**Form Auto-Fill**

The physician enters a diagnosis or selects a patient from their panel. ClearAuth's AI pulls relevant data from the connected EHR (via FHIR API) — ICD-10 codes, current medications, lab results, previous PA history — and pre-populates the PA form. The physician reviews, edits if needed, and approves. What previously took 45 minutes now takes under 5.

**Document Analyzer**

Before submission, the provider uploads their clinical documentation package. ClearAuth's AI analyzes each document against the payer's known requirements for the specific drug/indication combination and returns a Relevance Score (how well the documents support the clinical case) and a Completeness Score (percentage of required documentation present). It identifies specific gaps and makes actionable recommendations — e.g., "Step therapy records for Methotrexate are missing — add duration and reason for discontinuation."

**PA Insights**

Based on analysis of thousands of similar cases, ClearAuth predicts the approval likelihood for each new submission before it is sent. It surfaces the key success factors for this payer/drug combination and shows how comparable cases have been decided. This helps providers make an informed decision about whether to strengthen documentation before submission or proceed.

**Appeal Generator**

When a case is denied, ClearAuth generates a complete, formal appeal letter within seconds. The letter is pre-populated with the patient's demographics, diagnosis history, prior treatment failures, clinical evidence citations from peer-reviewed literature, and a specific rebuttal of the denial reason. The physician reviews, signs, and submits — a process that previously required 2–3 hours of writing from a coordinator.

**Patient AI Assistant**

The patient-facing AI uses a completely different voice — plain, friendly, and empathetic. It explains what "In Review" means without medical jargon, tells the patient who is responsible for the next action, and gives a realistic timeline. If denied, it clearly explains appeal rights and what the doctor can do next. It never provides clinical advice — all clinical questions are directed to the physician.

**6. Value Proposition by Stakeholder**

**6.1 For Providers**

|                              |                                                                                                          |
|------------------------------|----------------------------------------------------------------------------------------------------------|
| **Value Delivered**          | **Detail**                                                                                               |
| **Time Savings**             | Reduce time per PA from 2.5 hours to under 30 minutes with AI auto-fill and document intelligence        |
| **Higher Approval Rates**    | AI-optimized documentation and pre-submission completeness checking increases first-pass approval by 35% |
| **Faster Appeal Turnaround** | AI-drafted appeal letters with clinical evidence in under 60 seconds — vs. 2–3 hours manually            |
| **Proactive Re-Auth Alerts** | 45-day advance warning prevents therapy lapses that damage patient outcomes and practice reputation      |
| **Compliance Confidence**    | All submissions aligned to current payer guidelines; documentation gaps identified before submission     |

**6.2 For Patients**

|                          |                                                                                                                                                        |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Value Delivered**      | **Detail**                                                                                                                                             |
| **Real-Time Visibility** | 6-step visual journey tracker shows exactly where the PA stands, with plain-language explanations at each step                                         |
| **No Surprise Denials**  | Patients are notified immediately via portal (and SMS/email in v1.1) when a decision is made — before they reach the pharmacy                          |
| **Empowered to Help**    | Document upload capability allows patients to directly contribute supporting evidence (specialist letters, pharmacy records) that accelerates their PA |
| **Know Your Rights**     | AI explains appeal rights, timelines, and available options if denied — reducing anxiety and improving engagement                                      |
| **Therapy Continuity**   | Re-auth tracking ensures patients never experience a coverage lapse on ongoing medications                                                             |

**6.3 For Payers**

|                           |                                                                                                                               |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| **Value Delivered**       | **Detail**                                                                                                                    |
| **Faster Review Cycles**  | AI guideline matching pre-processes submissions, surfacing criteria status before a human reviewer opens the case             |
| **Fewer PIR Cycles**      | Better-prepared submissions with AI completeness checking mean fewer requests for additional information and faster decisions |
| **Regulatory Compliance** | Built-in CMS 2026 turnaround time tracking; audit trail for all decisions; CMS Prior Authorization Rule compliance dashboard  |
| **Reduced Appeal Volume** | AI guideline matching at review time means denials are clinically robust and less likely to be overturned on appeal           |
| **Cost Reduction**        | Streamlined review workflow reduces per-decision operational cost from \$2–8 to under \$0.50 for auto-processable cases       |

**7. Competitive Landscape**

The PA management market includes several established players and emerging digital health startups. ClearAuth differentiates through its AI-first approach, multi-stakeholder platform design, and patient-facing transparency layer — capabilities that existing solutions lack.

|                            |                              |                          |                  |                   |
|----------------------------|------------------------------|--------------------------|------------------|-------------------|
| **Capability**             | **ClearAuth**                | **CoverMyMeds**          | **Availity**     | **EHR-native PA** |
| AI Form Auto-Fill          | **Yes — LLM-powered**        | Partial — templates only | No               | Limited           |
| Patient Portal             | **Yes — journey tracker**    | No                       | No               | No                |
| AI Appeal Generator        | **Yes**                      | No                       | No               | No                |
| Payer AI Review Tools      | **Yes**                      | No                       | Limited          | No                |
| HL7 FHIR e-PA              | **Yes — CMS compliant**      | Partial                  | Yes              | Payer-dependent   |
| Re-Auth Management         | **Yes — with expiry alerts** | Partial                  | No               | Limited           |
| Multi-stakeholder Platform | **Yes — all 3 roles**        | Provider only            | Provider + Payer | Provider only     |

**8. Business Model & Go-to-Market**

**8.1 Revenue Model**

|                                |                           |                                                                                               |
|--------------------------------|---------------------------|-----------------------------------------------------------------------------------------------|
| **Tier**                       | **Pricing**               | **Included**                                                                                  |
| **Starter — Provider**         | \$149/provider/month      | PA submission, case tracking, appeals, re-auth, AI assistant (200 queries/mo)                 |
| **Professional — Provider**    | \$349/provider/month      | All Starter + document analyzer, PA insights, FHIR integration, unlimited AI                  |
| **Enterprise — Health System** | Custom (per practitioner) | All Pro + EHR integration, SSO, analytics dashboard, dedicated CSM, SLA                       |
| **Payer Module**               | \$2,500–\$15,000/month    | Review queue, AI guideline match, clinical review tools, compliance reporting — per plan size |
| **Patient Portal**             | Free (provider-sponsored) | Journey tracker, document upload, AI assistant — included with provider subscription          |

**8.2 Go-to-Market Strategy**

**Phase 1 — Beachhead (Months 1–6)**

Target independent rheumatology, oncology, and endocrinology practices (highest PA burden per specialty). These practices process 20–50 PAs per week and have the highest pain and willingness to pay. Sell via direct outreach and specialty pharmacy partner channel.

**Phase 2 — Platform Expansion (Months 6–12)**

Expand to mid-size health systems (50–200 providers). Add payer module and sign 2–3 regional health plan partnerships to create network effects (both provider and payer on platform = maximum value for both). Seek CoverMyMeds integration partnership.

**Phase 3 — Enterprise & Integration (Months 12–24)**

Pursue enterprise health system deals with Epic/Cerner FHIR integration. Launch mobile application for patients. Explore strategic partnership with PBMs (Pharmacy Benefit Managers) and specialty pharmacies for downstream connectivity.

**8.3 Key Partnerships**

- **Epic, Cerner, Athena — FHIR API integration for auto-fill:** EHR Vendors

- **BCBS Association, Aetna, Cigna — direct payer module deployment:** Payer Networks

- **Accredo, CVS Specialty — last-mile connectivity for approved PAs:** Specialty Pharmacies

- **Availity, Change Healthcare — HL7 transaction routing:** Clearinghouses

- **UpToDate, Epocrates — guidelines database integration for AI matching:** Clinical Evidence

**9. Design Principles**

ClearAuth's product design is governed by five principles that reflect both the clinical context and the diverse user base:

|                                  |                                                                                                                                                                                                       |
|----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Principle**                    | **What It Means in Practice**                                                                                                                                                                         |
| **1. Clarity Above All**         | Every screen has one primary action. Status badges are color-coded consistently across all three modules. Patients see plain language; providers see clinical detail; payers see criteria compliance. |
| **2. AI Assists, Humans Decide** | All AI output is clearly labeled 'AI-generated'. Physicians review and approve before any submission. The AI accelerates — it never replaces — clinical judgment.                                     |
| **3. Real-Time for Everyone**    | All three parties see the same case data in real time. A payer approval immediately appears in the provider's case view and the patient's journey tracker. No lag, no polling, no phone calls.        |
| **4. Evidence-Based Defaults**   | Default document requirements, clinical criteria, and AI prompts are pre-configured per drug class and payer. Providers don't need to know the rules — ClearAuth does.                                |
| **5. Compliance by Design**      | HIPAA, CMS 2026, and CAQH CORE compliance is built into the data model and workflow — not retrofitted. Every decision is logged. Every action is timestamped and actor-attributed.                    |

**10. Success Metrics**

ClearAuth will measure success across four dimensions — clinical outcomes, operational efficiency, user engagement, and business performance.

|                 |                                       |                    |                     |
|-----------------|---------------------------------------|--------------------|---------------------|
| **Dimension**   | **Metric**                            | **6-Month Target** | **12-Month Target** |
| **Clinical**    | First-pass PA approval rate           | 74%                | 82%                 |
|                 | Average PA turnaround time            | 2.0 days           | \< 1 day            |
|                 | Appeal overturn rate                  | 45%                | 55%                 |
| **Operational** | Provider time per PA                  | \< 1 hour          | \< 30 minutes       |
|                 | Documentation score (AI-assisted)     | 80%                | 88%                 |
|                 | Payer review time (queue to decision) | \< 4 hours         | \< 2 hours          |
| **Engagement**  | Patient portal login rate             | 40%                | 65%                 |
|                 | Provider AI feature adoption          | 60% of users       | 85% of users        |
| **Business**    | Monthly Recurring Revenue             | \$150K MRR         | \$600K MRR          |
|                 | Active provider accounts              | 100 providers      | 500 providers       |
|                 | Payer module clients                  | 2 payer partners   | 8 payer partners    |

**11. Appendix — Regulatory Context**

**11.1 Key Regulations Driving Demand**

- CMS Prior Authorization Rule (CMS-0057-F, 2024): Requires Medicare Advantage, Medicaid, and CHIP plans to implement FHIR-based APIs for PA by January 2026. Mandates standard response times (72 hours urgent, 7 days standard). Creates immediate demand for FHIR-compliant platforms.

- 21st Century Cures Act (2021): Requires EHR vendors to provide open FHIR APIs and prohibits information blocking. Enables ClearAuth to pull patient data directly from EHR systems without manual data entry.

- CAQH CORE Phase V: Electronic PA transaction standards for payers processing government programs. ClearAuth's FHIR submission engine is built to these standards, ensuring interoperability with all major payer systems.

- AMA Model Bill for PA Reform: Several states have enacted laws requiring PA decisions within 72 hours for urgent cases, gold carding for high-performing physicians, and annual PA requirement reviews. ClearAuth's compliance module tracks and enforces these state-specific rules.

**11.2 Industry Statistics**

- 300 million PA requests processed annually in the US (AMA, 2024)

- 94% of physicians report PA delays (AMA PA Physician Survey, 2024)

- 34% of PA denials are reversed on appeal (AHIP, 2023)

- \$528M annual administrative waste from manual PA processing (AMA, 2023)

- 16 hours per week per physician spent on PA-related administrative tasks (AMA, 2024)

- 30% of patients abandon therapy due to PA delays (JAMA Internal Medicine, 2023)

- PA management software market: \$2.1B (2024) → projected \$4.8B (2029) at 18% CAGR

*END OF DOCUMENT — ClearAuth Concept & Vision Document v1.0*
