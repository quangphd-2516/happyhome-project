// frontend/src/components/admin/KYCFilters.jsx
import { useState } from 'react';
import {
    Search,
    Filter,
    X,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    RotateCcw
} from 'lucide-react';

const KYCFilters = ({ filters, onFilterChange }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);

    const statusOptions = [
        { value: 'all', label: 'Tất cả trạng thái', icon: Filter, color: 'text-gray-600' },
        { value: 'PENDING', label: 'Chờ duyệt', icon: Clock, color: 'text-yellow-600' },
        { value: 'APPROVED', label: 'Đã duyệt', icon: CheckCircle, color: 'text-green-600' },
        { value: 'REJECTED', label: 'Từ chối', icon: XCircle, color: 'text-red-600' }
    ];

    const handleStatusChange = (status) => {
        const newFilters = { ...localFilters, status };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleSearchChange = (e) => {
        const search = e.target.value;
        setLocalFilters(prev => ({ ...prev, search }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onFilterChange(localFilters);
    };

    const handleDateChange = (field, value) => {
        const newFilters = { ...localFilters, [field]: value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const resetFilters = {
            status: 'all',
            search: '',
            dateFrom: '',
            dateTo: '',
            page: 1,
            limit: 10
        };
        setLocalFilters(resetFilters);
        onFilterChange(resetFilters);
        setShowAdvanced(false);
    };

    const hasActiveFilters =
        localFilters.status !== 'all' ||
        localFilters.search !== '' ||
        localFilters.dateFrom !== '' ||
        localFilters.dateTo !== '';

    return (
        <div className="p-6">
            {/* Main Filters Row */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={localFilters.search}
                            onChange={handleSearchChange}
                            placeholder="Tìm theo tên, email hoặc số giấy tờ..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {localFilters.search && (
                            <button
                                type="button"
                                onClick={() => {
                                    const newFilters = { ...localFilters, search: '' };
                                    setLocalFilters(newFilters);
                                    onFilterChange(newFilters);
                                }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </form>

                {/* Advanced Filters Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-all duration-200 ${showAdvanced || hasActiveFilters
                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        <span className="font-medium">Bộ lọc</span>
                        {hasActiveFilters && (
                            <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                                {[
                                    localFilters.status !== 'all',
                                    localFilters.dateFrom !== '',
                                    localFilters.dateTo !== ''
                                ].filter(Boolean).length}
                            </span>
                        )}
                    </button>

                    {hasActiveFilters && (
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span className="font-medium">Đặt lại</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Status Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
                {statusOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = localFilters.status === option.value;

                    return (
                        <button
                            key={option.value}
                            onClick={() => handleStatusChange(option.value)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : option.color}`} />
                            {option.label}
                        </button>
                    );
                })}
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="pt-4 border-t border-gray-200 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Date From */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Từ ngày
                                </div>
                            </label>
                            <input
                                type="date"
                                value={localFilters.dateFrom}
                                onChange={(e) => handleDateChange('dateFrom', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Date To */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Đến ngày
                                </div>
                            </label>
                            <input
                                type="date"
                                value={localFilters.dateTo}
                                onChange={(e) => handleDateChange('dateTo', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Results per page */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số kết quả/trang
                            </label>
                            <select
                                value={localFilters.limit}
                                onChange={(e) => {
                                    const newFilters = { ...localFilters, limit: parseInt(e.target.value) };
                                    setLocalFilters(newFilters);
                                    onFilterChange(newFilters);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={10}>10/trang</option>
                                <option value={25}>25/trang</option>
                                <option value={50}>50/trang</option>
                                <option value={100}>100/trang</option>
                            </select>
                        </div>
                    </div>

                    {/* Quick Date Filters */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="text-sm font-medium text-gray-700 mr-2 self-center">
                            Bộ lọc nhanh:
                        </span>
                        {[
                            { label: 'Hôm nay', days: 0 },
                            { label: '7 ngày qua', days: 7 },
                            { label: '30 ngày qua', days: 30 },
                            { label: '90 ngày qua', days: 90 }
                        ].map((quickFilter) => (
                            <button
                                key={quickFilter.label}
                                onClick={() => {
                                    const today = new Date();
                                    const pastDate = new Date();
                                    pastDate.setDate(today.getDate() - quickFilter.days);

                                    const newFilters = {
                                        ...localFilters,
                                        dateFrom: pastDate.toISOString().split('T')[0],
                                        dateTo: today.toISOString().split('T')[0]
                                    };
                                    setLocalFilters(newFilters);
                                    onFilterChange(newFilters);
                                }}
                                className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {quickFilter.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default KYCFilters;