"use client";

import { useEffect, useRef, useState } from 'react';
import CategorySection from '@/themes/v1/components/CategorySection';
import { FiClock, FiMapPin, FiPhone, FiInstagram, FiStar, FiFacebook, FiTwitter } from 'react-icons/fi';
import { BiSolidFoodMenu } from 'react-icons/bi';
import { HiOutlineMail } from 'react-icons/hi';
import { v1 } from '@/mockdata/theme';

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

  // Varsayılan renk paleti
  const colors = menuData.colors;

  // CSS değişkenlerini ayarla
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--accent-color', colors.accent);
    root.style.setProperty('--background-color', colors.background);
    root.style.setProperty('--text-primary', colors.text.primary);
    root.style.setProperty('--text-secondary', colors.text.secondary);
    root.style.setProperty('--text-light', colors.text.light);
    root.style.setProperty('--card-bg', colors.card.background);
    root.style.setProperty('--card-hover', colors.card.hover);
    root.style.setProperty('--card-border', colors.card.border);
    root.style.setProperty('--footer-bg', colors.footer.background);
    root.style.setProperty('--footer-text', colors.footer.text);
    root.style.setProperty('--footer-border', colors.footer.border);
    root.style.setProperty('--overlay-dark', colors.overlay.dark);
    root.style.setProperty('--overlay-light', colors.overlay.light);
  }, [colors]);

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
        <div className={`relative ${menuData.theme?.appearance?.hero?.height === 'small' ? 'h-[40vh]' :
          menuData.theme?.appearance?.hero?.height === 'medium' ? 'h-[60vh]' :
            menuData.theme?.appearance?.hero?.height === 'large' ? 'h-[80vh]' :
              'h-[100vh]'
          } min-h-[400px] bg-cover bg-center`}>
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            {menuData.theme?.appearance?.hero?.type === 'video' ? (
              <>
                {menuData.theme?.appearance?.hero?.video_url?.includes('youtube.com') ? (
                  <div className="relative w-full h-full pt-[56.25%]">
                    <iframe
                      src={`${menuData.theme?.appearance?.hero?.video_url?.replace('watch?v=', 'embed/')}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1&playlist=${menuData.theme?.appearance?.hero?.video_url?.split('v=')[1]}`}
                      title="Hero Video"
                      className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      style={{
                        border: 'none'
                      }}
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
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('${menuData.theme?.appearance?.hero?.use_default_image
                    ? menuData.theme?.appearance?.hero?.image_url_default
                    : menuData.theme?.appearance?.hero?.image_url || '/images/hero.jpg'
                    }')`
                }}
              />
            )}
            {/* Overlay for both video and image */}
            {menuData.theme?.appearance?.hero?.overlay_enabled && (
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 pointer-events-none" />
            )}
          </div>
          <div className="absolute inset-0">
            <div className="container mx-auto h-full px-4 py-8">
              <div className={`flex flex-col justify-center h-full mx-auto ${menuData.theme?.appearance?.hero?.content_alignment === 'left'
                ? 'text-left items-start'
                : menuData.theme?.appearance?.hero?.content_alignment === 'right'
                  ? 'text-right items-end ml-auto'
                  : 'text-center items-center'
                } ${menuData.theme?.appearance?.hero?.content_alignment === 'left' || menuData.theme?.appearance?.hero?.content_alignment === 'right'
                  ? 'max-w-2xl'
                  : 'max-w-4xl'
                }`}>
                {menuData.settings.logo_url && (
                  menuData?.theme?.appearance?.useLogo == undefined ||
                  menuData?.theme?.appearance?.useLogo == true) ? (
                  <div className={`mb-8 ${menuData.theme?.appearance?.hero?.content_alignment === 'left'
                    ? 'ml-0'
                    : menuData.theme?.appearance?.hero?.content_alignment === 'right'
                      ? 'ml-auto'
                      : 'mx-auto'
                    }`}>
                    <img
                      src={menuData.settings.logo_url}
                      alt={menuData.restaurantInfo.name}
                      className="h-24 w-auto"
                    />
                  </div>
                ) : (
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                    {menuData.restaurantInfo.name}
                  </h1>
                )}
                {menuData.theme.show_title_tagline && (
                  <p className={`text-xl text-white/90 mb-8 font-light ${menuData.theme?.appearance?.hero?.content_alignment === 'left' || menuData.theme?.appearance?.hero?.content_alignment === 'right'
                    ? 'max-w-xl'
                    : 'max-w-2xl mx-auto'
                    }`}>
                    {menuData.restaurantInfo.description}
                  </p>
                )}


                <div className="flex items-center justify-center gap-4 mb-12">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <FiStar style={{ color: 'var(--primary-color)' }} />
                    <span style={{ color: 'var(--text-light)' }} className="font-medium">{menuData.restaurantInfo.rating}</span>
                  </div>
                  {menuData.modules?.social?.is_active && menuData.modules.social.settings.social.accounts.length > 0 && (
                    <div className="flex items-center gap-3">
                      {menuData.modules.social.settings.social.accounts.map((account: any) => (
                        <a
                          key={account.id}
                          href={account.username}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                          style={{
                            backgroundColor: 'var(--overlay-light)',
                            color: 'var(--text-light)',
                            backdropFilter: 'blur(8px)'
                          }}
                        >
                          {account.platform === 'instagram' && <FiInstagram className="text-xl" />}
                          {account.platform === 'facebook' && <FiFacebook className="text-xl" />}
                          {account.platform === 'twitter' && <FiTwitter className="text-xl" />}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm max-w-3xl mx-auto">
                  <div className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                    style={{
                      backgroundColor: 'var(--overlay-light)',
                      color: 'var(--text-light)',
                      backdropFilter: 'blur(8px)'
                    }}>
                    <FiMapPin style={{ color: 'var(--primary-color)' }} className="text-xl" />
                    <span>{menuData.restaurantInfo.address}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                    style={{
                      backgroundColor: 'var(--overlay-light)',
                      color: 'var(--text-light)',
                      backdropFilter: 'blur(8px)'
                    }}>
                    <FiPhone style={{ color: 'var(--primary-color)' }} className="text-xl" />
                    <span>{formatPhoneNumber(menuData.restaurantInfo.phone)}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                    style={{
                      backgroundColor: 'var(--overlay-light)',
                      color: 'var(--text-light)',
                      backdropFilter: 'blur(8px)'
                    }}>
                    <FiClock style={{ color: 'var(--primary-color)' }} className="text-xl" />
                    <div className="text-left">
                      <p style={{ color: 'var(--text-light)', opacity: 0.6 }} className="text-xs">Bugün</p>
                      {(() => {
                        const today = new Date().getDay();
                        const currentHour = new Date().getHours();
                        const currentMinute = new Date().getMinutes();
                        const currentTime = `${currentHour}:${currentMinute}`;

                        const todayHours = menuData.restaurantInfo.workingHours.find((h: WorkingHours) => h.day === today);

                        if (!todayHours) {
                          return <span style={{ color: 'var(--accent-color)' }}>Kapalı</span>;
                        }

                        const openTime = todayHours.open_time.slice(0, 5);
                        const closeTime = todayHours.close_time.slice(0, 5);

                        return (
                          <div>
                            <span style={{ color: todayHours.is_open ? 'var(--accent-color)' : 'var(--secondary-color)' }}>
                              {todayHours.is_open ? "Açık" : "Kapalı"}
                            </span>
                            <span style={{ color: 'var(--text-light)', opacity: 0.6 }} className="text-xs ml-1">
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
        <nav className="sticky top-0 z-20 shadow-sm border-b"
          style={{
            backgroundColor: 'var(--background-color)',
            borderColor: 'var(--card-border)',
            backdropFilter: 'blur(8px)'
          }}>
          <div
            ref={navRef}
            className="max-w-7xl  mx-auto px-4 touch-pan-x"
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
                      ${activeCategory === categoryId ? 'font-semibold' : ''}
                    `}
                    style={{
                      backgroundColor: activeCategory === categoryId ? 'var(--primary-color)' : 'transparent',
                      color: activeCategory === categoryId ? 'white' : 'var(--text-secondary)',
                      opacity: activeCategory === categoryId ? 1 : 0.8
                    }}
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
      <footer style={{ backgroundColor: 'var(--footer-bg)' }} className="relative">
        {/* Restaurant Shape Divider */}
        <div className="absolute top-0 left-0 w-full overflow-hidden h-16 -translate-y-[98%]">
          <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
            <polygon style={{ fill: 'var(--footer-bg)' }} points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-16 pb-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Restaurant Info */}
            <div className="space-y-6">
              <div>
                {menuData.settings.logo_url && (
                  menuData?.theme?.appearance?.useLogo == undefined ||
                  menuData?.theme?.appearance?.useLogo == true) ? (
                  <div className="mb-4">
                    <img
                      src={menuData.settings.logo_url}
                      alt={menuData.restaurantInfo.name}
                      className="h-12 w-auto"
                    />
                  </div>
                ) : (
                  <h3 style={{ color: 'var(--text-light)' }} className="text-2xl font-bold mb-2">{menuData.restaurantInfo.name}</h3>
                )}
                <p style={{ color: 'var(--footer-text)', opacity: 0.6 }} className="text-sm leading-relaxed">
                  {menuData.restaurantInfo.description}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={`tel:${menuData.restaurantInfo.phone}`}
                  className="flex items-center gap-3 group transition-colors"
                  style={{ color: 'var(--footer-text)' }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: 'var(--overlay-light)' }}>
                    <FiPhone style={{ color: 'var(--primary-color)' }} />
                  </div>
                  <span className="text-sm group-hover:opacity-75">{formatPhoneNumber(menuData.restaurantInfo.phone)}</span>
                </a>

                <a
                  href={`mailto:${menuData.restaurantInfo.email}`}
                  className="flex items-center gap-3 group transition-colors"
                  style={{ color: 'var(--footer-text)' }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: 'var(--overlay-light)' }}>
                    <HiOutlineMail style={{ color: 'var(--primary-color)' }} />
                  </div>
                  <span className="text-sm group-hover:opacity-75">{menuData.restaurantInfo.email}</span>
                </a>

                <a
                  href={menuData.restaurantInfo.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group transition-colors"
                  style={{ color: 'var(--footer-text)' }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: 'var(--overlay-light)' }}>
                    <FiMapPin style={{ color: 'var(--primary-color)' }} />
                  </div>
                  <span className="text-sm group-hover:opacity-75">{menuData.restaurantInfo.address}</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{ color: 'var(--text-light)' }} className="text-lg font-semibold mb-6">Menümüz</h3>
              <div className="grid grid-cols-2 gap-2">
                {menuData.categories.map((category: any) => (
                  <a
                    key={category.title}
                    href={`#${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm py-1 transition-colors hover:opacity-75"
                    style={{ color: 'var(--footer-text)' }}
                  >
                    {category.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Working Hours */}
            <div>
              <h3 style={{ color: 'var(--text-light)' }} className="text-lg font-semibold mb-6">Çalışma Saatleri</h3>
              <div className="flex items-start gap-3 mt-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--overlay-light)' }}>
                  <FiClock style={{ color: 'var(--primary-color)' }} />
                </div>
                <div className="flex flex-col gap-2">
                  {(() => {
                    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
                    const today = new Date().getDay();

                    return menuData.restaurantInfo.workingHours.map((hours: WorkingHours) => {
                      const dayIndex = hours.day === 0 ? 6 : hours.day - 1;
                      const isToday = today === hours.day;

                      return (
                        <div
                          key={hours.day}
                          className="flex items-center justify-between text-sm"
                          style={{
                            color: isToday ? 'var(--primary-color)' : 'var(--footer-text)'
                          }}
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
          <div style={{ borderColor: 'var(--footer-border)' }} className="border-t pt-8 text-center">
            <p style={{ color: 'var(--footer-text)', opacity: 0.4 }} className="text-sm">
              {menuData.restaurantInfo.footer_text} {menuData.settings.copyright_text}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
