// frontend/src/components/admin/KYCDocuments.jsx
import { useState } from 'react';
import {
    FileImage,
    ZoomIn,
    ZoomOut,
    Download,
    X,
    Maximize2,
    RotateCw,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const KYCDocuments = ({ documents }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [zoom, setZoom] = useState(100);
    const [rotation, setRotation] = useState(0);

    const documentTypes = [
        {
            key: 'idCardFront',
            label: 'ID Card - Front',
            description: 'Front side of identification card'
        },
        {
            key: 'idCardBack',
            label: 'ID Card - Back',
            description: 'Back side of identification card'
        },
        {
            key: 'selfieWithId',
            label: 'Selfie with ID',
            description: 'Photo holding identification card'
        }
    ];

    const openModal = (imageUrl, label) => {
        setSelectedImage({ url: imageUrl, label });
        setZoom(100);
        setRotation(0);
    };

    const closeModal = () => {
        setSelectedImage(null);
        setZoom(100);
        setRotation(0);
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 25, 200));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 25, 50));
    };

    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    const handleDownload = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename || 'kyc-document.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download image');
        }
    };

    const getCurrentImageIndex = () => {
        if (!selectedImage) return -1;
        return documentTypes.findIndex(doc => documents[doc.key] === selectedImage.url);
    };

    const navigateImage = (direction) => {
        const currentIndex = getCurrentImageIndex();
        const newIndex = direction === 'next'
            ? (currentIndex + 1) % documentTypes.length
            : (currentIndex - 1 + documentTypes.length) % documentTypes.length;

        const newDoc = documentTypes[newIndex];
        if (documents[newDoc.key]) {
            openModal(documents[newDoc.key], newDoc.label);
        }
    };

    return (
        <>
            {/* Documents Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                            KYC Documents
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Review submitted identification documents
                        </p>
                    </div>
                    <FileImage className="w-8 h-8 text-blue-600" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {documentTypes.map((docType) => {
                        const imageUrl = documents[docType.key];

                        return (
                            <div
                                key={docType.key}
                                className="group relative bg-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden hover:border-blue-400 transition-all duration-300"
                            >
                                {/* Image Container */}
                                <div className="aspect-[4/3] relative bg-gray-100">
                                    {imageUrl ? (
                                        <>
                                            <img
                                                src={imageUrl}
                                                alt={docType.label}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Overlay on Hover */}
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                                <button
                                                    onClick={() => openModal(imageUrl, docType.label)}
                                                    className="p-3 bg-white rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-lg"
                                                    title="View full size"
                                                >
                                                    <Maximize2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(imageUrl, `${docType.key}.jpg`)}
                                                    className="p-3 bg-white rounded-full hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-lg"
                                                    title="Download"
                                                >
                                                    <Download className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-center text-gray-400">
                                                <FileImage className="w-12 h-12 mx-auto mb-2" />
                                                <p className="text-sm">No image uploaded</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Document Info */}
                                <div className="p-4 bg-white">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        {docType.label}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {docType.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Document Guidelines */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                        Document Verification Checklist
                    </h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>All text on ID card must be clearly readable</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>Photo on ID card must match the selfie</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>ID card must not be expired</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>Selfie must show full face and ID card clearly</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>No signs of tampering or photo editing</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-6 z-10">
                        <div className="max-w-7xl mx-auto flex items-center justify-between">
                            <h3 className="text-white text-xl font-semibold">
                                {selectedImage.label}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={() => navigateImage('prev')}
                        className="absolute left-4 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors z-10"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>

                    <button
                        onClick={() => navigateImage('next')}
                        className="absolute right-4 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors z-10"
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>

                    {/* Image Container */}
                    <div className="max-w-6xl max-h-[80vh] overflow-auto">
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.label}
                            className="w-auto max-w-full h-auto max-h-full mx-auto transition-transform duration-300"
                            style={{
                                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`
                            }}
                        />
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
                            <button
                                onClick={handleZoomOut}
                                disabled={zoom <= 50}
                                className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ZoomOut className="w-5 h-5 text-white" />
                            </button>

                            <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-white font-medium min-w-[80px] text-center">
                                {zoom}%
                            </span>

                            <button
                                onClick={handleZoomIn}
                                disabled={zoom >= 200}
                                className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ZoomIn className="w-5 h-5 text-white" />
                            </button>

                            <div className="w-px h-8 bg-white bg-opacity-30 mx-2" />

                            <button
                                onClick={handleRotate}
                                className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
                            >
                                <RotateCw className="w-5 h-5 text-white" />
                            </button>

                            <button
                                onClick={() => handleDownload(selectedImage.url, `${selectedImage.label}.jpg`)}
                                className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
                            >
                                <Download className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default KYCDocuments;