import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';

function App() {
  return (
    <div className="background">
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Adicione suas outras rotas aqui */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
    </div>
  );
}

export default App;
