const pool = require('../config/db');

exports.getChatHistory = async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY created_at ASC',
      [senderId, receiverId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'An error occurred while fetching chat history' });
  }
};

exports.saveMessage = async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1, $2, $3) RETURNING *',
      [sender_id, receiver_id, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'An error occurred while saving the message' });
  }
};

exports.getUsersForDoctor = async (req, res) => {
  const { doctorId } = req.params; // Get doctorId from the request params

  try {
    const result = await pool.query(`
      SELECT DISTINCT u.id, u.name
      FROM public.messages m
      JOIN Users u ON u.id = m.sender_id
      WHERE m.receiver_id = $1
    `, [doctorId]);

    console.log("Fetched users:", result.rows); // Log the fetched users

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No users found for this doctor' });
    }

    res.json(result.rows); // Return the list of users who have received messages from the doctor
  } catch (error) {
    console.error('Error fetching users for doctor:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};



