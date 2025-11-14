// frontend/src/pages/admin/AuctionDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Gavel,
    Users,
    TrendingUp,
    Clock,
    Calendar,
    DollarSign,
    Trophy,
    Ban,
    AlertTriangle,
    MapPin,
    Home as HomeIcon,
    CheckCircle,
    XCircle,
    RefreshCw,
    Award,
    Shield
} from 'lucide-react';
import { adminService } from '../../services/adminService';

// Mock auction detail data
const mockAuctionDetail = {
    id: 'auction_001',
    propertyId: 'prop_001',
    property: {
        id: 'prop_001',
        title: 'Biệt thự hiện đại tại Quận 2',
        address: '123 Nguyễn Văn Hưởng, Thảo Điền, Quận 2, TP.HCM',
        thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        type: 'VILLA',
        area: 450,
        bedrooms: 5,
        bathrooms: 4,
        price: 15000000000
    },
    createdBy: 'admin_001',
    creator: {
        id: 'admin_001',
        fullName: 'Quản trị viên',
        email: 'admin@example.com'
    },
    title: 'Đấu giá biệt thự cao cấp Quận 2',
    description: 'Biệt thự cao cấp tại vị trí đắc địa, tiện nghi hiện đại cùng khu vườn tuyệt đẹp',
    startPrice: 15000000000,
    bidStep: 500000000,
    depositAmount: 1500000000,
    currentPrice: 16500000000,
    startTime: '2024-04-01T10:00:00Z',
    endTime: '2024-04-15T18:00:00Z',
    status: 'ONGOING',
    winnerId: null,
    bids: [
        {
            id: 'bid_001',
            userId: 'user_005',
            user: { fullName: 'Nguyen Van A', email: 'nguyenvana@example.com' },
            amount: 16500000000,
            isAutoBid: false,
            createdAt: '2024-04-05T14:30:00Z'
        },
        {
            id: 'bid_002',
            userId: 'user_006',
            user: { fullName: 'Tran Thi B', email: 'tranthib@example.com' },
            amount: 16000000000,
            isAutoBid: false,
            createdAt: '2024-04-04T11:20:00Z'
        },
        {
            id: 'bid_003',
            userId: 'user_005',
            user: { fullName: 'Nguyen Van A', email: 'nguyenvana@example.com' },
            amount: 15500000000,
            isAutoBid: true,
            maxAmount: 17000000000,
            createdAt: '2024-04-03T09:15:00Z'
        }
    ],
    participants: [
        {
            id: 'part_001',
            userId: 'user_005',
            user: { fullName: 'Nguyen Van A', email: 'nguyenvana@example.com' },
            depositPaid: true,
            depositTxId: 'tx_001',
            isRefunded: false,
            createdAt: '2024-03-28T10:00:00Z'
        },
        {
            id: 'part_002',
            userId: 'user_006',
            user: { fullName: 'Tran Thi B', email: 'tranthib@example.com' },
            depositPaid: true,
            depositTxId: 'tx_002',
            isRefunded: false,
            createdAt: '2024-03-29T14:00:00Z'
        }
    ],
    createdAt: '2024-03-20T09:00:00Z',
    updatedAt: '2024-04-05T14:30:00Z'
};

export default function AdminAuctionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    useEffect(() => {
        fetchAuctionDetail();
    }, [id]);

    const fetchAuctionDetail = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAuctionById(id);
            setAuction(data);
            setLoading(false);

            // Using mock data for now
            /** setTimeout(() => {
              setAuction(mockAuctionDetail);
              setLoading(false);
            }, 500); */
        } catch (error) {
            console.error('Error fetching auction detail:', error);
            //setAuction(mockAuctionDetail);
            setLoading(false);
        }
    };

    const handleCancelAuction = async () => {
        if (!cancelReason.trim()) {
            alert('Vui lòng nhập lý do hủy phiên');
            return;
        }

        try {
            await adminService.cancelAuction(id, cancelReason);
            alert('Hủy phiên đấu giá thành công!');
            fetchAuctionDetail();
            setShowCancelModal(false);
        } catch (error) {
            console.error('Error cancelling auction:', error);
            alert('Hủy phiên đấu giá thất bại');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusConfig = (status) => {
        const configs = {
            UPCOMING: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Calendar, label: 'Sắp diễn ra' },
            ONGOING: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock, label: 'Đang diễn ra' },
            COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Đã kết thúc' },
            CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', icon: Ban, label: 'Đã hủy' }
        };
        return configs[status] || configs.UPCOMING;
    };

    const calculateTimeRemaining = () => {
        if (!auction || auction.status !== 'ONGOING') return null;

        const end = new Date(auction.endTime);
        const now = new Date();
        const diff = end - now;

        if (diff <= 0) return 'Sắp kết thúc';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `Còn ${days}d ${hours}h ${minutes}m`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin" />
                <p className="text-gray-600">Đang tải thông tin phiên đấu giá...</p>
            </div>
        );
    }

    if (!auction) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy phiên đấu giá</h2>
                    <button
                        onClick={() => navigate('/admin/auctions')}
                        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Quay lại danh sách
                    </button>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(auction.status);
    const StatusIcon = statusConfig.icon;
    const currentBid = auction.bids?.[0];
    const totalBids = auction.bids?.length || 0;
    const totalParticipants = auction.participants?.length || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate('/admin/auctions')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Quay lại danh sách</span>
                    </button>

                    {auction.status !== 'COMPLETED' && auction.status !== 'CANCELLED' && (
                        <button
                            onClick={() => setShowCancelModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                        >
                            <Ban className="w-5 h-5" />
                            Hủy phiên đấu giá
                        </button>
                    )}
                </div>

                {/* Title & Status */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {auction.title}
                            </h1>
                            <p className="text-gray-600">{auction.description}</p>
                        </div>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusConfig.label}
                        </span>
                    </div>

                    {auction.status === 'ONGOING' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <Clock className="w-6 h-6 text-blue-600" />
                                <div>
                                    <p className="font-semibold text-blue-900">Phiên đang diễn ra</p>
                                    <p className="text-sm text-blue-700">{calculateTimeRemaining()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Property & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Property Info */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <img
                                src={auction.property.thumbnail}
                                alt={auction.property.title}
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                            {auction.property.title}
                                        </h2>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>{auction.property.address}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                    <div>
                                        <p className="text-sm text-gray-600">Loại hình</p>
                                        <p className="font-semibold text-gray-900">{auction.property.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Diện tích</p>
                                        <p className="font-semibold text-gray-900">{auction.property.area}m²</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Giá bán công khai</p>
                                        <p className="font-semibold text-green-600">
                                            {formatCurrency(auction.property.price)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Auction Details */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Thông số phiên đấu giá</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Giá khởi điểm</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {formatCurrency(auction.startPrice)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Giá hiện tại</p>
                                    <p className="text-lg font-bold text-green-600">
                                        {formatCurrency(auction.currentPrice)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Mức tăng</p>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                        <p className="text-lg font-bold text-green-600">
                                            {formatCurrency(auction.currentPrice - auction.startPrice)}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Bước giá</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {formatCurrency(auction.bidStep)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Tiền đặt cọc</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {formatCurrency(auction.depositAmount)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Tỷ lệ đặt cọc</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {((auction.depositAmount / auction.startPrice) * 100).toFixed(1)}%
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Thời gian bắt đầu</p>
                                    <p className="font-semibold text-gray-900">{formatDate(auction.startTime)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Thời gian kết thúc</p>
                                    <p className="font-semibold text-gray-900">{formatDate(auction.endTime)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Bid History */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Lịch sử trả giá ({totalBids})</h3>
                                {currentBid && (
                                    <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                        <Trophy className="w-4 h-4" />
                                        Đang dẫn đầu
                                    </span>
                                )}
                            </div>

                            {totalBids === 0 ? (
                                <div className="text-center py-12">
                                    <Gavel className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-600">Chưa có lượt trả giá</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {auction.bids.map((bid, index) => (
                                        <div
                                            key={bid.id}
                                            className={`p-4 rounded-xl border-2 ${index === 0
                                                ? 'bg-green-50 border-green-200'
                                                : 'bg-gray-50 border-gray-200'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${index === 0 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'
                                                        }`}>
                                                        #{index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{bid.user.fullName}</p>
                                                        <p className="text-sm text-gray-600">{bid.user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {formatCurrency(bid.amount)}
                                                    </p>
                                                    <p className="text-xs text-gray-600">{formatDate(bid.createdAt)}</p>
                                                    {bid.isAutoBid && (
                                                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                            Tự động trả giá
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Stats & Participants */}
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Thống kê</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Gavel className="w-6 h-6 text-blue-600" />
                                        <span className="font-medium text-gray-900">Tổng lượt trả giá</span>
                                    </div>
                                    <span className="text-2xl font-bold text-blue-600">{totalBids}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-6 h-6 text-purple-600" />
                                        <span className="font-medium text-gray-900">Người tham gia</span>
                                    </div>
                                    <span className="text-2xl font-bold text-purple-600">{totalParticipants}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-6 h-6 text-green-600" />
                                        <span className="font-medium text-gray-900">Đã nộp đặt cọc</span>
                                    </div>
                                    <span className="text-2xl font-bold text-green-600">
                                        {auction.participants?.filter(p => p.depositPaid).length || 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Winner */}
                        {auction.status === 'COMPLETED' && auction.winnerId && (
                            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-6 text-white">
                                <div className="flex items-center gap-3 mb-4">
                                    <Award className="w-8 h-8" />
                                    <h3 className="text-xl font-bold">Người thắng cuộc</h3>
                                </div>
                                <div className="bg-white/20 rounded-xl p-4">
                                    <p className="font-semibold mb-1">{currentBid?.user.fullName}</p>
                                    <p className="text-sm mb-2">{currentBid?.user.email}</p>
                                    <p className="text-2xl font-bold">{formatCurrency(auction.currentPrice)}</p>
                                </div>
                            </div>
                        )}

                        {/* Participants List */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Danh sách người tham gia</h3>
                            {totalParticipants === 0 ? (
                                <p className="text-gray-600 text-center py-4">Chưa có người tham gia</p>
                            ) : (
                                <div className="space-y-3">
                                    {auction.participants.map((participant) => (
                                        <div key={participant.id} className="p-3 bg-gray-50 rounded-xl">
                                            <p className="font-semibold text-gray-900">{participant.user?.fullName || participant.userId}</p>
                                            <p className="text-sm text-gray-600">{participant.user?.email || ''}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                {participant.depositPaid ? (
                                                    <span className="flex items-center gap-1 text-xs text-green-600">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Đã nộp cọc
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-xs text-yellow-600">
                                                        <Clock className="w-3 h-3" />
                                                        Chưa nộp cọc
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Ban className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Hủy phiên đấu giá</h3>
                        </div>

                        <p className="text-gray-600 mb-4">
                            Vui lòng nhập lý do hủy phiên. Tất cả người tham gia sẽ nhận được thông báo.
                        </p>

                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Nhập lý do hủy phiên..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 resize-none"
                            rows="4"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                            >
                                Giữ phiên
                            </button>
                            <button
                                onClick={handleCancelAuction}
                                disabled={!cancelReason.trim()}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                Xác nhận hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}