// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
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

import Dashboard from './pages/admin/Dashboard';
import UserDetail from './pages/admin/UserDetail';
import UserManagement from './pages/admin/UserManagement';
import KYCManagement from './pages/admin/KYCManagement';
import KYCReview from './pages/admin/KYCReview';

import AdminAuctionDetail from './pages/admin/AdminAuctionDetail';
import AuctionManagement from './pages/admin/AuctionManagement';
import CreateAuction from './pages/admin/CreateAuction';

import ChatPage from './pages/chat/ChatPage';

import VNPayReturn from './pages/payment/VNPayReturn';
import MoMoReturn from './pages/payment/MoMoReturn';


import { Navigate } from 'react-router-dom';
function App() {
  const { user } = useAuthStore(); // 👉 lấy user từ Zustand
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

        {/* Auction Routes của USER */}
        <Route path="/auctions" element={<AuctionList />} />
        <Route path="/auctions/my-auctions" element={<MyAuctions />} />
        <Route path="/auctions/:id" element={<AuctionDetail />} />
        <Route path="/auctions/:id/room" element={<AuctionRoom />} />
        <Route path="/auctions/:id/deposit" element={<AuctionDeposit />} />

        // Protected Admin Route
        <Route
          path="/admin/dashboard"
          element={
            user?.role === 'ADMIN' ?
              <Dashboard /> :
              <Navigate to="/" replace />
          }
        />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/users/:id" element={<UserDetail />} />
        <Route path="/admin/kyc" element={<KYCManagement />} />
        <Route path="admin/kyc/:id" element={<KYCReview />} />

        {/* Auction Management Routes của ADMIN */}
        <Route path="/admin/auctions" element={<AuctionManagement />} />
        <Route path="/admin/auctions/create" element={<CreateAuction />} />
        <Route path="/admin/auctions/:id" element={<AdminAuctionDetail />} />

        <Route path="/chats" element={<ChatPage />} />
        <Route path="/chats/:id" element={<ChatPage />} />

        {/* Payment Routes */}
        <Route path="/payments/vnpay-return" element={<VNPayReturn />} />
        <Route path="/payments/momo-return" element={<MoMoReturn />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;