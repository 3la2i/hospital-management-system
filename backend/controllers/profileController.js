const pool = require("../config/db");
const bcrypt = require("bcrypt");

exports.updateProfile = async (req, res) => {
  const { id } = req.user; // Assuming you have middleware to extract user from token
  const { name, email, newPassword } = req.body;

  try {
    let query = "UPDATE Users SET name = $1, email = $2";
    let values = [name, email];

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      query += ", password = $3";
      values.push(hashedPassword);
    }

    query +=
      " WHERE id = $" +
      (values.length + 1) +
      " RETURNING id, name, email, role";
    values.push(id);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = result.rows[0];
    res.json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
