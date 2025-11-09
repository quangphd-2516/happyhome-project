// src/pages/auction/AuctionRoom.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Gavel, Users, TrendingUp, MapPin, Home, Maximize2, AlertCircle } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import CountdownTimer from '../../components/auction/CountdownTimer';
import BidHistory from '../../components/auction/BidHistory';
import BidForm from '../../components/auction/BidForm';
import { useAuthStore } from '../../store/authStore';
import { auctionService } from '../../services/auctionService';
import websocketService from '../../services/websocketService';

export default function AuctionRoom() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const [auction, setAuction] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBidding, setIsBidding] = useState(false);
    const [participants, setParticipants] = useState(0);
    const [auctionStatus, setAuctionStatus] = useState(null);
    const [waitingMode, setWaitingMode] = useState(false);

    // ✅ SINGLE useEffect for access check and initialization
    useEffect(() => {
        const checkAccessAndJoin = async () => {
            if (!isAuthenticated) {
                alert('Please login first');
                navigate('/login');
                return;
            }

            try {
                setLoading(true);

                // Step 1: Check deposit status first
                const depositResponse = await auctionService.checkDeposit(id);
                const depositData = depositResponse.data || depositResponse;

                if (!depositData.depositPaid) {
                    alert('Please pay deposit first!');
                    navigate(`/auctions/${id}/deposit`);
                    return;
                }

                // Step 2: Get auction details
                const auctionResponse = await auctionService.getById(id);
                const auctionData = auctionResponse.data || auctionResponse;

                if (!auctionData) {
                    alert('Auction not found');
                    navigate('/auctions');
                    return;
                }

                // Step 3: Check if auction has ended
                if (auctionData.status === 'COMPLETED' || auctionData.status === 'CANCELLED') {
                    alert('Auction has ended!');
                    navigate(`/auctions/${id}`);
                    return;
                }

                // Step 4: Set auction data
                setAuction(auctionData);
                setBids(auctionData.bids || []);
                setAuctionStatus(auctionData.status);

                // Step 5: If UPCOMING, enable waiting mode
                if (auctionData.status === 'UPCOMING') {
                    setWaitingMode(true);
                }

                // Step 6: Initialize Socket.IO
                initializeSocket();

            } catch (error) {
                console.error('Access check failed:', error);
                alert('Failed to join auction. Please try again.');
                navigate(`/auctions/${id}`);
            } finally {
                setLoading(false);
            }
        };

        checkAccessAndJoin();

        // Cleanup on unmount
        return () => {
            websocketService.leaveAuction(id);
            removeSocketListeners();
        };
    }, [id, isAuthenticated, navigate]);

    // ✅ Initialize Socket.IO using websocketService
    const initializeSocket = () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Ensure socket is connected
        if (!websocketService.isConnected()) {
            websocketService.connect(token);
        }

        // Wait for connection before joining
        setTimeout(() => {
            websocketService.joinAuction(id);
        }, 500);

        // Setup all listeners
        setupSocketListeners();
    };

    // Setup all socket event listeners
    const setupSocketListeners = () => {
        // Auction joined
        websocketService.onAuctionJoined((data) => {
            console.log('Joined auction:', data);
            setAuctionStatus(data.status);
            setParticipants(data.participantCount || 0);

            if (data.recentBids) {
                setBids(data.recentBids);
            }

            if (data.status === 'UPCOMING') {
                setWaitingMode(true);
            }
        });

        // Auction errors
        websocketService.onAuctionError((error) => {
            console.error('Auction error:', error);

            if (error.code === 'DEPOSIT_REQUIRED') {
                alert('Deposit payment required');
                navigate(`/auctions/${id}/deposit`);
            } else if (error.code === 'AUCTION_ENDED') {
                alert('Auction has ended');
                navigate(`/auctions/${id}`);
            } else {
                alert(error.message || 'An error occurred');
            }
        });

        // New bid
        websocketService.onNewBid((data) => {
            console.log('New bid received:', data);

            setAuction(prev => ({
                ...prev,
                currentPrice: data.auction.currentPrice,
            }));

            setBids(prev => [data.bid, ...prev]);
        });

        // Bid placed confirmation
        websocketService.onBidPlaced((data) => {
            console.log('Your bid placed:', data);
            setIsBidding(false);
            alert('Bid placed successfully!');
        });

        // Bid error
        websocketService.onBidError((error) => {
            console.error('Bid error:', error);
            setIsBidding(false);

            if (error.code === 'NOT_STARTED') {
                alert('Auction has not started yet. Please wait.');
            } else if (error.code === 'BID_TOO_LOW') {
                alert(`Minimum bid is ${formatPrice(error.minBid)}`);
            } else {
                alert(error.message || 'Failed to place bid');
            }
        });

        // User joined
        websocketService.onUserJoinedAuction((data) => {
            console.log('User joined:', data);
            setParticipants(data.participantCount || 0);
        });

        // User left
        websocketService.onUserLeftAuction((data) => {
            console.log('User left:', data);
        });

        // Auction started
        websocketService.onAuctionStarted((data) => {
            console.log('🎉 Auction started!', data);
            setWaitingMode(false);
            setAuctionStatus('ONGOING');
            alert('Auction has started! You can now place bids.');
        });

        // Auction ended
        websocketService.onAuctionEnded((data) => {
            console.log('🏁 Auction ended!', data);
            alert(`Auction has ended! ${data.winner ? `Winner: ${data.winner.fullName}` : 'No winner'}`);
            navigate(`/auctions/${id}`);
        });

        // Auction update
        websocketService.onAuctionUpdate((data) => {
            console.log('Auction update:', data);
            if (data.status) {
                setAuctionStatus(data.status);
            }
        });
    };

    // Remove all socket listeners
    const removeSocketListeners = () => {
        websocketService.off('auction_joined');
        websocketService.off('auction_error');
        websocketService.off('new_bid');
        websocketService.off('bid_placed');
        websocketService.off('bid_error');
        websocketService.off('user_joined_auction');
        websocketService.off('user_left_auction');
        websocketService.off('auction_started');
        websocketService.off('auction_ended');
        websocketService.off('auction_update');
    };

    // ✅ Handle bid via websocketService
    const handlePlaceBid = async (amount) => {
        if (!websocketService.isConnected()) {
            alert('Not connected to auction. Please refresh the page.');
            return;
        }

        if (waitingMode) {
            alert('Auction has not started yet. Please wait.');
            return;
        }

        setIsBidding(true);
        websocketService.placeBid(id, amount);
    };

    const handleAuctionEnd = () => {
        alert('Auction has ended!');
        navigate(`/auctions/${id}`);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading auction...</p>
                </div>
            </div>
        );
    }

    if (!auction) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Auction Not Found</h2>
                    <button
                        onClick={() => navigate('/auctions')}
                        className="mt-4 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-light"
                    >
                        Back to Auctions
                    </button>
                </div>
            </div>
        );
    }

    const minBid = parseFloat(auction.currentPrice) + parseFloat(auction.bidStep);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Live Indicator */}
            <div className={`py-3 ${waitingMode
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                : 'bg-gradient-to-r from-red-500 to-pink-600'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-3 text-white">
                        <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                        <span className="font-bold text-lg">
                            {waitingMode ? 'WAITING FOR AUCTION TO START' : 'LIVE AUCTION'}
                        </span>
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {participants} {waitingMode ? 'waiting' : 'watching'}
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
                                src={auction.property?.thumbnail}
                                alt={auction.title}
                                className="w-full h-96 object-cover"
                            />
                        </div>

                        {/* Title & Timer */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{auction.title}</h1>

                            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                                {waitingMode ? (
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 mb-2">Starts in:</p>
                                        <CountdownTimer
                                            endTime={auction.startTime}
                                            onEnd={() => {
                                                setWaitingMode(false);
                                                setAuctionStatus('ONGOING');
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 mb-2">Ends in:</p>
                                        <CountdownTimer endTime={auction.endTime} onEnd={handleAuctionEnd} />
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-5 h-5" />
                                    <span>{auction.property?.address}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                                <div className="text-center">
                                    <Home className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">{auction.property?.type}</p>
                                </div>
                                <div className="text-center">
                                    <Maximize2 className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">{auction.property?.area} m²</p>
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
                                {auction.currentPrice > auction.startPrice && (
                                    <span className="flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        {((auction.currentPrice - auction.startPrice) / auction.startPrice * 100).toFixed(1)}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Waiting Message or Bid Form */}
                        {waitingMode ? (
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-center">
                                <div className="animate-pulse mb-4">
                                    <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
                                        <Gavel className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-blue-900 mb-2">Waiting for Auction to Start</h3>
                                <p className="text-sm text-blue-700">
                                    You can place bids when the auction begins
                                </p>
                            </div>
                        ) : (
                            <BidForm
                                currentBid={auction.currentPrice}
                                bidStep={auction.bidStep}
                                minBid={minBid}
                                onBid={handlePlaceBid}
                                isLoading={isBidding}
                            />
                        )}

                        {/* Auction Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h3 className="font-bold text-gray-900 mb-4">Auction Information</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`font-semibold ${auctionStatus === 'ONGOING' ? 'text-green-600' : 'text-blue-600'
                                        }`}>
                                        {auctionStatus}
                                    </span>
                                </div>
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