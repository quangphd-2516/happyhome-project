// src/pages/auction/AuctionRoom.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Gavel, Users, TrendingUp, MapPin, Home, Maximize2 } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import CountdownTimer from '../../components/auction/CountdownTimer';
import BidHistory from '../../components/auction/BidHistory';
import BidForm from '../../components/auction/BidForm';
import { useAuthStore } from '../../store/authStore';
import { auctionService } from '../../services/auctionService';

export default function AuctionRoom() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    const [auction, setAuction] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBidding, setIsBidding] = useState(false);
    const [participants, setParticipants] = useState(12); // Mock online users

    // Mock data
    const mockAuction = {
        id: 1,
        title: 'Luxury Villa Auction - Beverly Hills',
        description: 'Stunning modern villa with panoramic views, infinity pool, and smart home technology.',
        status: 'ONGOING',
        startPrice: 2000000,
        currentPrice: 2500000,
        bidStep: 50000,
        depositAmount: 200000,
        startTime: '2024-03-20T10:00:00',
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        property: {
            thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
            images: [
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
            ],
            address: 'Beverly Hills, California',
            area: 450,
            bedrooms: 4,
            bathrooms: 3,
            type: 'VILLA'
        }
    };

    const mockBids = [
        { id: 1, amount: 2500000, userName: 'John D.', createdAt: new Date(Date.now() - 5 * 60 * 1000) },
        { id: 2, amount: 2450000, userName: 'Sarah M.', createdAt: new Date(Date.now() - 15 * 60 * 1000) },
        { id: 3, amount: 2400000, userName: 'Mike R.', createdAt: new Date(Date.now() - 30 * 60 * 1000) },
    ];

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchAuction();

        // Simulate realtime updates
        const interval = setInterval(() => {
            setParticipants(prev => prev + Math.floor(Math.random() * 3) - 1);
        }, 5000);

        return () => clearInterval(interval);
    }, [id, isAuthenticated]);
    // Trong AuctionRoom.jsx - line ~50
    useEffect(() => {
        const checkAccess = async () => {
            if (!isAuthenticated) {
                navigate('/login');
                return;
            }

            // Check auction status
            const auctionData = await auctionService.getById(id);

            // Chỉ cho vào nếu ONGOING
            if (auctionData.status !== 'ONGOING') {
                alert('Auction is not live yet!');
                navigate(`/auctions/${id}`); // Back to detail
                return;
            }

            // Check deposit
            const depositData = await auctionService.checkDeposit(id);
            if (!depositData.depositPaid) {
                alert('Please pay deposit first!');
                navigate(`/auctions/${id}/deposit`);
                return;
            }

            // All checks passed - join room
            fetchAuction();
            websocketService.joinAuction(id);
        };

        checkAccess();
    }, [id, isAuthenticated]);

    const fetchAuction = async () => {
        setLoading(true);
        try {
            // const response = await auctionService.getById(id);
            // setAuction(response.data);
            // setBids(response.data.bids);

            setTimeout(() => {
                setAuction(mockAuction);
                setBids(mockBids);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Fetch auction error:', error);
            setLoading(false);
        }
    };

    const handlePlaceBid = async (amount) => {
        setIsBidding(true);
        try {
            await auctionService.placeBid(id, amount);

            // Add new bid to list
            const newBid = {
                id: Date.now(),
                amount,
                userName: user?.fullName || 'You',
                createdAt: new Date()
            };
            setBids([newBid, ...bids]);
            setAuction(prev => ({ ...prev, currentPrice: amount }));

            alert('Bid placed successfully!');
        } catch (error) {
            console.error('Place bid error:', error);
            alert('Failed to place bid. Please try again.');
        } finally {
            setIsBidding(false);
        }
    };

    const handleAuctionEnd = () => {
        alert('Auction has ended!');
        navigate('/auctions');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!auction) {
        return <div>Auction not found</div>;
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const minBid = auction.currentPrice + auction.bidStep;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Live Indicator */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 py-3">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-3 text-white">
                        <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                        <span className="font-bold text-lg">LIVE AUCTION</span>
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {participants} watching
                        </span>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Property Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Images */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={auction.property.thumbnail}
                                alt={auction.title}
                                className="w-full h-96 object-cover"
                            />
                        </div>

                        {/* Title & Timer */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{auction.title}</h1>

                            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                                <CountdownTimer endTime={auction.endTime} onEnd={handleAuctionEnd} />

                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-5 h-5" />
                                    <span>{auction.property.address}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                                <div className="text-center">
                                    <Home className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">{auction.property.type}</p>
                                </div>
                                <div className="text-center">
                                    <Maximize2 className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">{auction.property.area} m²</p>
                                </div>
                                <div className="text-center">
                                    <TrendingUp className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">{bids.length} Bids</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                            <p className="text-gray-600 leading-relaxed">{auction.description}</p>
                        </div>

                        {/* Bid History */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Bid History</h2>
                            <BidHistory bids={bids} />
                        </div>
                    </div>

                    {/* Right Column - Bidding */}
                    <div className="space-y-6">
                        {/* Current Bid */}
                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
                            <p className="text-white/80 text-sm font-medium mb-2">Current Highest Bid</p>
                            <p className="text-5xl font-bold mb-4">{formatPrice(auction.currentPrice)}</p>
                            <div className="flex items-center justify-between text-sm">
                                <span>Starting Price: {formatPrice(auction.startPrice)}</span>
                                <span className="flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    {((auction.currentPrice - auction.startPrice) / auction.startPrice * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>

                        {/* Bid Form */}
                        <BidForm
                            currentBid={auction.currentPrice}
                            bidStep={auction.bidStep}
                            minBid={minBid}
                            onBid={handlePlaceBid}
                            isLoading={isBidding}
                        />

                        {/* Auction Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h3 className="font-bold text-gray-900 mb-4">Auction Information</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Bid Step:</span>
                                    <span className="font-semibold">{formatPrice(auction.bidStep)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Deposit Required:</span>
                                    <span className="font-semibold">{formatPrice(auction.depositAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Bids:</span>
                                    <span className="font-semibold">{bids.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Rules */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                            <h3 className="font-bold text-blue-900 mb-3">Bidding Rules</h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li>• Bids are binding and cannot be withdrawn</li>
                                <li>• Each bid must exceed the current bid by the bid step amount</li>
                                <li>• Winner must pay within 24 hours</li>
                                <li>• Deposit will be refunded if you don't win</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}