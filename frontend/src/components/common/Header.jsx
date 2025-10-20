// src/components/common/Header.jsx
import { Search, User, Menu, X, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NAV_LINKS } from '../../utils/constants';
import { useAuthStore } from '../../store/authStore';

export default function Header() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsDropdownOpen(false);
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="bg-beige-50 sticky top-0 z-50 border-b border-beige-200">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
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

                        {isAuthenticated && user ? (
                            // User Avatar + Dropdown
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-3 hover:bg-beige-100 rounded-full transition-colors p-1"
                                >
                                    {/* Avatar */}
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.fullName}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold border-2 border-primary">
                                            {getInitials(user.fullName)}
                                        </div>
                                    )}
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-2 border border-gray-200 z-50">
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-gray-200">
                                            <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>

                                        {/* Menu Items */}
                                        <button
                                            onClick={() => {
                                                navigate('/profile');
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                                        >
                                            <User className="w-4 h-4" />
                                            Profile
                                        </button>

                                        <button
                                            onClick={() => {
                                                navigate('/settings');
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </button>

                                        <hr className="my-2" />

                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Login & Sign up buttons
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-white text-primary border-2 border-primary px-6 py-2.5 rounded-lg hover:bg-beige-100 transition-colors font-medium"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-light transition-colors font-medium"
                                >
                                    Sign up
                                </button>
                            </>
                        )}
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

                            {isAuthenticated && user ? (
                                <div className="pt-4 border-t border-beige-200 space-y-3">
                                    <div className="px-2">
                                        <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigate('/profile');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left px-2 py-2 text-gray-700 hover:text-primary transition-colors"
                                    >
                                        Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-2 py-2 text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="flex-1 bg-white text-primary border-2 border-primary px-6 py-2.5 rounded-lg hover:bg-beige-100 transition-colors font-medium"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="flex-1 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-light transition-colors font-medium"
                                    >
                                        Sign up
                                    </button>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </div>

            {/* Click outside to close dropdown */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </header>
    );
}