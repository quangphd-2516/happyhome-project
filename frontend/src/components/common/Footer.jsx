import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { FOOTER_LINKS } from '../../utils/constants';

export default function Footer() {
    return (
        <footer className="bg-accent-light pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <h3 className="text-2xl font-bold text-primary mb-4">Dwello</h3>
                        <p className="text-gray-600 max-w-sm">
                            Discover your dream home. Where you will live with us. Click it one time.
                        </p>
                    </div>

                    {/* About Links */}
                    <div>
                        <h4 className="font-bold text-primary mb-4">About</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.about.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-gray-600 hover:text-primary transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-bold text-primary mb-4">Support</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.support.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-gray-600 hover:text-primary transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Find Us Links */}
                    <div>
                        <h4 className="font-bold text-primary mb-4">Find Us</h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.findUs.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-gray-600 hover:text-primary transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Social Links */}
                <div className="border-t border-gray-300 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-600 text-sm">
                            © 2025 Dwello. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-primary">Our Social</span>
                            <div className="flex gap-3">
                                <a href="#" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary-light transition-colors">
                                    <Instagram className="w-5 h-5 text-white" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary-light transition-colors">
                                    <Facebook className="w-5 h-5 text-white" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary-light transition-colors">
                                    <Twitter className="w-5 h-5 text-white" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}