// frontend/src/pages/admin/CreateAuction.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    Eye,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import PropertySelector from '../../components/admin/PropertySelector';
import AuctionForm from '../../components/admin/AuctionForm';
import { adminService } from '../../services/adminService';

export default function CreateAuction() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [auctionData, setAuctionData] = useState({
        title: '',
        description: '',
        startPrice: '',
        bidStep: '',
        depositAmount: '',
        startTime: '',
        endTime: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const steps = [
        { number: 1, title: 'Chọn bất động sản', description: 'Lựa chọn bất động sản tham gia đấu giá' },
        { number: 2, title: 'Thiết lập phiên đấu giá', description: 'Cấu hình thông số và mức giá' },
        { number: 3, title: 'Xem lại & gửi duyệt', description: 'Kiểm tra thông tin trước khi tạo' }
    ];

    const validateStep1 = () => {
        if (!selectedProperty) {
            alert('Vui lòng chọn một bất động sản');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        const newErrors = {};

        if (!auctionData.title.trim()) {
            newErrors.title = 'Vui lòng nhập tiêu đề';
        }

        if (!auctionData.startPrice || parseFloat(auctionData.startPrice) <= 0) {
            newErrors.startPrice = 'Vui lòng nhập giá khởi điểm hợp lệ';
        }

        if (!auctionData.bidStep || parseFloat(auctionData.bidStep) <= 0) {
            newErrors.bidStep = 'Vui lòng nhập bước giá hợp lệ';
        }

        if (!auctionData.depositAmount || parseFloat(auctionData.depositAmount) <= 0) {
            newErrors.depositAmount = 'Vui lòng nhập tiền đặt cọc hợp lệ';
        }

        if (!auctionData.startTime) {
            newErrors.startTime = 'Vui lòng chọn thời gian bắt đầu';
        }

        if (!auctionData.endTime) {
            newErrors.endTime = 'Vui lòng chọn thời gian kết thúc';
        }

        if (auctionData.startTime && auctionData.endTime) {
            if (new Date(auctionData.endTime) <= new Date(auctionData.startTime)) {
                newErrors.endTime = 'Thời gian kết thúc phải sau thời gian bắt đầu';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
        } else if (currentStep === 2 && validateStep2()) {
            setCurrentStep(3);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate('/admin/auctions');
        }
    };

    const handleSubmit = async () => {
        if (!validateStep2()) return;

        setLoading(true);
        try {
            const submitData = {
                propertyId: selectedProperty.id,
                title: auctionData.title,
                description: auctionData.description,
                startPrice: parseFloat(auctionData.startPrice),
                bidStep: parseFloat(auctionData.bidStep),
                depositAmount: parseFloat(auctionData.depositAmount),
                startTime: new Date(auctionData.startTime).toISOString(),
                endTime: new Date(auctionData.endTime).toISOString()
            };

            await adminService.createAuction(submitData);
            alert('Tạo phiên đấu giá thành công!');
            navigate('/admin/auctions');

            // Using mock for now
            /** setTimeout(() => {
              alert('Auction created successfully!');
              navigate('/admin/auctions');
            }, 1000); */
        } catch (error) {
            console.error('Error creating auction:', error);
            alert('Tạo phiên đấu giá thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const StepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all ${currentStep >= step.number
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-400 border-gray-300'
                            }`}>
                            {currentStep > step.number ? (
                                <CheckCircle className="w-6 h-6" />
                            ) : (
                                step.number
                            )}
                        </div>
                        <div className="mt-2 text-center">
                            <div className={`text-sm font-semibold ${currentStep >= step.number ? 'text-indigo-600' : 'text-gray-400'
                                }`}>
                                {step.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {step.description}
                            </div>
                        </div>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`w-24 h-0.5 mx-4 ${currentStep > step.number ? 'bg-indigo-600' : 'bg-gray-300'
                            }`} />
                    )}
                </div>
            ))}
        </div>
    );

    const PreviewModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Xem trước phiên đấu giá</h2>
                    <button
                        onClick={() => setShowPreview(false)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Property Info */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Thông tin bất động sản</h3>
                        <div className="flex gap-4">
                            <img
                                src={selectedProperty?.thumbnail}
                                alt={selectedProperty?.title}
                                className="w-32 h-32 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{selectedProperty?.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{selectedProperty?.address}</p>
                                <div className="flex gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">{selectedProperty?.type}</span>
                                    <span className="text-gray-600">{selectedProperty?.area}m²</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Auction Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">Chi tiết phiên đấu giá</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Tiêu đề</p>
                                <p className="font-semibold text-gray-900">{auctionData.title}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Giá khởi điểm</p>
                                <p className="font-semibold text-green-600">
                                    {formatCurrency(auctionData.startPrice)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Bước giá</p>
                                <p className="font-semibold text-gray-900">
                                    {formatCurrency(auctionData.bidStep)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Tiền đặt cọc</p>
                                <p className="font-semibold text-gray-900">
                                    {formatCurrency(auctionData.depositAmount)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Thời gian bắt đầu</p>
                                <p className="font-semibold text-gray-900">
                                    {new Date(auctionData.startTime).toLocaleString('vi-VN')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Thời gian kết thúc</p>
                                <p className="font-semibold text-gray-900">
                                    {new Date(auctionData.endTime).toLocaleString('vi-VN')}
                                </p>
                            </div>
                        </div>

                        {auctionData.description && (
                            <div>
                                <p className="text-sm text-gray-600">Mô tả</p>
                                <p className="text-gray-900 mt-1">{auctionData.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Quay lại</span>
                    </button>

                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Tạo phiên đấu giá mới
                    </h1>
                    <p className="text-gray-600">
                        Thiết lập phiên đấu giá bất động sản chỉ với 3 bước
                    </p>
                </div>

                {/* Step Indicator */}
                <StepIndicator />

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {currentStep === 1 && (
                        <PropertySelector
                            selectedProperty={selectedProperty}
                            onSelect={setSelectedProperty}
                        />
                    )}

                    {currentStep === 2 && (
                        <AuctionForm
                            data={auctionData}
                            errors={errors}
                            onChange={setAuctionData}
                            selectedProperty={selectedProperty}
                        />
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <div>
                                    <p className="font-semibold text-green-900">Sẵn sàng tạo phiên</p>
                                    <p className="text-sm text-green-700">
                                        Vui lòng kiểm tra thông tin trước khi tạo phiên đấu giá
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowPreview(true)}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors font-medium"
                            >
                                <Eye className="w-5 h-5" />
                                Xem trước thông tin phiên
                            </button>

                            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-yellow-900 mb-2">Lưu ý quan trọng:</p>
                                        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                                            <li>Sau khi tạo, thông tin phiên đấu giá sẽ không thể chỉnh sửa</li>
                                            <li>Bất động sản sẽ được khóa trong suốt thời gian đấu giá</li>
                                            <li>Người tham gia sẽ được thông báo tự động</li>
                                            <li>Tất cả người tham gia cần nộp tiền đặt cọc</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={handleBack}
                        className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                        {currentStep === 1 ? 'Hủy' : 'Quay lại'}
                    </button>

                    <div className="flex gap-3">
                        {currentStep === 3 && (
                            <button
                                onClick={() => setShowPreview(true)}
                                className="px-6 py-3 bg-white border-2 border-indigo-300 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors font-medium flex items-center gap-2"
                            >
                                <Eye className="w-5 h-5" />
                                Xem trước
                            </button>
                        )}

                        {currentStep < 3 ? (
                            <button
                                onClick={handleNext}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                            >
                                Bước tiếp theo
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Đang tạo...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Tạo phiên đấu giá
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && <PreviewModal />}
        </div>
    );
}