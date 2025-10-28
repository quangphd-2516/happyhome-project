// frontend/src/components/admin/AuctionFilters.jsx
import { useState } from 'react';
import {
    Search,
    Filter,
    X,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Ban,
    RotateCcw
} from 'lucide-react';

export default function AuctionFilters({ filters, onFilterChange }) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);

    const statusOptions = [
        { value: 'all', label: 'All Status', icon: Filter, color: 'text-gray-600' },
        { value: 'UPCOMING', label: 'Upcoming', icon: Calendar, color: 'text-purple-600' },
        { value: 'ONGOING', label: 'Ongoing', icon: Clock, color: 'text-blue-600' },
        { value: 'COMPLETED', label: 'Completed', icon: CheckCircle, color: 'text-green-600' },
        { value: 'CANCELLED', label: 'Cancelled', icon: Ban, color: 'text-red-600' }
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
        <div className="bg-white rounded-2xl shadow-lg p-6">
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
                            placeholder="Search by auction title or property name..."
                            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
                        className={`flex items-center gap-2 px-4 py-2.5 border-2 rounded-xl transition-all duration-200 font-medium ${showAdvanced || hasActiveFilters
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                        {hasActiveFilters && (
                            <span className="w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
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
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 border-2 border-gray-200 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Reset</span>
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
                                    ? 'bg-indigo-600 text-white shadow-md'
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
                                    From Date
                                </div>
                            </label>
                            <input
                                type="date"
                                value={localFilters.dateFrom}
                                onChange={(e) => handleDateChange('dateFrom', e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Date To */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    To Date
                                </div>
                            </label>
                            <input
                                type="date"
                                value={localFilters.dateTo}
                                onChange={(e) => handleDateChange('dateTo', e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Results per page */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Results per page
                            </label>
                            <select
                                value={localFilters.limit}
                                onChange={(e) => {
                                    const newFilters = { ...localFilters, limit: parseInt(e.target.value) };
                                    setLocalFilters(newFilters);
                                    onFilterChange(newFilters);
                                }}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value={10}>10 per page</option>
                                <option value={25}>25 per page</option>
                                <option value={50}>50 per page</option>
                                <option value={100}>100 per page</option>
                            </select>
                        </div>
                    </div>

                    {/* Quick Date Filters */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className="text-sm font-medium text-gray-700 mr-2 self-center">
                            Quick filters:
                        </span>
                        {[
                            { label: 'Today', days: 0 },
                            { label: 'This Week', days: 7 },
                            { label: 'This Month', days: 30 },
                            { label: 'Next 3 Months', days: 90 }
                        ].map((quickFilter) => (
                            <button
                                key={quickFilter.label}
                                onClick={() => {
                                    const today = new Date();
                                    const futureDate = new Date();
                                    futureDate.setDate(today.getDate() + quickFilter.days);

                                    const newFilters = {
                                        ...localFilters,
                                        dateFrom: today.toISOString().split('T')[0],
                                        dateTo: futureDate.toISOString().split('T')[0]
                                    };
                                    setLocalFilters(newFilters);
                                    onFilterChange(newFilters);
                                }}
                                className="px-3 py-1.5 text-sm bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                {quickFilter.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}