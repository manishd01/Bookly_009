import { useState } from "react";
import AuthModal from "./AuthModal";
import Books from "./Books";
import { getUser, logout } from "../services/authService";
import "./Auth.css";
// import { getUser } from "../services/authService";
function Home() {
  const user_det = getUser();
  console.log("Current User:", user_det);
  // Lazy load user from localStorage
  const [user, setUser] = useState(() => getUser());
  const [authModalType, setAuthModalType] = useState(null); // 'login' | 'signup'

  // Called when login/signup succeeds
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setAuthModalType(null); // close modal
  };

  // Logout function
  const handleLogout = () => {
    logout(); // clears tokens & user
    setUser(null);
  };

  return (
    <div>
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "15px 20px",
          background: "#667eea",
        }}
      >
        <h5 style={{ color: "white", marginRight: "auto" }}>
          Hi {user_det?.user || user_det?.email || "User"} 👋
        </h5>

        {user ? (
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background: "#c53030",
              color: "white",
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => setAuthModalType("login")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: "#48bb78",
                color: "white",
                marginRight: "10px",
              }}
            >
              Login
            </button>
            <button
              onClick={() => setAuthModalType("signup")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                background: "#4299e1",
                color: "white",
              }}
            >
              Signup
            </button>
          </>
        )}
      </header>

      {/* Auth Modal */}
      {!user && authModalType && (
        <AuthModal
          type={authModalType}
          onClose={() => setAuthModalType(null)}
          onLogin={handleLogin}
        />
      )}

      {/* Welcome / Books */}
      <main style={{ padding: "20px" }}>
        {user ? (
          <Books />
        ) : (
          <div
            style={{
              textAlign: "center",
              marginTop: "100px",
              fontFamily: "Segoe UI, sans-serif",
              color: "#333",
            }}
          >
            <h1>Welcome to Bookly 📚</h1>
            <p>Please login or signup to view and manage books.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
