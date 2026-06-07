"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Patient, PatientInput, Gender } from "@/types";
import styles from "./PatientForm.module.css";

type FormState = {
  fullName: string;
  phone: string;
  age: string;
  gender: string;
  address: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

interface PatientFormProps {
  initialData?: Partial<Patient>;
  onSubmit: (data: PatientInput) => Promise<void>;
  submitLabel: string;
}

export default function PatientForm({ initialData, onSubmit, submitLabel }: PatientFormProps) {
  const [form, setForm] = useState<FormState>({
    fullName: initialData?.fullName ?? "",
    phone: initialData?.phone ?? "",
    age: initialData?.age?.toString() ?? "",
    gender: initialData?.gender ?? "male",
    address: initialData?.address ?? "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!form.age || Number(form.age) <= 0) newErrors.age = "Age must be a positive number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        age: Number(form.age),
        gender: form.gender as Gender,
        address: form.address.trim(),
      });
      router.push("/patients");
    } catch {
      alert("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="fullName">Full Name *</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={form.fullName}
          onChange={handleChange}
          placeholder="e.g. Maria Müller"
        />
        {errors.fullName && <span className={styles.fieldError}>{errors.fullName}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="phone">Phone *</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={form.phone}
            onChange={handleChange}
            placeholder="e.g. 0176 123 456"
          />
          {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="age">Age *</label>
          <input
            id="age"
            name="age"
            type="number"
            min="1"
            max="120"
            value={form.age}
            onChange={handleChange}
            placeholder="e.g. 42"
          />
          {errors.age && <span className={styles.fieldError}>{errors.age}</span>}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="gender">Gender</label>
        <select id="gender" name="gender" value={form.gender} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          type="text"
          value={form.address}
          onChange={handleChange}
          placeholder="e.g. Hauptstraße 12, 10115 Berlin"
        />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => router.push("/patients")}
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
