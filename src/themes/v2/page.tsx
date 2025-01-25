"use client";

import { useEffect, useRef, useState } from 'react';
import { FiClock, FiMapPin, FiPhone, FiInstagram, FiStar, FiMenu, FiChevronRight, FiFacebook, FiTwitter, FiYoutube, FiMail } from 'react-icons/fi';
import { BiSolidFoodMenu, BiSolidDish } from 'react-icons/bi';
import { formatPrice } from '@/utils/price';

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
                {menuData.settings.logo_url &&
                  (
                    menuData?.theme?.appearance?.useLogo == undefined ||
                    menuData?.theme?.appearance?.useLogo == true)
                  ? (
                    <a href="#" className="block">
                      <img
                        src={menuData.settings.logo_url}
                        alt={menuData.restaurantInfo.name}
                        className={`h-10 w-auto transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`}
                      />
                    </a>
                  ) : (
                    <h1 className={`text-xl font-semibold transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                      {menuData.restaurantInfo.name}
                    </h1>
                  )}
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


          {menuData.theme.show_title_tagline && (<>
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              {menuData.restaurantInfo.name}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl text-center mb-2">
              {menuData.restaurantInfo.description}
            </p>
          </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>


        {/* Menu Categories */}
        <div id="menu" className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-16">Menümüz</h2>
          {menuData.categories.map((category: any, index: number) => (
            <div key={index} className="mb-16 last:mb-0">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-medium text-gray-900">{category.title}</h3>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-yellow-500/50 to-transparent ml-6" />
              </div>

              <div className="grid gap-8">
                {category.items.map((item: any) => (
                  <div key={item.id} className="group">
                    <div className="flex gap-6">
                      {item.image && (
                        <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 group-hover:text-yellow-600 transition-colors">
                              {item.name}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                            {item.nutritional_values && (
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                {item.nutritional_values.calories > 0 && (
                                  <span className="text-xs font-medium text-white bg-yellow-500 px-3 py-1 rounded-full shadow-sm">
                                    {item.nutritional_values.calories} kcal
                                  </span>
                                )}
                                {item.nutritional_values.protein > 0 && (
                                  <span className="text-xs font-medium text-white bg-blue-500 px-3 py-1 rounded-full shadow-sm">
                                    {item.nutritional_values.protein}g protein
                                  </span>
                                )}
                                {item.nutritional_values.fat > 0 && (
                                  <span className="text-xs font-medium text-white bg-orange-500 px-3 py-1 rounded-full shadow-sm">
                                    {item.nutritional_values.fat}g yağ
                                  </span>
                                )}
                                {item.nutritional_values.carbohydrates > 0 && (
                                  <span className="text-xs font-medium text-white bg-green-500 px-3 py-1 rounded-full shadow-sm">
                                    {item.nutritional_values.carbohydrates}g karb
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <span className="text-lg font-semibold text-yellow-600">
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

        {/* Restaurant Info */}
        <div className="bg-white py-16 border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <FiMail className="text-2xl text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Mail Adresimiz</h3>
                <a href={`mailto:${menuData.restaurantInfo.email}`} className="text-sm text-gray-600 hover:text-yellow-600 transition-colors">
                  {menuData.restaurantInfo.email}
                </a>
              </div>
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <FiMapPin className="text-2xl text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Adres</h3>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(menuData.restaurantInfo.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  {menuData.restaurantInfo.address}
                </a>
              </div>
              <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <FiPhone className="text-2xl text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Telefon</h3>
                <a href={`tel:${menuData.restaurantInfo.phone}`} className="text-sm text-gray-600 hover:text-yellow-600 transition-colors">
                  {menuData.restaurantInfo.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Working Hours */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-8">Çalışma Saatleri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
              {(() => {
                const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
                const today = new Date().getDay();

                return menuData.restaurantInfo.workingHours.map((hours: any) => {
                  const dayIndex = hours.day === 0 ? 6 : hours.day - 1;
                  const isToday = today === hours.day;

                  return (
                    <div
                      key={hours.day}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-300 ${isToday
                        ? 'bg-yellow-50 text-yellow-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      <span className="font-medium">{days[dayIndex]}</span>
                      <span className={hours.is_open ? 'text-green-600' : 'text-red-500'}>
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

          {/* Social Media Links */}
          {menuData.modules?.social?.is_active && menuData.modules.social.settings.social.accounts.length > 0 && (
            <div className="flex justify-center space-x-8 mb-12">
              {menuData.modules.social.settings.social.accounts.map((account: any) => (
                <a
                  key={account.id}
                  href={account.username}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-600 transition-colors"
                >
                  <SocialIcon platform={account.platform} />
                </a>
              ))}
            </div>
          )}

          {/* Logo */}
          {menuData.settings.logo_url && (
            <div className="flex justify-center mb-8">
              <img
                src={menuData.settings.logo_url}
                alt={menuData.restaurantInfo.name}
                className="h-12 w-auto opacity-75"
              />
            </div>
          )}

          {/* Copyright */}
          <p className="text-sm text-gray-400 text-center">
            {menuData.restaurantInfo.footer_text} {menuData.settings.copyright_text}
          </p>
        </div>
      </footer>

    </div>
  );
}
