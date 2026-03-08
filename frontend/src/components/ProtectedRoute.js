import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../services/auth";

function ProtectedRoute({ children }) {
  if (!getToken()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
