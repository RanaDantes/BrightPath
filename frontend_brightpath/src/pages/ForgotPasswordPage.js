// src/pages/ForgotPasswordPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      await axios.post("http://localhost:8000/api/auth/forgot-password/", {
        email,
      });
      setSuccess(true);
      setMessage("Check your email for the reset link.");

      setTimeout(() => {
        navigate("/login");
      }, 5000); // redirect after 5 seconds
    } catch (err) {
      setSuccess(false);
      setMessage(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>
        {message && (
          <div style={success ? styles.success : styles.error}>{message}</div>
        )}
        {!success && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Sending…" : "Reset Password"}
            </button>
          </form>
        )}
        {success && (
          <button onClick={() => navigate("/login")} style={styles.button}>
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
}

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
  input: {
    padding: "10px 14px",
    fontSize: 15,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  button: {
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
  error: {
    background: "#ffdddd",
    color: "#b00020",
    padding: "10px",
    borderRadius: 6,
    marginBottom: 12,
  },
  success: {
    background: "#ddffdd",
    color: "#007700",
    padding: "10px",
    borderRadius: 6,
    marginBottom: 12,
  },
};
