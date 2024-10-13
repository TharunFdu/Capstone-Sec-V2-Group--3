import React, { useState, useEffect } from 'react';
import { getUserBookings, cancelBooking, getEvents } from '../services/authService';
import Navbar from './Navbar';
import './UserBookings.css';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  console.log("User ID (Frontend):", userId);

  useEffect(() => {
    if (userId) {
      loadBookings();
      loadEvents();
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

  const handleCancel = async (eventId) => {
    try {
      await cancelBooking(userId, eventId);
      loadBookings();  
    } catch (error) {
      console.error('Error canceling booking:', error);
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
        <div className="booking-list-container">
          <h2>Your Bookings</h2>
          <ul className="booking-list">
            {bookings.map(booking => (
              <li key={booking.eventId}>
                Event: {getEventName(booking.eventId)} - Status: {booking.status}
                <button className="cancel-button" onClick={() => handleCancel(booking.eventId)}>Cancel Booking</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserBookings;
