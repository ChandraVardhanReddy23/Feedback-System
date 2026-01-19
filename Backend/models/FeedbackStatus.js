const db = require("../config/db");

const FeedbackStatus = {
  // Track which faculties a student has already given feedback for
  // This helps prevent duplicate submissions on the frontend

  // Get faculties the student has given feedback for
  getStudentFeedbackList: (userId, callback) => {
    const query = `
      SELECT DISTINCT faculty_id
      FROM feedbacks
      WHERE user_id = ?
    `;
    db.query(query, [userId], callback);
  },

  // Check if student has given feedback for a specific faculty
  hasFeedback: (userId, facultyId, callback) => {
    const query = `
      SELECT id FROM feedbacks
      WHERE user_id = ? AND faculty_id = ?
      LIMIT 1
    `;
    db.query(query, [userId, facultyId], (err, results) => {
      if (err) return callback(err);
      callback(null, results.length > 0);
    });
  },

  // Get status of all faculties for a student
  getStatusForAllFaculties: (userId, callback) => {
    const query = `
      SELECT 
        fac.id,
        fac.name,
        fac.department,
        CASE WHEN f.id IS NOT NULL THEN true ELSE false END as has_feedback,
        f.id as feedback_id,
        f.rating,
        f.created_at as feedback_date
      FROM faculties fac
      LEFT JOIN feedbacks f ON fac.id = f.faculty_id AND f.user_id = ?
      ORDER BY fac.name
    `;
    db.query(query, [userId], callback);
  }
};

module.exports = FeedbackStatus;
