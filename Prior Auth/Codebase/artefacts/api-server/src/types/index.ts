export type PAStatus = "pending" | "review" | "approved" | "denied";
export type Priority = "normal" | "high";
export type SubmissionChannel = "fhir" | "portal" | "fax";
export type UrgencyLevel = "normal" | "urgent";

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  eventType:
    | "submitted"
    | "received"
    | "in_review"
    | "info_requested"
    | "approved"
    | "denied"
    | "appealed"
    | "reauth_started"
    | "reauth_approved";
  actor: string;
}

export interface PACase {
  id: string;
  patientId: string;
  patientName: string;
  patientDob: string;
  drug: string;
  ndcCode?: string;
  condition: string;
  icd10Code: string;
  status: PAStatus;
  submittedDate: string;
  dueDate: string;
  payer: string;
  payerContact: string;
  provider: string;
  npi: string;
  authNumber?: string;
  authValidFrom?: string;
  authValidUntil?: string;
  denialReason?: string;
  priority: Priority;
  documents: string[];
  submissionChannel: SubmissionChannel;
  previousTreatments?: string;
  clinicalJustification?: string;
  dosage?: string;
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface PatientMedication {
  name: string;
  dose: string;
  condition: string;
  paStatus: PAStatus;
  authNumber?: string;
  validUntil?: string;
}

export interface Patient {
  id: string;
  name: string;
  mrn: string;
  dob: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  insurance: string;
  memberId: string;
  plan: string;
  deductible: string;
  copay: string;
  payer: string;
  payerContact: string;
  conditions: string[];
  medications: PatientMedication[];
  allergies: string[];
  lastVisit: string;
}

export interface ReauthCase {
  id: string;
  patientName: string;
  drug: string;
  drugShort: string;
  condition: string;
  originalApproval: string;
  reauthorized: string;
  newExpiration: string;
  daysUntilExpiry: number;
  urgency: UrgencyLevel;
  authNumber: string;
}
