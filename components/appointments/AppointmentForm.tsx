"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getPatients } from "@/lib/patients";
import { Appointment, AppointmentInput, AppointmentStatus, Patient } from "@/types";
import styles from "./AppointmentForm.module.css";

type FormState = {
  patientId: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

interface AppointmentFormProps {
  initialData?: Partial<Appointment>;
  onSubmit: (data: AppointmentInput) => Promise<void>;
  submitLabel: string;
}

export default function AppointmentForm({
  initialData,
  onSubmit,
  submitLabel,
}: AppointmentFormProps) {
  const [form, setForm] = useState<FormState>({
    patientId: initialData?.patientId ?? "",
    patientName: initialData?.patientName ?? "",
    appointmentDate: initialData?.appointmentDate ?? "",
    appointmentTime: initialData?.appointmentTime ?? "",
    reason: initialData?.reason ?? "",
    status: initialData?.status ?? "scheduled",
    notes: initialData?.notes ?? "",
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch {
        setPatientsError(true);
      } finally {
        setPatientsLoading(false);
      }
    }
    loadPatients();
  }, []);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!form.patientId) newErrors.patientId = "Please select a patient.";
    if (!form.appointmentDate) newErrors.appointmentDate = "Date is required.";
    if (!form.appointmentTime) newErrors.appointmentTime = "Time is required.";
    if (!form.reason.trim()) newErrors.reason = "Reason is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function handlePatientChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = e.target.value;
    const patient = patients.find((p) => p.id === selectedId);
    setForm((prev) => ({
      ...prev,
      patientId: selectedId,
      patientName: patient?.fullName ?? "",
    }));
    if (errors.patientId) {
      setErrors((prev) => ({ ...prev, patientId: "" }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        patientId: form.patientId,
        patientName: form.patientName,
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        reason: form.reason.trim(),
        status: form.status as AppointmentStatus,
        notes: form.notes.trim(),
      });
      router.push("/appointments");
    } catch {
      alert("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="patientId">Patient *</label>
        {patientsLoading && <p className={styles.loadingMsg}>Loading patients...</p>}
        {patientsError && (
          <p className={styles.errorMsg}>Failed to load patients. Please refresh the page.</p>
        )}
        {!patientsLoading && !patientsError && (
          <select
            id="patientId"
            name="patientId"
            value={form.patientId}
            onChange={handlePatientChange}
          >
            <option value="">Select a patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName}
              </option>
            ))}
          </select>
        )}
        {errors.patientId && <span className={styles.fieldError}>{errors.patientId}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="appointmentDate">Date *</label>
          <input
            id="appointmentDate"
            name="appointmentDate"
            type="date"
            value={form.appointmentDate}
            onChange={handleChange}
          />
          {errors.appointmentDate && (
            <span className={styles.fieldError}>{errors.appointmentDate}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="appointmentTime">Time *</label>
          <input
            id="appointmentTime"
            name="appointmentTime"
            type="time"
            value={form.appointmentTime}
            onChange={handleChange}
          />
          {errors.appointmentTime && (
            <span className={styles.fieldError}>{errors.appointmentTime}</span>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="reason">Reason *</label>
        <input
          id="reason"
          name="reason"
          type="text"
          value={form.reason}
          onChange={handleChange}
          placeholder="e.g. General check-up"
        />
        {errors.reason && <span className={styles.fieldError}>{errors.reason}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={form.status} onChange={handleChange}>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-show</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Optional notes about this appointment..."
          rows={3}
        />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => router.push("/appointments")}
          className={styles.cancelBtn}
        >
          Cancel
        </button>
        <button type="submit" className={styles.submitBtn} disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
