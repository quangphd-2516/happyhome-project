import { UserCheck, Heart, FileText, Headphones } from 'lucide-react';
import { FEATURES } from '../../utils/constants';

const ICONS = {
    'user-check': UserCheck,
    'heart': Heart,
    'file-text': FileText,
    'headphones': Headphones,
};

export default function FeaturesSection() {
    return (
        <section className="py-16 md:py-24 bg-beige-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
                        Why Choose Us
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Elevating Your Home Buying Experience with Expertise, Integrity, and Unmatched Personalized Service
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES.map((feature) => {
                        const Icon = ICONS[feature.icon];
                        return (
                            <div
                                key={feature.id}
                                className="bg-accent-light p-6 rounded-xl hover:shadow-lg transition-shadow"
                            >
                                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-primary mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}