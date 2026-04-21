import { Navigate, Outlet, useLocation } from "react-router-dom";

function isAuthenticated() {
  return Boolean(localStorage.getItem("authUser"));
}

export function RequireAuth() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function GuestOnly() {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
