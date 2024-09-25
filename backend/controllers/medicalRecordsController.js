// // const pool = require("../config/db");

// // const medicalRecordsController = {
// //   getUserMedicalRecords: async (req, res) => {
// //     const userId = req.user.id;
// //     const userRole = req.user.role;

// //     try {
// //       let query;
// //       let queryParams = [userId];

// //       if (userRole === "Patient") {
// //         query = `
// //           SELECT 
// //             pmr.*, 
// //             u.name AS doctor_name,
// //             dd.specialization
// //           FROM 
// //             PatientMedicalRecords pmr
// //           JOIN 
// //             Users u ON pmr.doctor_id = u.id
// //           JOIN 
// //             DoctorDetails dd ON pmr.doctor_id = dd.user_id
// //           WHERE 
// //             pmr.patient_id = $1 AND pmr.is_deleted = false
// //           ORDER BY 
// //             pmr.visit_date DESC
// //         `;
// //       } else if (userRole === "Doctor") {
// //         query = `
// //           SELECT 
// //             pmr.*, 
// //             u.name AS patient_name
// //           FROM 
// //             PatientMedicalRecords pmr
// //           JOIN 
// //             Users u ON pmr.patient_id = u.id
// //           WHERE 
// //             pmr.doctor_id = $1 AND pmr.is_deleted = false
// //           ORDER BY 
// //             pmr.visit_date DESC
// //         `;
// //       } else {
// //         return res.status(403).json({ message: "Unauthorized access" });
// //       }

// //       const result = await pool.query(query, queryParams);
// //       res.json(result.rows);
// //     } catch (error) {
// //       console.error("Error fetching medical records:", error);
// //       res.status(500).json({ message: "Internal server error" });
// //     }
// //   },

// //   createMedicalRecord: async (req, res) => {
// //     const {
// //       patient_id,
// //       doctor_details,
// //       price,
// //       diagnosis,
// //       treatment_plan,
// //       medications,
// //       follow_up_date,
// //       visit_notes,
// //     } = req.body;
// //     const doctor_id = req.user.id;

// //     try {
// //       const query = `
// //         INSERT INTO PatientMedicalRecords 
// //         (patient_id, doctor_id, doctor_details, price, diagnosis, treatment_plan, medications, follow_up_date, visit_notes, visit_date)
// //         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_DATE)
// //         RETURNING *
// //       `;

// //       const values = [
// //         patient_id,
// //         doctor_id,
// //         doctor_details,
// //         price,
// //         diagnosis,
// //         treatment_plan,
// //         medications,
// //         follow_up_date,
// //         visit_notes,
// //       ];
// //       const result = await pool.query(query, values);

// //       res.status(201).json(result.rows[0]);
// //     } catch (error) {
// //       console.error("Error creating medical record:", error);
// //       res.status(500).json({ message: "Internal server error" });
// //     }
// //   },

// //   updateMedicalRecord: async (req, res) => {
// //     const { id } = req.params;
// //     const {
// //       diagnosis,
// //       treatment_plan,
// //       medications,
// //       follow_up_date,
// //       visit_notes,
// //     } = req.body;
// //     const doctor_id = req.user.id;

// //     try {
// //       const query = `
// //         UPDATE PatientMedicalRecords
// //         SET diagnosis = $1, treatment_plan = $2, medications = $3, follow_up_date = $4, visit_notes = $5, updated_at = CURRENT_TIMESTAMP
// //         WHERE id = $6 AND doctor_id = $7
// //         RETURNING *
// //       `;

// //       const values = [
// //         diagnosis,
// //         treatment_plan,
// //         medications,
// //         follow_up_date,
// //         visit_notes,
// //         id,
// //         doctor_id,
// //       ];
// //       const result = await pool.query(query, values);

// //       if (result.rows.length === 0) {
// //         return res.status(404).json({
// //           message:
// //             "Medical record not found or you're not authorized to update it",
// //         });
// //       }

// //       res.json(result.rows[0]);
// //     } catch (error) {
// //       console.error("Error updating medical record:", error);
// //       res.status(500).json({ message: "Internal server error" });
// //     }
// //   },

// //   deleteMedicalRecord: async (req, res) => {
// //     const { id } = req.params;
// //     const doctor_id = req.user.id;

// //     try {
// //       const query = `
// //         UPDATE PatientMedicalRecords
// //         SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
// //         WHERE id = $1 AND doctor_id = $2
// //         RETURNING *
// //       `;

// //       const result = await pool.query(query, [id, doctor_id]);

// //       if (result.rows.length === 0) {
// //         return res.status(404).json({
// //           message:
// //             "Medical record not found or you're not authorized to delete it",
// //         });
// //       }

// //       res.json({ message: "Medical record deleted successfully" });
// //     } catch (error) {
// //       console.error("Error deleting medical record:", error);
// //       res.status(500).json({ message: "Internal server error" });
// //     }
// //   },
// // };

// // module.exports = medicalRecordsController;
// const pool = require("../config/db");

// const medicalRecordsController = {
//   getUserMedicalRecords: async (req, res) => {
//     const userId = req.user.id;
//     const userRole = req.user.role;

//     try {
//       let query;
//       let queryParams = [userId];

//       if (userRole === "Patient") {
//         query = `
//           SELECT 
//             pmr.*, 
//             u.name AS doctor_name,
//             dd.specialization
//           FROM 
//             PatientMedicalRecords pmr
//           JOIN 
//             Users u ON pmr.doctor_id = u.id
//           LEFT JOIN 
//             DoctorDetails dd ON pmr.doctor_id = dd.user_id
//           WHERE 
//             pmr.patient_id = $1 AND pmr.is_deleted = false
//           ORDER BY 
//             pmr.visit_date DESC
//         `;
//       } else if (userRole === "Doctor") {
//         query = `
//           SELECT 
//             pmr.*, 
//             u.name AS patient_name
//           FROM 
//             PatientMedicalRecords pmr
//           JOIN 
//             Users u ON pmr.patient_id = u.id
//           WHERE 
//             pmr.doctor_id = $1 AND pmr.is_deleted = false
//           ORDER BY 
//             pmr.visit_date DESC
//         `;
//       } else {
//         return res.status(403).json({ error: "Unauthorized access" });
//       }

//       const result = await pool.query(query, queryParams);
//       res.json(result.rows);
//     } catch (error) {
//       console.error("Error fetching medical records:", error);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   },

//   createMedicalRecord: async (req, res) => {
//     const {
//       patient_id,
//       doctor_details,
//       price,
//       diagnosis,
//       treatment_plan,
//       medications,
//       follow_up_date,
//       visit_notes,
//     } = req.body;
//     const doctor_id = req.user.id;

//     try {
//       const query = `
//         INSERT INTO PatientMedicalRecords 
//         (patient_id, doctor_id, doctor_details, price, diagnosis, treatment_plan, medications, follow_up_date, visit_notes, visit_date)
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_DATE)
//         RETURNING *
//       `;

//       const values = [
//         patient_id,
//         doctor_id,
//         doctor_details,
//         price,
//         diagnosis,
//         treatment_plan,
//         medications,
//         follow_up_date,
//         visit_notes,
//       ];
//       const result = await pool.query(query, values);

//       res.status(201).json(result.rows[0]);
//     } catch (error) {
//       console.error("Error creating medical record:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },

//   updateMedicalRecord: async (req, res) => {
//     const { id } = req.params;
//     const {
//       diagnosis,
//       treatment_plan,
//       medications,
//       follow_up_date,
//       visit_notes,
//     } = req.body;
//     const doctor_id = req.user.id;

//     try {
//       const query = `
//         UPDATE PatientMedicalRecords
//         SET diagnosis = $1, treatment_plan = $2, medications = $3, follow_up_date = $4, visit_notes = $5, updated_at = CURRENT_TIMESTAMP
//         WHERE id = $6 AND doctor_id = $7
//         RETURNING *
//       `;

//       const values = [
//         diagnosis,
//         treatment_plan,
//         medications,
//         follow_up_date,
//         visit_notes,
//         id,
//         doctor_id,
//       ];
//       const result = await pool.query(query, values);

//       if (result.rows.length === 0) {
//         return res.status(404).json({
//           message:
//             "Medical record not found or you're not authorized to update it",
//         });
//       }

//       res.json(result.rows[0]);
//     } catch (error) {
//       console.error("Error updating medical record:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },

//   deleteMedicalRecord: async (req, res) => {
//     const { id } = req.params;
//     const doctor_id = req.user.id;

//     try {
//       const query = `
//         UPDATE PatientMedicalRecords
//         SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
//         WHERE id = $1 AND doctor_id = $2
//         RETURNING *
//       `;

//       const result = await pool.query(query, [id, doctor_id]);

//       if (result.rows.length === 0) {
//         return res.status(404).json({
//           message:
//             "Medical record not found or you're not authorized to delete it",
//         });
//       }

//       res.json({ message: "Medical record deleted successfully" });
//     } catch (error) {
//       console.error("Error deleting medical record:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },
// };

// module.exports = medicalRecordsController;


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