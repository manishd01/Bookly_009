import { useState, useEffect } from "react";
import { addReviewToBook, getReviewsByBook } from "../services/reviewService";

function ReviewForm({ bookUid, onReviewAdded }) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [reviews, setReviews] = useState([]);

  // ✅ Always call hooks first
  useEffect(() => {
    if (!bookUid) return; // inside the hook, safe conditional

    const fetchReviews = async () => {
      try {
        const res = await getReviewsByBook(bookUid);
        setReviews(res.data || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [bookUid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookUid) return;

    try {
      await addReviewToBook(bookUid, {
        rating: Number(rating),
        review_text: comment,
      });

      setMessage("Review added ✅");
      setRating("");
      setComment("");

      // Refresh reviews
      const res = await getReviewsByBook(bookUid);
      setReviews(res.data || []);
      onReviewAdded?.();
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.detail?.[0]?.msg ||
        "Failed to add review ❌";

      setMessage(errMsg);
    }
  };

  const renderStars = (rating, max = 5) => {
    return (
      <>
        {[...Array(max)].map((_, i) => (
          <span key={i}>{i < rating ? "⭐" : "☆"}</span>
        ))}
      </>
    );
  };

  // ✅ Conditional rendering happens here in JSX, not before hooks
  if (!bookUid) {
    return <p style={{ color: "red" }}>Invalid book selected</p>;
  }
  console.log(reviews, "reviews fetched");

  return (
    <div style={{ marginTop: "10px" }}>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          min="1"
          max="5"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />
        <textarea
          placeholder="Write a review"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button type="submit">Add Review</button>
      </form>

      {message && <p>{String(message)}</p>}

      <div style={{ marginTop: "15px" }}>
        <h4>Reviews:</h4>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((rev) => (
          <div
            key={rev.uid}
            style={{ borderTop: "1px solid #ccc", padding: "5px 0" }}
          >
            <p>
              <b>Rating:</b> {renderStars(rev.rating)}
            </p>

            <p>{rev.review_text}</p>
            <p style={{ fontSize: "0.8em", color: "gray" }}>
              by {rev.user_uid || rev.user?.email} on{" "}
              {new Date(rev.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewForm;
