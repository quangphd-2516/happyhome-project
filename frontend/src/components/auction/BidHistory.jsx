// src/components/auction/BidHistory.jsx
import { TrendingUp, Crown, User } from 'lucide-react';

export default function BidHistory({ bids = [] }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (bids.length === 0) {
        return (
            <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Chưa có ai trả giá. Hãy là người đầu tiên!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {bids.map((bid, index) => (
                <div
                    key={bid.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${index === 0
                            ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                >
                    {/* Rank/Crown */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${index === 0
                            ? 'bg-yellow-400'
                            : 'bg-gray-300'
                        }`}>
                        {index === 0 ? (
                            <Crown className="w-5 h-5 text-yellow-900 fill-yellow-900" />
                        ) : (
                            <span className="text-sm font-bold text-gray-700">#{index + 1}</span>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className={`font-semibold ${index === 0 ? 'text-yellow-900' : 'text-gray-900'}`}>
                                {bid.userName || `Bidder ${index + 1}`}
                            </p>
                            <p className="text-xs text-gray-500">{formatTime(bid.createdAt)}</p>
                        </div>
                    </div>

                    {/* Bid Amount */}
                    <div className="text-right">
                        <p className={`text-2xl font-bold ${index === 0 ? 'text-yellow-900' : 'text-primary'
                            }`}>
                            {formatPrice(bid.amount)}
                        </p>
                        {index === 0 && (
                            <p className={`text-xs text-yellow-700 font-semibold`}>Giá cao nhất</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}