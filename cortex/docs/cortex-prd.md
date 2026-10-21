<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>CORTEX</strong></p>
<p>Commercial Intelligence Platform</p>
<p><strong>PRODUCT REQUIREMENTS DOCUMENT</strong></p>
<p>Version 1.0 • Public concept • Pharmaceutical Commercial Intelligence</p></td>
</tr>
</tbody>
</table>

|                                                                                                                                                                                                                                                 |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| This document defines the product requirements, functional specifications, user stories, acceptance criteria, technical constraints, and success metrics for Cortex v1.0. It is intended for product, engineering, and commercial stakeholders. |

|                             |
|-----------------------------|
| **DOCUMENT ADMINISTRATION** |

**Document Administration**

**Document Metadata**

|                    |                                                                         |
|--------------------|-------------------------------------------------------------------------|
| **Field**          | **Value**                                                               |
| **Document Title** | Cortex — Product Requirements Document                                  |
| **Document Type**  | Product Requirements Document (PRD)                                     |
| **Version**        | 1.0 — Initial Release                                                   |
| **Status**         | Concept draft                                                           |
| **Classification** | Public portfolio concept                                                |
| **Audience**       | Product Management, Engineering, D&A Leadership, Commercial Pilot Users |
| **Owner**          | Product Management                                                      |
| **Review Cycle**   | Quarterly, or upon material scope change                                |

**Revision History**

|             |          |                                        |                    |
|-------------|----------|----------------------------------------|--------------------|
| **Version** | **Date** | **Description**                        | **Author**         |
| **1.0**     | 2025     | Initial release for stakeholder review | Product Management |

**RACI Matrix**

The following RACI defines accountability across key Cortex workstreams:

|                         |                      |                                    |                    |
|-------------------------|----------------------|------------------------------------|--------------------|
| **Workstream**          | **Responsible**      | **Consulted**                      | **Informed**       |
| **Product Strategy**    | Product Management   | Commercial Leadership              | Engineering, D&A   |
| **Requirements**        | Product Management   | Commercial Leadership, D&A Leaders | Engineering        |
| **Technical Design**    | Engineering Lead     | Product Management                 | Data Stewards      |
| **Catalog Integration** | D&A / Data Stewards  | Engineering                        | Product Management |
| **QA & Testing**        | Engineering / QA     | Product Management                 | Commercial Pilots  |
| **Deployment**          | Platform Engineering | Product Management                 | Commercial Ops     |
| **Ongoing Governance**  | Data Stewards        | D&A Leaders                        | Product Management |

|                                  |
|----------------------------------|
| **OVERVIEW & PROBLEM STATEMENT** |

**Product Overview**

Cortex is an AI-powered commercial intelligence assistant designed for pharmaceutical commercial teams. It converts business questions expressed in natural language into governed, explainable insights by discovering relevant enterprise data assets, generating deterministic analysis logic, enforcing access controls, and delivering business-ready outputs with full source transparency.

Cortex is not a general-purpose AI chatbot. It is purpose-built for the pharmaceutical commercial context, where data governance, KPI consistency, regulatory traceability, and payer relationship sensitivity are foundational requirements. Every design decision in Cortex reflects these constraints.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Core Value Proposition</strong></p>
<p>Any commercial user can ask any business question in plain language and receive a governed, explainable, and actionable insight — in seconds, not days, without technical support, and with full audit traceability.</p></td>
</tr>
</tbody>
</table>

**Problem Statement**

Pharma commercial organizations operate across fragmented system landscapes — pricing platforms, rebate management tools, contracting systems, claims data feeds, CRM applications, formulary databases, and BI dashboards. Despite substantial data infrastructure investment, the following structural problems persist:

|                                  |                                                                                                                                                                                     |                                                                                                                              |
|----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| **Problem Area**                 | **Description**                                                                                                                                                                     | **Business Impact**                                                                                                          |
| **Data Fragmentation**           | Commercial data is distributed across 10–20+ disconnected systems, each with its own schema, access model, and data dictionary. No unified semantic layer exists to connect them.   | Users cannot find the right data without tribal knowledge of which system owns which slice of truth.                         |
| **KPI Inconsistency**            | Metric definitions (net price, contract compliance, covered lives, market share) vary by team and system. The same question yields different answers depending on who runs it.      | Erosion of organizational trust in data. Significant reconciliation effort. Compliance and audit risk.                       |
| **Technical Bottlenecks**        | Business users lack the SQL fluency or system access to self-serve. Analytical requests are queued through data engineering teams, creating 3–7 day latency for standard questions. | Commercial decisions made with stale data. Analyst teams consumed by routine query work rather than strategic analysis.      |
| **Manual Workflow Inefficiency** | Even skilled analysts spend 30–40% of query time on data discovery, schema navigation, and output formatting rather than on insight generation.                                     | Compressed analytical capacity. Analyst attrition in high-volume query roles. Limited scalability of the analytics function. |
| **Governance Risk**              | Ad hoc queries using inconsistent definitions, undocumented joins, and ungoverned data sources create reproducibility and audit risk for commercial decisions.                      | Payer dispute vulnerability. Regulatory submission risk. Leadership confidence undermined by conflicting data narratives.    |

|                               |
|-------------------------------|
| **PRODUCT VISION & STRATEGY** |

**Product Vision**

Cortex will become the intelligence layer that allows every pharmaceutical commercial professional — regardless of technical skill — to access governed, explainable, and actionable answers to their business questions on demand.

The long-term vision is a semantic commercial intelligence platform that combines natural language understanding, enterprise metadata governance, deterministic analytics, and knowledge graph reasoning to enable cross-domain analytical inference at enterprise scale.

**Strategic Principles**

|                                           |                                                                                                                                                                              |
|-------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Principle**                             | **Description**                                                                                                                                                              |
| **Governance First**                      | Every Cortex output is grounded in governed data assets and business definitions. Ungoverned inference is a product defect, not a feature.                                   |
| **Explainability by Default**             | Users never receive a result without understanding how it was produced. Provenance is a core component of every response, not optional metadata.                             |
| **Access as a First-Class Concern**       | Cortex operates within, not around, the organization’s access control model. No query is executed against an asset the requesting user is not authorized to access.          |
| **Analyst Augmentation, Not Replacement** | Cortex makes analysts faster and more strategic. It automates the routine and surfaces the relevant; analysts provide judgment, context, and interpretation.                 |
| **Progressive Trust**                     | Cortex earns organizational trust through consistent, accurate, auditable outputs. User confidence builds over time as the system demonstrates reliability.                  |
| **Catalog-Driven Intelligence**           | The quality of Cortex’s outputs is a direct function of the quality of the enterprise metadata catalog. Cortex is designed to improve catalog quality as a byproduct of use. |

|                  |
|------------------|
| **TARGET USERS** |

**Target Users**

Cortex serves a structured user population across pharmaceutical commercial operations. User personas are defined by their analytical responsibilities, data access patterns, and technical fluency profiles.

**Primary User Personas**

|                                   |                                                                                                                                                                                                                                                                                                                                      |                                                                                                                                                                                    |
|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Persona**                       | **Role & Context**                                                                                                                                                                                                                                                                                                                   | **Cortex Fit & Adoption Profile**                                                                                                                                                  |
| **Pricing & Contracting Analyst** | Manages gross-to-net models, rebate structures, and contract performance tracking. Primary questions involve rebate variance, earned vs. paid analysis, compliance rates, and net price trends. Data systems: rebate management, claims, contract databases. Technical fluency: low to moderate SQL. High business domain expertise. | High-frequency, high-complexity queries. Strong early adopter for Cortex due to pain of cross-system joins. High risk tolerance for AI-assisted analysis with governed guardrails. |
| **Market Access Analyst**         | Tracks formulary coverage, payer tier placement, covered lives, and access change events. Analyzes impact of coverage decisions on volume and net revenue. Data systems: formulary databases, covered lives, claims, payer rosters. Technical fluency: low SQL. High familiarity with payer data sources.                            | Time-sensitive during formulary season. Values speed and recency. Document intelligence use case highly relevant (formulary PDFs, coverage policies).                              |
| **Commercial Ops Analyst**        | Supports field force performance: territory quotas, call activity, account targeting, promotional response analysis. Data systems: CRM (Veeva), claims, territory models, speaker programs. Technical fluency: moderate. Regular user of BI tools.                                                                                   | High query volume, often repetitive. Strong candidate for Cortex query templates. Values operational efficiency over analytical depth.                                             |
| **Brand Analytics Lead**          | Produces performance narratives for brand reviews, LRP, and leadership requests. Synthesizes data across commercial domains into business narrative. Data systems: all commercial systems. Owns the analytical narrative. Technical fluency: high. Manages data team relationship.                                                   | Values output quality and credibility. Will scrutinize Cortex provenance closely. Key internal champion if Cortex earns trust. Decision-maker for team adoption.                   |

**Secondary User Personas**

|                            |                                                                                                                                                               |                                                                                                                                                                       |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Persona**                | **Role**                                                                                                                                                      | **Relationship to Cortex**                                                                                                                                            |
| **D&A / Analytics Leader** | Owns the commercial analytics function. Sets KPI governance standards, manages data team capacity, and reports on analytics quality to commercial leadership. | Monitors Cortex usage to identify high-value insight themes, governance gaps, and team capacity reallocation opportunities. Advocates for catalog quality investment. |
| **Data Steward**           | Governs metadata, business definitions, and data quality standards. Owns the semantic layer that Cortex depends on for governed query generation.             | Critical Cortex enabler. Reviews Cortex definition usage logs to identify gaps and inconsistencies. Treats Cortex as a governance quality signal.                     |
| **Platform Engineer**      | Manages data infrastructure: warehouses, pipelines, catalog platforms, and access controls. Responsible for Cortex integration reliability.                   | Integration partner. Responsible for API connectivity, service account management, query execution environments, and row-level security configuration.                |

|                       |
|-----------------------|
| **CORE CAPABILITIES** |

**Core Capabilities**

Cortex’s capabilities are organized around the end-to-end analytical workflow. Each capability is designed to eliminate a specific class of friction in the commercial intelligence process.

**1. Natural Language Query Interface**

Users interact with Cortex using natural language — the same language used in business conversations, emails, and slide decks. The system handles intent parsing, entity resolution (products, payers, geographies, time periods), and analytical type classification without user instruction.

|                        |                                                                                                                                 |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| **Feature**            | **Description**                                                                                                                 |
| **Intent Parsing**     | Identifies the analytical question type: trend, comparison, variance, ranking, coverage, or document query                      |
| **Entity Resolution**  | Resolves business entities (brand names, payer names, regions, time periods) against catalog-defined hierarchies and aliases    |
| **Context Retention**  | Maintains conversational context across a session, enabling follow-up refinement without restating the full question            |
| **Disambiguation**     | Detects ambiguous questions and presents the user with interpretation options before proceeding                                 |
| **Error Handling**     | Gracefully handles unanswerable questions with a clear explanation of why and a suggestion for a reformulated query             |
| **Question Templates** | Pre-built question templates for the most common commercial question types, accessible via guided UI for less-experienced users |

**2. Metadata-Driven Asset Discovery**

Cortex discovers relevant data assets dynamically through the enterprise metadata catalog rather than relying on a fixed, pre-configured dataset registry. This enables Cortex’s coverage to expand organically as the catalog grows, and ensures that asset discovery reflects current governance status.

|                            |                                                                                                                              |
|----------------------------|------------------------------------------------------------------------------------------------------------------------------|
| **Feature**                | **Description**                                                                                                              |
| **Semantic Matching**      | Embeds both the parsed question and catalog entries to find relevant assets based on meaning, not keyword overlap            |
| **Lineage-Aware Ranking**  | Prefers upstream, authoritative data sources over derived or aggregated copies, using catalog lineage metadata               |
| **Access Filtering**       | Applies RBAC filtering at discovery time — only authorized assets are surfaced to the requesting user                        |
| **Freshness Signaling**    | Incorporates data recency signals from catalog metadata to prefer more recently updated assets and flag staleness            |
| **Multi-Asset Synthesis**  | Identifies cases where multiple assets must be combined to answer the question and plans the join strategy accordingly       |
| **Discovery Transparency** | Displays which assets were considered, why each was included or excluded, and the confidence score for the top-ranked assets |

**3. Governed SQL Generation & Execution**

SQL query generation in Cortex is deterministic and governed: all metric definitions, join conditions, and filter logic are derived from the metadata catalog, not from LLM inference. This is a foundational design constraint that ensures auditability, reproducibility, and compliance.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Governance Constraint — Non-Negotiable</strong></p>
<p>Cortex will never infer join conditions, metric definitions, or business filters from LLM training data. Every element of a generated query must be traceable to a catalog-defined source. Any query that cannot be fully grounded in catalog metadata will surface an error rather than generating an ungoverned query.</p></td>
</tr>
</tbody>
</table>

**4. Explainable Outputs & Source Transparency**

Every Cortex response includes a structured provenance panel. This is not optional and cannot be dismissed by the user in the MVP release. The provenance panel is a governance artifact as much as a user experience feature.

|                          |                                                                                         |
|--------------------------|-----------------------------------------------------------------------------------------|
| **Output Component**     | **Description**                                                                         |
| **Insight Narrative**    | Plain-language summary of the key finding and its business significance                 |
| **Source Attribution**   | Named datasets, tables, and fields used, with links to catalog entries                  |
| **Definitions Applied**  | The exact business term definitions resolved from the catalog, with version date        |
| **Query Display**        | Generated SQL, available for review and download                                        |
| **Assumption Log**       | Any system-generated assumptions (e.g., default to calendar year) explicitly displayed  |
| **Confidence Indicator** | High / Medium / Low, with plain-language explanation of factors                         |
| **Data Freshness**       | Last-refresh timestamp for each source dataset referenced                               |
| **Visualization**        | Chart, table, or trend line generated from results, formatted for business presentation |

**5. Document Intelligence**

Document Intelligence extends Cortex’s analytical reach to unstructured content — contracts, formulary documents, coverage policies, clinical summaries, and market access submissions. Users can upload documents or reference indexed document repositories, and Cortex integrates document-derived content with structured data analysis.

- Supported formats: PDF, Excel (.xlsx/.xls), CSV, Word (.docx)

- File size limit: 50MB per upload in MVP

- Indexed document repositories: SharePoint, Confluence, S3 (authorized repositories only)

- Hybrid query support: combine document content with structured database analysis in a single response

- Citation support: document-derived claims include page-level source citations

**6. Access-Aware Execution & Governance Enforcement**

Cortex does not manage access control — it enforces the access control model defined by the enterprise. This distinction is critical: Cortex operates as a governed consumer of enterprise access policies, not as an access management system.

|                           |                                                                                                             |
|---------------------------|-------------------------------------------------------------------------------------------------------------|
| **Governance Feature**    | **Description**                                                                                             |
| **RBAC Enforcement**      | All asset discovery and query execution filtered by user’s role-based access rights from enterprise IdP     |
| **Row-Level Security**    | RLS policies enforced at query execution time via data platform integration, not as post-processing filters |
| **Catalog Status Checks** | Queries blocked against assets marked ‘restricted’ or ‘decommissioned’ in the catalog                       |
| **No Cross-User Caching** | Query results are not cached and shared across users in ways that could expose unauthorized data            |
| **Audit Trail**           | All queries logged with user identity, timestamp, assets accessed, and SQL generated                        |
| **Data Minimization**     | Cortex requests only the data fields necessary to answer the specific question — no broad table scans       |

|                                        |
|----------------------------------------|
| **USER STORIES & ACCEPTANCE CRITERIA** |

**User Stories & Acceptance Criteria**

The following user stories define the primary interaction scenarios for Cortex MVP. Each story includes acceptance criteria that must be satisfied for the story to be considered complete. Priority follows MoSCoW methodology: P0 = Must Have (MVP blocking), P1 = Should Have, P2 = Nice to Have.

|                            |                                                                                                                                                                 |                                                                                                                                                                             |          |
|----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| **User Role**              | **User Story**                                                                                                                                                  | **Acceptance Criteria**                                                                                                                                                     | **Pri.** |
| **Pricing Analyst**        | I want to ask about rebate variance in plain English and receive a detailed breakdown by contract, so I can identify the root cause without running SQL.        | Response includes contract-level breakdown, governed metric definitions used, source datasets cited, and generated query available for review. Response time \< 30 seconds. | **P0**   |
| **Market Access Analyst**  | I want to see current formulary tier coverage for our brand across all commercial payers, so I can prepare for the quarterly access review.                     | Coverage data sourced from most recent formulary update. Payer list completeness \> 95% of covered commercial lives. Date of last catalog refresh displayed.                | **P0**   |
| **Brand Analytics Lead**   | I want to ask a follow-up question that narrows a prior analysis by geography, so I can drill into regional performance without starting over.                  | Cortex retains session context across at least 5 turns. Follow-up question resolves against prior query state. Refined result produced within 20 seconds.                   | **P0**   |
| **Commercial Ops Analyst** | I want to upload a contract PDF and ask Cortex to extract the rebate tier thresholds and compliance milestones, so I can compare them to actual performance.    | PDF content correctly extracted and indexed. Tier thresholds and milestones accurately identified with page-level citations. Hybrid structured/document analysis supported. | **P1**   |
| **Data Steward**           | I want to see which business term definitions Cortex is applying to each query, so I can verify governance compliance and correct any definition drift.         | Every Cortex response includes a ‘Definitions Used’ panel showing resolved business terms, their catalog source, and last-updated date.                                     | **P1**   |
| **D&A Leader**             | I want a usage dashboard showing which questions are being asked most frequently, so I can identify high-value insight themes and governance improvement areas. | Dashboard shows query volume by user type, question theme, and dataset accessed. Refreshed daily. Accessible to D&A leadership role.                                        | **P2**   |
| **Pricing Analyst**        | I want Cortex to flag when my question cannot be answered with high confidence due to data quality issues, so I don’t make decisions on unreliable output.      | Confidence indicator displayed on every response. Low-confidence responses include explicit warning with reason (data staleness, coverage gap, definition ambiguity).       | **P1**   |

|                             |
|-----------------------------|
| **FUNCTIONAL REQUIREMENTS** |

**Functional Requirements**

The following functional requirements define the specific system behaviors Cortex must exhibit. Requirements are classified using MoSCoW: Must (MVP-blocking), Should (high priority, MVP target), Could (if time permits), Won’t (explicitly out of scope for MVP).

|           |                           |                                                                                                                                                                         |            |                                                                       |
|-----------|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|-----------------------------------------------------------------------|
| **ID**    | **Capability**            | **Requirement**                                                                                                                                                         | **MoSCoW** | **Notes**                                                             |
| **FR-01** | **NL Query Interface**    | The system shall accept business questions expressed in natural language and parse them into structured analytical intent without requiring SQL or schema knowledge.    | **Must**   | Supports English; multi-language in future phases                     |
| **FR-02** | **NL Query Interface**    | The system shall retain session context across a minimum of 10 conversational turns within a single session, enabling follow-up questions and iterative refinement.     | **Must**   | Context window scoped to session; no cross-session persistence in MVP |
| **FR-03** | **NL Query Interface**    | The system shall present a disambiguation prompt when a question is ambiguous, offering the user two or more interpretation options before proceeding.                  | **Must**   | Reduces incorrect query generation for ambiguous terms                |
| **FR-04** | **Asset Discovery**       | The system shall query the enterprise metadata catalog to identify candidate datasets, dashboards, and documents relevant to the parsed analytical intent.              | **Must**   | MVP: Collibra and AWS Glue integrations; others in backlog            |
| **FR-05** | **Asset Discovery**       | The system shall filter discovered assets to only those the requesting user is authorized to access, based on the enterprise RBAC model.                                | **Must**   | Access filtering applied pre-query; never post-filter                 |
| **FR-06** | **Asset Discovery**       | The system shall rank discovered assets by semantic relevance and display a confidence score and rationale for the top-ranked asset.                                    | **Should** | Confidence score methodology documented in technical spec             |
| **FR-07** | **SQL Generation**        | The system shall generate deterministic SQL queries grounded in catalog-defined field definitions, joins, and filter logic.                                             | **Must**   | LLM inference of join conditions explicitly prohibited                |
| **FR-08** | **SQL Generation**        | The system shall resolve all business metric references (e.g., ‘net price’, ‘contract compliance’) to their governed catalog definitions before generating query logic. | **Must**   | Metric resolution log displayed to user in explainability panel       |
| **FR-09** | **SQL Generation**        | The system shall surface the generated SQL query to the user for optional review prior to execution, with a one-click execute confirmation.                             | **Should** | Advanced users may disable this step in settings                      |
| **FR-10** | **Explainability**        | Every response shall include a provenance panel documenting: datasets used, business definitions applied, filters executed, and any assumptions made.                   | **Must**   | Provenance panel is non-dismissable in MVP                            |
| **FR-11** | **Explainability**        | The system shall display a confidence indicator (High / Medium / Low) for each response, with a plain-language explanation of factors affecting confidence.             | **Must**   | Low confidence responses must include specific reason                 |
| **FR-12** | **Explainability**        | The system shall display the timestamp of the most recent data refresh for each source dataset referenced in the response.                                              | **Must**   | Sourced from catalog metadata; flagged if \> 7 days                   |
| **FR-13** | **Document Intelligence** | The system shall accept user-uploaded documents in PDF, Excel (.xlsx), CSV, and Word (.docx) formats and extract their content for analytical use.                      | **Must**   | File size limit: 50MB. Content indexed at upload time.                |
| **FR-14** | **Document Intelligence** | The system shall support hybrid queries that combine structured database analysis with document-derived content in a single response.                                   | **Should** | e.g., ‘Compare contract terms in this PDF to our Q3 actuals’          |
| **FR-15** | **Output Formatting**     | The system shall deliver results as a combination of plain-language narrative summary, data tables, and visualizations appropriate to the question type.                | **Must**   | Visualization types: bar, line, table. Pie charts excluded in MVP.    |
| **FR-16** | **Output Formatting**     | The system shall support export of results to Excel and PDF formats, including the provenance panel.                                                                    | **Should** | Export triggers download; no email or share functionality in MVP      |
| **FR-17** | **Governance & Audit**    | The system shall log all queries, resolved datasets, generated SQL, and output summaries to an immutable audit trail accessible to governance administrators.           | **Must**   | Audit log retention: 7 years minimum per compliance policy            |
| **FR-18** | **Governance & Audit**    | The system shall prevent query execution against assets that are marked as ‘restricted’ or ‘decommissioned’ in the metadata catalog.                                    | **Must**   | Catalog status check performed at query planning time                 |

|                                 |
|---------------------------------|
| **NON-FUNCTIONAL REQUIREMENTS** |

**Non-Functional Requirements**

Non-functional requirements define the operational, performance, and compliance characteristics that Cortex must meet. These requirements apply to the full production system at general availability.

|                         |                                                                                                                                                                                                 |                                                                                                                       |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| **NFR Category**        | **Requirement**                                                                                                                                                                                 | **Notes & Measurement**                                                                                               |
| **Response Latency**    | Standard analytical queries (single-source, \< 1M rows): response delivered within 30 seconds end-to-end. Complex multi-source queries: within 90 seconds. Document queries: within 45 seconds. | Measured at 95th percentile under normal load. SLO degradation alerts triggered at 80s for standard queries.          |
| **System Availability** | 99.5% uptime during core business hours (7am–8pm local user time, Monday–Friday). Planned maintenance windows permitted on weekends with 48-hour advance notice.                                | Uptime calculated excluding scheduled maintenance. Incident escalation threshold: 15-minute outage.                   |
| **Scalability**         | System shall support concurrent usage by up to 500 simultaneous users without performance degradation below the latency SLO. Peak load target: 2,000 queries per hour.                          | Load tested pre-launch. Auto-scaling configured for cloud deployment. Peak load defined as Q4 annual planning season. |
| **Security**            | All data in transit encrypted via TLS 1.3 minimum. All data at rest encrypted via AES-256. No query results stored in Cortex application layer beyond session duration.                         | Security architecture reviewed by Information Security prior to MVP launch. Pen test required pre-production.         |
| **Access Control**      | User identity and role membership sourced from enterprise IdP (Okta or equivalent) via SAML 2.0 or OIDC. Session tokens expire after 8 hours of inactivity.                                     | Role-to-dataset access mapping maintained in enterprise IAM. Cortex does not maintain a separate access registry.     |
| **Data Residency**      | Query execution and result storage must comply with data residency requirements: US data processed in US-East AWS regions. EU data (future) in EU-West regions.                                 | Data residency configuration reviewed by Legal & Compliance prior to any international deployment.                    |
| **Auditability**        | All queries, results, and user actions logged to immutable audit store. Log records include: user ID, timestamp, question text, resolved assets, generated SQL, output hash.                    | Audit logs retained for 7 years minimum. Accessible only to designated governance administrators.                     |
| **Accessibility**       | Web interface shall conform to WCAG 2.1 Level AA accessibility standards.                                                                                                                       | Accessibility audit required before general availability release.                                                     |

|                              |
|------------------------------|
| **INTEGRATION REQUIREMENTS** |

**Integration Requirements**

Cortex requires integration with the following enterprise systems. Integration priority and sequencing are aligned to the MVP and phased rollout plan. All integrations are read-only from Cortex’s perspective unless explicitly stated otherwise.

|                                  |                                                              |                                                                                                                                                              |
|----------------------------------|--------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Integration Category**         | **Target Systems**                                           | **Integration Approach & Notes**                                                                                                                             |
| **Enterprise Metadata Catalog**  | Collibra (primary), AWS Glue Data Catalog, Microsoft Purview | REST API integration. Business glossary, asset inventory, lineage, and access policy APIs required. Read-only access from Cortex.                            |
| **Data Warehouse / Lakehouse**   | Snowflake (primary), Databricks, AWS Redshift                | JDBC / native connector. Query execution via service account with row-level security pass-through. No data replication into Cortex.                          |
| **Identity Provider**            | Okta (primary), Azure AD, PingFederate                       | SAML 2.0 or OIDC. User identity and group membership synchronized at login. Group membership used for RBAC enforcement.                                      |
| **CRM Systems**                  | Veeva CRM, Salesforce Health Cloud                           | API integration for field activity data. Read-only. Account, call, and territory data surfaced for commercial operations queries.                            |
| **Rebate & Contract Management** | Model N, Revitas, CPSA                                       | Data feed or API integration. Contract terms, rebate tiers, and earned/paid data required for pricing analytics use cases.                                   |
| **Claims Data Platforms**        | IQVIA, Symphony Health, Komodo Health                        | Data feed integration (S3 or SFTP). Claims volume, market share, and prescriber data. Refresh cadence: weekly minimum.                                       |
| **BI & Reporting Platforms**     | Tableau, Power BI, MicroStrategy                             | Metadata integration only: catalog Tableau/Power BI assets so Cortex can surface existing dashboards as discovery results. No query execution into BI tools. |
| **Document Storage**             | SharePoint, Confluence, S3 / Azure Blob                      | Document indexing integration. Cortex indexes authorized document repositories on a scheduled basis. Access-aware indexing enforced.                         |

|                     |
|---------------------|
| **SUCCESS METRICS** |

**Success Metrics**

The following metrics define how Cortex’s success will be measured. Metrics are tracked from GA launch and reviewed quarterly. Governance metrics (audit completeness, governance compliance rate) are tracked continuously and escalated immediately upon deviation.

|                                |                                                                                                         |                                                                                                                                               |
|--------------------------------|---------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| **Metric**                     | **Definition**                                                                                          | **Measurement Approach & Target**                                                                                                             |
| **Time-to-Insight**            | Average time from business question to analytical response                                              | Current baseline: 3–7 days. Target: \< 30 seconds for standard queries. Measured by session log analysis.                                     |
| **Dataset Discovery Time**     | Time analysts spend identifying the correct data source for a given question                            | Current baseline: 30–40% of query time. Target: eliminated (automated by Cortex). Proxy: time between session open and first query execution. |
| **Analyst Productivity**       | Volume of analytical questions answered per analyst per week                                            | Current baseline: TBD from time-tracking data. Target: 20–30% increase within 90 days of adoption.                                            |
| **KPI Discrepancy Incidents**  | Number of escalations caused by conflicting metric definitions across teams                             | Current baseline: tracked via helpdesk. Target: 25–40% reduction within 6 months. Sourced from helpdesk ticket analysis.                      |
| **User Adoption Rate**         | Percentage of target user population with at least one Cortex session per week                          | Target: 60% of primary users actively using Cortex within 60 days of GA launch.                                                               |
| **Query Success Rate**         | Percentage of user questions that result in a delivered analytical response (vs. error or no-result)    | Target: \> 85% success rate at GA. Measured from session logs. Failures categorized for product improvement.                                  |
| **User Satisfaction**          | Quarterly NPS survey of Cortex users, segmented by user type and use case                               | Target NPS: \> 40 at 90 days post-GA. Qualitative themes tracked alongside score.                                                             |
| **Governance Compliance Rate** | Percentage of queries that resolve all metrics through governed catalog definitions (vs. LLM inference) | Target: 100%. Any deviation from governed resolution triggers alert and incident review.                                                      |
| **Audit Completeness**         | Percentage of queries with complete, immutable audit records                                            | Target: 100%. Measured continuously. Any gap triggers immediate escalation.                                                                   |

|                     |
|---------------------|
| **PRODUCT ROADMAP** |

**Product Roadmap**

The Cortex roadmap is organized into five phases. Each phase builds on the prior, expanding capability, coverage, and user reach. Timeline estimates assume on-time delivery of Phase 0 technical foundation.

<table>
<colgroup>
<col style="width: 14%" />
<col style="width: 14%" />
<col style="width: 50%" />
<col style="width: 19%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>Phase</strong></td>
<td><strong>Timeline</strong></td>
<td><strong>Key Features &amp; Deliverables</strong></td>
<td><strong>Milestone</strong></td>
</tr>
<tr class="even">
<td><strong>Phase 0</strong></td>
<td><strong>M1–M2</strong></td>
<td><ul>
<li><p>Technical foundation and infrastructure setup</p></li>
<li><p>Enterprise catalog API integration (Collibra + AWS Glue)</p></li>
<li><p>Data warehouse connectors (Snowflake primary)</p></li>
<li><p>Identity provider integration (Okta)</p></li>
<li><p>Security architecture review and pen test</p></li>
<li><p>Pilot user group onboarding (3–5 users)</p></li>
</ul></td>
<td><strong>Foundation Complete</strong></td>
</tr>
<tr class="odd">
<td><strong>Phase 1 MVP</strong></td>
<td><strong>M3–M5</strong></td>
<td><ul>
<li><p>Natural language query interface (web)</p></li>
<li><p>Metadata-driven asset discovery</p></li>
<li><p>Governed SQL generation and execution</p></li>
<li><p>Explainable outputs with provenance panel</p></li>
<li><p>Document intelligence (PDF, Excel, CSV)</p></li>
<li><p>Access-aware execution with RBAC enforcement</p></li>
<li><p>Audit logging and compliance infrastructure</p></li>
</ul></td>
<td><strong>MVP Launch (Pilot Group)</strong></td>
</tr>
<tr class="even">
<td><strong>Phase 2</strong></td>
<td><strong>M6–M8</strong></td>
<td><ul>
<li><p>General availability rollout to all commercial users</p></li>
<li><p>Session context and multi-turn refinement</p></li>
<li><p>Confidence indicators and data quality signals</p></li>
<li><p>Export to Excel and PDF</p></li>
<li><p>Usage analytics dashboard for D&amp;A leaders</p></li>
<li><p>Additional catalog integrations (Purview, Alation)</p></li>
<li><p>Performance optimization for 500+ concurrent users</p></li>
</ul></td>
<td><strong>General Availability</strong></td>
</tr>
<tr class="odd">
<td><strong>Phase 3</strong></td>
<td><strong>M9–M14</strong></td>
<td><ul>
<li><p>Commercial knowledge graph (product, payer, contract ontology)</p></li>
<li><p>Cross-domain inference engine</p></li>
<li><p>Predictive volume and market share modeling</p></li>
<li><p>Contract scenario modeling and simulation</p></li>
<li><p>Proactive insight suggestions</p></li>
<li><p>Formulary event impact forecasting</p></li>
</ul></td>
<td><strong>Semantic Intelligence</strong></td>
</tr>
<tr class="even">
<td><strong>Phase 4</strong></td>
<td><strong>M15+</strong></td>
<td><ul>
<li><p>Real-time KPI monitoring and alerting</p></li>
<li><p>Prescriptive commercial recommendations</p></li>
<li><p>External data integration (IQVIA, Symphony)</p></li>
<li><p>Cross-functional extension (medical, supply chain)</p></li>
<li><p>Enterprise planning system integration (Anaplan, Veeva)</p></li>
<li><p>Multi-language support</p></li>
</ul></td>
<td><strong>Enterprise Platform</strong></td>
</tr>
</tbody>
</table>

|                         |
|-------------------------|
| **RISKS & MITIGATIONS** |

**Risks & Mitigations**

|                                           |                                                                                                                                                                                                                                                                                             |                                                                                                                                                                                                                                                        |
|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Risk**                                  | **Description**                                                                                                                                                                                                                                                                             | **Mitigation**                                                                                                                                                                                                                                         |
| **Catalog Quality Dependency**            | Cortex’s reliability is directly proportional to the quality and completeness of the enterprise metadata catalog. Sparse, stale, or inaccurate catalog entries will produce unreliable asset discovery and incorrect metric resolution. This is the single highest risk to product quality. | Phased rollout beginning with catalog domains that have the highest data steward engagement and governance maturity. Cortex surfaces catalog gaps as actionable governance signals. Data steward involvement in onboarding is mandatory, not optional. |
| **LLM Hallucination in Query Generation** | General-purpose LLMs can generate plausible but incorrect SQL or analytical narratives. In a high-precision commercial analytics context, a confident but wrong answer is worse than no answer.                                                                                             | All SQL generation grounded in catalog metadata, not LLM inference. Metric resolution always catalog-first. Confidence indicators explicitly flag low-confidence responses. Analyst review mode available for all queries.                             |
| **User Trust Adoption Curve**             | Commercial users accustomed to manual workflows or data team support may distrust AI-generated insights, particularly for high-stakes decisions. Slow adoption undermines the business case.                                                                                                | Explainability is a core feature, not a footnote. Early pilot with trusted power users to generate organic advocacy. Clear communication of what Cortex does and does not do. Formal feedback loop to close quality gaps quickly.                      |
| **Access Control Complexity**             | Complex, legacy RBAC models may not cleanly translate to Cortex’s access enforcement layer. This could create either access gaps (data exposure) or over-restriction (reduced utility).                                                                                                     | Platform engineering review of access model before integration. Cortex inherits existing platform controls rather than replicating them. Access model audit required pre-launch. Any access gap treated as a blocking defect.                          |
| **Data Freshness Gaps**                   | If source datasets are not refreshed on a schedule aligned to user expectations, Cortex may return stale results without clear flagging. This erodes trust and utility.                                                                                                                     | Freshness metadata required for all integrated catalog assets. Data freshness displayed on every response. Queries against assets not refreshed within a configurable threshold trigger a staleness warning.                                           |
| **Regulatory & Compliance Risk**          | Insights generated by Cortex may inform commercial decisions with regulatory implications (e.g., Medicaid rebate submissions, government pricing). Errors in these contexts carry material compliance risk.                                                                                 | Governance team reviews high-sensitivity use cases before GA. Cortex explicitly flags use cases where output should not be used without human analyst validation. Audit trail supports any regulatory reproduction request.                            |
| **Change Management & Adoption**          | Data teams may perceive Cortex as a threat to their role. Without their buy-in, the catalog quality and integration reliability that Cortex depends on may be actively undermined.                                                                                                          | Data team positioned as Cortex configurers, curators, and quality owners — not as service providers being replaced. Cortex’s success is framed as their success: higher-value work, better catalog recognition, reduced routine query burden.          |
