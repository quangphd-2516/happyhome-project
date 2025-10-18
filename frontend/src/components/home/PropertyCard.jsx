import { MapPin, Bed, Maximize } from 'lucide-react';

export default function PropertyCard({ property }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={property.image}
                    alt={property.location}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{property.location}</span>
                </div>

                {/* Details */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Maximize className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{property.area}</span>
                    </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                        {property.price}
                    </div>
                    <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-light transition-colors font-medium">
                        View All
                    </button>
                </div>
            </div>
        </div>
    );
}