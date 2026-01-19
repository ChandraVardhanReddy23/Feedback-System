const express = require("express");
const Feedback = require("../models/Feedback");
const Faculty = require("../models/Faculty");
const FeedbackStatus = require("../models/FeedbackStatus");
const { verifyToken, isStudent } = require("../middleware/auth");

const router = express.Router();

// Get all faculties (for student to select from)
router.get("/faculties", verifyToken, isStudent, (req, res) => {
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

// Get feedback status for all faculties (student's submission status)
router.get("/status", verifyToken, isStudent, (req, res) => {
  FeedbackStatus.getStatusForAllFaculties(req.user.id, (err, status) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.status(200).json({
      success: true,
      status
    });
  });
});

// Get student's submitted feedbacks (what they have submitted)
router.get("/my-feedbacks", verifyToken, isStudent, (req, res) => {
  Feedback.getUserSubmissions(req.user.id, (err, feedbacks) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.status(200).json({
      success: true,
      feedbacks: feedbacks || []
    });
  });
});

// Submit feedback (one per student per faculty)
router.post("/submit", verifyToken, isStudent, (req, res) => {
  const { faculty_id, rating, comments } = req.body;

  // Validation
  if (!faculty_id || !rating) {
    return res.status(400).json({
      success: false,
      message: "Faculty ID and rating are required"
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 1 and 5"
    });
  }

  if (comments && comments.length > 1000) {
    return res.status(400).json({
      success: false,
      message: "Comments cannot exceed 1000 characters"
    });
  }

  // Check if faculty exists
  Faculty.getById(faculty_id, (err, faculty) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    // Check for duplicate feedback
    Feedback.checkDuplicate(req.user.id, faculty_id, (err, hasFeedback) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (hasFeedback) {
        return res.status(409).json({
          success: false,
          message: "You have already submitted feedback for this faculty"
        });
      }

      // Create feedback
      Feedback.create(
        {
          user_id: req.user.id,
          faculty_id,
          rating,
          comments: comments || ""
        },
        (err, result) => {
          if (err) {
            return res.status(500).json({ success: false, message: "Error submitting feedback" });
          }

          res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            feedback_id: result.insertId
          });
        }
      );
    });
  });
});

// Update feedback (only by the student who submitted it)
router.put("/update/:id", verifyToken, isStudent, (req, res) => {
  const { rating, comments } = req.body;
  const feedbackId = req.params.id;

  // Validation
  if (!rating) {
    return res.status(400).json({
      success: false,
      message: "Rating is required"
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 1 and 5"
    });
  }

  // Update feedback
  Feedback.update(feedbackId, req.user.id, { rating, comments: comments || "" }, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    res.status(200).json({
      success: true,
      message: "Feedback updated successfully"
    });
  });
});

// Delete feedback (only by the student who submitted it)
router.delete("/delete/:id", verifyToken, isStudent, (req, res) => {
  const feedbackId = req.params.id;

  // Delete feedback
  Feedback.delete(feedbackId, req.user.id, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully"
    });
  });
});

module.exports = router;
