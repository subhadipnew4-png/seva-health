import { supabase } from "./supabase";

/* ===========================
   PATIENTS
=========================== */

export async function addPatient(patient) {
  // NOTE:
  // This will be improved later with a proper sequence.
  // Keeping it as-is for now.

  const { data: latest } = await supabase
    .from("patients")
    .select("id")
    .order("id", { ascending: false })
    .limit(1);

  let nextNumber = 1;

  if (latest && latest.length > 0) {
    nextNumber = Number(latest[0].id) + 1;
  }

  const patientCode =
    "SH" + String(nextNumber).padStart(6, "0");

  const { data, error } = await supabase
    .from("patients")
    .insert([
      {
        ...patient,
        patient_code: patientCode,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getPatients() {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function getPatientById(id) {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;

  return data;
}

export async function findPatient(mobile) {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("mobile", mobile)
    .single();

  if (error) return null;

  return data;
}

export async function updatePatient(id, values) {
  const { data, error } = await supabase
    .from("patients")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

/* ===========================
   CONSULTATIONS
=========================== */

export async function addConsultation(consultation) {
  const { data, error } = await supabase
    .from("consultations")
    .insert([consultation])
    .select();

  if (error) throw error;

  return data;
}

export async function getConsultations(mobile) {
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .eq("mobile", mobile)
    .order("created_at", { ascending: false });

  if (error) return [];

  return data || [];
}

export async function deleteConsultation(id) {
  const { error } = await supabase
    .from("consultations")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/* ===========================
   MEDICINES
=========================== */

export async function getMedicines() {
  const { data, error } = await supabase
    .from("medicines")
    .select("*")
    .order("medicine_name", { ascending: true });

  if (error) throw error;

  return data || [];
}

export async function addMedicine(medicine) {
  const { data, error } = await supabase
    .from("medicines")
    .insert([medicine])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateMedicine(id, values) {
  const { data, error } = await supabase
    .from("medicines")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteMedicine(id) {
  const { error } = await supabase
    .from("medicines")
    .delete()
    .eq("id", id);

  if (error) throw error;
}