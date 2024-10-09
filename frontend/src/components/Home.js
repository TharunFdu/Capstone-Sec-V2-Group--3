import React from 'react';
import Navbar from './Navbar'; 

const Home = () => {
    const user = JSON.parse(localStorage.getItem('user'));  

    return (
        <div 
            style={{
                padding: '20px',
                backgroundImage: 'url("https://img.pica-ai.com/image/aigc/alg%26faceswap%26p%26a952cfd8a202554b8407fd1fbe0cb569_1024_1024.webp")', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                minHeight: '100vh', 
                color: 'white', 
                textAlign: 'center' 
            }}
        >
            <Navbar /> 
            <h1 style={{ color: 'black' }}>Welcome {user.name}, you are logged in as {user.role}!</h1>
        </div>
    );
};

export default Home;
