// src/components/common/Header.jsx
import { Search, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NAV_LINKS } from '../../utils/constants';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="bg-beige-50 sticky top-0 z-50 border-b border-beige-200">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <span className="text-2xl md:text-3xl font-bold text-primary">Dwello</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-gray-700 hover:text-primary transition-colors font-medium"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button className="p-2 hover:bg-beige-100 rounded-full transition-colors">
                            <Search className="w-5 h-5 text-gray-700" />
                        </button>
                        <button className="p-2 hover:bg-beige-100 rounded-full transition-colors">
                            <User className="w-5 h-5 text-gray-700" />
                        </button>
                        <button className="bg-white text-primary border-2 border-primary px-6 py-2.5 rounded-lg hover:bg-beige-100 transition-colors font-medium">
                            Login
                        </button>
                        <a href="/register" className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-light transition-colors font-medium inline-block text-center">
                            Sign up
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-gray-700" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-700" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-beige-200">
                        <nav className="flex flex-col space-y-4">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="text-gray-700 hover:text-primary transition-colors font-medium px-2"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="flex gap-3 mt-4">
                                <button className="flex-1 bg-white text-primary border-2 border-primary px-6 py-2.5 rounded-lg hover:bg-beige-100 transition-colors font-medium">
                                    Login
                                </button>
                                <a href="/register" className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-light transition-colors font-medium inline-block text-center">
                                    Sign up
                                </a>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}