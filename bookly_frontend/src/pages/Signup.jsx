import { useEffect, useState } from "react";
import { signup } from "../services/authService";
import "./Auth.css";

function Signup({ onSignup }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    first_name: "",
    last_name: "",
    role: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting signup with data:", formData);
      const res = await signup(formData);
      console.log("Signup response:", res);
      setMessage("Account created successfully 🎉 Please login.");

      // ⏳ small delay so user can read message
      setTimeout(() => {
        if (onSignup) {
          onSignup(); // trigger login modal
        }
      }, 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed ❌");
    }
  };

  return (
    <>
      <div className="signup-container">
        <h2 className="auth-title">Signup</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

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
            name="password1"
            placeholder="Password"
            value={formData.password1}
            onChange={handleChange}
            required
          />

          <input
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />

          <input
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <label>Select Role: </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="Buyer">Buyer</option>
            <option value="Seller">Seller</option>
          </select>

          <button type="submit">Signup</button>
        </form>

        {message && <p className="auth-message">{message}</p>}
      </div>
    </>
  );
}

export default Signup;
