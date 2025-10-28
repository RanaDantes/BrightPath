// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [feeds, setFeeds] = useState([]);
  const [loadingFeeds, setLoadingFeeds] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await API.get("/auth/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    if (user && user.role === "INSTRUCTOR") {
      fetchFeeds();
    }
  }, [user]);

  const fetchFeeds = async () => {
    setLoadingFeeds(true);
    try {
      const res = await API.get("/timeline_feed/items/");
      setFeeds(res.data);
    } catch (err) {
      console.error("Failed to load feeds:", err);
    } finally {
      setLoadingFeeds(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1>Instructor Dashboard</h1>
        <button onClick={logout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <p>
        Welcome, <b>{user.username}</b>! Your role is <b>{user.role}</b>.
      </p>

      {user.role === "INSTRUCTOR" && (
        <div style={styles.feedSection}>
          <div style={styles.feedHeader}>
            <h2>📢 School Feed</h2>
            <button onClick={fetchFeeds} style={styles.refreshBtn}>
              Refresh
            </button>
          </div>

          {loadingFeeds ? (
            <p>Loading feeds...</p>
          ) : feeds.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            <div style={styles.feedList}>
              {feeds.map((feed) => (
                <div key={feed.id} style={styles.feedCard}>
                  <h3 style={{ marginBottom: 4 }}>{feed.title}</h3>
                  <p style={{ margin: "4px 0" }}>{feed.content}</p>
                  <small style={{ color: "#555" }}>
                    Posted by: {feed.author_username || "Unknown"} on{" "}
                    {new Date(feed.created_at).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: 20,
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoutBtn: {
    padding: "6px 12px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  feedSection: {
    marginTop: 20,
  },
  feedHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  refreshBtn: {
    padding: "6px 12px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  feedList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  feedCard: {
    background: "#fff",
    padding: 12,
    borderRadius: 8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
};
