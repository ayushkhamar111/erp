import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Branches from './Branches';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/branches" element={<Branches />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
