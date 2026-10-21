import { Router } from "express";
import { getCases, getCaseById, addCase, updateCase } from "../data/store.js";
import type { PACase, TimelineEvent } from "../types/index.js";

const router = Router();

function generateId(): string {
  const digits = Math.floor(100000 + Math.random() * 900000).toString();
  return `PA-${digits}`;
}

function generateAuthNumber(payer: string): string {
  const prefixes: Record<string, string> = {
    "BlueCross Health": "BCH",
    "Aetna Better Health": "ATN",
    UnitedHealthcare: "UHC",
    "Cigna Healthcare": "CGN",
    Humana: "HUM",
  };
  const prefix = prefixes[payer] ?? "AUTH";
  const year = new Date().getFullYear();
  const digits = Math.floor(1000 + Math.random() * 9000).toString();
  return `${prefix}-${year}-${digits}`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

router.get("/", (req, res) => {
  let cases = getCases();
  const { status, payer } = req.query as { status?: string; payer?: string };
  if (status) cases = cases.filter((c) => c.status === status);
  if (payer) cases = cases.filter((c) => c.payer === payer);
  res.json(cases);
});

router.post("/", (req, res) => {
  const body = req.body as {
    patientName: string;
    dateOfBirth: string;
    diagnosis: string;
    diagnosisCode?: string;
    medication: string;
    dosage?: string;
    previousTreatments?: string;
    clinicalJustification?: string;
    prescribingPhysician?: string;
    npi?: string;
    payer?: string;
    memberId?: string;
  };

  if (!body.patientName || !body.dateOfBirth || !body.diagnosis || !body.medication) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const now = new Date();
  const id = generateId();

  const newCase: PACase = {
    id,
    patientId: `PT-NEW-${Date.now()}`,
    patientName: body.patientName,
    patientDob: body.dateOfBirth,
    drug: body.medication,
    condition: body.diagnosis,
    icd10Code: body.diagnosisCode ?? "",
    status: "pending",
    submittedDate: formatDate(now),
    dueDate: formatDate(new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)),
    payer: body.payer ?? "Unknown Payer",
    payerContact: "",
    provider: body.prescribingPhysician ?? "Dr. Sarah Mitchell",
    npi: body.npi ?? "1234567890",
    priority: "normal",
    documents: [],
    submissionChannel: "portal",
    previousTreatments: body.previousTreatments,
    clinicalJustification: body.clinicalJustification,
    dosage: body.dosage,
    timeline: [
      {
        id: "e1",
        date: formatDate(now),
        title: "PA Submitted",
        description: "Prior authorization request submitted",
        eventType: "submitted",
        actor: body.prescribingPhysician ?? "Dr. Sarah Mitchell",
      },
    ],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  addCase(newCase);
  res.status(201).json(newCase);
});

router.get("/:id", (req, res) => {
  const c = getCaseById(req.params.id);
  if (!c) {
    res.status(404).json({ error: "Case not found" });
    return;
  }
  res.json(c);
});

router.patch("/:id", (req, res) => {
  const c = getCaseById(req.params.id);
  if (!c) {
    res.status(404).json({ error: "Case not found" });
    return;
  }

  const updates = req.body as {
    status?: string;
    denialReason?: string;
    authNumber?: string;
    authValidFrom?: string;
    authValidUntil?: string;
  };

  const now = new Date();
  const patch: Partial<PACase> = {};
  const newEvents: TimelineEvent[] = [];

  if (updates.status && updates.status !== c.status) {
    patch.status = updates.status as PACase["status"];

    if (updates.status === "approved") {
      const authNum = updates.authNumber ?? generateAuthNumber(c.payer);
      const validFrom = updates.authValidFrom ?? formatDate(now);
      const validUntil = updates.authValidUntil ?? formatDate(new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000));
      patch.authNumber = authNum;
      patch.authValidFrom = validFrom;
      patch.authValidUntil = validUntil;
      newEvents.push({
        id: `e${Date.now()}`,
        date: formatDate(now),
        title: "Approved",
        description: `Authorization approved. Auth number: ${authNum}`,
        eventType: "approved",
        actor: c.payer,
      });
    } else if (updates.status === "denied") {
      if (!updates.denialReason) {
        res.status(400).json({ error: "denialReason is required when denying" });
        return;
      }
      patch.denialReason = updates.denialReason;
      newEvents.push({
        id: `e${Date.now()}`,
        date: formatDate(now),
        title: "Denied",
        description: updates.denialReason,
        eventType: "denied",
        actor: c.payer,
      });
    } else if (updates.status === "review") {
      newEvents.push({
        id: `e${Date.now()}`,
        date: formatDate(now),
        title: "Under Clinical Review",
        description: "Case assigned for clinical review",
        eventType: "in_review",
        actor: c.payer,
      });
    }
  }

  if (newEvents.length > 0) {
    patch.timeline = [...c.timeline, ...newEvents];
  }

  const updated = updateCase(req.params.id, patch);
  res.json(updated);
});

router.post("/:id/submit", (req, res) => {
  const c = getCaseById(req.params.id);
  if (!c) {
    res.status(404).json({ error: "Case not found" });
    return;
  }
  const now = new Date();
  const newEvents: TimelineEvent[] = [
    {
      id: `e${Date.now()}`,
      date: formatDate(now),
      title: "Received by Payer",
      description: `Request received by ${c.payer}`,
      eventType: "received",
      actor: c.payer,
    },
    {
      id: `e${Date.now() + 1}`,
      date: formatDate(now),
      title: "Under Clinical Review",
      description: "Case assigned for clinical review",
      eventType: "in_review",
      actor: c.payer,
    },
  ];
  const updated = updateCase(req.params.id, {
    status: "review",
    timeline: [...c.timeline, ...newEvents],
  });
  res.json(updated);
});

router.post("/:id/appeal", (req, res) => {
  const c = getCaseById(req.params.id);
  if (!c) {
    res.status(404).json({ error: "Case not found" });
    return;
  }
  const now = new Date();
  const newEvent: TimelineEvent = {
    id: `e${Date.now()}`,
    date: formatDate(now),
    title: "Appeal Filed",
    description: "Formal appeal submitted for review",
    eventType: "appealed",
    actor: c.provider,
  };
  const updated = updateCase(req.params.id, {
    status: "review",
    timeline: [...c.timeline, newEvent],
  });
  res.json(updated);
});

export default router;
