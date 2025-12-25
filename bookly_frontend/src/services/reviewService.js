import axios from "axios";
import { getAccessToken } from "./authService";

const API_BASE = "http://127.0.0.1:8000/api/v1/reviews";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getAccessToken()}`,
});

// ADD REVIEW
export const addReviewToBook = (bookUid, reviewData) => {
  if (!bookUid) {
    throw new Error("bookUid is required");
  }

  return axios.post(`${API_BASE}/book/${bookUid}`, reviewData, {
    headers: getAuthHeaders(),
  });
};

export const getReviewsByBook = (bookUid) => {
  return axios.get(`${API_BASE}/book/${bookUid}`);
};
