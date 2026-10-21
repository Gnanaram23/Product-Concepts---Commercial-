/**
 * Decides where API calls go.
 *
 *  - "server": a real ClearAuth API is reachable at /api (Docker, Render, `pnpm dev`).
 *  - "demo":   no server, e.g. GitHub Pages or Netlify. The same API code from
 *              @workspace/core runs inside the browser and answers /api calls,
 *              saving changes to localStorage.
 *
 * VITE_API_MODE=server|demo forces a mode; the default "auto" checks /api/healthz.
 */

export type ApiMode = "server" | "demo";

const STORAGE_KEY = "clearauth_demo_state_v2";
let currentMode: ApiMode = "server";

export function getApiMode(): ApiMode {
  return currentMode;
}

async function serverIsUp(): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch("/api/healthz", { signal: controller.signal, headers: { Accept: "application/json" } });
    if (!res.ok) return false;
    const data = await res.json();
    return data?.status === "ok";
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function enableDemo() {
  const core = await import("@workspace/core");
  core.configurePersistence({
    load: () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },
    save: (state) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* storage full or blocked */
      }
    },
  });
  const handle = core.createApi({ mode: "demo" });
  const realFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url, window.location.href);
    const idx = url.pathname.indexOf("/api/");
    if (url.origin !== window.location.origin || idx === -1) return realFetch(input, init);

    const method = init?.method ?? (input instanceof Request ? input.method : "GET");
    let body: unknown;
    const rawBody = init?.body ?? (input instanceof Request && method !== "GET" ? await input.clone().text() : undefined);
    if (typeof rawBody === "string" && rawBody) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        body = rawBody;
      }
    }
    const result = await handle({
      method,
      path: url.pathname.slice(idx + 4),
      query: Object.fromEntries(url.searchParams.entries()),
      body,
    });
    // A short pause so loading states behave as they would over a network.
    await new Promise((r) => setTimeout(r, 150));
    return new Response(JSON.stringify(result.body), { status: result.status, headers: { "Content-Type": "application/json" } });
  };
}

export async function setupApi(): Promise<ApiMode> {
  const forced = (import.meta.env.VITE_API_MODE as string | undefined)?.toLowerCase();
  currentMode = forced === "demo" ? "demo" : forced === "server" ? "server" : (await serverIsUp()) ? "server" : "demo";
  if (currentMode === "demo") await enableDemo();
  return currentMode;
}

export function resetDemoData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  window.location.reload();
}
