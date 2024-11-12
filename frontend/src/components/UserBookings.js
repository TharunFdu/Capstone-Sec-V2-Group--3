import React, { useState, useEffect } from 'react';
import { getUserBookings, cancelBooking, getEvents, addReview } from '../services/authService';
import Navbar from './Navbar';
import './UserBookings.css';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 1, review: '' });
  const [reviewedEvents, setReviewedEvents] = useState([]); 

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  useEffect(() => {
    if (userId) {
      loadBookings();
      loadEvents();
      loadReviewedEvents();
    }
  }, [userId]);

  const loadBookings = async () => {
    try {
      const data = await getUserBookings(userId);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const loadReviewedEvents = async () => {
    try {
      const data = await getUserBookings(userId); 
      const reviewedEvents = data
        .filter(booking => booking.reviewed) 
        .map(booking => booking.eventId);
      setReviewedEvents(reviewedEvents);
    } catch (error) {
      console.error('Error fetching reviewed events:', error);
    }
  };

  const handleCancel = async (eventId) => {
    try {
      await cancelBooking(userId, eventId);
      loadBookings();
    } catch (error) {
      console.error('Error canceling booking:', error);
    }
  };

  const handleShowReviewForm = (eventId) => {
    setShowReviewForm(eventId);
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmitReview = async (eventId) => {
    try {
      await addReview({ eventId, userId, ...newReview });
      alert('Review submitted successfully!');
      setShowReviewForm(null);
      loadReviewedEvents(); 
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review.');
    }
  };

  const getEventName = (eventId) => {
    const event = events.find(event => event.id === eventId);
    return event ? event.title : 'Event not found';
  };

  return (
    <div>
      <Navbar />
      <div className="user-bookings-container">
        <h2>Your Bookings</h2>
        <ul className="booking-list">
          {bookings.map(booking => (
            <li key={booking.eventId}>
              <p>Event: {getEventName(booking.eventId)} - Status: {booking.status}</p>
              <button className="cancel-button" onClick={() => handleCancel(booking.eventId)}>Cancel Booking</button>
              
              {!reviewedEvents.includes(booking.eventId) && (
                <>
                  <button
                    className="review-button"
                    onClick={() => handleShowReviewForm(booking.eventId)}
                  >
                    Rate and Review
                  </button>
                  {showReviewForm === booking.eventId && (
                    <div className="review-form">
                      <h3>Leave a Review</h3>
                      <label>Rating:</label>
                      <select
                        name="rating"
                        value={newReview.rating}
                        onChange={handleReviewChange}
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                      <label>Review:</label>
                      <textarea
                        name="review"
                        value={newReview.review}
                        onChange={handleReviewChange}
                        placeholder="Write your review here..."
                      />
                      <button
                        onClick={() => handleSubmitReview(booking.eventId)}
                        className="submit-review-button"
                      >
                        Submit Review
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserBookings;
