// src/pages/auction/AuctionDeposit.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Shield, CreditCard, Wallet, Bitcoin,
    CheckCircle, AlertCircle, ArrowLeft, Info
} from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useAuthStore } from '../../store/authStore';
import { auctionService } from '../../services/auctionService';

export default function AuctionDeposit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [depositStatus, setDepositStatus] = useState(null);
    const [agreed, setAgreed] = useState(false);

    const paymentMethods = [
        {
            id: 'VNPAY',
            name: 'VNPay',
            icon: CreditCard,
            description: 'Pay with VNPay e-wallet',
            color: 'from-blue-500 to-blue-600',
            available: true,
        },
        {
            id: 'MOMO',
            name: 'MoMo',
            icon: Wallet,
            description: 'Pay with MoMo wallet',
            color: 'from-pink-500 to-pink-600',
            available: true,
        },
        {
            id: 'BLOCKCHAIN',
            name: 'Cryptocurrency',
            icon: Bitcoin,
            description: 'Pay with Bitcoin or Ethereum',
            color: 'from-orange-500 to-yellow-600',
            available: true,
        },
    ];

    // Mock auction data
    const mockAuction = {
        id: 1,
        title: 'Luxury Villa Auction - Beverly Hills',
        status: 'UPCOMING',
        depositAmount: 200000,
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        property: {
            thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            title: 'Modern Luxury Villa',
            address: 'Beverly Hills, California',
        },
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchAuction();
        checkDepositStatus();
    }, [id, isAuthenticated]);

    const fetchAuction = async () => {
        setLoading(true);
        try {
            const response = await auctionService.getById(id);
            // Backend returns { data: auction } or auction directly
            setAuction(response.data || response);
            setLoading(false);
        } catch (error) {
            console.error('Fetch auction error:', error);
            setAuction(mockAuction);
            setLoading(false);
        }
    };

    const checkDepositStatus = async () => {
        try {
            const response = await auctionService.checkDeposit(id);
            const depositData = response.data || response;
            setDepositStatus(depositData);

            // If already deposited, redirect to auction detail (user can go to room from there)
            if (depositData?.depositPaid) {
                navigate(`/auctions/${id}`);
            }
        } catch (error) {
            console.error('Check deposit error:', error);
        }
    };

    const handlePayDeposit = async () => {
        if (!selectedMethod) {
            alert('Please select a payment method');
            return;
        }

        if (!agreed) {
            alert('Please agree to the terms and conditions');
            return;
        }

        setPaying(true);
        try {
            const response = await auctionService.payDeposit(id, selectedMethod);

            // Redirect to payment gateway or show success
            if (response.paymentUrl) {
                window.location.href = response.paymentUrl;
            } else {
                alert('Deposit payment successful!');
                navigate(`/auctions/${id}`);
            }
        } catch (error) {
            console.error('Pay deposit error:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setPaying(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!auction) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Auction Not Found</h2>
                    <button
                        onClick={() => navigate('/auctions')}
                        className="mt-4 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-light"
                    >
                        Back to Auctions
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(`/auctions/${id}`)}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Auction</span>
                </button>

                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-xl">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Auction Deposit
                        </h1>
                        <p className="text-gray-600">
                            Pay deposit to participate in this auction
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Auction Info */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Property Card */}
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                <img
                                    src={auction?.property?.thumbnail}
                                    alt={auction?.property?.title || auction?.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="font-bold text-gray-900 mb-2">{auction?.title}</h3>
                                    <p className="text-sm text-gray-600 mb-4">{auction?.property?.address}</p>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Starts:</span>
                                            <span className="font-semibold text-gray-900">
                                                {auction?.startTime ? formatDate(auction.startTime) : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                                {auction?.status || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Deposit Amount */}
                            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
                                <p className="text-white/80 text-sm font-medium mb-2">Deposit Required</p>
                                <p className="text-4xl font-bold mb-2">{formatPrice(auction?.depositAmount || 0)}</p>
                                <p className="text-sm text-white/80">
                                    Refundable if you don't win
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Payment */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Payment Methods */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Select Payment Method
                                </h2>

                                <div className="space-y-4">
                                    {paymentMethods.map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => setSelectedMethod(method.id)}
                                            disabled={!method.available}
                                            className={`w-full p-6 rounded-xl border-2 transition-all ${selectedMethod === method.id
                                                ? 'border-primary bg-primary/5 shadow-lg'
                                                : 'border-gray-200 hover:border-gray-300'
                                                } ${!method.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                                    <method.icon className="w-7 h-7 text-white" />
                                                </div>

                                                <div className="flex-1 text-left">
                                                    <h3 className="font-bold text-gray-900 mb-1">{method.name}</h3>
                                                    <p className="text-sm text-gray-600">{method.description}</p>
                                                </div>

                                                {selectedMethod === method.id && (
                                                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Terms & Conditions */}
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                                <div className="flex items-start gap-3 mb-4">
                                    <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-bold text-blue-900 mb-2">Important Information</h3>
                                        <ul className="space-y-2 text-sm text-blue-800">
                                            <li>• Deposit is required to participate in the auction</li>
                                            <li>• Deposit will be refunded if you don't win within 24 hours</li>
                                            <li>• Winner must pay remaining amount within 24 hours</li>
                                            <li>• Deposit is non-refundable if you win and don't complete payment</li>
                                            <li>• By paying deposit, you agree to auction terms and conditions</li>
                                        </ul>
                                    </div>
                                </div>

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="mt-1 w-5 h-5 text-primary border-2 border-blue-300 rounded focus:ring-2 focus:ring-primary"
                                    />
                                    <span className="text-sm text-blue-900 font-medium">
                                        I have read and agree to the terms and conditions
                                    </span>
                                </label>
                            </div>

                            {/* Payment Button */}
                            <button
                                onClick={handlePayDeposit}
                                disabled={!selectedMethod || !agreed || paying}
                                className="w-full py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
                            >
                                {paying ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Processing...
                                    </span>
                                ) : (
                                    `Pay Deposit ${formatPrice(auction?.depositAmount || 0)}`
                                )}
                            </button>

                            {/* Security Note */}
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                <Shield className="w-4 h-4" />
                                <span>Secured payment powered by SSL encryption</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}