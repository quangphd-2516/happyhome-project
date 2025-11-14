// src/components/user/KYCStatus.jsx
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function KYCStatus({ status }) {
    const navigate = useNavigate();

    const statusConfig = {
        APPROVED: {
            icon: CheckCircle,
            text: 'Đã xác thực KYC',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            showButton: false
        },
        PENDING: {
            icon: Clock,
            text: 'Đang chờ duyệt KYC',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            showButton: false
        },
        REJECTED: {
            icon: XCircle,
            text: 'KYC bị từ chối',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            showButton: true,
            buttonText: 'Gửi lại KYC'
        },
        NOT_VERIFIED: {
            icon: AlertCircle,
            text: 'Chưa xác thực KYC',
            color: 'text-gray-600',
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-200',
            showButton: true,
            buttonText: 'Xác thực ngay'
        }
    };

    const config = statusConfig[status] || statusConfig.NOT_VERIFIED;
    const Icon = config.icon;

    return (
        <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-6`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`${config.bgColor} p-3 rounded-full`}>
                        <Icon className={`w-8 h-8 ${config.color}`} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Xác thực danh tính</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-sm font-semibold ${config.color}`}>
                                {config.text}
                            </span>
                            {status === 'APPROVED' && (
                                <CheckCircle className="w-4 h-4 text-green-600 fill-green-600" />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/kyc')}
                        className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-light transition-colors font-medium"
                    >
                        KYC
                    </button>
                    {config.showButton && (
                        <button
                            onClick={() => navigate('/kyc')}
                            className="bg-white text-primary border-2 border-primary px-6 py-2.5 rounded-lg hover:bg-beige-100 transition-colors font-medium"
                        >
                            {config.buttonText}
                        </button>
                    )}
                </div>
            </div>

            {status === 'PENDING' && (
                <p className="text-sm text-gray-600 mt-4">
                    Hồ sơ KYC của bạn đang được duyệt. Thời gian xử lý từ 24-48 giờ.
                </p>
            )}

            {status === 'REJECTED' && (
                <p className="text-sm text-red-600 mt-4">
                    Hồ sơ KYC bị từ chối. Vui lòng gửi lại giấy tờ chính xác.
                </p>
            )}
        </div>
    );
}