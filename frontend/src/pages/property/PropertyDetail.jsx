// src/pages/property/PropertyDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Heart, Share2, Phone, Mail, MessageCircle,
    ArrowLeft, MapPin, Calendar, Eye, AlertCircle
} from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import PropertyGallery from '../../components/property/PropertyGallery';
import PropertyInfo from '../../components/property/PropertyInfo';
import PropertyReviews from '../../components/property/PropertyReviews';
import { propertyService } from '../../services/propertyService';
import { chatService } from '../../services/chatService';
import { useAuthStore } from '../../store/authStore';

export default function PropertyDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);
    const [creatingChat, setCreatingChat] = useState(false);

    // Mock property data for development
    const mockProperty = {
        id: 1,
        title: 'Modern Villa in Beverly Hills',
        address: '123 Luxury Avenue, Beverly Hills, California 90210',
        type: 'VILLA',
        price: 2500000,
        area: 450,
        bedrooms: 4,
        bathrooms: 3,
        floors: 2,
        direction: 'South',
        legalStatus: 'Full ownership',
        views: 1250,
        isPremium: true,
        description: 'This stunning modern villa offers luxurious living in the heart of Beverly Hills.',
        images: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
        ],
        amenities: [
            'Air Conditioning', 'Swimming Pool', 'Home Gym', 'Private Parking',
            '24/7 Security', 'Garden', 'Balconies', 'Elevator',
        ],
        owner: {
            id: 'owner-user-id-123', // Owner's user ID
            name: 'Premium Real Estate',
            phone: '+1 (555) 123-4567',
            email: 'contact@premium.com',
            avatar: 'https://i.pravatar.cc/150?img=20',
        },
        createdAt: new Date('2024-01-01'),
    };

    useEffect(() => {
        fetchProperty();
    }, [id]);

    const fetchProperty = async () => {
        setLoading(true);
        try {
            const response = await propertyService.getById(id);
            setProperty(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Fetch property error:', error);
            setProperty(mockProperty);
            setLoading(false);
        }
    };

    const handleFavorite = async () => {
        try {
            if (isFavorite) {
                await propertyService.removeFromFavorites(id);
            } else {
                await propertyService.addToFavorites(id);
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Favorite error:', error);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: property.title,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Share error:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied!');
        }
    };

    const handleChatNow = async () => {
        // Check if user is authenticated
        if (!isAuthenticated) {
            alert('Please login to chat with the owner');
            navigate('/login');
            return;
        }

        setCreatingChat(true);
        try {
            // Create or get existing chat with property owner
            const response = await chatService.createChat(property.owner.id);

            // Navigate to chat page with the chat ID
            navigate(`/chats/${response.data.id}`);
        } catch (error) {
            console.error('Create chat error:', error);
            alert('Failed to start chat. Please try again.');
        } finally {
            setCreatingChat(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
                    <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/properties')}
                        className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-light"
                    >
                        Back to Properties
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to listings</span>
                </button>

                {/* Title & Actions */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            {property.isPremium && (
                                <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                                    PREMIUM
                                </span>
                            )}
                            <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                                {property.type}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            {property.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                <span>{property.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                <span>{property.views} views</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>Posted {new Date(property.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleFavorite}
                            className="w-12 h-12 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-primary transition-colors"
                        >
                            <Heart
                                className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                            />
                        </button>
                        <button
                            onClick={handleShare}
                            className="w-12 h-12 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center hover:border-primary transition-colors"
                        >
                            <Share2 className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Gallery & Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <PropertyGallery images={property.images} />
                        <PropertyInfo property={property} />
                        <PropertyReviews propertyId={property.id} reviews={property.reviews} />
                    </div>

                    {/* Right Column - Contact */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Owner Card */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Owner</h3>

                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                                    <img
                                        src={property.owner.avatar}
                                        alt={property.owner.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-bold text-gray-900">{property.owner.name}</h4>
                                        <p className="text-sm text-gray-600">Property Agent</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {/* Chat Now Button - UPDATED */}
                                    <button
                                        onClick={handleChatNow}
                                        disabled={creatingChat}
                                        className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-light transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {creatingChat ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Opening Chat...</span>
                                            </>
                                        ) : (
                                            <>
                                                <MessageCircle className="w-5 h-5" />
                                                <span>Chat Now</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Call Button */}
                                    <a
                                        href={`tel:${property.owner.phone}`}
                                        className="w-full py-3 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                        <Phone className="w-5 h-5" />
                                        Call Now
                                    </a>

                                    {/* Email Button */}
                                    <a
                                        href={`mailto:${property.owner.email}`}
                                        className="w-full py-3 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                        <Mail className="w-5 h-5" />
                                        Send Email
                                    </a>

                                    {/* Message Form Toggle */}
                                    <button
                                        onClick={() => setShowContactForm(!showContactForm)}
                                        className="w-full py-3 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                        <Mail className="w-5 h-5" />
                                        Send Message
                                    </button>
                                </div>

                                {/* Contact Form */}
                                {showContactForm && (
                                    <form className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Your Email"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Your Phone"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                                        />
                                        <textarea
                                            placeholder="Your Message"
                                            rows={4}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                                        ></textarea>
                                        <button
                                            type="submit"
                                            className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-light transition-colors font-medium"
                                        >
                                            Send Message
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-6 text-white">
                                <h4 className="font-bold mb-4">Quick Facts</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="opacity-90">Property ID:</span>
                                        <span className="font-semibold">#{property.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="opacity-90">Type:</span>
                                        <span className="font-semibold">{property.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="opacity-90">Status:</span>
                                        <span className="font-semibold">Available</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}