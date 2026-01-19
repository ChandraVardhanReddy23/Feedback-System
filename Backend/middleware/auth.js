const authUtils = require("../utils/auth");

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "No token provided", success: false });
  }

  const decoded = authUtils.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token", success: false });
  }

  req.user = decoded;
  next();
};

// Middleware to check if user is a student
const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied. Students only.", success: false });
  }
  next();
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only.", success: false });
  }
  next();
};

module.exports = {
  verifyToken,
  isStudent,
  isAdmin
};
