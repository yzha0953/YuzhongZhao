import React from 'react';
import '../theme/HomePage.css'; // Make sure this path is correct

const HomePage: React.FC = () => {
    const username = localStorage.getItem('username') || 'guest';

    const capitalize = (name: string) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    return (
        <div className="centered-container">
            <h1 className="welcome-text">Welcome to PixTag, {capitalize(username)}</h1>
        </div>
    );
};

export default HomePage;
