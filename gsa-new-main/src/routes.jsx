import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login/Login';
import SignUp from './Login/SignUp';
import ForgotPass from './Login/ForgotPass';
import ResetPass from './Login/ResetPass';
import Verify from './Login/Verify';
import TopBar from './Main/TopBar';
import { BiLoaderCircle } from 'react-icons/bi';
import Loader from './Login/Loader';
import Home from './Main/Home';
import Academy from './pages/Academy';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import Gallery from './pages/Gallery';
import Ground from './pages/Ground';
import ManagerDashboard from './Manager/ManagerDashboard';
import CryptoJS from 'crypto-js';

const AppRoutes = ({ setLoading }) => {
  // Check if 'role' exists in localStorage before attempting to decrypt
  const encryptedRole = localStorage.getItem('role');
  let role = '';
  
  if (encryptedRole) {
    // Decrypt the role only if it exists in localStorage
    role = CryptoJS.AES.decrypt(encryptedRole, import.meta.env.VITE_ENC_KEY).toString(CryptoJS.enc.Utf8);
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot" element={<ForgotPass />} />
      <Route path="/resetpass" element={<ResetPass />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/loading" element={<Loader />} />
      <Route path="*" element={<Navigate to="/login" />} />
      <Route path="/academy" element={<Academy />} />
      <Route path='/contactus' element={<ContactUs />} />
      <Route path='/aboutus' element={<AboutUs />} />
      <Route path='/gallery' element={<Gallery />} />
      <Route path='/playground' element={<Ground />} />
      
      {/* Use conditional rendering for Manager role */}
      {role === 'Manager' && <Route path="/manager" element={<ManagerDashboard />} />}
      {role !== 'Manager' && <Route path="/manager" element={<Navigate to="/login" />} />}
    </Routes>
  );
};

export default AppRoutes;
