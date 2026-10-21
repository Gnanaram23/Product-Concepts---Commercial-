import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { createApi, llmFromEnv } from "@workspace/core";
import { logger } from "./lib/logger";

const llm = llmFromEnv(process.env);
const api = createApi({
  mode: "server",
  llm,
  onLLMError: (err) => logger.warn({ err: String(err) }, "LLM call failed; returned the rules-engine answer"),
});

logger.info(llm ? { model: llm.model, baseUrl: llm.baseUrl } : {}, llm ? "Assistant: LLM enabled" : "Assistant: rules engine only (set LLM_API_KEY or LLM_BASE_URL to add an LLM)");

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req: (req) => ({ id: req.id, method: req.method, url: req.url?.split("?")[0] }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Every /api request goes through the shared handler in @workspace/core.
app.use("/api", async (req, res, next) => {
  try {
    const result = await api({
      method: req.method,
      path: req.path,
      query: req.query as Record<string, string>,
      body: req.body,
    });
    res.status(result.status).json(result.body);
  } catch (err) {
    next(err);
  }
});

// Serve the built web app when it is present, so one process runs everything.
// The bundle lives in artifacts/api-server/dist, the web build in artifacts/clearauth/dist/public.
const here = path.dirname(fileURLToPath(import.meta.url));
const staticDir = process.env.STATIC_DIR ?? path.resolve(here, "../../clearauth/dist/public");
if (fs.existsSync(path.join(staticDir, "index.html"))) {
  logger.info({ staticDir }, "Serving web app");
  app.use(express.static(staticDir, { index: false, maxAge: "1h" }));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(staticDir, "index.html")));
}

export default app;
