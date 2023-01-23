import React from 'react';
import logo from './logo.svg';
import './App.css';
import OrderCreate from './components/OrderCreate';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
      <Routes>
      <Route path="/" element={<OrderCreate />} />
      </Routes>

      </div>
    </Router>
    )
}

export default App;
