// src/pages/auction/AuctionDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Gavel, Users, TrendingUp, MapPin, Home, Maximize2,
    Bed, Bath, Calendar, Eye, Share2, Heart, ArrowLeft,
    DollarSign, Clock, CheckCircle, AlertCircle, Trophy, Shield
} from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import CountdownTimer from '../../components/auction/CountdownTimer';
import { useAuthStore } from '../../store/authStore';
import { auctionService } from '../../services/auctionService';

export default function AuctionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [depositStatus, setDepositStatus] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    useEffect(() => {
        fetchAuction();
        fetchStatistics();
        if (isAuthenticated) {
            checkDepositStatus();
        }
    }, [id, isAuthenticated]);

    const fetchAuction = async () => {
        setLoading(true);
        try {
            const response = await auctionService.getById(id);
            // Backend returns { data: auction }
            setAuction(response.data || response);
        } catch (error) {
            console.error('Fetch auction error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await auctionService.getStatistics(id);
            setStatistics(response.data || response);
        } catch (error) {
            console.error('Fetch statistics error:', error);
        }
    };

    const checkDepositStatus = async () => {
        try {
            const response = await auctionService.checkDeposit(id);
            setDepositStatus(response.data || response);
        } catch (error) {
            console.error('Check deposit error:', error);
        }
    };

    const handleJoinAuction = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        // Check deposit status
        if (depositStatus?.depositPaid) {
            // Already paid → Go to room
            navigate(`/auctions/${id}/room`);
        } else {
            // Not paid → Go to deposit page
            navigate(`/auctions/${id}/deposit`);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: auction.title,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Share error:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Đã sao chép liên kết vào bộ nhớ tạm!');
        }
    };

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        // TODO: Call API to add/remove favorite
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).format(new Date(date));
    };

    const getStatusBadge = (status) => {
        const badges = {
            UPCOMING: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sắp diễn ra', icon: Clock },
            ONGOING: { bg: 'bg-green-100', text: 'text-green-700', label: 'Đang diễn ra', icon: TrendingUp },
            COMPLETED: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Đã kết thúc', icon: CheckCircle },
            CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Đã hủy', icon: AlertCircle },
        };

        const badge = badges[status] || badges.UPCOMING;
        const Icon = badge.icon;

        return (
            <span className={`px-4 py-2 ${badge.bg} ${badge.text} rounded-xl font-semibold flex items-center gap-2`}>
                <Icon className="w-5 h-5" />
                {badge.label}
            </span>
        );
    };

    // ✅ FIXED: Render action button based on status
    const renderActionButton = () => {
        // CASE 1: UPCOMING - Chưa bắt đầu
        if (auction.status === 'UPCOMING') {
            if (!isAuthenticated) {
                return (
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg flex items-center justify-center gap-2"
                    >
                        <Gavel className="w-6 h-6" />
                        Đăng nhập để đăng ký
                    </button>
                );
            }

            if (depositStatus?.depositPaid) {
                return (
                    <div className="space-y-3">
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                            <p className="font-bold text-green-900">Bạn đã đăng ký thành công!</p>
                            <p className="text-sm text-green-700 mt-1">
                                Phiên sẽ bắt đầu vào {formatDate(auction.startTime)}
                            </p>
                        </div>
                        <button
                            onClick={handleJoinAuction}
                            className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-semibold flex items-center justify-center gap-2"
                        >
                            <Clock className="w-5 h-5" />
                            Vào phòng chờ
                        </button>
                    </div>
                );
            }

            return (
                <button
                    onClick={handleJoinAuction}
                    className="w-full py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg flex items-center justify-center gap-2"
                >
                    <Gavel className="w-6 h-6" />
                    Đăng ký tham gia (nộp đặt cọc)
                </button>
            );
        }

        // CASE 2: ONGOING - Đang diễn ra
        if (auction.status === 'ONGOING') {
            if (!isAuthenticated) {
                return (
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg flex items-center justify-center gap-2"
                    >
                        <TrendingUp className="w-6 h-6" />
                        Đăng nhập để tham gia trả giá
                    </button>
                );
            }

            if (!depositStatus?.depositPaid) {
                return (
                    <div className="space-y-3">
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
                            <AlertCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                            <p className="font-bold text-red-900">Phiên đang diễn ra</p>
                            <p className="text-sm text-red-700 mt-1">
                                Bạn cần nộp tiền đặt cọc để tham gia
                            </p>
                        </div>
                        <button
                            onClick={handleJoinAuction}
                            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg flex items-center justify-center gap-2"
                        >
                            <AlertCircle className="w-6 h-6" />
                            Nộp đặt cọc để tham gia ngay
                        </button>
                    </div>
                );
            }

            return (
                <button
                    onClick={handleJoinAuction}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg flex items-center justify-center gap-2 animate-pulse"
                >
                    <TrendingUp className="w-6 h-6" />
                    🔴 Tham gia đấu giá trực tiếp
                </button>
            );
        }

        // CASE 3: COMPLETED - Đã kết thúc
        if (auction.status === 'COMPLETED') {
            return (
                <div className="bg-gray-100 rounded-xl p-4 text-center">
                    <CheckCircle className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <p className="font-bold text-gray-900">Phiên đã kết thúc</p>
                    {auction.winnerId && (
                        <p className="text-sm text-gray-600 mt-2">
                            Người thắng: {auction.winner?.fullName || 'Đang cập nhật'}
                        </p>
                    )}
                </div>
            );
        }

        // CASE 4: CANCELLED
        if (auction.status === 'CANCELLED') {
            return (
                <div className="bg-red-100 rounded-xl p-4 text-center">
                    <AlertCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <p className="font-bold text-red-900">Phiên đấu giá đã bị hủy</p>
                </div>
            );
        }

        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!auction) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy phiên đấu giá</h2>
                    <button
                        onClick={() => navigate('/auctions')}
                        className="mt-4 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-light"
                    >
                        Quay lại danh sách đấu giá
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Status Banner */}
            {auction.status === 'ONGOING' && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-3">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-center gap-3 text-white">
                            <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                            <span className="font-bold text-lg">PHIÊN ĐẤU GIÁ ĐANG DIỄN RA</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                {statistics?.totalParticipants || 0} người tham gia
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <main className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/auctions')}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Quay lại danh sách đấu giá</span>
                </button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Property Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Main Image */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={auction.property?.thumbnail || auction.property.images?.[0]}
                                alt={auction.title}
                                className="w-full h-96 object-cover"
                            />

                            {/* Image Gallery Thumbnails */}
                            {auction.property?.images && auction.property.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2 p-4">
                                    {auction.property.images.slice(0, 4).map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`Property ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title & Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {auction.title}
                                    </h1>
                                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                                        <MapPin className="w-5 h-5" />
                                        <span>{auction.property?.address}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleFavorite}
                                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                                    >
                                        <Heart
                                            className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                                        />
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                                    >
                                        <Share2 className="w-6 h-6 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Property Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Home className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Loại hình</p>
                                        <p className="font-bold text-gray-900">{auction.property?.type}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Maximize2 className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Diện tích</p>
                                        <p className="font-bold text-gray-900">{auction.property?.area} m²</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Bed className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phòng ngủ</p>
                                        <p className="font-bold text-gray-900">{auction.property?.bedrooms}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Bath className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phòng tắm</p>
                                        <p className="font-bold text-gray-900">{auction.property?.bathrooms}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Eye className="w-4 h-4" />
                                    <span>{auction.property?.views || 0} lượt xem</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>Đăng ngày {formatDate(auction.createdAt)}</span>
                                </div>
                                {auction.property?.hasLegalDoc && (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Tài liệu pháp lý</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mô tả</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {auction.description}
                            </p>
                        </div>

                        {/* Auction Statistics */}
                        {statistics && (
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Thống kê đấu giá</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                                        <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-gray-900">{statistics.totalParticipants || 0}</p>
                                        <p className="text-sm text-gray-600">Người tham gia</p>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-xl">
                                        <Gavel className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-gray-900">{statistics.totalBids || 0}</p>
                                        <p className="text-sm text-gray-600">Tổng lượt trả giá</p>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                                        <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-gray-900">{statistics.uniqueBidders || 0}</p>
                                        <p className="text-sm text-gray-600">Người trả giá duy nhất</p>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                                        <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-gray-900">
                                            {statistics.averageBid > 0 ? formatPrice(statistics.averageBid) : 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600">Mức trả giá trung bình</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Auction Info */}
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Trạng thái phiên</h3>
                                {getStatusBadge(auction.status)}
                            </div>

                            {/* Countdown Timer */}
                            {(auction.status === 'UPCOMING' || auction.status === 'ONGOING') && (
                                <div className="mb-6">
                                    <p className="text-sm text-gray-600 mb-2">
                                        {auction.status === 'UPCOMING' ? 'Bắt đầu sau:' : 'Kết thúc sau:'}
                                    </p>
                                    <CountdownTimer
                                        endTime={auction.status === 'UPCOMING' ? auction.startTime : auction.endTime}
                                        onEnd={() => window.location.reload()}
                                    />
                                </div>
                            )}

                            {/* Schedule */}
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Thời gian bắt đầu:</span>
                                    <span className="font-semibold text-gray-900">{formatDate(auction.startTime)}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">Thời gian kết thúc:</span>
                                    <span className="font-semibold text-gray-900">{formatDate(auction.endTime)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Info */}
                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
                            <p className="text-white/80 text-sm font-medium mb-2">
                                {auction.status === 'UPCOMING' ? 'Giá khởi điểm' : 'Giá hiện tại'}
                            </p>
                            <p className="text-4xl font-bold mb-4">
                                {formatPrice(auction.currentPrice)}
                            </p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/80">Khởi điểm: {formatPrice(auction.startPrice)}</span>
                                {auction.currentPrice > auction.startPrice && (
                                    <span className="flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        {((auction.currentPrice - auction.startPrice) / auction.startPrice * 100).toFixed(1)}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Auction Requirements */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h3 className="font-bold text-gray-900 mb-4">Thông tin đấu giá</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Bước giá:</span>
                                    <span className="font-semibold text-gray-900">{formatPrice(auction.bidStep)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Tiền đặt cọc:</span>
                                    <span className="font-semibold text-primary">{formatPrice(auction.depositAmount)}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">Tổng lượt trả giá:</span>
                                    <span className="font-semibold text-gray-900">{statistics?.totalBids || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Deposit Status */}
                        {isAuthenticated && depositStatus && (
                            <div className={`rounded-2xl p-6 shadow-lg ${depositStatus.depositPaid
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                                : 'bg-white'
                                }`}>
                                <div className="flex items-center gap-3 mb-3">
                                    {depositStatus.depositPaid ? (
                                        <CheckCircle className="w-6 h-6" />
                                    ) : (
                                        <AlertCircle className="w-6 h-6 text-orange-500" />
                                    )}
                                    <h3 className="font-bold">
                                        {depositStatus.depositPaid ? 'Đã nộp đặt cọc' : 'Chưa nộp đặt cọc'}
                                    </h3>
                                </div>
                                <p className={`text-sm ${depositStatus.depositPaid ? 'text-white/80' : 'text-gray-600'}`}>
                                    {depositStatus.depositPaid
                                        ? 'Bạn đủ điều kiện tham gia đấu giá này'
                                        : 'Vui lòng nộp đặt cọc để tham gia phiên'}
                                </p>
                            </div>
                        )}

                        {/* Action Button - ✅ NOW RENDERED */}
                        {renderActionButton()}

                        {/* Rules */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Quy tắc đấu giá
                            </h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li>• Phải nộp tiền đặt cọc trước khi tham gia</li>
                                <li>• Mỗi lần trả giá phải tăng tối thiểu bằng bước giá</li>
                                <li>• Giá đặt ra là cam kết và không thể rút lại</li>
                                <li>• Người thắng phải thanh toán trong vòng 24 giờ</li>
                                <li>• Đặt cọc sẽ được hoàn trả nếu bạn không thắng</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}