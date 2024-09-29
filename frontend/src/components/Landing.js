import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
const Landing = () => {
    return (
        <div className="landing-container">
            <h1 className="title">Welcome to Astro Event Hub!</h1>
            <p className="subtitle">
                Embark on an extraordinary journey through the stars and beyond. Join us for an immersive
                experience in space exploration and astronomy events.
            </p>
            <p className="description">
                Explore the wonders of the universe, attend live talks from experts, and participate in stargazing
                events that bring you closer to the cosmos. Astro Event Hub is your gateway to the stars!
            </p>
            <Link to="/signup">
                <button className="cta-button">Join Now</button>
            </Link>
        </div>
    );
};

export default Landing;
