// src/components/admin/UserFilters.jsx
import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

export default function UserFilters({ onFilter, onSearch }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        role: '',
        kycStatus: '',
        isBlocked: '',
        isVerified: '',
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilter(newFilters);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const clearFilters = () => {
        const emptyFilters = {
            role: '',
            kycStatus: '',
            isBlocked: '',
            isVerified: '',
        };
        setFilters(emptyFilters);
        setSearchQuery('');
        onFilter(emptyFilters);
        onSearch('');
    };

    const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm theo tên, email hoặc số điện thoại..."
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                    Tìm kiếm
                </button>
                <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="relative px-6 py-3.5 border-2 border-gray-200 rounded-xl hover:border-purple-500 transition-colors flex items-center gap-2"
                >
                    <Filter className="w-5 h-5" />
                    <span className="font-medium">Bộ lọc</span>
                    {activeFiltersCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>
            </form>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="space-y-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">Bộ lọc nâng cao</h3>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                            >
                                <X className="w-4 h-4" />
                                Xóa tất cả
                            </button>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Role Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Vai trò
                            </label>
                            <select
                                value={filters.role}
                                onChange={(e) => handleFilterChange('role', e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value="">Tất cả vai trò</option>
                                <option value="USER">Người dùng</option>
                                <option value="ADMIN">Quản trị viên</option>
                                <option value="MODERATOR">Điều phối viên</option>
                            </select>
                        </div>

                        {/* KYC Status Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Trạng thái KYC
                            </label>
                            <select
                                value={filters.kycStatus}
                                onChange={(e) => handleFilterChange('kycStatus', e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="APPROVED">Đã xác thực</option>
                                <option value="PENDING">Chờ duyệt</option>
                                <option value="REJECTED">Từ chối</option>
                            </select>
                        </div>

                        {/* Account Status Filter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Trạng thái tài khoản
                            </label>
                            <select
                                value={filters.isBlocked}
                                onChange={(e) => handleFilterChange('isBlocked', e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value="">Tất cả</option>
                                <option value="false">Đang hoạt động</option>
                                <option value="true">Đã chặn</option>
                            </select>
                        </div>

                        {/* Verification Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Email đã xác thực
                            </label>
                            <select
                                value={filters.isVerified}
                                onChange={(e) => handleFilterChange('isVerified', e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value="">Tất cả</option>
                                <option value="true">Đã xác thực</option>
                                <option value="false">Chưa xác thực</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}