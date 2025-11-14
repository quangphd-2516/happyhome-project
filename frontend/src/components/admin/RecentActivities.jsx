// src/components/admin/RecentActivities.jsx
import {
    UserPlus, Home, Gavel, DollarSign,
    CheckCircle, XCircle, Clock
} from 'lucide-react';

export default function RecentActivities({ activities }) {
    const getIcon = (type) => {
        const icons = {
            USER_REGISTERED: UserPlus,
            PROPERTY_CREATED: Home,
            AUCTION_CREATED: Gavel,
            BID_PLACED: DollarSign,
            KYC_APPROVED: CheckCircle,
            KYC_REJECTED: XCircle,
            PROPERTY_APPROVED: CheckCircle,
        };
        return icons[type] || Clock;
    };

    const getColor = (type) => {
        const colors = {
            USER_REGISTERED: 'bg-blue-100 text-blue-600',
            PROPERTY_CREATED: 'bg-green-100 text-green-600',
            AUCTION_CREATED: 'bg-purple-100 text-purple-600',
            BID_PLACED: 'bg-orange-100 text-orange-600',
            KYC_APPROVED: 'bg-emerald-100 text-emerald-600',
            KYC_REJECTED: 'bg-red-100 text-red-600',
            PROPERTY_APPROVED: 'bg-teal-100 text-teal-600',
        };
        return colors[type] || 'bg-gray-100 text-gray-600';
    };

    const formatTime = (date) => {
        const now = new Date();
        const activityDate = new Date(date);
        const diffMs = now - activityDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return activityDate.toLocaleDateString();
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Hoạt động gần đây</h3>
                    <p className="text-sm text-gray-600">Các hoạt động mới nhất trong hệ thống</p>
                </div>
                <button className="text-sm text-primary hover:text-primary-light font-medium">Xem tất cả</button>
            </div>

            <div className="space-y-4">
                {activities.map((activity) => {
                    const Icon = getIcon(activity.type);
                    const colorClass = getColor(activity.type);

                    return (
                        <div
                            key={activity.id}
                            className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-5 h-5" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 mb-1">
                                    {activity.title}
                                </p>
                                <p className="text-xs text-gray-600 line-clamp-2">
                                    {activity.description}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formatTime(activity.createdAt)}
                                </p>
                            </div>

                            {activity.user && (
                                <img
                                    src={activity.user.avatar || 'https://i.pravatar.cc/150'}
                                    alt={activity.user.fullName}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}