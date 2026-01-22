const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// DO NOT crash the app on DB error
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.code);
  } else {
    console.log("✅ MySQL connected successfully");
    connection.release();
  }
});

module.exports = pool;
