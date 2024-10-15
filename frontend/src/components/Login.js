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
    const [isRoleSelection, setIsRoleSelection] = useState(false);
    const [loginData, setLoginData] = useState(null);
    const [role, setRole] = useState(''); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5001/api/auth/login', formData);
            if (!res.data.user.role) {
                setLoginData(res.data);
                setIsRoleSelection(true);
            } else {
            localStorage.setItem('token', res.data.token);  
            localStorage.setItem('user', JSON.stringify(res.data.user));  
            navigate('/home');  
            }
        } catch (err) {
            setErrorMessage('Invalid credentials, please try again.');
        }
    };

    const handleGoogleSuccess = async (response) => {
        const token = response.credential;
        try {
            const res = await axios.post('http://localhost:5001/api/auth/google', { token });
            if (!res.data.user.role) {
                setLoginData(res.data); 
                setIsRoleSelection(true); 
            } else {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/home');
            }
        } catch (err) {
            setErrorMessage('Google login failed, please try again.');
        }
    };

    const handleGoogleFailure = (error) => {
        setErrorMessage('Google sign-in failed, please try again.');
    };

    const handleRoleSubmit = async () => {
        if (!role) {
            setErrorMessage('Please select a role.');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5001/api/auth/set-role', {
                role,
                userId: loginData.user.id, 
            });
            localStorage.setItem('token', loginData.token);
            localStorage.setItem('user', JSON.stringify({ ...loginData.user, role: res.data.role }));
            navigate('/home');
        } catch (err) {
            setErrorMessage('Role assignment failed, please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                {!isRoleSelection ? (
                    <>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="email"
                                placeholder="Username"
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
                    </>
                ) : (
                    <div className="role-selection">
                        <h3>Select Your Role</h3>
                        <div className="role-options">
                            <button onClick={() => setRole('user')}>User</button>
                            <button onClick={() => setRole('admin')}>Admin</button>
                        </div>
                        <button onClick={handleRoleSubmit}>Submit</button>
                        {errorMessage && <p>{errorMessage}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
