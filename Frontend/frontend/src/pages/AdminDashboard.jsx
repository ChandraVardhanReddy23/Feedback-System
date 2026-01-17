import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/feedback")
      .then((res) => setFeedback(res.data));
  }, []);

  return (
    <div>
      <h2>Admin Feedback Dashboard</h2>

      {feedback.map((f, index) => (
        <div key={index}>
          <strong>{f.name}</strong> – {f.rating}/5
          <p>{f.comments}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
