// src/components/property/PropertyForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, DollarSign, Maximize2, Bed, Bath, Compass, FileText, Image as ImageIcon, MapPin } from 'lucide-react';
import ImageUploadMultiple from './ImageUploadMultiple';
import LocationPicker from './LocationPicker';
import { propertyService } from '../../services/propertyService';

export default function PropertyForm({ initialData = null, mode = 'create' }) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    console.log("initialData nhận được từ EditProperty:", initialData);

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        type: initialData?.type || '',
        price: initialData?.price ? parseFloat(initialData.price) : '',
        area: initialData?.area ? parseFloat(initialData.area) : '',
        bedrooms: initialData?.bedrooms ? parseInt(initialData.bedrooms) : '',
        bathrooms: initialData?.bathrooms ? parseInt(initialData.bathrooms) : '',
        floors: initialData?.floors ? parseInt(initialData.floors) : '',
        direction: initialData?.direction || '',
        hasLegalDoc: initialData?.hasLegalDoc || false,
        isFurnished: initialData?.isFurnished || false,
        images: Array.isArray(initialData?.images)
            ? initialData.images.filter(img => typeof img === 'string' && img.trim() !== '')
            : [],
        // keep both flat address fields AND a location object used by LocationPicker
        address: initialData?.address || '',
        city: initialData?.city || '',
        district: initialData?.district || '',
        ward: initialData?.ward || '',
        latitude: initialData?.latitude ? parseFloat(initialData.latitude) : '',
        longitude: initialData?.longitude ? parseFloat(initialData.longitude) : '',
        // <-- add location object so LocationPicker has a value immediately
        location: {
            address: initialData?.address || '',
            city: initialData?.city || '',
            district: initialData?.district || '',
            ward: initialData?.ward || '',
            latitude: initialData?.latitude ? parseFloat(initialData.latitude) : '',
            longitude: initialData?.longitude ? parseFloat(initialData.longitude) : '',
        },
    });

    // sync when initialData arrives (so edit form fills correctly)
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                type: initialData.type || '',
                price: initialData.price ? parseFloat(initialData.price) : '',
                area: initialData.area ? parseFloat(initialData.area) : '',
                bedrooms: initialData.bedrooms ? parseInt(initialData.bedrooms) : '',
                bathrooms: initialData.bathrooms ? parseInt(initialData.bathrooms) : '',
                floors: initialData.floors ? parseInt(initialData.floors) : '',
                direction: initialData.direction || '',
                hasLegalDoc: initialData.hasLegalDoc || false,
                isFurnished: initialData.isFurnished || false,
                images: Array.isArray(initialData.images)
                    ? initialData.images.filter(img => typeof img === 'string' && img.trim() !== '')
                    : [],
                address: initialData.address || '',
                city: initialData.city || '',
                district: initialData.district || '',
                ward: initialData.ward || '',
                latitude: initialData.latitude ? parseFloat(initialData.latitude) : '',
                longitude: initialData.longitude ? parseFloat(initialData.longitude) : '',
                // set location object too
                location: {
                    address: initialData.address || '',
                    city: initialData.city || '',
                    district: initialData.district || '',
                    ward: initialData.ward || '',
                    latitude: initialData.latitude ? parseFloat(initialData.latitude) : '',
                    longitude: initialData.longitude ? parseFloat(initialData.longitude) : '',
                },
            });
        }
    }, [initialData]);

    const propertyTypes = ['HOUSE', 'APARTMENT', 'LAND', 'VILLA', 'SHOPHOUSE'];
    const directions = ['North', 'South', 'East', 'West', 'Northeast', 'Northwest', 'Southeast', 'Southwest'];

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError('');
    };
    const handleLocationChange = (location) => {
        setFormData(prev => ({
            ...prev,
            location,
            address: location.address || prev.address,
            city: location.city || prev.city,
            district: location.district || prev.district,
            ward: location.ward || prev.ward,
            latitude: location.latitude != null ? parseFloat(location.latitude) : prev.latitude,
            longitude: location.longitude != null ? parseFloat(location.longitude) : prev.longitude,
        }));
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError('Title is required');
            return false;
        }
        if (!formData.type) {
            setError('Property type is required');
            return false;
        }
        if (!formData.price || formData.price <= 0) {
            setError('Valid price is required');
            return false;
        }
        if (!formData.area || formData.area <= 0) {
            setError('Valid area is required');
            return false;
        }
        if (!formData.location.address || !formData.location.city) {
            setError('Address and city are required');
            return false;
        }
        if (formData.images.length === 0) {
            setError('At least one image is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setError('');

        try {
            const data = {
                ...formData,
                ...formData.location,
                images: formData.images.filter(img => typeof img === 'string' && img.trim() !== ''),
            };

            console.log("📦 Submit data:", data);

            if (mode === 'edit') {
                await propertyService.update(initialData.id, data);
                alert('Property updated successfully!');
            } else {
                await propertyService.create(data);
                alert('Property created successfully!');
            }

            navigate('/properties/my-properties');
        } catch (err) {
            console.error('❌ Submit error:', err);
            setError(err.response?.data?.message || 'Failed to save property');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error Alert */}
            {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            )}

            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Thông tin cơ bản</h2>
                        <p className="text-sm text-gray-500">Nhập thông tin chi tiết về bất động sản</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Tiêu đề bất động sản <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="VD: Biệt thự 3 phòng ngủ hiện đại có hồ bơi"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Mô tả <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Mô tả chi tiết về bất động sản..."
                            rows={5}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">{formData.description.length} ký tự</p>
                    </div>

                    {/* Type & Price */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <Home className="w-4 h-4" />
                                Loại bất động sản <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => handleChange('type', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                required
                            >
                                <option value="">Chọn loại</option>
                                {propertyTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Giá trị (VNĐ) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleChange('price', e.target.value)}
                                placeholder="1000000"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Home className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Chi tiết bất động sản</h2>
                        <p className="text-sm text-gray-500">Thông số và tiện ích</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Maximize2 className="w-4 h-4" />
                             Diện tích (m²) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={formData.area}
                            onChange={(e) => handleChange('area', e.target.value)}
                            placeholder="100"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Bed className="w-4 h-4" />
                             Phòng ngủ
                        </label>
                        <input
                            type="number"
                            value={formData.bedrooms}
                            onChange={(e) => handleChange('bedrooms', e.target.value)}
                            placeholder="3"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Bath className="w-4 h-4" />
                             Phòng tắm
                        </label>
                        <input
                            type="number"
                            value={formData.bathrooms}
                            onChange={(e) => handleChange('bathrooms', e.target.value)}
                            placeholder="2"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Số tầng
                        </label>
                        <input
                            type="number"
                            value={formData.floors}
                            onChange={(e) => handleChange('floors', e.target.value)}
                            placeholder="2"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Compass className="w-4 h-4" />
                            Hướng
                        </label>
                        <select
                            value={formData.direction}
                            onChange={(e) => handleChange('direction', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                            <option value="">Chọn hướng</option>
                            {directions.map(dir => (
                                <option key={dir} value={dir}>{dir}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-3 space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.hasLegalDoc}
                                onChange={(e) => handleChange('hasLegalDoc', e.target.checked)}
                                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <span className="text-sm font-medium text-gray-900">Có giấy tờ pháp lý</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isFurnished}
                                onChange={(e) => handleChange('isFurnished', e.target.checked)}
                                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <span className="text-sm font-medium text-gray-900">Đầy đủ nội thất</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Vị trí</h2>
                        <p className="text-sm text-gray-500">Bất động sản nằm ở đâu?</p>
                    </div>
                </div>

                <LocationPicker value={formData.location} onChange={handleLocationChange} />
            </div>

            {/* Images */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Hình ảnh bất động sản</h2>
                        <p className="text-sm text-gray-500">Tải lên ảnh chất lượng cao</p>
                    </div>
                </div>

                <ImageUploadMultiple
                    images={formData.images}
                    onChange={(images) => handleChange('images', images)}
                />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                    className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                    {isSubmitting ? 'Đang lưu...' : mode === 'edit' ? 'Cập nhật bất động sản' : 'Tạo mới bất động sản'}
                </button>
            </div>
        </form>
    );
}