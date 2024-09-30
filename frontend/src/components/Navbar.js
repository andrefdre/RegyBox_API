import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Usado para navegação
import axios from 'axios';
import Cookies from 'js-cookie'; // Import the js-cookie library
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Check if user is authenticated when the component mounts
    useEffect(() => {
        const checkAuth = async () => {
            const token = Cookies.get('authToken');
            if (token) {
                try {
                    // Replace with your actual API endpoint
                    const response = await axios.get('/api/auth/check', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (response.status === 200) {
                        setIsLoggedIn(true); // User is logged in
                    }
                } catch (error) {
                    console.error('Authentication check failed', error);
                    setIsLoggedIn(false);
                }
            }
        };

        checkAuth();
    }, []);

    const handleLogout = () => {
        Cookies.remove('authToken'); // Remove the cookie
        setIsLoggedIn(false); // Update local state
        navigate('/'); // Redirect to home
    };

    return (
        <header className="p-3 bg-dark text-white">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <Link to="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                        <img src={`${process.env.PUBLIC_URL}/images/logo.svg`} width="53" height="45" alt="Logo" />
                    </Link>
                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li><Link to="/" className="nav-link px-2 text-secondary">Home</Link></li>
                        <li><Link to="/FAQs" className="nav-link px-2 text-white">FAQs</Link></li>
                        <li><Link to="/About" className="nav-link px-2 text-white">About</Link></li>
                    </ul>
                    <div className="text-end">
                        {isLoggedIn ? (
                            <>
                                <span className="me-2">Welcome, User!</span>
                                <Link to="/dashboard" className="btn btn-warning me-2">Dashboard</Link>
                                <Link to="#" className="btn btn-warning me-2" onClick={handleLogout}>Logout</Link>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-warning me-2">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
