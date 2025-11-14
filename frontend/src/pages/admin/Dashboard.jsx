// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Users, Home, Gavel, DollarSign, TrendingUp, Clock } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import StatsCard from '../../components/admin/StatsCard';
import RevenueChart from '../../components/admin/RevenueChart';
import UserGrowthChart from '../../components/admin/UserGrowthChart';
import RecentActivities from '../../components/admin/RecentActivities';
import { adminService } from '../../services/adminService';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [userGrowthData, setUserGrowthData] = useState([]);
    const [activities, setActivities] = useState([]);

    // Mock data for development
    const mockStats = {
        totalUsers: 1250,
        usersChange: 12.5,
        totalProperties: 456,
        propertiesChange: 8.3,
        totalAuctions: 89,
        auctionsChange: 15.7,
        totalRevenue: 12500000,
        revenueChange: 23.1,
        pendingKYC: 23,
        pendingProperties: 12,
    };

    const mockRevenueData = [
        { date: 'Mon', revenue: 850000, auctions: 450000 },
        { date: 'Tue', revenue: 920000, auctions: 520000 },
        { date: 'Wed', revenue: 780000, auctions: 380000 },
        { date: 'Thu', revenue: 1100000, auctions: 680000 },
        { date: 'Fri', revenue: 1350000, auctions: 920000 },
        { date: 'Sat', revenue: 1650000, auctions: 1200000 },
        { date: 'Sun', revenue: 1450000, auctions: 980000 },
    ];

    const mockUserGrowthData = [
        { date: 'Mon', newUsers: 45, verified: 32 },
        { date: 'Tue', newUsers: 52, verified: 38 },
        { date: 'Wed', newUsers: 38, verified: 28 },
        { date: 'Thu', newUsers: 61, verified: 45 },
        { date: 'Fri', newUsers: 73, verified: 58 },
        { date: 'Sat', newUsers: 89, verified: 67 },
        { date: 'Sun', newUsers: 78, verified: 61 },];


    const mockActivities = [
        {
            id: 1,
            type: 'USER_REGISTERED',
            title: 'Đăng ký người dùng mới',
            description: 'John Smith vừa tạo tài khoản mới',
            createdAt: new Date(Date.now() - 5 * 60 * 1000),
            user: {
                fullName: 'John Smith',
                avatar: 'https://i.pravatar.cc/150?img=1',
            },
        },
        {
            id: 2,
            type: 'PROPERTY_CREATED',
            title: 'Tin bất động sản mới',
            description: 'Biệt thự hạng sang tại Beverly Hills đã được đăng bán',
            createdAt: new Date(Date.now() - 15 * 60 * 1000),
            user: {
                fullName: 'Sarah Johnson',
                avatar: 'https://i.pravatar.cc/150?img=2',
            },
        },
        {
            id: 3,
            type: 'BID_PLACED',
            title: 'Có lượt trả giá mới',
            description: 'Giá $2,500,000 cho phiên đấu giá căn Penthouse hiện đại',
            createdAt: new Date(Date.now() - 30 * 60 * 1000),
            user: {
                fullName: 'Mike Chen',
                avatar: 'https://i.pravatar.cc/150?img=3',
            },
        },
        {
            id: 4,
            type: 'KYC_APPROVED',
            title: 'Phê duyệt KYC',
            description: 'Hồ sơ xác thực của Emma Wilson đã được chấp nhận',
            createdAt: new Date(Date.now() - 60 * 60 * 1000),
            user: {
                fullName: 'Emma Wilson',
                avatar: 'https://i.pravatar.cc/150?img=4',
            },
        },
        {
            id: 5,
            type: 'AUCTION_CREATED',
            title: 'Tạo phiên đấu giá mới',
            description: 'Phiên đấu giá căn hộ trung tâm sắp được tổ chức',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            user: {
                fullName: 'Admin',
                avatar: 'https://i.pravatar.cc/150?img=50',
            },
        },
        {
            id: 6,
            type: 'PROPERTY_APPROVED',
            title: 'Tin đăng được phê duyệt',
            description: 'Biệt thự biển đã được duyệt đăng',
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
            user: {
                fullName: 'Admin',
                avatar: 'https://i.pravatar.cc/150?img=50',
            },
        },
    ];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, revenueRes, growthRes, activitiesRes] = await Promise.all([
                adminService.getDashboardStats(),
                adminService.getRevenueData('7days'),
                adminService.getUserGrowthData('7days'),
                adminService.getRecentActivities(10),
            ]);
            console.log("📊 statsRes:", statsRes);
            setStats(statsRes);
            //setStats(statsRes.data);
            setRevenueData(revenueRes.data);
            setUserGrowthData(growthRes.data);
            setActivities(activitiesRes.data);
            setLoading(false);


        } catch (error) {
            console.error('Fetch dashboard data error:', error);
            //setStats(mockStats);
            //setRevenueData(mockRevenueData);
            //setUserGrowthData(mockUserGrowthData);
            //setActivities(mockActivities);
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tổng quan hệ thống</h1>
                        <p className="text-gray-600">Chào mừng bạn quay lại! Cùng xem hôm nay có gì mới.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                            <option>7 ngày gần nhất</option>
                            <option>30 ngày gần nhất</option>
                            <option>3 tháng gần đây</option>
                            <option>Năm vừa qua</option>
                        </select>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Tổng người dùng"
                        value={stats?.users?.total?.toLocaleString() ?? "0"}
                        change={stats?.usersChange}
                        icon={Users}
                        color="blue"
                    />
                    <StatsCard
                        title="Tổng bất động sản"
                        value={stats?.properties?.total?.toLocaleString() ?? "0"}
                        change={stats?.propertiesChange}
                        icon={Home}
                        color="green"
                    />
                    <StatsCard
                        title="Phiên đấu giá đang hoạt động"
                        value={stats?.auctions?.total ?? 0}
                        change={stats?.auctionsChange}
                        icon={Gavel}
                        color="purple"
                    />
                    <StatsCard
                        title="Doanh thu"
                        value={formatCurrency(stats?.transactions?.net ?? 0)}
                        change={stats?.revenueChange}
                        icon={DollarSign}
                        color="orange"
                    />
                </div>


                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <RevenueChart data={revenueData} />
                    <UserGrowthChart data={userGrowthData} />
                </div>

                {/* Quick Actions & Recent Activities */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Quick Actions */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Thao tác nhanh</h3>

                            <div className="space-y-3">
                                <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all">
                                    <Gavel className="w-5 h-5" />
                                    <div className="text-left">
                                        <p className="font-semibold text-sm">Tạo phiên đấu giá</p>
                                        <p className="text-xs opacity-90">Lên lịch đấu giá cho bất động sản mới</p>
                                    </div>
                                </button>

                                <button className="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl transition-all">
                                    <Users className="w-5 h-5" />
                                    <div className="text-left">
                                        <p className="font-semibold text-sm">Quản lý người dùng</p>
                                        <p className="text-xs opacity-75">Xem danh sách người dùng đã đăng ký</p>
                                    </div>
                                </button>

                                <button className="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 text-green-900 rounded-xl transition-all">
                                    <Home className="w-5 h-5" />
                                    <div className="text-left">
                                        <p className="font-semibold text-sm">Duyệt bất động sản</p>
                                        <p className="text-xs opacity-75">Phê duyệt các tin đăng chờ duyệt</p>
                                    </div>
                                </button>

                                <button className="w-full flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 text-orange-900 rounded-xl transition-all">
                                    <Clock className="w-5 h-5" />
                                    <div className="text-left">
                                        <p className="font-semibold text-sm">KYC đang chờ</p>
                                        <p className="text-xs opacity-75">{stats?.kyc?.pending ?? 0} hồ sơ đang chờ xác thực</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Pending Items */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Đang chờ xử lý</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Hồ sơ KYC</p>
                                            <p className="text-xs text-gray-600">Đang chờ xác minh</p>
                                        </div>
                                    </div>
                                    <span className="text-2xl font-bold text-orange-600">{stats?.kycs?.pending ?? 0}</span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                            <Home className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Tin bất động sản</p>
                                            <p className="text-xs text-gray-600">Đang đợi phê duyệt</p>
                                        </div>
                                    </div>
                                    <span className="text-2xl font-bold text-blue-600">{stats?.properties?.pending ?? 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="lg:col-span-2">
                        <RecentActivities activities={activities} />
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Hiệu suất hệ thống</h3>
                            <p className="text-purple-100">Số liệu thống kê theo thời gian thực</p>
                        </div>
                        <TrendingUp className="w-12 h-12 opacity-50" />
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <p className="text-purple-100 text-sm mb-2">Người dùng hoạt động hôm nay</p>
                            <p className="text-3xl font-bold">892</p>
                            <p className="text-xs text-purple-200 mt-1">↑ 12% so với hôm qua</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <p className="text-purple-100 text-sm mb-2">Bất động sản đăng mới</p>
                            <p className="text-3xl font-bold">23</p>
                            <p className="text-xs text-purple-200 mt-1">↑ 8% so với hôm qua</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <p className="text-purple-100 text-sm mb-2">Lượt trả giá hôm nay</p>
                            <p className="text-3xl font-bold">156</p>
                            <p className="text-xs text-purple-200 mt-1">↑ 23% so với hôm qua</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <p className="text-purple-100 text-sm mb-2">Doanh thu hôm nay</p>
                            <p className="text-3xl font-bold">$1.2M</p>
                            <p className="text-xs text-purple-200 mt-1">↑ 18% so với hôm qua</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}


