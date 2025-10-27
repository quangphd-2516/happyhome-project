// frontend/src/pages/admin/KYCManagement.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileCheck,
    Clock,
    CheckCircle,
    XCircle,
    Search,
    Filter,
    Eye,
    RefreshCw,
    TrendingUp
} from 'lucide-react';
import KYCTable from '../../components/admin/KYCTable';
import KYCFilters from '../../components/admin/KYCFilters';
import { adminService } from '../../services/adminService';

// Mock data for development
const mockKYCList = [
    {
        id: 'kyc_001',
        userId: 'user_001',
        user: {
            id: 'user_001',
            fullName: 'Nguyen Van A',
            email: 'nguyenvana@example.com',
            phone: '0123456789'
        },
        idCardNumber: '001234567890',
        idCardFront: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        idCardBack: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        selfieWithId: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        fullName: 'Nguyen Van A',
        dateOfBirth: '1990-05-15T00:00:00Z',
        address: '123 Nguyen Trai, Thanh Xuan, Ha Noi',
        status: 'PENDING',
        rejectionReason: null,
        verifiedBy: null,
        verifiedAt: null,
        createdAt: '2024-03-15T10:00:00Z',
        updatedAt: '2024-03-15T10:00:00Z'
    },
    {
        id: 'kyc_002',
        userId: 'user_002',
        user: {
            id: 'user_002',
            fullName: 'Tran Thi B',
            email: 'tranthib@example.com',
            phone: '0987654321'
        },
        idCardNumber: '009876543210',
        idCardFront: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        idCardBack: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        selfieWithId: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        fullName: 'Tran Thi B',
        dateOfBirth: '1992-08-20T00:00:00Z',
        address: '456 Tran Phu, Ba Dinh, Ha Noi',
        status: 'APPROVED',
        rejectionReason: null,
        verifiedBy: 'admin_001',
        verifiedAt: '2024-03-10T14:30:00Z',
        createdAt: '2024-03-08T09:15:00Z',
        updatedAt: '2024-03-10T14:30:00Z'
    },
    {
        id: 'kyc_003',
        userId: 'user_003',
        user: {
            id: 'user_003',
            fullName: 'Le Van C',
            email: 'levanc@example.com',
            phone: '0912345678'
        },
        idCardNumber: '001122334455',
        idCardFront: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        idCardBack: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        selfieWithId: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        fullName: 'Le Van C',
        dateOfBirth: '1988-12-05T00:00:00Z',
        address: '789 Le Loi, Hoan Kiem, Ha Noi',
        status: 'REJECTED',
        rejectionReason: 'ID card image is blurry and unreadable',
        verifiedBy: 'admin_001',
        verifiedAt: '2024-03-12T11:20:00Z',
        createdAt: '2024-03-11T15:00:00Z',
        updatedAt: '2024-03-12T11:20:00Z'
    },
    {
        id: 'kyc_004',
        userId: 'user_004',
        user: {
            id: 'user_004',
            fullName: 'Pham Thi D',
            email: 'phamthid@example.com',
            phone: '0945678901'
        },
        idCardNumber: '002233445566',
        idCardFront: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        idCardBack: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        selfieWithId: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        fullName: 'Pham Thi D',
        dateOfBirth: '1995-03-18T00:00:00Z',
        address: '321 Hai Ba Trung, Dong Da, Ha Noi',
        status: 'PENDING',
        rejectionReason: null,
        verifiedBy: null,
        verifiedAt: null,
        createdAt: '2024-03-16T08:30:00Z',
        updatedAt: '2024-03-16T08:30:00Z'
    },
    {
        id: 'kyc_005',
        userId: 'user_005',
        user: {
            id: 'user_005',
            fullName: 'Hoang Van E',
            email: 'hoangvane@example.com',
            phone: '0923456789'
        },
        idCardNumber: '003344556677',
        idCardFront: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        idCardBack: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        selfieWithId: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        fullName: 'Hoang Van E',
        dateOfBirth: '1993-07-22T00:00:00Z',
        address: '654 Giai Phong, Hai Ba Trung, Ha Noi',
        status: 'APPROVED',
        rejectionReason: null,
        verifiedBy: 'admin_002',
        verifiedAt: '2024-03-14T16:45:00Z',
        createdAt: '2024-03-13T13:20:00Z',
        updatedAt: '2024-03-14T16:45:00Z'
    },
    {
        id: 'kyc_006',
        userId: 'user_006',
        user: {
            id: 'user_006',
            fullName: 'Vu Thi F',
            email: 'vuthif@example.com',
            phone: '0934567890'
        },
        idCardNumber: '004455667788',
        idCardFront: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        idCardBack: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        selfieWithId: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800',
        fullName: 'Vu Thi F',
        dateOfBirth: '1991-10-30T00:00:00Z',
        address: '987 Cau Giay, Cau Giay, Ha Noi',
        status: 'PENDING',
        rejectionReason: null,
        verifiedBy: null,
        verifiedAt: null,
        createdAt: '2024-03-17T11:15:00Z',
        updatedAt: '2024-03-17T11:15:00Z'
    }
];

const mockStats = {
    total: 6,
    pending: 3,
    approved: 2,
    rejected: 1
};

const KYCManagement = () => {
    const navigate = useNavigate();
    const [kycList, setKycList] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        dateFrom: '',
        dateTo: '',
        page: 1,
        limit: 10
    });

    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [listData, statsData] = await Promise.all([
                adminService.getKYCList(filters),
                adminService.getKYCStats()
            ]);
            setKycList(listData.data || []);
            setStats(statsData || stats);
            setLoading(false);

            // Using mock data for now
            /** setTimeout(() => {
              // Apply filters to mock data
              let filteredData = [...mockKYCList];
              
              if (filters.status !== 'all') {
                filteredData = filteredData.filter(kyc => kyc.status === filters.status);
              }
              
              if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                filteredData = filteredData.filter(kyc => 
                  kyc.user.fullName.toLowerCase().includes(searchLower) ||
                  kyc.user.email.toLowerCase().includes(searchLower) ||
                  kyc.idCardNumber.includes(searchLower)
                );
              }
              
              setKycList(filteredData);
              setStats(mockStats);
              setLoading(false);
            }, 500); */
        } catch (error) {
            console.error('Error fetching KYC data:', error);
            // Fallback to mock data
            setKycList(mockKYCList);
            setStats(mockStats);
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handleReview = (kycId) => {
        navigate(`/admin/kyc/${kycId}`);
    };

    const handleRefresh = () => {
        fetchData();
    };

    const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>Last 30 days</span>
                    </div>
                </div>
                <div className={`${bgColor} p-4 rounded-xl`}>
                    <Icon className={`w-8 h-8 ${color}`} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                KYC Management
                            </h1>
                            <p className="text-gray-600">
                                Review and approve user identity verification requests
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            <span className="font-medium">Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={FileCheck}
                        label="Total Submissions"
                        value={stats.total}
                        color="text-blue-600"
                        bgColor="bg-blue-50"
                    />
                    <StatCard
                        icon={Clock}
                        label="Pending Review"
                        value={stats.pending}
                        color="text-yellow-600"
                        bgColor="bg-yellow-50"
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="Approved"
                        value={stats.approved}
                        color="text-green-600"
                        bgColor="bg-green-50"
                    />
                    <StatCard
                        icon={XCircle}
                        label="Rejected"
                        value={stats.rejected}
                        color="text-red-600"
                        bgColor="bg-red-50"
                    />
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                    <KYCFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                {/* KYC Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">
                                KYC Submissions
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Showing {kycList.length} results</span>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                                <p className="text-gray-600">Loading KYC submissions...</p>
                            </div>
                        </div>
                    ) : kycList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <FileCheck className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No KYC submissions found
                            </h3>
                            <p className="text-gray-600 text-center max-w-md">
                                There are no KYC submissions matching your filters. Try adjusting your search criteria.
                            </p>
                        </div>
                    ) : (
                        <KYCTable
                            data={kycList}
                            onReview={handleReview}
                            onRefresh={fetchData}
                        />
                    )}

                    {/* Pagination */}
                    {!loading && kycList.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Page {filters.page} of {Math.ceil(stats.total / filters.limit)}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                                        disabled={filters.page === 1}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                                        disabled={filters.page >= Math.ceil(stats.total / filters.limit)}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KYCManagement;