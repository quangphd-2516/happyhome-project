// src/components/admin/UserTable.jsx
import { Eye, Ban, CheckCircle, MoreVertical, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import UserStatusBadge from './UserStatusBadge';

export default function UserTable({ users, onViewDetail, onBlockUser, onUnblockUser }) {
    const [showMenu, setShowMenu] = useState(null);

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(new Date(date));
    };

    const handleAction = (action, user, e) => {
        e.stopPropagation();
        setShowMenu(null);

        switch (action) {
            case 'view':
                onViewDetail(user);
                break;
            case 'block':
                onBlockUser(user.id);
                break;
            case 'unblock':
                onUnblockUser(user.id);
                break;
            default:
                break;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Người dùng</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Liên hệ</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vai trò</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái KYC</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày tham gia</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => onViewDetail(user)}
                            >
                                {/* User */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.avatar || 'https://i.pravatar.cc/150'}
                                            alt={user.fullName}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">{user.fullName}</p>
                                            <p className="text-xs text-gray-500">ID: {user.id.slice(0, 8)}...</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Contact */}
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="w-3.5 h-3.5" />
                                            <span className="truncate max-w-[200px]">{user.email}</span>
                                        </div>
                                        {user.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-3.5 h-3.5" />
                                                <span>{user.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* Role */}
                                <td className="px-6 py-4">
                                    <UserStatusBadge type="role" value={user.role} />
                                </td>

                                {/* KYC Status */}
                                <td className="px-6 py-4">
                                    <UserStatusBadge type="kyc" value={user.kycStatus} />
                                </td>

                                {/* Account Status */}
                                <td className="px-6 py-4">
                                    <UserStatusBadge
                                        type="status"
                                        value={user.isBlocked ? 'blocked' : 'active'}
                                    />
                                    {user.isVerified && (
                                        <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                                            <CheckCircle className="w-3 h-3" />
                                            <span>Đã xác thực email</span>
                                        </div>
                                    )}
                                </td>

                                {/* Joined Date */}
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-600">
                                        {formatDate(user.createdAt)}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowMenu(showMenu === user.id ? null : user.id);
                                            }}
                                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            <MoreVertical className="w-5 h-5 text-gray-600" />
                                        </button>

                                        {showMenu === user.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                                                <button
                                                    onClick={(e) => handleAction('view', user, e)}
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Xem chi tiết
                                                </button>

                                                {user.isBlocked ? (
                                                    <button
                                                        onClick={(e) => handleAction('unblock', user, e)}
                                                        className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors flex items-center gap-2"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        Bỏ chặn
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => handleAction('block', user, e)}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                                    >
                                                        <Ban className="w-4 h-4" />
                                                        Chặn người dùng
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}