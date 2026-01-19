import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div >
      <h1>Feedback System</h1>
      <p>Please choose how you want to continue</p>

      <div >
        <button
          
          onClick={() => navigate("/student-login")}
        >
          Student Login
        </button>

        <button
          
          onClick={() => navigate("/admin")}
        >
          Admin Login
        </button>
      </div>
    </div>
  );
}
export default LandingPage;