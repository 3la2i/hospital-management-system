const pool = require('../config/db');

exports.getAllDoctors = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.email, dd.hospital_name, dd.phone_number, dd.address, dd.image
      FROM Users u
      LEFT JOIN DoctorDetails dd ON u.id = dd.doctor_id
      WHERE u.role = 'Doctor' AND u.is_deleted = FALSE
      ORDER BY u.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'An error occurred while fetching doctors' });
  }
};


// In your doctorController.js or wherever you fetch doctor details
exports.getDoctorById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT d.*, u.id as user_id
      FROM DoctorDetails d
      JOIN Users u ON d.doctor_id = u.id
      WHERE d.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching doctor details:', error);
    res.status(500).json({ error: 'An error occurred while fetching doctor details' });
  }
};


exports.createReview = async (req, res) => {
    const { doctor_id, rating, review, user_id } = req.body;
  
    try {
      // Check if a review already exists
      const existingReview = await pool.query(
        'SELECT * FROM Reviews WHERE user_id = $1 AND doctor_id = $2',
        [user_id, doctor_id]
      );

      if (existingReview.rows.length > 0) {
        return res.status(400).json({ error: 'You have already submitted a review for this doctor' });
      }

      // If no existing review, proceed with insertion
      const result = await pool.query(`
        INSERT INTO Reviews (user_id, doctor_id, rating, review)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [user_id, doctor_id, rating, review]);
  
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: 'An error occurred while creating the review' });
    }
};

exports.updateReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const { rating, review, user_id } = req.body;
  
    try {
      const result = await pool.query(`
        UPDATE Reviews
        SET rating = $1, review = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3 AND doctor_id = $4 AND user_id = $5
        RETURNING *
      `, [rating, review, reviewId, id, user_id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Review not found or not associated with this user and doctor' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ error: 'An error occurred while updating the review' });
    }
};

exports.getReviewsForDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT r.*, u.name as user_name
      FROM Reviews r
      JOIN Users u ON r.user_id = u.id
      WHERE r.doctor_id = $1
      ORDER BY r.created_at DESC
    `, [id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'An error occurred while fetching reviews' });
  }
};

exports.getUserReviewForDoctor = async (req, res) => {
  const { doctorId, userId } = req.params;
  try {
    const result = await pool.query(`
      SELECT r.*, u.name as user_name
      FROM Reviews r
      JOIN Users u ON r.user_id = u.id
      WHERE r.doctor_id = $1 AND r.user_id = $2
    `, [doctorId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user review:', error);
    res.status(500).json({ error: 'An error occurred while fetching the user review' });
  }
};

exports.getDoctorById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT d.*, u.id as user_id
      FROM DoctorDetails d
      JOIN Users u ON d.doctor_id = u.id
      WHERE d.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching doctor details:', error);
    res.status(500).json({ error: 'An error occurred while fetching doctor details' });
  }
};