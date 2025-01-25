"use client";

import { useState, useEffect } from 'react';
import { FiHome, FiList, FiSettings, FiX, FiChevronDown, FiGrid, FiPackage, FiUsers, FiLock } from 'react-icons/fi';
import { BiSolidFoodMenu } from 'react-icons/bi';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaPaintBrush } from 'react-icons/fa';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

interface MenuItem {
    icon: any;
    label: string;
    href?: string;
    subItems?: {
        label: string;
        href: string;
    }[];
}

const menuItems: MenuItem[] = [
    {
        icon: FiHome,
        label: 'Ana Sayfa',
        href: '/dashboard'
    },
    {
        icon: FiList,
        label: 'Menü Yönetimi',
        subItems: [
            { label: 'Kategoriler', href: '/dashboard/menu/categories' },
            { label: 'Ürünler', href: '/dashboard/menu/products' }
        ]
    },
    {
        icon: FaPaintBrush,
        label: 'Görünüm',
        subItems: [
            { label: 'Tema Ayarları', href: '/dashboard/theme' },
        ]
    },
    {
        icon: FiSettings,
        label: 'Ayarlar',
        subItems: [
            { label: 'Genel Ayarlar', href: '/dashboard/settings' },
            { label: 'Çalışma Saatleri', href: '/dashboard/settings/working-hours' },
        ]
    },
    {
        icon: FiLock,
        label: 'Moduller',
        href: '/dashboard/modules'
    }
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<string[]>([]);

    // Check active menu and open its dropdown
    useEffect(() => {
        const activeMenu = menuItems.find(item =>
            item.subItems?.some(subItem => pathname?.startsWith(subItem.href))
        );

        if (activeMenu && !openMenus.includes(activeMenu.label)) {
            setOpenMenus(prev => [...prev, activeMenu.label]);
        }
    }, [pathname]);

    const toggleSubmenu = (label: string) => {
        setOpenMenus(prev =>
            prev.includes(label)
                ? prev.filter(item => item !== label)
                : [...prev, label]
        );
    };

    const isSubmenuOpen = (label: string) => openMenus.includes(label);

    const isActive = (href?: string) => href && pathname === href;
    const isSubItemActive = (items?: { href: string }[]) =>
        items?.some(item => pathname === item.href);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 transform transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 border-r border-gray-200 dark:border-gray-800`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
                    <Link href="/dashboard" className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <BiSolidFoodMenu className="text-xl text-white" />
                        </div>
                        <span className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            QR Menü
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-all"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="p-3 space-y-0.5">
                    {menuItems.map((item) => (
                        <div key={item.label}>
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 group ${isActive(item.href)
                                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                        }`}
                                >
                                    <item.icon className={`h-5 w-5 ${isActive(item.href) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                                        }`} />
                                    <span className="ml-3 font-medium">{item.label}</span>
                                </Link>
                            ) : (
                                <>
                                    <button
                                        onClick={() => toggleSubmenu(item.label)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${isSubItemActive(item.subItems)
                                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <item.icon className={`h-5 w-5 ${isSubItemActive(item.subItems) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                                                }`} />
                                            <span className="ml-3 font-medium">{item.label}</span>
                                        </div>
                                        <FiChevronDown className={`h-4 w-4 transition-transform duration-200 ${isSubmenuOpen(item.label) ? 'rotate-180' : ''
                                            }`} />
                                    </button>
                                    {item.subItems && isSubmenuOpen(item.label) && (
                                        <div className="mt-1 ml-4 space-y-0.5">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.href}
                                                    href={subItem.href}
                                                    className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${isActive(subItem.href)
                                                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                                        }`}
                                                >
                                                    <span className="font-medium">{subItem.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            QR Menü Yönetim Paneli v1.0
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
} 