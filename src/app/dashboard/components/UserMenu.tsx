import { useState, useEffect, useRef } from 'react';
import { FiLogOut, FiUser, FiSettings, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserMenu() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, signOut, loading } = useAuth();
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleLogout = async () => {
        await signOut();
        router.push('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && buttonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (loading) {
        return (
            <div className="h-8 w-8 rounded-lg bg-gray-200 animate-pulse"></div>
        );
    }

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center space-x-1 p-1.5 rounded-lg hover:bg-gray-100/50 transition-all"
            >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                    {user?.email?.charAt(0).toUpperCase()}
                </div>
                <FiChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            <div
                ref={menuRef}
                className={`absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-lg py-1 border border-gray-100 transition-all duration-200 
                    ${menuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
            >
                <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Yönetici</p>
                </div>

                <div className="py-1">
                    <Link
                        href="/dashboard/profile"
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setMenuOpen(false)}
                    >
                        <FiUser className="h-4 w-4" />
                        <span>Profil Ayarları</span>
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setMenuOpen(false)}
                    >
                        <FiSettings className="h-4 w-4" />
                        <span>Genel Ayarlar</span>
                    </Link>
                </div>

                <div className="border-t border-gray-100 py-1">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <FiLogOut className="h-4 w-4" />
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            </div>
        </div>
    );
} 