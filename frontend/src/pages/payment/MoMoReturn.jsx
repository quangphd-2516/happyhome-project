// src/pages/payment/MoMoReturn.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import api from '../../services/api';

export default function MoMoReturn() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing'); // processing, success, failed
    const [message, setMessage] = useState('Processing MoMo payment...');
    const [auctionId, setAuctionId] = useState(null);

    useEffect(() => {
        handlePaymentReturn();
    }, []);

    const handlePaymentReturn = async () => {
        try {
            console.log('🔄 Processing MoMo return...');

            // Get all query params
            const params = {};
            for (const [key, value] of searchParams.entries()) {
                params[key] = value;
            }

            console.log('📝 Params received:', Object.keys(params).length, 'keys');
            console.log('- orderId:', params.orderId);
            console.log('- resultCode:', params.resultCode);
            console.log('- amount:', params.amount);

            // ✅ Call backend API to verify payment
            // Backend route: GET /api/payments/momo/return
            const response = await api.get('/payments/momo/return', { params });

            console.log('✅ Backend response:', response.data);

            if (response.data.success) {
                setStatus('success');
                setMessage('MoMo payment successful! Redirecting...');
                setAuctionId(response.data.data.auctionId);

                console.log('🎉 Payment successful! Auction ID:', response.data.data.auctionId);

                // Redirect after 3 seconds
                setTimeout(() => {
                    navigate(`/auctions/${response.data.data.auctionId}`);
                }, 3000);
            } else {
                console.error('❌ Payment failed:', response.data.message);
                setStatus('failed');
                setMessage(response.data.message || 'MoMo payment failed');
            }
        } catch (error) {
            console.error('❌ Payment return error:', error);
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
                                <Loader className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-spin" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Processing MoMo Payment
                                </h2>
                                <p className="text-gray-600">
                                    Please wait while we verify your payment...
                                </p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Payment Successful!
                                </h2>
                                <p className="text-gray-600 mb-6">{message}</p>
                                {auctionId && (
                                    <button
                                        onClick={() => navigate(`/auctions/${auctionId}`)}
                                        className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                                    >
                                        Go to Auction
                                    </button>
                                )}
                            </>
                        )}

                        {status === 'failed' && (
                            <>
                                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Payment Failed
                                </h2>
                                <p className="text-gray-600 mb-6">{message}</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => navigate('/auctions')}
                                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                                    >
                                        Back to Auctions
                                    </button>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="flex-1 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-light transition-colors"
                                    >
                                        Try Again
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