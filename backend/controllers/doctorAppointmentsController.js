const pool = require('../config/db'); 

const getAppointmentsByDoctor = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const query = `
      SELECT a.id, a.patient_id, u.name AS patient_name, da.doctor_id, a.availability_id, a.status, a.notes, a.is_deleted,
             da.date, da.time_slot
      FROM public.appointments a
      JOIN public.doctoravailability da ON a.availability_id = da.id  -- Now retrieving doctor_id from doctoravailability
      JOIN public.users u ON a.patient_id = u.id  -- Join with Users to get patient name
      WHERE da.doctor_id = $1 AND u.role = 'Patient';  -- Filter by doctor_id from doctoravailability
    `;

    const result = await pool.query(query, [doctorId]);

    res.status(200).json({
      message: 'Appointments retrieved successfully',
      appointments: result.rows,  // Rows contain the list of appointments with patient name, date, and time_slot
    });
  } catch (error) {
    console.error('Error fetching appointments for doctor:', error);
    res.status(500).json({
      message: 'Error fetching appointments',
      error,
    });
  }
};


const updateStatus = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    // Query the current status of the appointment
    const getStatusQuery = `
      SELECT status
      FROM public.appointments
      WHERE id = $1
    `;

    const statusResult = await pool.query(getStatusQuery, [appointmentId]);
    const currentStatus = statusResult.rows[0].status;

    // Determine the new status (toggle between 'true' and 'false')
    const newStatus = currentStatus === 'true' ? 'false' : 'true';

    // Update the appointment status
    const updateQuery = `
      UPDATE public.appointments
      SET status = $1
      WHERE id = $2
    `;

    await pool.query(updateQuery, [newStatus, appointmentId]);

    res.status(200).json({
      message: `Appointment status updated to ${newStatus}`,
      status: newStatus,  // Return the new status
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({
      message: 'Error updating appointment status',
      error,
    });
  }
};


module.exports = {
  getAppointmentsByDoctor, updateStatus,
};
