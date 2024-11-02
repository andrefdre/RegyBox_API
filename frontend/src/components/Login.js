import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const Login = (props) => {
  const [errorMessages, setErrorMessages] = useState([]);
  const navigate = useNavigate();

  const { isLoggedIn, setIsLoggedIn, setEmail } = props;

  useEffect(() => {
    if (isLoggedIn) navigate('/dashboard/view-booked-classes');
  }, [isLoggedIn, navigate]);

  const [login_email, setLoginEmail] = useState('');
  const [login_password, setLoginPassword] = useState('');

  const handleLogin = async (ev) => {
    ev.preventDefault();
    const email = ev.target.email.value;
    const password = ev.target.password.value;
    const formData = { email, password };

    try {
      const res = await axios.post(`http://${process.env.REACT_APP_BACK_END_IP}/api/login`, formData);
      const data = res.data;

      if (data.success) {
        setErrorMessages([]);
        setIsLoggedIn(true);
        setEmail(email);
        navigate('/dashboard/view-booked-classes');
        Cookies.set('access_token', data.access_token);
        Cookies.set('refresh_token', data.refresh_token);
        Cookies.set('regybox_token', data.regybox_token);
      } else {
        setErrorMessages([data.message]);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || ['An error occurred. Please try again later.'];
      setErrorMessages(errorMsg);
    }
  };

  return (
    <div className="container login-container">
      <main className="login-form-wrapper p-5 shadow-lg rounded-4">
        {errorMessages.length > 0 && (
          <div className="alert alert-danger" role="alert">
            {errorMessages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
        )}
        <img className="logo mb-4" src={`${process.env.PUBLIC_URL}/images/logo.svg`} alt="Logo" />
        <h2 className="mb-3 fw-bold">Welcome Back!</h2>
        <p className="text-muted mb-4">Please enter your credentials to sign in.</p>
        <form onSubmit={handleLogin}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control rounded-3"
              name="email"
              id="floatingInput"
              placeholder="name@example.com"
              value={login_email}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control rounded-3"
              name="password"
              id="floatingPassword"
              placeholder="Password"
              value={login_password}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <button className="w-100 btn btn-primary btn-lg rounded-3" type="submit">
            Sign in
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;
