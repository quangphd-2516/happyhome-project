// src/components/property/PropertyCard.jsx
import { MapPin, Bed, Bath, Maximize2, Heart, Eye } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';

export default function PropertyCard({ property }) {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleFavorite = async (e) => {
        e.stopPropagation();
        try {
            if (isFavorite) {
                await propertyService.removeFromFavorites(property.id);
            } else {
                await propertyService.addToFavorites(property.id);
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Favorite error:', error);
        }
    };

    const handleClick = () => {
        navigate(`/properties/${property.id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
        >
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={property.thumbnail || property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {property.isPremium && (
                        <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                            NỔI BẬT
                        </span>
                    )}
                    <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                        {property.type}
                    </span>
                </div>

                {/* Favorite Button */}
                <button
                    onClick={handleFavorite}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                >
                    <Heart
                        className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                    />
                </button>

                {/* Views */}
                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-white" />
                    <span className="text-xs font-medium text-white">{property.views || 0}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {property.title}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm line-clamp-1">{property.address}</span>
                </div>

                {/* Features */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                    {property.bedrooms && (
                        <div className="flex items-center gap-1.5">
                            <Bed className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700 font-medium">{property.bedrooms} Phòng ngủ</span>
                        </div>
                    )}
                    {property.bathrooms && (
                        <div className="flex items-center gap-1.5">
                            <Bath className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700 font-medium">{property.bathrooms} Phòng tắm</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 font-medium">{property.area} m²</span>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-3xl font-bold text-primary">
                            {formatPrice(property.price)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {formatPrice(property.price / property.area)}/m²
                        </p>
                    </div>
                    <button className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium">
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
}