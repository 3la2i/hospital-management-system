// appointmentController.js

const pool = require("../config/db");
// appointmentController.js

exports.getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT a.id, a.patient_id, a.availability_id, a.status, a.notes, 
              da.date AS appointment_date, da.time_slot AS appointment_time, 
              da.doctor_id, 
              CASE 
                WHEN a.patient_id = $1 THEN d.name 
                ELSE p.name 
              END AS other_party_name,
              CASE 
                WHEN a.patient_id = $1 THEN 'Patient' 
                ELSE 'Doctor' 
              END AS user_role
       FROM public.appointments a
       JOIN public.doctoravailability da ON a.availability_id = da.id
       JOIN public.users p ON a.patient_id = p.id
       JOIN public.users d ON da.doctor_id = d.id
       WHERE (a.patient_id = $1 OR da.doctor_id = $1) AND a.is_deleted = FALSE
       ORDER BY da.date, da.time_slot`,
      [userId]
    );

    console.log("User appointments:", result.rows); // Log the appointments

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createAppointment = async (req, res) => {};

// appointmentController.js

exports.cancelAppointment = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { appointmentId } = req.params;
    console.log("Appointment ID to cancel:", appointmentId);

    if (!appointmentId || isNaN(parseInt(appointmentId))) {
      throw new Error("Invalid appointment ID");
    }

    // Get the current appointment details
    const currentAppointment = await client.query(
      "SELECT * FROM Appointments WHERE id = $1",
      [parseInt(appointmentId)]
    );

    console.log("Current appointment:", currentAppointment.rows[0]);

    if (currentAppointment.rows.length === 0) {
      throw new Error("Appointment not found");
    }

    const availabilityId = currentAppointment.rows[0].availability_id;

    // Update the appointment to set is_deleted to true
    const result = await client.query(
      "UPDATE Appointments SET is_deleted = TRUE WHERE id = $1 RETURNING *",
      [parseInt(appointmentId)]
    );

    // Set is_booked to false for the associated availability
    await client.query(
      "UPDATE DoctorAvailability SET is_booked = FALSE WHERE id = $1",
      [availabilityId]
    );

    await client.query("COMMIT");

    if (result.rows.length === 0) {
      throw new Error("Appointment not found");
    }

    res.status(200).json({ message: "Appointment canceled successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error canceling appointment:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  } finally {
    client.release();
  }
};

// appointmentController.js

exports.getAvailableTimes = async (req, res) => {
  try {
    const { doctorId } = req.params;
    console.log("Received doctor ID:", doctorId); // Log the received doctor ID

    if (!doctorId || isNaN(parseInt(doctorId))) {
      return res.status(400).json({ error: "Invalid doctor ID" });
    }

    const result = await pool.query(
      `SELECT da.id, da.date, da.time_slot
       FROM DoctorAvailability da
       WHERE da.doctor_id = $1 AND da.is_available = TRUE AND da.is_booked = FALSE AND da.is_deleted = FALSE
       ORDER BY da.date, da.time_slot`,
      [parseInt(doctorId)]
    );

    console.log("Query result:", result.rows); // Log the query result

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching available times:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// appointmentController.js

exports.rescheduleAppointment = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { appointmentId } = req.params;
    const { newAvailabilityId } = req.body;

    console.log("Appointment ID:", appointmentId);
    console.log("New Availability ID:", newAvailabilityId);

    if (!appointmentId || isNaN(parseInt(appointmentId))) {
      throw new Error("Invalid appointment ID");
    }

    if (!newAvailabilityId || isNaN(parseInt(newAvailabilityId))) {
      throw new Error("Invalid new availability ID");
    }

    // Get the current appointment details
    const currentAppointment = await client.query(
      "SELECT * FROM Appointments WHERE id = $1",
      [parseInt(appointmentId)]
    );

    console.log("Current appointment:", currentAppointment.rows[0]);

    if (currentAppointment.rows.length === 0) {
      throw new Error("Appointment not found");
    }

    const oldAvailabilityId = currentAppointment.rows[0].availability_id;

    // Update the appointment with the new availability
    await client.query(
      "UPDATE Appointments SET availability_id = $1 WHERE id = $2",
      [parseInt(newAvailabilityId), parseInt(appointmentId)]
    );

    // Set is_booked to false for the old availability
    await client.query(
      "UPDATE DoctorAvailability SET is_booked = FALSE WHERE id = $1",
      [oldAvailabilityId]
    );

    // Set is_booked to true for the new availability
    await client.query(
      "UPDATE DoctorAvailability SET is_booked = TRUE WHERE id = $1",
      [parseInt(newAvailabilityId)]
    );

    await client.query("COMMIT");
    res.status(200).json({ message: "Appointment rescheduled successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error rescheduling appointment:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  } finally {
    client.release();
  }
};





// // appointmentController.js

// const pool = require("../config/db");
// // appointmentController.js

// exports.getUserAppointments = async (req, res) => {
//   try {
// <<<<<<< abdalla
//     const userId = req.params.userId;
//     console.log("userId", userId);
//     const query = `
//       SELECT 
//         a.id AS appointment_id,
//         a.status AS appointment_status,
//         a.notes AS appointment_notes,
//         da.date AS appointment_date,
//         da.time_slot AS appointment_time,
// =======
//     const { userId } = req.params;
//     const result = await pool.query(
//       `SELECT a.*, 
// >>>>>>> main
//         CASE 
//           WHEN a.patient_id = $1 THEN d.name 
//           ELSE p.name 
//         END AS other_party_name,
//         CASE 
//           WHEN a.patient_id = $1 THEN 'Patient' 
//           ELSE 'Doctor' 
//         END AS user_role,
//         da.date AS appointment_date,
//         da.time_slot AS appointment_time,
//         a.doctor_id
//       FROM Appointments a
//       JOIN Users p ON a.patient_id = p.id
//       JOIN Users d ON a.doctor_id = d.id
//       JOIN DoctorAvailability da ON a.availability_id = da.id
//       WHERE (a.patient_id = $1 OR a.doctor_id = $1) AND a.is_deleted = FALSE
//       ORDER BY da.date, da.time_slot`,
//       [userId]
//     );

//     console.log("User appointments:", result.rows); // Log the appointments

//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error("Error fetching user appointments:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// exports.createAppointment = async (req, res) => {};

// // appointmentController.js

// exports.cancelAppointment = async (req, res) => {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");

//     const { appointmentId } = req.params;
//     console.log("Appointment ID to cancel:", appointmentId);

//     if (!appointmentId || isNaN(parseInt(appointmentId))) {
//       throw new Error("Invalid appointment ID");
//     }

//     // Get the current appointment details
//     const currentAppointment = await client.query(
//       "SELECT * FROM Appointments WHERE id = $1",
//       [parseInt(appointmentId)]
//     );

//     console.log("Current appointment:", currentAppointment.rows[0]);

//     if (currentAppointment.rows.length === 0) {
//       throw new Error("Appointment not found");
//     }

//     const availabilityId = currentAppointment.rows[0].availability_id;

//     // Update the appointment to set is_deleted to true
//     const result = await client.query(
//       "UPDATE Appointments SET is_deleted = TRUE WHERE id = $1 RETURNING *",
//       [parseInt(appointmentId)]
//     );

//     // Set is_booked to false for the associated availability
//     await client.query(
//       "UPDATE DoctorAvailability SET is_booked = FALSE WHERE id = $1",
//       [availabilityId]
//     );

//     await client.query("COMMIT");

//     if (result.rows.length === 0) {
//       throw new Error("Appointment not found");
//     }

//     res.status(200).json({ message: "Appointment canceled successfully" });
//   } catch (error) {
//     await client.query("ROLLBACK");
//     console.error("Error canceling appointment:", error);
//     res.status(500).json({ error: error.message || "Internal server error" });
//   } finally {
//     client.release();
//   }
// };

// // appointmentController.js

// exports.getAvailableTimes = async (req, res) => {
//   try {
//     const { doctorId } = req.params;
//     console.log("Received doctor ID:", doctorId); // Log the received doctor ID

//     if (!doctorId || isNaN(parseInt(doctorId))) {
//       return res.status(400).json({ error: "Invalid doctor ID" });
//     }

//     const result = await pool.query(
//       `SELECT da.id, da.date, da.time_slot
//        FROM DoctorAvailability da
//        WHERE da.doctor_id = $1 AND da.is_available = TRUE AND da.is_booked = FALSE AND da.is_deleted = FALSE
//        ORDER BY da.date, da.time_slot`,
//       [parseInt(doctorId)]
//     );

//     console.log("Query result:", result.rows); // Log the query result

//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error("Error fetching available times:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// // appointmentController.js

// exports.rescheduleAppointment = async (req, res) => {
//   const client = await pool.connect();
//   try {
//     await client.query("BEGIN");

//     const { appointmentId } = req.params;
//     const { newAvailabilityId } = req.body;

//     console.log("Appointment ID:", appointmentId);
//     console.log("New Availability ID:", newAvailabilityId);

//     if (!appointmentId || isNaN(parseInt(appointmentId))) {
//       throw new Error("Invalid appointment ID");
//     }

//     if (!newAvailabilityId || isNaN(parseInt(newAvailabilityId))) {
//       throw new Error("Invalid new availability ID");
//     }

//     // Get the current appointment details
//     const currentAppointment = await client.query(
//       "SELECT * FROM Appointments WHERE id = $1",
//       [parseInt(appointmentId)]
//     );

//     console.log("Current appointment:", currentAppointment.rows[0]);

//     if (currentAppointment.rows.length === 0) {
//       throw new Error("Appointment not found");
//     }

//     const oldAvailabilityId = currentAppointment.rows[0].availability_id;

//     // Update the appointment with the new availability
//     await client.query(
//       "UPDATE Appointments SET availability_id = $1 WHERE id = $2",
//       [parseInt(newAvailabilityId), parseInt(appointmentId)]
//     );

//     // Set is_booked to false for the old availability
//     await client.query(
//       "UPDATE DoctorAvailability SET is_booked = FALSE WHERE id = $1",
//       [oldAvailabilityId]
//     );

//     // Set is_booked to true for the new availability
//     await client.query(
//       "UPDATE DoctorAvailability SET is_booked = TRUE WHERE id = $1",
//       [parseInt(newAvailabilityId)]
//     );

//     await client.query("COMMIT");
//     res.status(200).json({ message: "Appointment rescheduled successfully" });
//   } catch (error) {
//     await client.query("ROLLBACK");
//     console.error("Error rescheduling appointment:", error);
//     res.status(500).json({ error: error.message || "Internal server error" });
//   } finally {
//     client.release();
//   }
// };
