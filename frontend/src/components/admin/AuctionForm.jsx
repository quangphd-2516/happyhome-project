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
                    Auction Details
                </h2>
                <p className="text-gray-600">
                    Configure auction parameters and pricing
                </p>
            </div>

            {/* Selected Property Summary */}
            {selectedProperty && (
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Selected Property</h3>
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
                    <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
                    <button
                        type="button"
                        onClick={suggestTitle}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        Auto-generate title
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Auction Title *
                        </div>
                    </label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="Enter auction title..."
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
                        Description
                    </label>
                    <textarea
                        value={data.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Enter auction description (optional)..."
                        rows="4"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                </div>
            </div>

            {/* Pricing Information */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Pricing Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Start Price */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Start Price (VND) *
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
                                    Bid Step (VND) *
                                </div>
                                <button
                                    type="button"
                                    onClick={suggestBidStep}
                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Suggest
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
                                    Deposit (VND) *
                                </div>
                                <button
                                    type="button"
                                    onClick={suggestDeposit}
                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Suggest
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
                            <p className="font-semibold mb-1">Pricing Tips:</p>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Bid Step: Typically 2-5% of start price</li>
                                <li>Deposit: Usually 10% of start price to ensure serious bidders</li>
                                <li>Start Price: Can be set below market price to attract bidders</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Time Settings */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900">Time Settings</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start Time */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Start Time *
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
                                End Time *
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
                                <p className="font-semibold">Auction Duration</p>
                                <p>
                                    {(() => {
                                        const start = new Date(data.startTime);
                                        const end = new Date(data.endTime);
                                        const diffMs = end - start;
                                        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                                        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                        return `${diffDays} days ${diffHours} hours`;
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
                            <p className="font-semibold mb-1">Important:</p>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Auction must be scheduled at least 24 hours in advance</li>
                                <li>Recommended duration: 7-14 days for best results</li>
                                <li>Times cannot be changed once auction is created</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Box */}
            {data.startPrice && data.bidStep && data.depositAmount && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
                    <h3 className="font-bold text-indigo-900 mb-4">Quick Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-indigo-600 font-medium">Start Price</p>
                            <p className="text-indigo-900 font-bold">{formatCurrency(data.startPrice)}</p>
                        </div>
                        <div>
                            <p className="text-indigo-600 font-medium">Bid Step</p>
                            <p className="text-indigo-900 font-bold">{formatCurrency(data.bidStep)}</p>
                        </div>
                        <div>
                            <p className="text-indigo-600 font-medium">Deposit</p>
                            <p className="text-indigo-900 font-bold">{formatCurrency(data.depositAmount)}</p>
                        </div>
                        <div>
                            <p className="text-indigo-600 font-medium">Deposit %</p>
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