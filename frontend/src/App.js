import React from 'react';
import { useState , useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axiosInstance from './interceptors/axios';  // Importa a instância do Axios e a função de autenticação
import Cookies from 'js-cookie';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import About from './components/About';
import FAQPage from './components/Faqs';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");


  useEffect(() => {
    async function fetchData() {
    const access_token = Cookies.get('access_token');
    if (access_token) {
      const requestData = { regybox_token: Cookies.get('regybox_token') };
      try{
          const response = await axiosInstance.get('http://5.249.84.57:8000/api/protected' , { params: requestData });
          if (response.status === 200) {
            setIsLoggedIn(true);
            setEmail(response.data.email);
          }
      }
      catch (error) {
          error = error.response;
      }
    }
  }
  fetchData();
}
  , []);

  return (
    <div className="background">
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} name={email}/>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} name={email} />} />
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} name={email}/>} />
        <Route path="/dashboard/*" element={<Dashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} name={email}/>} />
        <Route path="/About" element={<About />} />
        <Route path="/FAQs" element={<FAQPage />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
