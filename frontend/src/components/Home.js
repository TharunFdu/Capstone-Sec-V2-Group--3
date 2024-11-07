import React from 'react';
import Navbar from './Navbar';
import Recommendations from '../components/Recommendations';
import { bookEvent } from '../services/authService';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleBookEvent = async (eventId) => {
    try {
      await bookEvent(user.id, eventId); 
      console.log('Event booked successfully!');
    } catch (error) {
      console.error('Error booking event:', error);
    }
  };

  return (
    <div 
      style={{
        padding: '20px',
        backgroundImage: 'url("https://img.pica-ai.com/image/aigc/alg%26faceswap%26p%26a952cfd8a202554b8407fd1fbe0cb569_1024_1024.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        color: 'white',
        textAlign: 'center'
      }}
    >
      <Navbar />
      <h1 style={{ color: 'black' }}>Welcome {user.name}, you are logged in as {user.role}!</h1>
      
      {}
      {user.role === 'user' && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '8px' }}>
          <Recommendations userId={user.id} onBookEvent={handleBookEvent} /> {}
        </div>
      )}
    </div>
  );
};

export default Home;
