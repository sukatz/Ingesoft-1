import './App.css';

import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Searching from './pages/Searching';
import Game from './pages/Game';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/searching" element={<Searching />} />
	<Route path="/game/:matchId" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
