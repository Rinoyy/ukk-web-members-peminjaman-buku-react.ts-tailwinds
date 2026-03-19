import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import NotificationBell from './NotificationBell';

interface LayoutProps {
    children: ReactNode;
}

const navItems = [
    { path: '/dashboard', label: 'Beranda', icon: '🏠' },
    { path: '/books', label: 'Buku', icon: '📚' },
    { path: '/history', label: 'Riwayat', icon: '📋' },
    { path: '/profile', label: 'Profil', icon: '👤' },
];

const Layout = ({ children }: LayoutProps) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div className="min-h-screen bg-white">
            {/* Top Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 text-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📖</span>
                        <h1 className="text-xl font-bold">Perpustakaan</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <NotificationBell />
                        <span className="text-sm text-gray-600 hidden sm:inline">Halo, {user?.name ?? user?.username}!</span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                        >
                            Keluar
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 pb-24 px-4 max-w-7xl mx-auto">
                {children}
            </main>

            {/* Bottom Navigation (Mobile-friendly) */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
                <div className="max-w-7xl mx-auto flex justify-around">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center py-3 px-4 transition-colors ${isActive
                                        ? 'text-gray-900'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="text-xs mt-1 font-medium">{item.label}</span>
                                {isActive && (
                                    <div className="absolute bottom-0 w-12 h-1 bg-gray-900 rounded-t-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default Layout;
