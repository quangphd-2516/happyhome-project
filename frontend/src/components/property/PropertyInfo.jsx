// src/components/property/PropertyInfo.jsx
import {
    Bed, Bath, Maximize2, Calendar, Home, MapPin,
    Compass, Building, Ruler, DoorOpen
} from 'lucide-react';

export default function PropertyInfo({ property }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
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
        { icon: Bed, label: 'Bedrooms', value: property.bedrooms || 'N/A' },
        { icon: Bath, label: 'Bathrooms', value: property.bathrooms || 'N/A' },
        { icon: Maximize2, label: 'Area', value: `${property.area} m²` },
        { icon: DoorOpen, label: 'Floors', value: property.floors || 'N/A' },
    ];

    const details = [
        { label: 'Property Type', value: property.type, icon: Home },
        { label: 'Property ID', value: `#${property.id}`, icon: Building },
        { label: 'Location', value: property.address, icon: MapPin },
        { label: 'Direction', value: property.direction || 'N/A', icon: Compass },
        { label: 'Legal Status', value: property.legalStatus || 'Full ownership', icon: Building },
        { label: 'Posted Date', value: formatDate(property.createdAt || new Date()), icon: Calendar },
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
                <p className="text-sm font-medium mb-2 opacity-90">Property Price</p>
                <div className="flex items-baseline gap-3">
                    <h2 className="text-4xl font-bold">{formatPrice(property.price)}</h2>
                    <span className="text-lg opacity-90">
                        {formatPrice(property.price / property.area)}/m²
                    </span>
                </div>
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Key Features</h3>
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                    {property.description ||
                        'This stunning property offers exceptional living spaces with modern amenities and elegant design. Located in a prime area, it provides easy access to shopping, dining, and entertainment options. The property features high-quality finishes throughout, spacious rooms, and abundant natural light. Perfect for those seeking comfort and luxury in a convenient location.'}
                </p>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Property Details</h3>
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
                <h3 className="text-xl font-bold text-gray-900 mb-6">Amenities</h3>
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
                <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
                <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                        <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                        <p className="text-gray-600">Map View</p>
                        <p className="text-sm text-gray-500 mt-1">{property.address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}