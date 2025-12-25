import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/v1/auth";

// LOGIN
export const login = ({ email, password }) => {
  return axios.post(`${API_BASE}/login`, {
    email: email,
    password1: password, // backend expects password1
  });
};

// SIGNUP
export const signup = ({
  username,
  email,
  password,
  first_name,
  last_name,
}) => {
  return axios.post(`${API_BASE}/signup`, {
    username,
    email,
    password1: password, // backend expects password1
    first_name,
    last_name,
  });
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  // Optional redirect
  window.location.href = "/login";
};

// GET stored access token
export const getAccessToken = () => localStorage.getItem("accessToken");

// GET stored refresh token
export const getRefreshToken = () => localStorage.getItem("refreshToken");

/* ---------------- GET STORED USER ---------------- */
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getAuthHeaders = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
