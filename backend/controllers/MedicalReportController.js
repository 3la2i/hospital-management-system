const pool = require('../config/db');

const getPatientMedicalRecords = async (req, res) => {
  const { doctor_id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const isPaid = req.query.is_paid === 'true' || req.query.is_paid === 'false' ? req.query.is_paid : null;
  const name = req.query.name ? req.query.name.toLowerCase() : null;

  const offset = (page - 1) * limit;

  let countQueryText = `
    SELECT COUNT(*)
    FROM public.patientmedicalrecords pmr
    JOIN public.Users u ON pmr.patient_id = u.id
    WHERE pmr.doctor_id = $1 AND pmr.is_deleted = false
  `;

  let queryText = `
    SELECT pmr.id, pmr.patient_id, pmr.doctor_id, pmr.doctor_details, pmr.price, pmr.is_paid, pmr.visit_date, 
           pmr.diagnosis, pmr.treatment_plan, pmr.medications, pmr.follow_up_date, pmr.visit_notes, 
           pmr.is_deleted, pmr.created_at, pmr.updated_at, u.name AS patient_name
    FROM public.patientmedicalrecords pmr
    JOIN public.Users u ON pmr.patient_id = u.id
    WHERE pmr.doctor_id = $1 AND pmr.is_deleted = false
  `;

  const queryParams = [doctor_id];

  // Append is_paid filter
  if (isPaid !== null) {
    countQueryText += ' AND pmr.is_paid = $2';
    queryText += ' AND pmr.is_paid = $2';
    queryParams.push(isPaid === 'true'); // Convert string to boolean
  }

  // Append name filter
  if (name) {
    countQueryText += ' AND LOWER(u.name) LIKE $' + (queryParams.length + 1);
    queryText += ' AND LOWER(u.name) LIKE $' + (queryParams.length + 1);
    queryParams.push(`%${name}%`);
  }

  // Append limit and offset to the records query
  queryText += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2};`;
  queryParams.push(limit, offset);

  try {
    const countResult = await pool.query(countQueryText, queryParams.slice(0, queryParams.length - 2));
    const totalRecords = parseInt(countResult.rows[0].count);

    const result = await pool.query(queryText, queryParams);

    res.status(200).json({
      success: true,
      data: result.rows,
      totalRecords: totalRecords,
      page: page,
      limit: limit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching medical records',
      error: error.message,
    });
  }
};






  
  
  
  /////////////////////////////////////////////////////
  const updateRecordStatus = async (req, res) => {
    const { record_id } = req.params; // Get the record ID from the URL parameters
    const { softDelete, updatePaidStatus } = req.body; // Optional parameters to trigger soft delete or payment status update
  
    // Base query setup
    let queryText = 'UPDATE public.patientmedicalrecords SET';
    const queryParams = [];
    let updateFields = [];

    // Conditionally update the is_paid field if updatePaidStatus is true
    if (updatePaidStatus === true) {
      updateFields.push(' is_paid = true');
    }

    // Conditionally update the is_deleted field if softDelete is true
    if (softDelete === true) {
      updateFields.push(' is_deleted = true');
    }

    // Ensure there's something to update
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No update parameters provided.',
      });
    }

    // Join the update fields with a comma
    queryText += updateFields.join(', ');

    // Add WHERE clause to target the record by ID
    queryText += ' WHERE id = $1 RETURNING *;';
    queryParams.push(record_id);

    try {
      const result = await pool.query(queryText, queryParams);

      // Check if the record was found and updated
      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Record not found or already updated',
        });
      }

      // Return the updated record
      res.status(200).json({
        success: true,
        message: softDelete ? 'Record soft deleted successfully' : 'Payment status updated successfully',
        data: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating record',
        error: error.message,
      });
    }
};

  


  /////////////////////////////////////////////////
  
  const createPatientMedicalRecord = async (req, res) => {
    const { patient_id, doctor_id, price, visit_date, diagnosis, treatment_plan, medications, follow_up_date, visit_notes } = req.body;
  
    try {
      // Step 1: Query doctor details using doctor_id
      const doctorDetailsQuery = `SELECT id FROM public.doctordetails WHERE doctor_id = $1 LIMIT 1;`;
      const doctorDetailsResult = await pool.query(doctorDetailsQuery, [doctor_id]);
  
      // Check if doctor details were found
      if (doctorDetailsResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Doctor details not found',
        });
      }
  
      // Step 2: Get the doctor_details_id (foreign key)
      const doctor_details = doctorDetailsResult.rows[0].id;
  
      // Step 3: Insert the new patient medical record using the retrieved doctor_details_id
      const insertText = `
        INSERT INTO public.patientmedicalrecords (patient_id, doctor_id, doctor_details, price, is_paid, visit_date, diagnosis, treatment_plan, medications, follow_up_date, visit_notes, is_deleted, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
        RETURNING *;
      `;
  
      const values = [
        patient_id, 
        doctor_id, 
        doctor_details,  // Use the foreign key instead of doctor_details
        price, 
        false,  // is_paid, default to false
        visit_date, 
        diagnosis, 
        treatment_plan, 
        medications, 
        follow_up_date, 
        visit_notes, 
        false,  // is_deleted, default to false
      ];
  
      const result = await pool.query(insertText, values);
  
      res.status(201).json({
        success: true,
        message: 'Medical record created successfully',
        data: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating medical record',
        error: error.message,
      });
    }
  };
  

/************************************************ */


const getDoctorDetailsById = async (req, res) => {
  const { doctor_id } = req.params; 

  const sql = `
    SELECT 
      dd.id AS doctor_detail_id,
      dd.doctor_id,
      u.name AS doctor_name,
      dd.hospital_name,
      dd.phone_number,
      dd.address,
      dd.email,
      dd.created_at,
      dd.updated_at
    FROM 
      public.doctordetails dd
    JOIN 
      public.users u ON dd.doctor_id = u.id
    WHERE 
      u.id = $1 AND u.is_deleted = false;
  `;

  try {
    const result = await pool.query(sql, [doctor_id]);
    const doctorDetails = result.rows; 

   
    if (doctorDetails.length > 0) {
      return res.status(200).json({ doctor: doctorDetails[0] });
    } else {
      return res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    console.error('Error fetching doctor details:', error);
    return res.status(500).json({ error: 'Failed to retrieve doctor details' });
  }
};

module.exports = {
  createPatientMedicalRecord,
  getDoctorDetailsById,
  getPatientMedicalRecords,
  updateRecordStatus
};
