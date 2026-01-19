import { useNavigate } from "react-router-dom";

function StudentLogin() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Student Login</h2>
      <p>No login required for students</p>

      <button onClick={() => navigate("/feedback")}>
        Proceed to Feedback
      </button>
    </div>
  );
}

export default StudentLogin;
