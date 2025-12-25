import { useState } from "react";
import { signup } from "../services/authService";
import "./Auth.css";
import "./AuthModel.css";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
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
    try {
      const res = await signup(formData);
      setMessage(res.data.message || "Signup successful ✅");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed ❌");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Signup</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
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

          <button type="submit">Signup</button>
        </form>

        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}

export default Signup;
