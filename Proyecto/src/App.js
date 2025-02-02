import './App.css';

import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Searching from './pages/Searching';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/searching" element={<Searching />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;