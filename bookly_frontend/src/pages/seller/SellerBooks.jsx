import { useEffect, useState } from "react";
import {
  addBook,
  uploadBooksBulk,
  getCurrentUserBooks,
} from "../../services/bookService";
import Tags from "../../components/Tags";
import { useAuth } from "../../context/AuthContext";

export default function SellerBooks() {
  const [message, setMessage] = useState("");
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
      console.log(res.data, "loaded seller books"); // ❗ keep console log
    } catch (error) {
      console.error("Error loading books:", error); // ❗ keep console log
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
      console.log("Adding book:", form); // ❗ keep console log
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
      console.error("Error adding book:", error); // ❗ keep console log
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();

    try {
      console.log("Uploading bulk file:", file); // ❗ keep console log
      await uploadBooksBulk(file);

      setMessage("Books uploaded successfully ✅");
      setFile(null);
      loadBooks();
    } catch (err) {
      console.error("Error uploading books in bulk:", err); // ❗ keep console log

      const backendMessage =
        err.response?.data?.detail || // FastAPI HTTPException
        err.response?.data?.message || // other APIs
        "Something went wrong ❌";

      setMessage(backendMessage);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-10">
      {/* Add Book Form */}
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-5xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Add Book</h3>
        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          onSubmit={handleAdd}
        >
          {Object.keys(form).map((k) => (
            <input
              key={k}
              name={k}
              type={k.includes("date") ? "date" : "text"}
              placeholder={k.replace("_", " ").toUpperCase()}
              value={form[k]}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          ))}
          <button
            type="submit"
            className="col-span-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            Add Book
          </button>
        </form>
      </div>

      {/* Bulk Upload */}
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-5xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Bulk Upload Books
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-auto"
          />
          <button
            onClick={handleBulkUpload}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            Upload Books
          </button>
        </div>
        {message && (
          <div
            className={`mt-4 rounded-md px-4 py-2 text-sm font-medium
      ${
        message.toLowerCase().includes("success")
          ? "bg-green-100 text-green-700 border border-green-300"
          : "bg-red-100 text-red-700 border border-red-300"
      }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Seller Books List */}
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-5xl mx-auto flex flex-col space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800">Your Books</h3>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
                border border-gray-200 rounded-3xl p-6"
        >
          {books.map((b) => (
            <div
              key={b.uid}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col
              border border-gray-200 rounded-2xl p-6"
            >
              {/* Title */}
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                {b.title}
              </h4>

              {/* Details */}
              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Author:</span> {b.author}
                </p>
                <p>
                  <span className="font-medium">Genre:</span> {b.genre}
                </p>
                <p>
                  <span className="font-medium">Published:</span>{" "}
                  {new Date(b.publish_date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Pages:</span> {b.pages}
                </p>
                <p>
                  <span className="font-medium">ISBN:</span> {b.isbn}
                </p>
              </div>

              {/* Spacer */}
              <div className="flex-grow" />

              {/* Tags */}
              <div className="mt-4">
                <Tags bookUid={b.uid} onTagsUpdated={loadBooks} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
