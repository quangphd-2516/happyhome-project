// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/auth/Register';
import VerifyOTP from './pages/auth/VerifyOTP';
import Login from './pages/auth/Login';
import Profile from './pages/user/Profile';
import KYC from './pages/user/KYC';
import PropertyList from './pages/property/PropertyList';
import PropertyDetail from './pages/property/PropertyDetail';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/kyc' element={<KYC />} />
        <Route path="/properties" element={<PropertyList />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;