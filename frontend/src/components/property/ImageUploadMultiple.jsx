// src/components/property/ImageUploadMultiple.jsx
import { useState } from 'react';
import { Upload, X, Image as ImageIcon, Star } from 'lucide-react';
import api from '../../services/api';

export default function ImageUploadMultiple({ images = [], onChange, maxImages = 10 }) {
    const [previews, setPreviews] = useState(images);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (previews.length + files.length > maxImages) {
            alert(`Maximum ${maxImages} images allowed`);
            return;
        }
        for (let file of files) {
            if (!file.type.startsWith('image/')) {
                alert('Please select only image files');
                continue;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Each file must be less than 5MB');
                continue;
            }
            const formData = new FormData();
            formData.append('images', file);
            try {
                const res = await api.post('/properties/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                const uploaded = res.data.images?.[0]?.url;
                if (uploaded) {
                    const newPreviews = [...previews, uploaded];
                    setPreviews(newPreviews);
                    onChange(newPreviews);
                }
            } catch (err) {
                alert('Failed to upload image.');
            }
        }
    };

    const handleRemove = (index) => {
        const newPreviews = previews.filter((_, i) => i !== index);
        setPreviews(newPreviews);
        onChange(newPreviews);

        if (mainImageIndex >= newPreviews.length) {
            setMainImageIndex(Math.max(0, newPreviews.length - 1));
        }
    };

    const handleSetMain = (index) => {
        setMainImageIndex(index);
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-primary hover:bg-blue-50 transition-all cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                                Click to upload images
                            </p>
                            <p className="text-xs text-gray-500">
                                PNG, JPG up to 5MB each (Max {maxImages} images)
                            </p>
                        </div>
                    </div>
                </div>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </label>

            {/* Image Grid */}
            {previews.length > 0 && (
                <div>
                    <p className="text-sm font-semibold text-gray-900 mb-3">
                        Uploaded Images ({previews.length}/{maxImages})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {previews.map((url, index) => (
                            <div key={index} className="relative group">
                                <div className={`relative rounded-xl overflow-hidden border-2 ${index === mainImageIndex ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-gray-200'
                                    }`}>
                                    <img
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover"
                                    />

                                    {/* Main Image Badge */}
                                    {index === mainImageIndex && (
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-yellow-900" />
                                            Main
                                        </div>
                                    )}

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        {index !== mainImageIndex && (
                                            <button
                                                onClick={() => handleSetMain(index)}
                                                className="px-3 py-1.5 bg-yellow-400 text-yellow-900 rounded-lg text-xs font-semibold hover:bg-yellow-500 transition-colors"
                                            >
                                                Set Main
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleRemove(index)}
                                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        * Click "Set Main" to choose the thumbnail image
                    </p>
                </div>
            )}
        </div>
    );
}