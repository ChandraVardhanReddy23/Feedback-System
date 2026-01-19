const db = require("../config/db");

const Faculty = {
  // Create a new faculty/subject
  create: (facultyData, callback) => {
    const query = "INSERT INTO faculties (name, department, email, created_at) VALUES (?, ?, ?, NOW())";
    db.query(query, [facultyData.name, facultyData.department, facultyData.email], callback);
  },

  // Get all faculties
  getAll: (callback) => {
    const query = "SELECT id, name, department, email FROM faculties ORDER BY name";
    db.query(query, callback);
  },

  // Get faculty by ID
  getById: (id, callback) => {
    const query = "SELECT id, name, department, email FROM faculties WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  // Get faculty by name
  getByName: (name, callback) => {
    const query = "SELECT id, name, department, email FROM faculties WHERE name = ?";
    db.query(query, [name], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  // Update faculty
  update: (id, facultyData, callback) => {
    const query = "UPDATE faculties SET name = ?, department = ?, email = ? WHERE id = ?";
    db.query(query, [facultyData.name, facultyData.department, facultyData.email, id], callback);
  },

  // Delete faculty
  delete: (id, callback) => {
    const query = "DELETE FROM faculties WHERE id = ?";
    db.query(query, [id], callback);
  }
};

module.exports = Faculty;
