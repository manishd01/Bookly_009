import Login from "./Login";
import Signup from "./Signup";
import "./Auth.css";

function AuthModal({ type, setType, onClose, onLogin }) {
  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        {type === "login" && <Login onLogin={onLogin} />}

        {type === "signup" && (
          <Signup
            onSignupSuccess={() => setType("login")} // 👉 switch to login
          />
        )}
      </div>
    </div>
  );
}

export default AuthModal;
