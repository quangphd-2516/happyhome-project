import { Star } from 'lucide-react';

export default function TestimonialCard({ testimonial }) {
    return (
        <div className="bg-accent-light rounded-2xl overflow-hidden shadow-lg">
            {/* Image */}
            <div className="h-48 overflow-hidden">
                <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="p-6">
                {/* User Info */}
                <div className="flex items-center gap-4 mb-4">
                    <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                        <h4 className="font-bold text-primary">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-gray-700">{testimonial.rating}</span>
                    </div>
                </div>

                {/* Review Text */}
                <p className="text-gray-600 text-sm leading-relaxed">
                    {testimonial.text}
                </p>
            </div>
        </div>
    );
}