// src/pages/auction/MyAuctions.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gavel, Trophy, Clock, XCircle } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useAuthStore } from '../../store/authStore';
import { auctionService } from '../../services/auctionService';

export default function MyAuctions() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, winning, lost, ongoing

    // Mock data
    const mockAuctions = [
        {
            id: 1,
            title: 'Luxury Villa - Beverly Hills',
            thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
            myBid: 2500000,
            currentBid: 2500000,
            status: 'ONGOING',
            isWinning: true,
            endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 2,
            title: 'Modern Penthouse - San Francisco',
            thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
            myBid: 1800000,
            currentBid: 1950000,
            status: 'ONGOING',
            isWinning: false,
            endTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 3,
            title: 'Beachfront Estate - Malibu',
            thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
            myBid: 4000000,
            currentBid: 4200000,
            status: 'COMPLETED',
            isWinning: false,
            endTime: '2024-03-18T18:00:00',
        },
    ];

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchMyAuctions();
    }, [isAuthenticated]);

    const fetchMyAuctions = async () => {
        setLoading(true);
        try {
            const response = await auctionService.getMyAuctions();
            setAuctions(response.data);
            setLoading(false);

        } catch (error) {
            console.error('Fetch my auctions error:', error);
            //setAuctions(mockAuctions);
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const filteredAuctions = auctions.filter(a => {
        if (filter === 'all') return true;
        if (filter === 'winning') return a.isWinning && a.status === 'ONGOING';
        if (filter === 'lost') return !a.isWinning && a.status === 'COMPLETED';
        if (filter === 'ongoing') return a.status === 'ONGOING';
        return true;
    });

    const stats = {
        total: auctions.length,
        winning: auctions.filter(a => a.isWinning && a.status === 'ONGOING').length,
        ongoing: auctions.filter(a => a.status === 'ONGOING').length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Phiên đấu giá của tôi</h1>
                    <p className="text-gray-600">Theo dõi các phiên đã tham gia và tình trạng trả giá của bạn</p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <Gavel className="w-8 h-8" />
                            <span className="text-3xl font-bold">{stats.total}</span>
                        </div>
                        <p className="font-medium">Tổng số phiên đã tham gia</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <Trophy className="w-8 h-8" />
                            <span className="text-3xl font-bold">{stats.winning}</span>
                        </div>
                        <p className="font-medium">Đang dẫn đầu</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <Clock className="w-8 h-8" />
                            <span className="text-3xl font-bold">{stats.ongoing}</span>
                        </div>
                        <p className="font-medium">Đang diễn ra</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                    <div className="flex gap-2 overflow-x-auto">
                        {[
                            { key: 'all', label: 'Tất cả' },
                            { key: 'winning', label: 'Đang dẫn đầu' },
                            { key: 'ongoing', label: 'Đang diễn ra' },
                            { key: 'lost', label: 'Đã thua' },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${filter === key
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Auctions List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : filteredAuctions.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                        <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Auctions Found</h3>
                        <p className="text-gray-600 mb-6">Hãy tham gia đấu giá để thấy lịch sử tại đây</p>
                        <button
                            onClick={() => navigate('/auctions')}
                            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-light transition-colors font-medium"
                        >
                            Xem các phiên đấu giá
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredAuctions.map(auction => (
                            <div
                                key={auction.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Image */}
                                    <div className="md:w-64 h-48 md:h-auto cursor-pointer" onClick={() => navigate(`/auctions/${auction.id}`)}>
                                        <img
                                            src={auction.thumbnail}
                                            alt={auction.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{auction.title}</h3>
                                                {auction.status === 'ONGOING' && (
                                                    <div className="flex items-center gap-2">
                                                        {auction.isWinning ? (
                                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full flex items-center gap-1">
                                                                <Trophy className="w-4 h-4" />
                                                                Đang dẫn đầu
                                                            </span>
                                                        ) : (
                                                            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full flex items-center gap-1">
                                                                <XCircle className="w-4 h-4" />
                                                                Bị vượt giá
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                {auction.status === 'COMPLETED' && (
                                                    <span className={`px-3 py-1 ${auction.isWinning
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                        } text-sm font-semibold rounded-full`}>
                                                        {auction.isWinning ? 'Thắng phiên' : 'Đã thua'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Giá của bạn</p>
                                                <p className="text-lg font-bold text-primary">{formatPrice(auction.myBid)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Giá hiện tại</p>
                                                <p className="text-lg font-bold text-gray-900">{formatPrice(auction.currentBid)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Trạng thái</p>
                                                <p className="text-lg font-semibold text-gray-900">{auction.status}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-3">
                                            <button
                                                onClick={() => navigate(`/auctions/${auction.id}`)}
                                                className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium"
                                            >
                                                {auction.status === 'ONGOING' ? 'Trả giá ngay' : 'Xem chi tiết'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}