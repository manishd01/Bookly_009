import { useEffect, useState } from "react";
import {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  getCurrentUserBooks,
} from "../services/bookService";
import { getUser } from "../services/authService";
import ReviewForm from "./ReviewForm";
import Tags from "./Tags";
import "./Book.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState("my"); // my | all
  const [editBook, setEditBook] = useState(null);

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    publish_date: "",
    pages: "",
    isbn: "",
  });
  var loadBooks = async (mode = viewMode) => {
    try {
      const user = getUser();
      if (!user?.uid) {
        setMessage("User not logged in ❌");
        return;
      }

      let res;
      if (mode === "my") {
        res = await getCurrentUserBooks(user.uid); // user-specific
      } else {
        res = await getAllBooks(); // all books
      }

      setBooks(res.data);
    } catch (err) {
      setMessage("Failed to load books ❌", err);
    }
  };
  useEffect(() => {
    loadBooks(viewMode);
  }, [viewMode]);

  const handleChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    isEdit
      ? setEditBook({ ...editBook, [name]: value })
      : setNewBook({ ...newBook, [name]: value });
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const user = getUser();
      await addBook({ ...newBook, user_uid: user.uid });
      setMessage("Book added successfully ✅");
      setNewBook({
        title: "",
        author: "",
        genre: "",
        publish_date: "",
        pages: "",
        isbn: "",
      });
      loadBooks();
    } catch {
      setMessage("Failed to add book ❌");
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      await updateBook(editBook.uid, editBook);
      setEditBook(null);
      setMessage("Book updated ✅");
      loadBooks();
    } catch {
      setMessage("Update failed ❌");
    }
  };

  const handleDeleteBook = async (uid) => {
    try {
      await deleteBook(uid);
      setMessage("Book deleted 🗑️");
      loadBooks();
    } catch {
      setMessage("Delete failed ❌");
    }
  };

  return (
    <div className="books-page">
      <div className="books-card">
        {/* Toggle */}
        <div className="books-toggle">
          <button
            className={`toggle-btn ${viewMode === "my" ? "active" : ""}`}
            onClick={() => setViewMode("my")}
          >
            My Books
          </button>
          <button
            className={`toggle-btn ${viewMode === "all" ? "active" : ""}`}
            onClick={() => setViewMode("all")}
          >
            All Books
          </button>
        </div>

        <h2 className="books-title">📚 Book Collection</h2>

        {/* Add / Edit Form */}
        {!editBook ? (
          <form className="book-form" onSubmit={handleAddBook}>
            <h4>Add New Book</h4>
            {Object.keys(newBook).map((key) => (
              <input
                key={key}
                name={key}
                placeholder={key.replace("_", " ")}
                value={newBook[key]}
                onChange={handleChange}
                type={key.includes("date") ? "date" : "text"}
                required
              />
            ))}
            <button className="primary-btn" type="submit">
              Add Book
            </button>
          </form>
        ) : (
          <form className="book-form" onSubmit={handleUpdateBook}>
            <h4>Edit Book</h4>
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
            <div className="form-actions">
              <button className="primary-btn" type="submit">
                Update
              </button>
              <button
                className="secondary-btn"
                type="button"
                onClick={() => setEditBook(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {message && <p className="message">{message}</p>}

        {/* Book List */}
        <div className="books-list">
          {books.map((book) => (
            <div key={book.uid} className="book-item">
              <div key={book.uid} className="book-card">
                <div className="book-header">
                  <h3 className="book-title">{book.title}</h3>
                  <span className="book-genre">{book.genre}</span>
                </div>

                <div className="book-details">
                  <p>
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p>
                    <strong>Published:</strong>{" "}
                    {book.publish_date
                      ? new Date(book.publish_date).toLocaleDateString()
                      : "—"}
                  </p>
                  <p>
                    <strong>Pages:</strong> {book.pages || "—"}
                  </p>
                  <p>
                    <strong>ISBN:</strong> {book.isbn || "—"}
                  </p>
                </div>
              </div>

              <Tags bookUid={book.uid} onTagsUpdated={loadBooks} />

              <div className="book-actions">
                <button
                  className="secondary-btn"
                  onClick={() => setEditBook(book)}
                >
                  Edit
                </button>
                {viewMode === "my" && (
                  <button
                    className="danger-btn"
                    onClick={() => handleDeleteBook(book.uid)}
                  >
                    Delete
                  </button>
                )}
              </div>

              <ReviewForm bookUid={book.uid} onReviewAdded={loadBooks} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Books;

// import { useEffect, useState } from "react";
// import {
//   getAllBooks,
//   addBook,
//   updateBook,
//   deleteBook,
//   getCurrentUserBooks,
// } from "../services/bookService";
// import { getUser } from "../services/authService";
// import ReviewForm from "./ReviewForm";
// import "./Book.css";
// import Tags from "./Tags";
// // import { addTagsToBook } from "../services/tagService";

// function Books() {
//   const [books, setBooks] = useState([]);
//   const [message, setMessage] = useState("");
//   const [newBook, setNewBook] = useState({
//     title: "",
//     author: "",
//     genre: "",
//     publish_date: "",
//     pages: "",
//     isbn: "",
//   });
//   const [viewMode, setViewMode] = useState("my"); // "my" | "all"
//   const [editBook, setEditBook] = useState(null);

//   /* 🔹 Load books */
//   // useEffect(() => {
//   //   const loadBooks = async () => {
//   //     try {
//   //       const currUser = getUser();
//   //       if (!currUser?.uid) {
//   //         setMessage("User not logged in ❌");
//   //         return;
//   //       }

//   //       const res = await getAllBooks(currUser.uid);
//   //       setBooks(res.data);
//   //     } catch (err) {
//   //       setMessage(
//   //         err.response?.data?.message ||
//   //           err.response?.data?.detail?.[0]?.msg ||
//   //           "Failed to fetch books ❌"
//   //       );
//   //     }
//   //   };

//   //   loadBooks();
//   // }, []);

//   var loadBooks = async (mode = viewMode) => {
//     try {
//       const user = getUser();
//       if (!user?.uid) {
//         setMessage("User not logged in ❌");
//         return;
//       }

//       let res;
//       if (mode === "my") {
//         res = await getCurrentUserBooks(user.uid); // user-specific
//       } else {
//         res = await getAllBooks(); // all books
//       }

//       setBooks(res.data);
//     } catch (err) {
//       setMessage("Failed to load books ❌", err);
//     }
//   };
//   useEffect(() => {
//     loadBooks(viewMode);
//   }, [viewMode]);

//   const handleChange = (e, isEdit = false) => {
//     const { name, value } = e.target;
//     isEdit
//       ? setEditBook({ ...editBook, [name]: value })
//       : setNewBook({ ...newBook, [name]: value });
//   };

//   /* ➕ Add Book */
//   const handleAddBook = async (e) => {
//     e.preventDefault();
//     try {
//       const user = getUser();
//       await addBook({ ...newBook, user_uid: user.uid });
//       setMessage("Book added ✅");
//       setNewBook({
//         title: "",
//         author: "",
//         genre: "",
//         publish_date: "",
//         pages: "",
//         isbn: "",
//       });
//       loadBooks();
//     } catch (err) {
//       setMessage(
//         err.response?.data?.detail?.[0]?.msg || "Failed to add book ❌"
//       );
//     }
//   };

//   /* ✏️ Update */
//   const handleUpdateBook = async (e) => {
//     e.preventDefault();
//     try {
//       await updateBook(editBook.uid, editBook);
//       setEditBook(null);
//       setMessage("Book updated ✅");
//       loadBooks();
//     } catch {
//       setMessage("Failed to update book ❌");
//     }
//   };

//   /* 🗑 Delete */
//   const handleDeleteBook = async (uid) => {
//     try {
//       await deleteBook(uid);
//       setMessage("Book deleted ✅");
//       loadBooks();
//     } catch {
//       setMessage("Failed to delete book ❌");
//     }
//   };

//   return (
//     <div className="book-container">
//       <div className="book-card">
//         <div className="book-toggle">
//           <button
//             className={viewMode === "my" ? "active" : ""}
//             onClick={() => setViewMode("my")}
//           >
//             My Books
//           </button>

//           <button
//             className={viewMode === "all" ? "active" : ""}
//             onClick={() => setViewMode("all")}
//           >
//             All Books
//           </button>
//         </div>
//         <h2>📚 List of Existing Books </h2>

//         {!editBook && (
//           <form onSubmit={handleAddBook} className="book-form">
//             <h5>Enter details to add a new book </h5>
//             {Object.keys(newBook).map((key) => (
//               <input
//                 key={key}
//                 name={key}
//                 placeholder={key.replace("_", " ")}
//                 value={newBook[key]}
//                 onChange={handleChange}
//                 type={key.toLowerCase().includes("date") ? "date" : "text"}
//                 required
//               />
//             ))}
//             <button type="submit">Add Book</button>
//           </form>
//         )}

//         {editBook && (
//           <form onSubmit={handleUpdateBook} className="book-form">
//             {Object.keys(editBook).map(
//               (key) =>
//                 key !== "uid" && (
//                   <input
//                     key={key}
//                     name={key}
//                     value={editBook[key]}
//                     onChange={(e) => handleChange(e, true)}
//                   />
//                 )
//             )}
//             {viewMode === "my" && (
//               <>
//                 {/* <button onClick={() => setEditBook(books)}>Edit</button> */}
//                 <button onClick={() => handleDeleteBook(books.uid)}>
//                   Delete
//                 </button>
//               </>
//             )}
//             <button type="submit">Update</button>
//             <button type="button" onClick={() => setEditBook(null)}>
//               Cancel
//             </button>
//           </form>
//         )}

//         {message && <p>{message}</p>}

//         {/* 📄 Books */}
//         {books.map((book) => (
//           <div key={book.uid} className="book-item">
//             <h3>{book.title}</h3>

//             {/* 🏷️ TAGS — belongs to THIS book */}
//             <Tags bookUid={book.uid} onTagsUpdated={loadBooks} />

//             <p>
//               <b>Author:</b> {book.author}
//             </p>
//             <p>
//               <b>Genre:</b> {book.genre}
//             </p>

//             <button onClick={() => setEditBook(book)}>Edit</button>
//             <button onClick={() => handleDeleteBook(book.uid)}>Delete</button>

//             {/* ⭐ Reviews */}
//             <ReviewForm bookUid={book.uid} onReviewAdded={loadBooks} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Books;
