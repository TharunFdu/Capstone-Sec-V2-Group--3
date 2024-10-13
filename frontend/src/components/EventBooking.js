import React, { useState, useEffect } from 'react';
import { getEvents, bookEvent, getVenues } from '../services/authService';
import './EventBooking.css';  
import Navbar from './Navbar';

const EventBooking = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    loadEvents();
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const data = await getVenues(); 
      setVenues(data);
    } catch (error) {
      console.error('Error fetching venues:', error);
      alert('Failed to load venues');
    }
  };

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to load events');
    }
  };

  const handleBookEvent = async (eventId) => {
    try {
      await bookEvent(userId, eventId);
      alert('Event booked successfully!');
    } catch (error) {
      console.error('Error booking event:', error);
      alert('Failed to book event');
    }
  };

  const getVenueLocation = (venueId) => {
    const venue = venues.find(venue => venue.id === venueId);
    return venue ? venue.location : 'Location not available';  
  };

  return (
    <div>
      <Navbar />
      <div className="event-booking-container">
        <h2>Book an Event</h2>

        <div className="event-list">
          {events.length > 0 ? (
            events.map(event => (
              <div className="event-card" key={event.id}>
                <div className="event-card-content">
                  <img src={event.image ? `http://localhost:5001${event.image}` : 'default-event.jpg'} alt={event.title} className="event-image" />  {}
                  <h3 style={{ color: 'black' }}>{event.title}</h3>
                  <p style={{ color: 'black' }}>{getVenueLocation(event.venueId)}</p>
                  <p style={{ color: 'black' }}>{new Date(event.date).toLocaleDateString()}</p>
                  <button className="book-button" onClick={() => handleBookEvent(event.id)}>
                    Book Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No events available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventBooking;
