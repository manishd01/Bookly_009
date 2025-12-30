import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRedirect() {
  const { auth } = useAuth();

  if (auth.loading) return null;

  if (!auth.authenticated) {
    return <Navigate to="/" replace />;
  }

  return auth.user.role === "seller" ? (
    <Navigate to="/seller" replace />
  ) : (
    <Navigate to="/buyer" replace />
  );
}
