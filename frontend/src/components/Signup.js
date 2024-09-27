
import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    const { name, email, password, role } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            
            const res = await axios.post('http://localhost:5001/api/auth/register', formData);
            console.log('Registered User:', res.data);  
        } catch (err) {
            console.error(err.response.data.message); 
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <input type="text" name="name" value={name} onChange={handleChange} placeholder="Name" required />
            <input type="email" name="email" value={email} onChange={handleChange} placeholder="Email" required />
            <input type="password" name="password" value={password} onChange={handleChange} placeholder="Password" required />
            <select name="role" value={role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
