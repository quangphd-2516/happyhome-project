// src/pages/user/Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ProfileHeader from '../../components/user/ProfileHeader';
import ProfileInfo from '../../components/user/ProfileInfo';
import KYCStatus from '../../components/user/KYCStatus';
import { useAuthStore } from '../../store/authStore';
import { Wallet, Package, Gavel, Heart, Settings, Shield } from 'lucide-react';

export default function Profile() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();
    const [localUser, setLocalUser] = useState(user);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    if (!user) return null;

    const handleAvatarUpdate = (updatedUser) => {
        setLocalUser(updatedUser);
    };

    const quickActions = [
        {
            icon: Wallet,
            label: 'Ví của tôi',
            description: 'Quản lý số dư',
            color: 'bg-blue-500',
            onClick: () => navigate('/wallet')
        },
        {
            icon: Package,
            label: 'Bất động sản của tôi',
            description: 'Xem tin đăng của bạn',
            color: 'bg-green-500',
            onClick: () => navigate('/properties/my-properties')
        },
        {
            icon: Gavel,
            label: 'Phiên đấu giá của tôi',
            description: 'Các lượt đấu giá đang hoạt động',
            color: 'bg-purple-500',
            onClick: () => navigate('/auctions/my-auctions')
        },
        {
            icon: Heart,
            label: 'Yêu thích',
            description: 'Bất động sản đã lưu',
            color: 'bg-pink-500',
            onClick: () => navigate('/favorites')
        },
        {
            icon: Settings,
            label: 'Cài đặt',
            description: 'Cài đặt tài khoản',
            color: 'bg-gray-500',
            onClick: () => navigate('/settings')
        },
        {
            icon: Shield,
            label: 'Bảo mật',
            description: 'Đổi mật khẩu',
            color: 'bg-orange-500',
            onClick: () => navigate('/change-password')
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Profile Header with Avatar */}
                    <ProfileHeader user={localUser} onAvatarUpdate={handleAvatarUpdate} />

                    {/* KYC Status */}
                    <KYCStatus status={user.kycStatus} />

                    {/* Quick Actions Grid */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Thao tác nhanh</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {quickActions.map((action) => {
                                const Icon = action.icon;
                                return (
                                    <button
                                        key={action.label}
                                        onClick={action.onClick}
                                        className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-primary hover:shadow-md transition-all group"
                                    >
                                        <div className={`${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-gray-900">{action.label}</p>
                                            <p className="text-sm text-gray-500">{action.description}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Personal Information */}
                    <ProfileInfo user={localUser} />

                    {/* Account Statistics */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <Package className="w-8 h-8" />
                                <span className="text-3xl font-bold">0</span>
                            </div>
                            <p className="text-blue-100">Bất động sản đang hoạt động</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <Gavel className="w-8 h-8" />
                                <span className="text-3xl font-bold">0</span>
                            </div>
                            <p className="text-purple-100">Lượt đấu giá đang hoạt động</p>
                        </div>

                        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <Heart className="w-8 h-8" />
                                <span className="text-3xl font-bold">0</span>
                            </div>
                            <p className="text-pink-100">Mục đã lưu</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}