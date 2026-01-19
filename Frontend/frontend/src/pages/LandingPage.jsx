import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <h1>Feedback System</h1>
          <p className="tagline">Share Your Voice, Improve Our Institution</p>
        </div>
      </header>

      <main className="landing-main">
        <section className="intro-section">
          <h2>Welcome to our Anonymous Feedback System</h2>
          <p>
            This platform allows students to provide honest, constructive feedback
            about faculty and courses while maintaining complete anonymity to the
            reviewed faculty. Your feedback helps us continuously improve.
          </p>
        </section>

        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Anonymous Feedback</h3>
              <p>Faculty cannot see who submitted feedback - only administrators can verify submissions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>One Feedback Per Faculty</h3>
              <p>Each student can submit only one feedback per faculty per session to ensure quality</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Detailed Analytics</h3>
              <p>Administrators can view aggregated statistics and trends without identifying students</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Structured Feedback</h3>
              <p>Rate on a 5-point scale and provide detailed comments for constructive criticism</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Get Started</h2>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => navigate("/student-login")}>
              Student Portal
            </button>
            <button className="btn-secondary" onClick={() => navigate("/admin-login")}>
              Admin Portal
            </button>
          </div>
        </section>

        <section className="info-section">
          <h3>How It Works</h3>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Login</h4>
              <p>Use your institutional ID and email to create an account</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Select Faculty</h4>
              <p>Choose from the list of faculty members you want to provide feedback for</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Submit Feedback</h4>
              <p>Rate and provide comments anonymously</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h4>See Impact</h4>
              <p>Administrators use your feedback to improve teaching quality</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>&copy; 2024 Feedback System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;