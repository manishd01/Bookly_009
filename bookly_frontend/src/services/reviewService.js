import api from "./api_root";

const API_BASE = "/api/v1/reviews";

// ADD REVIEW
export const addReviewToBook = (bookUid, reviewData) => {
  if (!bookUid) {
    throw new Error("bookUid is required");
  }

  return api.post(`${API_BASE}/book/${bookUid}`, reviewData);
};

// GET REVIEWS
export const getReviewsByBook = (bookUid) => {
  return api.get(`${API_BASE}/book/${bookUid}`);
};
