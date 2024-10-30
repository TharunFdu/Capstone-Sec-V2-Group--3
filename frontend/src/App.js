import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Landing from './components/Landing';
import Home from './components/Home';
import EventManagement from './components/EventManagement';
import VenueManagement from './components/VenueManagement';
import EventBooking from './components/EventBooking';
import UserBookings from './components/UserBookings';
import ChatRoom from './components/ChatRoom';
import ChatGroupsList from './components/ChatGroupsList';
import Profile from './components/Profile'; 
import { GoogleOAuthProvider } from '@react-oauth/google';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <Router>
        <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />

        {user && user.role === 'admin' && (
        <>
            <Route path="/events" element={<EventManagement isAdmin={true} />} />
            <Route path="/venues" element={<VenueManagement isAdmin={true} />} />
            <Route path="/profile" element={<Profile />} />  
        </>
        )}

{user && user.role === 'user' && (
        <>
            <Route path="/book-event" element={<EventBooking userId={user.id} />} />
            <Route path="/my-bookings" element={<UserBookings userId={user.id} />} />
            <Route path="/chat-groups" element={<ChatGroupsList userId={user.id} />} />
          <Route path="/chat/:groupId" element={<ChatRoom userId={user.id} />} />
          <Route path="/profile" element={<Profile />} />  
          
        </>
)}
        </Routes>
    </Router>
     </GoogleOAuthProvider>
  );
};

export default App;
