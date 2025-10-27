// src/pages/property/Favorites.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import PropertyCard from '../../components/property/PropertyCard';
import { useAuthStore } from '../../store/authStore';
import { propertyService } from '../../services/propertyService';

export default function Favorites() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock data
    const mockFavorites = [
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
            savedAt: '2024-03-15'
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
            savedAt: '2024-03-20'
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
            savedAt: '2024-03-22'
        },
    ];

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchFavorites();
    }, [isAuthenticated]);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const response = await propertyService.getFavorites();
            setFavorites(response.data);
            setLoading(false);
            /**  Using mock data
            setTimeout(() => {
                setFavorites(mockFavorites);
                setLoading(false);
            }, 500); */
        } catch (error) {
            console.error('Fetch favorites error:', error);
            setFavorites(mockFavorites);
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        if (!confirm('Remove this property from favorites?')) return;

        try {
            await propertyService.removeFromFavorites(id);
            setFavorites(favorites.filter(f => f.id !== id));
        } catch (error) {
            console.error('Remove favorite error:', error);
            alert('Failed to remove from favorites');
        }
    };

    const handleClearAll = async () => {
        if (!confirm('Remove all properties from favorites?')) return;

        try {
            await propertyService.clearFavorites();
            setFavorites([]);
            alert('All favorites cleared');
        } catch (error) {
            console.error('Clear favorites error:', error);
            alert('Failed to clear favorites');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-white fill-white" />
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900">My Favorites</h1>
                            </div>
                            <p className="text-gray-600 ml-15">
                                {favorites.length} saved {favorites.length === 1 ? 'property' : 'properties'}
                            </p>
                        </div>

                        {favorites.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center gap-2"
                            >
                                <Trash2 className="w-5 h-5" />
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                        <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-pink-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Favorites Yet</h2>
                        <p className="text-gray-600 mb-6">
                            Start exploring properties and save your favorites here
                        </p>
                        <button
                            onClick={() => navigate('/properties')}
                            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-light transition-colors font-medium inline-flex items-center gap-2"
                        >
                            Browse Properties
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Saved Date Info */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                <strong>Tip:</strong> Properties are sorted by the date you saved them. Most recent saves appear first.
                            </p>
                        </div>

                        {/* Properties Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map(property => (
                                <div key={property.id} className="relative">
                                    <PropertyCard property={property} />

                                    {/* Remove Button Overlay */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(property.id);
                                        }}
                                        className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg z-10"
                                        title="Remove from favorites"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>

                                    {/* Saved Date */}
                                    <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full">
                                        <p className="text-xs text-gray-600">
                                            Saved: {new Date(property.savedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}