import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleGuard({ allow, children }) {
  const { auth } = useAuth();

  if (auth.loading) {
    console.debug("Auth is loading...");
    return null;
  }

  if (!auth.authenticated) {
    console.warn("User not authenticated. Redirecting to home.");
    return <Navigate to="/" replace />;
  }

  console.debug("Allowed roles:", allow);
  console.debug("User role:", auth.user?.role);
  console.log("User info:", auth);
  if (!allow.includes(auth.user?.role)) {
    console.warn(
      `User role '${auth.user?.role}' not allowed. Redirecting to home.`
    );
    return <Navigate to="/" replace />;
  }

  return children;
}
