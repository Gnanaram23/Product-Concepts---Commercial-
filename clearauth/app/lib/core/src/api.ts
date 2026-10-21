/**
 * The ClearAuth API as one framework-free function.
 *
 * The Express server calls it for every /api request, and the browser demo
 * calls the same function in place of the network, so both behave the same.
 */
import { defaultCase, groundedAnswer, routeFeature, type Role } from "./assistant";
import { llmAnswer, type LLMConfig } from "./llm";
import { evaluateCase } from "./policies";
import { addCase, getCaseById, getCases, getPatientById, getPatients, getReauthCases, resetStore, updateCase } from "./store";
import type { PACase, TimelineEvent } from "./types";

export interface ApiRequest {
  method: string;
  /** Path after /api, e.g. "/cases/PA-127904". */
  path: string;
  query?: Record<string, string | undefined>;
  body?: unknown;
}

export interface ApiResponse {
  status: number;
  body: unknown;
}

export interface ApiOptions {
  mode: "server" | "demo";
  llm?: LLMConfig | null;
  onLLMError?: (err: unknown) => void;
}

const PAYER_PREFIX: Record<string, string> = {
  "BlueCross Health": "BCH",
  "Aetna Better Health": "ATN",
  UnitedHealthcare: "UHC",
  "Cigna Healthcare": "CGN",
  Humana: "HUM",
};

const DAY = 86_400_000;
const formatDate = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const randomDigits = (n: number) => Math.floor(10 ** (n - 1) + Math.random() * 9 * 10 ** (n - 1)).toString();
const authNumber = (payer: string) => `${PAYER_PREFIX[payer] ?? "AUTH"}-${new Date().getFullYear()}-${randomDigits(4)}`;
const event = (title: string, description: string, eventType: TimelineEvent["eventType"], actor: string, offset = 0): TimelineEvent => ({
  id: `e${Date.now() + offset}`,
  date: formatDate(new Date()),
  title,
  description,
  eventType,
  actor,
});

const ok = (body: unknown, status = 200): ApiResponse => ({ status, body });
const err = (status: number, error: string): ApiResponse => ({ status, body: { error } });

export function createApi(options: ApiOptions) {
  return async function handle(req: ApiRequest): Promise<ApiResponse> {
    const method = req.method.toUpperCase();
    const parts = req.path.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean).map(decodeURIComponent);
    const body = (req.body ?? {}) as Record<string, any>;
    const q = req.query ?? {};

    // GET /healthz, GET /meta
    if (parts[0] === "healthz") return ok({ status: "ok" });
    if (parts[0] === "meta") return ok({ mode: options.mode, llm: Boolean(options.llm), model: options.llm?.model ?? null });
    if (parts[0] === "reset" && method === "POST") {
      resetStore();
      return ok({ status: "reset" });
    }

    // Cases
    if (parts[0] === "cases") {
      const id = parts[1];
      if (!id && method === "GET") {
        let cases = getCases();
        if (q.status) cases = cases.filter((c) => c.status === q.status);
        if (q.payer) cases = cases.filter((c) => c.payer === q.payer);
        return ok(cases);
      }
      if (!id && method === "POST") return createCase(body);

      const c = getCaseById(id);
      if (!c) return err(404, "Case not found");

      if (parts[2] === "policy" && method === "GET") return ok(evaluateCase(c));
      if (!parts[2] && method === "GET") return ok(c);
      if (!parts[2] && method === "PATCH") return patchCase(c, body);
      if (parts[2] === "submit" && method === "POST") {
        return ok(
          updateCase(id, {
            status: "review",
            timeline: [
              ...c.timeline,
              event("Received by Payer", `Request received by ${c.payer}`, "received", c.payer),
              event("Under Clinical Review", "Case assigned for clinical review", "in_review", c.payer, 1),
            ],
          }),
        );
      }
      if (parts[2] === "appeal" && method === "POST") {
        return ok(
          updateCase(id, {
            status: "review",
            timeline: [...c.timeline, event("Appeal Filed", "Formal appeal submitted for review", "appealed", c.provider)],
          }),
        );
      }
    }

    // Patients and reauthorizations
    if (parts[0] === "patients" && method === "GET") {
      if (!parts[1]) return ok(getPatients());
      const p = getPatientById(parts[1]);
      return p ? ok(p) : err(404, "Patient not found");
    }
    if (parts[0] === "reauth" && method === "GET") return ok(getReauthCases());

    // Assistant
    if (parts[0] === "ai" && method === "POST") {
      const message = String(body.message ?? "").trim();
      if (!message) return err(400, "message is required");
      const role = (["provider", "patient", "payer"].includes(body.role) ? body.role : "provider") as Role;
      const feature = routeFeature(role, body.feature, message);
      const c = (body.caseId && getCaseById(String(body.caseId))) || defaultCase(feature, role, body.patientId);
      const grounded = groundedAnswer(role, feature, c);

      let response = grounded.response;
      let source: "rules" | "llm" = "rules";
      if (options.llm && feature !== "hello") {
        try {
          response = await llmAnswer(options.llm, role, message, grounded, c);
          source = "llm";
        } catch (e) {
          options.onLLMError?.(e);
        }
      }
      return ok({ response, feature, caseId: grounded.caseId, source, timestamp: new Date().toISOString() });
    }

    return err(404, `No route for ${method} /api/${parts.join("/")}`);
  };
}

function createCase(body: Record<string, any>): ApiResponse {
  if (!body.patientName || !body.dateOfBirth || !body.diagnosis || !body.medication) {
    return err(400, "Missing required fields");
  }
  const now = new Date();
  const provider = body.prescribingPhysician || "Dr. Sarah Mitchell";
  const documents = Array.isArray(body.documents) ? body.documents.map(String) : ["clinical_notes.pdf"];
  const existing = getPatients().find((p) => p.name.toLowerCase() === String(body.patientName).toLowerCase());
  const newCase: PACase = {
    id: `PA-${randomDigits(6)}`,
    patientId: existing?.id ?? `PT-NEW-${Date.now()}`,
    patientName: body.patientName,
    patientDob: body.dateOfBirth,
    drug: body.medication,
    condition: body.diagnosis,
    icd10Code: body.diagnosisCode ?? "",
    status: "pending",
    submittedDate: formatDate(now),
    dueDate: formatDate(new Date(now.getTime() + 14 * DAY)),
    payer: body.payer || existing?.payer || "Unknown Payer",
    payerContact: existing?.payerContact ?? "",
    provider,
    npi: body.npi || "1234567890",
    priority: body.priority === "high" ? "high" : "normal",
    documents,
    submissionChannel: "portal",
    previousTreatments: body.previousTreatments,
    clinicalJustification: body.clinicalJustification,
    dosage: body.dosage,
    timeline: [event("PA Submitted", "Prior authorization request submitted", "submitted", provider)],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  addCase(newCase);
  return ok(newCase, 201);
}

function patchCase(c: PACase, updates: Record<string, any>): ApiResponse {
  const now = new Date();
  const patch: Partial<PACase> = {};
  const events: TimelineEvent[] = [];

  if (updates.status && updates.status !== c.status) {
    patch.status = updates.status;
    if (updates.status === "approved") {
      patch.authNumber = updates.authNumber ?? authNumber(c.payer);
      patch.authValidFrom = updates.authValidFrom ?? formatDate(now);
      patch.authValidUntil = updates.authValidUntil ?? formatDate(new Date(now.getTime() + 180 * DAY));
      events.push(event("Approved", `Authorization approved. Auth number: ${patch.authNumber}`, "approved", c.payer));
    } else if (updates.status === "denied") {
      if (!updates.denialReason) return err(400, "denialReason is required when denying");
      patch.denialReason = updates.denialReason;
      events.push(event("Denied", updates.denialReason, "denied", c.payer));
    } else if (updates.status === "review") {
      events.push(event("Under Clinical Review", "Case assigned for clinical review", "in_review", c.payer));
    }
  }
  if (events.length) patch.timeline = [...c.timeline, ...events];
  return ok(updateCase(c.id, patch));
}
