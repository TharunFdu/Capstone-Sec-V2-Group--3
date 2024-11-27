import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { email, password } = formData;

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);  
            localStorage.setItem('user', JSON.stringify(res.data.user));  
            navigate('/home');  
        } catch (err) {
            setErrorMessage('Invalid credentials, please try again.');
        }
    };

    const handleGoogleSuccess = async (response) => {
        const token = response.credential;
        try {
            const res = await axios.post('http://localhost:5001/api/auth/google', { token });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/home');
        } catch (err) {
            setErrorMessage('Google login failed, please try again.');
        }
    };

    const handleGoogleFailure = () => {
        setErrorMessage('Google sign-in failed, please try again.');
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Login Now</button>
                    {errorMessage && <p>{errorMessage}</p>}
                </form>

                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                />
            </div>
        </div>
    );
};

export default Login;
