import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/FeedbackForm.css";

function FeedbackForm() {
  const [faculties, setFaculties] = useState([]);
  const [feedbackStatus, setFeedbackStatus] = useState({});
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  // Fetch faculties and feedback status on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch faculties
      const facultiesRes = await axios.get("http://localhost:5000/api/feedback/faculties", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFaculties(facultiesRes.data.faculties || []);

      // Fetch feedback status
      const statusRes = await axios.get("http://localhost:5000/api/feedback/status", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Create a map for quick lookup
      const statusMap = {};
      statusRes.data.status.forEach((item) => {
        statusMap[item.id] = item.has_feedback;
      });
      setFeedbackStatus(statusMap);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load faculties. Please refresh.");
    } finally {
      setInitialLoading(false);
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!selectedFaculty) {
        setError("Please select a faculty");
        setLoading(false);
        return;
      }

      if (feedbackStatus[selectedFaculty]) {
        setError("You have already submitted feedback for this faculty. One submission per faculty per student.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/feedback/submit",
        {
          faculty_id: parseInt(selectedFaculty),
          rating: parseInt(rating),
          comments
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setSuccess("Feedback submitted successfully!");
        setSelectedFaculty("");
        setRating(5);
        setComments("");
        
        // Update status
        setFeedbackStatus({
          ...feedbackStatus,
          [selectedFaculty]: true
        });

        // Refresh data after 2 seconds
        setTimeout(fetchData, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const getAvailableFaculties = () => {
    return faculties.filter((fac) => !feedbackStatus[fac.id]);
  };

  const getSubmittedFaculties = () => {
    return faculties.filter((fac) => feedbackStatus[fac.id]);
  };

  return (
    <div className="feedback-container">
      <div className="feedback-card">
        <h2>Submit Feedback</h2>
        <p className="subtitle">Help us improve by sharing your feedback</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {initialLoading ? (
          <div className="loading-state">
            <p>Loading faculties...</p>
          </div>
        ) : (
          <form onSubmit={submitFeedback}>
            <div className="form-group">
              <label htmlFor="faculty">Select Faculty / Subject *</label>
              <select
                id="faculty"
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">-- Choose a faculty --</option>
                {getAvailableFaculties().length > 0 && (
                  <optgroup label="Available">
                    {getAvailableFaculties().map((fac) => (
                      <option key={fac.id} value={fac.id}>
                        {fac.name} ({fac.department})
                      </option>
                    ))}
                  </optgroup>
                )}
                {getSubmittedFaculties().length > 0 && (
                  <optgroup label="Already Submitted" disabled>
                    {getSubmittedFaculties().map((fac) => (
                      <option key={fac.id} value={fac.id} disabled>
                        {fac.name} ({fac.department})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              {getAvailableFaculties().length === 0 && faculties.length > 0 && (
                <p className="info-text">You have submitted feedback for all faculties</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating *</label>
              <div className="rating-input">
                <input
                  id="rating"
                  type="range"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  disabled={loading || !selectedFaculty}
                />
                <span className="rating-value">{rating} / 5</span>
              </div>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= rating ? "filled" : ""}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="comments">Comments (Optional)</label>
              <textarea
                id="comments"
                placeholder="Share your thoughts, suggestions, or concerns..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                maxLength={1000}
                disabled={loading || !selectedFaculty}
                rows={5}
              />
              <p className="char-count">{comments.length} / 1000 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedFaculty || feedbackStatus[selectedFaculty]}
              className="btn-submit"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        )}

        {getSubmittedFaculties().length > 0 && (
          <div className="submitted-section">
            <h3>Feedback Submitted For:</h3>
            <ul className="submitted-list">
              {getSubmittedFaculties().map((fac) => (
                <li key={fac.id}>
                  <span className="check-mark">✓</span>
                  {fac.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackForm;
