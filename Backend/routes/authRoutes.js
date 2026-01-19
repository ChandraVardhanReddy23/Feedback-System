/**
 * ⚠️  SECURITY WARNING ⚠️
 * 
 * THIS AUTHENTICATION SYSTEM USES PLAIN TEXT PASSWORDS!
 * THIS IS EXTREMELY INSECURE AND FOR DEMO/TESTING ONLY!
 * NEVER USE IN PRODUCTION!
 * 
 * Passwords are NOT hashed and stored in plain text in the database.
 * This is a security vulnerability and violates data protection regulations.
 * 
 * FOR PRODUCTION: Enable bcryptjs password hashing immediately!
 */

const express = require("express");
const authUtils = require("../utils/auth");
const User = require("../models/User");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Register endpoint
router.post("/register", (req, res) => {
  const { email, password, institutional_id, name, role } = req.body;

  // Validation
  if (!email || !password || !institutional_id || !name) {
    return res.status(400).json({
      success: false,
      message: "All fields are required (email, password, institutional_id, name)"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long"
    });
  }

  // Check if user already exists
  User.exists(email, institutional_id, async (err, exists) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Email or Institutional ID already registered"
      });
    }

    try {
      // ⚠️  INSECURE: Password NOT being hashed! FOR DEMO ONLY!
      const hashedPassword = await authUtils.hashPassword(password);
      console.warn("[SECURITY] User registering with plain text password (DEMO ONLY)");

      // Create user
      User.create(
        {
          email,
          password: hashedPassword, // ⚠️  WARNING: Plain text password stored!
          institutional_id,
          name,
          role: role || "student"
        },
        (err, result) => {
          if (err) {
            return res.status(500).json({ success: false, message: "Error registering user" });
          }

          // Generate token
          User.findByEmail(email, (err, user) => {
            if (err) {
              return res.status(500).json({ success: false, message: "Error retrieving user" });
            }

            const token = authUtils.generateToken(user);

            res.status(201).json({
              success: true,
              message: "User registered successfully",
              token,
              user: {
                id: user.id,
                email: user.email,
                institutional_id: user.institutional_id,
                name: user.name,
                role: user.role
              }
            });
          });
        }
      );
    } catch (error) {
      res.status(500).json({ success: false, message: "Error hashing password" });
    }
  });
});

// Login endpoint
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  // Find user by email
  User.findByEmail(email, async (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    try {
      // ⚠️  INSECURE: Plain text password comparison! FOR DEMO ONLY!
      const isPasswordValid = await authUtils.comparePassword(password, user.password);
      console.warn("[SECURITY] User login using plain text password comparison (DEMO ONLY)");

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password"
        });
      }

      // Generate token
      const token = authUtils.generateToken(user);

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          institutional_id: user.institutional_id,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error comparing passwords" });
    }
  });
});

// Get current user profile
router.get("/profile", verifyToken, (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        institutional_id: user.institutional_id,
        name: user.name,
        role: user.role
      }
    });
  });
});

module.exports = router;
