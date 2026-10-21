# Life Sciences Product Concepts

Four product concepts for pharma and biotech commercial teams. Each one starts from a real workflow problem in pharma commercial operations and goes from problem statement to product requirements to a working prototype.

**[Try all four in your browser](https://gnanaram23.github.io/Product-Concepts---Commercial-/)**. No sign-up is needed, and everything runs on synthetic data.

| Concept | The problem it solves | Who uses it | What's in the folder | Live prototype |
|---|---|---|---|---|
| [**Cortex**](cortex/) | Commercial analysts spend more time finding and validating data than analysing it | Pricing, contracting, market access and brand analytics teams | Concept doc, PRD, screens, React app with a semantic layer and in-browser SQL | [Open](https://gnanaram23.github.io/Product-Concepts---Commercial-/cortex/workspaces/1) |
| [**Pharma Action Builder**](pharma-action-builder/) | Data science models rarely reach field reps in a form they can act on | Field reps, commercial analytics, commercial excellence | Concept doc, PRD, screens, HTML prototype that trains NBA models in the browser | [Open](https://gnanaram23.github.io/Product-Concepts---Commercial-/pharma-action-builder/) |
| [**ClearAuth**](clearauth/) | Prior authorization delays therapy starts and burns provider time | Providers, patients, payers | Concept doc, PRD, process flow, screens, full-stack app with a coverage-policy engine | [Open](https://gnanaram23.github.io/Product-Concepts---Commercial-/clearauth/) |
| [**GVD Process Map**](gvd/) | Building a Global Value Dossier involves a dozen teams and no single view of the process | Market access, HEOR, medical affairs | Interactive process map | [Open](https://gnanaram23.github.io/Product-Concepts---Commercial-/gvd/) |

<p>
  <img src="cortex/screens/workspace-live-query.png" width="49%" alt="Cortex answering a rebate question with SQL and sources" />
  <img src="pharma-action-builder/screens/02-hec-overview.png" width="49%" alt="Pharma Action Builder field console" />
  <img src="clearauth/screens/provider-dashboard.png" width="49%" alt="ClearAuth provider dashboard" />
  <img src="pharma-action-builder/screens/15-awb-trained-model.png" width="49%" alt="Pharma Action Builder trained model with next best actions" />
</p>

## Terms used in this repo

- **HCP**: healthcare professional, usually the prescribing physician a pharma company engages with.
- **NBA (Next Best Action)**: a recommendation for the single most useful next interaction with an HCP, such as an email, a rep visit or a webinar invite, chosen by a model.
- **Prior authorization (PA)**: an insurer's requirement that a doctor get approval before a drug is covered. **Re-authorization** is the renewal of that approval.
- **Payer**: the insurer or pharmacy benefit manager that pays for the drug.
- **GVD (Global Value Dossier)**: the master evidence document a manufacturer builds to prove a drug's clinical and economic value to payers and health technology assessment (HTA) bodies in each country.
- **PRD (Product Requirements Document)**: the spec that defines what a product must do, for whom, and how success is measured.

## How each concept folder is organised

```
<concept>/
├── README.md     problem, users, features, status
├── docs/         concept document and PRD (.md to read on GitHub, .docx originals)
├── screens/      UI screenshots
└── app/ or prototype/   source code for the prototype
```

## Run your own copy

Fork the repository, enable Actions, and set **Settings → Pages → Source** to **GitHub Actions**. The included workflow builds all four prototypes into one site with a landing page. Netlify, Vercel, Docker and Render configs are included as well, along with optional LLM settings. Step-by-step instructions are in **[DEPLOY.md](DEPLOY.md)**.

## What is real in each prototype

| Prototype | Working logic | Still mock |
|---|---|---|
| Cortex | Semantic layer → SQL → in-browser query engine over seeded contracting data; traced answers, charts, governance checks, CSV upload, optional LLM | Catalog, requests, admin and audit screens |
| ClearAuth | Case workflow across three roles; coverage-policy engine; grounded assistant; same API in the browser or on a Node server; optional LLM | Illustrative payer policies; no real FHIR submission or authentication |
| Pharma Action Builder | Four ML algorithms trained in the browser; held-out evaluation; expected-value NBA policy | Engagement console data; CRM integration |
| GVD Process Map | Interactive process content | Not a workflow tool yet |

## Status and honesty notes

- All four are **concept-stage prototypes**. They run on synthetic data and are not connected to real CRM, claims or payer systems.
- Impact figures in the concept documents (for example "40–60% reduction in data discovery time") are **target hypotheses** to be tested in a pilot, not measured results.
- Prototypes were built with AI-assisted development tools (Lovable, Replit) from the requirements I wrote. The product thinking, workflows and requirements are mine.

## About me

I'm Gnanaram M, a solutions consultant working on commercial and market access problems for US pharma and biotech. See my [GitHub profile](https://github.com/Gnanaram23) for analytics projects, or connect on [LinkedIn](https://linkedin.com/in/gnanaram/).
