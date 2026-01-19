const db = require("../config/db");

const User = {
  // Create a new user (student or admin)
  create: (userData, callback) => {
    const query = "INSERT INTO users (email, password, institutional_id, name, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
    db.query(query, [userData.email, userData.password, userData.institutional_id, userData.name, userData.role || "student"], callback);
  },

  // Find user by email
  findByEmail: (email, callback) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  // Find user by institutional ID
  findByInstitutionalId: (id, callback) => {
    const query = "SELECT * FROM users WHERE institutional_id = ?";
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  // Find user by ID
  findById: (id, callback) => {
    const query = "SELECT id, email, institutional_id, name, role FROM users WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  // Check if user exists
  exists: (email, institutionalId, callback) => {
    const query = "SELECT id FROM users WHERE email = ? OR institutional_id = ?";
    db.query(query, [email, institutionalId], (err, results) => {
      if (err) return callback(err);
      callback(null, results.length > 0);
    });
  }
};

module.exports = User;
