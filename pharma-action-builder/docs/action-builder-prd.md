**PHARMA ACTION BUILDER**

Product Requirements Document · v2.0

**Next Best Action (NBA) Engine + AutoML Platform for Pharma Commercial Excellence**

| **Version** | **Status**    | **Date**   | **Classification**       |
|-------------|---------------|------------|--------------------------|
| v2.0        | Concept draft | March 2025 | Public portfolio concept |

| **Document Owner**    | **Product Sponsor**      | **Primary Stakeholders**                     |
|-----------------------|--------------------------|----------------------------------------------|
| Commercial Excellence | Chief Commercial Officer | ME Field Teams, DS Analytics, Commercial Ops |

**1. Executive Summary**

Pharma Action Builder (PAB) is a two-module commercial intelligence platform that closes the loop between data science modelling and field force execution in pharmaceutical commercial operations.

The platform consists of:

- HCP Engagement Console (HEC) Module – A Next Best Action (NBA) dashboard providing field medical representatives with ML-generated weekly HCP engagement plans, tactic tracking, performance analytics, and territory visualisation. Every HCP in the territory receives a personalised omnichannel journey map based on their prescribing behaviour, digital affinity, channel responsiveness, and relationship depth.

- Analytics Workbench (AWB) Module – A no-code AutoML environment enabling pharma analytics teams to source data from CRM, ERP, DWH, and BI systems, build and validate ML models (supervised and unsupervised), monitor model health in production, and deploy model outputs directly into the HCP Engagement Console — without engineering handoffs or lengthy integration cycles.

Together, these modules form a closed feedback loop: field rep tactic outcomes feed back into model training, creating a continuously improving recommendation engine that learns from real commercial execution.

|     |                                                                                                                                                                                                                                                                  |
|-----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 🎯  | Strategic Intent: Enable pharmaceutical field forces to move from generic, schedule-based HCP engagement to personalised, evidence-based omnichannel orchestration — increasing HCP satisfaction, tactic completion rates, and ultimately prescribing behaviour. |

**2. Problem Statement**

**2.1 The Fragmented Commercial Intelligence Landscape**

Pharmaceutical commercial organisations generate enormous volumes of HCP interaction data across CRM systems, data warehouses, BI tools, and ERP platforms. This data is almost universally siloed. Sales representatives operate from call plans that were designed weeks prior, using aggregated field inputs rather than real-time signals from this data.

**2.2 The Model Operationalisation Gap**

Commercial analytics teams routinely build sophisticated predictive models — HCP propensity to prescribe, next best action classifiers, channel preference models, segmentation algorithms. These models rarely reach production. The barriers are significant:

- No native deployment pathway from analytics environment to field-facing systems

- Model outputs require translation by engineers who are typically not aligned to commercial timelines

- Field teams lack the context to interpret or act on model recommendations without explainability layers

- Model drift is undetected due to absence of governance and monitoring infrastructure

**2.3 The Field Execution Blind Spot**

Field medical representatives (FMRs) have no mechanism to understand which combination of tactics — email frequency, CLM sessions, face-to-face calls, 1:1 meetings — is most likely to maintain or improve a specific HCP relationship. Tactic plans are standardised across HCP segments rather than personalised to individual HCP signals.

|     |                                                                                                                                                                                                                          |
|-----|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ⚠   | Estimated commercial impact: A 5% improvement in field force tactic optimisation translates to \$150–250M in incremental revenue per year for a mid-sized pharmaceutical organisation with 2,000+ field representatives. |

**3. User Personas & Role Matrix**

| **Role**                      | **Goals**                                                                                                 | **Pain Points**                                                              | **Success Metric**                                                   |
|-------------------------------|-----------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|----------------------------------------------------------------------|
| Field Medical Rep (ME)        | Complete weekly NBA tactic plan. Maximise HCP engagement quality. Maintain prescription momentum.         | Generic call plans. No personalised guidance. No real-time feedback loop.    | NBA adherence rate \> 75%. Tactic completion rate \> 80%.            |
| Commercial Analytics DS       | Build, validate and deploy HCP models rapidly. Ensure model outputs are operationalised in field systems. | Long engineering handoff cycles. Models never deployed. No monitoring layer. | Model-to-production in \< 4 hrs. Zero unmonitored production models. |
| Commercial Excellence Manager | Territory heat map intelligence. Campaign ROI tracking. NBA programme governance.                         | Fragmented reporting. No territory-level tactic effectiveness data.          | Territory NBA compliance dashboard. Revenue attribution by tactic.   |
| Marketing Ops / Brand Manager | Ensure brand messaging reaches right HCPs via right channels. Manage multi-product tactic mix.            | No per-product HCP filtering. Cannot simulate tactic-channel mix outcomes.   | Per-product HCP coverage rate. Channel efficiency score.             |

**4. HCP Engagement Console Module — Feature Specification**

**4.1 Model Portal & Authentication**

- Role-based portal landing page presenting HCP Engagement Console and Analytics Workbench access paths

- Standard SSO integration with email/password fallback

- Remember Me session persistence. Password reset and new account registration flow

**4.2 Overview Dashboard**

The Overview is the primary weekly command centre for field representatives. It aggregates tactic performance, upcoming actions, and HCP engagement status into a single, actionable view.

**4.2.1 Weekly KPI Tactic Cards**

- Four tactic KPI cards: Emails, Sales Calls, CLM (Closed Loop Marketing) Sessions, 1:1 Meetings

- Each card displays: completion count vs. target, percentage completion, progress bar with colour-coded status (Green ≥75%, Amber 50–74%, Red \<50%), and week-on-week delta

- Time filter: Last 7 Days / Last 30 Days / This Quarter

**4.2.2 Completed Tactics Summary**

- Per-tactic progress bars showing running completion against weekly targets

- Dropdown filter for time period comparison

**4.2.3 Upcoming Tactics Donut Chart**

- Donut chart showing the remaining tactic distribution for the current week

- Breakdown legend: Emails, Calls, CLM, 1:1 remaining counts

**4.2.4 Current Week / Last Week HCP Tables**

- Side-by-side tables: Current Week and Last Week HCP interaction rows

- Each row: Date, HCP name with avatar and affiliation count, Tactic status badges (Emails count, Calls count, CLM count)

- Clickable rows navigate to HCP Statics detail view

**4.3 HCP Status Dashboard**

A comprehensive tracking view of all HCPs in the representative's territory with individual tactic completion indicators.

**4.3.1 Columns**

- Date, HCP Name with segmentation label (Champion / Loyalist / Growth / At-Risk), City, Zip Code, Specialty, Product, Emails (dot matrix: filled = completed), Calls (dot matrix), CLM (dot matrix), 1:1 (dot matrix), NBA Status (On Track / At Risk / Monitor)

**4.3.2 Dot Matrix Indicator**

- Each tactic shown as a count badge (e.g. 3/5) followed by colour-coded dots: filled teal = completed, empty grey = remaining

- Provides immediate visual scan of engagement completeness per HCP

**4.4 HCP Statics — Individual Profile**

Clicking any HCP row opens the full HCP Statics view — a 360° profile of the HCP with engagement intelligence, revenue tracking, and journey map management.

**4.4.1 Profile Card**

- HCP name, specialty, segment (Champion/Loyalist/Growth/At-Risk), priority (High/Medium/Low)

- Experience (years), Relationship Duration, Drug Affiliation, Territory City/State/Zip

- Digital Affinity Score — percentage donut chart, colour-coded: teal ≥80%, amber 60–79%, red \<60%

- HCP Affiliations — stacked avatar group with total affiliation count

- NBA Recommendation callout — ML-generated plain language guidance for the next interaction

**4.4.2 HCP Territory Map**

- Geographic map centred on the HCP's territory showing surrounding HCP markers

- Colour-coded pins: Primary HCP (teal), Active (green), Monitor (amber), Inactive (grey)

- Hover tooltip shows HCP name and proximity distance

- 'Full View' expands to territory-wide map

**4.4.3 Revenue Metrics**

- Three KPI stats: Total Revenue (with YoY growth %), Last Year Revenue, Last Quarter Revenue

- Time filter: Yearly / Quarterly / Weekly

- Monthly bar chart — current month highlighted in teal, past months in blue, future in grey

**4.4.4 Ongoing Journey Map**

- Visual timeline of the current NBA tactic sequence: nodes for Email → CLM → 1:1 → Call → 1:1 (order ML-determined)

- Node states: Completed (teal border + ✓ badge), Pending (amber badge), Upcoming (grey badge)

- Journey actions: Integrate (CRM/ERP/Workflow/Source), Filter, Add Tactic, Edit

- Integrate dropdown: 'Integrate with CRM', 'Add to Workflow', 'Sync to ERP', 'Export Source'

**4.4.5 Tactic Comparison Tables**

- Current Week Tactics table: Tactic 1 (Emails + count), Tactic 2 (Calls + count), Tactic 3 (CLM + count), Tactic 4 (1:1 + count), Sales (dash if current)

- Last Week Tactics table: Same structure with actual revenue generated (\$) in Sales column

**4.5 Performance & Target Module**

A searchable, filterable, downloadable directory of all HCPs in the representative's territory with commercial context.

- Columns: HCP (with avatar), City, State, Zip Code, Specialty tag, Product, Priority tag, Segment tag, NBA summary (truncated tooltip), View action

- Search bar filtering by HCP name and specialty

- Controls: Filter, Sort, Download (CSV/Excel), Share (link or export)

- Clickable View → opens HCP Statics detail view

**4.6 Heat Map & Metrics — Territory Intelligence**

An interactive territory visualisation tool for understanding tactic effectiveness across geographic areas.

- Drag (or click) tactic panel — Emails, Calls, CLM, 1-on-1, Social Media — onto the US territory map

- Map updates to a choropleth view: state/region circles sized by HCP count, coloured by tactic responsiveness (Green = High, Amber = Moderate, Red = Low)

- Report panel: Total HCP count with breakdown by responsiveness tier (Red/Amber/Green) and tactic effectiveness progress bar

- Map controls: Filter, Download, Share

**5. Analytics Workbench Module — Feature Specification**

**5.1 Create Model Panel**

**5.1.1 Use Case Definition**

- Free-text use case description field — captures the business objective for the model (e.g. 'Predict HCP next best action for Drug X in Q2 2025')

- Stakeholders & Department selector — tags the model to a business sponsor (Commercial Excellence / Marketing Operations / Sales Analytics / Medical Affairs / Market Access)

- 'Get Data' button — triggers a data pull from configured source connections based on the use case context

**5.1.2 Data Source & Selection**

- Source selector panel — four pre-configured data source types: CRM, ERP, DWH, BI

- Each source exposes available dataset checkboxes (e.g. CRM: Sales_Drug X, Marketing Spend_Drug X, HCP_Drug X, Email Engagement_Drug X)

- Added Data panel — shows currently selected datasets with individual remove controls

- Temporal granularity selector — Day / Week / Month / Quarter

- 'Run Data' trigger — loads and previews the combined dataset in the Data Presence List

**5.1.3 Data Presence List**

- Tabular preview of the combined dataset: \#, HCP Name, Drug, Sales Value (scripts), Sales Calls, Marketing Spend, Sample Drop Cost

- Alternating row shading for readability. Scrollable for large datasets

**5.1.4 Feature Extraction**

- Independent Variables — multi-select dropdown: Sales Call Frequency, Email Open Rate, CLM Engagement Score, Marketing Spend, Sample Drop Count, Digital Affinity Index, Specialty Alignment, Territory Coverage %, KOL Affiliation Score, Cycle Time

- Target Variable — single-select: Sales Value (Scripts), HCP Response Rate, Prescribing Volume, Revenue per HCP, Engagement Score

- Co-variates — optional control variables: Territory Region, Specialty, Drug Product, Rep Tenure, HCP Tier

- 'Create Model' button — generates a Model ID (e.g. \#190810) and initialises training configuration

**5.1.5 Model Configuration**

- Model Family toggle — Supervised or Unsupervised (changes available algorithm list)

- Algorithm selector — Supervised: XGBoost, Random Forest, Deep Neural Network (DNN), Gradient Boosted Regression; Unsupervised: K-Means Clustering, Factorization Machines, DBSCAN, Hierarchical Clustering

- Train/Test split — manual entry fields (e.g. 80/20)

- 'Get Result' button — triggers model training with real-time progress indicator and status updates

- Results displayed inline: Accuracy %, Model ID, Status (Staging/Production), and direct link to Monitoring panel

**5.2 Monitoring Panel — Model Governance**

The Monitoring panel provides a full governance view of all deployed and staged models, with tools for ongoing management and optimisation.

**5.2.1 Model Identity & Status Header**

- Model ID, Model Name, Status tag (Production / Staging), Algorithm, Use Case, Creation Date

- Quick action buttons: Ingest (load new data), Deploy (push to HCP Engagement Console), Replace (swap production model)

**5.2.2 Model Health Metrics**

- Vulnerability Score — percentage risk of model degradation or data drift (progress bar, colour-coded: Green \<15%, Amber 15–25%, Red \>25%)

- False Negative Rate (FN) — proportion of true positive outcomes missed by the model

- False Positive Rate (FP) — proportion of negative outcomes incorrectly classified as positive

- Data Split — current train/test ratio in use

**5.2.3 Confusion Matrix**

- 2×2 confusion matrix displaying True Positive (TP), False Positive (FP), False Negative (FN), True Negative (TN)

- Supporting metrics: Precision, Recall, F1 Score

- Colour-coded values: TP/TN = green, FP/FN = red/amber

**5.2.4 Accuracy Gauge**

- Circular donut gauge displaying overall model accuracy as a percentage

- Colour coded: Green ≥75% (Acceptable), Amber 65–74% (Review Required), Red \<65% (Retrain Required)

**5.2.5 Model Significance Output**

- Tabular view of all model features: Feature Name, Co-efficient (positive = positive impact, negative = negative), p-value (statistical significance), Follow indicator (priority dot: teal = high priority, amber = moderate, grey = low)

- Enables data scientists and commercial managers to understand which variables are driving predictions

**5.2.6 Focus On Recommendations**

- ML-generated plain language recommendation identifying the highest-leverage features for field execution improvement

- e.g. 'Prioritise Email Open Rate and Digital Affinity Index — both show strong positive coefficients (p \< 0.01). Reducing cycle time between sales calls is estimated to improve conversion by 12–18%.'

**5.2.7 Tweak Panel**

- Inline hyperparameter adjustment: Test %, Train %, DATA volume, Ratio, Independent Variables (re-select), Target Variable (re-select), Co-variates

- 'Update' button triggers model re-training and refreshes all Monitoring metrics inline

**5.3 Recommendation Engine — Model Library**

A curated library of six ML algorithm families pre-configured for pharma commercial use cases:

| **Algorithm**             | **Best For**             | **Pharma Use Case**                                                                                                   |
|---------------------------|--------------------------|-----------------------------------------------------------------------------------------------------------------------|
| XGBoost                   | Structured HCP data      | HCP propensity to prescribe scoring. Fast training. High accuracy on tabular datasets with CRM features.              |
| Random Forest             | Large, complex datasets  | HCP segmentation (Champion/Loyalist/Growth/At-Risk). Handles non-linear relationships and correlated features.        |
| Deep Neural Network       | Multi-channel patterns   | Omnichannel engagement modelling. Captures complex interaction patterns across email, call, CLM, and 1:1 touchpoints. |
| Recurrent Neural Networks | Sequential & time-series | HCP journey sequence modelling. Prescribing trend forecasting. Temporal tactic pattern recognition.                   |
| Markov Decision Process   | Decision optimisation    | Optimal rep-HCP interaction sequence over time. Models the full HCP journey as decision states for NBA generation.    |
| Factorization Machines    | Sparse HCP data          | Recommendation where interaction history is limited. Cross-product HCP scoring with fragmented engagement records.    |

**6. Data Architecture & Integration**

**6.1 Data Source Connections**

| **System** | **Key Datasets**                                                                                               | **Integration Method**                                     | **Notes**                                     |
|------------|----------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|-----------------------------------------------|
| CRM        | HCP profiles, call records, email open rates, CLM events, sample activity, territory assignments               | REST API · Veeva Vault / Salesforce Health Cloud connector | Primary source for HCP interaction data       |
| ERP        | Sample inventory, sales orders, supply chain data, cost analytics, manufacturing KPIs                          | JDBC · SAP S/4HANA / Oracle connector                      | Source for sample cost and supply data        |
| DWH        | Historical sales (2+ years), market share data, trend analysis, competitive intelligence, territory benchmarks | SQL · Snowflake / BigQuery / Redshift                      | Long-term modelling and baseline data         |
| BI         | Dashboard KPIs, campaign performance, field force metrics, ROI reports, regional comparisons                   | Power BI API · Tableau REST · Qlik Sense                   | Downstream reporting and executive dashboards |

**6.2 Output Integration**

- CRM Push — NBA journey maps deployed to Veeva CRM / Salesforce as structured call plan activities, maintaining rep workflow continuity

- ERP Sync — Territory performance data written back to ERP for supply chain alignment and sample planning

- Workflow Integration — Tactic sequences exported to workflow management platforms (Veeva Vault, Salesforce Flow)

- BI Streaming — Model significance outputs and tactic performance metrics available via REST webhook for downstream BI dashboards

**7. Non-Functional Requirements**

**7.1 Performance**

| **Requirement**                            | **Target**                                                       |
|--------------------------------------------|------------------------------------------------------------------|
| Dashboard load time (ME Overview)          | \< 2 seconds for territories up to 300 HCPs                      |
| API response time (data fetch)             | \< 500ms (p95)                                                   |
| Model training time (standard use case)    | \< 10 minutes for datasets up to 5M rows on standard GPU compute |
| Model deployment to HCP Engagement Console | \< 5 minutes from Analytics Workbench 'Deploy' action            |
| Heat map rendering (50-state choropleth)   | \< 3 seconds on standard broadband connection                    |

**7.2 Security & Compliance**

- Role-based access control — ME users cannot access DS module; DS users cannot modify rep tactic records without Commercial Excellence approval

- Data encryption — AES-256 at rest; TLS 1.3 in transit

- Audit logging — All model deployments, data source accesses, and tactic plan modifications logged with timestamp, user ID, and IP

- HIPAA-aligned data handling — HCP-identifiable information handled under PHI protocols; no patient data stored

- MLR (Medical Legal Regulatory) tagging — Model-generated tactic recommendations flagged for MLR review gate before being surfaced to field teams in regulated markets

**7.3 Scalability**

- Support 10,000+ concurrent ME users globally across multi-tenant deployments

- Horizontal scaling via Kubernetes for model training and serving layer

- Tenant-level data isolation enforced at database schema level

- Multi-region deployment with data residency compliance (EU-GDPR, US, APAC)

**7.4 Usability & Accessibility**

- Mobile-responsive design — HCP Engagement Console optimised for tablet use in field settings; Analytics Workbench desktop-first

- No-code model creation — Analytics Workbench designed for commercial analytics profiles without Python/SQL requirements

- WCAG 2.1 AA compliance for all user-facing screens

- Colour-blind accessible status indicators — supplementary icons used alongside colour coding

**8. Product Roadmap**

| **Phase**              | **Timeline** | **Scope**                                                                                                                                                                                                       |
|------------------------|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Phase 1 — MVP          | Q1 2025      | HCP Engagement Console: Overview dashboard, HCP Status tracker, HCP Statics profile, Journey Map. Analytics Workbench: Create Model panel with CRM data source. CRM write-back integration.                     |
| Phase 2 — Core         | Q2 2025      | Analytics Workbench: Full Monitoring panel, Confusion Matrix, Significance Output, Tweak Panel, Deploy/Replace actions. HCP Engagement Console: Heat Map & Metrics, Performance & Target list. ERP integration. |
| Phase 3 — Scale        | Q3 2025      | Multi-product, multi-region field rollout. Model Library (all 6 algorithms). BI integration with streaming. Mobile-native ME app. Manager Analytics layer with cross-territory benchmarking.                    |
| Phase 4 — Intelligence | Q4 2025      | Real-time NBA adaptation (journey map auto-updates on HCP signal change). Multi-brand tactic optimisation engine. MLR compliance workflow integration. API marketplace for third-party CRM connectors.          |
| Phase 5 — Platform     | 2026         | Patient outcome correlation layer. Global regulatory-compliant deployment (EU, APAC). Automated model retraining on drift detection. Executive-facing Commercial Intelligence Board.                            |

**9. Acceptance Criteria by Module**

**9.1 HCP Engagement Console Module**

| **Feature**           | **Acceptance Criteria**                                                                                                                                                        |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Overview Dashboard    | Tactic completion data loads within 2s. Week filter changes all tactic KPI cards simultaneously. HCP row click navigates to HCP Statics.                                       |
| HCP Status Dot Matrix | Dot matrix reflects real-time completion status. Hovering a dot shows date/time of completion. NBA status updates when tactic plan changes.                                    |
| Journey Map           | Journey nodes display correct sequence from deployed model. 'Integrate' dropdown successfully posts journey to CRM sandbox. 'Add Tactic' inserts new node at correct position. |
| Heat Map              | Clicking a tactic updates the map within 3s. Report panel counts match filtered HCP data. Colour coding correctly represents responsiveness tiers.                             |

**9.2 Analytics Workbench Module**

| **Feature**        | **Acceptance Criteria**                                                                                                                                                                       |
|--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Create Model Panel | Data from at least 2 sources can be combined. Feature extraction dropdowns reflect selected data schema. 'Get Result' returns model metrics within 10 minutes.                                |
| Monitoring Panel   | All health metrics (FN, FP, Vulnerability, Accuracy) display correctly for each Model ID. Confusion matrix values sum correctly. Tweak Panel re-runs model in \< 15 minutes.                  |
| Deploy Action      | Clicking Deploy changes model status from Staging to Production. HCP Engagement Console reflects new NBA recommendations within 5 minutes of deployment. Audit log captures deployment event. |

**10. Open Items, Assumptions & Risks**

**10.1 Key Assumptions**

- HCP interaction data is available in CRM with minimum 18 months of historical records at weekly granularity

- Commercial analytics team has access to Snowflake DWH or equivalent for Analytics Workbench data source connectivity

- Organisation uses Veeva CRM or Salesforce Health Cloud as the primary CRM platform

- Field reps are issued tablets with minimum iOS 14 / Android 10 for HCP Engagement Console mobile access

**10.2 Open Items**

| **\#** | **Item**                            | **Detail**                                                                                                                                                 |
|--------|-------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1      | MLR Review Gate Design              | Exact workflow for MLR review of model-generated tactic content in regulated markets (EU, EM) requires alignment with Regulatory Affairs team.             |
| 2      | HCP Master Data Management          | MDM strategy for HCP identity resolution across CRM, ERP, and external data sources (IQVIA, Symphony Health) to be defined.                                |
| 3      | Analytics Workbench Compute Pricing | Pricing model for GPU compute usage in the Analytics Workbench (per model training run vs. monthly subscription) pending Commercial decision.              |
| 4      | Multi-Country Rollout Sequencing    | Deployment priority across US, EU5, and APAC markets to be confirmed. Data residency requirements differ per region.                                       |
| 5      | Field Rep Change Management         | Training programme, incentive alignment, and adoption tracking strategy for HCP Engagement Console field rollout to be co-developed with Sales Operations. |

**10.3 Risks**

- Data quality risk — Low HCP interaction data quality in CRM will degrade model accuracy. Mitigation: Data quality audit and remediation sprint required before Analytics Workbench training.

- Adoption risk — Field reps may resist NBA plan if it conflicts with existing relationships. Mitigation: NBA plan presented as recommendation, not mandate, with override capability.

- Model governance risk — Production models may drift without monitoring. Mitigation: Automated drift detection alerts in Monitoring panel (Phase 4).

— End of PRD —
