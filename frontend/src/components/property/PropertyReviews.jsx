// src/components/property/PropertyReviews.jsx
import { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, Send } from 'lucide-react';
import { propertyService } from '../../services/propertyService';

export default function PropertyReviews({ propertyId, reviews: initialReviews }) {
    const [reviews, setReviews] = useState(initialReviews || []);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: '',
    });
    const [submitting, setSubmitting] = useState(false);

    // Mock reviews for development
    const mockReviews = reviews.length > 0 ? reviews : [
        {
            id: 1,
            user: {
                name: 'John Doe',
                avatar: 'https://i.pravatar.cc/150?img=1',
            },
            rating: 5,
            comment: 'Amazing property! The location is perfect and the amenities are top-notch. Highly recommended for anyone looking for a premium living experience.',
            date: new Date('2024-01-15'),
            helpful: 12,
        },
        {
            id: 2,
            user: {
                name: 'Sarah Johnson',
                avatar: 'https://i.pravatar.cc/150?img=2',
            },
            rating: 4,
            comment: 'Great property with excellent facilities. The only downside is the parking space could be larger.',
            date: new Date('2024-01-10'),
            helpful: 8,
        },
        {
            id: 3,
            user: {
                name: 'Michael Chen',
                avatar: 'https://i.pravatar.cc/150?img=3',
            },
            rating: 5,
            comment: 'Beautiful home in a quiet neighborhood. The interior design is modern and elegant. Would definitely recommend!',
            date: new Date('2024-01-05'),
            helpful: 15,
        },
    ];

    const displayReviews = reviews.length > 0 ? reviews : mockReviews;

    const averageRating = displayReviews.reduce((sum, r) => sum + r.rating, 0) / displayReviews.length;

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: displayReviews.filter(r => r.rating === rating).length,
        percentage: (displayReviews.filter(r => r.rating === rating).length / displayReviews.length) * 100,
    }));

    const formatDate = (date) => {
        // Nếu không có giá trị hoặc là invalid date thì trả về text mặc định
        if (!date) return 'Không rõ ngày';
        const parsedDate = new Date(date);
        if (isNaN(parsedDate)) return 'Không rõ ngày';

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(parsedDate);
    };


    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!newReview.comment.trim()) return;

        setSubmitting(true);
        try {
            await propertyService.addReview(propertyId, newReview);

            // Add new review to the list
            const review = {
                id: Date.now(),
                user: {
                    name: 'You',
                    avatar: 'https://i.pravatar.cc/150?img=10',
                },
                rating: newReview.rating,
                comment: newReview.comment,
                date: new Date(),
                helpful: 0,
            };

            setReviews([review, ...displayReviews]);
            setNewReview({ rating: 5, comment: '' });
            setShowReviewForm(false);
        } catch (error) {
            console.error('Submit review error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating, size = 'w-5 h-5') => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${size} ${star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            {/* Rating Overview */}
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h3>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {/* Average Rating */}
                    <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                        <div className="text-5xl font-bold text-gray-900 mb-2">
                            {averageRating.toFixed(1)}
                        </div>
                        {renderStars(Math.round(averageRating))}
                        <p className="text-sm text-gray-600 mt-2">
                            Based on {displayReviews.length} reviews
                        </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="md:col-span-2 space-y-2">
                        {ratingDistribution.map(({ rating, count, percentage }) => (
                            <div key={rating} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-16">
                                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                </div>
                                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Write Review Button */}
            {!showReviewForm && (
                <button
                    onClick={() => setShowReviewForm(true)}
                    className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-light transition-colors font-medium flex items-center justify-center gap-2"
                >
                    <MessageCircle className="w-5 h-5" />
                    Write a Review
                </button>
            )}

            {/* Review Form */}
            {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Your Rating
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= newReview.rating
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'fill-gray-200 text-gray-200'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Your Review
                        </label>
                        <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            placeholder="Share your experience with this property..."
                            rows={4}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                            required
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-3 bg-primary text-white rounded-xl hover:bg-primary-light transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Send className="w-5 h-5" />
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-bold text-gray-900">
                    Customer Reviews ({displayReviews.length})
                </h4>

                {displayReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                            <img
                                src={review.user.avatar}
                                alt={review.user.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <h5 className="font-bold text-gray-900">{review.user.name}</h5>
                                        <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                                    </div>
                                    {renderStars(review.rating, 'w-4 h-4')}
                                </div>

                                <p className="text-gray-700 leading-relaxed mb-3">
                                    {review.comment}
                                </p>

                                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                                    <ThumbsUp className="w-4 h-4" />
                                    Helpful ({review.helpful})
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}