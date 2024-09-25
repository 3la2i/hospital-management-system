// const express = require("express");
// const router = express.Router();
// const appointmentController = require("../controllers/appointmentController");

// router.get("/user/:userId", appointmentController.getUserAppointments);

// module.exports = router;
const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.get("/user/:userId", appointmentController.getUserAppointments);
router.put("/:appointmentId/cancel", appointmentController.cancelAppointment);
router.get(
  "/available-times/:doctorId",
  appointmentController.getAvailableTimes
);
router.put(
  "/:appointmentId/reschedule",
  appointmentController.rescheduleAppointment
);

module.exports = router;