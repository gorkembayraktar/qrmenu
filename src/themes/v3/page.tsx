"use client";

import { useState, useEffect } from 'react';
import { FiClock, FiMapPin, FiPhone, FiInstagram, FiStar, FiMenu, FiChevronRight, FiX } from 'react-icons/fi';
import { BiSolidFoodMenu } from 'react-icons/bi';
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
                        <h1 className={`text-xl font-semibold transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                            {menuData.restaurantInfo.name}
                        </h1>
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
            <div className="relative h-[60vh] bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80"
                        alt="Restaurant"
                        className="w-full h-full object-cover opacity-50"
                    />
                </div>
                <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">{menuData.restaurantInfo.name}</h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-6">{menuData.restaurantInfo.description}</p>
                        <div className="flex items-center justify-center space-x-2">
                            <FiStar className="text-yellow-400" />
                            <span className="text-yellow-400 font-medium">{menuData.restaurantInfo.rating}</span>
                        </div>
                    </motion.div>
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
                                <p className="text-sm text-gray-600">{menuData.restaurantInfo.workingHours.weekdays}</p>
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
            <div className="lg:hidden sticky top-16 bg-white shadow-md z-30">
                <div className="overflow-x-auto">
                    <div className="flex whitespace-nowrap px-4 py-3 space-x-4">
                        {menuData.categories.map((category: any) => (
                            <button
                                key={category.title}
                                onClick={() => {
                                    setSelectedCategory(category.title);
                                    scrollToCategory(category.title);
                                }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.title
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {category.title}
                            </button>
                        ))}
                    </div>
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
            <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Logo and Social Links */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <div className="text-center md:text-left mb-8 md:mb-0">
                            <h2 className="text-2xl font-bold mb-2">{menuData.restaurantInfo.name}</h2>
                            <p className="text-gray-400 max-w-md">{menuData.restaurantInfo.tagline}</p>
                        </div>
                        <div className="flex items-center space-x-6">
                            <a href={`https://instagram.com/${menuData.restaurantInfo.instagram}`}
                                className="transform hover:scale-110 transition-transform duration-200"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FiInstagram className="text-2xl text-gray-400 hover:text-white" />
                            </a>
                            <a href={`tel:${menuData.restaurantInfo.phone}`}
                                className="transform hover:scale-110 transition-transform duration-200"
                            >
                                <FiPhone className="text-2xl text-gray-400 hover:text-white" />
                            </a>
                            <a href={`https://maps.google.com/?q=${encodeURIComponent(menuData.restaurantInfo.address)}`}
                                className="transform hover:scale-110 transition-transform duration-200"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FiMapPin className="text-2xl text-gray-400 hover:text-white" />
                            </a>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                        {/* Contact Info */}
                        <div className="text-center md:text-left">
                            <h3 className="text-lg font-semibold mb-4 text-gray-200">İletişim</h3>
                            <div className="space-y-3">
                                <p className="flex items-center justify-center md:justify-start text-gray-400 hover:text-white transition-colors">
                                    <FiMapPin className="mr-2" />
                                    <span>{menuData.restaurantInfo.address}</span>
                                </p>
                                <p className="flex items-center justify-center md:justify-start text-gray-400 hover:text-white transition-colors">
                                    <FiPhone className="mr-2" />
                                    <span>{menuData.restaurantInfo.phone}</span>
                                </p>
                                <p className="flex items-center justify-center md:justify-start text-gray-400 hover:text-white transition-colors">
                                    <FiInstagram className="mr-2" />
                                    <span>{menuData.restaurantInfo.instagram}</span>
                                </p>
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-4 text-gray-200">Çalışma Saatleri</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-gray-400">
                                    <span>Hafta içi:</span>
                                    <span>{menuData.restaurantInfo.workingHours.weekdays}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-400">
                                    <span>Hafta sonu:</span>
                                    <span>{menuData.restaurantInfo.workingHours.weekend}</span>
                                </div>
                                {menuData.restaurantInfo.workingHours.friday && (
                                    <div className="flex justify-between items-center text-gray-400">
                                        <span>Cuma:</span>
                                        <span>{menuData.restaurantInfo.workingHours.friday}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="text-center md:text-right">
                            <h3 className="text-lg font-semibold mb-4 text-gray-200">Hızlı Menü</h3>
                            <div className="space-y-2">
                                {menuData.categories.slice(0, 4).map((category: any) => (
                                    <button
                                        key={category.title}
                                        onClick={() => scrollToCategory(category.title)}
                                        className="block w-full text-gray-400 hover:text-white transition-colors text-center md:text-right"
                                    >
                                        {category.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-700 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-sm text-gray-500 mb-4 md:mb-0">
                                &copy; {new Date().getFullYear()} {menuData.restaurantInfo.name}. Tüm hakları saklıdır.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}