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
import { Appointment, AppointmentInput } from "@/types";

const appointmentsRef = collection(db, "appointments");

export async function getAppointments(): Promise<Appointment[]> {
  const q = query(appointmentsRef, orderBy("appointmentDate", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate() ?? new Date(),
    updatedAt: docSnap.data().updatedAt?.toDate() ?? new Date(),
  })) as Appointment[];
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const ref = doc(db, "appointments", id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return {
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate() ?? new Date(),
    updatedAt: snapshot.data().updatedAt?.toDate() ?? new Date(),
  } as Appointment;
}

export async function createAppointment(data: AppointmentInput): Promise<string> {
  const docRef = await addDoc(appointmentsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateAppointment(
  id: string,
  data: Partial<AppointmentInput>
): Promise<void> {
  const ref = doc(db, "appointments", id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteAppointment(id: string): Promise<void> {
  await deleteDoc(doc(db, "appointments", id));
}
