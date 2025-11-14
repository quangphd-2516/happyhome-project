// frontend/src/components/admin/AuctionForm.jsx
import {
    DollarSign,
    TrendingUp,
    Shield,
    Calendar,
    Clock,
    FileText,
    AlertCircle,
    Info
} from 'lucide-react';

export default function AuctionForm({ data, errors, onChange, selectedProperty }) {
    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Auto-generate title based on property
    const suggestTitle = () => {
        if (selectedProperty) {
            const title = `${selectedProperty.type} Auction - ${selectedProperty.title}`;
            handleChange('title', title);
        }
    };

    // Suggest deposit (10% of start price)
    const suggestDeposit = () => {
        if (data.startPrice) {
            const deposit = parseFloat(data.startPrice) * 0.1;
            handleChange('depositAmount', deposit.toString());
        }
    };

    // Suggest bid step (2% of start price or minimum 100M)
    const suggestBidStep = () => {
        if (data.startPrice) {
            const step = Math.max(parseFloat(data.startPrice) * 0.02, 100000000);
            handleChange('bidStep', step.toString());
        }
    };

    const getTodayDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Thông tin phiên đấu giá
                </h2>
                <p className="text-gray-600">
                    Thiết lập các thông số và giá cho phiên đấu giá
                </p>
            </div>

            {/* Selected Property Summary */}
            {selectedProperty && (
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Bất động sản đã chọn</h3>
                    <div className="flex gap-4">
                        <img
                            src={selectedProperty.thumbnail}
                            alt={selectedProperty.title}
                            className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">{selectedProperty.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{selectedProperty.address}</p>
                            <p className="text-sm text-gray-600 mt-1">
                                {selectedProperty.type} • {selectedProperty.area}m²
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Basic Information */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Thông tin cơ bản</h3>
                    <button
                        type="button"
                        onClick={suggestTitle}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Tạo tự động tiêu đề
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Tiêu đề phiên đấu giá *
                        </div>
                    </label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="Nhập tiêu đề phiên đấu giá..."
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.title ? 'border-red-300' : 'border-gray-200'
                            }`}
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.title}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Mô tả
                    </label>
                    <textarea
                        value={data.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Nhập mô tả phiên (không bắt buộc)..."
                        rows="4"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                </div>
            </div>

            {/* Pricing Information */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Thông tin giá</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Start Price */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Giá khởi điểm (VNĐ) *
                            </div>
                        </label>
                        <input
                            type="number"
                            value={data.startPrice}
                            onChange={(e) => handleChange('startPrice', e.target.value)}
                            placeholder="0"
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.startPrice ? 'border-red-300' : 'border-gray-200'
                                }`}
                        />
                        {errors.startPrice && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.startPrice}
                            </p>
                        )}
                        {data.startPrice && !errors.startPrice && (
                            <p className="mt-1 text-sm text-gray-600">
                                {formatCurrency(data.startPrice)}
                            </p>
                        )}
                    </div>

                    {/* Bid Step */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            <div className="flex items-center gap-2 justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Bước giá (VNĐ) *
                                </div>
                                <button
                                    type="button"
                                    onClick={suggestBidStep}
                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Gợi ý
                                </button>
                            </div>
                        </label>
                        <input
                            type="number"
                            value={data.bidStep}
                            onChange={(e) => handleChange('bidStep', e.target.value)}
                            placeholder="0"
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.bidStep ? 'border-red-300' : 'border-gray-200'
                                }`}
                        />
                        {errors.bidStep && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.bidStep}
                            </p>
                        )}
                        {data.bidStep && !errors.bidStep && (
                            <p className="mt-1 text-sm text-gray-600">
                                {formatCurrency(data.bidStep)}
                            </p>
                        )}
                    </div>

                    {/* Deposit Amount */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            <div className="flex items-center gap-2 justify-between">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Tiền đặt cọc (VNĐ) *
                                </div>
                                <button
                                    type="button"
                                    onClick={suggestDeposit}
                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Gợi ý
                                </button>
                            </div>
                        </label>
                        <input
                            type="number"
                            value={data.depositAmount}
                            onChange={(e) => handleChange('depositAmount', e.target.value)}
                            placeholder="0"
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.depositAmount ? 'border-red-300' : 'border-gray-200'
                                }`}
                        />
                        {errors.depositAmount && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.depositAmount}
                            </p>
                        )}
                        {data.depositAmount && !errors.depositAmount && (
                            <p className="mt-1 text-sm text-gray-600">
                                {formatCurrency(data.depositAmount)}
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-semibold mb-1">Mẹo thiết lập giá:</p>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Bước giá: Thường từ 2-5% giá khởi điểm</li>
                                <li>Đặt cọc: Thường là 10% giá khởi điểm để đảm bảo người tham gia nghiêm túc</li>
                                <li>Giá khởi điểm: Có thể đặt thấp hơn giá thị trường để thu hút nhiều người</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Time Settings */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Cài đặt thời gian</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start Time */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Thời gian bắt đầu *
                            </div>
                        </label>
                        <input
                            type="datetime-local"
                            value={data.startTime}
                            onChange={(e) => handleChange('startTime', e.target.value)}
                            min={getTodayDateTime()}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.startTime ? 'border-red-300' : 'border-gray-200'
                                }`}
                        />
                        {errors.startTime && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.startTime}
                            </p>
                        )}
                    </div>

                    {/* End Time */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Thời gian kết thúc *
                            </div>
                        </label>
                        <input
                            type="datetime-local"
                            value={data.endTime}
                            onChange={(e) => handleChange('endTime', e.target.value)}
                            min={data.startTime || getTodayDateTime()}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.endTime ? 'border-red-300' : 'border-gray-200'
                                }`}
                        />
                        {errors.endTime && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.endTime}
                            </p>
                        )}
                    </div>
                </div>

                {/* Duration Info */}
                {data.startTime && data.endTime && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-green-600" />
                            <div className="text-sm text-green-800">
                                <p className="font-semibold">Thời lượng phiên</p>
                                <p>
                                    {(() => {
                                        const start = new Date(data.startTime);
                                        const end = new Date(data.endTime);
                                        const diffMs = end - start;
                                        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                                        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                        return `${diffDays} ngày ${diffHours} giờ`;
                                    })()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-800">
                            <p className="font-semibold mb-1">Lưu ý:</p>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Phiên phải được lên lịch trước ít nhất 24 giờ</li>
                                <li>Khuyến nghị phiên kéo dài 7-14 ngày để đạt hiệu quả tốt</li>
                                <li>Thời gian không thể thay đổi sau khi tạo phiên</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Box */}
            {data.startPrice && data.bidStep && data.depositAmount && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
                    <h3 className="font-bold text-indigo-900 mb-4">Tóm tắt nhanh</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-indigo-600 font-medium">Giá khởi điểm</p>
                            <p className="text-indigo-900 font-bold">{formatCurrency(data.startPrice)}</p>
                        </div>
                        <div>
                            <p className="text-indigo-600 font-medium">Bước giá</p>
                            <p className="text-indigo-900 font-bold">{formatCurrency(data.bidStep)}</p>
                        </div>
                        <div>
                            <p className="text-indigo-600 font-medium">Đặt cọc</p>
                            <p className="text-indigo-900 font-bold">{formatCurrency(data.depositAmount)}</p>
                        </div>
                        <div>
                            <p className="text-indigo-600 font-medium">Tỷ lệ đặt cọc</p>
                            <p className="text-indigo-900 font-bold">
                                {((parseFloat(data.depositAmount) / parseFloat(data.startPrice)) * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}