import { MapPin, Bed, Maximize } from 'lucide-react';

export default function PropertyCard({ property, onViewDetails }) {
    // DEBUG: Log để xem cấu trúc property
    console.log('🏠 Property data:', property);

    // Format giá tiền
    const formatPrice = (price) => {
        if (typeof price === 'number') {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(price);
        }
        return price;
    };

    // Lấy URL ảnh từ nhiều nguồn có thể
    const getImageUrl = () => {
        // Thử các tên field phổ biến
        const imageFields = [
            property.image,
            property.imageUrl,
            property.img,
            property.thumbnail,
            property.photo,
            property.images?.[0], // Nếu là array
            property.propertyImages?.[0],
            property.mainImage
        ];

        // Tìm field đầu tiên không null/undefined
        const imageUrl = imageFields.find(url => url);

        console.log('🖼️ Image URL found:', imageUrl);

        return imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=300&fit=crop';
    };

    // Xử lý ảnh bị lỗi
    const handleImageError = (e) => {
        console.warn('⚠️ Image load failed, using placeholder');
        e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=300&fit=crop';
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
            {/* Image */}
            <div className="relative h-64 overflow-hidden bg-gray-200">
                <img
                    src={getImageUrl()}
                    alt={property.title || property.name || property.location}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    onError={handleImageError}
                    loading="lazy"
                />
                {/* Badge nếu có */}
                {property.featured && (
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Nổi bật
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Title (nếu có) */}
                {(property.title || property.name) && (
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                        {property.title || property.name}
                    </h3>
                )}

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium line-clamp-1">
                        {property.location || property.address || 'Chưa cập nhật'}
                    </span>
                </div>

                {/* Details */}
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                    {(property.bedrooms || property.bedroom) && (
                        <div className="flex items-center gap-1.5">
                            <Bed className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                                {property.bedrooms || property.bedroom} Phòng ngủ
                            </span>
                        </div>
                    )}
                    {(property.area || property.size || property.squareFeet) && (
                        <div className="flex items-center gap-1.5">
                            <Maximize className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                                {property.area || property.size || property.squareFeet} m²
                            </span>
                        </div>
                    )}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between gap-4">
                    <div className="text-2xl font-bold text-primary">
                        {formatPrice(property.price)}
                    </div>
                    <button
                        onClick={() => onViewDetails && onViewDetails(property)}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all font-medium whitespace-nowrap hover:scale-105 active:scale-95"
                        aria-label={`Xem chi tiết ${property.title || property.location}`}
                    >
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
}