**ClearAuth**

Prior Authorization & Re-Authorization Platform

**Product Requirements Document (PRD)**

*Version 1.0 \| March 2026 \| Public concept*

*Document Owner: Product Team \| Status: Concept draft*

**Document Information**

|                          |                                                                      |
|--------------------------|----------------------------------------------------------------------|
| **Document Information** |                                                                      |
| **Product Name**         | ClearAuth — PA/RA Platform                                           |
| **Version**              | 1.0 (MVP)                                                            |
| **Date**                 | March 2026                                                           |
| **Status**               | Concept draft                                                        |
| **Author**               | Product Management Team                                              |
| **Stakeholders**         | Engineering, Clinical Operations, Compliance, Sales                  |
| **Target Audience**      | Providers (Physicians/Coordinators), Patients, Payers (Health Plans) |

**1. Executive Summary**

ClearAuth is a cloud-based, AI-augmented Prior Authorization (PA) and Re-Authorization (RA) platform designed to eliminate the administrative friction that delays patient access to medication and specialist care. The platform connects three stakeholder groups — Providers, Patients, and Payers — on a single workflow engine, enabling real-time submission, intelligent document verification, automated routing, and outcome tracking.

The United States healthcare system processes over 300 million PA requests annually. Studies show that 94% of physicians report PA delays, with average turnaround times of 4–7 business days for routine requests and up to 3 weeks for specialty medications. ClearAuth targets a 65% reduction in administrative burden and a 35% improvement in first-pass approval rates through GenAI-assisted form completion, clinical evidence matching, and predictive approval analytics.

This PRD defines the functional requirements, user stories, system architecture, business logic, success metrics, and release plan for ClearAuth v1.0 (MVP).

**2. Problem Statement**

**2.1 Current State Challenges**

Prior Authorization is universally recognized as one of the most burdensome processes in US healthcare. The following pain points are documented across all stakeholder groups:

|                 |                                                                                                                                                  |                                                                                             |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| **Stakeholder** | **Pain Point**                                                                                                                                   | **Business Impact**                                                                         |
| **Provider**    | Manual PA form completion via fax/portal takes 2–3 hours per case. Step therapy documentation is frequently incomplete, causing denials.         | Physician burnout, delayed patient care, revenue leakage from non-reimbursed time           |
| **Patient**     | No visibility into PA status. Patients learn of denials only when arriving at pharmacy. No understanding of what documentation is needed.        | Therapy abandonment (up to 30%), adherence failures, patient dissatisfaction                |
| **Payer**       | Manual clinical review of incomplete submissions. High volume of information requests (PIR) and first-pass denials that generate costly appeals. | Operational cost \$2–8 per PA decision, high re-work volume, appeal administration overhead |

**2.2 Market Opportunity**

- PA management software market: \$2.1B in 2024, projected \$4.8B by 2029 (CAGR 18%)

- 90% of PA workflows still involve fax or phone as primary channel

- CAQH CORE regulations (2024) mandating electronic PA create immediate market demand

- CMS rules requiring real-time PA decisions for Medicare Advantage plans by 2026

**3. Product Vision & Goals**

**3.1 Vision Statement**

*ClearAuth exists to make prior authorization invisible. When it works perfectly, a physician prescribes a medication, ClearAuth silently verifies coverage, populates the PA form with EHR data, routes it to the payer via the fastest available channel, and the patient receives their medication without knowing authorization was ever required.*

**3.2 Strategic Goals**

1.  Reduce PA processing time from 4.2 days (industry average) to under 24 hours for standard requests

2.  Achieve 85%+ documentation completeness rate on first submission using AI assistance

3.  Enable patients to track PA status in real-time with plain-language status explanations

4.  Auto-route submissions via HL7 FHIR for payers supporting electronic exchange

5.  Generate AI-drafted appeal letters within 60 seconds of denial notification

6.  Support re-authorization workflows with 45-day advance expiry alerts

**3.3 Success Metrics (KPIs)**

|                                        |              |                       |                        |
|----------------------------------------|--------------|-----------------------|------------------------|
| **KPI**                                | **Baseline** | **Target (6 months)** | **Target (12 months)** |
| Average PA Processing Time             | 4.2 days     | 2.0 days              | \< 1 day               |
| First-Pass Approval Rate               | 62%          | 74%                   | 82%                    |
| Documentation Score (AI-assisted)      | 68%          | 80%                   | 88%                    |
| Provider Time per PA                   | 2.5 hrs      | 1.0 hr                | \< 30 min              |
| Patient Engagement (portal login rate) | N/A          | 40%                   | 65%                    |
| Payer Decision Time (FHIR channel)     | 4.2 days     | \< 4 hrs              | Real-time              |

**4. User Personas**

**4.1 Provider — Dr. Sarah Mitchell (Physician)**

A practicing physician or their PA coordinator responsible for initiating PA requests, gathering clinical evidence, managing denials, and tracking re-authorizations across a panel of patients.

**Goals**

- Submit PA in under 10 minutes with AI auto-fill from EHR

- Know instantly which documents are missing before submission

- Receive proactive alerts for upcoming re-auth expirations

- Generate appeal letters automatically when a case is denied

**Frustrations**

- Spends 2+ hours per PA manually locating clinical notes and lab results

- Learns about denials only after patients call in

- Step therapy requirements differ by payer and change without notice

**4.2 Patient — Robert Brown**

A patient managing a chronic condition requiring specialist medication. Often anxious about whether their insurance will cover their prescription and confused by the PA process.

**Goals**

- Understand where my authorization is in the process, in plain language

- Know exactly what documents my doctor needs from me

- Get notified immediately when approved or denied

- Understand my appeal rights if denied

**Frustrations**

- Discovers denial at the pharmacy with no explanation

- Cannot reach their doctor's office to get status updates

- Intimidated by insurance terminology

**4.3 Payer — Sam Wilson (Utilization Management Reviewer)**

A clinical reviewer at a health plan responsible for evaluating PA requests against coverage policies and clinical guidelines. Manages a daily queue of 30–50 cases.

**Goals**

- Review cases quickly with all clinical evidence pre-organized

- Match case documentation against coverage criteria automatically

- Approve straightforward cases without manual review

- Identify documentation gaps and request additional info efficiently

**Frustrations**

- Receives incomplete submissions requiring multiple back-and-forth information requests

- No tool to auto-match clinical notes against formulary criteria

**5. Functional Requirements**

**5.1 Authentication & Access Control**

- Multi-role login: Provider, Patient, Payer — each with dedicated navigation and feature set

- Role-based access control (RBAC): Patients see only their own cases; Providers see their practice's cases; Payers see their plan's queue

- Session persistence via JWT stored in localStorage

- Demo login shortcuts for each role (for sales demos)

**5.2 Provider Module — Feature Requirements**

**5.2.1 Dashboard**

- Real-time KPI counters: Pending / In Review / Approved / Denied

- Recent Authorizations feed: last 10 PA events with status icon, drug, patient, date

- Priority Alerts panel: cases due within 3 days, new payer policy updates, appeal opportunities

- Processing metrics: Avg. processing time, approval rate, appeals success rate

**5.2.2 New PA Request (Modal Form)**

- Triggered from any screen via '+ New PA Request' button

- Required fields: Patient Name, Date of Birth, Diagnosis, Diagnosis Code (ICD-10), Medication, Dosage, Previous Treatments, Clinical Justification, Supporting Documents, Prescribing Physician, NPI

- Drag-and-drop document upload zone supporting PDF, JPG, PNG, DOCX

- Form validation: required fields highlighted in red on incomplete submission

- Auto-generates Case ID on submission: format PA-XXXXXX

- Submission channel selection: HL7 FHIR API / Payer Web Portal / Secure Fax

- Submits via POST /api/cases → status set to 'pending' → timeline event created

**5.2.3 Active Cases**

- Full-width table: Case ID (monospace) \| Patient + DOB \| Medication + Indication \| Status badge \| Date (submitted + due/approved/denied) \| Actions

- Inline actions: View Details, Appeal (denied cases), Share (pending/review)

- Clicking any row opens PA Detail Modal

- Search/filter by patient name, drug, or case ID

**5.2.4 PA Detail Modal**

- Full case details: status badges, payer, drug, priority, 6-cell info grid

- Visual journey tracker (6 steps) with current step animated

- Denial reason alert with 'Generate Appeal' and 'View Denial Letter' buttons

- Auth number success alert for approved cases with validity dates

- Document list with attach capability

- Chronological timeline of all case events

**5.2.5 Appeals Management**

- Shows all denied cases with denial reasons

- 'File Appeal' action opens AI Chat pre-loaded with Appeal Generator

- AI generates formal appeal letter in under 5 seconds

- Active appeals section tracks filed appeals

**5.2.6 Reauthorizations**

- Upcoming Reauthorizations: cases with auth expiry within 45 days, sorted by urgency

- Urgency tiers: Urgent (\<30 days, red), Normal (\<45 days, amber)

- Recently Reauthorized table: Patient \| Medication \| Original Approval \| Reauthorized \| New Expiration

- 'Start Re-auth' triggers new PA flow pre-populated with same drug/patient

**5.2.7 AI Features**

- Form Assistant: Auto-complete PA form from patient diagnosis input

- Document Analyzer: Score uploaded docs on Relevance (0-100%) and Completeness (0-100%), list strengths, gaps, and recommendations

- PA Insights: Predict approval likelihood (%), processing time, documentation score, key success factors, similar case analysis

**5.3 Patient Module — Feature Requirements**

**5.3.1 Dashboard**

- Current PA status card with plain-language explanation of status

- My Medications list with PA status per drug

- Insurance plan details: plan name, member ID, deductible, copay, payer contact

**5.3.2 PA Journey Tracker**

- 6-step horizontal visual tracker: PA Submitted → Received by Payer → Clinical Review → Decision Pending → Decision → Treatment Starts

- Completed steps: blue filled with checkmark

- Current step: amber with pulse animation (CSS keyframe)

- Future steps: gray outlined with step number

- Blue connector line for completed segments, gray for future

- 6 detail cards explaining each step in plain language with expected dates

- Evidence documents section showing submitted/needed status per document

**5.3.3 My Documents**

- Document grid with upload status (Submitted / Needed / Uploaded)

- AI banner suggesting missing documents for active PA cases

- Upload capability per document with file type guidance

**5.3.4 Patient AI Assistant**

- Treatment Explainer: plain language explanation of medication and PA need

- PA Status Helper: explains current status, next steps, timeframe, and rights

- Side Effect Guidance: common and serious side effects with when-to-call instructions

**5.4 Payer Module — Feature Requirements**

**5.4.1 Review Queue Dashboard**

- KPI row: Pending / In Review / Approved Today / Denied Today

- Review Queue: scrollable list of cases with inline Approve / Deny / AI Review actions

- Workload Overview: Today's Reviews, Approaching Deadline, Appeals to Review, Completed Today

- Processing Metrics: Avg. Review Time, Approval Rate, Request Volume trend

**5.4.2 Payer AI Features**

- Clinical Review: Analyze case against ADA/ACR/clinical guidelines for appropriateness

- Guideline Match: Auto-match case documentation against coverage policy criteria, list met/unmet criteria

- Alternative Suggestions: Suggest covered formulary alternatives when drug is not covered

**6. Business Logic & Process Rules**

**6.1 PA Lifecycle State Machine**

|                |              |                                     |                                                                              |
|----------------|--------------|-------------------------------------|------------------------------------------------------------------------------|
| **From State** | **To State** | **Trigger**                         | **Actor & Auto-Action**                                                      |
| (new)          | pending      | Provider submits PA form            | Provider → System creates PA, timeline event added, Case ID generated        |
| pending        | review       | Payer receives & assigns            | Payer → 'Received' + 'In Review' timeline events added                       |
| review         | approved     | Payer approves case                 | Payer → Auth number generated, provider+patient notified                     |
| review         | denied       | Payer denies case (reason required) | Payer → Denial reason stored, provider+patient notified, appeal window opens |
| denied         | review       | Provider files appeal               | Provider → Status resets to review, 'Appeal Filed' timeline event            |
| approved       | reauth_due   | 45 days before auth expiry          | System → Case appears in Upcoming Reauthorizations list                      |

**6.2 Authorization Number Format**

- Format: \[PAYER_PREFIX\]-\[YYYY\]-\[4-digit random\]

- Payer prefixes: BlueCross=BCH, Aetna=ATN, UnitedHealthcare=UHC, Cigna=CGN, Humana=HUM

- Default validity: 6 months from approval date

- Auth number surfaced immediately to provider and patient on approval

**6.3 Re-Authorization Rules**

- Cases with validUntil within 45 days appear in Upcoming Reauthorizations

- Cases with expired validUntil appear in Recently Reauthorized with New Expiration column

- Re-auth starts a new PA case pre-populated with same patient/drug/payer data

- Re-auth review considers outcomes data: adherence, labs, clinical response — not just eligibility

**6.4 Appeal Process Rules**

- Appeal window: 60 days from denial date

- First-level appeal: provider submits additional clinical evidence

- Peer-to-peer review: physician speaks directly with payer medical director

- External IRO review: independent third-party review (available if upheld after peer-to-peer)

- Filing appeal changes status back to 'review' and adds 'Appeal Filed' timeline event

**6.5 Submission Channel Logic**

- HL7 FHIR API: electronic, confirmation \< 1 hour, preferred for connected EHRs and CAQH-compliant payers

- Payer Web Portal: manual upload, 4–8 hours confirmation, suitable for non-FHIR payers

- Secure Fax: legacy fallback, 24–48 hours, required for some smaller payers and rural health systems

**6.6 Document Requirement Rules**

|                      |                       |                                                |
|----------------------|-----------------------|------------------------------------------------|
| **Document Type**    | **Requirement Level** | **Notes**                                      |
| Clinical Notes       | **Required**          | Diagnosis, current symptoms, treatment history |
| Lab Results          | **Required**          | Must be within 90 days for most payers         |
| Prior Auth Form      | **Required**          | Payer-specific form, AI can auto-fill          |
| Specialist Letter    | **Recommended**       | Significantly improves approval likelihood     |
| Step Therapy Records | **Recommended**       | Required for most biologic medications         |
| Imaging / Scans      | If applicable         | Oncology, orthopedic, and radiology cases      |

**7. Technical Requirements**

**7.1 Technology Stack**

|                  |                                          |                                                                             |
|------------------|------------------------------------------|-----------------------------------------------------------------------------|
| **Layer**        | **Technology**                           | **Rationale**                                                               |
| Frontend         | React + TypeScript + Vite                | Type safety, fast HMR, component reuse                                      |
| Styling          | CSS Modules (custom design system)       | Full control over design tokens, no Tailwind constraints                    |
| Routing          | React Router v6                          | Nested routes for role-specific layouts                                     |
| State            | React Context API + hooks                | Auth, global toasts, role context                                           |
| Backend          | Express.js + TypeScript                  | Lightweight REST API, fast to iterate                                       |
| Data Store (MVP) | In-memory (module-level arrays)          | No database setup for MVP demo; swap to PostgreSQL for production           |
| AI Integration   | Any OpenAI-compatible LLM API (hosted or self-hosted), with a rules-engine fallback | PA form auto-fill, appeal generation, document analysis, guideline matching |
| PA Exchange      | HL7 FHIR R4 / NCPDP                      | Electronic PA submission per CMS 2026 mandate                               |
| Build/Deploy     | Vite + Node.js + Replit / Netlify        | Zero-config deployment, CI/CD pipeline                                      |

**7.2 API Endpoints**

- GET /api/cases — List all PA cases. Supports ?status= and ?payer= query filters

- GET /api/cases/:id — Single case with full timeline events

- POST /api/cases — Create new PA case. Auto-generates ID, sets status=pending, creates timeline event

- PATCH /api/cases/:id — Update case (status, denial reason, auth number). All changes append timeline event

- POST /api/cases/:id/submit — Submit to payer. Changes status pending→review, adds 'Received by Payer' + 'In Review' timeline events

- POST /api/cases/:id/appeal — File appeal. Status→review, adds 'Appeal Filed' event

- GET /api/patients — List patients

- GET /api/patients/:id — Single patient with medication list and PA history

- GET /api/reauth — Reauthorization cases with urgency classification

- POST /api/ai — AI response. Body: { role, feature, message } → grounded rules-engine response, or an LLM response when one is configured

**7.3 Security & Compliance Requirements**

- HIPAA compliance: PHI must be encrypted at rest (AES-256) and in transit (TLS 1.3)

- Audit logging: all case status changes, document access, and approval/denial decisions must be logged with actor, timestamp, and IP

- Role-based data isolation: patients cannot access other patients' data; API enforces patientId filtering

- OAuth 2.0 / SMART on FHIR for EHR integration authentication

- SOC 2 Type II certification required before production launch

- Data retention: PA records retained for 7 years per CMS requirements

**8. AI & GenAI Capabilities**

**8.1 AI Feature Summary**

ClearAuth embeds AI at three strategic points in the PA workflow: at submission (to improve documentation quality), at review (to match clinical evidence against guidelines), and after denial (to accelerate appeals). All AI features use a large language model through a provider-agnostic Chat Completions interface, so the model can be swapped or self-hosted; when no model is configured, a rules engine answers from the case record and coverage criteria.

|                     |                |                              |                                                                                                   |
|---------------------|----------------|------------------------------|---------------------------------------------------------------------------------------------------|
| **Feature**         | **User**       | **Input**                    | **Output**                                                                                        |
| Form Auto-Fill      | Provider       | Patient diagnosis + EHR data | Pre-filled PA form with ICD-10, clinical justification, drug selection                            |
| Document Analyzer   | Provider/Payer | Uploaded clinical PDF        | Relevance %, completeness %, strengths, gaps, AI recommendations                                  |
| PA Insights         | Provider       | Case details + payer         | Approval likelihood %, processing time, documentation score, success factors                      |
| Appeal Generator    | Provider       | Denial reason + case data    | Formal appeal letter with patient demographics, diagnosis, clinical evidence, guidelines citation |
| Evidence Search     | Provider       | Drug + indication            | Relevant clinical trial citations, guidelines references supporting medical necessity             |
| Guideline Match     | Payer          | Case + formulary policy      | Criteria met/unmet analysis, documentation gap identification, recommendation                     |
| PA Status Helper    | Patient        | Current case status          | Plain-language status explanation, next steps, timeline, appeal rights if denied                  |
| Treatment Explainer | Patient        | Drug name + diagnosis        | Plain-language medication explanation, why PA is required, typical timeline                       |

**8.2 AI System Prompts (per role)**

**Provider System Prompt**

You are a clinical PA specialist assistant embedded in ClearAuth, a prior authorization management platform. You assist physicians and PA coordinators with documentation, clinical evidence gathering, appeal letter drafting, and approval likelihood analysis. Your responses are evidence-based, reference current clinical guidelines (ADA, ACR, AHA, NCCN etc.), and are formatted for use in formal medical and insurance communications. Be concise, clinically accurate, and action-oriented.

**Patient System Prompt**

You are a friendly, clear, and empathetic patient advocate embedded in ClearAuth. You help patients understand their prior authorization process in simple, non-technical language. Never use medical jargon without explaining it. Always reassure patients of their rights (including appeal rights) and focus on what actionable next steps they can take. Avoid sharing specific diagnostic or treatment advice — always direct clinical questions to their doctor.

**Payer System Prompt**

You are a clinical review assistant for a health plan utilization management team. You help reviewers match case documentation against coverage policies and clinical guidelines, identify documentation gaps, suggest alternative covered therapies, and draft clear denial notices with specific unmet criteria. Base all decisions on evidence-based clinical guidelines and the payer's formulary criteria. All outputs should be audit-ready and compliant with CMS and state UM requirements.

**9. Release Plan**

**9.1 MVP Scope (v1.0)**

The MVP delivers the core PA submission, tracking, and AI assistance workflow for all three user roles. Re-authorization and full EHR integration are included as foundational features.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>Included in v1.0 MVP</strong></td>
<td><strong>Deferred to v1.1+</strong></td>
</tr>
<tr class="even">
<td><ul>
<li><p>All 3 role modules (Provider, Patient, Payer)</p></li>
<li><p>New PA Request modal form</p></li>
<li><p>PA status tracking with journey tracker</p></li>
<li><p>AI form assistant, document analyzer, PA insights</p></li>
<li><p>AI appeal generator and evidence search</p></li>
<li><p>Re-authorization management with expiry alerts</p></li>
<li><p>Mock HL7 FHIR submission channel</p></li>
<li><p>In-memory data store (10 seeded PA cases)</p></li>
</ul></td>
<td><ul>
<li><p>Live EHR integration (Epic FHIR, Cerner)</p></li>
<li><p>Real-time payer API connections</p></li>
<li><p>PostgreSQL production database</p></li>
<li><p>Email/SMS notification system</p></li>
<li><p>Multi-practice / multi-provider accounts</p></li>
<li><p>ePA standard compliance (NCPDP SCRIPT)</p></li>
<li><p>Mobile application (iOS/Android)</p></li>
<li><p>Analytics dashboard and reporting</p></li>
</ul></td>
</tr>
</tbody>
</table>

**9.2 Development Timeline**

|             |              |                                                                               |
|-------------|--------------|-------------------------------------------------------------------------------|
| **Phase**   | **Timeline** | **Deliverables**                                                              |
| Phase 0     | Weeks 1–2    | Project setup, design system, component library, seed data, auth flow         |
| Phase 1     | Weeks 3–5    | Provider module: Dashboard, Cases, New PA Modal, Appeals, Reauth              |
| Phase 2     | Weeks 6–7    | Patient module: Dashboard, Journey Tracker, Documents, AI Assistant           |
| Phase 3     | Week 8       | Payer module: Dashboard, Review Queue, AI Features                            |
| Phase 4     | Weeks 9–10   | AI integration (LLM API), document analyzer, appeal generator, PA insights |
| Phase 5     | Weeks 11–12  | QA, HIPAA compliance review, performance testing, deployment to production    |
| Beta Launch | Week 13      | 3 pilot provider practices, 2 payer partners — feedback collection            |
| v1.0 GA     | Week 16      | General availability launch with full documentation and support               |

**10. Risks & Mitigations**

|                                                       |                |              |                                                                                               |
|-------------------------------------------------------|----------------|--------------|-----------------------------------------------------------------------------------------------|
| **Risk**                                              | **Likelihood** | **Impact**   | **Mitigation**                                                                                |
| HIPAA non-compliance exposes PHI                      | **Low**        | **Critical** | External HIPAA audit pre-launch, BAA with all vendors, encryption at rest and in transit      |
| Payer API connectivity gaps (non-FHIR payers)         | **High**       | **High**     | Fallback to fax/portal channels; prioritize FHIR payers for v1.0                              |
| AI generates clinically inaccurate content            | **Medium**     | **High**     | All AI output clearly labeled 'AI-generated, review before submission'; human review required |
| Low patient portal adoption                           | **Medium**     | **Medium**   | SMS/email status notifications as primary channel; portal as secondary                        |
| Payer policy changes invalidate AI guideline matching | **High**       | **Medium**   | Quarterly policy update cycle; AI clearly shows policy version used in analysis               |

**11. Glossary**

|                  |                                                                                                                         |
|------------------|-------------------------------------------------------------------------------------------------------------------------|
| **Term**         | **Definition**                                                                                                          |
| **PA**           | Prior Authorization — insurance plan requirement that a provider obtain approval before prescribing a drug or procedure |
| **RA / Re-Auth** | Re-Authorization — renewal of a prior authorization upon expiry, requiring updated clinical evidence                    |
| **FHIR**         | Fast Healthcare Interoperability Resources — HL7 standard for electronic health data exchange                           |
| **ICD-10**       | International Classification of Diseases 10th Revision — standard diagnostic coding system                              |
| **NPI**          | National Provider Identifier — unique 10-digit identifier for healthcare providers                                      |
| **NDC**          | National Drug Code — unique 11-digit identifier for medications                                                         |
| **UM**           | Utilization Management — payer process for reviewing medical necessity of treatments                                    |
| **IRO**          | Independent Review Organization — third-party body that reviews upheld insurance denials                                |
| **csDMARD**      | Conventional Synthetic Disease-Modifying Antirheumatic Drug — standard step-therapy drugs for RA                        |
| **KOL**          | Key Opinion Leader — influential physician in a therapeutic area                                                        |
| **CAQH CORE**    | Council for Affordable Quality Healthcare — industry body setting electronic PA standards                               |
| **RBAC**         | Role-Based Access Control — permission system controlling data access by user role                                      |
| **PHI**          | Protected Health Information — identifiable patient health data protected under HIPAA                                   |

*END OF DOCUMENT — ClearAuth PRD v1.0*
