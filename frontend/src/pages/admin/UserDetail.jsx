// src/pages/admin/UserDetail.jsx
import { useState, useEffect } from 'react';
import {
    X, Mail, Phone, MapPin, Calendar, Shield,
    CheckCircle, XCircle, Ban, Eye, Home, Gavel, Heart, Loader2
} from 'lucide-react';
import UserStatusBadge from '../../components/admin/UserStatusBadge';
import { adminService } from '../../services/adminService';

const USE_MOCK_DATA = true; // Set false để dùng API thật

export default function UserDetail({ user, onClose, onBlockUser, onUnblockUser }) {
    const [userDetail, setUserDetail] = useState(user);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Nếu cần fetch thêm chi tiết từ API
        if (!USE_MOCK_DATA && user?.id) {
            fetchUserDetail(user.id);
        } else {
            setUserDetail(user);
        }
    }, [user]);

    const fetchUserDetail = async (userId) => {
        setLoading(true);
        try {
            const response = await adminService.getUserById(userId);
            setUserDetail(response);
        } catch (error) {
            console.error('Error fetching user detail:', error);
            // Fallback to passed user data
            setUserDetail(user);
        } finally {
            setLoading(false);
        }
    };

    if (!userDetail) return null;

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(new Date(date));
    };

    const stats = [
        { icon: Home, label: 'Bất động sản', value: userDetail._count?.properties || 0, color: 'text-blue-600' },
        { icon: Gavel, label: 'Phiên đấu giá', value: userDetail._count?.auctions || 0, color: 'text-purple-600' },
        { icon: Heart, label: 'Yêu thích', value: userDetail._count?.favorites || 0, color: 'text-red-600' },
        { icon: Eye, label: 'Đánh giá', value: userDetail._count?.reviews || 0, color: 'text-green-600' },
    ];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex items-center justify-between z-10">
                        <h2 className="text-2xl font-bold text-white">Chi tiết người dùng</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="p-20 text-center">
                            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">Đang tải thông tin người dùng...</p>
                        </div>
                    ) : (
                        <>
                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Profile Section */}
                                <div className="flex items-start gap-6">
                                    <img
                                        src={userDetail.avatar || 'https://i.pravatar.cc/150'}
                                        alt={userDetail.fullName}
                                        className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-2xl font-bold text-gray-900">{userDetail.fullName}</h3>
                                            <UserStatusBadge type="role" value={userDetail.role} />
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <UserStatusBadge type="kyc" value={userDetail.kycStatus} />
                                            <UserStatusBadge
                                                type="status"
                                                value={userDetail.isBlocked ? 'blocked' : 'active'}
                                            />
                                            {userDetail.isVerified && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Email đã xác thực
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-500">
                                            <span className="font-semibold">Mã người dùng:</span> {userDetail.id}
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h4 className="text-lg font-bold text-gray-900 mb-4">Thông tin liên hệ</h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="text-sm font-semibold text-gray-900">{userDetail.email}</p>
                                            </div>
                                        </div>

                                        {userDetail.phone && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <Phone className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Số điện thoại</p>
                                                    <p className="text-sm font-semibold text-gray-900">{userDetail.phone}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Ngày tham gia</p>
                                                <p className="text-sm font-semibold text-gray-900">{formatDate(userDetail.createdAt)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                                <Shield className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Cập nhật lần cuối</p>
                                                <p className="text-sm font-semibold text-gray-900">{formatDate(userDetail.updatedAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Statistics */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-4">Thống kê hoạt động</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {stats.map((stat, index) => (
                                            <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center hover:border-purple-500 transition-colors">
                                                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                                <p className="text-xs text-gray-600">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* KYC Information */}
                                {userDetail.kycData && (
                                    <div className="bg-blue-50 rounded-xl p-6">
                                        <h4 className="text-lg font-bold text-gray-900 mb-4">Thông tin KYC</h4>
                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600">Số CMND/CCCD</p>
                                                <p className="font-semibold text-gray-900">{userDetail.kycData.idCardNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Ngày sinh</p>
                                                <p className="font-semibold text-gray-900">
                                                    {new Date(userDetail.kycData.dateOfBirth).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="text-gray-600">Địa chỉ</p>
                                                <p className="font-semibold text-gray-900">{userDetail.kycData.address}</p>
                                            </div>
                                            {userDetail.kycData.status === 'APPROVED' && userDetail.kycData.verifiedAt && (
                                                <div className="md:col-span-2">
                                                    <p className="text-gray-600">Thời gian phê duyệt</p>
                                                    <p className="font-semibold text-gray-900">
                                                        {formatDate(userDetail.kycData.verifiedAt)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Wallet Information */}
                                {userDetail.wallet && (
                                    <div className="bg-green-50 rounded-xl p-6">
                                        <h4 className="text-lg font-bold text-gray-900 mb-4">Ví điện tử</h4>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">Số dư hiện tại</p>
                                                <p className="text-3xl font-bold text-green-600">
                                                    {parseFloat(userDetail.wallet.balance).toLocaleString('vi-VN')} VND
                                                </p>
                                            </div>
                                            <div className="text-right text-sm text-gray-600">
                                                <p>Tổng giao dịch</p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {userDetail.wallet._count?.transactions || 0}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    {userDetail.isBlocked ? (
                                        <button
                                            onClick={() => onUnblockUser(userDetail.id)}
                                            className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Bỏ chặn người dùng
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onBlockUser(userDetail.id)}
                                            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Ban className="w-5 h-5" />
                                            Chặn người dùng
                                        </button>
                                    )}

                                    <button
                                        onClick={onClose}
                                        className="px-8 py-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold transition-colors"
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}