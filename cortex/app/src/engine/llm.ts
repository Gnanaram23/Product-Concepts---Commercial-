/**
 * Optional "bring your own model" support.
 *
 * Settings are kept in this browser only (localStorage) and requests go
 * straight from the browser to the endpoint the user enters, so use a key
 * with a spending limit, or a local model such as Ollama
 * (base URL http://localhost:11434/v1; start Ollama with OLLAMA_ORIGINS=*).
 */
import { getDataset } from "./dataset";

export interface LLMSettings {
  baseUrl: string;
  apiKey: string;
  model: string;
}

const KEY = "cortex_llm_settings";

export function getLLMSettings(): LLMSettings | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as LLMSettings;
    return s.baseUrl && s.model ? s : null;
  } catch {
    return null;
  }
}

export function saveLLMSettings(s: LLMSettings | null) {
  try {
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  } catch {
    /* storage blocked */
  }
}

function schemaText(userTables: { name: string; columns: string[] }[]) {
  const { meta } = getDataset();
  const lines = meta
    .filter((t) => t.access === "granted")
    .map((t) => `${t.name}(${t.columns.map((c) => `${c.name} ${c.type}`).join(", ")}) -- ${t.description}`);
  for (const u of userTables) lines.push(`${u.name}(${u.columns.join(", ")}) -- uploaded by the user`);
  return lines.join("\n");
}

const FORBIDDEN = /\b(insert|update|delete|drop|create|alter|attach|detach|into|select\s+\*\s+into|truncate|require|load)\b/i;

export function checkSql(sql: string, allowed: string[]): string {
  const clean = sql.replace(/```sql|```/gi, "").trim().replace(/;\s*$/, "");
  if (!/^(select|with)\b/i.test(clean)) throw new Error("only SELECT queries are allowed");
  if (clean.includes(";")) throw new Error("only one statement is allowed");
  if (FORBIDDEN.test(clean.replace(/'[^']*'/g, "''"))) throw new Error("the query is not read-only");
  const names = [...clean.matchAll(/\b(?:from|join)\s+([a-z_][a-z0-9_]*)/gi)].map((m) => m[1].toLowerCase());
  for (const n of names) if (!allowed.includes(n)) throw new Error(`unknown or restricted table: ${n}`);
  return clean;
}

export async function generateSql(
  s: LLMSettings,
  question: string,
  userTables: { name: string; columns: string[] }[],
): Promise<{ sql: string; explanation: string }> {
  const allowed = [...getDataset().meta.filter((t) => t.access === "granted").map((t) => t.name), ...userTables.map((u) => u.name)];
  const system = [
    "You translate business questions into one SQL SELECT statement for AlaSQL (SQL-92 style, supports JOIN, GROUP BY, ORDER BY, LIMIT, ROUND, SUM, AVG, COUNT, LOWER, LIKE).",
    "Use only these tables and columns:",
    schemaText(userTables),
    "Quarters are strings like '2025-Q4'. Gross-to-net % = 100 * (1 - SUM(net_sales) / SUM(gross_sales)).",
    'Reply with JSON only: {"sql": "...", "explanation": "one or two sentences on what the query does"}.',
  ].join("\n");

  const res = await fetch(`${s.baseUrl.replace(/\/+$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(s.apiKey ? { Authorization: `Bearer ${s.apiKey}` } : {}) },
    body: JSON.stringify({
      model: s.model,
      temperature: 0,
      messages: [
        { role: "system", content: system },
        { role: "user", content: question },
      ],
    }),
  });
  if (!res.ok) throw new Error(`model returned ${res.status}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content ?? "";
  const json = content.match(/\{[\s\S]*\}/);
  if (!json) throw new Error("model did not return JSON");
  const parsed = JSON.parse(json[0]) as { sql?: string; explanation?: string };
  if (!parsed.sql) throw new Error("model returned no SQL");
  return { sql: checkSql(parsed.sql, allowed), explanation: parsed.explanation ?? "" };
}
