// frontend/src/components/admin/AuctionTable.jsx
import {
    Eye,
    Clock,
    CheckCircle,
    XCircle,
    Calendar,
    Users,
    Gavel,
    TrendingUp,
    Ban
} from 'lucide-react';

export default function AuctionTable({ data, onViewDetail, onRefresh }) {
    const getStatusConfig = (status) => {
        const configs = {
            UPCOMING: {
                bg: 'bg-purple-100',
                text: 'text-purple-800',
                border: 'border-purple-200',
                icon: Calendar,
                label: 'Sắp diễn ra'
            },
            ONGOING: {
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                border: 'border-blue-200',
                icon: Clock,
                label: 'Đang diễn ra'
            },
            COMPLETED: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-200',
                icon: CheckCircle,
                label: 'Hoàn thành'
            },
            CANCELLED: {
                bg: 'bg-red-100',
                text: 'text-red-800',
                border: 'border-red-200',
                icon: Ban,
                label: 'Đã hủy'
            }
        };
        return configs[status] || configs.UPCOMING;
    };

    const StatusBadge = ({ status }) => {
        const config = getStatusConfig(status);
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
                <Icon className="w-3.5 h-3.5" />
                {config.label}
            </span>
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateTimeRemaining = (endTime) => {
        const end = new Date(endTime);
        const now = new Date();
        const diff = end - now;

        if (diff <= 0) return 'Ended';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days}d ${hours}h`;
        return `${hours}h`;
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Bất động sản</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tiêu đề phiên</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Giá</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Thời gian</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Hoạt động</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((auction) => (
                        <tr
                            key={auction.id}
                            className="hover:bg-gray-50 transition-colors duration-150"
                        >
                            {/* Property */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={auction.property.thumbnail || auction.property.images?.[0]}
                                        alt={auction.property.tittle}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-900 max-w-[200px] truncate">
                                            {auction.property.title}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {auction.property.type} • {auction.property.area}m²
                                        </div>
                                    </div>
                                </div>
                            </td>

                            {/* Auction Title */}
                            <td className="px-6 py-4">
                                <div className="font-medium text-gray-900 max-w-[250px]">
                                    {auction.title}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    ID: {auction.id.slice(0, 12)}...
                                </div>
                            </td>

                            {/* Price Info */}
                            <td className="px-6 py-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">Bắt đầu:</span>
                                        <span className="font-semibold text-gray-900">
                                            {formatCurrency(auction.startPrice)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">Hiện tại:</span>
                                        <span className="font-bold text-green-600">
                                            {formatCurrency(auction.currentPrice)}
                                        </span>
                                    </div>
                                    {auction.currentPrice > auction.startPrice && (
                                        <div className="flex items-center gap-1 text-xs text-green-600">
                                            <TrendingUp className="w-3 h-3" />
                                            <span>
                                                +{formatCurrency(auction.currentPrice - auction.startPrice)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </td>

                            {/* Time */}
                            <td className="px-6 py-4">
                                <div className="space-y-1 text-sm">
                                    <div className="text-gray-600">
                                        Start: {formatDate(auction.startTime)}
                                    </div>
                                    <div className="text-gray-600">
                                        End: {formatDate(auction.endTime)}
                                    </div>
                                    {auction.status === 'ONGOING' && (
                                        <div className="flex items-center gap-1 text-red-600 font-semibold">
                                            <Clock className="w-3 h-3" />
                                            {calculateTimeRemaining(auction.endTime)} left
                                        </div>
                                    )}
                                </div>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4">
                                <StatusBadge status={auction.status} />
                            </td>

                            {/* Activity */}
                            <td className="px-6 py-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Gavel className="w-4 h-4 text-gray-400" />
                                        <span className="font-semibold text-gray-900">
                                            {auction._count?.bids || 0}<span className="text-gray-500"> lượt trả giá</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span className="font-semibold text-gray-900">
                                            {auction._count?.participants || 0}<span className="text-gray-500"> người tham gia</span>
                                        </span>
                                    </div>
                                </div>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => onViewDetail(auction.id)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
                                >
                                    <Eye className="w-4 h-4" />
                                    Xem
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}