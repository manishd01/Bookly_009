import { useEffect, useState } from "react";
import { getAllBooks } from "../../services/bookService";
import ReviewForm from "../../components/ReviewForm";
import Tags from "../../components/Tags";

export default function BuyerBooks() {
  const [books, setBooks] = useState([]);
  const [openReview, setOpenReview] = useState(null);

  // 🔍 Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // 🗂 Pagination state
  const [page, setPage] = useState(1);
  const limit = 15; // default items per page
  const [total, setTotal] = useState(0); // total items from backend

  // Fetch books whenever searchTerm or page changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      async function fetchBooks() {
        try {
          setLoading(true);
          const res = await getAllBooks({ search: searchTerm, page, limit });
          setBooks(res.data.data || []);
          setTotal(res.data.total || 0);
          console.log(res.data, "listed books");
        } catch (error) {
          console.error("Error fetching books:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchBooks();
    }, 300); // debounce search

    return () => clearTimeout(timer);
  }, [searchTerm, page, limit]);

  const toggleReview = (bookUid) => {
    setOpenReview(openReview === bookUid ? null : bookUid);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        📚 Available Books
      </h1>

      {/* 🔍 Search Box */}
      <div className="max-w-xl mx-auto mb-6">
        <input
          type="text"
          placeholder="🔍 Search by title, author, genre, seller, ISBN"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // reset to first page on search
          }}
          className="w-full px-4 py-3 rounded-xl border border-gray-300
                     focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <p className="col-span-full text-center text-gray-500">
            Loading books...
          </p>
        ) : books.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No books found
          </p>
        ) : (
          books.map((book) => (
            <div
              key={book.book.uid}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col"
            >
              {/* Book Name */}
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {book.book.title}
              </h2>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                <Tags bookUid={book.book.uid} />
              </div>

              {/* Book Details */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm mb-6">
                <Detail label="Author" value={book.book.author} />
                <Detail label="Genre" value={book.book.genre} />
                <Detail label="Pages" value={book.book.pages} />
                <Detail label="ISBN" value={book.book.isbn} />
                <Detail
                  label="Created Date"
                  value={new Date(book.book.created_at).toLocaleDateString()}
                />
                <Detail label="Publish Date" value={book.book.publish_date} />
                <Detail label="Seller" value={book.user.username} />
              </div>

              {/* Review Button */}
              <button
                onClick={() => toggleReview(book.book.uid)}
                className="mt-auto bg-indigo-600 hover:bg-indigo-700
                           text-white text-sm font-medium py-2 rounded-xl
                           transition-all duration-200"
              >
                {openReview === book.book.uid
                  ? "Close Review ▲"
                  : "Write / View Review ▼"}
              </button>

              {/* Review Dropdown */}
              {openReview === book.book.uid && (
                <div className="mt-4 p-4 rounded-xl border border-indigo-200 bg-indigo-50">
                  <ReviewForm bookUid={book.book.uid} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination Buttons */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 rounded-lg ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Previous
          </button>

          <span className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 rounded-lg ${
              page === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

/* 🔹 Small reusable detail box */
function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
        {label}
      </p>
      <p className="font-medium text-red-800 break-words">{value || "-"}</p>
    </div>
  );
}
