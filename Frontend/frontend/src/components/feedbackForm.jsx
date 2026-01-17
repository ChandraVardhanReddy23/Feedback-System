import { useState } from "react";
import axios from "axios";

function FeedbackForm() {
  const [form, setForm] = useState({
    lecturer_id: "",
    rating: "",
    comments: ""
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/feedback", form);
    alert("Feedback Submitted Successfully");
  };

  return (
    <form onSubmit={submitHandler}>
      <h3>Student Feedback</h3>

      <input
        type="number"
        placeholder="Lecturer ID"
        onChange={(e) =>
          setForm({ ...form, lecturer_id: e.target.value })
        }
        required
      />

      <input
        type="number"
        placeholder="Rating (1–5)"
        min="1"
        max="5"
        onChange={(e) =>
          setForm({ ...form, rating: e.target.value })
        }
        required
      />

      <textarea
        placeholder="Comments"
        onChange={(e) =>
          setForm({ ...form, comments: e.target.value })
        }
      />

      <button type="submit">Submit</button>
    </form>
  );
}

export default FeedbackForm;
