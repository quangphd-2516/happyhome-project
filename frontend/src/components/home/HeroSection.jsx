import { MapPin, Home, DollarSign, Search } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="bg-beige-50 pt-8 pb-16 md:pt-12 md:pb-24">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
                            Find Your<br />Dream Home
                        </h1>
                        <p className="text-gray-600 text-lg md:text-xl max-w-lg">
                            Explore our curated selection of exquisite properties meticulously tailored to your unique dream home vision
                        </p>
                        <button className="bg-primary text-white px-8 py-3.5 rounded-lg hover:bg-primary-light transition-colors font-medium text-lg shadow-lg">
                            Start now
                        </button>
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
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                                    <option>Select location</option>
                                    <option>San Francisco</option>
                                    <option>Los Angeles</option>
                                    <option>San Diego</option>
                                </select>
                            </div>
                        </div>

                        {/* Type */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type
                            </label>
                            <div className="relative">
                                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                                    <option>Property type</option>
                                    <option>House</option>
                                    <option>Apartment</option>
                                    <option>Villa</option>
                                </select>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price Range
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                                    <option>Select price</option>
                                    <option>$0 - $500k</option>
                                    <option>$500k - $1M</option>
                                    <option>$1M+</option>
                                </select>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="flex items-end">
                            <button className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-light transition-colors font-medium flex items-center justify-center gap-2">
                                <Search className="w-5 h-5" />
                                <span>Search</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}