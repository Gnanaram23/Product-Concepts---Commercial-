import { seedCases, seedPatients, seedReauthCases } from "./seed.js";
import type { PACase, Patient, ReauthCase } from "../types/index.js";

let cases: PACase[] = [...seedCases];
let patients: Patient[] = [...seedPatients];
let reauthCases: ReauthCase[] = [...seedReauthCases];

export function getCases(): PACase[] {
  return cases;
}

export function getCaseById(id: string): PACase | undefined {
  return cases.find((c) => c.id === id);
}

export function addCase(c: PACase): PACase {
  cases = [...cases, c];
  return c;
}

export function updateCase(id: string, updates: Partial<PACase>): PACase | undefined {
  const idx = cases.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  cases[idx] = { ...cases[idx], ...updates, updatedAt: new Date().toISOString() };
  return cases[idx];
}

export function getPatients(): Patient[] {
  return patients;
}

export function getPatientById(id: string): Patient | undefined {
  return patients.find((p) => p.id === id);
}

export function getReauthCases(): ReauthCase[] {
  return reauthCases;
}
