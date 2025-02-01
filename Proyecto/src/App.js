import logo from './logo.svg';
import './App.css';

import React from 'react';
import {Prueba} from './components/primerComponente'; // Ajusta la ruta según corresponda

function App() {
  return (
    <div className="App">
      
      
      
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Prueba/>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          xdddd
        </a>
        
      </header>
    </div>


  );
}

export default App;