// src/components/user/ProfileHeader.jsx
import { Camera, Trash2, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import { userService } from '../../services/userService';
import { useAuthStore } from '../../store/authStore';

export default function ProfileHeader({ user, onAvatarUpdate }) {
    const { setUser } = useAuthStore();
    const [isUploading, setIsUploading] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const fileInputRef = useRef(null);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn đúng định dạng ảnh');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Kích thước ảnh phải nhỏ hơn 5MB');
            return;
        }

        setIsUploading(true);
        try {
            const response = await userService.uploadAvatar(file);
            const updatedUser = { ...user, avatar: response.data.avatar };
            setUser(updatedUser);
            onAvatarUpdate?.(updatedUser);
            setShowActions(false);
        } catch (error) {
            console.error('Upload avatar error:', error);
            alert('Không thể tải ảnh đại diện');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteAvatar = async () => {
        if (!confirm('Bạn có chắc muốn xóa ảnh đại diện không?')) return;

        setIsUploading(true);
        try {
            await userService.deleteAvatar();
            const updatedUser = { ...user, avatar: null };
            setUser(updatedUser);
            onAvatarUpdate?.(updatedUser);
            setShowActions(false);
        } catch (error) {
            console.error('Delete avatar error:', error);
            alert('Không thể xóa ảnh đại diện');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative group">
                    <div className="relative">
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.fullName}
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-primary border-4 border-white shadow-xl">
                                {getInitials(user.fullName)}
                            </div>
                        )}

                        {/* Camera Icon Overlay */}
                        <button
                            onClick={() => setShowActions(!showActions)}
                            className="absolute bottom-0 right-0 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:scale-110"
                            disabled={isUploading}
                        >
                            <Camera className="w-5 h-5 text-primary" />
                        </button>
                    </div>

                    {/* Actions Dropdown */}
                    {showActions && (
                        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl py-2 min-w-[180px] z-20">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                            >
                                <Upload className="w-4 h-4" />
                                {user.avatar ? 'Đổi ảnh' : 'Tải ảnh'}
                            </button>
                            {user.avatar && (
                                <button
                                    onClick={handleDeleteAvatar}
                                    disabled={isUploading}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Xóa ảnh
                                </button>
                            )}
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>

                {/* User Info */}
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {user.fullName}
                    </h1>
                    <p className="text-white/90 text-lg mb-1">{user.email}</p>
                    {user.phone && (
                        <p className="text-white/80">{user.phone}</p>
                    )}
                    <div className="flex items-center gap-3 mt-4 justify-center md:justify-start">
                        <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                            {user.role === 'ADMIN' ? 'Quản trị viên' : user.role === 'MODERATOR' ? 'Điều phối viên' : 'Người dùng'}
                        </span>
                        {user.isVerified && (
                            <span className="px-4 py-1.5 bg-green-500/20 backdrop-blur-sm rounded-full text-white text-sm font-medium flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                Email đã xác thực
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Close dropdown when click outside */}
            {showActions && (
                <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowActions(false)}
                />
            )}
        </div>
    );
}