"use client";

import { useEffect, useRef, useState } from 'react';
import CategorySection from '@/themes/v1/components/CategorySection';
import { FiClock, FiMapPin, FiPhone, FiInstagram, FiStar, FiFacebook, FiTwitter } from 'react-icons/fi';
import { BiSolidFoodMenu } from 'react-icons/bi';
import { HiOutlineMail } from 'react-icons/hi';



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
        <div className="relative h-[60vh] min-h-[500px] bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70">
            <div className="container mx-auto h-full px-4 py-8">
              <div className="flex flex-col justify-center h-full max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center justify-center gap-2 bg-primary/20 text-primary rounded-full px-4 py-2 mb-6 backdrop-blur-sm mx-auto">
                  <BiSolidFoodMenu className="text-xl" />
                  <span className="text-sm font-medium">{menuData.restaurantInfo.tagline}</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">
                  {menuData.restaurantInfo.name}
                </h1>
                <p className="text-xl text-white/90 mb-8 font-light">
                  {menuData.restaurantInfo.description}
                </p>

                <div className="flex items-center justify-center gap-4 mb-12">
                  <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <FiStar className="text-yellow-400" />
                    <span className="text-white font-medium">{menuData.restaurantInfo.rating}</span>
                  </div>
                  <a
                    href={`https://instagram.com/${menuData.restaurantInfo.instagram.substring(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white transition-all"
                  >
                    <FiInstagram />
                    <span>{menuData.restaurantInfo.instagram}</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/90 text-sm max-w-3xl mx-auto">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                    <FiMapPin className="text-primary text-xl" />
                    <span>{menuData.restaurantInfo.address}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                    <FiPhone className="text-primary text-xl" />
                    <span>{menuData.restaurantInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                    <FiClock className="text-primary text-xl" />
                    <div className="text-left">
                      <p className="text-white/60 text-xs">Bugün</p>
                      <span>{new Date().getDay() === 5
                        ? menuData.restaurantInfo.workingHours.friday
                        : new Date().getDay() === 0 || new Date().getDay() === 6
                          ? menuData.restaurantInfo.workingHours.weekend
                          : menuData.restaurantInfo.workingHours.weekdays}</span>
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

        <div className="container mx-auto px-4 pt-16 pb-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Restaurant Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-white text-2xl font-bold mb-2">{menuData.restaurantInfo.name}</h3>
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
                  <span className="text-sm">{menuData.restaurantInfo.phone}</span>
                </a>

                <a
                  href={`mailto:info@lezzetduragi.com`}
                  className="flex items-center gap-3 text-white/60 hover:text-primary transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10">
                    <HiOutlineMail className="text-primary" />
                  </div>
                  <span className="text-sm">info@lezzetduragi.com</span>
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

              <div className="flex gap-4">
                <a
                  href={`https://instagram.com/${menuData.restaurantInfo.instagram.substring(1)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/10 transition-colors group"
                >
                  <FiInstagram className="text-primary group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/10 transition-colors group"
                >
                  <FiFacebook className="text-primary group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/10 transition-colors group"
                >
                  <FiTwitter className="text-primary group-hover:scale-110 transition-transform" />
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
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Hafta İçi</span>
                  <span className="text-white">{menuData.restaurantInfo.workingHours.weekdays}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Cuma</span>
                  <span className="text-white">{menuData.restaurantInfo.workingHours.friday}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Hafta Sonu</span>
                  <span className="text-white">{menuData.restaurantInfo.workingHours.weekend}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40">Resmi Tatil</span>
                  <span className="text-white">{menuData.restaurantInfo.workingHours.holiday}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} {menuData.restaurantInfo.name}. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
