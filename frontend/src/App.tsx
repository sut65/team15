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
import MedicineArrangement from './components/MedicineArrangement';
import MedicineLabelCreate from './components/MedicineLabelCreate';
import MedicineLabel from './components/MedicineLabel';
import MedicineReturnCreate from './components/MedicineReturn';
import Signin from './components/Sigin';
import AttendanceCreate from './components/AttendanceCreate';
import Attendances from './components/Attendance';
import MedicineReceiveCreate from './components/MedicineReceiveCreate';
import MedicineReceive from './components/MedicineReceive';
import MedicineReturnList from './components/MedicineReturnList'; 
import ClassifiesCreate from './components/ClassifiesCreate';
import Classifies from './components/Classifies';

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
      <Navbar />
      <div>
      <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/order" element={<OrderCreate />} />
      <Route path="/dispensemedicine" element={<DispenseMedicineCreate />} />
      <Route path="/dispensemedicines" element={<DispenseMedicines />} />
      <Route path="/medicinearrangement" element={<MedicineArrangementCreate />} />
      <Route path="/medicinearrangements" element={<MedicineArrangement />} />
      <Route path="/Orderslist" element={<Orders />} />
      <Route path="/attendance" element={<AttendanceCreate />} />
      <Route path="/attendanceslist" element={<Attendances />} />
      <Route path="/MedicineLable" element={<MedicineLabelCreate />} />
      <Route path="/MedicineLabelscreate" element={<MedicineLabel />} />
      <Route path="/MedicineReturn" element={<MedicineReturnCreate />} />
      <Route path="/MedicineReceive" element={<MedicineReceiveCreate />} />
      <Route path="/MedicineReceives" element={<MedicineReceive />} />
      <Route path="/MedicineReturn" element={<MedicineReturnCreate />} />
      <Route path="/MedicineReturnList" element={<MedicineReturnList />}/> 
      <Route path="/Classifies" element={<ClassifiesCreate />} />
      <Route path="/Classifies" element={<Classifies />} />
      

      {/* /<Route path="/MedicineReturnList" element={<MedicineReturnList />} /> */}


      </Routes>

      </div>
    </Router>
    )
}

export default App;
