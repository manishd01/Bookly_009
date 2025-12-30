import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { auth, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header style={styles.header}>
      <h3>📚 Bookly</h3>

      <div>
        {auth.authenticated ? (
          <>
            <span style={{ marginRight: "12px" }}>
              Hello {auth.user?.email} ({auth.user?.role})
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <span>Hello Guest 👋</span>
        )}
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 20px",
    borderBottom: "1px solid #ddd",
  },
};
