const express = require('express');
const router = express.Router();
const  MedicalReportController  = require('../controllers/MedicalReportController');
const authenticateToken = require('../middleware/auth');

router.post('/createPatientMedicalRecord', MedicalReportController.createPatientMedicalRecord);
router.get('/getPatientMedicalRecords/:doctor_id', MedicalReportController.getPatientMedicalRecords);
router.get("/getDoctorDetailsById/:doctor_id", MedicalReportController.getDoctorDetailsById);
router.put('/updateRecordStatus/:record_id', MedicalReportController.updateRecordStatus);

module.exports = router;