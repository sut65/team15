import React from 'react';
import logo from './logo.svg';
import './App.css';
import OrderCreate from './components/OrderCreate';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Orders from './components/Order';
function App() {
  return (
    <Router>
      <div>
      <Routes>
      <Route path="/" element={<OrderCreate />} />
      <Route path="/Orderslist" element={<Orders />} />
      </Routes>

      </div>
    </Router>
    )
}

export default App;
