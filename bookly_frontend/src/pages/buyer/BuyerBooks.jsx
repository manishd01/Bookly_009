import { useEffect, useState } from "react";
import { getBooks } from "../../services/bookService";
import ReviewForm from "../../components/ReviewForm";
import Tags from "../../components/Tags";

export default function BuyerBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const fetchedBooks = await getBooks();
        setBooks(fetchedBooks.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }
    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Available Books</h1>
      <ul>
        {books.map((book) => (
          <li key={book.uid}>
            {book.title}
            <ReviewForm bookUid={book.uid} />
            <Tags bookUid={book.uid} />
          </li>
        ))}
      </ul>
    </div>
  );
}
