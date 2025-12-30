import { useEffect, useState } from "react";
import { login, getCurrentUser } from "../services/authService";
import "./Auth.css";

function Login({ onLogin }) {
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
      // 1️⃣ Login (sets cookie/session)
      await login(formData);

      // 2️⃣ Fetch currently authenticated user
      const currentUser = await getCurrentUser();
      console.log("Logged-in user:", currentUser);

      // 3️⃣ Store user in parent/global state
      onLogin(currentUser);

      setMessage("Login successful 🎉");
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.message || "Login failed ❌");
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
