import { seedCases, seedPatients, seedReauthCases } from "./seed";
import type { PACase, Patient, ReauthCase } from "./types";

/**
 * In-memory data store shared by the Express server and the browser demo.
 *
 * Persistence is pluggable: the browser demo saves to localStorage so a
 * visitor's changes survive a page refresh; the server keeps data in memory
 * (swap these functions for a database to make it durable).
 */

interface State {
  cases: PACase[];
  patients: Patient[];
  reauthCases: ReauthCase[];
}

export interface Persistence {
  load(): State | null;
  save(state: State): void;
}

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
const fresh = (): State => ({ cases: clone(seedCases), patients: clone(seedPatients), reauthCases: clone(seedReauthCases) });

let state: State = fresh();
let persistence: Persistence | null = null;

export function configurePersistence(p: Persistence | null): void {
  persistence = p;
  const loaded = p?.load();
  if (loaded && Array.isArray(loaded.cases)) state = loaded;
}

function persist() {
  try {
    persistence?.save(state);
  } catch {
    // Storage is best-effort (private windows can refuse writes).
  }
}

export function resetStore(): void {
  state = fresh();
  persist();
}

export function getCases(): PACase[] {
  return state.cases;
}

export function getCaseById(id: string): PACase | undefined {
  return state.cases.find((c) => c.id === id);
}

export function addCase(c: PACase): PACase {
  state.cases = [...state.cases, c];
  persist();
  return c;
}

export function updateCase(id: string, updates: Partial<PACase>): PACase | undefined {
  const idx = state.cases.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  state.cases[idx] = { ...state.cases[idx], ...updates, updatedAt: new Date().toISOString() };
  persist();
  return state.cases[idx];
}

export function getPatients(): Patient[] {
  return state.patients;
}

export function getPatientById(id: string): Patient | undefined {
  return state.patients.find((p) => p.id === id);
}

export function getReauthCases(): ReauthCase[] {
  return state.reauthCases;
}
