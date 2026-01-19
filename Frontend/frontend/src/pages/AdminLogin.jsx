import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        form
      );

      if (res.data.success) {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      alert("Invalid username or password");
    }
  };

  return (
    <form onSubmit={loginHandler}>
      <h2>Admin Login</h2>

      <input
        placeholder="Username"
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
        required
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
        required
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default AdminLogin;
