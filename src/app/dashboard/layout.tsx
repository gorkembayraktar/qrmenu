"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FiMenu, FiBell, FiHome } from 'react-icons/fi';
import Sidebar from './layouts/Sidebar';
import NotificationDropdown from './components/NotificationDropdown';
import UserMenu from './components/UserMenu';
import { AuthProvider } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <DashboardContent>{children}</DashboardContent>
        </AuthProvider>
    );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const { user, loading } = useAuth();
    const pathname = usePathname();

    // Tema sayfası için kontrol
    const isThemePage = pathname?.startsWith('/dashboard/theme');

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isThemePage) {
        return <div className="min-h-screen bg-gray-50">{children}</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main Content */}
            <div className={`lg:pl-64 flex flex-col min-h-screen`}>
                {/* Top Navigation */}
                <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/30 sticky top-0 z-40">
                    <div className="max-w-[2000px] mx-auto">
                        <div className="flex items-center justify-between h-16 px-4 md:px-6">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden -ml-1 p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 transition-all"
                                >
                                    <FiMenu className="h-6 w-6" />
                                </button>
                                <div className="hidden md:block text-sm font-medium text-gray-600">
                                    Hoş geldiniz, <span className="text-gray-900">{user?.email}</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-1 md:space-x-3">
                                <a href="/" target="_blank" className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 transition-all">
                                    <FiHome className="h-5 w-5" />
                                </a>
                                <div className="relative">
                                    <button
                                        id="notification-button"
                                        onClick={() => setNotificationOpen(!notificationOpen)}
                                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 transition-all relative"
                                    >
                                        <FiBell className="h-5 w-5" />
                                        <span className="absolute top-0.5 right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                    </button>
                                    <div id="notification-menu">
                                        <NotificationDropdown
                                            isOpen={notificationOpen}
                                            onClose={() => setNotificationOpen(false)}
                                        />
                                    </div>
                                </div>
                                <UserMenu />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
} 