// src/services/authService.js
import api from "./api_root";

const API_URL = "/api/v1/auth";

/* ===================== LOGIN ===================== */
export const login = async ({ email, password }) => {
  return api.post(`${API_URL}/login`, {
    email,
    password1: password, // backend expects password1
  });
};

/* ===================== LOGOUT ===================== */
export const logout = async () => {
  return api.get(`${API_URL}/logout`);
};

/* ===================== SIGNUP ===================== */
export const signup = async (data) => {
  console.log("Signup data in auth service js:", data);
  return api.post(`${API_URL}/signup`, data);
};

/* ===================== GET CURRENT USER ===================== */
export const getCurrentUser = async () => {
  const res = await api.get("/api/v1/auth/me");

  console.log("getCurrentUser response in auth service:", res);
  return {
    authenticated: !!res.data.user,
    user: res.data.user,
  };
};

/* ===================== REFRESH TOKEN ===================== */
export const refreshAccessToken = async () => {
  return api.get(`${API_URL}/refresh_token`);
};
