// frontend/src/components/admin/KYCTable.jsx
import {
    Eye,
    Clock,
    CheckCircle,
    XCircle,
    User,
    Calendar,
    CreditCard,
    MoreVertical,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const KYCTable = ({ data, onReview, onRefresh }) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [showActionMenu, setShowActionMenu] = useState(null);

    const getStatusConfig = (status) => {
        const configs = {
            PENDING: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                border: 'border-yellow-200',
                icon: Clock,
                label: 'Pending'
            },
            APPROVED: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-200',
                icon: CheckCircle,
                label: 'Approved'
            },
            REJECTED: {
                bg: 'bg-red-100',
                text: 'text-red-800',
                border: 'border-red-200',
                icon: XCircle,
                label: 'Rejected'
            }
        };
        return configs[status] || configs.PENDING;
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

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(data.map(item => item.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedRows(prev =>
            prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left">
                            <input
                                type="checkbox"
                                checked={selectedRows.length === data.length && data.length > 0}
                                onChange={handleSelectAll}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            User
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            ID Card
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Submitted
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((kyc) => (
                        <tr
                            key={kyc.id}
                            className={`hover:bg-gray-50 transition-colors duration-150 ${selectedRows.includes(kyc.id) ? 'bg-blue-50' : ''
                                }`}
                        >
                            <td className="px-6 py-4">
                                <input
                                    type="checkbox"
                                    checked={selectedRows.includes(kyc.id)}
                                    onChange={() => handleSelectRow(kyc.id)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                        {kyc.user?.fullName?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {kyc.user?.fullName || 'Unknown User'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {kyc.user?.email}
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-gray-900">
                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                    <span className="font-mono font-medium">{kyc.idCardNumber}</span>
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{formatDate(kyc.createdAt)}</span>
                                </div>
                            </td>

                            <td className="px-6 py-4">
                                <StatusBadge status={kyc.status} />
                            </td>

                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onReview(kyc.id)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Review
                                    </button>

                                    <div className="relative">
                                        <button
                                            onClick={() => setShowActionMenu(showActionMenu === kyc.id ? null : kyc.id)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <MoreVertical className="w-5 h-5 text-gray-600" />
                                        </button>

                                        {showActionMenu === kyc.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => {
                                                            onReview(kyc.id);
                                                            setShowActionMenu(null);
                                                        }}
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View Details
                                                    </button>
                                                    {kyc.status === 'PENDING' && (
                                                        <>
                                                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-700 hover:bg-green-50">
                                                                <CheckCircle className="w-4 h-4" />
                                                                Quick Approve
                                                            </button>
                                                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                                                                <XCircle className="w-4 h-4" />
                                                                Quick Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedRows.length > 0 && (
                <div className="sticky bottom-0 bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="font-medium">{selectedRows.length} selected</span>
                        <button
                            onClick={() => setSelectedRows([])}
                            className="text-blue-100 hover:text-white text-sm underline"
                        >
                            Clear selection
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                            Bulk Approve
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                            Bulk Reject
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KYCTable;