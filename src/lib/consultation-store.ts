// Simple in-memory + localStorage store for consultation requests (frontend demo).
export interface ConsultationRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  courseId: string;
  format: "phone" | "video" | "in-person";
  date: string;
  timeSlot: string;
  notes?: string;
  createdAt: string;
}

const KEY = "upskills.consultations";

export function saveConsultation(req: Omit<ConsultationRequest, "id" | "createdAt">) {
  const entry: ConsultationRequest = {
    ...req,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
      window.localStorage.setItem(KEY, JSON.stringify([entry, ...existing]));
    } catch {
      // ignore
    }
  }
  return entry;
}
