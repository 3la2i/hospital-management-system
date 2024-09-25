const pool = require("../../config/db");

const findPatients = async (req, res) => {
  const query = "SELECT * FROM users WHERE role = $1 AND is_deleted = false";
  const values = ["Patient"];

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error finding patients:", error);
    res.status(500).json({ error: "Error finding patients" });
  }
};

const findDoctors = async (req, res) => {
  const query = "SELECT * FROM users WHERE role = $1 AND is_deleted = false";
  const values = ["Doctor"];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No doctors found" });
    }
    console.log(`${result.rows.length} doctor(s) found`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error finding doctors:", error);
    res.status(500).json({ error: "Error finding doctors" });
  }
};

const editDoctor = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const query =
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 AND role = $4 AND is_deleted = false RETURNING *";
  const values = [name, email, id, "Doctor"];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Doctor not found or already deleted" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ error: "Error updating doctor" });
  }
};

const deleteDoctor = async (req, res) => {
  const { id } = req.params;

  const query =
    "UPDATE users SET is_deleted = true WHERE id = $1 AND role = $2 AND is_deleted = false RETURNING *";
  const values = [id, "Doctor"];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Doctor not found or already deleted" });
    }
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ error: "Error deleting doctor" });
  }
};

const editPatient = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  const { name, email } = req.body;

  const query =
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 AND role = $4 RETURNING *";
  const values = [name, email, id, "Patient"];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ error: "Error updating patient" });
  }
};

const deletePatient = async (req, res) => {
  const { id } = req.params;

  const query =
    "UPDATE users SET is_deleted = true WHERE id = $1 AND role = $2 RETURNING *";
  const values = [id, "Patient"];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ error: "Error deleting patient" });
  }
};

const findAppointments = async (req, res) => {
  const query = `
    SELECT
      a.id,
      da.date,
      da.time_slot,
      CASE 
        WHEN a.status = 'confirmed' THEN 'confirmed' 
        ELSE 'pending' 
      END AS status,
      a.notes,
      p.name AS patient_name,
      da.doctor_id  -- Assuming you have the doctor_id in the DoctorAvailability table
    FROM
      appointments a
    JOIN
      users p ON a.patient_id = p.id
    JOIN
      doctoravailability da ON a.availability_id = da.id
    WHERE
      a.is_deleted = false
    ORDER BY
      da.date DESC, da.time_slot ASC
  `;
  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error finding appointments:", error);
    res.status(500).json({ error: "Error finding appointments" });
  }
};



const findAllMedicalRecords = async (req, res) => {
  const query = `
    SELECT 
      pmr.*,
      u.name AS doctor_name,
      dd.hospital_name
    FROM 
      PatientMedicalRecords pmr
    JOIN 
      Users u ON pmr.doctor_id = u.id
    JOIN 
      DoctorDetails dd ON pmr.doctor_details = dd.id
    WHERE 
      pmr.is_deleted = false
    ORDER BY 
      pmr.visit_date DESC
  `;

  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error finding medical records:", error);
    res.status(500).json({ error: "Error finding medical records" });
  }
};

const updateMedicalRecord = async (req, res) => {
  const { id } = req.params;
  const {
    diagnosis,
    treatment_plan,
    medications,
    follow_up_date,
    visit_notes,
    is_paid,
  } = req.body;
  const query = `
    UPDATE PatientMedicalRecords 
    SET diagnosis = $1, treatment_plan = $2, medications = $3, follow_up_date = $4, visit_notes = $5, is_paid = $6, updated_at = CURRENT_TIMESTAMP
    WHERE id = $7 AND is_deleted = false
    RETURNING *
  `;
  const values = [
    diagnosis,
    treatment_plan,
    medications,
    follow_up_date,
    visit_notes,
    is_paid,
    id,
  ];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Medical record not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating medical record:", error);
    res.status(500).json({ error: "Error updating medical record" });
  }
};

const deleteMedicalRecord = async (req, res) => {
  const { id } = req.params;
  const query = `
    UPDATE PatientMedicalRecords 
    SET is_deleted = true 
    WHERE id = $1 AND is_deleted = false
    RETURNING *
  `;

  try {
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Medical record not found or already deleted" });
    }
    res.json({ message: "Medical record deleted successfully" });
  } catch (error) {
    console.error("Error deleting medical record:", error);
    res.status(500).json({ error: "Error deleting medical record" });
  }
};

module.exports = {
  findPatients,
  editPatient,
  deletePatient,
  findDoctors,
  editDoctor,
  deleteDoctor,
  findAppointments,
  findAllMedicalRecords,
  updateMedicalRecord,
  deleteMedicalRecord,
};
