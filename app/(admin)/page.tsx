"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getPatients } from "@/lib/patients";
import { getAppointments } from "@/lib/appointments";
import { Patient, Appointment } from "@/types";
import styles from "./page.module.css";

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={styles.statCard} style={{ borderTop: `3px solid ${color}` }}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [patientsData, appointmentsData] = await Promise.all([
          getPatients(),
          getAppointments(),
        ]);
        setPatients(patientsData);
        setAppointments(appointmentsData);
      } catch {
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = useMemo(
    () => ({
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      scheduled: appointments.filter((a) => a.status === "scheduled").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
      noShow: appointments.filter((a) => a.status === "no-show").length,
    }),
    [patients, appointments]
  );

  const todayAppointments = useMemo(() => {
    const today = getTodayString();
    return appointments
      .filter((a) => a.appointmentDate === today)
      .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime));
  }, [appointments]);

  const upcomingAppointments = useMemo(() => {
    const today = getTodayString();
    return appointments
      .filter((a) => a.appointmentDate > today)
      .sort((a, b) => {
        if (a.appointmentDate !== b.appointmentDate) {
          return a.appointmentDate.localeCompare(b.appointmentDate);
        }
        return a.appointmentTime.localeCompare(b.appointmentTime);
      })
      .slice(0, 5);
  }, [appointments]);

  return (
    <div>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.subtitle}>Welcome to the clinic admin panel</p>

      {loading && <p className={styles.stateMsg}>Loading dashboard...</p>}
      {error && <p className={styles.errorMsg}>{error}</p>}

      {!loading && !error && (
        <>
          <div className={styles.statsGrid}>
            <StatCard label="Total Patients" value={stats.totalPatients} color="#6366f1" />
            <StatCard label="Total Appointments" value={stats.totalAppointments} color="#64748b" />
            <StatCard label="Scheduled" value={stats.scheduled} color="#2563eb" />
            <StatCard label="Completed" value={stats.completed} color="#16a34a" />
            <StatCard label="Cancelled" value={stats.cancelled} color="#6b7280" />
            <StatCard label="No-show" value={stats.noShow} color="#c2410c" />
          </div>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Today&apos;s Appointments
                {todayAppointments.length > 0 && (
                  <span className={styles.sectionCount}>{todayAppointments.length}</span>
                )}
              </h2>
            </div>

            {todayAppointments.length === 0 ? (
              <p className={styles.emptyMsg}>No appointments scheduled for today.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Patient</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAppointments.map((appt) => (
                      <tr key={appt.id}>
                        <td className={styles.timeCell}>{appt.appointmentTime}</td>
                        <td>{appt.patientName}</td>
                        <td className={styles.reasonCell}>{appt.reason}</td>
                        <td>
                          <span
                            className={`${styles.badge} ${statusBadgeClass[appt.status] ?? ""}`}
                          >
                            {statusLabel[appt.status] ?? appt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Upcoming Appointments</h2>
              <Link href="/appointments" className={styles.sectionLink}>
                View all
              </Link>
            </div>

            {upcomingAppointments.length === 0 ? (
              <p className={styles.emptyMsg}>No upcoming appointments.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Patient</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingAppointments.map((appt) => (
                      <tr key={appt.id}>
                        <td>{appt.appointmentDate}</td>
                        <td className={styles.timeCell}>{appt.appointmentTime}</td>
                        <td>{appt.patientName}</td>
                        <td className={styles.reasonCell}>{appt.reason}</td>
                        <td>
                          <span
                            className={`${styles.badge} ${statusBadgeClass[appt.status] ?? ""}`}
                          >
                            {statusLabel[appt.status] ?? appt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
