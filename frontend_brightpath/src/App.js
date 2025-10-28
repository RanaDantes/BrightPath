import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EmailVerified from "./pages/EmailVerified";
import ProtectedRoute from "./hooks/ProtectedRoute";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />{" "}
        {/* <-- register route */}
        <Route path="/email-verified" element={<EmailVerified />} />{" "}
        {/* <-- email verified route */}
        {/* Writer dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["instructor"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Admin/Manager dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* Fallback route */}
        <Route path="*" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
