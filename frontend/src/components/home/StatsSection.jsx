import { STATS } from '../../utils/constants';

export default function StatsSection() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <div className="order-2 lg:order-1">
                        <img
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                            alt="Luxury villa"
                            className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-xl"
                        />
                    </div>

                    {/* Content */}
                    <div className="order-1 lg:order-2 space-y-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
                                We Help You To Find<br />Your Dream Home
                            </h2>
                            <p className="text-gray-600 text-lg">
                                From cozy cottages to luxurious estates, our curated selection caters to every taste and lifestyle, ensuring you find the perfect place to call home.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6">
                            {STATS.map((stat) => (
                                <div key={stat.id} className="text-center lg:text-left">
                                    <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm md:text-base text-gray-600">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}