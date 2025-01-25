import React from 'react';
import { FiUpload, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { ThemeSettings } from '../types';

interface AppearanceSectionProps {
    settings: ThemeSettings;
    setSettings: (settings: ThemeSettings) => void;
    isUploading?: boolean;
    handleFileUpload?: (file: File, type: 'logo' | 'favicon' | 'hero') => Promise<void>;
    handleFileDelete?: (type: 'logo' | 'favicon' | 'hero') => Promise<void>;
}

export default function AppearanceSection({ settings, setSettings, isUploading, handleFileUpload, handleFileDelete }: AppearanceSectionProps) {
    // Hero ayarlarının varsayılan değerlerini kontrol et
    if (!settings.appearance.hero) {
        setSettings({
            ...settings,
            appearance: {
                ...settings.appearance,
                hero: {
                    type: 'image',
                    overlay_enabled: true,
                    height: 'medium',
                    content_alignment: 'center',
                    isExpanded: false
                }
            }
        });
    }

    return (
        <div className="space-y-6">
            {/* Logo Settings */}
            <div>
                <label className="flex items-center justify-between mb-2">
                    <span className="text-sm">Logo Kullan</span>
                    <div className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-gray-700"
                        onClick={() => setSettings({
                            ...settings,
                            appearance: {
                                ...settings.appearance,
                                useLogo: !settings.appearance.useLogo
                            }
                        })}
                    >
                        <span
                            aria-hidden="true"
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.appearance.useLogo ? 'translate-x-4' : 'translate-x-0'}`}
                        />
                    </div>
                </label>
                <p className="text-xs text-gray-400">Logo varsa başlık yerine logoyu göster</p>
            </div>

            {/* Hero Settings */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Hero Ayarları
                        <button
                            onClick={() => setSettings({
                                ...settings,
                                appearance: {
                                    ...settings.appearance,
                                    hero: {
                                        ...settings.appearance.hero,
                                        isExpanded: !settings.appearance.hero?.isExpanded
                                    }
                                }
                            })}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                            {settings.appearance.hero?.isExpanded ? (
                                <FiChevronUp className="inline" />
                            ) : (
                                <FiChevronDown className="inline" />
                            )}
                        </button>
                    </label>

                    {settings.appearance.hero?.isExpanded && (
                        <div className="space-y-4 mb-6 bg-gray-800 p-4 rounded-lg">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Hero Ayarları
                                </label>
                                <select
                                    value={settings.appearance.hero.type}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        appearance: {
                                            ...settings.appearance,
                                            hero: {
                                                ...settings.appearance.hero,
                                                type: e.target.value as 'image' | 'video'
                                            }
                                        }
                                    })}
                                    className="w-full px-3 py-2 bg-gray-700 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="image">Görsel</option>
                                    <option value="video">Video</option>
                                </select>
                                <p className="text-xs text-gray-400 mt-1">Hero bölümünün tipini seçin</p>
                            </div>

                            {settings.appearance.hero.type === 'image' ? (
                                /* Hero Image */
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Hero Görseli</h3>
                                    <p className="text-xs text-gray-400 mb-4">Önerilen boyut: 1920x1080 piksel</p>

                                    {/* Default Image Toggle */}
                                    <div className="mb-4">
                                        <label className="flex items-center justify-between mb-2">
                                            <span className="text-sm">Varsayılan Görseli Kullan</span>
                                            <div className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-gray-700"
                                                onClick={() => setSettings({
                                                    ...settings,
                                                    appearance: {
                                                        ...settings.appearance,
                                                        hero: {
                                                            ...settings.appearance.hero,
                                                            use_default_image: !settings.appearance.hero.use_default_image
                                                        }
                                                    }
                                                })}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.appearance.hero.use_default_image ? 'translate-x-4' : 'translate-x-0'}`}
                                                />
                                            </div>
                                        </label>
                                        <p className="text-xs text-gray-400">Sistemin varsayılan hero görselini kullan</p>
                                    </div>

                                    {/* Custom Image Upload */}
                                    {!settings.appearance.hero.use_default_image && (
                                        <>
                                            {settings.appearance.hero.image_url ? (
                                                <div className="space-y-3">
                                                    <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                                                        <img
                                                            src={settings.appearance.hero.image_url}
                                                            alt="Hero Görseli"
                                                            className="w-full h-32 object-cover rounded"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleFileDelete?.('hero')}
                                                            disabled={isUploading}
                                                            className="text-xs px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded flex items-center gap-1.5 disabled:opacity-50"
                                                        >
                                                            <FiTrash2 className="w-3.5 h-3.5" />
                                                            Kaldır
                                                        </button>
                                                        <label className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer flex items-center gap-1.5 disabled:opacity-50">
                                                            <FiUpload className="w-3.5 h-3.5" />
                                                            {isUploading ? 'Yükleniyor...' : 'Görsel değiştir'}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                disabled={isUploading}
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file && handleFileUpload) {
                                                                        handleFileUpload(file, 'hero');
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <label className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer flex items-center gap-1.5 w-fit disabled:opacity-50">
                                                    <FiUpload className="w-3.5 h-3.5" />
                                                    {isUploading ? 'Yükleniyor...' : 'Görsel seç'}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        disabled={isUploading}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file && handleFileUpload) {
                                                                handleFileUpload(file, 'hero');
                                                            }
                                                        }}
                                                    />
                                                </label>
                                            )}
                                        </>
                                    )}

                                    {/* Preview Default Image */}
                                    {settings.appearance.hero.use_default_image && (
                                        <div className="space-y-3">
                                            <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                                                <img
                                                    src={settings.appearance.hero.image_url_default}
                                                    alt="Varsayılan Hero Görseli"
                                                    className="w-full h-32 object-cover rounded"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Hero Video */
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Video URL</h3>
                                    <p className="text-xs text-gray-400 mb-4">YouTube veya Vimeo video URL'si girin</p>
                                    <input
                                        type="text"
                                        value={settings.appearance.hero.video_url || ''}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            appearance: {
                                                ...settings.appearance,
                                                hero: {
                                                    ...settings.appearance.hero,
                                                    video_url: e.target.value
                                                }
                                            }
                                        })}
                                        placeholder="Örn: https://www.youtube.com/watch?v=..."
                                        className="w-full px-3 py-2 bg-gray-700 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            )}

                            {/* Hero Settings */}
                            <div>
                                <label className="flex items-center justify-between mb-2">
                                    <span className="text-sm">Overlay Efekti</span>
                                    <div className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-gray-700"
                                        onClick={() => setSettings({
                                            ...settings,
                                            appearance: {
                                                ...settings.appearance,
                                                hero: {
                                                    ...settings.appearance.hero,
                                                    overlay_enabled: !settings.appearance.hero.overlay_enabled
                                                }
                                            }
                                        })}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.appearance.hero.overlay_enabled ? 'translate-x-4' : 'translate-x-0'}`}
                                        />
                                    </div>
                                </label>
                                <p className="text-xs text-gray-400">Koyu renk overlay efekti ekle</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Hero Yüksekliği
                                </label>
                                <select
                                    value={settings.appearance.hero.height}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        appearance: {
                                            ...settings.appearance,
                                            hero: {
                                                ...settings.appearance.hero,
                                                height: e.target.value as 'small' | 'medium' | 'large' | 'full'
                                            }
                                        }
                                    })}
                                    className="w-full px-3 py-2 bg-gray-700 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="small">Küçük (40vh)</option>
                                    <option value="medium">Orta (60vh)</option>
                                    <option value="large">Büyük (80vh)</option>
                                    <option value="full">Tam Ekran (100vh)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    İçerik Hizalama
                                </label>
                                <select
                                    value={settings.appearance.hero.content_alignment}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        appearance: {
                                            ...settings.appearance,
                                            hero: {
                                                ...settings.appearance.hero,
                                                content_alignment: e.target.value as 'left' | 'center' | 'right'
                                            }
                                        }
                                    })}
                                    className="w-full px-3 py-2 bg-gray-700 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="left">Sola Hizalı</option>
                                    <option value="center">Ortalı</option>
                                    <option value="right">Sağa Hizalı</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 