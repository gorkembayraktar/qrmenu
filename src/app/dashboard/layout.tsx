"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
    FiMenu,
    FiBell,
    FiLogOut,
    FiChevronDown
} from 'react-icons/fi';
import Sidebar from './layouts/Sidebar';
import NotificationDropdown from './components/NotificationDropdown';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const { user, signOut } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut();
        router.push('/login');
    };

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const menu = document.getElementById('user-menu');
            const button = document.getElementById('user-menu-button');
            const notificationMenu = document.getElementById('notification-menu');
            const notificationButton = document.getElementById('notification-button');

            if (menu && button && !menu.contains(event.target as Node) && !button.contains(event.target as Node)) {
                setMenuOpen(false);
            }

            if (notificationMenu && notificationButton && !notificationMenu.contains(event.target as Node) && !notificationButton.contains(event.target as Node)) {
                setNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                                <div className="relative">
                                    <button
                                        id="user-menu-button"
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        className="flex items-center space-x-1 p-1.5 rounded-lg hover:bg-gray-100/50 transition-all"
                                    >
                                        <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                                            {user?.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <FiChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div
                                        id="user-menu"
                                        className={`absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-100 transition-all duration-200 ${menuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                                    >
                                        <div className="px-3 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <FiLogOut className="h-4 w-4" />
                                            <span>Çıkış Yap</span>
                                        </button>
                                    </div>
                                </div>
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