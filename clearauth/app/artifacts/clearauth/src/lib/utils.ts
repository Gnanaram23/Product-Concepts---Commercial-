import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "N/A";
  try {
    // If it's already a formatted string like "Mar 30 2025" or "03/15/2023"
    if (!dateString.includes("T") && dateString.length < 15) return dateString;
    
    const parsed = parseISO(dateString);
    if (isValid(parsed)) {
      return format(parsed, "MMM d, yyyy");
    }
    return dateString;
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return "N/A";
  try {
    const parsed = parseISO(dateString);
    if (isValid(parsed)) {
      return format(parsed, "MMM d, yyyy h:mm a");
    }
    return dateString;
  } catch {
    return dateString;
  }
}

export const USER_PROFILES = {
  provider: {
    id: "PROV-1",
    role: "provider",
    name: "Dr. Sarah Mitchell",
    initials: "SM",
    title: "Physician",
    color: "bg-[hsl(var(--blue))] text-white"
  },
  patient: {
    id: "PT-001",
    role: "patient",
    name: "Robert Brown",
    initials: "RB",
    title: "Patient",
    color: "bg-[hsl(var(--green))] text-white"
  },
  payer: {
    id: "PAY-1",
    role: "payer",
    name: "Sam Wilson",
    initials: "SW",
    title: "Payer — BlueCross Health",
    color: "bg-[hsl(var(--amber))] text-[hsl(var(--amber-lt))]"
  }
} as const;

export type Role = keyof typeof USER_PROFILES;
