// src/components/property/PropertyInfo.jsx
import {
    Bed, Bath, Maximize2, Calendar, Home, MapPin,
    Compass, Building, Ruler, DoorOpen
} from 'lucide-react';

export default function PropertyInfo({ property }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(date));
    };

    const features = [
        { icon: Bed, label: 'Phòng ngủ', value: property.bedrooms || 'Không rõ' },
        { icon: Bath, label: 'Phòng tắm', value: property.bathrooms || 'Không rõ' },
        { icon: Maximize2, label: 'Diện tích', value: `${property.area} m²` },
        { icon: DoorOpen, label: 'Số tầng', value: property.floors || 'Không rõ' },
    ];

    const details = [
        { label: 'Loại bất động sản', value: property.type, icon: Home },
        { label: 'Mã BĐS', value: `#${property.id}`, icon: Building },
        { label: 'Vị trí', value: property.address, icon: MapPin },
        { label: 'Hướng', value: property.direction || 'Không rõ', icon: Compass },
        { label: 'Tình trạng pháp lý', value: property.legalStatus || 'Sổ hồng đầy đủ', icon: Building },
        { label: 'Ngày đăng', value: formatDate(property.createdAt || new Date()), icon: Calendar },
    ];

    const amenities = property.amenities || [
        'Air Conditioning',
        'Swimming Pool',
        'Gym',
        'Parking',
        'Security',
        'Garden',
        'Balcony',
        'Elevator',
    ];

    return (
        <div className="space-y-6">
            {/* Price Section */}
            <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-6 text-white">
                <p className="text-sm font-medium mb-2 opacity-90">Giá bất động sản</p>
                <div className="flex items-baseline gap-3">
                    <h2 className="text-4xl font-bold">{formatPrice(property.price)}</h2>
                    <span className="text-lg opacity-90">
                        {formatPrice(property.price / property.area)}/m²
                    </span>
                </div>
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Các thông tin nổi bật</h3>
                <div className="grid grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{feature.label}</p>
                                <p className="text-lg font-bold text-gray-900">{feature.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mô tả</h3>
                <p className="text-gray-700 leading-relaxed">
                    {property.description || 'Bất động sản này nổi bật với không gian sống tiện nghi, sang trọng, vị trí thuận lợi, dễ dàng tiếp cận các tiện ích. Thiết kế đẹp, hiện đại, ánh sáng tự nhiên, lý tưởng cho những ai tìm kiếm cuộc sống tiện nghi tại vị trí hoàn hảo.'}
                </p>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Chi tiết bất động sản</h3>
                <div className="space-y-4">
                    {details.map((detail, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <detail.icon className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-600">{detail.label}</span>
                            </div>
                            <span className="font-semibold text-gray-900">{detail.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Tiện ích</h3>
                <div className="grid grid-cols-2 gap-3">
                    {amenities.map((amenity, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 text-gray-700"
                        >
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span>{amenity}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Location Map Placeholder */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Vị trí</h3>
                <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                        <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                        <p className="text-gray-600">Xem bản đồ</p>
                        <p className="text-sm text-gray-500 mt-1">{property.address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}