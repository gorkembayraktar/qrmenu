"use client";

import { useEffect, useRef, useState } from 'react';
import { FiClock, FiMapPin, FiPhone, FiInstagram, FiStar, FiMenu, FiChevronRight } from 'react-icons/fi';
import { BiSolidFoodMenu, BiSolidDish } from 'react-icons/bi';
import { formatPrice } from '@/utils/price';


export default function ThemeV2({ menuData }: { menuData: any }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative h-[40vh] min-h-[320px] bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="h-16 flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <h1 className={`text-xl font-semibold transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                  {menuData.restaurantInfo.name}
                </h1>
                <div className={`hidden md:flex items-center space-x-1 ${isScrolled ? 'text-yellow-500' : 'text-yellow-400'}`}>
                  <FiStar />
                  <span className={`text-sm font-medium ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                    {menuData.restaurantInfo.rating}
                  </span>
                </div>
              </div>
              <div className={`flex items-center space-x-6 text-sm font-medium ${isScrolled ? 'text-gray-600' : 'text-white'}`}>
                <a href="#menu" className="hover:opacity-75 transition-opacity">Menü</a>
                <a href="#contact" className="hover:opacity-75 transition-opacity">İletişim</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Header Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <BiSolidDish className="text-5xl mb-4 text-yellow-400" />
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            {menuData.restaurantInfo.name}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl text-center mb-2">
            {menuData.restaurantInfo.description}
          </p>
          <p className="text-yellow-400 font-medium">
            {menuData.restaurantInfo.tagline}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Restaurant Info */}
        <div className="bg-white py-12 border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-50">
                <FiClock className="text-2xl text-gray-400 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Çalışma Saatleri</h3>
                <p className="text-sm text-gray-600">{menuData.restaurantInfo.workingHours.weekdays}</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-50">
                <FiMapPin className="text-2xl text-gray-400 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Adres</h3>
                <p className="text-sm text-gray-600">{menuData.restaurantInfo.address}</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-50">
                <FiPhone className="text-2xl text-gray-400 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">Telefon</h3>
                <p className="text-sm text-gray-600">{menuData.restaurantInfo.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Categories */}
        <div id="menu" className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Menümüz</h2>
          {menuData.categories.map((category: any, index: number) => (
            <div key={index} className="mb-12 last:mb-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-medium text-gray-900">{category.title}</h3>
                <div className="h-[1px] flex-1 bg-gray-200 ml-4" />
              </div>

              <div className="grid gap-6">
                {category.items.map((item: any) => (
                  <div key={item.id} className="group">
                    <div className="flex gap-4">
                      {item.image && (
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="text-lg font-medium text-gray-900">
                              {formatPrice(item.price, menuData.restaurantInfo.currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
              <FiInstagram className="text-2xl" />
            </a>
            <a href={`tel:${menuData.restaurantInfo.phone}`} className="text-gray-400 hover:text-gray-600 transition-colors">
              <FiPhone className="text-2xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
              <FiMapPin className="text-2xl" />
            </a>
          </div>
          <p className="text-sm text-gray-500">{menuData.restaurantInfo.name} © 2024</p>
        </div>
      </footer>

    </div>
  );
}
