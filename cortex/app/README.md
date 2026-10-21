# Cortex — Commercial Intelligence Platform

Cortex is a governed analytics workspace for pharma commercial teams. An
analyst asks a question in plain English, such as *"rebate exposure by
customer segment last quarter"*, and gets an answer with a table, a chart,
the exact SQL that produced it, the certified datasets it read and each step
the agent took.

It runs entirely in the browser. Hosting it needs nothing more than static
file hosting.

## What works

- **Analyst workspace** (`/workspaces/1`). Questions go through a semantic
  layer that holds governed definitions: gross sales, net sales, rebates,
  chargebacks, admin fees, units, gross-to-net %, net price per unit and
  contract count. The questions can be broken down by segment, product,
  category, region, customer, contract or quarter, and filtered by period.
  The generated SQL runs in the browser with AlaSQL.
- **Answers built from the result.** Totals, shares, change versus the
  previous period, trends, gross-to-net waterfalls, contracts with exception
  clauses and contracts due for renewal. Each number comes from a query shown
  in the SQL tab.
- **Governance.** Datasets carry an owner, a certification status and an
  access level. A question about the restricted `sales_performance` dataset is
  blocked before anything is queried, and the user is offered an access
  request.
- **Bring your own data.** Upload a CSV (up to 3 MB). It becomes an
  uncertified table that you can preview and query. The file is processed in
  the browser and never uploaded anywhere.
- **Optional LLM.** Under *Connect a model*, enter any OpenAI-compatible
  endpoint (OpenAI, Groq, OpenRouter, or a local Ollama server). The model is
  used for free-form questions the semantic layer cannot answer and for
  questions about uploaded data. Its SQL is checked before it runs: one
  read-only `SELECT`, permitted tables only. If the model fails, the semantic
  layer answers instead. Settings stay in your browser.

Questions to try:

- Summarize rebate exposure by customer segment for last quarter
- Compare net price waterfall across top 10 contracts
- Identify contracts with exception clauses related to renewal terms
- Show pricing trends by product category over the last 6 months
- Top 5 customers by rebates in the PBM channel
- Which contracts expire in the next 12 months?
- What data can I use?

### The data

The data is synthetic and generated from a fixed seed
([`src/engine/dataset.ts`](src/engine/dataset.ts)): 23 customers in six
channels (PBMs, Part D plans, GPOs, health systems, specialty pharmacies,
340B), six fictional brands and quarterly sales with gross-to-net deductions
from 2024 to 2025, including a January 2025 list price increase. The channel
economics are realistic in shape: deep rebates for PBMs, chargebacks for
340B, and admin fees for GPOs. No real company data is used.

## Run it

```bash
npm ci
npm run dev        # http://localhost:8080
npm run build      # static site in dist/
```

## Deploy

| Option | How |
|---|---|
| GitHub Pages | Settings > Pages > Source: **GitHub Actions**. The included workflow builds and publishes on every push (public repositories). |
| Netlify | Import the repository; `netlify.toml` is included. |
| Vercel | Import the repository; `vercel.json` is included. |
| Docker | `docker build -t cortex . && docker run -p 8080:80 cortex` |
| Any static host | `npm run build` and upload `dist/`. Route unknown paths to `index.html`. |

To serve the app from a sub-folder, set `BASE_PATH`, for example
`BASE_PATH=/cortex/ npm run build`.

## How it is built

```
src/engine/
  dataset.ts    synthetic, seeded data and table metadata (owner, certification, access)
  semantic.ts   governed measures and dimensions; question -> plan -> SQL
  engine.ts     runs SQL (AlaSQL), writes the summary, chart spec, sources and trace
  llm.ts        optional OpenAI-compatible model; SQL safety checks
  csv.ts        CSV parser for uploaded data
src/components/workspace/AnswerView.tsx   result text, table and charts (Recharts)
src/pages/AnalystWorkspace.tsx            the workspace UI
```

React, TypeScript, Vite, Tailwind, shadcn/ui, Recharts, AlaSQL.

The other screens (data products, asset catalog, requests, templates,
exports, audit trace and admin console) are clickable product designs with
sample content.
