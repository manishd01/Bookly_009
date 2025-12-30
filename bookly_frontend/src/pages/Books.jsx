import { useAuth } from "../context/AuthContext";
import { isSeller, isBuyer } from "../utils/roleGuards";

function Books() {
  const { auth } = useAuth();
  const user = auth.user;

  const seller = isSeller(user);
  const buyer = isBuyer(user);

  return (
    <>
      {/* SELLER UI */}
      {seller && (
        <>
          <AddBookForm />
          <SellerBookActions />
        </>
      )}

      {/* BUYER UI */}
      {buyer && (
        <>
          <BrowseBooks />
          <BuyerActions /> {/* reviews, bookmark, buy */}
        </>
      )}
    </>
  );
}
export default Books;

// import { useEffect, useState, useCallback } from "react";
// import {
//   getAllBooks,
//   getCurrentUserBooks,
//   addBook,
//   updateBook,
//   deleteBook,
// } from "../services/bookService";
// import ReviewForm from "./ReviewForm";
// import Tags from "./Tags";
// import "./Book.css";

// function Books({ auth }) {
//   const [books, setBooks] = useState([]);
//   const [viewMode, setViewMode] = useState("all");
//   const [message, setMessage] = useState("");
//   const [editBook, setEditBook] = useState(null);

//   const [newBook, setNewBook] = useState({
//     title: "",
//     author: "",
//     genre: "",
//     publish_date: "",
//     pages: "",
//     isbn: "",
//   });

//   // 🔹 Load books
//   var loadBooks = useCallback(
//     async (mode = viewMode) => {
//       console.log("Loading books with auth:", auth);
//       if (!auth?.authenticated) return;

//       try {
//         let res;
//         if (mode === "my") {
//           res = await getCurrentUserBooks(auth.user.uid);
//         } else {
//           res = await getAllBooks();
//         }
//         setBooks(res.data);
//         setMessage("");
//       } catch (err) {
//         console.error("Failed to load books:", err);
//         setMessage("Failed to load books ❌");
//       }
//     },
//     [auth, viewMode]
//   );

//   useEffect(() => {
//     loadBooks();
//   }, [auth, viewMode, loadBooks]);

//   // 🔹 Form handlers
//   const handleChange = (e, isEdit = false) => {
//     const { name, value } = e.target;
//     isEdit
//       ? setEditBook({ ...editBook, [name]: value })
//       : setNewBook({ ...newBook, [name]: value });
//   };

//   const handleAddBook = async (e) => {
//     e.preventDefault();
//     try {
//       await addBook({ ...newBook, user_uid: auth.user.uid });
//       setMessage("Book added successfully ✅");
//       setNewBook({
//         title: "",
//         author: "",
//         genre: "",
//         publish_date: "",
//         pages: "",
//         isbn: "",
//       });
//       loadBooks();
//     } catch {
//       setMessage("Failed to add book ❌");
//     }
//   };

//   const handleUpdateBook = async (e) => {
//     e.preventDefault();
//     try {
//       await updateBook(editBook.uid, editBook);
//       setEditBook(null);
//       setMessage("Book updated ✅");
//       loadBooks();
//     } catch {
//       setMessage("Update failed ❌");
//     }
//   };

//   const handleDeleteBook = async (uid) => {
//     try {
//       await deleteBook(uid);
//       setMessage("Book deleted 🗑️");
//       loadBooks();
//     } catch {
//       setMessage("Delete failed ❌");
//     }
//   };

//   // 🔹 Render
//   return (
//     <div className="books-page">
//       <div className="books-card">
//         <div className="books-toggle">
//           <button
//             className={`toggle-btn ${viewMode === "all" ? "active" : ""}`}
//             onClick={() => setViewMode("all")}
//           >
//             All Books
//           </button>
//           <button
//             className={`toggle-btn ${viewMode === "my" ? "active" : ""}`}
//             onClick={() => setViewMode("my")}
//           >
//             My Books
//           </button>
//         </div>

//         <h2 className="books-title">📚 Book Collection</h2>

//         {!editBook && (
//           <form className="book-form" onSubmit={handleAddBook}>
//             <h4>Add New Book</h4>
//             {Object.keys(newBook).map((key) => (
//               <input
//                 key={key}
//                 name={key}
//                 placeholder={key.replace("_", " ")}
//                 value={newBook[key]}
//                 onChange={handleChange}
//                 type={key.includes("date") ? "date" : "text"}
//                 required
//               />
//             ))}
//             <button className="primary-btn">Add Book</button>
//           </form>
//         )}

//         {editBook && (
//           <form className="book-form" onSubmit={handleUpdateBook}>
//             <h4>Edit Book</h4>
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
//             <div className="form-actions">
//               <button className="primary-btn">Update</button>
//               <button
//                 type="button"
//                 className="secondary-btn"
//                 onClick={() => setEditBook(null)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         )}

//         {message && <p className="message">{message}</p>}

//         <div className="books-list">
//           {books.map((book) => (
//             <div key={book.uid} className="book-item">
//               <div className="book-card">
//                 <h3>{book.title}</h3>
//                 <p>
//                   <b>Author:</b> {book.author}
//                 </p>
//                 <p>
//                   <b>Genre:</b> {book.genre}
//                 </p>
//               </div>

//               <Tags bookUid={book.uid} onTagsUpdated={loadBooks} />

//               <div className="book-actions">
//                 <button onClick={() => setEditBook(book)}>Edit</button>
//                 {viewMode === "my" && (
//                   <button onClick={() => handleDeleteBook(book.uid)}>
//                     Delete
//                   </button>
//                 )}
//               </div>

//               <ReviewForm bookUid={book.uid} onReviewAdded={loadBooks} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Books;
