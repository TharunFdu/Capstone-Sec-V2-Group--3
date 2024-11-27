import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        location: '',
    });

    const [successMessage, setSuccessMessage] = useState('');

    const { name, email, password, location } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/api/auth/register', { ...formData, role: 'user' });
            setSuccessMessage('You have successfully registered! You can now login.');
        } catch (err) {
            console.error(err.response.data.message);
        }
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit} className="signup-form">
                <h2 className="form-title">Join Astro Events</h2>
                <p className="form-subtitle">Sign up to attend space events</p>

                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    className="input-field"
                />
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className="input-field"
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="input-field"
                />
                <input
                    type="text"
                    name="location"
                    value={location}
                    onChange={handleChange}
                    placeholder="Location"
                    required
                    className="input-field"
                />

                <button type="submit" className="signup-button">Create Account</button>
                {successMessage && <p>{successMessage}</p>}
                <p className="signin-link">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
