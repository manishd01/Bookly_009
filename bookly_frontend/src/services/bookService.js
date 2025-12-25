import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/v1/books";

// Helper to get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
};

// Get all books
// export const getAllBooks = async () => {
//   return axios.get(API_URL + "/", { headers: getAuthHeaders() });
// };

export const getCurrentUserBooks = async (userUid) => {
  return axios.get(`${API_URL}/user/${userUid}`, {
    headers: getAuthHeaders(),
  });
};

export const getAllBooks = async () => {
  return axios.get(`${API_URL}/`, {
    headers: getAuthHeaders(),
  });
};
// Get a single book
export const getBook = async (book_uid) => {
  return axios.get(`${API_URL}/${book_uid}`, { headers: getAuthHeaders() });
};

// Get books submitted by a user
export const getUserBooks = async (user_uid) => {
  return axios.get(`${API_URL}/user/${user_uid}`, {
    headers: getAuthHeaders(),
  });
};

// Add a book
export const addBook = async (bookData) => {
  return axios.post(API_URL + "/", bookData, { headers: getAuthHeaders() });
};

// Update a book
export const updateBook = async (book_uid, bookData) => {
  return axios.patch(`${API_URL}/${book_uid}`, bookData, {
    headers: getAuthHeaders(),
  });
};

// Delete a book
export const deleteBook = async (book_uid) => {
  return axios.delete(`${API_URL}/${book_uid}`, { headers: getAuthHeaders() });
};
