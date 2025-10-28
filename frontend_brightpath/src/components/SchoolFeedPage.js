import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function SchoolFeedPage() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      const token = localStorage.getItem("access");
      try {
        const res = await API.get("/school-feed/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeed(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading) return <p>Loading feed...</p>;

  return (
    <div style={styles.page}>
      <div style={styles.cardContainer}>
        <h2 style={styles.title}>School Feed</h2>
        {feed.length === 0 && <p>No feed items yet.</p>}
        {feed.map((item) => (
          <div key={item.id} style={styles.card}>
            <h4 style={styles.cardTitle}>{item.title}</h4>
            <p style={styles.cardContent}>{item.content}</p>
            <small style={styles.cardFooter}>
              By {item.created_by_username} |{" "}
              {new Date(item.created_at).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  cardContainer: {
    width: "600px",
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    marginBottom: 20,
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    marginBottom: 8,
  },
  cardFooter: {
    fontSize: 12,
    color: "#555",
  },
};
