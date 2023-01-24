import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import OrderCreate from './components/OrderCreate';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DispenseMedicineCreate from './components/DispenseMedicineCreate';
import Home from './components/Hom';
import Orders from './components/Order';
import MedicineArrangementCreate from './components/MedicineArrangementCreate';

function App() {
  return (
    <Router>
      <Navbar />
      <div>
      <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/order" element={<OrderCreate />} />
      <Route path="/dispensemedicine" element={<DispenseMedicineCreate />} />
      <Route path="/medicinearrangement" element={<MedicineArrangementCreate />} />
      <Route path="/Orderslist" element={<Orders />} />

      </Routes>

      </div>
    </Router>
    )
}

export default App;
