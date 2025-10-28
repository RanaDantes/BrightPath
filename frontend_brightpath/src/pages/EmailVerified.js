// src/pages/EmailVerified.js
import React from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function EmailVerified() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const error = searchParams.get("error");

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      {success ? (
        <>
          <h2>Email Verified Successfully!</h2>
          <p>You can now log in.</p>
        </>
      ) : (
        <>
          <h2>Verification Failed</h2>
          <p>
            {error === "invalid" && "Invalid verification link."}
            {error === "expired" && "Your verification link has expired."}
            {error === "missing" && "Missing verification data."}
            {!["invalid", "expired", "missing"].includes(error) &&
              "Unknown error."}
          </p>
        </>
      )}
      <Link to="/login">
        <button style={{ padding: "10px 20px", marginTop: 20 }}>
          Go to Login
        </button>
      </Link>
    </div>
  );
}
