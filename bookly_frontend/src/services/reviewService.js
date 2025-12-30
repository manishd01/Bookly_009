import api from "./api_root";

const API_BASE = "/api/v1/reviews";

// ADD REVIEW
export const addReviewToBook = async (bookUid, reviewData) => {
  if (!bookUid) {
    throw new Error("bookUid is required");
  }

  try {
    return await api.post(`${API_BASE}/book/${bookUid}`, reviewData);
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

// GET REVIEWS
export const getReviewsByBook = async (bookUid) => {
  try {
    return await api.get(`${API_BASE}/book/${bookUid}`);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};
