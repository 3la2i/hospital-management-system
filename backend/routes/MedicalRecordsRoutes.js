
// const express = require("express");
// const router = express.Router();
// const medicalRecordsController = require("../controllers/medicalRecordsController");
// const authMiddleware = require("../middlewares/auth");

// // Get user's medical records
// router.get("/", authMiddleware, medicalRecordsController.getUserMedicalRecords);

// // Create a new medical record (only for doctors)
// router.post(
//   "/",
//   authMiddleware,
//   (req, res, next) => {
//     if (req.user.role !== "Doctor") {
//       return res
//         .status(403)
//         .json({ message: "Only doctors can create medical records" });
//     }
//     next();
//   },
//   medicalRecordsController.createMedicalRecord
// );

// // Update a medical record (only for doctors)
// router.put(
//   "/:id",
//   authMiddleware,
//   (req, res, next) => {
//     if (req.user.role !== "Doctor") {
//       return res
//         .status(403)
//         .json({ message: "Only doctors can update medical records" });
//     }
//     next();
//   },
//   medicalRecordsController.updateMedicalRecord
// );

// // Delete a medical record (only for doctors)
// router.delete(
//   "/:id",
//   authMiddleware,
//   (req, res, next) => {
//     if (req.user.role !== "Doctor") {
//       return res
//         .status(403)
//         .json({ message: "Only doctors can delete medical records" });
//     }
//     next();
//   },
//   medicalRecordsController.deleteMedicalRecord
// );

// module.exports = router;
// routes/userRoutes.js

const pool = require("../config/db");

const getMedicalRecordsForUser = async (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT pmr.*, u.name AS doctor_name, dd.specialization
    FROM PatientMedicalRecords pmr
    INNER JOIN Users u ON pmr.doctor_id = u.id
    LEFT JOIN DoctorDetails dd ON pmr.doctor_details = dd.id
    WHERE pmr.patient_id = $1 AND pmr.is_deleted = FALSE
    ORDER BY pmr.visit_date DESC
  `;

  try {
    const result = await pool.query(query, [userId]);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching medical records for user:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getMedicalRecordsForUser,
};
