import React, { useEffect, useState } from "react";
import API, { clearTokens } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const access = localStorage.getItem("access");
        if (!access) {
          setError("No access token found. Please login.");
          setLoading(false);
          return;
        }

        // Fetch admin dashboard data
        const res = await API.get("auth/admin/data/", {
          headers: { Authorization: `Bearer ${access}` },
        });
        setData(res.data);

        // Fetch logged-in user profile
        const profileRes = await API.get("auth/profile/", {
          headers: { Authorization: `Bearer ${access}` },
        });
        setUser(profileRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch admin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    clearTokens();
    navigate("/login");
  };

  if (loading) return <p>Loading admin data…</p>;
  if (error) return <p>{error}</p>;

  const keys = data ? Object.keys(data) : [];

  return (
    <div style={{ padding: 20 }}>
      {user && (
        <div style={{ marginBottom: 20 }}>
          <h1>
            Welcome, <strong>{user.username}</strong>!
          </h1>
          <p>
            Role: <strong>{user.role}</strong>
          </p>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 12px",
              background: "#d9534f",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}

      <h2>Dashboard Data</h2>
      {!data || keys.length === 0 ? (
        <p>No data available</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {keys.map((key) => (
                <th
                  key={key}
                  style={{
                    border: "1px solid #ddd",
                    padding: 8,
                    textAlign: "left",
                  }}
                >
                  {key.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {keys.map((key) => (
                <td key={key} style={{ border: "1px solid #ddd", padding: 8 }}>
                  {data[key]}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
