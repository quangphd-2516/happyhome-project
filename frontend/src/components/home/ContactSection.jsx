import { MessageCircle, FileQuestion } from 'lucide-react';

export default function ContactSection() {
    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
                            Do You Have Any Questions?
                        </h2>
                        <h3 className="text-2xl md:text-3xl font-bold text-primary">
                            Get Help From Us
                        </h3>
                    </div>

                    {/* Action Cards */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <button className="flex items-center justify-center gap-3 p-4 border-2 border-gray-300 rounded-xl hover:border-primary transition-colors">
                            <MessageCircle className="w-6 h-6 text-primary" />
                            <span className="font-medium text-gray-700">Chat live with our support team</span>
                        </button>
                        <button className="flex items-center justify-center gap-3 p-4 border-2 border-gray-300 rounded-xl hover:border-primary transition-colors">
                            <FileQuestion className="w-6 h-6 text-primary" />
                            <span className="font-medium text-gray-700">Browse our FAQ</span>
                        </button>
                    </div>

                    {/* Contact Form */}
                    <div className="flex gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email address..."
                            className="flex-1 px-6 py-4 bg-accent-light border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-primary-light transition-colors font-medium">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}