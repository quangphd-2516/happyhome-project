// src/components/property/PropertyGallery.jsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

export default function PropertyGallery({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleThumbnailClick = (index) => {
        setCurrentIndex(index);
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    if (!images || images.length === 0) {
        return (
            <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
                <p className="text-gray-500">No images available</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <img
                    src={images[currentIndex]}
                    alt={`Property image ${currentIndex + 1}`}
                    className="w-full h-96 object-cover"
                />

                {/* Navigation Buttons */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-900" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-900" />
                        </button>
                    </>
                )}

                {/* Fullscreen Button */}
                <button
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                >
                    <Maximize2 className="w-5 h-5 text-gray-900" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
                    <span className="text-sm font-medium text-white">
                        {currentIndex + 1} / {images.length}
                    </span>
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => handleThumbnailClick(index)}
                            className={`relative rounded-lg overflow-hidden h-20 transition-all ${index === currentIndex
                                    ? 'ring-4 ring-primary shadow-lg'
                                    : 'hover:ring-2 ring-gray-300'
                                }`}
                        >
                            <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            {index === currentIndex && (
                                <div className="absolute inset-0 bg-primary/20"></div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                    {/* Close Button */}
                    <button
                        onClick={toggleFullscreen}
                        className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10"
                            >
                                <ChevronLeft className="w-7 h-7 text-white" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10"
                            >
                                <ChevronRight className="w-7 h-7 text-white" />
                            </button>
                        </>
                    )}

                    {/* Image */}
                    <img
                        src={images[currentIndex]}
                        alt={`Property image ${currentIndex + 1}`}
                        className="max-w-full max-h-full object-contain"
                    />

                    {/* Counter */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                        <span className="text-base font-medium text-white">
                            {currentIndex + 1} / {images.length}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}