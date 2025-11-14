import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIALS } from '../../utils/constants';
import TestimonialCard from './TestimonialCard';

export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    return (
        <section className="py-16 md:py-24 bg-beige-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2">
                        Khách hàng nói gì ?
                    </h2>
                    <h3 className="text-2xl md:text-3xl font-bold text-primary">
                        Về HappyHome
                    </h3>
                </div>

                {/* Testimonials Carousel */}
                <div className="relative max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((testimonial, idx) => (
                            <div
                                key={testimonial.id}
                                className={`transition-opacity duration-300 ${idx === currentIndex ? 'opacity-100' : 'hidden md:block opacity-100'
                                    }`}
                            >
                                <TestimonialCard testimonial={testimonial} />
                            </div>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={prev}
                            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-light transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={next}
                            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-light transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}