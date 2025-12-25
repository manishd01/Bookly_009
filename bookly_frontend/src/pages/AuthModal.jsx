import { useState } from "react";
import { login, signup } from "../services/authService";
import "./Auth.css";

function AuthModal({ type, onClose, onLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Loading...");

    try {
      const res =
        type === "login"
          ? await login({
              email: formData.email,
              password: formData.password,
            })
          : await signup(formData);

      // Store tokens
      localStorage.setItem("accessToken", res.data.access_token);
      localStorage.setItem("refreshToken", res.data.refresh_token);

      // Notify parent component
      if (onLogin) onLogin(res.data.user);

      setMessage(res.data.message || "Success ✅");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong ❌");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{type === "login" ? "Login" : "Signup"}</h2>

        <form onSubmit={handleSubmit}>
          {type === "signup" && (
            <>
              <input
                name="username"
                placeholder="Username"
                onChange={handleChange}
                required
              />
              <input
                name="first_name"
                placeholder="First Name"
                onChange={handleChange}
                required
              />
              <input
                name="last_name"
                placeholder="Last Name"
                onChange={handleChange}
                required
              />
            </>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">{type === "login" ? "Login" : "Signup"}</button>
        </form>

        {message && <p className="message">{message}</p>}

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default AuthModal;
