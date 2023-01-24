import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import OrderCreate from './components/OrderCreate';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DispenseMedicineCreate from './components/DispenseMedicineCreate';
import Home from './components/Hom';

function App() {
  return (
    <Router>
      <Navbar />
      <div>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/order" element={<OrderCreate />} />
      <Route path="/dispensemedicine" element={<DispenseMedicineCreate />} />
      </Routes>

      </div>
    </Router>
    )
}

export default App;
