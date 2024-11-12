import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById } from '../services/authService';
import EventReviews from './EventReviews';
import './EventDetails.css';

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to load event details.');
      }
    };
    fetchEventDetails();
  }, [eventId]);

  if (!event) {
    return <div className="event-details-message">{error || 'Loading event details...'}</div>;
  }

  return (
    <div className="event-details-container">
      <div className="event-details-content">
        <h1>{event.title}</h1>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> {event.location}</p>
      </div>
      <EventReviews eventId={event.id} />
    </div>
  );
};

export default EventDetails;
