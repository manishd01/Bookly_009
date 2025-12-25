import { useEffect, useState } from "react";
import {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../services/bookService";
import { getUser } from "../services/authService";
import ReviewForm from "./ReviewForm";
import "./Book.css";
import Tags from "./Tags";
// import { addTagsToBook } from "../services/tagService";

function Books() {
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    publish_date: "",
    pages: "",
    isbn: "",
  });
  const [editBook, setEditBook] = useState(null);

  /* 🔹 Load books */
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const currUser = getUser();
        if (!currUser?.uid) {
          setMessage("User not logged in ❌");
          return;
        }

        const res = await getAllBooks(currUser.uid);
        setBooks(res.data);
      } catch (err) {
        setMessage(
          err.response?.data?.message ||
            err.response?.data?.detail?.[0]?.msg ||
            "Failed to fetch books ❌"
        );
      }
    };

    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const user = getUser();
      if (!user?.uid) {
        setMessage("User not logged in ❌");
        return;
      }

      const res = await getAllBooks(user.uid);
      console.log(res, "list of books");

      setBooks(res.data);
    } catch (err) {
      setMessage(
        err.response?.data?.detail?.[0]?.msg || "Failed to load books ❌"
      );
    }
  };

  const handleChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    isEdit
      ? setEditBook({ ...editBook, [name]: value })
      : setNewBook({ ...newBook, [name]: value });
  };

  /* ➕ Add Book */
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const user = getUser();
      await addBook({ ...newBook, user_uid: user.uid });
      setMessage("Book added ✅");
      setNewBook({
        title: "",
        author: "",
        genre: "",
        publish_date: "",
        pages: "",
        isbn: "",
      });
      loadBooks();
    } catch (err) {
      setMessage(
        err.response?.data?.detail?.[0]?.msg || "Failed to add book ❌"
      );
    }
  };

  /* ✏️ Update */
  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      await updateBook(editBook.uid, editBook);
      setEditBook(null);
      setMessage("Book updated ✅");
      loadBooks();
    } catch {
      setMessage("Failed to update book ❌");
    }
  };

  /* 🗑 Delete */
  const handleDeleteBook = async (uid) => {
    try {
      await deleteBook(uid);
      setMessage("Book deleted ✅");
      loadBooks();
    } catch {
      setMessage("Failed to delete book ❌");
    }
  };

  return (
    <div className="book-container">
      <div className="book-card">
        <h2>📚 My Books</h2>

        {!editBook && (
          <form onSubmit={handleAddBook} className="book-form">
            {Object.keys(newBook).map((key) => (
              <input
                key={key}
                name={key}
                placeholder={key.replace("_", " ")}
                value={newBook[key]}
                onChange={handleChange}
                type={key.toLowerCase().includes("date") ? "date" : "text"}
                required
              />
            ))}
            <button type="submit">Add Book</button>
          </form>
        )}

        {editBook && (
          <form onSubmit={handleUpdateBook} className="book-form">
            {Object.keys(editBook).map(
              (key) =>
                key !== "uid" && (
                  <input
                    key={key}
                    name={key}
                    value={editBook[key]}
                    onChange={(e) => handleChange(e, true)}
                  />
                )
            )}
            <button type="submit">Update</button>
            <button type="button" onClick={() => setEditBook(null)}>
              Cancel
            </button>
          </form>
        )}

        {message && <p>{message}</p>}

        {/* 📄 Books */}
        {books.map((book) => (
          <div key={book.uid} className="book-item">
            <h3>{book.title}</h3>

            {/* 🏷️ TAGS — belongs to THIS book */}
            <Tags bookUid={book.uid} onTagsUpdated={loadBooks} />

            <p>
              <b>Author:</b> {book.author}
            </p>
            <p>
              <b>Genre:</b> {book.genre}
            </p>

            <button onClick={() => setEditBook(book)}>Edit</button>
            <button onClick={() => handleDeleteBook(book.uid)}>Delete</button>

            {/* ⭐ Reviews */}
            <ReviewForm bookUid={book.uid} onReviewAdded={loadBooks} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Books;
