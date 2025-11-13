// src/pages/property/PropertyList.jsx
import { useState, useEffect } from 'react';
import { Grid3x3, Map, LayoutList } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import PropertyCard from '../../components/property/PropertyCard';
import PropertyFilter from '../../components/property/PropertyFilter';
import PropertyMap from '../../components/property/PropertyMap';
import { propertyService } from '../../services/propertyService';

export default function PropertyList() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'map'
    const [sortBy, setSortBy] = useState('newest');

    // Mock data for development
    const mockProperties = [
        {
            id: 1,
            title: 'Modern Villa in Beverly Hills',
            address: 'Beverly Hills, California',
            type: 'VILLA',
            price: 2500000,
            area: 450,
            bedrooms: 4,
            bathrooms: 3,
            views: 1250,
            isPremium: true,
            thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800']
        },
        {
            id: 2,
            title: 'Luxury Apartment Downtown',
            address: 'San Francisco, California',
            type: 'APARTMENT',
            price: 850000,
            area: 120,
            bedrooms: 2,
            bathrooms: 2,
            views: 890,
            isPremium: false,
            thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800']
        },
        {
            id: 3,
            title: 'Beachfront House',
            address: 'Malibu, California',
            type: 'HOUSE',
            price: 3700000,
            area: 550,
            bedrooms: 5,
            bathrooms: 4,
            views: 2100,
            isPremium: true,
            thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800']
        },
    ];

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const response = await propertyService.getAll();
            setProperties(response.data);
            setLoading(false);

            // Using mock data for now
            /** setTimeout(() => {
                setProperties(mockProperties);
                setLoading(false);
            }, 500);*/
        } catch (error) {
            console.error('Fetch properties error:', error);
            setProperties(response.data);
            setLoading(false);
        }
    };

    const handleFilter = (filters) => {
        console.log('Filtering with:', filters);
        // TODO: Apply filters
    };

    const handleSearch = async (query) => {
        setLoading(true);
        try {
            if (!query || query.trim() === "") {
                await fetchProperties(); // Hiện tất cả nếu xóa tìm kiếm
                return;
            }
            const response = await propertyService.search(query);
            setProperties(response.data);
        } catch (error) {
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (sortOption) => {
        setSortBy(sortOption);
        // TODO: Sort properties
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Find Your Dream Property
                    </h1>
                    <p className="text-gray-600">
                        Browse through {properties.length} available properties
                    </p>
                </div>

                {/* Filters */}
                <PropertyFilter onFilter={handleFilter} onSearch={handleSearch} />

                {/* Toolbar */}
                <div className="flex items-center justify-between my-6 bg-white rounded-xl shadow-lg p-4">
                    {/* View Mode */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-lg transition-colors ${viewMode === 'grid'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <Grid3x3 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 rounded-lg transition-colors ${viewMode === 'list'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <LayoutList className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`p-2.5 rounded-lg transition-colors ${viewMode === 'map'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <Map className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => handleSort(e.target.value)}
                            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="area">Area</option>
                            <option value="popular">Most Popular</option>
                        </select>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : viewMode === 'map' ? (
                    <PropertyMap properties={properties} />
                ) : (
                    <div className={
                        viewMode === 'grid'
                            ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'space-y-6'
                    }>
                        {properties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}

                {/* No Results */}
                {!loading && properties.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-600">No properties found</p>
                        <p className="text-gray-500 mt-2">Try adjusting your filters</p>
                    </div>
                )}

                {/* Pagination */}
                {properties.length > 0 && (
                    <div className="flex justify-center mt-12">
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors">
                                Previous
                            </button>
                            <button className="px-4 py-2 bg-primary text-white rounded-lg">1</button>
                            <button className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors">
                                2
                            </button>
                            <button className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors">
                                3
                            </button>
                            <button className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}