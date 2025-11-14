// src/pages/admin/UserManagement.jsx
import { useState, useEffect } from 'react';
import {
    Users,
    UserCheck,
    UserX,
    Shield,
    TrendingUp,
    RefreshCw,
    Download,
    Plus
} from 'lucide-react';
import UserTable from '../../components/admin/UserTable';
import UserFilters from '../../components/admin/UserFilters';
import UserDetail from './UserDetail';
import { adminService } from '../../services/adminService';

// ==================== MOCK DATA ====================
const MOCK_USERS = [
    {
        id: 'user_001',
        email: 'nguyenvana@example.com',
        fullName: 'Nguyen Van A',
        phone: '0123456789',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'USER',
        isVerified: true,
        isBlocked: false,
        kycStatus: 'APPROVED',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        _count: {
            properties: 5,
            auctions: 3,
            favorites: 12,
            reviews: 8
        },
        wallet: {
            balance: '15000000',
            _count: { transactions: 25 }
        },
        kycData: {
            idCardNumber: '001234567890',
            dateOfBirth: '1990-05-15',
            address: '123 Nguyen Trai, Thanh Xuan, Ha Noi',
            status: 'APPROVED',
            verifiedAt: '2024-01-20T10:00:00Z'
        }
    },
    {
        id: 'user_002',
        email: 'tranthib@example.com',
        fullName: 'Tran Thi B',
        phone: '0987654321',
        avatar: 'https://i.pravatar.cc/150?img=5',
        role: 'USER',
        isVerified: true,
        isBlocked: false,
        kycStatus: 'PENDING',
        createdAt: '2024-02-10T14:30:00Z',
        updatedAt: '2024-02-10T14:30:00Z',
        _count: {
            properties: 2,
            auctions: 1,
            favorites: 5,
            reviews: 3
        },
        wallet: {
            balance: '8500000',
            _count: { transactions: 12 }
        }
    },
    {
        id: 'user_003',
        email: 'levanc@example.com',
        fullName: 'Le Van C',
        phone: '0912345678',
        avatar: 'https://i.pravatar.cc/150?img=8',
        role: 'MODERATOR',
        isVerified: true,
        isBlocked: false,
        kycStatus: 'APPROVED',
        createdAt: '2023-12-05T09:15:00Z',
        updatedAt: '2024-01-10T16:20:00Z',
        _count: {
            properties: 0,
            auctions: 0,
            favorites: 0,
            reviews: 0
        },
        wallet: {
            balance: '0',
            _count: { transactions: 0 }
        },
        kycData: {
            idCardNumber: '009876543210',
            dateOfBirth: '1988-08-20',
            address: '456 Tran Phu, Ba Dinh, Ha Noi',
            status: 'APPROVED',
            verifiedAt: '2023-12-10T10:00:00Z'
        }
    },
    {
        id: 'user_004',
        email: 'phamthid@example.com',
        fullName: 'Pham Thi D',
        phone: '0945678901',
        avatar: 'https://i.pravatar.cc/150?img=9',
        role: 'USER',
        isVerified: false,
        isBlocked: true,
        kycStatus: 'REJECTED',
        createdAt: '2024-03-01T11:00:00Z',
        updatedAt: '2024-03-05T15:30:00Z',
        _count: {
            properties: 1,
            auctions: 0,
            favorites: 2,
            reviews: 0
        },
        wallet: {
            balance: '500000',
            _count: { transactions: 3 }
        }
    },
    {
        id: 'user_005',
        email: 'admin@example.com',
        fullName: 'Admin User',
        phone: '0900000000',
        avatar: 'https://i.pravatar.cc/150?img=12',
        role: 'ADMIN',
        isVerified: true,
        isBlocked: false,
        kycStatus: 'APPROVED',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        _count: {
            properties: 0,
            auctions: 0,
            favorites: 0,
            reviews: 0
        },
        wallet: {
            balance: '0',
            _count: { transactions: 0 }
        }
    },
    {
        id: 'user_006',
        email: 'hoangvane@example.com',
        fullName: 'Hoang Van E',
        phone: '0923456789',
        avatar: 'https://i.pravatar.cc/150?img=13',
        role: 'USER',
        isVerified: true,
        isBlocked: false,
        kycStatus: 'APPROVED',
        createdAt: '2024-01-20T08:00:00Z',
        updatedAt: '2024-01-20T08:00:00Z',
        _count: {
            properties: 8,
            auctions: 5,
            favorites: 20,
            reviews: 15
        },
        wallet: {
            balance: '25000000',
            _count: { transactions: 45 }
        },
        kycData: {
            idCardNumber: '001122334455',
            dateOfBirth: '1992-03-10',
            address: '789 Le Loi, Hoan Kiem, Ha Noi',
            status: 'APPROVED',
            verifiedAt: '2024-01-25T10:00:00Z'
        }
    },
    {
        id: 'user_007',
        email: 'vuthif@example.com',
        fullName: 'Vu Thi F',
        phone: null,
        avatar: 'https://i.pravatar.cc/150?img=16',
        role: 'USER',
        isVerified: false,
        isBlocked: false,
        kycStatus: 'PENDING',
        createdAt: '2024-03-10T13:45:00Z',
        updatedAt: '2024-03-10T13:45:00Z',
        _count: {
            properties: 0,
            auctions: 0,
            favorites: 1,
            reviews: 0
        },
        wallet: {
            balance: '0',
            _count: { transactions: 0 }
        }
    },
    {
        id: 'user_008',
        email: 'dovang@example.com',
        fullName: 'Do Van G',
        phone: '0934567890',
        avatar: 'https://i.pravatar.cc/150?img=20',
        role: 'USER',
        isVerified: true,
        isBlocked: false,
        kycStatus: 'APPROVED',
        createdAt: '2024-02-05T10:30:00Z',
        updatedAt: '2024-02-05T10:30:00Z',
        _count: {
            properties: 3,
            auctions: 2,
            favorites: 7,
            reviews: 5
        },
        wallet: {
            balance: '12000000',
            _count: { transactions: 18 }
        },
        kycData: {
            idCardNumber: '002233445566',
            dateOfBirth: '1985-11-25',
            address: '321 Hai Ba Trung, Dong Da, Ha Noi',
            status: 'APPROVED',
            verifiedAt: '2024-02-10T10:00:00Z'
        }
    }
];

const USE_MOCK_DATA = false; // Set false để dùng API thật
// ==================== END MOCK DATA ====================

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        blocked: 0,
        verified: 0
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [filters, setFilters] = useState({
        role: '',
        kycStatus: '',
        isBlocked: '',
        isVerified: '',
        search: ''
    });

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, filters]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            if (USE_MOCK_DATA) {
                // ========== USE MOCK DATA ==========
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

                let filteredUsers = [...MOCK_USERS];

                // Apply search filter
                if (filters.search) {
                    const searchLower = filters.search.toLowerCase();
                    filteredUsers = filteredUsers.filter(user =>
                        user.fullName.toLowerCase().includes(searchLower) ||
                        user.email.toLowerCase().includes(searchLower) ||
                        user.phone?.toLowerCase().includes(searchLower)
                    );
                }

                // Apply role filter
                if (filters.role) {
                    filteredUsers = filteredUsers.filter(user => user.role === filters.role);
                }

                // Apply KYC status filter
                if (filters.kycStatus) {
                    filteredUsers = filteredUsers.filter(user => user.kycStatus === filters.kycStatus);
                }

                // Apply blocked status filter
                if (filters.isBlocked !== '') {
                    const isBlocked = filters.isBlocked === 'true';
                    filteredUsers = filteredUsers.filter(user => user.isBlocked === isBlocked);
                }

                // Apply verified status filter
                if (filters.isVerified !== '') {
                    const isVerified = filters.isVerified === 'true';
                    filteredUsers = filteredUsers.filter(user => user.isVerified === isVerified);
                }

                // Calculate pagination
                const total = filteredUsers.length;
                const totalPages = Math.ceil(total / pagination.limit);
                const startIndex = (pagination.page - 1) * pagination.limit;
                const endIndex = startIndex + pagination.limit;
                const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

                setUsers(paginatedUsers);
                setPagination(prev => ({
                    ...prev,
                    total,
                    totalPages
                }));

                // Calculate stats
                const statsData = {
                    total: MOCK_USERS.length,
                    active: MOCK_USERS.filter(u => !u.isBlocked).length,
                    blocked: MOCK_USERS.filter(u => u.isBlocked).length,
                    verified: MOCK_USERS.filter(u => u.isVerified).length
                };
                setStats(statsData);

            } else {
                // ========== USE REAL API ==========
                const params = {
                    page: pagination.page,
                    limit: pagination.limit,
                    ...filters
                };

                const response = await adminService.getAllUsers(params);

                setUsers(response.data || []);
                setPagination(prev => ({
                    ...prev,
                    total: response.total || 0,
                    totalPages: response.totalPages || 0
                }));

                // Calculate stats from response
                if (response.stats) {
                    setStats(response.stats);
                } else {
                    calculateStats(response.data || []);
                }
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Lỗi khi tải danh sách người dùng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (userData) => {
        const total = userData.length;
        const active = userData.filter(u => !u.isBlocked).length;
        const blocked = userData.filter(u => u.isBlocked).length;
        const verified = userData.filter(u => u.isVerified).length;

        setStats({ total, active, blocked, verified });
    };

    const handleFilter = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleSearch = (searchQuery) => {
        setFilters(prev => ({ ...prev, search: searchQuery }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleViewDetail = (user) => {
        setSelectedUser(user);
    };

    const handleBlockUser = async (userId) => {
        if (!window.confirm('Bạn có chắc chắn muốn chặn người dùng này không?')) return;

        try {
            if (USE_MOCK_DATA) {
                // ========== MOCK: Update local state ==========
                await new Promise(resolve => setTimeout(resolve, 300));

                // Update in MOCK_USERS array
                const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
                if (userIndex !== -1) {
                    MOCK_USERS[userIndex].isBlocked = true;
                }

                alert('Chặn người dùng thành công!');
                fetchUsers();
                if (selectedUser?.id === userId) {
                    setSelectedUser({ ...selectedUser, isBlocked: true });
                }
            } else {
                // ========== USE REAL API ==========
                await adminService.blockUser(userId);
                alert('Chặn người dùng thành công!');
                fetchUsers();
                if (selectedUser?.id === userId) {
                    setSelectedUser(null);
                }
            }
        } catch (error) {
            console.error('Error blocking user:', error);
            alert('Không thể chặn người dùng. Vui lòng thử lại.');
        }
    };

    const handleUnblockUser = async (userId) => {
        if (!window.confirm('Bạn có chắc chắn muốn bỏ chặn người dùng này không?')) return;

        try {
            if (USE_MOCK_DATA) {
                // ========== MOCK: Update local state ==========
                await new Promise(resolve => setTimeout(resolve, 300));

                // Update in MOCK_USERS array
                const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
                if (userIndex !== -1) {
                    MOCK_USERS[userIndex].isBlocked = false;
                }

                alert('Bỏ chặn người dùng thành công!');
                fetchUsers();
                if (selectedUser?.id === userId) {
                    setSelectedUser({ ...selectedUser, isBlocked: false });
                }
            } else {
                // ========== USE REAL API ==========
                await adminService.unblockUser(userId);
                alert('Bỏ chặn người dùng thành công!');
                fetchUsers();
                if (selectedUser?.id === userId) {
                    setSelectedUser(null);
                }
            }
        } catch (error) {
            console.error('Error unblocking user:', error);
            alert('Không thể bỏ chặn người dùng. Vui lòng thử lại.');
        }
    };

    const handleRefresh = () => {
        fetchUsers();
    };

    const handleExport = async () => {
        try {
            // Implement export functionality
            alert('Tính năng xuất file sẽ sớm ra mắt!');
        } catch (error) {
            console.error('Error exporting users:', error);
        }
    };

    const StatCard = ({ icon: Icon, label, value, color, bgColor, trend }) => (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-gray-100 hover:border-purple-300">
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
                <p className="text-3xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</p>
                <p className="text-sm font-medium text-gray-600">{label}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Quản lý người dùng
                        </h1>
                        <p className="text-gray-600">
                            Theo dõi và quản lý toàn bộ người dùng trong hệ thống
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-500 transition-all flex items-center gap-2 font-medium"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                            Làm mới
                        </button>
                        <button
                            onClick={handleExport}
                            className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-500 transition-all flex items-center gap-2 font-medium"
                        >
                            <Download className="w-5 h-5" />
                            Xuất dữ liệu
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={Users}
                        label="Tổng người dùng"
                        value={stats.total}
                        color="text-blue-600"
                        bgColor="bg-blue-100"
                        trend={12}
                    />
                    <StatCard
                        icon={UserCheck}
                        label="Đang hoạt động"
                        value={stats.active}
                        color="text-green-600"
                        bgColor="bg-green-100"
                        trend={8}
                    />
                    <StatCard
                        icon={UserX}
                        label="Đã chặn"
                        value={stats.blocked}
                        color="text-red-600"
                        bgColor="bg-red-100"
                    />
                    <StatCard
                        icon={Shield}
                        label="Đã xác thực"
                        value={stats.verified}
                        color="text-purple-600"
                        bgColor="bg-purple-100"
                        trend={15}
                    />
                </div>

                {/* Filters */}
                <UserFilters
                    onFilter={handleFilter}
                    onSearch={handleSearch}
                />

                {/* Users Table */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Danh sách người dùng ({pagination.total})
                        </h2>
                        <div className="text-sm text-gray-600">
                            Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} trong {pagination.total}
                        </div>
                    </div>

                    {loading ? (
                        <div className="bg-white rounded-2xl shadow-lg p-20 text-center">
                            <RefreshCw className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">Đang tải danh sách người dùng...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-20 text-center">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy người dùng</h3>
                            <p className="text-gray-600 mb-6">
                                Không có người dùng nào khớp với bộ lọc hiện tại. Hãy thử thay đổi điều kiện tìm kiếm.
                            </p>
                            <button
                                onClick={() => {
                                    setFilters({
                                        role: '',
                                        kycStatus: '',
                                        isBlocked: '',
                                        isVerified: '',
                                        search: ''
                                    });
                                }}
                                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    ) : (
                        <UserTable
                            users={users}
                            onViewDetail={handleViewDetail}
                            onBlockUser={handleBlockUser}
                            onUnblockUser={handleUnblockUser}
                        />
                    )}

                    {/* Pagination */}
                    {!loading && users.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Trang {pagination.page} / {pagination.totalPages}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
                                        disabled={pagination.page === 1}
                                        className="px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        Đầu tiên
                                    </button>
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                        disabled={pagination.page === 1}
                                        className="px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        Trước
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex gap-2">
                                        {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                                            let pageNum;
                                            if (pagination.totalPages <= 5) {
                                                pageNum = index + 1;
                                            } else if (pagination.page <= 3) {
                                                pageNum = index + 1;
                                            } else if (pagination.page >= pagination.totalPages - 2) {
                                                pageNum = pagination.totalPages - 4 + index;
                                            } else {
                                                pageNum = pagination.page - 2 + index;
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                                                    className={`w-10 h-10 rounded-xl font-semibold transition-all ${pagination.page === pageNum
                                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                                        : 'border-2 border-gray-200 hover:border-purple-500'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                        disabled={pagination.page === pagination.totalPages}
                                        className="px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        Tiếp
                                    </button>
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: pagination.totalPages }))}
                                        disabled={pagination.page === pagination.totalPages}
                                        className="px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        Cuối
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-gray-600 font-medium">
                                        Mỗi trang:
                                    </label>
                                    <select
                                        value={pagination.limit}
                                        onChange={(e) => setPagination(prev => ({
                                            ...prev,
                                            limit: parseInt(e.target.value),
                                            page: 1
                                        }))}
                                        className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium"
                                    >
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <UserDetail
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onBlockUser={handleBlockUser}
                    onUnblockUser={handleUnblockUser}
                />
            )}

        </div>
    );
}