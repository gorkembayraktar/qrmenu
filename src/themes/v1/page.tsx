"use client";

import { useEffect, useRef, useState } from 'react';
import CategorySection from '@/themes/v1/components/CategorySection';
import { FiClock, FiMapPin, FiPhone, FiInstagram, FiStar, FiFacebook, FiTwitter } from 'react-icons/fi';
import { BiSolidFoodMenu } from 'react-icons/bi';
import { HiOutlineMail } from 'react-icons/hi';

interface WorkingHours {
  day: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
}

// Add formatting function at the top
const formatPhoneNumber = (phone: string) => {
  if (!phone) return '';

  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Extract country code (first 1-3 digits)
  const countryCode = cleaned.slice(0, cleaned.length > 10 ? cleaned.length - 10 : 0);
  const number = cleaned.slice(-10);

  // Format the number
  const formatted = number.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');

  return countryCode ? `+${countryCode} (${formatted})` : formatted;
};

export default function ThemeV1({ menuData }: { menuData: any }) {

  const [activeCategory, setActiveCategory] = useState('');
  const navRef = useRef<HTMLDivElement>(null);
  let touchStartX = 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
            // Scroll the navigation to show the active category
            const navElement = document.querySelector(`[href="#${entry.target.id}"]`) as HTMLElement;
            if (navElement && navRef.current) {
              const container = navRef.current;
              const scrollLeft = navElement.offsetLeft - (container.offsetWidth / 2) + (navElement.offsetWidth / 2);
              container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
          }
        });
      },
      {
        rootMargin: '-20% 0px -80% 0px'
      }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!navRef.current) return;

    const touchCurrentX = e.touches[0].clientX;
    const diff = touchStartX - touchCurrentX;
    navRef.current.scrollLeft += diff;
    touchStartX = touchCurrentX;
  };

  return (
    <>
      <main className="relative min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative h-[80vh] min-h-[600px] bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70">
            <div className="container mx-auto h-full px-4 py-8">
              <div className="flex flex-col justify-center h-full max-w-4xl mx-auto text-center">

                {menuData.settings.logo_url ? (
                  <div className="mb-8">
                    <img
                      src={menuData.settings.logo_url}
                      alt={menuData.restaurantInfo.name}
                      className="h-24 w-auto mx-auto"
                    />
                  </div>
                ) : (
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                    {menuData.restaurantInfo.name}
                  </h1>
                )}

                <p className="text-xl text-white/90 mb-8 font-light max-w-2xl mx-auto">
                  {menuData.restaurantInfo.description}
                </p>

                <div className="flex items-center justify-center gap-4 mb-12">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <FiStar className="text-yellow-400" />
                    <span className="text-white font-medium">{menuData.restaurantInfo.rating}</span>
                  </div>
                  {menuData.modules?.social?.is_active && menuData.modules.social.settings.social.accounts.length > 0 && (
                    <div className="flex items-center gap-3">
                      {menuData.modules.social.settings.social.accounts.map((account: any) => (
                        <a
                          key={account.id}
                          href={account.username}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          {account.platform === 'instagram' && <FiInstagram className="text-white text-xl" />}
                          {account.platform === 'facebook' && <FiFacebook className="text-white text-xl" />}
                          {account.platform === 'twitter' && <FiTwitter className="text-white text-xl" />}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/90 text-sm max-w-3xl mx-auto">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                    <FiMapPin className="text-primary text-xl" />
                    <span>{menuData.restaurantInfo.address}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                    <FiPhone className="text-primary text-xl" />
                    <span>{formatPhoneNumber(menuData.restaurantInfo.phone)}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                    <FiClock className="text-primary text-xl" />
                    <div className="text-left">
                      <p className="text-white/60 text-xs">Bugün</p>
                      {(() => {
                        const today = new Date().getDay();
                        const currentHour = new Date().getHours();
                        const currentMinute = new Date().getMinutes();
                        const currentTime = `${currentHour}:${currentMinute}`;

                        const todayHours = menuData.restaurantInfo.workingHours.find((h: WorkingHours) => h.day === today);

                        if (!todayHours) {
                          return <span className="text-red-400">Kapalı</span>;
                        }

                        const openTime = todayHours.open_time.slice(0, 5);
                        const closeTime = todayHours.close_time.slice(0, 5);

                        return (
                          <div>
                            <span className={todayHours.is_open ? "" : "text-red-400"}>
                              {todayHours.is_open ? "Açık" : "Kapalı"}
                            </span>
                            <span className="text-white/60 text-xs ml-1">
                              ({openTime} - {closeTime})
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <nav className="max-w-7xl mx-auto sticky top-0 z-20 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
          <div
            ref={navRef}
            className="container mx-auto px-4 touch-pan-x"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div className="flex space-x-1 whitespace-nowrap overflow-x-auto py-1 scrollbar-hide">
              {menuData.categories.map((category: any) => {
                const categoryId = category.title.toLowerCase().replace(/\s+/g, '-');
                return (
                  <a
                    key={category.title}
                    href={`#${categoryId}`}
                    className={`
                      px-4 py-3 text-sm font-medium transition-all rounded-lg
                      ${activeCategory === categoryId
                        ? 'text-primary bg-primary/5 font-semibold'
                        : 'text-gray-600 hover:text-primary hover:bg-primary/5'}
                    `}
                  >
                    {category.title}
                  </a>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Menu Sections */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {menuData.categories.map((category: any) => (
            <CategorySection
              key={category.title}
              title={category.title}
              items={category.items}
              currency={menuData.restaurantInfo.currency}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white/80 relative">
        {/* Restaurant Shape Divider */}
        <div className="absolute top-0 left-0 w-full overflow-hidden h-16 -translate-y-[98%]">
          <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
            <polygon className="fill-gray-900" points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-16 pb-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Restaurant Info */}
            <div className="space-y-6">
              <div>
                {menuData.settings.logo_url ? (
                  <div className="mb-4">
                    <img
                      src={menuData.settings.logo_url}
                      alt={menuData.restaurantInfo.name}
                      className="h-12 w-auto"
                    />
                  </div>
                ) : (
                  <h3 className="text-white text-2xl font-bold mb-2">{menuData.restaurantInfo.name}</h3>
                )}
                <p className="text-white/60 text-sm leading-relaxed">
                  {menuData.restaurantInfo.description}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={`tel:${menuData.restaurantInfo.phone}`}
                  className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10">
                    <FiPhone className="text-primary" />
                  </div>
                  <span className="text-sm">{formatPhoneNumber(menuData.restaurantInfo.phone)}</span>
                </a>

                <a
                  href={`mailto:info@lezzetduragi.com`}
                  className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10">
                    <HiOutlineMail className="text-primary" />
                  </div>
                  <span className="text-sm">{menuData.restaurantInfo.email}</span>
                </a>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(menuData.restaurantInfo.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10">
                    <FiMapPin className="text-primary" />
                  </div>
                  <span className="text-sm">{menuData.restaurantInfo.address}</span>
                </a>


              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">Menümüz</h3>
              <div className="grid grid-cols-2 gap-2">
                {menuData.categories.map((category: any) => (
                  <a
                    key={category.title}
                    href={`#${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-white/60 hover:text-primary transition-colors text-sm py-1"
                  >
                    {category.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Working Hours */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">Çalışma Saatleri</h3>
              <div className="flex items-start gap-3 text-white/60 group mt-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <FiClock className="text-primary" />
                </div>
                <div className="flex flex-col gap-2">
                  {(() => {
                    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
                    const today = new Date().getDay();

                    return menuData.restaurantInfo.workingHours.map((hours: WorkingHours) => {
                      const dayIndex = hours.day === 0 ? 6 : hours.day - 1; // Convert Sunday (0) to 6
                      const isToday = today === hours.day;

                      return (
                        <div
                          key={hours.day}
                          className={`flex items-center justify-between text-sm ${isToday ? 'text-primary' : ''}`}
                        >
                          <span className="min-w-[100px]">{days[dayIndex]}</span>
                          <span>
                            {hours.is_open
                              ? `${hours.open_time.slice(0, 5)} - ${hours.close_time.slice(0, 5)}`
                              : 'Kapalı'
                            }
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/40 text-sm">
              {menuData.restaurantInfo.footer_text}{menuData.settings.copyright_text}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
