**PHARMA ACTION BUILDER**

Concept & Vision Document · v2.0

*Reimagining Pharma Commercial Execution with NBA + AutoML*

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>"</strong></p>
<p><strong>Every HCP interaction should be the right action, at the right time, via the right channel — continuously guided by data science and field execution intelligence.</strong></p>
<p><strong>"</strong></p></td>
</tr>
</tbody>
</table>

| **Version** | **Date**   | **Classification**       | **Audience**                |
|-------------|------------|--------------------------|-----------------------------|
| v2.0        | March 2025 | Public portfolio concept | Exec, Commercial, Analytics |

**1. Vision Statement**

*The pharmaceutical industry is one of the most data-rich sectors in the world — and one of the least effective at converting that data into real-time, personalised commercial execution. Pharma Action Builder is built to change this.*

We are building the commercial intelligence operating system for pharmaceutical field forces. A platform where every HCP engagement — every email sent, every call scheduled, every CLM session run, every 1:1 meeting arranged — is the product of a continuously improving machine learning model that knows which action will have the greatest impact, for that HCP, on that day.

Pharma Action Builder is not a CRM replacement. It is not a BI tool. It is not a standalone analytics platform. It is the missing layer that connects the data science intelligence that analytics teams already build with the commercial execution that field teams already run — and makes them work as one seamless loop.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Strategic North Star</strong></p>
<p>A closed-loop commercial intelligence system where machine learning models built by data scientists are deployed in hours (not weeks), translated into personalised NBA action plans for field reps, executed in the field, and where tactic outcomes feed directly back into model retraining — creating a continuously improving omnichannel HCP engagement engine.</p></td>
</tr>
</tbody>
</table>

**2. Market Context**

**2.1 The \$200B Execution Gap**

McKinsey estimates that pharmaceutical companies globally lose an estimated \$150–200 billion annually in suboptimal commercial execution. This is not primarily a resource problem — most organisations have sufficient field forces, data infrastructure, and analytical capability. The gap is in operationalisation: the inability to translate analytical insight into timely, personalised, channel-appropriate HCP engagement at scale.

**2.2 The HCP Engagement Paradox**

Healthcare Professionals are simultaneously over-engaged (by generic, repetitive outreach) and under-served (by relevant, timely, personalised interactions). Industry surveys consistently report that HCPs feel pharmaceutical company interactions lack relevance to their specific clinical interests and patient populations. This is not because commercial teams lack intent — it is because they lack the tools to personalise at scale.

**2.3 The AutoML Opportunity**

The emergence of no-code and low-code machine learning environments has dramatically reduced the barrier to model creation. However, pharma commercial analytics teams still face a critical gap: model operationalisation. Building the model is no longer the hard problem. Getting it into the hands of field reps as actionable weekly guidance — in a way they can trust, act on, and give feedback — remains unsolved.

|                                                                                                                                                                                                                                                                                                                                                       |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| *Industry Signal: 73% of pharma data science leaders report that fewer than 20% of models built in their organisations are ever deployed to production. The primary barrier is not technical — it is the absence of a purpose-built operationalisation layer between analytics and field execution. (Source: Deloitte Pharma Analytics Survey, 2024)* |

**3. The Three Problems We Solve**

**3.1 The Data Fragmentation Problem**

A field medical representative's ability to engage effectively with an HCP depends on understanding that HCP's prescribing behaviour, channel preferences, engagement history, clinical interests, and competitive context. This intelligence exists — distributed across CRM systems, data warehouses, ERP platforms, and external data providers. It is never unified.

Pharma Action Builder solves this with a data aggregation layer that connects CRM (Veeva, Salesforce), ERP (SAP), DWH (Snowflake, BigQuery), and BI (Power BI, Tableau) in a single data environment for model training and real-time HCP profiling.

**3.2 The Model-to-Action Gap**

Commercial analytics teams spend significant resources building sophisticated predictive models: HCP propensity-to-prescribe models, next best action classifiers, channel preference models, segmentation algorithms. These models rarely reach the field. The deployment pathway involves engineering tickets, CRM customisation projects, data pipeline work, and user training — a cycle that typically takes 4–8 weeks, by which time the model's training data is often stale.

Pharma Action Builder eliminates this gap. The Analytics Workbench provides a one-click Deploy function that pushes a validated model directly into the HCP Engagement Console's NBA recommendation engine in under 5 minutes. No engineering ticket. No integration project. No data pipeline work.

**3.3 The Generic Engagement Problem**

Field reps operate from standardised call plans — the same tactic sequence (email, call, CLM, 1:1) applied to all HCPs in a segment regardless of individual signals. An HCP with 91% digital affinity who responds strongly to email and CLM receives the same plan as one with 44% digital affinity who only responds to face-to-face interactions. This is a fundamental mismatch between what is known about HCPs and how they are engaged.

Pharma Action Builder generates a personalised NBA Journey Map for every HCP in every rep's territory — each week, based on the latest model output. The sequence, channel mix, and frequency are determined by ML, not generic segment rules.

**4. The Solution Architecture**

**4.1 Two Modules, One Closed Loop**

Pharma Action Builder operates as two deeply integrated modules that form a single feedback loop:

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Analytics Workbench (AWB) Module → Model Training &amp; Deployment</strong></p>
<p>The Analytics Workbench is an AutoML environment purpose-built for pharma commercial analytics. Data scientists source data from CRM, ERP, DWH, and BI systems, engineer features, train models from a library of six pharma-tuned algorithms, monitor model health, and deploy validated models directly to the HCP Engagement Console.</p></td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>HCP Engagement Console (HEC) Module → Field NBA Execution</strong></p>
<p>The HCP Engagement Console translates deployed model outputs into a weekly, personalised HCP engagement plan for every field rep. Reps see their NBA-recommended tactic sequence for each HCP (Email → CLM → 1:1 → Call → 1:1), track completion, monitor HCP performance, and manage their territory — all in one interface. Every tactic completed (or deviated from) becomes training data for the next model cycle.</p></td>
</tr>
</tbody>
</table>

**4.2 The HCP Engagement Console Module — Deep Dive**

**Overview Dashboard**

The primary weekly command centre for field reps. Four KPI tactic cards (Emails, Calls, CLM Sessions, 1:1 Meetings) display real-time completion against weekly targets with progress bars, week-on-week deltas, and completion status tags (On Track / At Risk). A completed tactics summary and upcoming tactics donut chart provide immediate visibility into weekly workload. Current week and last week HCP tables allow quick navigation to individual HCP profiles.

**HCP Status Tracker**

A full territory HCP grid with dot matrix tactic indicators — each HCP row shows completion status for Emails, Calls, CLM, and 1:1 as a ratio badge (e.g. 3/5) followed by colour-coded completion dots. NBA status (On Track / At Risk / Monitor) is derived from the deployed model. Clicking any row opens the full HCP Statics view.

**HCP Statics — Individual Intelligence**

A 360-degree HCP profile containing: segmentation (Champion/Loyalist/Growth/At-Risk), priority tier, digital affinity score, relationship duration, drug affiliation, experience, territory affiliations, and a plain-language ML-generated NBA recommendation. Supplemented by an HCP territory map, monthly revenue bar chart with year-on-year tracking, and the ongoing journey map — a visual timeline of the current week's ML-recommended tactic sequence with node-level completion tracking and CRM/ERP integration capability.

**Performance & Target**

A searchable, sortable, downloadable HCP directory with commercial context — specialty, product, priority, segment, and NBA summary per HCP. Filter and share controls enable territory-wide analysis and collaboration with sales management.

**Heat Map & Metrics**

An interactive territory intelligence tool. Marketing managers drag tactic tiles (Emails, Calls, CLM, 1-on-1, Social Media) onto the US territory map to see a choropleth visualisation of HCP responsiveness by geography. A report panel shows the Red/Amber/Green breakdown of HCP responsiveness for the selected tactic, enabling data-driven marketing spend allocation.

**4.3 The Analytics Workbench Module — Deep Dive**

**Create Model Panel**

A five-step model creation workflow: (1) Define use case and stakeholder owner; (2) Select data sources and datasets from CRM, ERP, DWH, BI connectors; (3) Preview combined data in the Data Presence List; (4) Configure feature extraction — independent variables, target variable, co-variates; (5) Select model family (Supervised/Unsupervised), algorithm, and train/test split — then trigger model training.

**Monitoring Panel**

Full governance view for all deployed and staged models. Per-model: vulnerability score, false negative rate, false positive rate, data split, confusion matrix (TP/FP/FN/TN with Precision/Recall/F1), accuracy gauge, and Model Significance Output table showing feature co-efficients and p-values. The Focus On callout provides a plain language interpretation for commercial stakeholders. Ingest/Deploy/Replace action buttons manage the model lifecycle. The Tweak Panel enables inline hyperparameter adjustment without leaving the monitoring view.

**Model Library**

Six algorithm families pre-configured for pharma commercial use cases: XGBoost (HCP propensity scoring), Random Forest (segmentation), Deep Neural Networks (omnichannel engagement patterns), RNN (sequential journey modelling), Markov Decision Process (optimal interaction sequence optimisation), and Factorization Machines (sparse data recommendation).

**5. Value Proposition by Stakeholder**

| **Stakeholder**          | **Before Pharma Action Builder**                                                                                                 | **After Pharma Action Builder**                                                                                                                |
|--------------------------|----------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| Field Medical Rep        | Generic weekly call plan. No personalisation. No visibility into what's working. Tactic targets as compliance exercise.          | ML-generated personalised weekly NBA journey map per HCP. Real-time tactic completion tracking. Integrated CRM workflow.                       |
| Commercial Analytics DS  | Models built in notebooks. 4–8 week engineering handoff to deploy. Models never reach field teams. No monitoring infrastructure. | No-code AutoML from data sourcing to deployment in \< 4 hours. One-click deploy to HCP Engagement Console. Built-in monitoring and governance. |
| Commercial Manager       | Fragmented reporting. No per-HCP tactic intelligence. Cannot simulate territory-level tactic effectiveness.                      | Territory heat map. Per-HCP NBA compliance tracking. Revenue attribution by tactic and channel.                                                |
| Marketing Ops            | No per-product HCP filtering. Cannot connect marketing spend to HCP engagement outcomes.                                         | Per-product HCP directory with segment and NBA tags. Heat map correlates tactic investment with HCP responsiveness.                            |
| Chief Commercial Officer | Lagging commercial performance indicators. No forward-looking engagement intelligence.                                           | Real-time NBA execution rate. Predictive model accuracy as leading indicator of commercial performance.                                        |

**6. Competitive Differentiation**

The pharma commercial technology landscape includes CRM platforms (Veeva, Salesforce Health Cloud), omnichannel engagement tools (IQVIA OCE, Aktana), and generic AutoML platforms (DataRobot, H2O, Google AutoML). Pharma Action Builder is distinct from all of these:

**6.1 Closed Loop by Design, Not by Integration**

Veeva CRM, Salesforce, and IQVIA OCE are engagement execution platforms. They record and facilitate HCP interactions. They do not generate personalised recommendations, and they do not feed outcomes back into model retraining. Aktana provides NBA recommendations but relies on a separate analytics infrastructure.

Pharma Action Builder is the only platform where model training, deployment, field execution, and outcome capture form a single integrated loop — with no third-party integration required between the analytics environment and the field-facing recommendation layer.

**6.2 Pharma-Native AutoML**

Generic AutoML platforms are powerful but agnostic. They require significant customisation to handle pharma-specific data structures: HCP territory hierarchies, drug product hierarchies, sales rep activity logs, sample tracking, CLM event data, and field visit reporting. Data scientists using DataRobot or Google AutoML for pharma commercial modelling spend more time on data preparation and infrastructure than on model development.

Pharma Action Builder's Analytics Workbench arrives pre-configured for these structures. CRM, ERP, DWH, and BI connectors are pharma-specific. The feature library includes pharma-relevant variables (CLM Engagement Score, Digital Affinity Index, KOL Affiliation Score, Cycle Time). The algorithm library includes MDP — rarely available in generic AutoML platforms but critically important for journey sequencing.

**6.3 Field-First, Not Analytics-First**

Most commercial analytics platforms are designed for analysts and data scientists. The HCP Engagement Console is designed for field reps who are in a clinic waiting room, on their tablet, with 90 seconds to review their next HCP engagement. The interface is mobile-optimised, the NBA recommendation is a single plain-language sentence, the journey map is a visual node sequence that requires zero interpretation. The HCP status dot matrix communicates completion at a glance. No training required.

|                                                                                                                                                                                                                                                                             |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| *Competitive Position: Pharma Action Builder is not competing with Veeva or Salesforce for the CRM layer. It is the intelligence and recommendation layer that sits above the CRM — making the data in those systems actionable, personalised, and continuously improving.* |

**7. End-to-End Workflow**

| **Step** | **Actor**                          | **Activity**                                                                                                                                                          |
|----------|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1        | Data Scientist                     | Connect data sources (CRM, ERP, DWH, BI) in the Analytics Workbench. Select relevant datasets for the use case (e.g. HCP NBA for Drug X, Q2 2025).                    |
| 2        | Data Scientist                     | Configure feature extraction: independent variables (Email Open Rate, CLM Score, Digital Affinity), target variable (Sales Value / HCP Response Rate), co-variates.   |
| 3        | Data Scientist                     | Select algorithm (e.g. XGBoost, Supervised) and train/test split. Run model. Review accuracy, confusion matrix, vulnerability, and feature significance.              |
| 4        | Data Scientist                     | Review Monitoring panel: validate Confusion Matrix precision/recall, review Focus On recommendation. Optionally tweak hyperparameters. Click Deploy.                  |
| 5        | Platform                           | Deployed model generates personalised NBA journey maps for all HCPs across all territories within 5 minutes of deployment.                                            |
| 6        | Field Rep (HCP Engagement Console) | Opens HCP Engagement Console Overview on Monday morning. Reviews tactic KPI cards and upcoming tactic count. Sees NBA-recommended journey map for each HCP.           |
| 7        | Field Rep (HCP Engagement Console) | Executes tactic plan: sends ML-recommended email, conducts CLM session, schedules 1:1 meeting. Marks completions in the journey map tracker.                          |
| 8        | Field Rep (HCP Engagement Console) | Any deviations from NBA plan (alternative tactic used) are logged. Revenue outcomes synced from CRM to platform.                                                      |
| 9        | Platform                           | Tactic completion data, deviation records, and revenue outcomes feed back into the next model training cycle. Model accuracy improves each cycle.                     |
| 10       | Commercial Manager                 | Reviews territory heat map. Analyses HCP responsiveness to Email vs. CLM vs. Calls. Reallocates marketing spend towards highest-responsiveness tactics per territory. |

**8. The Longer-Term Vision**

Pharma Action Builder v2.0 delivers the core closed loop. The platform's long-term trajectory extends in four strategic directions:

**8.1 Real-Time Adaptive NBA**

Journey maps that adapt in real time. An HCP who presents at a major medical congress, publishes new clinical research, or changes prescribing behaviour mid-week triggers an automatic NBA plan update for the following Monday — without any intervention from the data science team. Model deployment moves from weekly cycles to continuous inference.

**8.2 Multi-Brand Cross-Portfolio Optimisation**

For commercial organisations carrying multiple brands, the HCP Engagement Console v3 will enforce a portfolio-level engagement constraint — ensuring that HCPs are not simultaneously over-engaged across Drug X, Y, and Z by different field teams. A global HCP engagement governor will optimise the combined tactic load across brands, improving HCP experience and reducing interaction fatigue.

**8.3 MLR-Integrated NBA Governance**

In regulated markets, AI-generated tactic recommendations must pass through Medical Legal Regulatory (MLR) review before reaching field teams. Future versions will embed MLR review gates directly into the Analytics Workbench deployment workflow, enabling compliance teams to approve or reject model-generated content patterns before a model is promoted to production status.

**8.4 Patient Outcome Correlation**

The ultimate north star: a platform that connects HCP engagement patterns and prescribing behaviour to downstream patient adherence and outcomes data. This would create the pharmaceutical industry's first commercial-to-clinical closed loop — enabling not just commercial optimisation, but direct line-of-sight from field rep behaviour to patient health outcomes.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>The Pharma Action Builder Vision:</strong></p>
<p><strong>A pharmaceutical commercial organisation where no HCP interaction happens without data backing it, no model sits unused in an analytics notebook, and the field force operates as a precision instrument — continuously guided by real-time intelligence, continuously improving from its own execution.</strong></p></td>
</tr>
</tbody>
</table>

Pharma Action Builder is not just a platform. It is a new commercial operating model — one where data science and field execution are not parallel tracks, but a single, continuously improving loop that learns from every interaction and gets smarter with every week of use.

— End of Concept & Vision Document —
