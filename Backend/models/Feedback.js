const db = require("../config/db");

const Feedback = {
  // Create new feedback (anonymous to admins)
  create: (feedbackData, callback) => {
    const query = "INSERT INTO feedbacks (user_id, faculty_id, rating, comments, created_at) VALUES (?, ?, ?, ?, NOW())";
    db.query(query, [feedbackData.user_id, feedbackData.faculty_id, feedbackData.rating, feedbackData.comments], callback);
  },

  // Get feedback by faculty (WITHOUT student details - anonymous view for admins)
  getFeedbackByFaculty: (facultyId, callback) => {
    const query = `
      SELECT 
        id,
        faculty_id,
        rating,
        comments,
        created_at
      FROM feedbacks
      WHERE faculty_id = ?
      ORDER BY created_at DESC
    `;
    db.query(query, [facultyId], callback);
  },

  // Get all feedback for admin dashboard (WITHOUT student details - anonymous view)
  getAllFeedback: (callback) => {
    const query = `
      SELECT 
        f.id,
        f.faculty_id,
        f.rating,
        f.comments,
        f.created_at,
        fac.name as faculty_name,
        fac.department
      FROM feedbacks f
      JOIN faculties fac ON f.faculty_id = fac.id
      ORDER BY f.created_at DESC
    `;
    db.query(query, callback);
  },

  // Get feedback by ID (for validation purposes only, used by backend)
  getById: (id, callback) => {
    const query = "SELECT id, user_id, faculty_id, rating, comments, created_at FROM feedbacks WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  // Check if user has already submitted feedback for a faculty
  checkDuplicate: (userId, facultyId, callback) => {
    const query = "SELECT id FROM feedbacks WHERE user_id = ? AND faculty_id = ?";
    db.query(query, [userId, facultyId], (err, results) => {
      if (err) return callback(err);
      callback(null, results.length > 0);
    });
  },

  // Get user's feedback submissions (for frontend to show what they've submitted)
  getUserSubmissions: (userId, callback) => {
    const query = `
      SELECT 
        f.id,
        f.faculty_id,
        fac.name as faculty_name,
        f.rating,
        f.created_at
      FROM feedbacks f
      JOIN faculties fac ON f.faculty_id = fac.id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `;
    db.query(query, [userId], callback);
  },

  // Update feedback (only by the user who submitted it)
  update: (id, userId, feedbackData, callback) => {
    const query = "UPDATE feedbacks SET rating = ?, comments = ? WHERE id = ? AND user_id = ?";
    db.query(query, [feedbackData.rating, feedbackData.comments, id, userId], callback);
  },

  // Delete feedback (only by the user who submitted it)
  delete: (id, userId, callback) => {
    const query = "DELETE FROM feedbacks WHERE id = ? AND user_id = ?";
    db.query(query, [id, userId], callback);
  },

  // Get feedback statistics (anonymous)
  getStatistics: (facultyId, callback) => {
    const query = `
      SELECT 
        COUNT(*) as total_feedbacks,
        AVG(rating) as average_rating,
        MIN(rating) as min_rating,
        MAX(rating) as max_rating
      FROM feedbacks
      WHERE faculty_id = ?
    `;
    db.query(query, [facultyId], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }
};

module.exports = Feedback;
