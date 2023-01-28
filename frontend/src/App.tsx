import React, {useEffect} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import OrderCreate from './components/OrderCreate';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DispenseMedicineCreate from './components/DispenseMedicineCreate';
import DispenseMedicines from './components/DispenseMedicine';
import Home from './components/Hom';
import Orders from './components/Order';
import MedicineArrangementCreate from './components/MedicineArrangementCreate';
import Signin from './components/Sigin';

function App() {
  const [token, setToken] = React.useState<String>("");
  useEffect(() => {
    const getToken = localStorage.getItem("token");
    if (getToken) {
      setToken(getToken);
    }
  }, []);
  console.log("Token", token)
  if (!token) {
    return <Signin />
    }

  return (
    <Router>
      {/* <Route path="/login" element={<Signin />} /> */}
      <Navbar />
      <div>
      <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/order" element={<OrderCreate />} />
      <Route path="/dispensemedicine" element={<DispenseMedicineCreate />} />
      <Route path="/dispensemedicines" element={<DispenseMedicines />} />
      <Route path="/medicinearrangement" element={<MedicineArrangementCreate />} />
      <Route path="/Orderslist" element={<Orders />} />

      </Routes>

      </div>
    </Router>
    )
}

export default App;
