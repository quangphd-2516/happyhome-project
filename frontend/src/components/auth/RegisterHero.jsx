// src/components/auth/RegisterHero.jsx

export default function RegisterHero() {
    return (
        <div className="relative h-full min-h-screen overflow-hidden">
            {/* Background Image */}
            <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"
                alt="Luxury modern home"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            {/* Logo/Brand */}
            <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center">
                    <h1 className="text-7xl md:text-8xl font-bold text-white drop-shadow-2xl">
                        Dwello
                    </h1>
                    <p className="text-xl text-white mt-4 drop-shadow-lg font-light tracking-widest">
                        REAL ESTATE & AUCTION
                    </p>
                </div>
            </div>
        </div>
    );
}