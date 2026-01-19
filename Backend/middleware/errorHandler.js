// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Validation errors
  if (err.status === 400) {
    return res.status(400).json({
      success: false,
      message: err.message || "Bad Request"
    });
  }

  // Authentication errors
  if (err.status === 401) {
    return res.status(401).json({
      success: false,
      message: err.message || "Unauthorized"
    });
  }

  // Authorization errors
  if (err.status === 403) {
    return res.status(403).json({
      success: false,
      message: err.message || "Forbidden"
    });
  }

  // Not found errors
  if (err.status === 404) {
    return res.status(404).json({
      success: false,
      message: err.message || "Not Found"
    });
  }

  // Conflict errors (duplicate feedback)
  if (err.status === 409) {
    return res.status(409).json({
      success: false,
      message: err.message || "Conflict"
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
};

module.exports = errorHandler;
