import './App.css';

import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />  {/* Esta ruta hace que Home sea la página principal */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;