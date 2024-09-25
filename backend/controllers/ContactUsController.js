const pool = require('../config/db');

const ContactUsController = {
  // Create a new contact entry
  create: async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO ContactUs (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, subject, message]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all contact entries
  getAll: async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM ContactUs ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a single contact entry by ID
  getById: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM ContactUs WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Contact entry not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update a contact entry
  update: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const result = await pool.query(
        'UPDATE ContactUs SET status = $1, updated_at = CURRENT_TIMESTAMP, resolved_at = CASE WHEN $1 = \'Resolved\' THEN CURRENT_TIMESTAMP ELSE resolved_at END WHERE id = $2 RETURNING *',
        [status, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Contact entry not found' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete a contact entry
  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM ContactUs WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Contact entry not found' });
      }
      res.json({ message: 'Contact entry deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ContactUsController;