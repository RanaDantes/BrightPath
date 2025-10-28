// src/pages/LoginPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hover, setHover] = useState(false);

  // Clear old session data on mount
  useEffect(() => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");

    const checkLoggedIn = async () => {
      const access = localStorage.getItem("access");
      if (!access) return;

      try {
        const profileRes = await API.get("/auth/profile/", {
          headers: { Authorization: `Bearer ${access}` },
        });
        const role = profileRes.data.role?.toLowerCase();
        const username = profileRes.data.username;

        localStorage.setItem("userRole", role);
        localStorage.setItem("username", username);

        if (role === "instructor") navigate("/dashboard", { replace: true });
        else if (role === "admin" || role === "manager")
          navigate("/admin-dashboard", { replace: true });
      } catch {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
    };

    checkLoggedIn();
  }, [navigate]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await API.post("auth/token/", {
        username: form.username,
        password: form.password,
      });

      const { access, refresh } = res.data;
      if (!access || !refresh) {
        setError("Invalid server response: tokens missing.");
        setLoading(false);
        return;
      }

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      const profileRes = await API.get("/auth/profile/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      const role = profileRes.data.role?.toLowerCase();
      const username = profileRes.data.username;

      localStorage.setItem("role", role);
      localStorage.setItem("username", username);

      if (role === "instructor") navigate("/dashboard", { replace: true });
      else if (role === "admin" || role === "manager")
        navigate("/admin-dashboard", { replace: true });
      else setError("Unknown user role: " + profileRes.data.role);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.join(" ") ||
          "Network or server error."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={submit} style={styles.form}>
          <label style={styles.label}>
            Username
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              required
              style={styles.input}
              autoComplete="username"
            />
          </label>
          <label style={styles.label}>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
              style={styles.input}
              autoComplete="current-password"
            />
          </label>
          <button
            type="submit"
            style={{
              ...styles.button,
              background: hover ? "#6a11cb" : "#2575fc",
            }}
            disabled={loading}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <div style={styles.links}>
          <Link to="/register" style={styles.link}>
            Sign Up
          </Link>
          <Link to="/forgot-password" style={styles.link}>
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}

// Modern styles
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
  links: {
    marginTop: 15,
    display: "flex",
    justifyContent: "space-between",
  },
  link: {
    color: "#2575fc",
    textDecoration: "none",
    fontWeight: 500,
  },
};
