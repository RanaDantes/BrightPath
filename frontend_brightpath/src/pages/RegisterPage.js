// src/pages/RegisterPage.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await API.post("/auth/register/", form);
      setSuccess(res.data.detail || "User registered successfully!");
      setForm({ username: "", email: "", password: "", password2: "" });

      // Optionally, redirect after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        JSON.stringify(err.response?.data) || "Network or server error."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sign Up</h2>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        <form onSubmit={submit} style={styles.form}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={onChange}
            required
            style={styles.input}
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            style={styles.input}
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
            style={styles.input}
          />
          <input
            name="password2"
            placeholder="Confirm Password"
            type="password"
            value={form.password2}
            onChange={onChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Signing up…" : "Sign Up"}
          </button>
        </form>
        <div style={styles.links}>
          <Link to="/login" style={styles.link}>
            Already have an account? Login
          </Link>
        </div>
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
    background: "#f0f2f5",
  },
  card: {
    width: 400,
    padding: 40,
    borderRadius: 12,
    boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
    background: "#fff",
    textAlign: "center",
  },
  title: { marginBottom: 20, fontSize: 28, fontWeight: 600, color: "#333" },
  form: { display: "flex", flexDirection: "column", gap: 15 },
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
  },
  links: { marginTop: 15 },
  link: { color: "#2575fc", textDecoration: "none", fontWeight: 500 },
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
