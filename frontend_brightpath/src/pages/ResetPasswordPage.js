// src/pages/ResetPasswordPage.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const uidb64 = queryParams.get("uidb64");
  const token = queryParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uidb64 || !token) {
      setError("Invalid reset link. Missing parameters.");
    }
  }, [uidb64, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/reset-password/", {
        uidb64,
        token,
        password,
      });

      setMessage(res.data.detail || "Password reset successful!");
      setTimeout(() => {
        navigate("/login"); // Redirect to login after success
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Failed to reset password. Link may be invalid or expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Password</h2>
        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}
        {!message && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              New Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={styles.input}
              />
            </label>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Resetting…" : "Reset Password"}
            </button>
          </form>
        )}
        <div style={styles.links}>
          <Link to="/login" style={styles.link}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

// Modern Login/ForgotPassword style
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    width: 400,
    padding: 40,
    borderRadius: 12,
    boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
    background: "#fff",
    textAlign: "center",
  },
  title: {
    marginBottom: 20,
    color: "#333",
    fontSize: 28,
    fontWeight: 600,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  label: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    fontSize: 14,
    color: "#555",
  },
  input: {
    padding: "10px 14px",
    fontSize: 15,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginTop: 6,
    transition: "all 0.2s",
  },
  button: {
    marginTop: 10,
    padding: "12px 16px",
    background: "#2575fc",
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.3s",
  },
  links: {
    marginTop: 15,
    display: "flex",
    justifyContent: "center",
  },
  link: {
    color: "#2575fc",
    textDecoration: "none",
    fontWeight: 500,
  },
  error: {
    background: "#ffdddd",
    color: "#b00020",
    padding: "10px",
    borderRadius: 6,
    marginBottom: 12,
  },
  success: {
    background: "#e6ffed",
    color: "#027a00",
    padding: "10px",
    borderRadius: 6,
    marginBottom: 12,
  },
};
