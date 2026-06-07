"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPatientById, updatePatient } from "@/lib/patients";
import { Patient, PatientInput } from "@/types";
import PatientForm from "@/components/patients/PatientForm";
import styles from "./edit.module.css";

export default function EditPatientPage() {
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

  async function handleSubmit(data: PatientInput) {
    await updatePatient(id, data);
  }

  if (loading) return <p className={styles.stateMsg}>Loading...</p>;
  if (error) return <p className={styles.errorMsg}>{error}</p>;
  if (!patient) return null;

  return (
    <div>
      <h1 className={styles.title}>Edit Patient</h1>
      <p className={styles.subtitle}>Update patient information</p>
      <div className={styles.card}>
        <PatientForm
          initialData={patient}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
