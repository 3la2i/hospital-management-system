const express = require('express');
const router = express.Router();
const doctorAppointmentsController = require('../controllers/doctorAppointmentsController');

router.get('/getAppointments/:doctorId', doctorAppointmentsController.getAppointmentsByDoctor);
router.put('/updateStatus/:appointmentId', doctorAppointmentsController.updateStatus);



module.exports = router;