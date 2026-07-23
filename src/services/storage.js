// ======================================================
// storage.js
// Compatibility layer
// All functions are re-exported from patientService.js
// ======================================================

export {
  addPatient,
  getPatients,
  getPatientById,
  findPatient,
  updatePatient,
  addConsultation,
  getConsultations,
  deleteConsultation
} from "./patientService";