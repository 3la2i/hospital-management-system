// controllers/doctorAvailabilityController.js
const pool = require('../config/db');

console.log('11')
const addDoctorAvailability = async (req, res) => {
  const { doctor_id, date, time_slot, is_available } = req.body;

  const query = `
    INSERT INTO DoctorAvailability (doctor_id, date, time_slot, is_available)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [doctor_id, date, time_slot, is_available];

  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getDoctorAvailability = async (req, res) => {
  const doctorId = req.params.doctorId; // Get doctor ID from the URL
  const { date } = req.query; // Get optional date from query parameters

  // Validate input
  if (!doctorId) {
    return res.status(400).json({ error: 'doctor_id is required' });
  }

  let query = `SELECT * FROM DoctorAvailability WHERE doctor_id = $1 AND is_deleted = FALSE `;
  let values = [doctorId];

  if (date) {
    query += ' AND date = $2';
    values.push(date);
  }

  try {
    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: err.message });
  }
};


// Edit doctor availability
const editDoctorAvailability = async (req, res) => {
  const availabilityId = req.params.id;
  const { date, time_slot, is_available, is_booked } = req.body;

  const query = `
    UPDATE DoctorAvailability 
    SET date = $1, time_slot = $2, is_available = $3, is_booked = $4
    WHERE id = $5
    RETURNING *;
  `;
  const values = [date, time_slot, is_available, is_booked, availabilityId];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Availability not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Soft delete doctor availability
const deleteDoctorAvailability = async (req, res) => {
  const { id } = req.params;

  const query = `
    UPDATE DoctorAvailability
    SET is_deleted = TRUE
    WHERE id = $1
    RETURNING *;
  `;
  const values = [id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Availability not found or already deleted' });
    }
    res.status(200).json({ message: 'Availability deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllDoctorAvailability = async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT da.id, da.doctor_id, u.name as doctor_name, da.date, da.time_slot, da.is_available, da.is_booked
          FROM DoctorAvailability da
          JOIN Users u ON da.doctor_id = u.id
          WHERE da.is_deleted = FALSE
          ORDER BY da.date, da.time_slot;
      `);
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching availability:', error);
      res.status(500).json({ message: 'Server error fetching availability' });
  }
};



module.exports = {
  addDoctorAvailability,
  getDoctorAvailability,
  editDoctorAvailability,
  deleteDoctorAvailability,
  getAllDoctorAvailability
};