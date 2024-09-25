const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorAppointmentController');

// Route to get all appointments for a specific doctor
router.get('/appointments/:doctorId', doctorController.getDoctorAppointments);
router.post('/appointments/book', doctorController.bookAppointment);

module.exports = router;
