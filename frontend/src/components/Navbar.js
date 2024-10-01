import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';  

const Navbar = () => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg space-navbar">
            <span className="navbar-brand">Astro Event Hub</span>  
            <div className="ml-auto">
                <button className="btn glowing-button" onClick={handleSignOut}>Sign Out</button>  
            </div>
        </nav>
    );
};

export default Navbar;
