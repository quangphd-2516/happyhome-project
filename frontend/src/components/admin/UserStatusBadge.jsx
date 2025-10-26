// src/components/admin/UserStatusBadge.jsx
import { CheckCircle, Clock, XCircle, Shield, User } from 'lucide-react';

export default function UserStatusBadge({ type, value }) {
    const configs = {
        role: {
            ADMIN: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Shield, label: 'Admin' },
            MODERATOR: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Shield, label: 'Moderator' },
            USER: { bg: 'bg-gray-100', text: 'text-gray-700', icon: User, label: 'User' },
        },
        kyc: {
            APPROVED: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Approved' },
            PENDING: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Clock, label: 'Pending' },
            REJECTED: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Rejected' },
        },
        status: {
            active: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Active' },
            blocked: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Blocked' },
        },
    };

    const config = configs[type]?.[value] || configs[type]?.USER;
    if (!config) return null;

    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${config.bg} ${config.text} rounded-full text-xs font-semibold`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
}