"use client";

import { useState, useEffect } from 'react';
import { FiClock, FiMapPin, FiPhone, FiInstagram, FiStar, FiMenu, FiChevronRight, FiX, FiFacebook, FiTwitter, FiYoutube, FiMail } from 'react-icons/fi';
import { BiSolidFoodMenu, BiSolidDish } from 'react-icons/bi';
import { GiKnifeFork } from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/utils/price';
import { v3 } from '@/mockdata/theme';

interface NutritionalInfo {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
}

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    nutritionalValues?: NutritionalInfo;
}

const formatPhoneNumber = (phoneNumber: string) => {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Format for Turkish phone numbers
    if (cleaned.length >= 10) {
        // Check if number starts with country code
        if (cleaned.startsWith('90')) {
            return `90 (${cleaned.slice(2, 5)}) ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
        }
        // For numbers without country code
        return `90 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
    }

    // If number format is unknown, just add spaces every 3 digits
    return cleaned.replace(/(\d{3})(?=\d)/g, '$1 ');
};

const SocialIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
        case 'instagram':
            return <FiInstagram className="w-6 h-6" />;
        case 'facebook':
            return <FiFacebook className="w-6 h-6" />;
        case 'twitter':
            return <FiTwitter className="w-6 h-6" />;
        case 'youtube':
            return <FiYoutube className="w-6 h-6" />;
        default:
            return null;
    }
};

export default function ThemeV3({ menuData }: { menuData: any }) {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

    // Varsayılan renk paleti
    const colors = menuData.colors;

    // CSS değişkenlerini ayarla
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', colors.primary);
        root.style.setProperty('--secondary-color', colors.secondary);
        root.style.setProperty('--accent-color', colors.accent);
        root.style.setProperty('--background-color', colors.background);
        root.style.setProperty('--text-color', colors.text);
        root.style.setProperty('--heading-color', colors.heading);
        root.style.setProperty('--card-bg', colors.card.background);
        root.style.setProperty('--card-text', colors.card.text);
        root.style.setProperty('--card-border', colors.card.border);
        root.style.setProperty('--card-hover', colors.card.hover);
        root.style.setProperty('--price-bg', colors.price.background);
        root.style.setProperty('--price-text', colors.primary);
    }, [colors]);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (menuData.categories.length > 0) {
            setSelectedCategory(menuData.categories[0].title);
        }
    }, [menuData.categories]);

    const scrollToCategory = (categoryId: string) => {
        const element = document.getElementById(categoryId);
        if (element) {
            const offset = 100; // Navbar height + some padding
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const NutritionalModal = ({ item, onClose }: { item: MenuItem; onClose: () => void }) => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl max-w-md w-full p-6 relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <FiX className="text-xl" />
                </button>

                <div className="text-center mb-6">
                    <GiKnifeFork className="text-4xl text-blue-600 mx-auto mb-3" />
                    <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Besin Değerleri</p>
                </div>

                {item.nutritionalValues ? (
                    <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Kalori</span>
                                <span className="font-semibold text-blue-600">{item.nutritionalValues.calories} kcal</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">Protein</div>
                                    <div className="font-semibold text-gray-900">{item.nutritionalValues.protein}g</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">Karbonhidrat</div>
                                    <div className="font-semibold text-gray-900">{item.nutritionalValues.carbs}g</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">Yağ</div>
                                    <div className="font-semibold text-gray-900">{item.nutritionalValues.fat}g</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-center">
                                    <div className="text-sm text-gray-500 mb-1">Lif</div>
                                    <div className="font-semibold text-gray-900">{item.nutritionalValues.fiber}g</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        Bu ürün için besin değeri bilgisi bulunmamaktadır.
                    </div>
                )}
            </motion.div>
        </motion.div>
    );

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {menuData.settings.logo_url && (
                            menuData?.theme?.appearance?.useLogo == undefined ||
                            menuData?.theme?.appearance?.useLogo == true) ? (
                            <img
                                src={menuData.settings.logo_url}
                                alt={menuData.restaurantInfo.name}
                                className={`h-8 w-auto transition-colors ${isScrolled ? 'opacity-90' : 'opacity-100'}`}
                            />
                        ) : (
                            <h1 className={`text-xl font-semibold transition-colors ${isScrolled ? 'text-[var(--heading-color)]' : 'text-white'
                                }`}>
                                {menuData.restaurantInfo.name}
                            </h1>
                        )}
                        <div className="hidden md:flex space-x-8">
                            {menuData.categories.map((category: any) => (
                                <button
                                    key={category.title}
                                    onClick={() => {
                                        setSelectedCategory(category.title);
                                        scrollToCategory(category.title);
                                    }}
                                    className={`text-sm font-medium transition-colors ${isScrolled
                                        ? selectedCategory === category.title
                                            ? 'text-[var(--primary-color)]'
                                            : 'text-[var(--text-color)] hover:text-[var(--primary-color)]'
                                        : 'text-white hover:text-[var(--accent-color)]'
                                        }`}
                                >
                                    {category.title}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-2xl"
                        >
                            <FiMenu className={isScrolled ? 'text-gray-900' : 'text-white'} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <div className="pt-20 px-4">
                        <h2 className="text-xl font-semibold mb-4" style={{ color: colors.heading }}>Kategoriler</h2>
                        {menuData.categories.map((category: any) => (
                            <button
                                key={category.title}
                                onClick={() => {
                                    setSelectedCategory(category.title);
                                    setIsMobileMenuOpen(false);
                                    scrollToCategory(category.title);
                                }}
                                className="flex items-center justify-between w-full text-left py-4 border-b transition-colors"
                                style={{
                                    borderColor: `${colors.primary}20`,
                                    color: colors.text
                                }}
                            >
                                <span>{category.title}</span>
                                <FiChevronRight style={{ color: colors.primary }} />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <div className={`relative ${menuData.theme?.appearance?.hero?.height === 'small' ? 'h-[40vh]' :
                menuData.theme?.appearance?.hero?.height === 'medium' ? 'h-[60vh]' :
                    menuData.theme?.appearance?.hero?.height === 'large' ? 'h-[80vh]' :
                        'h-[100vh]'
                } min-h-[400px] bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden`}>
                <div className="absolute inset-0">
                    {menuData.theme?.appearance?.hero?.type === 'video' ? (
                        <>
                            {menuData.theme?.appearance?.hero?.video_url?.includes('youtube.com') ? (
                                <div className="relative w-full h-full pt-[56.25%]">
                                    <iframe
                                        src={`${menuData.theme?.appearance?.hero?.video_url?.replace('watch?v=', 'embed/')}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1&playlist=${menuData.theme?.appearance?.hero?.video_url?.split('v=')[1]}`}
                                        title="Hero Video"
                                        className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                        style={{ border: 'none' }}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-[100.5%] h-[100.5%] object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    <source src={menuData.theme?.appearance?.hero?.video_url} type="video/mp4" />
                                </video>
                            )}
                        </>
                    ) : (
                        <img
                            src={menuData.theme?.appearance?.hero?.use_default_image
                                ? menuData.theme?.appearance?.hero?.image_url_default
                                : menuData.theme?.appearance?.hero?.image_url || '/images/hero.jpg'
                            }
                            alt="Restaurant"
                            className="w-full h-full object-cover"
                        />
                    )}
                    {menuData.theme?.appearance?.hero?.overlay_enabled && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/90" />
                    )}
                </div>
                <div className={`relative h-full flex flex-col ${menuData.theme?.appearance?.hero?.content_alignment === 'left'
                    ? 'items-start text-left pl-8 md:pl-16'
                    : menuData.theme?.appearance?.hero?.content_alignment === 'right'
                        ? 'items-end text-right pr-8 md:pr-16'
                        : 'items-center text-center'
                    } justify-center text-white px-4`}>
                    {menuData.settings.logo_url && (
                        menuData?.theme?.appearance?.useLogo == undefined ||
                        menuData?.theme?.appearance?.useLogo == true) ? (
                        <img
                            src={menuData.settings.logo_url}
                            alt={menuData.restaurantInfo.name}
                            className={`h-16 w-auto mb-4 ${menuData.theme?.appearance?.hero?.content_alignment === 'left'
                                ? 'ml-0'
                                : menuData.theme?.appearance?.hero?.content_alignment === 'right'
                                    ? 'ml-auto'
                                    : 'mx-auto'
                                }`}
                        />
                    ) : (
                        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${menuData.theme?.appearance?.hero?.content_alignment === 'left' || menuData.theme?.appearance?.hero?.content_alignment === 'right'
                            ? 'max-w-2xl'
                            : 'text-center max-w-4xl'
                            }`}>
                            {menuData.restaurantInfo.name}
                        </h1>
                    )}
                    <p className={`text-lg md:text-xl text-gray-200 mb-2 ${menuData.theme?.appearance?.hero?.content_alignment === 'left' || menuData.theme?.appearance?.hero?.content_alignment === 'right'
                        ? 'max-w-xl'
                        : 'text-center max-w-2xl'
                        }`}>
                        {menuData.restaurantInfo.description}
                    </p>
                    <div className={`flex items-center space-x-2 ${menuData.theme?.appearance?.hero?.content_alignment === 'left'
                        ? 'justify-start'
                        : menuData.theme?.appearance?.hero?.content_alignment === 'right'
                            ? 'justify-end'
                            : 'justify-center'
                        }`}>
                        <FiStar className="text-yellow-400" />
                        <span className="text-yellow-400 font-medium">{menuData.restaurantInfo.rating}</span>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="max-w-7xl mx-auto px-4 -mt-16 mb-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                        style={{ backgroundColor: 'var(--card-bg)' }}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-full" style={{ backgroundColor: `${colors.primary}20` }}>
                                <FiClock className="text-2xl" style={{ color: colors.primary }} />
                            </div>
                            <div>
                                <h3 className="font-medium" style={{ color: colors.heading }}>
                                    Çalışma Saatleri
                                </h3>
                                <p className="text-sm" style={{ color: colors.text }}>
                                    Açık (09:00 - 22:00)
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                        style={{ backgroundColor: 'var(--card-bg)' }}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-full" style={{ backgroundColor: `${colors.secondary}20` }}>
                                <FiMapPin className="text-2xl" style={{ color: colors.secondary }} />
                            </div>
                            <div>
                                <h3 className="font-medium" style={{ color: colors.heading }}>
                                    Adres
                                </h3>
                                <p className="text-sm" style={{ color: colors.text }}>
                                    {menuData.restaurantInfo.address}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                        style={{ backgroundColor: 'var(--card-bg)' }}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-full" style={{ backgroundColor: `${colors.accent}20` }}>
                                <FiPhone className="text-2xl" style={{ color: colors.accent }} />
                            </div>
                            <div>
                                <h3 className="font-medium" style={{ color: colors.heading }}>
                                    İletişim
                                </h3>
                                <p className="text-sm" style={{ color: colors.text }}>
                                    {formatPhoneNumber(menuData.restaurantInfo.phone)}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Mobile Category Scroll */}
            <div className="lg:hidden sticky top-16 z-30"
                style={{
                    backgroundColor: 'var(--card-bg)',
                    backdropFilter: 'blur(8px)'
                }}>
                <div className="overflow-x-auto scrollbar-hide scroll-smooth overscroll-x-contain">
                    <div className="flex items-center px-4 py-4 gap-3 min-w-full">
                        {menuData.categories.map((category: any) => (
                            <button
                                key={category.title}
                                onClick={() => {
                                    setSelectedCategory(category.title);
                                    scrollToCategory(category.title);
                                }}
                                className={`
                                    flex-none px-5 py-2.5 rounded-full text-sm font-medium
                                    transition-all duration-200 ease-out
                                    ${selectedCategory === category.title
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-105'
                                        : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'
                                    }
                                `}
                            >
                                {category.title}
                            </button>
                        ))}
                    </div>
                    <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                </div>
            </div>

            {/* Menu Section */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Category List - Desktop */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-24">
                            {menuData.categories.map((category: any) => (
                                <button
                                    key={category.title}
                                    onClick={() => {
                                        setSelectedCategory(category.title);
                                        scrollToCategory(category.title);
                                    }}
                                    className={`block w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${selectedCategory === category.title
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {category.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="lg:col-span-9">
                        {menuData.categories.map((category: any) => (
                            <div
                                id={category.title}
                                key={category.title}
                                className="mb-12 last:mb-0 scroll-mt-32"
                            >
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{category.title}</h2>
                                <div className="grid gap-6">
                                    {category.items.map((item: any) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                            style={{ backgroundColor: 'var(--card-bg)' }}
                                        >
                                            <div className="flex">
                                                {item.image && (
                                                    <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-4 flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-medium" style={{ color: colors.heading }}>
                                                                {item.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                                {item.description}
                                                            </p>
                                                            {item.nutritional_values && (
                                                                <div className="flex flex-wrap gap-2 mt-2">
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                                        {item.nutritional_values.calories} kcal
                                                                    </span>
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                                                        P: {item.nutritional_values.protein}g
                                                                    </span>
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                                                                        K: {item.nutritional_values.carbohydrates}g
                                                                    </span>
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                                                                        Y: {item.nutritional_values.fat}g
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="inline-block text-base md:text-lg font-semibold px-3 md:px-4 py-1 rounded-full"
                                                            style={{
                                                                backgroundColor: 'var(--price-bg)',
                                                                color: 'var(--price-text)'
                                                            }}>
                                                            {formatPrice(item.price, menuData.restaurantInfo.currency)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Nutritional Values Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <NutritionalModal
                        item={selectedItem}
                        onClose={() => setSelectedItem(null)}
                    />
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer id="contact" className="py-12" style={{ backgroundColor: colors.card.background }}>
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div>
                            <h4 className="text-base font-semibold mb-4" style={{ color: colors.heading }}>
                                İletişim
                            </h4>
                            <div className="space-y-2">
                                <a
                                    href={`tel:${menuData.restaurantInfo.phone}`}
                                    className="flex items-center gap-2 transition-opacity hover:opacity-80"
                                    style={{ color: colors.heading }}
                                >
                                    <FiPhone className="w-4 h-4" style={{ color: colors.primary }} />
                                    <span className="text-sm font-medium">{formatPhoneNumber(menuData.restaurantInfo.phone)}</span>
                                </a>
                                <a
                                    href={`tel:${menuData.restaurantInfo.phone}`}
                                    className="flex items-center gap-2 transition-opacity hover:opacity-80"
                                    style={{ color: colors.heading }}
                                >
                                    <FiMail className="w-4 h-4" style={{ color: colors.primary }} />
                                    <span className="text-sm font-medium">{menuData.restaurantInfo.email}</span>
                                </a>
                                <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent(menuData.restaurantInfo.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 transition-opacity hover:opacity-80"
                                    style={{ color: colors.heading }}
                                >
                                    <FiMapPin className="w-4 h-4" style={{ color: colors.secondary }} />
                                    <span className="text-sm font-medium">{menuData.restaurantInfo.address}</span>
                                </a>
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div>
                            <h4 className="text-base font-semibold mb-4" style={{ color: colors.heading }}>
                                Çalışma Saatleri
                            </h4>
                            <div className="space-y-1">
                                {menuData.restaurantInfo.workingHours.map((hours: any) => {
                                    const isToday = new Date().getDay() === hours.day;
                                    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
                                    const dayName = days[hours.day];
                                    return (
                                        <div key={hours.day} className="flex justify-between items-center">
                                            <span className="text-sm font-medium" style={{
                                                color: isToday ? colors.primary : colors.heading,
                                                opacity: 0.95
                                            }}>
                                                {dayName}
                                            </span>
                                            <span className="text-sm font-medium" style={{
                                                color: colors.heading,
                                                opacity: hours.is_open ? 0.95 : 0.7
                                            }}>
                                                {hours.is_open ? `${hours.open_time.slice(0, 5)} - ${hours.close_time.slice(0, 5)}` : 'Kapalı'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Social Media */}
                        {menuData.modules?.social?.is_active && menuData.modules.social.settings.social.accounts.length > 0 && (
                            <div>
                                <h4 className="text-base font-semibold mb-4" style={{ color: colors.heading }}>
                                    Sosyal Medya
                                </h4>
                                <div className="flex gap-3">
                                    {menuData.modules.social.settings.social.accounts.map((account: any) => (
                                        <a
                                            key={account.id}
                                            href={account.username}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                                            style={{
                                                backgroundColor: `${colors.primary}15`,
                                                color: colors.primary
                                            }}
                                        >
                                            <SocialIcon platform={account.platform} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Copyright */}
                    <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: colors.card.border }}>
                        <p className="text-xs font-medium" style={{ color: colors.heading, opacity: 0.8 }}>
                            {menuData.restaurantInfo.footer_text} {menuData.settings.copyright_text}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}