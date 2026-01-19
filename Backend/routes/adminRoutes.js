const express = require("express");
const Feedback = require("../models/Feedback");
const Faculty = require("../models/Faculty");
const { verifyToken, isAdmin } = require("../middleware/auth");

const router = express.Router();

// Get all feedback (anonymous view - NO student details)
router.get("/feedback", verifyToken, isAdmin, (req, res) => {
  Feedback.getAllFeedback((err, feedbacks) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    // Transform data to ensure no student information is exposed
    const anonymousFeedbacks = feedbacks.map((fb) => ({
      id: fb.id,
      faculty_id: fb.faculty_id,
      faculty_name: fb.faculty_name,
      department: fb.department,
      rating: fb.rating,
      comments: fb.comments,
      created_at: fb.created_at
    }));

    res.status(200).json({
      success: true,
      feedbacks: anonymousFeedbacks
    });
  });
});

// Get feedback for a specific faculty (anonymous view - NO student details)
router.get("/feedback/faculty/:faculty_id", verifyToken, isAdmin, (req, res) => {
  const facultyId = req.params.faculty_id;

  // Verify faculty exists
  Faculty.getById(facultyId, (err, faculty) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    // Get feedback for this faculty
    Feedback.getFeedbackByFaculty(facultyId, (err, feedbacks) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }

      // Transform data to ensure no student information is exposed
      const anonymousFeedbacks = feedbacks.map((fb) => ({
        id: fb.id,
        faculty_id: fb.faculty_id,
        rating: fb.rating,
        comments: fb.comments,
        created_at: fb.created_at
      }));

      res.status(200).json({
        success: true,
        faculty: {
          id: faculty.id,
          name: faculty.name,
          department: faculty.department,
          email: faculty.email
        },
        feedbacks: anonymousFeedbacks
      });
    });
  });
});

// Get feedback statistics for a faculty
router.get("/statistics/faculty/:faculty_id", verifyToken, isAdmin, (req, res) => {
  const facultyId = req.params.faculty_id;

  // Verify faculty exists
  Faculty.getById(facultyId, (err, faculty) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    // Get statistics
    Feedback.getStatistics(facultyId, (err, stats) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }

      // Convert average_rating safely (MySQL AVG returns string or null)
      let avgRating = 0;
      if (stats.average_rating !== null && stats.average_rating !== undefined) {
        avgRating = parseFloat(parseFloat(stats.average_rating).toFixed(2));
      }

      res.status(200).json({
        success: true,
        faculty: {
          id: faculty.id,
          name: faculty.name,
          department: faculty.department
        },
        statistics: {
          total_feedbacks: stats.total_feedbacks || 0,
          average_rating: avgRating,
          min_rating: stats.min_rating || 0,
          max_rating: stats.max_rating || 0
        }
      });
    });
  });
});

// Get all faculties (for admin management)
router.get("/faculties", verifyToken, isAdmin, (req, res) => {
  Faculty.getAll((err, faculties) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.status(200).json({
      success: true,
      faculties
    });
  });
});

// Create faculty
router.post("/faculties", verifyToken, isAdmin, (req, res) => {
  const { name, department, email } = req.body;

  // Validation
  if (!name || !department || !email) {
    return res.status(400).json({
      success: false,
      message: "Name, department, and email are required"
    });
  }

  Faculty.create({ name, department, email }, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error creating faculty" });
    }

    res.status(201).json({
      success: true,
      message: "Faculty created successfully",
      faculty_id: result.insertId
    });
  });
});

// Update faculty
router.put("/faculties/:id", verifyToken, isAdmin, (req, res) => {
  const { name, department, email } = req.body;
  const facultyId = req.params.id;

  // Validation
  if (!name || !department || !email) {
    return res.status(400).json({
      success: false,
      message: "Name, department, and email are required"
    });
  }

  Faculty.update(facultyId, { name, department, email }, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    res.status(200).json({
      success: true,
      message: "Faculty updated successfully"
    });
  });
});

// Delete faculty
router.delete("/faculties/:id", verifyToken, isAdmin, (req, res) => {
  const facultyId = req.params.id;

  Faculty.delete(facultyId, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    res.status(200).json({
      success: true,
      message: "Faculty deleted successfully"
    });
  });
});

module.exports = router;
