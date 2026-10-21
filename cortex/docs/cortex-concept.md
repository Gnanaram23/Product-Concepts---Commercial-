<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>CORTEX</strong></p>
<p>Commercial Intelligence Platform</p>
<p><strong>PRODUCT CONCEPT DOCUMENT</strong></p>
<p>Version 1.0 • Public concept • Pharmaceutical Commercial Intelligence</p></td>
</tr>
</tbody>
</table>

|                                                                                                                                                                                                                 |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| This document describes the product concept, strategic rationale, target users, core capabilities, and long-term vision for Cortex — a governed AI assistant purpose-built for pharmaceutical commercial teams. |

|                          |
|--------------------------|
| **DOCUMENT INFORMATION** |

|                    |                                             |
|--------------------|---------------------------------------------|
| **Field**          | **Value**                                   |
| **Document Title** | Cortex — Product Concept Document           |
| **Version**        | 1.0 (Initial Release)                       |
| **Status**         | Concept draft                               |
| **Classification** | Public portfolio concept                    |
| **Audience**       | Product, Engineering, Commercial Leadership |
| **Last Updated**   | 2025                                        |
| **Owner**          | Product Management                          |

|                       |
|-----------------------|
| **EXECUTIVE SUMMARY** |

**Concept Summary**

Cortex is a governed AI assistant purpose-built for pharmaceutical commercial teams. It transforms natural language business questions into trusted, explainable insights derived from enterprise data assets — without requiring users to understand technical schemas, write queries, or navigate complex BI tooling.

The system operates as a commercial intelligence layer that spans the full analytical workflow: understanding business intent, discovering relevant governed data assets, generating deterministic analytical logic, and returning business-ready outputs with full source transparency.

Unlike general-purpose AI tools, Cortex is designed specifically for the commercial pharmaceutical context — where data governance, KPI consistency, and regulatory traceability are non-negotiable. It bridges the gap between the business user who has a question and the governed enterprise data that contains the answer.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Design Principle</strong></p>
<p>Cortex is not a black-box AI. Every insight it generates is traceable to a specific data source, query, and business definition. This explainability is foundational — not an afterthought.</p></td>
</tr>
</tbody>
</table>

|                 |
|-----------------|
| **THE PROBLEM** |

**The Problem Cortex Solves**

Pharmaceutical commercial organizations sit on vast, multi-system data estates — yet the speed and quality of commercial decision-making remains chronically limited by friction in the analytical process. The root cause is not a lack of data; it is a lack of accessible, governed intelligence.

**1. Fragmented Data Environments**

Commercial data is spread across dozens of disconnected systems: rebate management platforms, claims feeds, CRM tools, contract repositories, market access dashboards, gross-to-net models, and third-party syndicated sources. Each system has its own schema, access model, and data dictionary.

Finding the right dataset for a given question often requires tribal knowledge — knowing which system owns which slice of truth, who to ask for access, and how to interpret that system's data model. New analysts face a steep ramp; experienced ones remain bottlenecks.

**2. Inconsistent KPI Definitions**

"Net price," "contract compliance," "market share," and "covered lives" mean different things to different teams. A brand team's definition of net price may exclude certain chargebacks that a contracting team includes. Without a governed semantic layer, the same question asked by two teams can yield two different answers — eroding organizational trust in data.

This definitional inconsistency consumes enormous analyst time in reconciliation, version control of metric definitions, and stakeholder alignment. It also creates significant compliance and audit risk when regulatory submissions depend on consistent data.

**3. Dependence on Technical Teams**

Most commercial users — brand managers, pricing analysts, market access teams — do not have the SQL fluency or system access needed to self-serve answers. They submit requests to data engineering or analytics teams, who prioritize, queue, and eventually fulfill them. This process commonly takes days to weeks.

The result is a two-tier organization: those who can access data and those who cannot. Strategic decisions are made with stale information, or not made at all pending analysis that arrives too late.

**4. Manual, Repetitive Analysis Workflows**

Even when analysts have the skills and access to answer a question, the process is laborious. Identifying the relevant tables, joining across sources, applying the correct business filters, validating output against known benchmarks, formatting results, and writing a narrative — this workflow can take hours or days per question.

Much of this work is repetitive: the same joins, the same filters, the same KPI logic applied to slightly different time windows or market segments. There is no institutional memory that learns from repeated questions and accelerates future answers.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Scale of Impact</strong></p>
<ul>
<li><p>Commercial data teams report 40–60% of analyst time is spent on data discovery and preparation rather than insight generation</p></li>
<li><p>Average time to answer a business question requiring cross-system data: 3–7 business days</p></li>
<li><p>KPI definition misalignment is cited as a top-3 data quality concern in pharma commercial organizations</p></li>
<li><p>Analyst attrition is elevated in roles dominated by repetitive query work rather than strategic analysis</p></li>
</ul></td>
</tr>
</tbody>
</table>

|                     |
|---------------------|
| **THE OPPORTUNITY** |

**The Opportunity**

A convergence of enterprise AI capabilities, metadata management maturity, and organizational readiness creates the conditions for a step-change in commercial intelligence. Cortex is designed to capture this opportunity at exactly the right moment.

**Enabling Technologies**

|                                       |                                                                                                                                                                                                                                    |                                                       |
|---------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|
| **Technology**                        | **Capability**                                                                                                                                                                                                                     | **Cortex Role**                                       |
| **Large Language Models**             | LLMs can now parse natural language business questions and map them to structured analytical intent with high reliability. Intent disambiguation, entity recognition, and context retention have reached enterprise-grade quality. | Core query understanding and intent resolution engine |
| **Enterprise Metadata Catalogs**      | Platforms like Collibra, Alation, and Informatica have matured to the point where governed metadata — business definitions, lineage, ownership, access policies — is reliably available at scale.                                  | Asset discovery and governance enforcement layer      |
| **Deterministic SQL Generation**      | AI-assisted SQL generation now reliably produces governed, auditable queries when grounded in structured metadata. The gap between natural language intent and correct query logic has narrowed dramatically.                      | Safe, explainable analysis execution                  |
| **Vector Search & Semantic Matching** | Embedding-based search enables semantic matching between a user’s question and relevant datasets, even when terminology differs between the question and the catalog.                                                              | Robust asset discovery across terminology variations  |
| **Role-Based Access Enforcement**     | Modern data platforms support fine-grained, API-accessible access control that Cortex can enforce programmatically, ensuring analysis never surfaces unauthorized data.                                                            | Trust and compliance foundation                       |

**Market Timing**

Pharmaceutical commercial organizations are under mounting pressure to increase analytics velocity while reducing cost. Patent cliffs, biosimilar competition, and payer sophistication are compressing commercial margins and requiring faster, more granular commercial decisions.

At the same time, data team headcount growth has plateaued while data volume continues to expand. Self-service commercial intelligence is no longer a nice-to-have — it is a strategic necessity.

Cortex enters the market at a moment when: (1) the underlying AI technology is sufficiently mature for production deployment, (2) commercial organizations have invested in the data infrastructure Cortex requires, and (3) business users are actively seeking alternatives to manual, delayed analytics workflows.

|                  |
|------------------|
| **TARGET USERS** |

**Who Cortex Is For**

Cortex serves a layered user population across pharmaceutical commercial operations. Primary users are business-facing analysts who own commercial questions. Secondary users are data governance and platform stakeholders who enable and oversee the system.

**Primary Users**

|                                    |                                                                                                                                                                                          |                                                                                                                          |
|------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| **User Type**                      | **Core Responsibilities & Questions**                                                                                                                                                    | **Cortex Fit**                                                                                                           |
| **Pricing & Contracting Analysts** | Manage gross-to-net models, rebate structures, and contract performance. Frequent questions around rebate variance, contract compliance, net price trends, and earned vs. paid analysis. | High data complexity, low SQL fluency. Need fast answers across rebate, claims, and contract systems.                    |
| **Market Access Analysts**         | Track formulary coverage, payer mix, and access change events. Analyze impact of coverage decisions on volume and net revenue.                                                           | Time-sensitive questions during formulary season. Need cross-system views combining coverage, claims, and contract data. |
| **Commercial Operations Analysts** | Support field force performance tracking, territory alignment, and call activity analysis. Integrate CRM data with sales and claims.                                                     | High query volume, often repetitive. Strong candidates for automated insight templates.                                  |
| **Brand Analytics Teams**          | Produce performance narratives for brand reviews, LRP inputs, and ad hoc leadership requests. Synthesize data from multiple commercial sources.                                          | Need business-narrative outputs, not raw data. High value from Cortex’s summarization and charting capabilities.         |

**Secondary Users**

|                                |                                                                                                                                                                        |                                                                                                                                                         |
|--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| **User Type**                  | **Role & Responsibilities**                                                                                                                                            | **Relationship to Cortex**                                                                                                                              |
| **Data & Analytics Leaders**   | Own the commercial analytics function. Responsible for analytics quality, team productivity, and stakeholder satisfaction. Set KPI governance standards.               | Use Cortex as a force multiplier. Monitor usage patterns to identify high-value insight themes and governance gaps.                                     |
| **Data Stewards**              | Govern metadata, business definitions, and data quality standards. Own the semantic layer that Cortex depends on.                                                      | Critical enablers. Cortex’s reliability is directly proportional to metadata quality. Stewards curate and validate the catalog entries Cortex surfaces. |
| **Platform Engineering Teams** | Manage the data infrastructure: warehouses, pipelines, access controls, and catalog platforms. Responsible for Cortex’s technical integration and runtime reliability. | Integration partners. Responsible for the APIs, query execution environments, and access enforcement that Cortex relies on.                             |

|                       |
|-----------------------|
| **CORE CAPABILITIES** |

**Key Product Capabilities**

Cortex’s capabilities are organized around the end-to-end analytical workflow: from the moment a user poses a business question to the moment they receive a governed, explainable insight.

**Capability 1: Natural Language Analytics Interface**

Users interact with Cortex using the same language they use in meetings, emails, and slide decks. There is no requirement to know table names, field definitions, or query syntax. Cortex accepts questions in conversational form and handles the translation to structured analytical logic internally.

The interface supports follow-up questions, clarification dialogues, and context retention within a session. If a user asks "What drove rebate variance last quarter?" and follows up with "Break that down by payer segment," Cortex maintains context and refines the analysis accordingly.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Supported Interaction Patterns</strong></p>
<ul>
<li><p>Direct analytical questions: “Which contracts underperformed their compliance targets last year?”</p></li>
<li><p>Comparative analysis: “Compare net price per unit across our top 5 payer segments for 2023 vs. 2024.”</p></li>
<li><p>Trend and variance: “What drove the $4.2M rebate variance in Q3 vs. Q2?”</p></li>
<li><p>Coverage and access: “How has formulary tier placement changed for Brand X across commercial payers in the Southeast?”</p></li>
<li><p>Document queries: “Summarize the key terms and performance milestones in the Cigna contract.”</p></li>
<li><p>Multi-turn refinement: Follow-up questions that narrow, expand, or reframe previous analysis.</p></li>
</ul></td>
</tr>
</tbody>
</table>

**Capability 2: Metadata-Driven Asset Discovery**

Cortex does not query a fixed set of pre-configured datasets. Instead, it dynamically discovers relevant assets by querying the enterprise metadata catalog. This means Cortex can surface newly catalogued datasets without any system reconfiguration, and its coverage expands organically as the catalog grows.

Discovery is powered by semantic matching: the user’s question is embedded and compared against catalog entries, business term definitions, and asset descriptions. This enables Cortex to find the right dataset even when the user’s terminology differs from the catalog’s formal vocabulary.

|                         |                                                                                                              |
|-------------------------|--------------------------------------------------------------------------------------------------------------|
| **Discovery Feature**   | **Description**                                                                                              |
| **Catalog Integration** | Connects to enterprise metadata platforms (Collibra, Alation, AWS Glue, Microsoft Purview) via standard APIs |
| **Semantic Matching**   | Embeds both the question and catalog entries to match on meaning, not just keywords                          |
| **Lineage Awareness**   | Uses data lineage to prefer upstream, authoritative sources over derived or aggregated copies                |
| **Freshness Signals**   | Incorporates data recency metadata to flag or prefer more recently updated assets                            |
| **Access Filtering**    | Filters discovered assets to only those the requesting user is authorized to access                          |
| **Confidence Scoring**  | Ranks discovered assets by relevance confidence and surfaces the rationale for each recommendation           |

**Capability 3: Governed SQL Generation & Execution**

Once relevant assets are identified, Cortex generates deterministic SQL queries aligned to the organization’s governed business definitions. Queries are not black-box LLM outputs — they are grounded in the metadata catalog and traceable to specific field definitions, filter logic, and join conditions.

Every query Cortex generates is logged, attributable, and replayable. This auditability is critical for pharmaceutical organizations where data used in commercial decisions may need to be reproduced for compliance, audit, or payer dispute resolution.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Governance Safeguards in Query Generation</strong></p>
<ul>
<li><p>Business term resolution: metric definitions (e.g., “net price”) are resolved to governed field-level logic before query generation</p></li>
<li><p>Filter validation: date ranges, product hierarchies, and segment filters are validated against catalog-defined valid values</p></li>
<li><p>Join safety: join conditions are derived from catalog-defined relationships, not LLM inference</p></li>
<li><p>Row-level security: access policies are enforced at query execution time, not as a post-processing filter</p></li>
<li><p>Query review: generated SQL is surfaced to the user for optional inspection before execution</p></li>
</ul></td>
</tr>
</tbody>
</table>

**Capability 4: Explainable Outputs & Source Transparency**

Every Cortex result is accompanied by a full explanation of how it was produced: which datasets were used, which business definitions were applied, what filters and aggregations were performed, and what assumptions were made. This is not optional metadata — it is a core part of every output.

This transparency serves multiple functions: it builds user trust in AI-generated insights, enables rapid QA by analysts, supports audit and compliance requirements, and allows business users to identify when Cortex’s interpretation of their question diverged from their intent.

|                                 |                                                                                                         |
|---------------------------------|---------------------------------------------------------------------------------------------------------|
| **Output Component**            | **Description**                                                                                         |
| **Insight Summary**             | Plain-language narrative describing the key finding and its business significance                       |
| **Source Attribution**          | Named datasets, tables, and fields used in the analysis, with links to catalog entries                  |
| **Business Definition Display** | The exact KPI definitions and business rules applied, sourced from the governed catalog                 |
| **Query Transparency**          | The generated SQL query, available for analyst review and export                                        |
| **Assumption Documentation**    | Any assumptions Cortex made (e.g., defaulting to calendar year vs. fiscal year) are explicitly surfaced |
| **Confidence Indicators**       | Signal strength of the analysis, flagging cases where data quality or coverage may limit reliability    |
| **Visualization Layer**         | Charts, tables, and trend lines generated from the query results, formatted for business presentation   |

**Capability 5: Document Intelligence**

Not all commercial intelligence lives in structured databases. Contracts, market access submissions, formulary documents, clinical summaries, and payer coverage policies are critical inputs to commercial decision-making but exist in unstructured form.

Cortex’s Document Intelligence capability enables users to upload or reference documents and ask questions about their content. The system extracts, indexes, and reasons over document content, and can combine document-derived insights with structured data analysis in a single response.

- Supported formats: PDF, Excel, CSV, Word documents

- Use cases: contract term extraction, compliance milestone tracking, formulary coverage summarization, policy comparison

- Hybrid analysis: “Compare the rebate tier thresholds in this contract draft against our actual Q3 performance.”

**Capability 6: Access-Aware & Governed Execution**

Cortex enforces enterprise access controls at every layer of the analytical workflow. Asset discovery is filtered to only surface datasets the requesting user is authorized to access. Query execution respects row-level security policies defined in the underlying data platform. Results are never cached and shared across users in ways that could expose unauthorized data.

This governance-first architecture means Cortex can be deployed to a broad commercial user population without creating new data access risk. The system does not grant access — it operates within the access boundaries already defined by the organization.

|                      |
|----------------------|
| **HOW CORTEX WORKS** |

**System Architecture Overview**

Cortex is architected as a layered intelligence pipeline. Each layer transforms the user’s raw question into progressively more structured analytical output, with governance checks applied at every transition.

|                                    |                                                                                                                                                                                                              |                                                                      |
|------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------|
| **Pipeline Layer**                 | **Function**                                                                                                                                                                                                 | **Technology Approach**                                              |
| **Layer 1: Intent Understanding**  | Natural language processing layer that parses the user’s question, identifies analytical intent, resolves business entities (products, payers, time periods), and determines the type of analysis requested. | LLM with commercial pharmaceutical domain tuning + entity resolution |
| **Layer 2: Asset Discovery**       | Semantic search against the enterprise metadata catalog to identify relevant datasets, dashboards, and documents. Filters by access authorization and ranks by relevance confidence.                         | Vector embeddings + catalog API integration + RBAC enforcement       |
| **Layer 3: Query Planning**        | Translates resolved intent into a structured query plan: which assets to query, which business definitions to apply, what joins and filters to construct, and what output format to produce.                 | Governed query planner grounded in metadata + business term registry |
| **Layer 4: Execution**             | Executes the query plan against authorized data sources with full audit logging. Applies row-level security at execution time. Returns raw results to the synthesis layer.                                   | SQL execution engine + data platform connectors + audit log          |
| **Layer 5: Insight Synthesis**     | Transforms raw query results into business-ready outputs: plain-language narrative, charts, tables, and source attribution. Applies consistency checks against known benchmarks.                             | LLM synthesis + visualization engine + QA checks                     |
| **Layer 6: Output & Traceability** | Delivers the final insight to the user interface with full provenance documentation: sources used, definitions applied, query generated, assumptions made.                                                   | Structured output renderer + provenance packager                     |

|                    |
|--------------------|
| **BUSINESS VALUE** |

**Business Value**

Cortex delivers business value across three dimensions: speed (faster insight generation), quality (more consistent and trustworthy outputs), and scale (broader access to analytical capability without proportional headcount growth).

**Quantified Value Drivers**

|                               |                                                                                                                                                                                           |                                                                    |
|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|
| **Value Driver**              | **Current State Problem**                                                                                                                                                                 | **Cortex Impact**                                                  |
| **Insight Generation Speed**  | Commercial teams currently wait 3–7 days for cross-system analysis. Cortex targets same-session answers for most commercial questions.                                                    | Time-to-insight reduction of 60–80% for standard queries           |
| **Dataset Discovery Time**    | Analysts spend an estimated 30–40% of query time identifying the right data source. Cortex eliminates this step through automated semantic discovery.                                     | 40–60% reduction in time spent on data discovery                   |
| **Analyst Capacity**          | By automating routine query and formatting work, Cortex frees analysts to focus on strategic interpretation, model development, and stakeholder engagement.                               | 20–30% increase in effective analyst capacity                      |
| **KPI Consistency**           | Cortex resolves all metrics through the governed catalog, enforcing consistent definitions across every query. This eliminates the reconciliation work caused by definition misalignment. | 25–40% reduction in KPI discrepancy incidents                      |
| **Onboarding Acceleration**   | New analysts can access commercial insights from day one without needing to learn data system schemas or wait for access provisioning.                                                    | Estimated 4–8 week reduction in time-to-productivity for new hires |
| **Compliance Risk Reduction** | Every Cortex query is logged, attributed, and reproducible. This auditability reduces risk in payer disputes, audit responses, and regulatory submissions.                                | Qualitative risk reduction in data reproducibility incidents       |

**Strategic Value**

Beyond the operational metrics, Cortex represents a strategic shift in how pharmaceutical commercial organizations relate to their data assets. The transition from a “data access” model (where insight depends on who you know and what you can query) to a “data intelligence” model (where any qualified user can access governed insights on demand) is a fundamental competitive differentiator.

Organizations that achieve this transition can respond faster to market events, align commercial strategy with real-time performance data, and build a culture of data-informed decision-making that compounds over time.

|                                |
|--------------------------------|
| **EXAMPLE BUSINESS QUESTIONS** |

**Example Business Questions**

The following examples illustrate the breadth and depth of commercial questions Cortex is designed to answer. They span the key commercial domains served by the platform.

**Pricing & Contracting**

|                               |                                                                                                                    |                                                                          |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| **Question Type**             | **Example Question**                                                                                               | **Data Sources Required**                                                |
| **Rebate Variance Analysis**  | What drove the \$6.2M negative rebate variance in Q3 2024 vs. Q3 2023? Break it down by contract and tier.         | Combines contract terms, claims volume, and earned/paid rebate data      |
| **Contract Compliance**       | Which of our top 20 payer contracts missed their market share compliance thresholds last quarter, and by how much? | Joins claims market share data with contract compliance tier definitions |
| **Net Price Trend**           | Show me net price per unit for Brand X across our top 10 payers over the last 8 quarters.                          | Gross-to-net model + payer-level claims aggregation                      |
| **Chargeback Reconciliation** | Are there any significant discrepancies between our submitted chargebacks and what the wholesaler is reporting?    | Joins internal submission data with wholesaler chargeback feeds          |

**Market Access**

|                              |                                                                                                                        |                                                                 |
|------------------------------|------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| **Question Type**            | **Example Question**                                                                                                   | **Data Sources Required**                                       |
| **Coverage Change Tracking** | How did formulary tier placement for Brand X change across our top 15 commercial payers between January and June 2024? | Formulary database + payer roster + time-series coverage events |
| **Access Impact Analysis**   | What is the estimated volume impact of the UnitedHealth Group tier 3 restriction that went into effect in Q2?          | Coverage events + claims volume + market share model            |
| **Covered Lives Reporting**  | What percentage of covered commercial lives have unrestricted access to Brand X today, by plan type?                   | Current formulary coverage database + covered lives data        |
| **Payer Landscape Summary**  | Summarize the current formulary access landscape for Brand X vs. Competitor Y across national commercial payers.       | Competitive formulary intelligence + coverage database          |

**Commercial Operations**

|                          |                                                                                                                                          |                                                              |
|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|
| **Question Type**        | **Example Question**                                                                                                                     | **Data Sources Required**                                    |
| **Field Performance**    | Which territories are underperforming vs. their Q3 sales quota, and what’s the primary driver — call frequency or market share?          | CRM call data + territory quota model + claims data          |
| **Account Targeting**    | Identify the top 50 high-potential accounts in the Southeast region that our reps have called on fewer than 3 times in the last quarter. | CRM call logs + account potential model + territory roster   |
| **Promotional Response** | Did the Q2 speaker program correlate with a measurable volume lift in the target accounts vs. control accounts?                          | CRM program data + claims volume + control group methodology |

|                      |
|----------------------|
| **LONG-TERM VISION** |

**Long-Term Vision**

Cortex is conceived as a foundational platform, not a point solution. The MVP represents the first phase of a multi-year evolution toward a fully semantic commercial intelligence platform — one that combines structured analytics, unstructured document reasoning, predictive modeling, and cross-domain knowledge graphs.

**Phase 1: Natural Language Analytics (MVP)**

The foundational release establishes the core capability: natural language question → governed SQL → explainable insight. This phase proves the value proposition, establishes the governance model, and builds the user trust required for broader adoption.

- Natural language query interface with context retention

- Metadata-driven dataset discovery via enterprise catalog integration

- Governed SQL generation and execution with full auditability

- Explainable outputs with source attribution

- Document intelligence for unstructured content

- Access-aware execution with RBAC enforcement

**Phase 2: Semantic Enrichment & Knowledge Graph**

The second phase extends the semantic layer from metadata-driven discovery to ontological reasoning. Cortex develops a commercial knowledge graph that maps the relationships between products, payers, contracts, indications, competitors, and market events — enabling cross-domain inference that current systems cannot support.

- Commercial ontology: formal definitions of product, payer, channel, contract, and market concepts

- Knowledge graph: maps relationships and dependencies across commercial domains

- Cross-domain inference: answers questions that require reasoning across multiple data domains simultaneously

- Proactive insight suggestions: Cortex identifies emerging patterns and surfaces them without being asked

**Phase 3: Predictive & Prescriptive Intelligence**

The third phase adds forward-looking analytical capability. Rather than only answering “what happened,” Cortex begins to answer “what is likely to happen” and “what should we do.”

- Predictive volume and market share modeling grounded in historical patterns

- Contract scenario modeling: “If we offer tier 2 to Aetna at a 3% higher rebate, what is the net revenue impact?”

- Formulary event impact forecasting

- Prescriptive recommendations: surfacing highest-impact commercial actions based on current data patterns

**Phase 4: Enterprise Intelligence Platform**

In its mature form, Cortex becomes the authoritative commercial intelligence layer for the organization — the system of record for commercial questions, the semantic standard for KPI definitions, and the primary interface through which commercial users interact with enterprise data.

- Integration with enterprise planning and decision systems

- Real-time intelligence: continuous monitoring of commercial KPIs with automated alerting

- Cross-functional intelligence: extending beyond commercial to medical, regulatory, and supply chain data domains

- External data integration: incorporating syndicated, payer, and public data alongside enterprise sources

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>Vision Statement</strong></p>
<p>Cortex will become the intelligence layer that allows every pharmaceutical commercial professional to ask any business question and receive a governed, explainable, and actionable answer — in seconds, not days.</p></td>
</tr>
</tbody>
</table>

|                            |
|----------------------------|
| **RISKS & CONSIDERATIONS** |

**Key Risks & Mitigations**

|                                 |                                                                                                                                                                                                 |                                                                                                                                                                      |
|---------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Risk**                        | **Description**                                                                                                                                                                                 | **Mitigation**                                                                                                                                                       |
| **Metadata Quality Dependency** | Cortex’s reliability is directly proportional to the quality and completeness of the enterprise metadata catalog. Sparse or inaccurate catalog entries will produce unreliable asset discovery. | Phased rollout starting with the highest-quality catalog domains. Data steward engagement model. Cortex surfaces catalog gaps as a governance improvement signal.    |
| **User Trust in AI Outputs**    | Business users may distrust AI-generated insights, particularly for high-stakes decisions. Over-reliance or under-reliance are both failure modes.                                              | Explainability as a core feature, not a footnote. QA mode for analyst review. Confidence indicators that signal when human review is warranted.                      |
| **LLM Hallucination Risk**      | General-purpose LLMs can generate plausible but incorrect SQL or insight narratives. This risk is acute in high-precision analytical contexts.                                                  | Query grounding in metadata: all SQL is derived from catalog-defined structures, not LLM inference. Output validation against known benchmarks.                      |
| **Access Control Complexity**   | Complex, legacy RBAC models may not translate cleanly to Cortex’s access enforcement layer, creating either access gaps or over-restriction.                                                    | Access enforcement inherits from existing platform controls rather than replicating them. Governance team reviews access model during onboarding.                    |
| **Change Management**           | Commercial users accustomed to requesting analysis from data teams may not immediately adopt self-service workflows.                                                                            | Embedded champions in each commercial function. Demonstrable wins in Phase 1 to build organic adoption. Data team positioned as Cortex configurers, not competitors. |
