import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/StudentLogin.css";

function StudentLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    institutional_id: "",
    name: ""
  });

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!loginForm.email || !loginForm.password) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }

      const response = await axios.post("http://localhost:5000/api/auth/login", loginForm);

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Redirect to feedback dashboard
        navigate("/feedback");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!registerForm.email || !registerForm.password || !registerForm.institutional_id || !registerForm.name) {
        setError("All fields are required");
        setLoading(false);
        return;
      }

      if (registerForm.password !== registerForm.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (registerForm.password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      const response = await axios.post("http://localhost:5000/api/auth/register", {
        email: registerForm.email,
        password: registerForm.password,
        institutional_id: registerForm.institutional_id,
        name: registerForm.name,
        role: "student"
      });

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Redirect to feedback dashboard
        navigate("/feedback");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Feedback System</h1>
        <p className="subtitle">Student Portal</p>

        {error && <div className="error-message">{error}</div>}

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="your-email@college.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="toggle-form">
              Don't have an account?{" "}
              <button type="button" onClick={() => setIsLogin(false)} className="link-button">
                Register here
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <h2>Register</h2>
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="institutional_id">Institutional ID</label>
              <input
                id="institutional_id"
                type="text"
                placeholder="Your student/institutional ID"
                value={registerForm.institutional_id}
                onChange={(e) => setRegisterForm({ ...registerForm, institutional_id: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-email">Email Address</label>
              <input
                id="register-email"
                type="email"
                placeholder="your-email@college.com"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                placeholder="At least 6 characters"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Re-enter your password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="toggle-form">
              Already have an account?{" "}
              <button type="button" onClick={() => setIsLogin(true)} className="link-button">
                Login here
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default StudentLogin;
