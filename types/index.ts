export type Gender = "male" | "female" | "other";

export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no-show";

export interface Patient {
  id: string;
  fullName: string;
  phone: string;
  age: number;
  gender: Gender;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PatientInput = Omit<Patient, "id" | "createdAt" | "updatedAt">;

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: AppointmentStatus;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AppointmentInput = Omit<Appointment, "id" | "createdAt" | "updatedAt">;
