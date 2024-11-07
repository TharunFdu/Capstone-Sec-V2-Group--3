import React, { useEffect, useState } from 'react';
import { getRecommendations } from '../services/authService';

const Recommendations = ({ userId, onBookEvent }) => { 
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const events = await getRecommendations(userId); 
        setRecommendedEvents(events);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError('Could not load recommendations. Please try again later.');
      }
    };
    
    fetchRecommendations();
  }, [userId]); 

  const handleBookEvent = async (eventId) => {
    try {
      await onBookEvent(eventId); 
      setRecommendedEvents(recommendedEvents.filter(event => event.id !== eventId)); 
    } catch (error) {
      console.error('Error booking event:', error);
    }
  };

  return (
    <div style={{ marginTop: '20px', padding: '10px', borderRadius: '8px', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      <h2 style={{ color: '#f8f8f8' }}>Recommended Events</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {recommendedEvents.length > 0 ? (
          recommendedEvents.map((event) => (
            <li key={event.id} style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', backgroundColor: '#333' }}>
              <h3 style={{ color: '#00bfff' }}>{event.title}</h3>
              <p style={{ color: '#f8f8f8' }}>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p style={{ color: '#f8f8f8' }}>Time: {event.time}</p>
              <p style={{ color: '#f8f8f8' }}>Location: {event.venue.location}</p>
              <button onClick={() => handleBookEvent(event.id)} style={{ marginTop: '10px' }}>Book Now</button>
            </li>
          ))
        ) : (
          <p style={{ color: '#f8f8f8' }}>No recommended events at this time.</p>
        )}
      </ul>
    </div>
  );
};

export default Recommendations;
