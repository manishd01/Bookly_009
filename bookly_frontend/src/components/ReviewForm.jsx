import { useState, useEffect } from "react";
import { addReviewToBook, getReviewsByBook } from "../services/reviewService";
import "./ReviewForm.css";

function ReviewForm({ bookUid, onReviewAdded }) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!bookUid) return;

    const fetchReviews = async () => {
      try {
        const res = await getReviewsByBook(bookUid);
        setReviews(res.data || []);
      } catch {
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

      setMessage("Review added successfully ✅");
      setRating("");
      setComment("");

      const res = await getReviewsByBook(bookUid);
      setReviews(res.data || []);
      onReviewAdded?.();
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          err.response?.data?.detail?.[0]?.msg ||
          "Failed to add review ❌"
      );
    }
  };

  const renderStars = (value, max = 5) => (
    <div className="review-stars">
      {[...Array(max)].map((_, i) => (
        <span key={i} className={i < value ? "star filled" : "star"}>
          ★
        </span>
      ))}
    </div>
  );

  if (!bookUid) return null;

  return (
    <div className="reviews-wrapper">
      <h4 className="reviews-title">⭐ Reviews</h4>

      {/* Add Review */}
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="review-form-row">
          <input
            className="review-rating-input"
            type="number"
            min="1"
            max="5"
            placeholder="Rating (1–5)"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </div>

        <textarea
          className="review-textarea"
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />

        <button className="review-submit-btn" type="submit">
          Submit Review
        </button>
      </form>

      {message && <p className="review-message">{message}</p>}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.length === 0 && (
          <p className="reviews-empty">No reviews yet</p>
        )}

        {reviews.map((rev) => (
          <div key={rev.uid} className="review-card">
            {renderStars(rev.rating)}

            <p className="review-text">{rev.review_text}</p>

            <p className="review-meta">
              by{" "}
              <span className="review-user">
                {rev.user?.username || rev.user?.email}
              </span>{" "}
              • {new Date(rev.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewForm;
