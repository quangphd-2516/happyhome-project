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
            setError('ID Card Number is required');
            return false;
        }
        if (!formData.fullName.trim()) {
            setError('Full Name is required');
            return false;
        }
        if (!formData.dateOfBirth) {
            setError('Date of Birth is required');
            return false;
        }
        if (!formData.address.trim()) {
            setError('Address is required');
            return false;
        }
        if (!formData.idCardFront) {
            setError('ID Card Front image is required');
            return false;
        }
        if (!formData.idCardBack) {
            setError('ID Card Back image is required');
            return false;
        }
        if (!formData.selfieWithId) {
            setError('Selfie with ID is required');
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
                idCardFront: frontRes.data.url,
                idCardBack: backRes.data.url,
                selfieWithId: selfieRes.data.url,
            });

            alert('KYC submitted successfully! Your documents will be reviewed within 24-48 hours.');
            navigate('/profile');

        } catch (err) {
            console.error('KYC submission error:', err);
            setError(err.response?.data?.message || 'Failed to submit KYC. Please try again.');
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
                        <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                        <p className="text-sm text-gray-500">Enter your personal details as shown on your ID</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* ID Card Number */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            ID Card Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="idCardNumber"
                            value={formData.idCardNumber}
                            onChange={handleChange}
                            placeholder="Enter your ID card number"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            required
                        />
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            required
                        />
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Date of Birth <span className="text-red-500">*</span>
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
                            Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your address"
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
                        <h2 className="text-xl font-bold text-gray-900">Identity Documents</h2>
                        <p className="text-sm text-gray-500">Upload clear photos of your ID card</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* ID Card Front */}
                    <ImageUploader
                        label="ID Card (Front)"
                        description="Upload the front side of your ID card"
                        value={formData.idCardFront}
                        onChange={(file) => handleImageChange('idCardFront', file)}
                        required
                        icon={CreditCard}
                    />

                    {/* ID Card Back */}
                    <ImageUploader
                        label="ID Card (Back)"
                        description="Upload the back side of your ID card"
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
                        <h2 className="text-xl font-bold text-gray-900">Selfie Verification</h2>
                        <p className="text-sm text-gray-500">Take a selfie while holding your ID card</p>
                    </div>
                </div>

                <div className="max-w-md mx-auto">
                    <ImageUploader
                        label="Selfie with ID Card"
                        description="Hold your ID card next to your face and take a clear photo"
                        value={formData.selfieWithId}
                        onChange={(file) => handleImageChange('selfieWithId', file)}
                        required
                        icon={Camera}
                    />
                </div>

                {/* Guidelines */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <h3 className="font-semibold text-blue-900 mb-2">Selfie Guidelines:</h3>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                        <li>Hold your ID card next to your face</li>
                        <li>Make sure your face and ID details are clearly visible</li>
                        <li>Use good lighting - avoid shadows</li>
                        <li>Remove sunglasses or hats</li>
                        <li>Look directly at the camera</li>
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
                    Cancel
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
                            Submitting...
                        </span>
                    ) : (
                        'Submit KYC'
                    )}
                </button>
            </div>
        </form>
    );
}