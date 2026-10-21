# Running and hosting the prototypes

Every prototype runs in a browser on synthetic data. Nothing needs an
account, a database or an API key. ClearAuth can also run as a Node server,
and it and Cortex can use an LLM if you connect one.

| Prototype | Folder | Type | Needs to build? |
|---|---|---|---|
| Cortex | `cortex/app` | React single-page app | Yes (`npm`) |
| ClearAuth | `clearauth/app` | React app + Express API (pnpm monorepo) | Yes (`pnpm`) |
| Pharma Action Builder | `pharma-action-builder/prototype` | Two static files | No |
| GVD Process Map | `gvd/gvd-process-map.html` | One static file | No |

## 1. All four on GitHub Pages (free, about 5 minutes)

The workflow in [`.github/workflows/pages.yml`](.github/workflows/pages.yml)
builds everything into one site with a landing page.

1. **Fork** this repository (or use your own copy).
2. **Settings → Actions → General:** allow actions. On a fork, open the
   **Actions** tab and click the button that enables workflows.
3. **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**.
4. **Actions → Deploy prototypes to GitHub Pages → Run workflow**, or push
   any commit to `main`.

When it finishes, the site is at `https://<your-user>.github.io/<repo-name>/`:

| Path | Opens |
|---|---|
| `/` | Landing page |
| `/cortex/workspaces/1` | Cortex analyst workspace |
| `/clearauth/` | ClearAuth (in-browser demo mode) |
| `/pharma-action-builder/` | Pharma Action Builder |
| `/gvd/` | GVD Process Map |

Deep links such as `/clearauth/payer/cases` work. GitHub Pages serves
`404.html` for unknown paths, and that page hands the route back to the
right app.

GitHub Pages is free for public repositories. A private repository needs a
paid plan.

## 2. One app on Netlify or Vercel

Import the repository and set the **base directory** to the app's folder.
Each folder already has its config.

| App | Base directory | Config used |
|---|---|---|
| Cortex | `cortex/app` | `netlify.toml` / `vercel.json` |
| ClearAuth (demo mode) | `clearauth/app` | `netlify.toml` / `vercel.json` |
| Pharma Action Builder | `pharma-action-builder/prototype` | none needed (publish the folder) |
| GVD | `gvd` | none needed |

You can also drag `pharma-action-builder/prototype` or `gvd` onto
[Netlify Drop](https://app.netlify.com/drop).

## 3. ClearAuth as a full server

The server runs the API and serves the web app on one port. Data lives in
memory and resets on restart.

**Docker**

```bash
cd clearauth/app
docker build -t clearauth .
docker run -p 8080:8080 clearauth          # http://localhost:8080
```

**Render (free plan).** In Render, choose *New → Blueprint* and pick this
repository. The root [`render.yaml`](render.yaml) builds
`clearauth/app/Dockerfile`.

**Without Docker**

```bash
cd clearauth/app
corepack enable
pnpm install
pnpm run build:app
pnpm start                                 # http://localhost:8080
```

## 4. Connecting an LLM (optional)

Both apps work without an LLM. To add one, use any OpenAI-compatible Chat
Completions endpoint.

**ClearAuth (server side, key never reaches the browser).** Set these
environment variables on the server:

```bash
LLM_API_KEY=sk-...                         # OpenAI; base URL defaults to https://api.openai.com/v1
# or a free local model:
LLM_BASE_URL=http://localhost:11434/v1     # Ollama
LLM_MODEL=llama3.2
```

With Docker Compose, `docker compose --profile llm up` starts Ollama next to
the app. Pull a model once with
`docker compose exec ollama ollama pull llama3.2` and set
`LLM_BASE_URL=http://ollama:11434/v1`. See
[`clearauth/app/.env.example`](clearauth/app/.env.example).

**Cortex (in the browser).** In the analyst workspace, click
*Connect a model* and enter a base URL, a key and a model name. The settings
stay in that browser. Requests go directly from the browser to the endpoint,
so use a key with a spending limit. For a local Ollama server, start it with
`OLLAMA_ORIGINS=*` so the browser is allowed to call it.

## 5. Local development

```bash
# Cortex
cd cortex/app && npm ci && npm run dev                  # :8080

# ClearAuth
cd clearauth/app && pnpm install
pnpm run dev:api                                         # :8080
pnpm run dev:web                                         # :5173 (proxies /api)

# Pharma Action Builder and GVD: open the HTML file in a browser
```

Node 20 or later is required. For pnpm, run `corepack enable` once.

## Troubleshooting

- **Pages shows a 404 for the whole site.** Pages is not set to
  *GitHub Actions*, or the workflow has not run yet. Check the Actions tab.
- **The workflow fails at `pnpm install` on a fork.** Make sure
  `clearauth/app/pnpm-lock.yaml` came across with the fork, and do not edit
  `package.json` without updating the lockfile (`pnpm install`).
- **ClearAuth always opens in demo mode.** In demo mode the app could not
  reach `/api/healthz`. When running the server, open the app on the server's
  port (8080), not the Vite dev port, or start both dev servers.
- **Your demo changes disappeared.** In demo mode, changes live in that
  browser's local storage. Use *Reset data* in the sidebar to start again.
