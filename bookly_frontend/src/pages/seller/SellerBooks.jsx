import { useEffect, useState } from "react";
import {
  addBook,
  uploadBooksBulk,
  getCurrentUserBooks,
} from "../../services/bookService";
import Tags from "../../components/Tags";
import { useAuth } from "../../context/AuthContext";

export default function SellerBooks() {
  const [books, setBooks] = useState([]);
  const [file, setFile] = useState(null);
  const { auth } = useAuth();
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    publish_date: "",
    pages: "",
    isbn: "",
  });

  var loadBooks = async () => {
    try {
      const res = await getCurrentUserBooks(auth.user.uid);
      setBooks(res.data);
    } catch (error) {
      console.error("Error loading books:", error);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addBook(form);
      setForm({
        title: "",
        author: "",
        genre: "",
        publish_date: "",
        pages: "",
        isbn: "",
      });
      loadBooks();
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    try {
      await uploadBooksBulk(file);
      setFile(null);
      loadBooks();
    } catch (error) {
      console.error("Error uploading books in bulk:", error);
    }
  };

  return (
    <>
      <h3>Add Book</h3>

      <form onSubmit={handleAdd}>
        {Object.keys(form).map((k) => (
          <input
            key={k}
            name={k}
            type={k.includes("date") ? "date" : "text"}
            placeholder={k.replace("_", " ").toUpperCase()}
            value={form[k]}
            onChange={handleChange}
            required
          />
        ))}
        <button>Add Book</button>
      </form>

      <div>
        <h2>Bulk Upload Books</h2>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleBulkUpload}>Upload Books</button>
      </div>

      <div>
        <h2>Your Books</h2>
        {books.map((b) => (
          <div key={b.uid}>
            <h4>{b.title}</h4>
            {/* Pass a callback to reload books if needed */}
            <Tags bookUid={b.uid} onTagsUpdated={loadBooks} />
          </div>
        ))}
      </div>
    </>
  );
}
