// src/components/property/PropertyFilter.jsx
import { useState } from 'react';
import { Search, SlidersHorizontal, X, MapPin, Home, DollarSign } from 'lucide-react';

export default function PropertyFilter({ onFilter, onSearch }) {
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        type: '',
        minPrice: '',
        maxPrice: '',
        minArea: '',
        maxArea: '',
        bedrooms: '',
        bathrooms: '',
        city: '',
    });

    const propertyTypes = ['HOUSE', 'APARTMENT', 'LAND', 'VILLA', 'SHOPHOUSE'];
    const cities = ['Hanoi', 'Ho Chi Minh', 'Da Nang', 'Can Tho', 'Hai Phong'];

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
            type: '',
            minPrice: '',
            maxPrice: '',
            minArea: '',
            maxArea: '',
            bedrooms: '',
            bathrooms: '',
            city: '',
        };
        setFilters(emptyFilters);
        onFilter(emptyFilters);
    };

    const activeFiltersCount = Object.values(filters).filter(v => v).length;

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
                        placeholder="Tìm theo vị trí, tên bất động sản..."
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-3.5 bg-primary text-white rounded-xl hover:bg-primary-light transition-colors font-medium"
                >
                    Tìm kiếm
                </button>
                <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="relative px-6 py-3.5 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors flex items-center gap-2"
                >
                    <SlidersHorizontal className="w-5 h-5" />
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
                <div className="space-y-6 pt-6 border-t border-gray-200 animate-in slide-in-from-top">
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

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Property Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <Home className="w-4 h-4" />
                                Loại bất động sản
                            </label>
                            <select
                                value={filters.type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Tất cả loại</option>
                                {propertyTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Thành phố
                            </label>
                            <select
                                value={filters.city}
                                onChange={(e) => handleFilterChange('city', e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Tất cả thành phố</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* Bedrooms */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Phòng ngủ
                            </label>
                            <select
                                value={filters.bedrooms}
                                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Bất kỳ</option>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num}+</option>
                                ))}
                            </select>
                        </div>

                        {/* Bathrooms */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Phòng tắm
                            </label>
                            <select
                                value={filters.bathrooms}
                                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                <option value="">Bất kỳ</option>
                                {[1, 2, 3, 4].map(num => (
                                    <option key={num} value={num}>{num}+</option>
                                ))}
                            </select>
                        </div>

                        {/* Min Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Giá tối thiểu ($)
                            </label>
                            <input
                                type="number"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                placeholder="0"
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                        </div>

                        {/* Max Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Giá tối đa ($)
                            </label>
                            <input
                                type="number"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                placeholder="Bất kỳ"
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                        </div>

                        {/* Min Area */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Diện tích tối thiểu (m²)
                            </label>
                            <input
                                type="number"
                                value={filters.minArea}
                                onChange={(e) => handleFilterChange('minArea', e.target.value)}
                                placeholder="0"
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                        </div>

                        {/* Max Area */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Diện tích tối đa (m²)
                            </label>
                            <input
                                type="number"
                                value={filters.maxArea}
                                onChange={(e) => handleFilterChange('maxArea', e.target.value)}
                                placeholder="Bất kỳ"
                                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}