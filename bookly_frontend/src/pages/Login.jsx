import { useEffect, useState } from "react";
import { login, getCurrentUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Login (cookie/session set)
      const loginResponse = await login(formData);
      console.log("Login response:", loginResponse);
      // 2️⃣ Fetch logged-in user
      const currentUser = await getCurrentUser();
      console.log("Logged-in user:", currentUser);

      // 3️⃣ Store in global auth state
      setAuth({
        loading: false,
        authenticated: true,
        user: currentUser.user,
      });

      // 4️⃣ Redirect based on role ✅
      const role = currentUser.user.role;

      if (role === "Buyer") {
        navigate("/buyer");
      } else if (role === "Seller") {
        navigate("/seller");
      }

      // 5️⃣ Close modal
      if (onLogin) onLogin();

      setMessage("Login successful 🎉");
    } catch (err) {
      // Axios error object has `response.data.detail` for HTTPException
      const backendMessage = err.response?.data?.detail || "Login failed ❌";
      setMessage(backendMessage + " ❌");
      console.error("Login error:", backendMessage);
    }
  };

  return (
    <>
      <div className="login-container">
        <h2 className="auth-title">Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>

        {message && <p className="auth-message">{message}</p>}
      </div>
    </>
  );
}

export default Login;
