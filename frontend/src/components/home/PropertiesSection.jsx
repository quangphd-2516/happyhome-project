import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { propertyService } from '../../services/propertyService';
import PropertyCard from './PropertyCard';

const SCROLL_SPEED = 0.5; // Tốc độ scroll (pixels mỗi lần)
const SCROLL_INTERVAL = 20; // Interval (ms)
const PAUSE_DURATION = 5000; // Thời gian dừng khi user tương tác

export default function PropertiesSection() {
    const navigate = useNavigate(); // Thêm hook navigate
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const scrollContainerRef = useRef(null);
    const scrollIntervalRef = useRef(null);
    const isPausedRef = useRef(false);
    const scrollDirectionRef = useRef(1); // 1 = phải, -1 = trái
    const pauseTimeoutRef = useRef(null);

    // Fetch properties
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setIsLoading(true);
                const response = await propertyService.getAll();

                // DEBUG: Kiểm tra cấu trúc dữ liệu
                console.log('🔍 Raw API Response:', response);
                console.log('🔍 Response.data:', response.data);

                const data = response.data || [];
                console.log('🔍 Properties array:', data);

                if (data.length > 0) {
                    console.log('🔍 First property:', data[0]);
                    console.log('🔍 Available fields:', Object.keys(data[0]));
                }

                setProperties(data);
                setError(null);
            } catch (err) {
                console.error('❌ Lỗi khi lấy danh sách bất động sản:', err);
                console.error('❌ Error details:', err.message);
                setError('Không thể tải danh sách bất động sản');
                setProperties([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperties();
    }, []);

    // Auto-scroll logic
    const startAutoScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Clear existing interval
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
        }

        scrollIntervalRef.current = setInterval(() => {
            if (isPausedRef.current) return;

            const maxScroll = container.scrollWidth - container.clientWidth;
            const currentScroll = container.scrollLeft;

            // Đổi hướng khi chạm biên
            if (currentScroll >= maxScroll - 1) {
                scrollDirectionRef.current = -1;
            } else if (currentScroll <= 1) {
                scrollDirectionRef.current = 1;
            }

            // Scroll mượt
            container.scrollLeft += SCROLL_SPEED * scrollDirectionRef.current;
        }, SCROLL_INTERVAL);
    }, []);

    // Pause auto-scroll
    const pauseAutoScroll = useCallback(() => {
        isPausedRef.current = true;

        // Clear timeout cũ
        if (pauseTimeoutRef.current) {
            clearTimeout(pauseTimeoutRef.current);
        }

        // Resume sau PAUSE_DURATION
        pauseTimeoutRef.current = setTimeout(() => {
            isPausedRef.current = false;
        }, PAUSE_DURATION);
    }, []);

    // Setup auto-scroll khi có properties
    useEffect(() => {
        if (properties.length > 0) {
            // Đợi một chút để DOM render xong
            setTimeout(() => {
                startAutoScroll();
            }, 500);
        }

        return () => {
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
            }
            if (pauseTimeoutRef.current) {
                clearTimeout(pauseTimeoutRef.current);
            }
        };
    }, [properties, startAutoScroll]);

    // Event listeners để pause khi user tương tác
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleInteraction = () => {
            pauseAutoScroll();
        };

        container.addEventListener('mouseenter', handleInteraction);
        container.addEventListener('touchstart', handleInteraction);
        container.addEventListener('wheel', handleInteraction);

        return () => {
            container.removeEventListener('mouseenter', handleInteraction);
            container.removeEventListener('touchstart', handleInteraction);
            container.removeEventListener('wheel', handleInteraction);
        };
    }, [pauseAutoScroll]);

    // Handle view property - Điều hướng đến trang chi tiết
    const handleViewProperty = useCallback((property) => {
        navigate(`/properties/${property.id}`);
    }, [navigate]);

    // Loading state
    if (isLoading) {
        return (
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">Đang tải bất động sản...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="text-red-600 text-lg mb-4">⚠️ {error}</div>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Empty state
    if (properties.length === 0) {
        return (
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center text-gray-600">
                        <p className="text-lg">Chưa có bất động sản nào</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
                        Our Popular Residences
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Khám phá những bất động sản được yêu thích nhất
                    </p>
                </div>

                {/* Properties Carousel */}
                <div className="relative">
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-2 py-4 scrollbar-hide"
                    >
                        {properties.map((property) => (
                            <div
                                key={property.id}
                                className="flex-none w-[320px] md:w-[360px] snap-center"
                            >
                                <PropertyCard
                                    property={property}
                                    onViewDetails={handleViewProperty}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Scroll Indicators (Optional) */}
                    <div className="flex justify-center gap-2 mt-6">
                        {properties.slice(0, 5).map((_, idx) => (
                            <div
                                key={idx}
                                className="w-2 h-2 rounded-full bg-gray-300"
                            />
                        ))}
                    </div>
                </div>

                {/* CSS ẩn scrollbar */}
                <style jsx>{`
                    .scrollbar-hide {
                        scrollbar-width: none; /* Firefox */
                        -ms-overflow-style: none; /* IE/Edge */
                    }
                    .scrollbar-hide::-webkit-scrollbar {
                        display: none; /* Chrome/Safari */
                    }
                `}</style>
            </div>
        </section>
    );
}