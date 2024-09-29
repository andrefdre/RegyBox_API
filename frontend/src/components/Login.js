import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]); // For error messages

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Handle login logic here, e.g., send a POST request to your backend
    // Example:
    // fetch('/your-login-url', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ email, password, rememberMe }),
    // })
    // .then(response => {
    //   // Handle response
    // })
    // .catch(error => {
    //   setErrorMessages(['Invalid credentials']); // Add error handling
    // });
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
        <form onSubmit={handleSubmit}>
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
