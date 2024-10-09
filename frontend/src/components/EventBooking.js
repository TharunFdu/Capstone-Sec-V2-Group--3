import React, { useState, useEffect } from 'react';
import { getEvents, bookEvent } from '../services/authService';
import './EventBooking.css';  
import Navbar from './Navbar';

const EventBooking = ({ userId }) => {
  const [events, setEvents] = useState([]);  
  const [selectedEvent, setSelectedEvent] = useState('');  

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getEvents();  
      setEvents(data);  
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to load events');
    }
  };

  const handleBookEvent = async () => {
    if (selectedEvent) {
      try {
        await bookEvent(userId, selectedEvent); 
        alert('Event booked successfully!');
      } catch (error) {
        console.error('Error booking event:', error);
        alert('Failed to book event');
      }
    } else {
      alert('Please select an event to book.');
    }
  };

  return (
    <div><Navbar />
    <div className="event-booking-container">
      <h2>Book an Event</h2>
      <div className="booking-form">
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="event-dropdown"
        >
          <option value="">Select an event</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>
              {event.title} - {event.date}
            </option>
          ))}
        </select>
        <button className="book-button" onClick={handleBookEvent}>
          Book Event
        </button>
      </div>
    </div>
    </div>
  );
};

export default EventBooking;
