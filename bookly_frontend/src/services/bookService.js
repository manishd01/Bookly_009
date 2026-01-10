import api from "./api_root";

const API_URL = "/api/v1/books";

// Get all books
// services/bookService.js
export const getAllBooks = async ({
  search = "",
  page = 1,
  limit = 15,
} = {}) => {
  const params = {};
  if (search) params.search = search;
  if (page != null) params.page = page;
  if (limit != null) params.limit = limit;

  console.log("Fetching books with params:", params);
  return api.get(`${API_URL}/`, { params });
};

// Get current user's books
export const getCurrentUserBooks = async (userUid) => {
  console.log("Fetching books for userUid inservice layer:", userUid);
  return api.get(`${API_URL}/user/${userUid}`);
};

// Get a single book
export const getBook = async (book_uid) => {
  return api.get(`${API_URL}/${book_uid}`);
};

// Get books submitted by a user
export const getUserBooks = async (user_uid) => {
  return api.get(`${API_URL}/user/${user_uid}`);
};

// Add a book
export const addBook = async (bookData) => {
  return api.post(`${API_URL}/`, bookData);
};

// Update a book
export const updateBook = async (book_uid, bookData) => {
  return api.patch(`${API_URL}/${book_uid}`, bookData);
};

// Delete a book
export const deleteBook = async (book_uid) => {
  return api.delete(`${API_URL}/${book_uid}`);
};

// Upload a single book
export const uploadBook = async (bookData) => {
  return api.post(`${API_URL}/upload`, bookData);
};

// Upload books in bulk
export const uploadBooksBulk = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    return await api.post(`${API_URL}/bulk-upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    console.error("Bulk upload API error:", err); // ❗ keep console log
    throw err; // 👈 VERY IMPORTANT
  }
};

// Fetch all books
export const getBooks = async () => {
  return api.get(`${API_URL}/`);
};
