// src/pages/auction/AuctionRoom.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Gavel, Users, TrendingUp, MapPin, Home, Maximize2, AlertCircle } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import CountdownTimer from '../../components/auction/CountdownTimer';
import BidHistory from '../../components/auction/BidHistory';
import BidForm from '../../components/auction/BidForm';
import { useAuthStore } from '../../store/authStore';
import { auctionService } from '../../services/auctionService';
import websocketService from '../../services/websocketService';

export default function AuctionRoom() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    const [auction, setAuction] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBidding, setIsBidding] = useState(false);
    const [participants, setParticipants] = useState(0);
    const [auctionStatus, setAuctionStatus] = useState(null);
    const [waitingMode, setWaitingMode] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('connecting'); // ✅ THÊM STATE NÀY

    useEffect(() => {
        const checkAccessAndJoin = async () => {
            if (!isAuthenticated) {
                alert('Vui lòng đăng nhập trước');
                navigate('/login');
                return;
            }

            try {
                setLoading(true);
                setConnectionStatus('connecting');

                // Step 1: Check deposit status
                const depositResponse = await auctionService.checkDeposit(id);
                const depositData = depositResponse.data || depositResponse;

                if (!depositData.depositPaid) {
                    alert('Bạn cần nộp tiền đặt cọc trước khi tham gia');
                    navigate(`/auctions/${id}/deposit`);
                    return;
                }

                // Step 2: Get auction details
                const auctionResponse = await auctionService.getById(id);
                const auctionData = auctionResponse.data || auctionResponse;

                if (!auctionData) {
                    alert('Không tìm thấy phiên đấu giá');
                    navigate('/auctions');
                    return;
                }

                // Step 3: Check auction status
                if (auctionData.status === 'COMPLETED' || auctionData.status === 'CANCELLED') {
                    alert('Phiên đấu giá đã kết thúc');
                    navigate(`/auctions/${id}`);
                    return;
                }

                // Step 4: Set auction data
                setAuction(auctionData);
                setBids(auctionData.bids || []);
                setAuctionStatus(auctionData.status);

                if (auctionData.status === 'UPCOMING') {
                    setWaitingMode(true);
                }

                // Step 5: Initialize Socket.IO và đợi kết nối
                await initializeSocket();

            } catch (error) {
                console.error('Access check failed:', error);
                alert('Failed to join auction. Please try again.');
                navigate(`/auctions/${id}`);
            } finally {
                setLoading(false);
            }
        };

        checkAccessAndJoin();

        return () => {
            websocketService.leaveAuction(id);
            removeSocketListeners();
        };
    }, [id, isAuthenticated, navigate]);

    // Khởi tạo socket và đợi kết nối hoàn tất
    const initializeSocket = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setConnectionStatus('error');
            throw new Error('No authentication token');
        }

        try {
            // Kết nối socket và đợi hoàn tất
            await websocketService.connect(token);
            console.log('✅ Socket connected successfully');
            setConnectionStatus('connected');

            // Setup listeners trước khi join
            setupSocketListeners();

            // Join auction sau khi đã kết nối
            await websocketService.joinAuction(id);
            console.log('✅ Joined auction room');

        } catch (error) {
            console.error('❌ Socket initialization failed:', error);
            setConnectionStatus('error');
            alert('Failed to connect to auction. Please refresh the page.');
        }
    };

    const setupSocketListeners = () => {
        websocketService.onAuctionJoined((data) => {
            console.log('Joined auction:', data);
            setAuctionStatus(data.status);
            setParticipants(data.participantCount || 0);

            if (data.recentBids) {
                setBids(data.recentBids);
            }

            if (data.status === 'UPCOMING') {
                setWaitingMode(true);
            }
        });

        websocketService.onAuctionError((error) => {
            console.error('Auction error:', error);

            if (error.message?.includes('Deposit required')) {
                alert('Bạn cần nộp tiền đặt cọc để tiếp tục');
                navigate(`/auctions/${id}/deposit`);
            } else if (error.message?.includes('not ongoing')) {
                alert('Phiên đấu giá đã kết thúc');
                navigate(`/auctions/${id}`);
            } else {
                alert(error.message || 'Đã xảy ra lỗi');
            }
        });

        websocketService.onNewBid((data) => {
            console.log('New bid received:', data);
            setAuction(prev => ({
                ...prev,
                currentPrice: data.auction.currentPrice,
            }));
            setBids(prev => [data.bid, ...prev]);
        });

        websocketService.onBidPlaced((data) => {
            console.log('Your bid placed:', data);
            setIsBidding(false);
            alert('Trả giá thành công!');
        });

        websocketService.onBidError((error) => {
            console.error('Bid error:', error);
            setIsBidding(false);

            if (error.message?.includes('not ongoing')) {
                alert('Phiên đấu giá chưa bắt đầu. Vui lòng đợi.');
            } else if (error.message?.includes('Minimum bid')) {
                alert(error.message);
            } else {
                alert(error.message || 'Đặt giá thất bại');
            }
        });

        websocketService.onUserJoinedAuction((data) => {
            console.log('User joined:', data);
            setParticipants(data.participantCount || 0);
        });

        websocketService.onUserLeftAuction((data) => {
            console.log('User left:', data);
        });

        websocketService.onAuctionStarted((data) => {
            console.log('🎉 Auction started!', data);
            setWaitingMode(false);
            setAuctionStatus('ONGOING');
            alert('Phiên đấu giá đã bắt đầu! Bạn có thể trả giá ngay.');
        });

        websocketService.onAuctionEnded((data) => {
            console.log('🏁 Auction ended!', data);
            alert(`Phiên đấu giá đã kết thúc! ${data.winner ? `Người thắng: ${data.winner.fullName}` : 'Chưa có người thắng'}`);
            navigate(`/auctions/${id}`);
        });

        websocketService.onAuctionUpdate((data) => {
            console.log('Auction update:', data);
            if (data.status) {
                setAuctionStatus(data.status);
            }
        });
    };

    const removeSocketListeners = () => {
        websocketService.off('auction_joined');
        websocketService.off('auction_error');
        websocketService.off('new_bid');
        websocketService.off('bid_placed');
        websocketService.off('bid_error');
        websocketService.off('user_joined_auction');
        websocketService.off('user_left_auction');
        websocketService.off('auction_started');
        websocketService.off('auction_ended');
        websocketService.off('auction_update');
    };

    const handlePlaceBid = async (amount) => {
        if (!websocketService.isConnected()) {
            alert('Chưa kết nối tới phòng đấu giá. Vui lòng tải lại trang.');
            return;
        }

        if (waitingMode) {
            alert('Phiên đấu giá chưa bắt đầu. Vui lòng chờ.');
            return;
        }

        setIsBidding(true);
        try {
            await websocketService.placeBid(id, amount);
        } catch (error) {
            console.error('Place bid error:', error);
            setIsBidding(false);
            alert('Đặt giá thất bại. Vui lòng thử lại.');
        }
    };

    const handleAuctionEnd = () => {
        alert('Phiên đấu giá đã kết thúc!');
        navigate(`/auctions/${id}`);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải phòng đấu giá...</p>
                    {connectionStatus === 'connecting' && (
                        <p className="text-sm text-gray-500 mt-2">Đang kết nối tới phòng đấu giá...</p>
                    )}
                </div>
            </div>
        );
    }

    if (!auction) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy phiên đấu giá</h2>
                    <button
                        onClick={() => navigate('/auctions')}
                        className="mt-4 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-light"
                    >
                        Quay lại danh sách đấu giá
                    </button>
                </div>
            </div>
        );
    }

    const minBid = parseFloat(auction.currentPrice) + parseFloat(auction.bidStep);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Live Indicator */}
            <div className={`py-3 ${waitingMode
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                : 'bg-gradient-to-r from-red-500 to-pink-600'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-3 text-white">
                        <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                        <span className="font-bold text-lg">
                            {waitingMode ? 'ĐANG CHỜ PHIÊN BẮT ĐẦU' : 'PHIÊN ĐẤU GIÁ TRỰC TIẾP'}
                        </span>
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {participants} {waitingMode ? 'đang chờ' : 'đang theo dõi'}
                        </span>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Property Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Images */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={auction.property?.thumbnail}
                                alt={auction.title}
                                className="w-full h-96 object-cover"
                            />
                        </div>

                        {/* Title & Timer */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{auction.title}</h1>

                            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                                {waitingMode ? (
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 mb-2">Bắt đầu sau:</p>
                                        <CountdownTimer
                                            endTime={auction.startTime}
                                            onEnd={() => {
                                                setWaitingMode(false);
                                                setAuctionStatus('ONGOING');
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 mb-2">Kết thúc sau:</p>
                                        <CountdownTimer endTime={auction.endTime} onEnd={handleAuctionEnd} />
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-5 h-5" />
                                    <span>{auction.property?.address}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                                <div className="text-center">
                                    <Home className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">{auction.property?.type}</p>
                                </div>
                                <div className="text-center">
                                    <Maximize2 className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">{auction.property?.area} m²</p>
                                </div>
                                <div className="text-center">
                                    <TrendingUp className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">{bids.length} lượt trả giá</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Mô tả</h2>
                            <p className="text-gray-600 leading-relaxed">{auction.description}</p>
                        </div>

                        {/* Bid History */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Lịch sử trả giá</h2>
                            <BidHistory bids={bids} />
                        </div>
                    </div>

                    {/* Right Column - Bidding */}
                    <div className="space-y-6">
                        {/* Current Bid */}
                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
                            <p className="text-white/80 text-sm font-medium mb-2">Giá cao nhất hiện tại</p>
                            <p className="text-5xl font-bold mb-4">{formatPrice(auction.currentPrice)}</p>
                            <div className="flex items-center justify-between text-sm">
                                <span>Giá khởi điểm: {formatPrice(auction.startPrice)}</span>
                                {auction.currentPrice > auction.startPrice && (
                                    <span className="flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        {((auction.currentPrice - auction.startPrice) / auction.startPrice * 100).toFixed(1)}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Waiting Message or Bid Form */}
                        {waitingMode ? (
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-center">
                                <div className="animate-pulse mb-4">
                                    <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
                                        <Gavel className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-blue-900 mb-2">Đang chờ phiên bắt đầu</h3>
                                <p className="text-sm text-blue-700">
                                    Bạn có thể trả giá khi phiên đấu giá bắt đầu
                                </p>
                            </div>
                        ) : (
                            <BidForm
                                currentBid={auction.currentPrice}
                                bidStep={auction.bidStep}
                                minBid={minBid}
                                onBid={handlePlaceBid}
                                isLoading={isBidding}
                            />
                        )}

                        {/* Auction Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h3 className="font-bold text-gray-900 mb-4">Thông tin phiên</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Trạng thái:</span>
                                    <span className={`font-semibold ${auctionStatus === 'ONGOING' ? 'text-green-600' : 'text-blue-600'
                                        }`}>
                                        {auctionStatus === 'ONGOING' ? 'Đang diễn ra' : auctionStatus === 'UPCOMING' ? 'Sắp diễn ra' : auctionStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Bước giá:</span>
                                    <span className="font-semibold">{formatPrice(auction.bidStep)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tiền đặt cọc:</span>
                                    <span className="font-semibold">{formatPrice(auction.depositAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tổng lượt trả giá:</span>
                                    <span className="font-semibold">{bids.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Rules */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                            <h3 className="font-bold text-blue-900 mb-3">Quy tắc trả giá</h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li>• Mọi lượt trả giá đều có hiệu lực và không thể hủy</li>
                                <li>• Mỗi lần trả giá phải cao hơn giá hiện tại tối thiểu bằng bước giá</li>
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