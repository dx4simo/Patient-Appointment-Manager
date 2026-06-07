"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAppointmentById, updateAppointment } from "@/lib/appointments";
import { Appointment, AppointmentInput } from "@/types";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import styles from "./edit.module.css";

export default function EditAppointmentPage() {
  const params = useParams();
  const id = params.id as string;

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getAppointmentById(id);
        if (!data) {
          setError("Appointment not found.");
        } else {
          setAppointment(data);
        }
      } catch {
        setError("Failed to load appointment. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(data: AppointmentInput) {
    await updateAppointment(id, data);
  }

  if (loading) return <p className={styles.stateMsg}>Loading...</p>;
  if (error) return <p className={styles.errorMsg}>{error}</p>;
  if (!appointment) return null;

  return (
    <div>
      <h1 className={styles.title}>Edit Appointment</h1>
      <p className={styles.subtitle}>Update appointment details</p>
      <div className={styles.card}>
        <AppointmentForm
          initialData={appointment}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
