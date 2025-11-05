// frontend/src/components/admin/PropertySelector.jsx
import { useState, useEffect } from 'react';
import { Search, CheckCircle, Home, MapPin } from 'lucide-react';
import { adminService } from '../../services/adminService';

// Mock available properties for auction
const mockProperties = [
    {
        id: 'prop_001',
        title: 'Modern Villa in District 2',
        address: '123 Nguyen Van Huong, Thao Dien, District 2, HCMC',
        type: 'VILLA',
        price: 15000000000,
        area: 450,
        bedrooms: 5,
        bathrooms: 4,
        thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        status: 'PUBLISHED'
    },
    {
        id: 'prop_002',
        title: 'Penthouse Apartment Vinhomes',
        address: '208 Nguyen Huu Canh, Binh Thanh, HCMC',
        type: 'APARTMENT',
        price: 12000000000,
        area: 250,
        bedrooms: 3,
        bathrooms: 3,
        thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        status: 'PUBLISHED'
    },
    {
        id: 'prop_003',
        title: 'Beachfront Villa Vung Tau',
        address: '456 Thuy Van, Vung Tau',
        type: 'VILLA',
        price: 25000000000,
        area: 600,
        bedrooms: 6,
        bathrooms: 5,
        thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        status: 'PUBLISHED'
    },
    {
        id: 'prop_004',
        title: 'Commercial Shophouse District 1',
        address: '789 Le Lai, District 1, HCMC',
        type: 'SHOPHOUSE',
        price: 18000000000,
        area: 180,
        bedrooms: 0,
        bathrooms: 2,
        thumbnail: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
        status: 'PUBLISHED'
    },
    {
        id: 'prop_005',
        title: 'Luxury Apartment Landmark 81',
        address: 'Vinhomes Central Park, Binh Thanh, HCMC',
        type: 'APARTMENT',
        price: 8500000000,
        area: 150,
        bedrooms: 2,
        bathrooms: 2,
        thumbnail: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
        status: 'PUBLISHED'
    }
];

export default function PropertySelector({ selectedProperty, onSelect }) {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            // Get only published properties without active auctions
            const response = await adminService.getAllProperties({
                status: 'PUBLISHED',
                hasAuction: false
            });
            setProperties(response.data || []);
            setLoading(false);

            // Using mock data for now
            /** setTimeout(() => {
              setProperties(mockProperties);
              setLoading(false);
            }, 500); */
        } catch (error) {
            console.error('Error fetching properties:', error);
            //setProperties(mockProperties);
            setLoading(false);
        }
    };

    const filteredProperties = properties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(search.toLowerCase()) ||
            property.address.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || property.type === filter;
        return matchesSearch && matchesFilter;
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(amount);
    };

    const propertyTypes = [
        { value: 'all', label: 'All Types' },
        { value: 'VILLA', label: 'Villa' },
        { value: 'APARTMENT', label: 'Apartment' },
        { value: 'HOUSE', label: 'House' },
        { value: 'LAND', label: 'Land' },
        { value: 'SHOPHOUSE', label: 'Shophouse' }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Select a Property
                </h2>
                <p className="text-gray-600">
                    Choose from available published properties without active auctions
                </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title or address..."
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    {propertyTypes.map(type => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Properties Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading properties...</p>
                    </div>
                </div>
            ) : filteredProperties.length === 0 ? (
                <div className="text-center py-20">
                    <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        No Properties Available
                    </h3>
                    <p className="text-gray-600">
                        {search || filter !== 'all'
                            ? 'No properties match your search criteria'
                            : 'No published properties available for auction'
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-2">
                    {filteredProperties.map((property) => (
                        <div
                            key={property.id}
                            onClick={() => onSelect(property)}
                            className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedProperty?.id === property.id
                                ? 'border-indigo-600 shadow-lg scale-105'
                                : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                                }`}
                        >
                            {/* Image */}
                            <div className="relative h-48">
                                <img
                                    src={property.thumbnail}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />
                                {selectedProperty?.id === property.id && (
                                    <div className="absolute top-2 right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 px-3 py-1 bg-black/70 text-white text-xs font-semibold rounded-full">
                                    {property.type}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                                    {property.title}
                                </h3>

                                <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span className="line-clamp-2">{property.address}</span>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                    <div>
                                        <p className="text-xs text-gray-500">Listed Price</p>
                                        <p className="font-bold text-green-600">
                                            {formatCurrency(property.price)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Area</p>
                                        <p className="font-semibold text-gray-900">
                                            {property.area}m²
                                        </p>
                                    </div>
                                </div>

                                {property.bedrooms > 0 && (
                                    <div className="flex gap-3 mt-2 text-xs text-gray-600">
                                        <span>{property.bedrooms} beds</span>
                                        <span>•</span>
                                        <span>{property.bathrooms} baths</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Selected Property Info */}
            {selectedProperty && (
                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-indigo-600" />
                        <div>
                            <p className="font-semibold text-indigo-900">
                                Selected: {selectedProperty.title}
                            </p>
                            <p className="text-sm text-indigo-700">
                                Click "Next Step" to continue with auction setup
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}