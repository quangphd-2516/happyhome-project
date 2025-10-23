// src/components/auction/AuctionCard.jsx
import { useNavigate } from 'react-router-dom';
import { Gavel, TrendingUp, Users, Calendar } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

export default function AuctionCard({ auction }) {
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStatusBadge = (status) => {
        const config = {
            UPCOMING: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Upcoming' },
            ONGOING: { bg: 'bg-green-100', text: 'text-green-700', label: 'Live Now', pulse: true },
            COMPLETED: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Completed' },
            CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
        };
        const { bg, text, label, pulse } = config[auction.status] || config.UPCOMING;

        return (
            <div className="flex items-center gap-2">
                {pulse && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
                <span className={`px-3 py-1 ${bg} ${text} text-xs font-semibold rounded-full`}>
                    {label}
                </span>
            </div>
        );
    };

    return (
        <div
            onClick={() => navigate(`/auctions/${auction.id}`)}
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
        >
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={auction.property?.thumbnail || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                    alt={auction.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                    {getStatusBadge(auction.status)}
                </div>

                {/* Bid Count */}
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-white" />
                    <span className="text-xs font-medium text-white">{auction.bids?.length || 0} Bids</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                    {auction.title}
                </h3>

                {/* Current Price */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Current Bid</p>
                            <div className="flex items-center gap-2">
                                <p className="text-3xl font-bold text-primary">
                                    {formatPrice(auction.currentPrice)}
                                </p>
                                {auction.currentPrice > auction.startPrice && (
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">Starting Price</p>
                            <p className="text-lg font-semibold text-gray-700">
                                {formatPrice(auction.startPrice)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Time Remaining */}
                {auction.status === 'ONGOING' && (
                    <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Time Remaining</p>
                        <CountdownTimer endTime={auction.endTime} />
                    </div>
                )}

                {auction.status === 'UPCOMING' && (
                    <div className="mb-4 flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <p className="text-sm">
                            Starts: {new Date(auction.startTime).toLocaleString()}
                        </p>
                    </div>
                )}

                {/* CTA Button */}
                <button
                    className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${auction.status === 'ONGOING'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg'
                            : auction.status === 'UPCOMING'
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-200 text-gray-600 cursor-not-allowed'
                        }`}
                    disabled={auction.status === 'COMPLETED' || auction.status === 'CANCELLED'}
                >
                    <Gavel className="w-5 h-5" />
                    {auction.status === 'ONGOING' ? 'Bid Now' :
                        auction.status === 'UPCOMING' ? 'View Details' :
                            'Auction Ended'}
                </button>
            </div>
        </div>
    );
}