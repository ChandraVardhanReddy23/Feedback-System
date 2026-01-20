import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("all");
  const [topFaculties, setTopFaculties] = useState([]);
  const [bottomFaculties, setBottomFaculties] = useState([]);
  const [ratingDistribution, setRatingDistribution] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user.role !== "admin") navigate("/");
    else {
      fetchFaculties();
      fetchAnalytics();
    }
  }, []);

  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/admin/faculties", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setFaculties(response.data.faculties);
    } catch (err) {
      setError("Failed to load faculties");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllFeedback = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("http://localhost:5000/api/admin/feedback", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setFeedbacks(response.data.feedbacks);
        setView("all");
        setSelectedFaculty(null);
      }
    } catch (err) {
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const fetchFacultyDetail = async (facultyId) => {
    try {
      setLoading(true);
      setError("");
      const feedbackRes = await axios.get(`http://localhost:5000/api/admin/feedback/faculty/${facultyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const statsRes = await axios.get(`http://localhost:5000/api/admin/statistics/faculty/${facultyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (feedbackRes.data.success && statsRes.data.success) {
        setSelectedFaculty(feedbackRes.data.faculty);
        setFeedbacks(feedbackRes.data.feedbacks);
        setStatistics(statsRes.data.statistics);
        setView("detail");
      }
    } catch (err) {
      setError("Failed to load faculty details");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const topBottomRes = await axios.get("http://localhost:5000/api/admin/analytics/top-bottom-faculty", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ratingDistRes = await axios.get("http://localhost:5000/api/admin/analytics/rating-distribution", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (topBottomRes.data.success) {
        setTopFaculties(topBottomRes.data.top_faculties);
        setBottomFaculties(topBottomRes.data.bottom_faculties);
      }
      if (ratingDistRes.data.success) {
        setRatingDistribution(ratingDistRes.data.distribution);
      }
    } catch (err) {
      console.error("Failed to load analytics", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin-login");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "rating-excellent";
    if (rating >= 3) return "rating-good";
    if (rating >= 2) return "rating-average";
    return "rating-poor";
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="user-info">
            <span className="user-name">{user.name || user.email}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <aside className="sidebar">
          <nav className="nav-menu">
            <button className={`nav-item ${view === "all" ? "active" : ""}`} onClick={fetchAllFeedback}>
              All Feedback
            </button>
            <div className="nav-divider">Faculties</div>
            <div className="faculties-list">
              {faculties.map((fac) => (
                <button
                  key={fac.id}
                  className={`nav-item faculty-item ${selectedFaculty?.id === fac.id ? "active" : ""}`}
                  onClick={() => fetchFacultyDetail(fac.id)}
                >
                  {fac.name}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        <main className="content">
          {error && <div className="alert alert-error">{error}</div>}
          {loading && <div className="loading">Loading...</div>}

          {view === "all" && !loading && (
            <>
              {/* Analytics Sections */}
              <section className="analytics-section">
                <h2>Faculty Performance Analytics</h2>

                {/* Top Faculty */}
                <div className="analytics-grid">
                  <div className="analytics-card">
                    <h3>🏆 Top Performing Faculty</h3>
                    {topFaculties.length === 0 ? (
                      <p>No data available</p>
                    ) : (
                      <div className="faculty-list">
                        {topFaculties.map((faculty, index) => (
                          <div key={faculty.faculty_id} className="faculty-item-analytics">
                            <span className="rank">#{index + 1}</span>
                            <div className="faculty-details">
                              <strong>{faculty.faculty_name}</strong>
                              <p>{faculty.department}</p>
                            </div>
                            <div className="faculty-stats">
                              <span className="avg-rating">{faculty.average_rating} ★</span>
                              <span className="feedback-count">({faculty.total_feedbacks} feedbacks)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Faculty */}
                  <div className="analytics-card">
                    <h3>⚠️ Faculty Needing Attention</h3>
                    {bottomFaculties.length === 0 ? (
                      <p>No data available</p>
                    ) : (
                      <div className="faculty-list">
                        {bottomFaculties.map((faculty, index) => (
                          <div key={faculty.faculty_id} className="faculty-item-analytics">
                            <span className="rank">#{index + 1}</span>
                            <div className="faculty-details">
                              <strong>{faculty.faculty_name}</strong>
                              <p>{faculty.department}</p>
                            </div>
                            <div className="faculty-stats">
                              <span className="avg-rating">{faculty.average_rating} ★</span>
                              <span className="feedback-count">({faculty.total_feedbacks} feedbacks)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Rating Distribution Chart */}
                <div className="analytics-card chart-card">
                  <h3>Rating Distribution</h3>
                  {ratingDistribution ? (
                    <div className="rating-chart">
                      {Object.entries(ratingDistribution).map(([rating, count]) => (
                        <div key={rating} className="chart-bar-container">
                          <span className="chart-label">{rating} ★</span>
                          <div className="chart-bar-wrapper">
                            <div
                              className="chart-bar"
                              style={{
                                width: `${Math.max((count / Math.max(...Object.values(ratingDistribution))) * 100, 5)}%`
                              }}
                            >
                              <span className="chart-value">{count}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Loading chart...</p>
                  )}
                </div>
              </section>

              <section className="feedback-section">
                <h2>All Feedback</h2>
                <p className="section-subtitle">Anonymous feedback from all students</p>
                {feedbacks.length === 0 ? (
                  <div className="no-data"><p>No feedback received yet.</p></div>
                ) : (
                  <div className="feedback-grid">
                    {feedbacks.map((feedback) => (
                      <div key={feedback.id} className="feedback-card">
                        <div className="feedback-header">
                          <div className="faculty-info">
                            <h3>{feedback.faculty_name}</h3>
                            <p>{feedback.department}</p>
                          </div>
                          <div className={`rating-badge ${getRatingColor(feedback.rating)}`}>
                            {feedback.rating}<span className="stars">★</span>
                          </div>
                        </div>
                        <div className="feedback-body">
                          {feedback.comments && <p className="comments">{feedback.comments}</p>}
                          <p className="timestamp">{formatDate(feedback.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {view === "detail" && selectedFaculty && !loading && (
            <section className="faculty-detail">
              <button className="btn-back" onClick={() => setView("all")}>← Back to All Feedback</button>
              <div className="faculty-header">
                <h2>{selectedFaculty.name}</h2>
                <p className="faculty-meta">{selectedFaculty.department} • {selectedFaculty.email}</p>
              </div>
              {statistics && (
                <div className="statistics-grid">
                  <div className="stat-card">
                    <label>Total Feedback</label>
                    <p className="stat-value">{statistics.total_feedbacks}</p>
                  </div>
                  <div className="stat-card">
                    <label>Average Rating</label>
                    <p className="stat-value">{statistics.average_rating.toFixed(2)}</p>
                  </div>
                  <div className="stat-card">
                    <label>Highest Rating</label>
                    <p className="stat-value">{statistics.max_rating}</p>
                  </div>
                  <div className="stat-card">
                    <label>Lowest Rating</label>
                    <p className="stat-value">{statistics.min_rating}</p>
                  </div>
                </div>
              )}
              <div className="feedbacks-section">
                <h3>Student Feedback (Anonymous)</h3>
                {feedbacks.length === 0 ? (
                  <div className="no-data"><p>No feedback for this faculty yet.</p></div>
                ) : (
                  <div className="feedback-list">
                    {feedbacks.map((feedback) => (
                      <div key={feedback.id} className="feedback-item">
                        <div className="feedback-item-header">
                          <div className={`rating-badge-small ${getRatingColor(feedback.rating)}`}>
                            {feedback.rating} ★
                          </div>
                          <span className="timestamp">{formatDate(feedback.created_at)}</span>
                        </div>
                        {feedback.comments && <p className="feedback-comments">{feedback.comments}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
