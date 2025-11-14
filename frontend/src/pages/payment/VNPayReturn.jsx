// src/pages/payment/VNPayReturn.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import api from '../../services/api';

export default function VNPayReturn() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing'); // processing, success, failed
    const [message, setMessage] = useState('Processing payment...');
    const [auctionId, setAuctionId] = useState(null);

    useEffect(() => {
        handlePaymentReturn();
    }, []);

    const handlePaymentReturn = async () => {
        try {
            // Get all query params
            const params = {};
            for (const [key, value] of searchParams.entries()) {
                params[key] = value;
            }

            // Call backend to verify payment
            const response = await api.get('/payment/vnpay/return', { params });

            if (response.data.success) {
                setStatus('success');
                setMessage('Payment successful! Redirecting...');
                setAuctionId(response.data.data.auctionId);

                // Redirect after 3 seconds
                setTimeout(() => {
                    navigate(`/auctions/${response.data.data.auctionId}`);
                }, 3000);
            } else {
                setStatus('failed');
                setMessage(response.data.message || 'Payment failed');
            }
        } catch (error) {
            console.error('Payment return error:', error);
            setStatus('failed');
            setMessage(error.response?.data?.message || 'Payment verification failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-20">
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        {status === 'processing' && (
                            <>
                                <Loader className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Đang xử lý thanh toán
                                </h2>
                                <p className="text-gray-600">
                                    Vui lòng đợi trong khi chúng tôi xác minh thanh toán của bạn...
                                </p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Thanh toán thành công!
                                </h2>
                                <p className="text-gray-600 mb-6">{message}</p>
                                <button
                                    onClick={() => navigate(`/auctions/${auctionId}`)}
                                    className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                                >
                                    Đến phiên đấu giá
                                </button>
                            </>
                        )}

                        {status === 'failed' && (
                            <>
                                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Thanh toán thất bại
                                </h2>
                                <p className="text-gray-600 mb-6">{message}</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => navigate('/auctions')}
                                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                                    >
                                        Quay lại danh sách phiên đấu giá
                                    </button>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-light transition-colors"
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}