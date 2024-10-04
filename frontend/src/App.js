import React from 'react';
import { useState , useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axiosInstance from './interceptors/axios';  // Importa a instância do Axios e a função de autenticação
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Cookies from 'js-cookie';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");


  useEffect(() => {
    async function fetchData() {
    const access_token = Cookies.get('access_token');
    if (access_token) {
    try{
        const response = await axiosInstance.get('http://127.0.0.1:8000/api/protected');
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
        {/* Adicione suas outras rotas aqui */}
        <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} name={email}/>} />
        <Route path="/dashboard/" element={<Dashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} name={email}/>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
