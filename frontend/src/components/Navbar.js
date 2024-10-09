import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [navbar, setNavbar] = useState(false);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const changeBackground = () => {
        if (window.scrollY >= 80) {
            setNavbar(true);
        } else {
            setNavbar(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', changeBackground);
        return () => {
            window.removeEventListener('scroll', changeBackground);
        };
    }, []);

    return (
        <nav className={`navbar navbar-expand-lg space-navbar ${navbar ? 'scrolled' : ''}`}>
            <div className="container-fluid">
                <span className="navbar-brand">Astro Event Hub</span>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarResponsive"
                    aria-controls="navbarResponsive"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav ml-auto">
                        {!user ? (
                            <>
                                <li className="nav-item">
                                    <Link to="/" className="btn glowing-button nav-link">About</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/login" className="btn glowing-button nav-link">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/signup" className="btn glowing-button nav-link">Signup</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                {user.role === 'admin' && (
                                    <>
                                        <li className="nav-item">
                                            <Link to="/events" className="btn glowing-button nav-link">Manage Events</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/venues" className="btn glowing-button nav-link">Manage Venues</Link>
                                        </li>
                                    </>
                                )}
                                {user.role === 'user' && (
                                    <>
                                        <li className="nav-item">
                                            <Link to="/book-event" className="btn glowing-button nav-link">Book Event</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/my-bookings" className="btn glowing-button nav-link">My Bookings</Link>
                                        </li>
                                    </>
                                )}

                                <li className="nav-item">
                                    <button className="btn glowing-button nav-link" onClick={handleSignOut}>Sign Out</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
