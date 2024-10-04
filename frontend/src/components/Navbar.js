import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Usado para navegação
import Cookies from 'js-cookie';
import axiosInstance from '../interceptors/axios';  // Importa a instância do Axios e a função de autenticação

const Navbar = (props) => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn, email } = props;
    const handleLogout = () => {
        const refreshToken = Cookies.get('refresh_token'); // Or however you're storing the refresh token

    if (refreshToken) {
        axiosInstance.post('http://127.0.0.1:8000/api/blacklist', { refresh_token: refreshToken })
            .then(response => {
                console.log('Token blacklisted successfully:', response);
                // Optionally clear tokens from storage and redirect to login
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');
                // Redirect or update state
                setIsLoggedIn(false);
                navigate('/');
            })
            .catch(error => {
                console.error('Error blacklisting token:', error.response ? error.response.data : error);
            });
    } else {
        console.log('No refresh token found.');
        // Handle case where refresh token is not available
    }
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
                                <Link to="/dashboard" className="btn btn-warning me-2">Dashboard</Link>
                                <button className="btn btn-warning me-2" onClick={handleLogout}>Logout</button>
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
