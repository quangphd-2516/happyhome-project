// frontend/src/pages/admin/KYCReview.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Calendar,
    MapPin,
    CreditCard,
    FileText,
    AlertTriangle,
    Save,
    Loader
} from 'lucide-react';
import KYCDocuments from '../../components/admin/KYCDocuments';
import { adminService } from '../../services/adminService';

// Mock data for development
const mockKYCDetail = {
    id: 'kyc_001',
    userId: 'user_001',
    user: {
        id: 'user_001',
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0123456789'
    },
    idCardNumber: '001234567890',
    idCardFront: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
    idCardBack: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
    selfieWithId: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
    fullName: 'Nguyễn Văn A',
    dateOfBirth: '1990-05-15T00:00:00Z',
    address: '123 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    status: 'PENDING',
    rejectionReason: null,
    verifiedBy: null,
    verifiedAt: null,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
};

const KYCReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [kycData, setKycData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchKYCDetail();
    }, [id]);

    const fetchKYCDetail = async () => {
        setLoading(true);
        try {
            const data = await adminService.getKYCById(id);
            setKycData(data);
            setLoading(false);

            // Using mock data for now
            /** setTimeout(() => {
              setKycData(mockKYCDetail);
              setLoading(false);
            }, 500); */
        } catch (error) {
            console.error('Error fetching KYC detail:', error);
            // Fallback to mock data
            setKycData(mockKYCDetail);
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!window.confirm('Bạn có chắc muốn phê duyệt hồ sơ KYC này?')) return;

        setProcessing(true);
        try {
            await adminService.approveKYC(id);
            alert('Phê duyệt KYC thành công!');
            navigate('/admin/kyc');

            // Using mock for now
            /** setTimeout(() => {
              alert('KYC approved successfully!');
              navigate('/admin/kyc');
            }, 500); */
        } catch (error) {
            alert('Phê duyệt KYC thất bại');
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert('Vui lòng nhập lý do từ chối');
            return;
        }

        setProcessing(true);
        try {
            await adminService.rejectKYC(id, rejectionReason);
            alert('Từ chối KYC thành công!');
            navigate('/admin/kyc');

            // Using mock for now
            /** setTimeout(() => {
              alert('KYC rejected successfully!');
              navigate('/admin/kyc');
            }, 500); */
        } catch (error) {
            alert('Từ chối KYC thất bại');
            console.error(error);
        } finally {
            setProcessing(false);
            setShowRejectModal(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            APPROVED: 'bg-green-100 text-green-800 border-green-200',
            REJECTED: 'bg-red-100 text-red-800 border-red-200'
        };
        const icons = {
            PENDING: Clock,
            APPROVED: CheckCircle,
            REJECTED: XCircle
        };
        const textMap = {
            PENDING: 'Đang chờ duyệt',
            APPROVED: 'Đã phê duyệt',
            REJECTED: 'Bị từ chối'
        };
        const Icon = icons[status];

        return (
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${styles[status]}`}>
                <Icon className="w-4 h-4" />
                {textMap[status]}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải chi tiết hồ sơ KYC...</p>
                </div>
            </div>
        );
    }

    if (!kycData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy hồ sơ KYC</h2>
                    <p className="text-gray-600 mb-6">Không thể tìm thấy thông tin hồ sơ bạn yêu cầu.</p>
                    <button
                        onClick={() => navigate('/admin/kyc')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Quay lại danh sách KYC
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/admin/kyc')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Quay lại danh sách KYC</span>
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Chi tiết duyệt KYC</h1>
                            <p className="text-gray-600">Xem và xác minh thông tin định danh người dùng</p>
                        </div>
                        {getStatusBadge(kycData.status)}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - User Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* User Information Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {kycData.fullName?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {kycData.user?.fullName}
                                    </h3>
                                    <p className="text-sm text-gray-600">{kycData.user?.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">Họ và tên</p>
                                        <p className="text-base font-semibold text-gray-900">{kycData.fullName}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">Ngày sinh</p>
                                        <p className="text-base font-semibold text-gray-900">
                                            {new Date(kycData.dateOfBirth).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">Số CMND/CCCD</p>
                                        <p className="text-base font-semibold text-gray-900">{kycData.idCardNumber}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">Địa chỉ</p>
                                        <p className="text-base text-gray-900">{kycData.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submission Info Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin gửi duyệt</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ngày gửi:</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(kycData.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Cập nhật lần cuối:</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(kycData.updatedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                {kycData.verifiedBy && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Người duyệt:</span>
                                        <span className="font-medium text-gray-900">{kycData.verifiedBy}</span>
                                    </div>
                                )}
                                {kycData.verifiedAt && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Thời gian duyệt:</span>
                                        <span className="font-medium text-gray-900">
                                            {new Date(kycData.verifiedAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Rejection Reason (if rejected) */}
                        {kycData.status === 'REJECTED' && kycData.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-red-900 mb-2">Lý do từ chối</h3>
                                        <p className="text-sm text-red-800">{kycData.rejectionReason}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Documents */}
                    <div className="lg:col-span-2">
                        <KYCDocuments documents={kycData} />

                        {/* Action Buttons */}
                        {kycData.status === 'PENDING' && (
                            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tài liệu xác thực</h3>
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleApprove}
                                        disabled={processing}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                                    >
                                        {processing ? (
                                            <Loader className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <CheckCircle className="w-5 h-5" />
                                        )}
                                        Phê duyệt KYC
                                    </button>
                                    <button
                                        onClick={() => setShowRejectModal(true)}
                                        disabled={processing}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Từ chối KYC
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Từ chối KYC</h3>
                        </div>

                        <p className="text-gray-600 mb-4">
                            Vui lòng ghi rõ lý do từ chối hồ sơ KYC này.
                        </p>

                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Nhập lý do từ chối..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 resize-none"
                            rows="4"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                disabled={processing}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={processing || !rejectionReason.trim()}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {processing ? (
                                    <Loader className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                Xác nhận từ chối
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KYCReview;