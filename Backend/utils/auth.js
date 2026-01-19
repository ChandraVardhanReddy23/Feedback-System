/**
 * ⚠️  SECURITY WARNING ⚠️
 * 
 * THIS AUTHENTICATION SYSTEM USES PLAIN TEXT PASSWORDS!
 * THIS IS EXTREMELY INSECURE AND FOR DEMO/TESTING ONLY!
 * NEVER USE IN PRODUCTION!
 * 
 * Passwords are stored in plain text in the database.
 * Anyone with database access can read all passwords.
 * This violates security best practices and data protection regulations.
 * 
 * TO REVERT TO SECURE AUTHENTICATION:
 * 1. Uncomment bcryptjs code below
 * 2. Run: npm install bcryptjs
 * 3. Restore hashPassword() and comparePassword() implementations
 * 
 * DO NOT USE IN PRODUCTION - FOR DEMO PURPOSES ONLY
 */

const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs"); // DISABLED FOR DEMO - INSECURE!

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
// const SALT_ROUNDS = 10; // DISABLED FOR DEMO - INSECURE!

const auth = {
  // ⚠️  INSECURE: Stores password as plain text (FOR DEMO ONLY)
  // TODO: Re-enable bcryptjs for production
  hashPassword: async (password) => {
    // WARNING: Password is NOT being hashed! Returning plain text for demo.
    console.warn(
      "[SECURITY WARNING] Password hashing is DISABLED! Using plain text for DEMO only!"
    );
    return password; // INSECURE: Plain text password
  },

  // ⚠️  INSECURE: Direct password comparison without hashing (FOR DEMO ONLY)
  // TODO: Re-enable bcryptjs for production
  comparePassword: async (password, storedPassword) => {
    // WARNING: Direct plain text comparison! Not secure!
    console.warn(
      "[SECURITY WARNING] Password comparison is using plain text! FOR DEMO ONLY!"
    );
    return password === storedPassword; // INSECURE: Plain text comparison
  },

  // Generate JWT token
  generateToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        institutional_id: user.institutional_id
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
  },

  // Verify JWT token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  },

  // Decode token (without verification)
  decodeToken: (token) => {
    return jwt.decode(token);
  }
};

module.exports = auth;
