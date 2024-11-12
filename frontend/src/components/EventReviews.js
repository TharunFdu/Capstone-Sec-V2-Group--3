import React, { useEffect, useState } from 'react';
import { getEventReviews } from '../services/authService';
import './EventReviews.css';

const EventReviews = ({ eventId }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getEventReviews(eventId);
        setReviews(data);
        setError('');
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews.');
      }
    };
    fetchReviews();
  }, [eventId]);

  return (
    <div className="event-reviews">
      <h3>Event Reviews</h3>
      {error && <p className="error-message">{error}</p>}
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.reviewId} className="review-item">
            <p className="rating">Rating: {review.rating} / 5</p>
            <p className="comment">"{review.review}"</p>
            <p className="review-date">Posted on: {new Date(review.timestamp).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p className="no-reviews">No reviews available for this event.</p>
      )}
    </div>
  );
};

export default EventReviews;
