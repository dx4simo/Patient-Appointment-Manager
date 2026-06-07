"use client";

import { useState, useEffect, useMemo } from "react";
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

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

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

  const filtered = useMemo(() => {
    const today = getTodayString();
    const searchLower = search.toLowerCase();

    return appointments.filter((appt) => {
      const matchesSearch =
        search === "" ||
        appt.patientName.toLowerCase().includes(searchLower) ||
        appt.reason.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "all" || appt.status === statusFilter;

      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = appt.appointmentDate === today;
      } else if (dateFilter === "upcoming") {
        matchesDate = appt.appointmentDate > today;
      } else if (dateFilter === "past") {
        matchesDate = appt.appointmentDate < today;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, search, statusFilter, dateFilter]);

  const hasActiveFilters =
    search !== "" || statusFilter !== "all" || dateFilter !== "all";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setDateFilter("all");
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
        <>
          <div className={styles.filterBar}>
            <input
              type="text"
              placeholder="Search by patient or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No-show</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All dates</option>
              <option value="today">Today</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
            {hasActiveFilters && (
              <button onClick={clearFilters} className={styles.clearBtn}>
                ✕ Clear filters
              </button>
            )}
          </div>

          <p className={styles.resultCount}>
            Showing {filtered.length} of {appointments.length}{" "}
            {appointments.length === 1 ? "appointment" : "appointments"}
          </p>

          {filtered.length === 0 && (
            <div className={styles.empty}>
              <p>No appointments match your current filters.</p>
              <button onClick={clearFilters} className={styles.clearFiltersLink}>
                Clear filters
              </button>
            </div>
          )}

          {filtered.length > 0 && (
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
                  {filtered.map((appt) => (
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
        </>
      )}
    </div>
  );
}
