import api from "./api_root"; // shared axios instance with withCredentials: true

const API_URL = "/api/v1/tags";

/* 🔹 Get all tags */
export const getAllTags = () => {
  return api.get(`${API_URL}/`);
};

/* 🔹 Create new tag */
export const createTag = (data) => {
  return api.post(`${API_URL}/`, data);
};

/* 🔹 Add tags to book */
export const addTagsToBook = (bookUid, tagsPayload) => {
  console.log(bookUid, "bookUid in service", tagsPayload);
  return api.post(`${API_URL}/book/${bookUid}`, tagsPayload);
};

/* 🔹 Update tag */
export const updateTag = (tagUid, data) => {
  return api.put(`${API_URL}/${tagUid}`, data);
};

/* 🔹 Delete tag */
export const deleteTag = (tagUid) => {
  return api.delete(`${API_URL}/${tagUid}`);
};

/* 🔹 Get tags by book */
export const getTagsByBook = (bookUid) => {
  return api.get(`${API_URL}/${bookUid}/tags`);
};
