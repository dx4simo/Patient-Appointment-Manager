"use client";

import { createPatient } from "@/lib/patients";
import { PatientInput } from "@/types";
import PatientForm from "@/components/patients/PatientForm";
import styles from "./new.module.css";

export default function AddPatientPage() {
  async function handleSubmit(data: PatientInput) {
    await createPatient(data);
  }

  return (
    <div>
      <h1 className={styles.title}>Add Patient</h1>
      <p className={styles.subtitle}>Fill in the patient information below</p>
      <div className={styles.card}>
        <PatientForm onSubmit={handleSubmit} submitLabel="Add Patient" />
      </div>
    </div>
  );
}
