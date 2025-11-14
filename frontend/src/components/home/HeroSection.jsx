import { MapPin, Home, DollarSign, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
    return (
        <section className="bg-beige-50 pt-8 pb-16 md:pt-12 md:pb-24">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
                            Tìm Ngôi Nhà Mơ Ước Của Bạn
                        </h1>
                        <p className="text-gray-600 text-lg md:text-xl max-w-lg">
                            Khám phá tuyển chọn các bất động sản tinh tế, được thiết kế phù hợp với tầm nhìn ngôi nhà trong mơ của bạn
                        </p>
                        <Link
                            to="/properties"
                            className="mt-[5px] bg-primary text-white px-8 py-3.5 rounded-lg hover:bg-primary-light transition-colors font-medium text-lg shadow-lg inline-block"
                        >
                            Bắt đầu ngay
                        </Link>
                    </div>

                    {/* Right Image */}
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                            alt="Modern luxury home"
                            className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-2xl"
                        />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mt-12 bg-accent-light rounded-2xl p-6 shadow-lg">
                    <div className="grid md:grid-cols-4 gap-4">
                        {/* Location */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Khu vực
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                                    <option>Chọn khu vực</option>
                                    <option>San Francisco</option>
                                    <option>Los Angeles</option>
                                    <option>San Diego</option>
                                </select>
                            </div>
                        </div>

                        {/* Type */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại hình
                            </label>
                            <div className="relative">
                                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                                    <option>Loại bất động sản</option>
                                    <option>Nhà riêng</option>
                                    <option>Căn hộ</option>
                                    <option>Biệt thự</option>
                                </select>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mức giá
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                                    <option>Chọn giá</option>
                                    <option>0 - 500 triệu</option>
                                    <option>500 triệu - 1 tỷ</option>
                                    <option>Trên 1 tỷ</option>
                                </select>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="flex items-end">
                            <button className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-light transition-colors font-medium flex items-center justify-center gap-2">
                                <Search className="w-5 h-5" />
                                <span>Tìm kiếm</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}