import { useState } from 'react'
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";

import StudentLogin from "./pages/StudentLogin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import FeedbackForm from "./components/feedbackForm.jsx";
import LandingPage from './pages/LandingPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;




