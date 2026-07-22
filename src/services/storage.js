// ==========================
// STORAGE KEY
// ==========================

const STORAGE_KEY = "seva_health_patients";


// ==========================
// GET ALL PATIENTS
// ==========================

export function getPatients() {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}


// ==========================
// SAVE ALL PATIENTS
// ==========================

export function savePatients(patients) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(patients)
  );
}


// ==========================
// ADD NEW PATIENT
// ==========================

export function addPatient(patient) {

  const patients = getPatients();

  patient.patientId = "SH" + Date.now();

  patient.visits = [];

  patients.push(patient);

  savePatients(patients);
}


// ==========================
// FIND PATIENT
// ==========================

export function findPatient(mobile) {

  const patients = getPatients();

  return patients.find(function (patient) {
    return patient.mobile === mobile;
  });

}


// ==========================
// UPDATE PATIENT
// ==========================

export function updatePatient(updatedPatient) {

  const patients = getPatients();

  const index = patients.findIndex(function (patient) {
    return patient.mobile === updatedPatient.mobile;
  });

  if (index !== -1) {

    patients[index] = updatedPatient;

    savePatients(patients);

  }

}


// ==========================
// ADD CONSULTATION
// ==========================

export function addConsultation(mobile, consultation) {

  const patients = getPatients();

  const index = patients.findIndex(function (patient) {
    return patient.mobile === mobile;
  });

  if (index === -1) {
    return false;
  }

  if (!patients[index].visits) {
    patients[index].visits = [];
  }

  patients[index].visits.push(consultation);

  savePatients(patients);

  return true;

}


// ==========================
// GET CONSULTATIONS
// ==========================

export function getConsultations(mobile) {

  const patient = findPatient(mobile);

  if (!patient) {
    return [];
  }

  if (!patient.visits) {
    return [];
  }

  return patient.visits;

}