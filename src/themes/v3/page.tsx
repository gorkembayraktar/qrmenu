"use client";

import { useState, useEffect } from 'react';
import { FiClock, FiMapPin, FiPhone, FiInstagram, FiStar, FiMenu, FiChevronRight, FiX, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';
import { BiSolidFoodMenu, BiSolidDish } from 'react-icons/bi';
import { GiKnifeFork } from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/utils/price';

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
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

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
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
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
                            <h1 className={`text-xl font-semibold transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
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
                                        ? selectedCategory === category.title ? 'text-blue-600' : 'text-gray-600'
                                        : selectedCategory === category.title ? 'text-white' : 'text-gray-200'
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
                <div className="fixed inset-0 z-40 bg-white">
                    <div className="pt-20 px-4">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Kategoriler</h2>
                        {menuData.categories.map((category: any) => (
                            <button
                                key={category.title}
                                onClick={() => {
                                    setSelectedCategory(category.title);
                                    setIsMobileMenuOpen(false);
                                    scrollToCategory(category.title);
                                }}
                                className="flex items-center justify-between w-full text-left py-4 border-b border-gray-100"
                            >
                                <span className="text-gray-800">{category.title}</span>
                                <FiChevronRight className="text-gray-400" />
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
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-50 rounded-full">
                                <FiClock className="text-2xl text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Çalışma Saatleri</h3>
                                {(() => {
                                    const today = new Date().getDay();
                                    const todayHours = menuData.restaurantInfo.workingHours.find((h: any) => h.day === today);

                                    if (!todayHours) {
                                        return <p className="text-sm text-red-500">Kapalı</p>;
                                    }

                                    return (
                                        <p className="text-sm">
                                            <span className={todayHours.is_open ? "text-green-600" : "text-red-500"}>
                                                {todayHours.is_open ? "Açık" : "Kapalı"}
                                            </span>
                                            <span className="text-gray-600 ml-1">
                                                ({todayHours.open_time.slice(0, 5)} - {todayHours.close_time.slice(0, 5)})
                                            </span>
                                        </p>
                                    );
                                })()}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-50 rounded-full">
                                <FiMapPin className="text-2xl text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Adres</h3>
                                <p className="text-sm text-gray-600">{menuData.restaurantInfo.address}</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-xl shadow-lg p-6"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-50 rounded-full">
                                <FiPhone className="text-2xl text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">İletişim</h3>
                                <p className="text-sm text-gray-600">{menuData.restaurantInfo.phone}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Mobile Category Scroll */}
            <div className="lg:hidden sticky top-16 bg-white/95 backdrop-blur-md shadow-sm z-30">
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
                                            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
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
                                                <div className="flex-1 p-4 md:p-6">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
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
                                                        <span className="inline-block bg-blue-50 text-blue-600 text-base md:text-lg font-semibold px-3 md:px-4 py-1 rounded-full">
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
            <footer id="contact" className="bg-gradient-to-b from-gray-50 to-gray-100 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                        {/* Restaurant Info */}
                        <div>
                            {menuData.settings.logo_url && (
                                menuData?.theme?.appearance?.useLogo == undefined ||
                                menuData?.theme?.appearance?.useLogo == true) ? (
                                <img
                                    src={menuData.settings.logo_url}
                                    alt={menuData.restaurantInfo.name}
                                    className="h-12 w-auto mb-6"
                                />
                            ) : (
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">{menuData.restaurantInfo.name}</h3>
                            )}
                            <p className="text-gray-600 mb-6">{menuData.restaurantInfo.description}</p>
                            <div className="flex flex-col gap-4">
                                <a
                                    href={`tel:${menuData.restaurantInfo.phone}`}
                                    className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                        <FiPhone className="text-blue-600" />
                                    </div>
                                    <span>{menuData.restaurantInfo.phone}</span>
                                </a>
                                <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent(menuData.restaurantInfo.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                        <FiMapPin className="text-blue-600" />
                                    </div>
                                    <span>{menuData.restaurantInfo.address}</span>
                                </a>
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Çalışma Saatleri</h3>
                            <div className="space-y-3">
                                {(() => {
                                    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
                                    const today = new Date().getDay();

                                    return menuData.restaurantInfo.workingHours.map((hours: any) => {
                                        const dayIndex = hours.day === 0 ? 6 : hours.day - 1;
                                        const isToday = today === hours.day;

                                        return (
                                            <div
                                                key={hours.day}
                                                className={`flex items-center justify-between ${isToday ? 'text-blue-600 font-medium' : 'text-gray-600'
                                                    }`}
                                            >
                                                <span>{days[dayIndex]}</span>
                                                <span>
                                                    {hours.is_open
                                                        ? `${hours.open_time.slice(0, 5)} - ${hours.close_time.slice(0, 5)}`
                                                        : `Kapalı (${hours.open_time.slice(0, 5)}-${hours.close_time.slice(0, 5)})`
                                                    }
                                                </span>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </div>

                        {/* Quick Links & Social */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Hızlı Menü</h3>
                            <div className="grid grid-cols-2 gap-2 mb-8">
                                {menuData.categories.slice(0, 6).map((category: any) => (
                                    <button
                                        key={category.title}
                                        onClick={() => scrollToCategory(category.title)}
                                        className="text-left text-gray-600 hover:text-blue-600 transition-colors"
                                    >
                                        {category.title}
                                    </button>
                                ))}
                            </div>

                            {menuData.modules?.social?.is_active && menuData.modules.social.settings.social.accounts.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Sosyal Medya</h3>
                                    <div className="flex gap-4">
                                        {menuData.modules.social.settings.social.accounts.map((account: any) => (
                                            <a
                                                key={account.id}
                                                href={account.username}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
                                            >
                                                <SocialIcon platform={account.platform} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="border-t border-gray-200 pt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            {menuData.restaurantInfo.footer_text} {menuData.settings.copyright_text}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}