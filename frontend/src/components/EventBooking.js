import React, { useState, useEffect } from 'react';
import { getEvents, bookEvent, getVenues } from '../services/authService';
import './EventBooking.css';  
import Navbar from './Navbar';

const EventBooking = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [startDate, setStartDate] = useState('');  
  const [endDate, setEndDate] = useState('');     

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

  const loadEvents = async (filters = {}) => {
    try {
      const data = await getEvents(filters);
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

  const handleSearchFilter = () => {
    const filters = {};

    if (searchTerm) {
      filters.search = searchTerm;
    }

    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    loadEvents(filters);  
  };

  return (
    <div>
      <Navbar />
      <div className="event-booking-container">
        <h2>Book an Event</h2>

        <div className="booking-layout">
          <div className="filter-container">
            <h5 style={{ color: 'black' }}>Search & Filter</h5>
            <input
              type="text"
              placeholder="Search event name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
            <button className="filter-button" onClick={handleSearchFilter}>
              Search & Filter
            </button>
          </div>

        <div className="event-list-container">
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
            <h1 style={{ color: 'red' }}>No events available.</h1>
          )}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default EventBooking;
