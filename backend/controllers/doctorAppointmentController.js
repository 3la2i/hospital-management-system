const pool = require('../config/db');


/// for main dashboard 


// Fetch appointments for a specific doctor and include total count of appointments and unique patients
exports.getDoctorAppointments = async (req, res) => {
    const { doctorId } = req.params;

    try {
        // SQL query to fetch appointments with patient details for the given doctor
        const result = await pool.query(
            `
            SELECT 
                a.id AS appointment_id,
                a.status AS appointment_status,
                a.notes AS appointment_notes,
                da.date AS appointment_date,
                da.time_slot AS appointment_time,
                u.id AS patient_id,
                u.name AS patient_name,
                u.email AS patient_email
            FROM Appointments a
            JOIN DoctorAvailability da ON a.availability_id = da.id
            JOIN Users u ON a.patient_id = u.id
            WHERE da.doctor_id = $1
            AND a.is_deleted = false
            AND da.is_deleted = false
            `,
            [doctorId]
        );

        // Get total count of appointments
        const totalAppointments = result.rowCount;

        // Get unique count of patients
        const uniquePatientsResult = await pool.query(
            `
            SELECT COUNT(DISTINCT u.id) AS total_unique_patients
            FROM Appointments a
            JOIN DoctorAvailability da ON a.availability_id = da.id
            JOIN Users u ON a.patient_id = u.id
            WHERE da.doctor_id = $1
            AND a.is_deleted = false
            AND da.is_deleted = false
            `,
            [doctorId]
        );

        const totalPatients = uniquePatientsResult.rows[0].total_unique_patients;

        // Check if any appointments found
        if (totalAppointments === 0) {
            return res.status(404).json({ message: 'No appointments found for this doctor.' });
        }

        // Send response with appointment details, total appointments, and total unique patients
        res.json({
            total_appointments: totalAppointments,
            total_patients: totalPatients,
            appointments: result.rows,
        });
    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



/////////// appointment for user 

// Function to book an appointment

const axios = require('axios');

// PayPal API configuration
const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com'; 
const PAYPAL_CLIENT_ID = 'AX5VEDtd9xOVzxNpnMEIhTPLPpld_TQIT9mDq1kTfsfRtVGDvf5uUX27mLtwqZctVoDSnGRTfMsdozAB';
const PAYPAL_CLIENT_SECRET ='EI-EThy7Jf_GOodSUWf3CI0QBXwTC9foDJBrkAhadla3-VxSEu7vydYlsbfIL2sQhIleGmNT5mi1Bwq7';

// Function to get PayPal access token
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  const response = await axios.post(`${PAYPAL_API_BASE}/v1/oauth2/token`, 'grant_type=client_credentials', {
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data.access_token;
}

// Function to verify PayPal payment
async function verifyPayPalPayment(orderId) {
  const accessToken = await getPayPalAccessToken();
  const response = await axios.get(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

exports.bookAppointment = async (req, res) => {
    const { patient_id, doctor_id, availability_id, notes, orderId } = req.body;

    try {
        // Verify PayPal payment
        const paymentDetails = await verifyPayPalPayment(orderId);

        // Check payment status
        if (paymentDetails.status !== 'COMPLETED') {
            return res.status(400).json({ message: 'Payment not completed.' });
        }

        // Start a transaction
           // Start a transaction
           await pool.query('BEGIN');

           // 1. Update DoctorAvailability table to mark the appointment as booked
           const updateQuery = `
               UPDATE DoctorAvailability 
               SET is_booked = true
               WHERE id = $1 AND doctor_id = $2 AND is_available = true AND is_booked = false
               RETURNING *;
           `;
           const updateResult = await pool.query(updateQuery, [availability_id, doctor_id]);
   
           // Check if the slot was successfully booked
           if (updateResult.rows.length === 0) {
               await pool.query('ROLLBACK');
               return res.status(400).json({ message: 'Appointment slot already booked or not available.' });
           }
   
           // 2. Insert into Appointments table
           const insertQuery = `
               INSERT INTO Appointments (patient_id, doctor_id, availability_id, notes, status)
               VALUES ($1, $2, $3, $4, $5)
               RETURNING *;
           `;
           const appointmentResult = await pool.query(insertQuery, [patient_id, doctor_id, availability_id, notes, true]);
   
           // 3. Fetch doctor's name
           const doctorQuery = `
               SELECT name FROM Users WHERE id = $1;
           `;
           const doctorResult = await pool.query(doctorQuery, [doctor_id]);
   
           // Commit the transaction
           await pool.query('COMMIT');
   
           // Send the response back to the client
           return res.status(201).json({
               message: 'Appointment booked and paid successfully.',
               appointment: {
                   ...appointmentResult.rows[0],
                   doctor_name: doctorResult.rows[0]?.name || 'Unknown',
                   date: updateResult.rows[0].date,
                   time_slot: updateResult.rows[0].time_slot
               },
           });
       } catch (error) {
           // Rollback the transaction in case of error
           await pool.query('ROLLBACK');
           console.error('Error booking appointment:', error);
           if (error.constraint === 'appointments_patient_id_doctor_id_availability_id_key') {
               return res.status(400).json({ message: 'You have already booked this appointment.' });
           }
           return res.status(500).json({ message: 'Internal server error.' });
       }
   };