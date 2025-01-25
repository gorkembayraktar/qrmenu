"use client";

import { useEffect, useRef, useState } from 'react';
import { FiClock, FiMapPin, FiPhone, FiInstagram, FiStar, FiMenu, FiChevronRight, FiFacebook, FiTwitter, FiYoutube, FiMail } from 'react-icons/fi';
import { BiSolidFoodMenu, BiSolidDish } from 'react-icons/bi';
import { formatPrice } from '@/utils/price';
import { v2 } from '@/mockdata/theme';

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
    root.style.setProperty('--price-text', colors.price.text);
  }, [colors]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-color)' }}>
      {/* Header */}
      <header className={`relative ${menuData.theme?.appearance?.hero?.height === 'small' ? 'h-[40vh]' :
        menuData.theme?.appearance?.hero?.height === 'medium' ? 'h-[60vh]' :
          menuData.theme?.appearance?.hero?.height === 'large' ? 'h-[80vh]' :
            'h-[100vh]'
        } min-h-[320px] bg-neutral-900 overflow-hidden`}>
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
          {menuData.theme?.appearance?.hero?.overlay_enabled && (
            <div className="absolute inset-0 bg-black/60" />
          )}
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
        <div className={`relative h-full flex flex-col ${menuData.theme?.appearance?.hero?.content_alignment === 'left'
          ? 'items-start text-left pl-8 md:pl-16'
          : menuData.theme?.appearance?.hero?.content_alignment === 'right'
            ? 'items-end text-right pr-8 md:pr-16'
            : 'items-center text-center'
          } justify-center text-white px-4`}>
          {menuData.theme.show_title_tagline && (<>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${menuData.theme?.appearance?.hero?.content_alignment === 'left' || menuData.theme?.appearance?.hero?.content_alignment === 'right'
              ? 'max-w-2xl'
              : 'text-center max-w-4xl'
              }`}>
              {menuData.restaurantInfo.name}
            </h1>
            <p className={`text-lg md:text-xl text-gray-200 mb-2 ${menuData.theme?.appearance?.hero?.content_alignment === 'left' || menuData.theme?.appearance?.hero?.content_alignment === 'right'
              ? 'max-w-xl'
              : 'text-center max-w-2xl'
              }`}>
              {menuData.restaurantInfo.description}
            </p>
          </>)}
        </div>
      </header>

      {/* Main Content */}
      <main>


        {/* Menu Categories */}
        <div id="menu" className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-16" style={{ color: 'var(--heading-color)' }}>Menümüz</h2>
          {menuData.categories.map((category: any, index: number) => (
            <div key={index} className="mb-16 last:mb-0">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-medium" style={{ color: 'var(--heading-color)' }}>{category.title}</h3>
                <div className="h-[2px] flex-1 ml-6" style={{ background: `linear-gradient(to right, var(--primary-color), transparent)` }} />
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
                            <h4 className="text-lg font-medium mb-1" style={{ color: 'var(--heading-color)' }}>{item.name}</h4>
                            <p className="text-sm mb-2" style={{ color: 'var(--text-color)' }}>{item.description}</p>
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
                            <span className="inline-block text-base md:text-lg font-semibold px-3 md:px-4 py-1 rounded-full" style={{
                              backgroundColor: 'var(--price-bg)',
                              color: 'var(--price-text)'
                            }}>
                              {formatPrice(item.price)}
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
        <div className="py-24" style={{ backgroundColor: 'var(--card-bg)' }}>
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16" style={{ color: 'var(--heading-color)' }}>İletişim Bilgilerimiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Email Card */}
              <div className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl"
                style={{ backgroundColor: 'var(--background-color)', border: '1px solid var(--card-border)' }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundColor: 'var(--primary-color)' }} />
                <div className="p-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 bg-amber-100">
                    <FiMail className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--heading-color)' }}>Mail Adresimiz</h3>
                  <a href={`mailto:${menuData.restaurantInfo.email}`}
                    className="text-lg transition-colors duration-300 hover:opacity-75"
                    style={{ color: 'var(--text-color)' }}>
                    {menuData.restaurantInfo.email}
                  </a>
                </div>
              </div>

              {/* Address Card */}
              <div className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl"
                style={{ backgroundColor: 'var(--background-color)', border: '1px solid var(--card-border)' }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundColor: 'var(--primary-color)' }} />
                <div className="p-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 bg-amber-100">
                    <FiMapPin className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--heading-color)' }}>Adresimiz</h3>
                  <a href={menuData.restaurantInfo.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg block transition-colors duration-300 hover:opacity-75"
                    style={{ color: 'var(--text-color)' }}>
                    {menuData.restaurantInfo.address}
                  </a>
                </div>
              </div>

              {/* Phone Card */}
              <div className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl"
                style={{ backgroundColor: 'var(--background-color)', border: '1px solid var(--card-border)' }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundColor: 'var(--primary-color)' }} />
                <div className="p-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 bg-amber-100">
                    <FiPhone className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--heading-color)' }}>Telefon</h3>
                  <a href={`tel:${menuData.restaurantInfo.phone}`}
                    className="text-lg transition-colors duration-300 hover:opacity-75"
                    style={{ color: 'var(--text-color)' }}>
                    {menuData.restaurantInfo.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="mb-16">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-100">
              <FiClock className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-2xl font-semibold" style={{ color: 'var(--heading-color)' }}>Çalışma Saatleri</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {(() => {
              const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
              const today = new Date().getDay();

              return menuData.restaurantInfo.workingHours.map((hours: any) => {
                const dayIndex = hours.day === 0 ? 6 : hours.day - 1;
                const isToday = today === hours.day;

                return (
                  <div
                    key={hours.day}
                    className="flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:shadow-md"
                    style={{
                      backgroundColor: isToday ? 'var(--primary-color)' : 'var(--card-bg)',
                      border: `1px solid ${isToday ? 'var(--primary-color)' : 'var(--card-border)'}`,
                      color: isToday ? 'white' : 'var(--text-color)'
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full" style={{
                        backgroundColor: hours.is_open ? 'var(--accent-color)' : 'var(--secondary-color)'
                      }} />
                      <span className="font-medium">{days[dayIndex]}</span>
                    </div>
                    <span className="font-medium" style={{
                      color: isToday ? 'white' : (hours.is_open ? 'var(--accent-color)' : 'var(--secondary-color)')
                    }}>
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
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gradient-to-t from-gray-50 to-white pt-16 pb-8" style={{
        background: `linear-gradient(to top, var(--card-bg), var(--background-color))`
      }}>
        <div className="max-w-4xl mx-auto px-4">
          {/* Social Media Links */}
          {menuData.modules?.social?.is_active && menuData.modules.social.settings.social.accounts.length > 0 && (
            <div className="flex justify-center space-x-8 mb-12">
              {menuData.modules.social.settings.social.accounts.map((account: any) => (
                <a
                  key={account.id}
                  href={account.username}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:opacity-100"
                  style={{
                    color: 'var(--text-color)',
                    opacity: 0.6
                  }}
                >
                  <SocialIcon platform={account.platform} />
                </a>
              ))}
            </div>
          )}

          {/* Logo */}
          {menuData.settings.logo_url && (
            menuData?.theme?.appearance?.useLogo == undefined ||
            menuData?.theme?.appearance?.useLogo == true) && (
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
