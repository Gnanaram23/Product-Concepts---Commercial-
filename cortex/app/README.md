# Cortex front-end prototype

Clickable prototype of the Cortex analyst experience, running on mock data. See the [Cortex README](../README.md) for the product concept.

**Stack:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts.

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

## Pages

| Page | File | What it shows |
|---|---|---|
| Home | `src/pages/Index.tsx` | Entry point and recent activity |
| Analyst workspace | `src/pages/AnalystWorkspace.tsx` | Ask a question, see the answer with its source tables and logic |
| Asset catalog | `src/pages/AssetCatalog.tsx` | Search datasets, dashboards and documents by business meaning |
| Data products | `src/pages/DataProducts.tsx` | Curated, governed datasets |
| Templates | `src/pages/Templates.tsx` | Reusable analysis templates |
| Workspaces | `src/pages/Workspaces.tsx` | Saved analyses by team |
| Requests | `src/pages/Requests.tsx` | Data access requests and approvals |
| Audit and trace | `src/pages/AuditTrace.tsx` | Lineage of every answer |
| Exports | `src/pages/ExportsReports.tsx` | Export and share results |
| Admin console | `src/pages/AdminConsole.tsx` | Users, roles and governance settings |
