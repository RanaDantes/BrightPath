// src/hooks/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const access = localStorage.getItem("access");
  const role = localStorage.getItem("role"); // store user role on login

  if (!access) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role?.toLowerCase())) {
    // role not allowed
    return <Navigate to="/login" replace />;
  }

  return children;
}
