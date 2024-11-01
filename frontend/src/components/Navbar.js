import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axiosInstance from '../interceptors/axios';

const Navbar = (props) => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn, email } = props;

    const handleLogout = () => {
        const refreshToken = Cookies.get('refresh_token');

        if (refreshToken) {
            axiosInstance.post('http://' + process.env.REACT_APP_BACK_END_IP + '/api/blacklist', { refresh_token: refreshToken })
                .then(response => {
                    console.log('Token blacklisted successfully:', response);
                    Cookies.remove('access_token');
                    Cookies.remove('refresh_token');
                    setIsLoggedIn(false);
                    navigate('/');
                })
                .catch(error => {
                    console.error('Error blacklisting token:', error.response ? error.response.data : error);
                });
        } else {
            console.log('No refresh token found.');
        }
    };

    return (
        <header className="p-3 bg-dark text-white">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <Link to="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                        <img src={`${process.env.PUBLIC_URL}/images/logo.svg`} width="73" height="65" alt="Logo" />
                    </Link>
                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li><Link to="/" className="nav-link px-2 text-secondary">Home</Link></li>
                        <li><Link to="/FAQs" className="nav-link px-2 text-white">FAQs</Link></li>
                        <li><Link to="/About" className="nav-link px-2 text-white">About</Link></li>
                    </ul>
                    <div className="text-end d-flex flex-column align-items-center align-items-lg-end">
                        {isLoggedIn && (
                            <div className="mb-2 text-white text-center text-lg-start">
                                <span className="me-2">👋 Welcome,</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{email}</span>
                            </div>
                        )}
                        <div className="d-flex flex-column flex-sm-row align-items-center">
                            {isLoggedIn ? (
                                <>
                                    <Link to="/dashboard/view-booked-classes" className="btn btn-warning mb-2 mb-sm-0 me-sm-2 w-100 w-sm-auto">Dashboard</Link>
                                    <button className="btn btn-warning w-100 w-sm-auto" onClick={handleLogout}>Logout</button>
                                </>
                            ) : (
                                <Link to="/login" className="btn btn-warning w-100 w-sm-auto">Login</Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
