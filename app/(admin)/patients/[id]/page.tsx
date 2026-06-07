"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPatientById } from "@/lib/patients";
import { Patient } from "@/types";
import styles from "./patient.module.css";

export default function PatientDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getPatientById(id);
        if (!data) {
          setError("Patient not found.");
        } else {
          setPatient(data);
        }
      } catch {
        setError("Failed to load patient. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p className={styles.stateMsg}>Loading...</p>;
  if (error) return <p className={styles.errorMsg}>{error}</p>;
  if (!patient) return null;

  return (
    <div>
      <div className={styles.top}>
        <div>
          <h1 className={styles.title}>{patient.fullName}</h1>
          <p className={styles.subtitle}>Patient details</p>
        </div>
        <div className={styles.topActions}>
          <Link href={`/patients/${id}/edit`} className={styles.editBtn}>
            Edit
          </Link>
          <Link href="/patients" className={styles.backBtn}>
            ← Back
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.grid}>
          <div className={styles.field}>
            <span className={styles.label}>Full Name</span>
            <span className={styles.value}>{patient.fullName}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Phone</span>
            <span className={styles.value}>{patient.phone}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Age</span>
            <span className={styles.value}>{patient.age}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Gender</span>
            <span className={`${styles.value} ${styles.capitalize}`}>{patient.gender}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Address</span>
            <span className={styles.value}>{patient.address || "—"}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Added on</span>
            <span className={styles.value}>
              {patient.createdAt
                ? new Date(patient.createdAt).toLocaleDateString("de-DE")
                : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
