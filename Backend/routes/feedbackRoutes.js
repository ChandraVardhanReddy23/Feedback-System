const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Submit Feedback
router.post("/", (req, res) => {
  const { lecturer_id, rating, comments } = req.body;
  const sql = "INSERT INTO feedback (lecturer_id, rating, comments) VALUES (?, ?, ?)";
  db.query(sql, [lecturer_id, rating, comments], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Feedback submitted successfully" });
  });
});

// Get Feedback (Admin)
router.get("/", (req, res) => {
  const sql = `
    SELECT lecturers.name, feedback.rating, feedback.comments, feedback.created_at
    FROM feedback
    JOIN lecturers ON feedback.lecturer_id = lecturers.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;
