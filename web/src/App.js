import React from 'react';
import './App.css';
import Routes from './Routes/Routes.js';
import { BrowserRouter } from 'react-router-dom';

function App() {
    return (
      <BrowserRouter>
      <div>
      <Routes/>
      </div>
     </BrowserRouter>

    );
}


export default App;
