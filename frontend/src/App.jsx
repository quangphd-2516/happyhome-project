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
import MyProperties from './pages/property/MyProperties';
import CreateProperty from './pages/property/CreateProperty';
import EditProperty from './pages/property/EditProperty';
import Favorites from './pages/property/Favorites';

import AuctionList from './pages/auction/AuctionList';
import AuctionRoom from './pages/auction/AuctionRoom';
import MyAuctions from './pages/auction/MyAuctions';
import AuctionDeposit from './pages/auction/AuctionDeposit';
import AuctionDetail from './pages/auction/AuctionDetail';
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



        {/* Property Routes */}
        <Route path="/properties" element={<PropertyList />} />
        <Route path="/properties/create" element={<CreateProperty />} />
        <Route path="/properties/:id/edit" element={<EditProperty />} />
        <Route path="/properties/my-properties" element={<MyProperties />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/favorites" element={<Favorites />} />

        {/* Auction Routes */}
        <Route path="/auctions" element={<AuctionList />} />
        <Route path="/auctions/my-auctions" element={<MyAuctions />} />
        <Route path="/auctions/:id" element={<AuctionRoom />} />
        <Route path="/auctions/:id/deposit" element={<AuctionDeposit />} />
        <Route path="/auctions/:id/detail" element={<AuctionDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;