// src/components/user/KYCForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, User as UserIcon, Camera, Calendar, MapPin } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { kycService } from '../../services/kycService';

export default function KYCForm() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        idCardNumber: '',
        fullName: '',
        dateOfBirth: '',
        address: '',
        idCardFront: null,
        idCardBack: null,
        selfieWithId: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleImageChange = (field, file) => {
        setFormData(prev => ({ ...prev, [field]: file }));
    };

    const validateForm = () => {
        if (!formData.idCardNumber.trim()) {
            setError('Vui lòng nhập số CMND/CCCD');
            return false;
        }
        if (!formData.fullName.trim()) {
            setError('Vui lòng nhập họ và tên');
            return false;
        }
        if (!formData.dateOfBirth) {
            setError('Vui lòng chọn ngày sinh');
            return false;
        }
        if (!formData.address.trim()) {
            setError('Vui lòng nhập địa chỉ');
            return false;
        }
        if (!formData.idCardFront) {
            setError('Vui lòng tải ảnh mặt trước CMND/CCCD');
            return false;
        }
        if (!formData.idCardBack) {
            setError('Vui lòng tải ảnh mặt sau CMND/CCCD');
            return false;
        }
        if (!formData.selfieWithId) {
            setError('Vui lòng tải ảnh selfie cùng CMND/CCCD');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Upload images first
            const [frontRes, backRes, selfieRes] = await Promise.all([
                kycService.uploadKYCImage(formData.idCardFront, 'idCardFront'),
                kycService.uploadKYCImage(formData.idCardBack, 'idCardBack'),
                kycService.uploadKYCImage(formData.selfieWithId, 'selfieWithId'),
            ]);

            // Submit KYC data
            await kycService.submitKYC({
                idCardNumber: formData.idCardNumber,
                fullName: formData.fullName,
                dateOfBirth: formData.dateOfBirth,
                address: formData.address,
                idCardFront: frontRes.url,
                idCardBack: backRes.url,
                selfieWithId: selfieRes.url,
            });

            alert('Gửi KYC thành công! Hồ sơ của bạn sẽ được duyệt trong 24-48 giờ.');
            navigate('/profile');

        } catch (err) {
            console.error('KYC submission error:', err);
            setError(err.response?.data?.message || 'Gửi KYC thất bại. Vui lòng thử lại.');
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

            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Thông tin cá nhân</h2>
                        <p className="text-sm text-gray-500">Nhập thông tin cá nhân đúng như trên giấy tờ</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* ID Card Number */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Số CMND/CCCD <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="idCardNumber"
                            value={formData.idCardNumber}
                            onChange={handleChange}
                            placeholder="Nhập số CMND/CCCD"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            required
                        />
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            required
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Ngày sinh <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ thường trú"
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Upload */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Giấy tờ định danh</h2>
                        <p className="text-sm text-gray-500">Tải lên ảnh CMND/CCCD rõ nét</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* ID Card Front */}
                    <ImageUploader
                        label="CMND/CCCD (Mặt trước)"
                        description="Tải ảnh mặt trước CMND/CCCD"
                        value={formData.idCardFront}
                        onChange={(file) => handleImageChange('idCardFront', file)}
                        required
                        icon={CreditCard}
                    />

                    {/* ID Card Back */}
                    <ImageUploader
                        label="CMND/CCCD (Mặt sau)"
                        description="Tải ảnh mặt sau CMND/CCCD"
                        value={formData.idCardBack}
                        onChange={(file) => handleImageChange('idCardBack', file)}
                        required
                        icon={CreditCard}
                    />
                </div>
            </div>

            {/* Selfie Upload */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                        <Camera className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Xác thực selfie</h2>
                        <p className="text-sm text-gray-500">Chụp ảnh selfie cầm CMND/CCCD</p>
                    </div>
                </div>

                <div className="max-w-md mx-auto">
                    <ImageUploader
                        label="Ảnh selfie cùng CMND/CCCD"
                        description="Cầm CMND/CCCD cạnh mặt và chụp ảnh rõ nét"
                        value={formData.selfieWithId}
                        onChange={(file) => handleImageChange('selfieWithId', file)}
                        required
                        icon={Camera}
                    />
                </div>

                {/* Guidelines */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <h3 className="font-semibold text-blue-900 mb-2">Hướng dẫn chụp selfie:</h3>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                        <li>Giữ CMND/CCCD cạnh khuôn mặt</li>
                        <li>Ảnh phải thấy rõ mặt và thông tin CMND/CCCD</li>
                        <li>Ánh sáng tốt, không bị đổ bóng</li>
                        <li>Tháo kính/đội mũ (nếu có)</li>
                        <li>Nhìn thẳng vào camera</li>
                    </ul>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    disabled={isSubmitting}
                    className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Đang gửi...
                        </span>
                    ) : (
                        'Gửi KYC'
                    )}
                </button>
            </div>
        </form>
    );
}