const express = require("express");
const {
  findPatients,
  findDoctors,
  editPatient,
  deletePatient,
  editDoctor,
  deleteDoctor,
  findAppointments,

  findAllMedicalRecords,
  updateMedicalRecord,
  deleteMedicalRecord,
} = require("../controllers/admain/admain");

const router = express.Router();

router.get("/patients", findPatients);
router.get("/doctors", findDoctors);
router.put("/patients/:id", editPatient);
router.delete("/patients/:id", deletePatient);
router.put("/doctors/:id", editDoctor);
router.delete("/doctors/:id", deleteDoctor);

//appointments
router.get("/appointments", findAppointments);

//MedicalRecord
router.get("/medical-records", findAllMedicalRecords);

router.put("/medical-records/:id", updateMedicalRecord);
router.delete("/medical-records/:id", deleteMedicalRecord);

module.exports = router;
