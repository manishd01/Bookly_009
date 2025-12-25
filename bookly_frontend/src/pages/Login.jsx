import { useState } from "react";
import { login } from "../services/authService";
import "./Auth.css";

function Login({ onLogin }) {
  // const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("login clicked");

    // setLoading(true);
    setMessage("");

    try {
      const res = await login(formData);

      localStorage.setItem("accessToken", res.data.access_token);
      localStorage.setItem("refreshToken", res.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Login successful 🎉");

      if (onLogin) onLogin(res.data.user);

      // optional redirect
      // window.location.href = "/";
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed ❌");
    } finally {
      // setLoading(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   console.log("inside login");
  //   e.preventDefault();
  //   console.log("inside login");

  //   try {
  //     const res = await login(formData);
  //     console.log(res, "login response", res);
  //     // Store tokens in localStorage
  //     localStorage.setItem("accessToken", res.data.access_token);
  //     localStorage.setItem("refreshToken", res.data.refresh_token);

  //     setMessage(res.data.message || "Login successful 🎉");

  //     // Optional: notify parent component that login succeeded
  //     if (onLogin) onLogin(res.data.user);
  //   } catch (err) {
  //     setMessage(err.response?.data?.message || "Login failed ❌");
  //   }
  // };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

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

          <button type="submit"></button>

          {/* <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button> */}
        </form>

        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
