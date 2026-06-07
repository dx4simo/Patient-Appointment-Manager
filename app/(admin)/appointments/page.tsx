"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAppointments, deleteAppointment } from "@/lib/appointments";
import { Appointment } from "@/types";
import styles from "./appointments.module.css";

const statusLabel: Record<string, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No-show",
};

const statusBadgeClass: Record<string, string> = {
  scheduled: styles.badgeScheduled,
  completed: styles.badgeCompleted,
  cancelled: styles.badgeCancelled,
  "no-show": styles.badgeNoShow,
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      const data = await getAppointments();
      setAppointments(data);
    } catch {
      setError("Failed to load appointments. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, patientName: string) {
    if (!confirm(`Delete appointment for "${patientName}"? This cannot be undone.`)) return;
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Failed to delete appointment. Please try again.");
    }
  }

  return (
    <div>
      <div className={styles.top}>
        <div>
          <h1 className={styles.title}>Appointments</h1>
          <p className={styles.subtitle}>Manage clinic appointments</p>
        </div>
        <Link href="/appointments/new" className={styles.addBtn}>
          + New Appointment
        </Link>
      </div>

      {loading && <p className={styles.stateMsg}>Loading appointments...</p>}
      {error && <p className={styles.errorMsg}>{error}</p>}

      {!loading && !error && appointments.length === 0 && (
        <div className={styles.empty}>
          <p>No appointments yet. Click &quot;+ New Appointment&quot; to get started.</p>
        </div>
      )}

      {!loading && !error && appointments.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.patientName}</td>
                  <td>{appt.appointmentDate}</td>
                  <td>{appt.appointmentTime}</td>
                  <td className={styles.reasonCell}>{appt.reason}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${statusBadgeClass[appt.status] ?? ""}`}
                    >
                      {statusLabel[appt.status] ?? appt.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/appointments/${appt.id}/edit`}
                        className={styles.btnEdit}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(appt.id, appt.patientName)}
                        className={styles.btnDelete}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
