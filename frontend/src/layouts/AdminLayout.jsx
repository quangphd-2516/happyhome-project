// src/layouts/AdminLayout.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, Home, Gavel, FileCheck,
    Settings, LogOut, Menu, X, Bell, Search,
    ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function AdminLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const menuItems = [
        {
            title: 'Dashboard',
            icon: LayoutDashboard,
            path: '/admin/dashboard',
        },
        {
            title: 'User Management',
            icon: Users,
            path: '/admin/users',
        },
        {
            title: 'KYC Management',
            icon: FileCheck,
            path: '/admin/kyc',
        },
        {
            title: 'Property Management',
            icon: Home,
            path: '/admin/properties',
        },
        {
            title: 'Auction Management',
            icon: Gavel,
            path: '/admin/auctions',
        },

        {
            title: 'Settings',
            icon: Settings,
            path: '/admin/settings',
        },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-700">
                        {sidebarOpen && (
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Dwello Admin
                                </h1>
                                <p className="text-xs text-gray-400 mt-1">Management Panel</p>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg'
                                        : 'hover:bg-gray-700'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {sidebarOpen && (
                                        <span className="font-medium truncate">{item.title}</span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* User Info */}
                    <div className="p-4 border-t border-gray-700">
                        <div className="flex items-center gap-3">
                            <img
                                src={user?.avatar || 'https://i.pravatar.cc/150?img=50'}
                                alt={user?.fullName}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            {sidebarOpen && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{user?.fullName}</p>
                                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                </div>
                            )}
                        </div>
                        {sidebarOpen && (
                            <button
                                onClick={handleLogout}
                                className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Menu className="w-5 h-5" />
                            </button>

                            {/* Search Bar */}
                            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 w-96">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent flex-1 outline-none text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Notifications */}
                            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Bell className="w-5 h-5 text-gray-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <img
                                        src={user?.avatar || 'https://i.pravatar.cc/150?img=50'}
                                        alt={user?.fullName}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                                        <button
                                            onClick={() => navigate('/admin/profile')}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => navigate('/admin/settings')}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                                        >
                                            Settings
                                        </button>
                                        <hr className="my-2" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}