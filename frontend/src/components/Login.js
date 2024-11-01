import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const Login = (props) => {
  //Still not implemented
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]); // For error messages
  const navigate = useNavigate();

  const { isLoggedIn, setIsLoggedIn} = props;

  useEffect(() => {
    if (isLoggedIn) navigate('/dashboard/view-booked-classes');
  },[]);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Create the submit method.

  const handleLogin = async (ev) => {
    ev.preventDefault();
    const email = ev.target.email.value;
    const password = ev.target.password.value;
    const formData = { email: email, password: password };
    try{
      const res = await axios.post('http://' + process.env.REACT_APP_BACK_END_IP + '/api/login', formData);
      const data = res.data;
      if (data.success === true) {
        setErrorMessages([]);
        setIsLoggedIn(true);
        setEmail(email);
        navigate('/dashboard/view-booked-classes');
        Cookies.set('access_token', data.access_token);
        Cookies.set('refresh_token', data.refresh_token);
        Cookies.set('regybox_token', data.regybox_token);
    }
    else {
      setErrorMessages([data.message]);
    }
    }
    catch (err) {
      if (err.response.data.data === undefined) {
        setErrorMessages(['An error occurred. Please try again later.']);
      }
      else {
        setErrorMessages(err.response.data.message);
      }
    } 
  };

  return (
    <div className="container body p-5">
      <main className="form-signin">
        {errorMessages.length > 0 && (
          <div className="alert alert-danger" role="alert">
            {errorMessages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
        )}
        <img className="mb-4" src={`${process.env.PUBLIC_URL}/images/logo.svg`} alt="Logo" width="72" height="57" />
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
        <form onSubmit={handleLogin}>
          <div className="form-floating">
            <input
              type="email"
              className="form-control"
              name="email"
              id="floatingInput"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              name="password"
              id="floatingPassword"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <div className="checkbox mb-3">
            <label>
              <input
                type="checkbox"
                value={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />{' '}
              Remember me
            </label>
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Sign in
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;
