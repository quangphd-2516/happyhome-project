// frontend/src/pages/admin/AuctionManagement.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Gavel,
    Clock,
    CheckCircle,
    XCircle,
    Plus,
    RefreshCw,
    TrendingUp,
    Calendar,
    DollarSign
} from 'lucide-react';
import AuctionTable from '../../components/admin/AuctionTable';
import AuctionFilters from '../../components/admin/AuctionFilters';
import { adminService } from '../../services/adminService';

// Mock data for development
const mockAuctions = [
    {
        id: 'auction_001',
        propertyId: 'prop_001',
        property: {
            id: 'prop_001',
            title: 'Biệt thự hiện đại tại Quận 2',
            address: '123 Nguyễn Văn Hưởng, Thảo Điền, Quận 2, TP.HCM',
            thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            type: 'VILLA',
            area: 450
        },
        title: 'Đấu giá biệt thự cao cấp Quận 2',
        startPrice: 15000000000,
        bidStep: 500000000,
        depositAmount: 1500000000,
        currentPrice: 16500000000,
        startTime: '2024-04-01T10:00:00Z',
        endTime: '2024-04-15T18:00:00Z',
        status: 'ONGOING',
        winnerId: null,
        _count: { bids: 12, participants: 5 },
        createdAt: '2024-03-20T09:00:00Z'
    },
    {
        id: 'auction_002',
        propertyId: 'prop_002',
        property: {
            id: 'prop_002',
            title: 'Penthouse Vinhomes',
            address: '208 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM',
            thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            type: 'APARTMENT',
            area: 250
        },
        title: 'Đấu giá Penthouse cao cấp',
        startPrice: 12000000000,
        bidStep: 300000000,
        depositAmount: 1200000000,
        currentPrice: 12000000000,
        startTime: '2024-04-20T10:00:00Z',
        endTime: '2024-05-05T18:00:00Z',
        status: 'UPCOMING',
        winnerId: null,
        _count: { bids: 0, participants: 3 },
        createdAt: '2024-03-25T14:30:00Z'
    },
    {
        id: 'auction_003',
        propertyId: 'prop_003',
        property: {
            id: 'prop_003',
            title: 'Biệt thự biển Vũng Tàu',
            address: '456 Thùy Vân, Vũng Tàu',
            thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            type: 'VILLA',
            area: 600
        },
        title: 'Đấu giá biệt thự ven biển',
        startPrice: 25000000000,
        bidStep: 1000000000,
        depositAmount: 2500000000,
        currentPrice: 28000000000,
        startTime: '2024-03-01T10:00:00Z',
        endTime: '2024-03-15T18:00:00Z',
        status: 'COMPLETED',
        winnerId: 'user_005',
        _count: { bids: 28, participants: 8 },
        createdAt: '2024-02-20T11:00:00Z'
    },
    {
        id: 'auction_004',
        propertyId: 'prop_004',
        property: {
            id: 'prop_004',
            title: 'Shophouse trung tâm Quận 1',
            address: '789 Lê Lai, Quận 1, TP.HCM',
            thumbnail: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
            type: 'SHOPHOUSE',
            area: 180
        },
        title: 'Shophouse vị trí vàng',
        startPrice: 18000000000,
        bidStep: 500000000,
        depositAmount: 1800000000,
        currentPrice: 18000000000,
        startTime: '2024-03-10T10:00:00Z',
        endTime: '2024-03-20T18:00:00Z',
        status: 'CANCELLED',
        winnerId: null,
        _count: { bids: 5, participants: 2 },
        createdAt: '2024-03-05T16:00:00Z'
    }
];

const mockStats = {
    total: 4,
    upcoming: 1,
    ongoing: 1,
    completed: 1,
    cancelled: 1,
    totalRevenue: 28000000000
};

export default function AuctionManagement() {
    const navigate = useNavigate();
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        upcoming: 0,
        ongoing: 0,
        completed: 0,
        cancelled: 0,
        totalRevenue: 0
    });
    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        dateFrom: '',
        dateTo: '',
        page: 1,
        limit: 10
    });

    useEffect(() => {
        fetchAuctions();
    }, [filters]);

    const fetchAuctions = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllAuctions(filters);
            setAuctions(response.data || []);
            if (response.stats) {
                setStats(response.stats);
            }
            setLoading(false);

            // Using mock data for now
            /** setTimeout(() => {
              let filteredData = [...mockAuctions];
              
              if (filters.status !== 'all') {
                filteredData = filteredData.filter(a => a.status === filters.status);
              }
              
              if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filteredData = filteredData.filter(a => 
                  a.title.toLowerCase().includes(searchLower) ||
                  a.property.title.toLowerCase().includes(searchLower)
                );
              }
              
              setAuctions(filteredData);
              setStats(mockStats);
              setLoading(false);
            }, 500); */
        } catch (error) {
            console.error('Error fetching auctions:', error);
            //setAuctions(mockAuctions);
            //setStats(mockStats);
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handleViewDetail = (auctionId) => {
        navigate(`/admin/auctions/${auctionId}`);
    };

    const handleCreateAuction = () => {
        navigate('/admin/auctions/create');
    };

    const handleRefresh = () => {
        fetchAuctions();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const StatCard = ({ icon: Icon, label, value, color, bgColor, trend }) => (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${color}`} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                        <TrendingUp className="w-4 h-4" />
                        <span>{trend}%</span>
                    </div>
                )}
            </div>
            <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                    {typeof value === 'number' && value > 1000000 ? formatCurrency(value) : value}
                </p>
                <p className="text-sm font-medium text-gray-600">{label}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Quản lý đấu giá
                        </h1>
                        <p className="text-gray-600">
                            Quản lý và theo dõi tất cả phiên đấu giá bất động sản
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-500 transition-all flex items-center gap-2 font-medium"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            Tải lại
                        </button>
                        <button
                            onClick={handleCreateAuction}
                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            Tạo phiên đấu giá
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={Gavel}
                        label="Tổng số phiên"
                        value={stats.total}
                        color="text-indigo-600"
                        bgColor="bg-indigo-100"
                        trend={8}
                    />
                    <StatCard
                        icon={Clock}
                        label="Đang diễn ra"
                        value={stats.ongoing}
                        color="text-blue-600"
                        bgColor="bg-blue-100"
                    />
                    <StatCard
                        icon={Calendar}
                        label="Sắp diễn ra"
                        value={stats.upcoming}
                        color="text-purple-600"
                        bgColor="bg-purple-100"
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="Đã kết thúc"
                        value={stats.completed}
                        color="text-green-600"
                        bgColor="bg-green-100"
                        trend={15}
                    />
                </div>

                {/* Total Revenue Card */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium mb-2">Tổng doanh thu từ đấu giá</p>
                            <p className="text-5xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
                            <p className="text-green-100 text-sm mt-2">Tính từ các phiên đã hoàn tất</p>
                        </div>
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                            <DollarSign className="w-12 h-12" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <AuctionFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

                {/* Auctions Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Danh sách phiên đấu giá ({auctions.length})
                            </h2>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin" />
                        </div>
                    ) : auctions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Gavel className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Không tìm thấy phiên đấu giá
                            </h3>
                            <p className="text-gray-600 text-center max-w-md mb-6">
                                Không có phiên đấu giá phù hợp. Hãy điều chỉnh bộ lọc hoặc tạo phiên mới.
                            </p>
                            <button
                                onClick={handleCreateAuction}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
                            >
                                <Plus className="w-5 h-5" />
                                Tạo phiên đầu tiên
                            </button>
                        </div>
                    ) : (
                        <AuctionTable
                            data={auctions}
                            onViewDetail={handleViewDetail}
                            onRefresh={fetchAuctions}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}