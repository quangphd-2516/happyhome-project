// src/components/user/ProfileInfo.jsx
import { useState } from 'react';
import { Edit2, Save, X, Mail, Phone, MapPin, Calendar, User } from 'lucide-react';
import { userService } from '../../services/userService';
import { useAuthStore } from '../../store/authStore';

export default function ProfileInfo({ user: initialUser }) {
    const { setUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        fullName: initialUser.fullName || '',
        phone: initialUser.phone || '',
        // Thêm các field khác nếu cần
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await userService.updateProfile(formData);
            setUser(response.data.user);
            setIsEditing(false);
        } catch (error) {
            console.error('Update profile error:', error);
            alert('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            fullName: initialUser.fullName || '',
            phone: initialUser.phone || '',
        });
        setIsEditing(false);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                        <span className="font-medium">Edit</span>
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary-light rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                )}
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
                {/* Full Name */}
                <div className="grid md:grid-cols-3 gap-4 items-center">
                    <div className="flex items-center gap-3 text-gray-600">
                        <User className="w-5 h-5" />
                        <span className="font-medium">Full Name</span>
                    </div>
                    <div className="md:col-span-2">
                        {isEditing ? (
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        ) : (
                            <p className="text-gray-900 font-medium">{initialUser.fullName}</p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="grid md:grid-cols-3 gap-4 items-center">
                    <div className="flex items-center gap-3 text-gray-600">
                        <Mail className="w-5 h-5" />
                        <span className="font-medium">Email</span>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-gray-900 font-medium">{initialUser.email}</p>
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                </div>

                {/* Phone */}
                <div className="grid md:grid-cols-3 gap-4 items-center">
                    <div className="flex items-center gap-3 text-gray-600">
                        <Phone className="w-5 h-5" />
                        <span className="font-medium">Phone Number</span>
                    </div>
                    <div className="md:col-span-2">
                        {isEditing ? (
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        ) : (
                            <p className="text-gray-900 font-medium">
                                {initialUser.phone || <span className="text-gray-400">Not provided</span>}
                            </p>
                        )}
                    </div>
                </div>

                {/* Member Since */}
                <div className="grid md:grid-cols-3 gap-4 items-center">
                    <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="w-5 h-5" />
                        <span className="font-medium">Member Since</span>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-gray-900 font-medium">
                            {new Date(initialUser.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}