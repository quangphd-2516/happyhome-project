// src/components/property/PropertyMap.jsx
import { MapPin } from 'lucide-react';

export default function PropertyMap({ properties, center }) {
    // Note: Cần cài react-leaflet hoặc @react-google-maps/api
    // Đây là placeholder UI

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-96 bg-gray-200">
                {/* Placeholder Map */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Map View</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Install react-leaflet or Google Maps to view map
                        </p>
                    </div>
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50">
                        +
                    </button>
                    <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50">
                        −
                    </button>
                </div>
            </div>

            {/* Property Count */}
            <div className="p-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                    Showing <span className="font-bold text-primary">{properties?.length || 0}</span> properties on map
                </p>
            </div>
        </div>
    );
}