import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Branches from './Branches';
import Units from './Units';
import Navigation from './Navigation';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/units" element={<Units />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
