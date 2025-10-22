// src/components/property/LocationPicker.jsx
import { MapPin, Navigation } from 'lucide-react';

export default function LocationPicker({ value, onChange }) {
    const cities = [
        'Hanoi', 'Ho Chi Minh', 'Da Nang', 'Can Tho', 'Hai Phong',
        'Nha Trang', 'Hue', 'Vung Tau', 'Bien Hoa', 'Phu Quoc'
    ];

    const handleChange = (field, val) => {
        onChange({ ...value, [field]: val });
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    handleChange('latitude', position.coords.latitude);
                    handleChange('longitude', position.coords.longitude);
                    alert('Location captured successfully!');
                },
                (error) => {
                    alert('Unable to get location. Please enter manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    };

    return (
        <div className="space-y-6">
            {/* Address */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={value?.address || ''}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="123 Main Street"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                    />
                </div>
            </div>

            {/* City, District, Ward */}
            <div className="grid md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        City/Province <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={value?.city || ''}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                    >
                        <option value="">Select City</option>
                        {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        District <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={value?.district || ''}
                        onChange={(e) => handleChange('district', e.target.value)}
                        placeholder="District name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Ward <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={value?.ward || ''}
                        onChange={(e) => handleChange('ward', e.target.value)}
                        placeholder="Ward name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                    />
                </div>
            </div>

            {/* Coordinates */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-900">
                        Coordinates (Optional)
                    </label>
                    <button
                        type="button"
                        onClick={handleGetLocation}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <Navigation className="w-4 h-4" />
                        <span className="text-sm font-medium">Get Current Location</span>
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                        <input
                            type="number"
                            step="any"
                            value={value?.latitude || ''}
                            onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
                            placeholder="21.0285"
                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Longitude</label>
                        <input
                            type="number"
                            step="any"
                            value={value?.longitude || ''}
                            onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
                            placeholder="105.8542"
                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>
            </div>

            {/* Map Preview Placeholder */}
            <div className="bg-gray-100 rounded-xl p-8 text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Map preview will appear here</p>
            </div>
        </div>
    );
}