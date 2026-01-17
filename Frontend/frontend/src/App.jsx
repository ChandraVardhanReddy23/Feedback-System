import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import FeedbackForm from "./components/feedbackForm.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  return (
    <div>
      <FeedbackForm />
      <hr />
      <AdminDashboard />
    </div>
  );
}




export default App
