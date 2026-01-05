import { useEffect, useState } from "react";
import { getBooks } from "../../services/bookService";
import ReviewForm from "../../components/ReviewForm";
import Tags from "../../components/Tags";

export default function BuyerBooks() {
  const [books, setBooks] = useState([]);
  const [openReview, setOpenReview] = useState(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const fetchedBooks = await getBooks();
        setBooks(fetchedBooks.data);
        console.log(fetchedBooks.data, "listed books"); // ❗ kept
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }
    fetchBooks();
  }, []);

  const toggleReview = (bookUid) => {
    setOpenReview(openReview === bookUid ? null : bookUid);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        📚 Available Books
      </h1>
      {/* <div className="text-red-800 text-4xl font-bold">TAILWIND WORKING</div> */}

      {/* 3 cards per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book) => (
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
              onClick={() => toggleReview(book.uid)}
              className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-xl transition-all duration-200"
            >
              {openReview === book.uid
                ? "Close Review ▲"
                : "Write / View Review ▼"}
            </button>

            {/* Review Dropdown */}
            {openReview === book.uid && (
              <div className="mt-4 p-4 rounded-xl border border-indigo-200 bg-indigo-50">
                <ReviewForm bookUid={book.book.uid} />
              </div>
            )}
          </div>
        ))}
      </div>
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

// import { useEffect, useState } from "react";
// import { getBooks } from "../../services/bookService";
// import ReviewForm from "../../components/ReviewForm";
// import Tags from "../../components/Tags";

// export default function BuyerBooks() {
//   const [books, setBooks] = useState([]);
//   const [openReview, setOpenReview] = useState(null); // 👈 dropdown control

//   useEffect(() => {
//     async function fetchBooks() {
//       try {
//         const fetchedBooks = await getBooks();
//         setBooks(fetchedBooks.data);
//         console.log(books, "listed books");
//       } catch (error) {
//         console.error("Error fetching books:", error);
//       }
//     }
//     fetchBooks();
//   }, []);

//   const toggleReview = (uid) => {
//     setOpenReview(openReview === uid ? null : uid);
//   };

//   return (
//     <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
//       <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
//         📚 Available Books
//       </h1>

//       {/* 3 books per row */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//         {books.map((book) => (
//           <div
//             key={book.uid}
//             className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 flex flex-col"
//           >
//             {/* Book Header */}
//             <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
//               {book.title}
//             </h2>

//             {/* Book Details */}
//             <div className="grid grid-cols-2 gap-4 mb-6">
//               <Detail label="Author" value={book.author} />
//               <Detail label="Genre" value={book.genre} />
//               <Detail label="Pages" value={book.pages} />
//               <Detail label="ISBN" value={book.isbn} />
//               <Detail label="Published" value={book.publish_date} />
//               <Detail
//                 label="Created"
//                 value={new Date(book.created_at).toLocaleDateString()}
//               />
//             </div>

//             {/* Tags */}
//             <div className="mb-4">
//               <Tags bookUid={book.uid} />
//             </div>

//             {/* Review Dropdown */}
//             <button
//               onClick={() => toggleReview(book.uid)}
//               className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-xl transition-all duration-200"
//             >
//               {openReview === book.uid
//                 ? "Close Review ▲"
//                 : "Write / View Review ▼"}
//             </button>

//             {/* Review Content */}
//             {openReview === book.uid && (
//               <div className="mt-4 p-4 border border-indigo-200 rounded-xl bg-indigo-50 animate-fadeIn">
//                 <ReviewForm bookUid={book.uid} />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// /* 🔹 Reusable detail box */
// function Detail({ label, value }) {
//   return (
//     <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
//       <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
//         {label}
//       </p>
//       <p className="text-sm font-semibold text-gray-800 break-words">
//         {value || "-"}
//       </p>
//     </div>
//   );
// }
