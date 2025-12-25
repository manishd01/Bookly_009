import axios from "axios";
import { getAccessToken } from "./authService";

const API_URL = "http://127.0.0.1:8000/api/v1/tags";

const authHeaders = () => ({
  Authorization: `Bearer ${getAccessToken()}`,
});

/* 🔹 Get all tags */
export const getAllTags = () => {
  return axios.get(API_URL + "/", {
    headers: authHeaders(),
  });
};

/* 🔹 Create new tag */
export const createTag = (data) => {
  return axios.post(API_URL + "/", data, {
    headers: authHeaders(),
  });
};

/* 🔹 Add tags to book */
export const addTagsToBook = (bookUid, tagsPayload) => {
  console.log(bookUid, "bookuid in service", tagsPayload);
  console.log(`${API_URL}/book/${bookUid}`, "url");

  return axios.post(`${API_URL}/book/${bookUid}`, tagsPayload, {
    headers: authHeaders(),
  });
};

/* 🔹 Update tag */
export const updateTag = (tagUid, data) => {
  return axios.put(`${API_URL}/${tagUid}`, data, {
    headers: authHeaders(),
  });
};

/* 🔹 Delete tag */
export const deleteTag = (tagUid) => {
  return axios.delete(`${API_URL}/${tagUid}`, {
    headers: authHeaders(),
  });
};

export const getTagsByBook = async (bookUid) => {
  return await axios.get(`${API_URL}/${bookUid}/tags`, {
    headers: authHeaders(),
  });
};
