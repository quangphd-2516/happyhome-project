// src/pages/auction/AuctionList.jsx
import { useState, useEffect } from 'react';
import { Gavel, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import AuctionCard from '../../components/auction/AuctionCard';
import { auctionService } from '../../services/auctionService';

export default function AuctionList() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, upcoming, ongoing, completed

    // Mock data


    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
        setLoading(true);
        try {
            const response = await auctionService.getAll();
            setAuctions(response.data);
            setLoading(false);

        } catch (error) {
            console.error('Fetch auctions error:', error);
            setLoading(false);
        }
    };

    const filteredAuctions = filter === 'all'
        ? auctions
        : auctions.filter(a => a.status.toLowerCase() === filter);

    const stats = {
        total: auctions.length,
        ongoing: auctions.filter(a => a.status === 'ONGOING').length,
        upcoming: auctions.filter(a => a.status === 'UPCOMING').length,
        completed: auctions.filter(a => a.status === 'COMPLETED').length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
            <Header />

            <main className="container mx-auto px-4 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6 shadow-xl">
                        <Gavel className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Phiên đấu giá bất động sản
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Tham gia đấu giá trực tuyến và sở hữu những bất động sản cao cấp
                    </p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-3">
                            <Gavel className="w-8 h-8 text-purple-500" />
                            <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
                        </div>
                        <p className="text-gray-600 font-medium">Tổng số phiên</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg text-white">
                        <div className="flex items-center justify-between mb-3">
                            <TrendingUp className="w-8 h-8" />
                            <span className="text-3xl font-bold">{stats.ongoing}</span>
                        </div>
                        <p className="font-medium">Đang diễn ra</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-lg text-white">
                        <div className="flex items-center justify-between mb-3">
                            <Clock className="w-8 h-8" />
                            <span className="text-3xl font-bold">{stats.upcoming}</span>
                        </div>
                        <p className="font-medium">Sắp diễn ra</p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-6 shadow-lg text-white">
                        <div className="flex items-center justify-between mb-3">
                            <CheckCircle className="w-8 h-8" />
                            <span className="text-3xl font-bold">{stats.completed}</span>
                        </div>
                        <p className="font-medium">Đã kết thúc</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-wrap gap-3">
                        {[
                            { key: 'all', label: 'Tất cả', color: 'bg-purple-500' },
                            { key: 'ongoing', label: 'Đang diễn ra', color: 'bg-green-500' },
                            { key: 'upcoming', label: 'Sắp diễn ra', color: 'bg-blue-500' },
                            { key: 'completed', label: 'Đã kết thúc', color: 'bg-gray-500' }
                        ].map(({ key, label, color }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all ${filter === key
                                    ? `${color} text-white shadow-lg`
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Auctions Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : filteredAuctions.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                        <Gavel className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy phiên đấu giá</h3>
                        <p className="text-gray-600">Hãy quay lại sau để xem các phiên đấu giá mới</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAuctions.map(auction => (
                            <AuctionCard key={auction.id} auction={auction} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}