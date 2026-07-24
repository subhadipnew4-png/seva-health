import { supabase } from "./supabase";

function isMissingTableError(error) {
  return (
    error?.code === "PGRST205" ||
    error?.code === "42P01" ||
    error?.message?.includes("Could not find the table") ||
    error?.message?.includes("does not exist")
  );
}

/* ===========================
   PATIENTS
=========================== */

export async function addPatient(patient) {
  const { data: patients, error: patientsError } = await supabase
    .from("patients")
    .select("patient_code");

  if (patientsError) throw patientsError;

  let highestNumber = 0;

  for (const entry of patients || []) {
    const code = entry?.patient_code;

    if (typeof code !== "string") {
      continue;
    }

    const match = code.match(/^SH(\d{1,})$/i);

    if (!match) {
      continue;
    }

    const numericValue = Number(match[1]);

    if (Number.isFinite(numericValue) && numericValue > highestNumber) {
      highestNumber = numericValue;
    }
  }

  const patientCode = `SH${String(highestNumber + 1).padStart(4, "0")}`;
  const { patient_code: _ignoredPatientCode, ...patientRecord } = patient;

  const { data, error } = await supabase
    .from("patients")
    .insert([
      {
        ...patientRecord,
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

export async function getAllConsultations() {
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
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

export async function savePrescriptionMedicines(consultationId, prescriptionRows) {
  const rows = (prescriptionRows || []).map((row) => ({
    consultation_id: consultationId,
    medicine_id: row.medicineId,
    medicine_name: row.medicineName,
    quantity: row.quantity,
    dosage: row.dosage,
    duration: row.duration,
    instructions: row.instructions,
  }));

  if (rows.length === 0) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("prescription_medicines")
      .insert(rows)
      .select();

    if (error) throw error;

    return data || [];
  } catch (error) {
    if (!isMissingTableError(error)) {
      throw error;
    }

    try {
      const { data, error: fallbackError } = await supabase
        .from("prescription_items")
        .insert(rows)
        .select();

      if (fallbackError) {
        throw fallbackError;
      }

      return data || [];
    } catch (fallbackError) {
      console.warn("Unable to persist prescription lines", fallbackError);
      return [];
    }
  }
}

export async function deletePrescriptionMedicines(consultationId) {
  if (!consultationId) {
    return;
  }

  try {
    const { error } = await supabase
      .from("prescription_medicines")
      .delete()
      .eq("consultation_id", consultationId);

    if (error) throw error;
  } catch (error) {
    if (!isMissingTableError(error)) {
      throw error;
    }

    try {
      await supabase
        .from("prescription_items")
        .delete()
        .eq("consultation_id", consultationId);
    } catch (fallbackError) {
      console.warn("Unable to delete prescription lines", fallbackError);
    }
  }
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