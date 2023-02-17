import React, { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import OrderCreate from './components/OrderCreate';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DispenseMedicineCreate from './components/DispenseMedicineCreate';
import DispenseMedicines from './components/DispenseMedicine';
import DispenseMedicineUpdate from './components/DispenseMedicineUpdate';
import Home from './components/Hom';
import Orders from './components/Order';
import MedicineArrangementCreate from './components/MedicineArrangementCreate';
import MedicineArrangement from './components/MedicineArrangement';
import MedicineArrangementUpdate from './components/MedicineArrangementUpdate';
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
import Prescription from './components/Prescription';
import PrescriptionCreate from './components/PrescriptionCreate';
import MedicineDisbursementCreate from './components/MedicineDisbursementCreate';
import MedicineDisbursement from './components/MedicineDisbursement';
import OrderUpdate from './components/OrderUpdate';
import BillCreate from './components/BillCreate';
import Bill from './components/Bill';
import MedicineLabelUpdate from './components/medicineLabelUpdate';
import MedicineReturnUpdate from './components/MedicineReturnUpdate';
import DiscardmedicineCreate from './components/DiscardMedicineCreate';
import Discardmedicine from './components/Discardmedicine';
import DiscardmedicineUpdate from './components/DiscardmedicineUpdate';

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
          <Route path="/orderUpdate/:id" element={<OrderUpdate />} />
          <Route path="/dispensemedicine" element={<DispenseMedicineCreate />} />
          <Route path="/dispensemedicines" element={<DispenseMedicines />} />
          <Route path="/DispenseMedicineUpdate/:id" element={<DispenseMedicineUpdate />} />
          <Route path="/medicinearrangement" element={<MedicineArrangementCreate />} />
          <Route path="/medicinearrangements" element={<MedicineArrangement />} />
          <Route path="/MedicineArrangementUpdate/:id" element={<MedicineArrangementUpdate />} />
          <Route path="/Orderslist" element={<Orders />} />
          <Route path="/attendance" element={<AttendanceCreate />} />
          <Route path="/attendanceslist" element={<Attendances />} />
          <Route path="/MedicineLable" element={<MedicineLabelCreate />} />
          <Route path="/MedicineLabelscreate" element={<MedicineLabel />} />
          <Route path="/MedicineReturn" element={<MedicineReturnCreate />} />
          <Route path="/medicineReceives" element={<MedicineReceiveCreate />} />
          <Route path="/medicineReceive" element={<MedicineReceive />} />
          <Route path="/medicineDisbursements" element={<MedicineDisbursementCreate />} />
          <Route path="/medicineDisbursement" element={<MedicineDisbursement />} />
          <Route path="/MedicineReturn" element={<MedicineReturnCreate />} />
          <Route path="/MedicineReturnList" element={<MedicineReturnList />} />
          <Route path="/ClassifyDrugs" element={<ClassifiesCreate />} />
          <Route path="/ClassifyDrug" element={<Classifies />} />
          <Route path="/Prescription" element={<PrescriptionCreate />} />
          <Route path="/Prescriptions" element={<Prescription />} />
          <Route path="/Bill" element={<BillCreate />} />
          <Route path="/Bills" element={<Bill />} />
          <Route path="/MedicineLabelUpdate/:id" element={<MedicineLabelUpdate />} />
          <Route path="/MedicineReturnUpdate/:id" element={<MedicineReturnUpdate />} />
          <Route path="/Discardmedicine" element={<DiscardmedicineCreate />} />
          <Route path="/Discardmedicinelist" element={<Discardmedicine />} />
          <Route path="/Discardmedicineupdate/:id" element={<DiscardmedicineUpdate />} />

          {/* /<Route path="/MedicineReturnList" element={<MedicineReturnList />} /> */}


        </Routes>

      </div>
    </Router>
  )
}

export default App;
