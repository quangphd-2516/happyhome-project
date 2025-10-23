// src/components/auction/BidForm.jsx
import { useState } from 'react';
import { Gavel, Plus, Minus } from 'lucide-react';

export default function BidForm({ currentBid, bidStep, minBid, onBid, isLoading }) {
    const [bidAmount, setBidAmount] = useState(minBid || currentBid + bidStep);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleIncrement = () => {
        setBidAmount(prev => prev + bidStep);
    };

    const handleDecrement = () => {
        if (bidAmount - bidStep >= minBid) {
            setBidAmount(prev => prev - bidStep);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (bidAmount < minBid) {
            alert(`Minimum bid is ${formatPrice(minBid)}`);
            return;
        }
        onBid(bidAmount);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="mb-6">
                <label className="block text-white/80 text-sm font-medium mb-2">
                    Your Bid Amount
                </label>

                {/* Bid Amount Display */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                    <div className="text-center">
                        <p className="text-4xl font-bold mb-2">
                            {formatPrice(bidAmount)}
                        </p>
                        <p className="text-white/70 text-sm">
                            Minimum bid: {formatPrice(minBid)}
                        </p>
                    </div>
                </div>

                {/* Increment/Decrement Buttons */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleDecrement}
                        disabled={bidAmount - bidStep < minBid}
                        className="flex-1 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Minus className="w-5 h-5" />
                        {formatPrice(bidStep)}
                    </button>

                    <button
                        type="button"
                        onClick={handleIncrement}
                        className="flex-1 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        {formatPrice(bidStep)}
                    </button>
                </div>
            </div>

            {/* Quick Bid Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-6">
                {[1, 2, 3].map(multiplier => {
                    const quickBid = minBid + (bidStep * multiplier);
                    return (
                        <button
                            key={multiplier}
                            type="button"
                            onClick={() => setBidAmount(quickBid)}
                            className="py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all"
                        >
                            +{formatPrice(bidStep * multiplier)}
                        </button>
                    );
                })}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50"
            >
                {isLoading ? 'Placing Bid...' : (
                    <>
                        <Gavel className="inline-block mr-2 w-5 h-5" />
                        Place Bid
                    </>
                )}
            </button>
        </form>
    );
}