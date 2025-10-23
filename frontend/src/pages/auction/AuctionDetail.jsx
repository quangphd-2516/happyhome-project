// src/pages/auction/AuctionDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Gavel, Users, TrendingUp, MapPin, Home, Maximize2,
    Bed, Bath, Calendar, Eye, Share2, Heart, ArrowLeft,
    DollarSign, Clock, CheckCircle, AlertCircle, Trophy
} from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import CountdownTimer from '../../components/auction/CountdownTimer';
import { useAuthStore } from '../../store/authStore';
import { auctionService } from '../../services/auctionService';

export default function AuctionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [depositStatus, setDepositStatus] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    // Mock auction data
    const mockAuction = {
        id: 1,
        title: 'Luxury Villa Auction - Beverly Hills',
        description: 'Experience unparalleled luxury in this stunning modern villa. This architectural masterpiece features floor-to-ceiling windows, an infinity pool overlooking the city, state-of-the-art smart home technology, and premium finishes throughout. The property includes a chef\'s kitchen, home theater, wine cellar, and landscaped gardens. Located in the most prestigious neighborhood of Beverly Hills with 24/7 security and concierge services.',
        status: 'UPCOMING',
        startPrice: 2000000,
        currentPrice: 2000000,
        bidStep: 50000,
        depositAmount: 200000,
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        property: {
            id: 1,
            thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
            images: [
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
                'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200',
            ],
            title: 'Modern Luxury Villa',
            address: '123 Luxury Avenue, Beverly Hills, California 90210',
            city: 'Beverly Hills',
            type: 'VILLA',
            area: 450,
            bedrooms: 4,
            bathrooms: 3,
            floors: 2,
            direction: 'South',
            hasLegalDoc: true,
            isFurnished: true,
            views: 2450,
        },
        creator: {
            id: '1',
            fullName: 'Premium Real Estate',
            avatar: 'https://i.pravatar.cc/150?img=20',
            email: 'contact@premium.com',
            phone: '+1 (555) 123-4567',
        },
        participants: [],
        bids: [],
    };

    const mockStatistics = {
        totalParticipants: 15,
        totalBids: 0,
        uniqueBidders: 0,
        averageBid: 0,
        highestBidder: null,
    };

    useEffect(() => {
        fetchAuction();
        fetchStatistics();
        if (isAuthenticated) {
            checkDepositStatus();
        }
    }, [id, isAuthenticated]);

    const fetchAuction = async () => {
        setLoading(true);
        try {
            // const response = await auctionService.getById(id);
            // setAuction(response.data);

            setTimeout(() => {
                setAuction(mockAuction);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Fetch auction error:', error);
            setAuction(mockAuction);
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            // const response = await auctionService.getStatistics(id);
            // setStatistics(response.data);

            setStatistics(mockStatistics);
        } catch (error) {
            console.error('Fetch statistics error:', error);
            setStatistics(mockStatistics);
        }
    };

    const checkDepositStatus = async () => {
        try {
            const response = await auctionService.checkDeposit(id);
            setDepositStatus(response.data);
        } catch (error) {
            console.error('Check deposit error:', error);
        }
    };

    const handleJoinAuction = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        // Check if deposit is paid
        if (depositStatus?.depositPaid) {
            navigate(`/auctions/${id}/room`);
        } else {
            navigate(`/auctions/${id}/deposit`);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: auction.title,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Share error:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        // TODO: Call API to add/remove favorite
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

    const getStatusBadge = (status) => {
        const badges = {
            UPCOMING: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Upcoming', icon: Clock },
            ONGOING: { bg: 'bg-green-100', text: 'text-green-700', label: 'Live Now', icon: TrendingUp },
            COMPLETED: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Completed', icon: CheckCircle },
            CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled', icon: AlertCircle },
        };

        const badge = badges[status] || badges.UPCOMING;
        const Icon = badge.icon;

        return (
            <span className={`px-4 py-2 ${badge.bg} ${badge.text} rounded-xl font-semibold flex items-center gap-2`}>
                <Icon className="w-5 h-5" />
                {badge.label}
            </span>
        );
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

    const canJoinAuction = auction.status === 'UPCOMING' || auction.status === 'ONGOING';
    const renderActionButton = () => {
        // CASE 1: Auction chưa bắt đầu (UPCOMING)
        if (auction.status === 'UPCOMING') {
            if (!isAuthenticated) {
                return (
                    <button onClick={() => navigate('/login')} className="...">
                        Login to Register
                    </button>
                );
            }

            if (depositStatus?.depositPaid) {
                return (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <p className="font-bold text-green-900">You're Registered!</p>
                        <p className="text-sm text-green-700">
                            Auction starts {formatDate(auction.startTime)}
                        </p>
                    </div>
                );
            }

            return (
                <button
                    onClick={() => navigate(`/auctions/${id}/deposit`)}
                    className="w-full py-4 bg-gradient-to-r from-primary to-primary-light..."
                >
                    <Gavel className="w-6 h-6" />
                    Register for Auction (Pay Deposit)
                </button>
            );
        }

        // CASE 2: Auction đang diễn ra (ONGOING)
        if (auction.status === 'ONGOING') {
            if (!depositStatus?.depositPaid) {
                return (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
                        <AlertCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                        <p className="font-bold text-red-900">Auction in Progress</p>
                        <p className="text-sm text-red-700">
                            Deposit required to participate
                        </p>
                    </div>
                );
            }

            return (
                <button
                    onClick={() => navigate(`/auctions/${id}/room`)}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600..."
                >
                    <TrendingUp className="w-6 h-6" />
                    🔴 Join Live Auction Now
                </button>
            );
        }

        // CASE 3: Auction đã kết thúc (COMPLETED)
        if (auction.status === 'COMPLETED') {
            return (
                <div className="bg-gray-100 rounded-xl p-4 text-center">
                    <CheckCircle className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <p className="font-bold text-gray-900">Auction Ended</p>
                    {auction.winnerId && (
                        <p className="text-sm text-gray-600 mt-2">
                            Winner: {auction.winner?.fullName}
                        </p>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Status Banner */}
            {auction.status === 'ONGOING' && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-3">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-center gap-3 text-white">
                            <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                            <span className="font-bold text-lg">AUCTION LIVE NOW</span>
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                {statistics?.totalParticipants || 0} participants
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <main className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/auctions')}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Auctions</span>
                </button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Property Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Main Image */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={auction.property.thumbnail}
                                alt={auction.title}
                                className="w-full h-96 object-cover"
                            />

                            {/* Image Gallery Thumbnails */}
                            {auction.property.images && auction.property.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2 p-4">
                                    {auction.property.images.slice(0, 4).map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`Property ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title & Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {auction.title}
                                    </h1>
                                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                                        <MapPin className="w-5 h-5" />
                                        <span>{auction.property.address}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleFavorite}
                                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                                    >
                                        <Heart
                                            className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                                        />
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                                    >
                                        <Share2 className="w-6 h-6 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Property Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Home className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Type</p>
                                        <p className="font-bold text-gray-900">{auction.property.type}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Maximize2 className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Area</p>
                                        <p className="font-bold text-gray-900">{auction.property.area} m²</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Bed className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Bedrooms</p>
                                        <p className="font-bold text-gray-900">{auction.property.bedrooms}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Bath className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Bathrooms</p>
                                        <p className="font-bold text-gray-900">{auction.property.bathrooms}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Eye className="w-4 h-4" />
                                    <span>{auction.property.views} views</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>Posted {formatDate(auction.createdAt)}</span>
                                </div>
                                {auction.property.hasLegalDoc && (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Legal Documents</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {auction.description}
                            </p>
                        </div>

                        {/* Property Details */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { label: 'Property Type', value: auction.property.type },
                                    { label: 'Area', value: `${auction.property.area} m²` },
                                    { label: 'Bedrooms', value: auction.property.bedrooms },
                                    { label: 'Bathrooms', value: auction.property.bathrooms },
                                    { label: 'Floors', value: auction.property.floors },
                                    { label: 'Direction', value: auction.property.direction },
                                    { label: 'Furnished', value: auction.property.isFurnished ? 'Yes' : 'No' },
                                    { label: 'Legal Status', value: auction.property.hasLegalDoc ? 'Complete' : 'In Progress' },
                                ].map((item, index) => (
                                    <div key={index} className="flex justify-between py-3 border-b border-gray-100">
                                        <span className="text-gray-600">{item.label}</span>
                                        <span className="font-semibold text-gray-900">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Auction Statistics */}
                        {statistics && (
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Auction Statistics</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                                        <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-gray-900">{statistics.totalParticipants}</p>
                                        <p className="text-sm text-gray-600">Participants</p>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-xl">
                                        <Gavel className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-gray-900">{statistics.totalBids}</p>
                                        <p className="text-sm text-gray-600">Total Bids</p>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                                        <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-gray-900">{statistics.uniqueBidders}</p>
                                        <p className="text-sm text-gray-600">Unique Bidders</p>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-xl">
                                        <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-gray-900">
                                            {statistics.averageBid > 0 ? formatPrice(statistics.averageBid) : 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600">Avg Bid</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact Organizer */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Auction Organizer</h2>
                            <div className="flex items-center gap-4">
                                <img
                                    src={auction.creator.avatar}
                                    alt={auction.creator.fullName}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 mb-1">{auction.creator.fullName}</h3>
                                    <p className="text-sm text-gray-600">Verified Seller</p>
                                </div>
                                <div className="flex gap-2">
                                    <a
                                        href={`tel:${auction.creator.phone}`}
                                        className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors"
                                    >
                                        Call
                                    </a>
                                    <a
                                        href={`mailto:${auction.creator.email}`}
                                        className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors"
                                    >
                                        Email
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Auction Info */}
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Auction Status</h3>
                                {getStatusBadge(auction.status)}
                            </div>

                            {/* Countdown Timer */}
                            {(auction.status === 'UPCOMING' || auction.status === 'ONGOING') && (
                                <div className="mb-6">
                                    <p className="text-sm text-gray-600 mb-2">
                                        {auction.status === 'UPCOMING' ? 'Starts in:' : 'Ends in:'}
                                    </p>
                                    <CountdownTimer
                                        endTime={auction.status === 'UPCOMING' ? auction.startTime : auction.endTime}
                                        onEnd={() => window.location.reload()}
                                    />
                                </div>
                            )}

                            {/* Schedule */}
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Start Time:</span>
                                    <span className="font-semibold text-gray-900">{formatDate(auction.startTime)}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">End Time:</span>
                                    <span className="font-semibold text-gray-900">{formatDate(auction.endTime)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Info */}
                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
                            <p className="text-white/80 text-sm font-medium mb-2">
                                {auction.status === 'UPCOMING' ? 'Starting Price' : 'Current Bid'}
                            </p>
                            <p className="text-4xl font-bold mb-4">
                                {formatPrice(auction.currentPrice)}
                            </p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/80">Starting: {formatPrice(auction.startPrice)}</span>
                                {auction.currentPrice > auction.startPrice && (
                                    <span className="flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4" />
                                        {((auction.currentPrice - auction.startPrice) / auction.startPrice * 100).toFixed(1)}%
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Auction Requirements */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <h3 className="font-bold text-gray-900 mb-4">Auction Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Bid Step:</span>
                                    <span className="font-semibold text-gray-900">{formatPrice(auction.bidStep)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Deposit Required:</span>
                                    <span className="font-semibold text-primary">{formatPrice(auction.depositAmount)}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">Total Bids:</span>
                                    <span className="font-semibold text-gray-900">{statistics?.totalBids || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Deposit Status */}
                        {isAuthenticated && depositStatus && (
                            <div className={`rounded-2xl p-6 shadow-lg ${depositStatus.depositPaid
                                ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                                : 'bg-white'
                                }`}>
                                <div className="flex items-center gap-3 mb-3">
                                    {depositStatus.depositPaid ? (
                                        <CheckCircle className="w-6 h-6" />
                                    ) : (
                                        <AlertCircle className="w-6 h-6 text-orange-500" />
                                    )}
                                    <h3 className="font-bold">
                                        {depositStatus.depositPaid ? 'Deposit Paid' : 'Deposit Required'}
                                    </h3>
                                </div>
                                <p className={`text-sm ${depositStatus.depositPaid ? 'text-white/80' : 'text-gray-600'}`}>
                                    {depositStatus.depositPaid
                                        ? 'You can participate in this auction'
                                        : 'Pay deposit to join this auction'}
                                </p>
                            </div>
                        )}

                        {/* Action Button */}
                        {canJoinAuction && (
                            <button
                                onClick={handleJoinAuction}
                                className="w-full py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg flex items-center justify-center gap-2"
                            >
                                <Gavel className="w-6 h-6" />
                                {auction.status === 'ONGOING' ? 'Join Auction Now' : 'Register for Auction'}
                            </button>
                        )}

                        {/* Rules */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Bidding Rules
                            </h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li>• Deposit must be paid before bidding</li>
                                <li>• Each bid must exceed current bid by step amount</li>
                                <li>• Bids are binding and cannot be withdrawn</li>
                                <li>• Winner must complete payment within 24 hours</li>
                                <li>• Deposit refunded if you don't win</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}