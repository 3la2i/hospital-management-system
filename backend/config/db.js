const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

pool.on("connect", (client) => {
  client.query("SET search_path TO taskcart, public");
});

pool.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected successfully");
  }
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database query error:", err);
  } else {
    console.log("Database query successful. Current time:", res.rows[0].now);
  }
});

module.exports = pool;
