// src/components/admin/UserStatusBadge.jsx
import { CheckCircle, Clock, XCircle, Shield, User } from 'lucide-react';

export default function UserStatusBadge({ type, value }) {
    const configs = {
        role: {
            ADMIN: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Shield, label: 'Quản trị viên' },
            MODERATOR: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Shield, label: 'Điều phối viên' },
            USER: { bg: 'bg-gray-100', text: 'text-gray-700', icon: User, label: 'Người dùng' },
        },
        kyc: {
            APPROVED: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Đã xác thực' },
            PENDING: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Clock, label: 'Chờ duyệt' },
            REJECTED: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Từ chối' },
        },
        status: {
            active: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Đang hoạt động' },
            blocked: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Đã chặn' },
        },
    };

    const config = configs[type]?.[value] || configs[type]?.USER;
    if (!config) return null;

    const Icon = config.icon;

    return (
        <span className={`${config.bg} ${config.text} rounded-full px-3 py-1 text-xs font-medium inline-flex items-center gap-2`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
}