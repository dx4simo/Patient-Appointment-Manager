"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPatients, deletePatient } from "@/lib/patients";
import { Patient } from "@/types";
import styles from "./patients.module.css";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch {
      setError("Failed to load patients. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete patient "${name}"? This cannot be undone.`)) return;
    try {
      await deletePatient(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete patient. Please try again.");
    }
  }

  const filtered = patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  return (
    <div>
      <div className={styles.top}>
        <div>
          <h1 className={styles.title}>Patients</h1>
          <p className={styles.subtitle}>Manage clinic patients</p>
        </div>
        <Link href="/patients/new" className={styles.addBtn}>
          + Add Patient
        </Link>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {loading && <p className={styles.stateMsg}>Loading patients...</p>}
      {error && <p className={styles.errorMsg}>{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className={styles.empty}>
          <p>
            {search
              ? "No patients match your search."
              : "No patients yet. Click \"+ Add Patient\" to get started."}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.fullName}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.age}</td>
                  <td className={styles.capitalize}>{patient.gender}</td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/patients/${patient.id}`} className={styles.btnView}>
                        View
                      </Link>
                      <Link href={`/patients/${patient.id}/edit`} className={styles.btnEdit}>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(patient.id, patient.fullName)}
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
