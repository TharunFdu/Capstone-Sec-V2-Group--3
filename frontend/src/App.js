import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Landing from './components/Landing';
import Home from './components/Home';
import EventManagement from './components/EventManagement';
import VenueManagement from './components/VenueManagement';

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));

    return (
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
        </>
        )}
        </Routes>
    </Router>
  );
};

export default App;
