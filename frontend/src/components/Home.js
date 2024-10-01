import React from 'react';
import Navbar from './Navbar'; 

const Home = () => {
    const user = JSON.parse(localStorage.getItem('user'));  

    return (
            <div style={{ padding: '20px', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
            <Navbar /> 
            <h1>Welcome {user.name}, you are logged in as {user.role}!</h1>
        </div>
        
    );
};

export default Home;