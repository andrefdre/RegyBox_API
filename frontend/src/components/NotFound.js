import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="not-found-container">
                <h1 className="not-found-heading">404</h1>
                <p className="not-found-message">Oops! The page you're looking for doesn't exist.</p>
                <Link to="/" className="not-found-link">Go back to Home</Link>
                <div className="not-found-image">
                    <img src={`${process.env.PUBLIC_URL}/images/page-not-found.png`} alt="Not Found" />
                </div>
        </div>
    );
};

export default NotFound;
