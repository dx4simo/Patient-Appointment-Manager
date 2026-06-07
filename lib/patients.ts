import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Patient, PatientInput } from "@/types";

const patientsRef = collection(db, "patients");

export async function getPatients(): Promise<Patient[]> {
  const q = query(patientsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate() ?? new Date(),
    updatedAt: docSnap.data().updatedAt?.toDate() ?? new Date(),
  })) as Patient[];
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const ref = doc(db, "patients", id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate() ?? new Date(),
    updatedAt: snapshot.data().updatedAt?.toDate() ?? new Date(),
  } as Patient;
}

export async function createPatient(data: PatientInput): Promise<string> {
  const docRef = await addDoc(patientsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePatient(id: string, data: Partial<PatientInput>): Promise<void> {
  const ref = doc(db, "patients", id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePatient(id: string): Promise<void> {
  await deleteDoc(doc(db, "patients", id));
}
