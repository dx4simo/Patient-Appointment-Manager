"use client";

import { createAppointment } from "@/lib/appointments";
import { AppointmentInput } from "@/types";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import styles from "./new.module.css";

export default function CreateAppointmentPage() {
  async function handleSubmit(data: AppointmentInput) {
    await createAppointment(data);
  }

  return (
    <div>
      <h1 className={styles.title}>New Appointment</h1>
      <p className={styles.subtitle}>Schedule an appointment for a patient</p>
      <div className={styles.card}>
        <AppointmentForm onSubmit={handleSubmit} submitLabel="Create Appointment" />
      </div>
    </div>
  );
}
