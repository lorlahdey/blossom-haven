import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ children, role }) => {
  const { isLoggedIn, user } = useAuthStore();

  // If the user is not logged in or does not have the required role, redirect to the home page
  if (!isLoggedIn || user?.role !== role ) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
