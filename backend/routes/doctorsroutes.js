const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorscontroller');

router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.post('/:id/reviews', doctorController.createReview);
router.get('/:id/reviews', doctorController.getReviewsForDoctor);
router.put('/:id/reviews/:reviewId', doctorController.updateReview);

module.exports = router;