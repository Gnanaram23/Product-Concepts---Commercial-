/**
 * Optional LLM layer. Works with any OpenAI-compatible Chat Completions API:
 * OpenAI, Azure OpenAI, Groq, Together, OpenRouter, or a local Ollama server
 * (http://localhost:11434/v1, free, no key needed).
 *
 * The model never sees anything except the selected case, the rules-engine
 * evaluation and the grounded draft, and is told not to add facts.
 */
import type { AssistantResult, Role } from "./assistant";
import type { PACase } from "./types";

export interface LLMConfig {
  baseUrl: string;
  apiKey?: string;
  model: string;
  timeoutMs?: number;
}

const PERSONA: Record<Role, string> = {
  provider:
    "You support a prescriber's office staff with prior authorization. Be precise and practical; use clinical language.",
  patient:
    "You explain prior authorization to a patient. Use plain language at about an 8th-grade reading level, be reassuring but honest, and never give dosing or treatment advice beyond what the record states.",
  payer:
    "You support a health plan's utilization management reviewer. Be objective, cite which criteria are met or unmet, and remember a licensed clinician makes the final decision.",
};

export function llmFromEnv(env: Record<string, string | undefined>): LLMConfig | null {
  const baseUrl = env.LLM_BASE_URL || (env.LLM_API_KEY ? "https://api.openai.com/v1" : "");
  if (!baseUrl) return null;
  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    apiKey: env.LLM_API_KEY,
    model: env.LLM_MODEL || "gpt-4o-mini",
    timeoutMs: Number(env.LLM_TIMEOUT_MS) || 30_000,
  };
}

export async function llmAnswer(
  cfg: LLMConfig,
  role: Role,
  userMessage: string,
  grounded: AssistantResult,
  c: PACase | undefined,
): Promise<string> {
  const system = [
    "You are the AI assistant inside ClearAuth, a prior authorization platform.",
    PERSONA[role],
    "Rules:",
    "- Use only the case record, policy evaluation and draft provided. Do not invent patient facts, test results, dates or citations.",
    "- If something needed is missing from the record, say so and say what would be needed.",
    "- Keep the structure of the draft where it helps, but answer the user's actual question first.",
    "- Format with **bold** labels, short paragraphs and '-' bullets. No tables. Under 300 words.",
  ].join("\n");

  const context = {
    case: c ?? null,
    policyEvaluation: grounded.policy ?? null,
    draftAnswer: grounded.response,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), cfg.timeoutMs ?? 30_000);
  try {
    const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: cfg.model,
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          { role: "user", content: `Request: ${userMessage}\n\nContext (JSON):\n${JSON.stringify(context, null, 1)}` },
        ],
      }),
    });
    if (!res.ok) throw new Error(`LLM returned ${res.status}`);
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("LLM returned no content");
    return text;
  } finally {
    clearTimeout(timer);
  }
}
