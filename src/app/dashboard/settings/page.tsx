"use client";

import { useState, useEffect, useRef } from 'react';
import { FiSave, FiGlobe, FiLayout, FiDollarSign, FiImage, FiClock, FiUpload, FiTrash2 } from 'react-icons/fi';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
import { PatternFormat } from 'react-number-format';
import Image from 'next/image';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingFavicon, setUploadingFavicon] = useState(false);
    const [deletingLogo, setDeletingLogo] = useState(false);
    const [deletingFavicon, setDeletingFavicon] = useState(false);
    const [settings, setSettings] = useState({
        page_title: '',
        restaurant_name: '',
        restaurant_slogan: '',
        phone: '',
        address: '',
        currency: 'TRY',
        language: 'tr',
        rating: '4.8',
        logo_url: '',
        favicon_url: '',
        footer_text: '',
        copyright_text: ''
    });

    const supabase = createClientComponentClient();
    const logoInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);

    // Load settings on component mount
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const { data, error } = await supabase
            .from('settings')
            .select('name, value');

        if (error) {
            console.error('Error loading settings:', error);
            return;
        }

        if (data) {
            const settingsObj = data.reduce((acc, curr) => ({
                ...acc,
                [curr.name]: curr.value || '' // Ensure value is never undefined
            }), {} as typeof settings);

            // Merge with default values to ensure all fields exist
            setSettings(prev => ({
                ...prev,
                ...settingsObj
            }));
        }
    };

    const handleInputChange = (name: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            [name]: value || '' // Ensure value is never undefined
        }));
    };

    const handleSave = async () => {
        setLoading(true);

        // Show loading toast
        const loadingToast = toast.loading('Ayarlar kaydediliyor...');

        try {
            // Convert settings object to array of updates
            const updates = Object.entries(settings).map(([name, value]) => ({
                name,
                value
            }));

            // Update all settings
            const { error } = await supabase
                .from('settings')
                .upsert(updates, { onConflict: 'name' });

            if (error) throw error;

            // Success toast
            toast.success('Ayarlar başarıyla kaydedildi', {
                id: loadingToast,
                duration: 3000,
                icon: '✅'
            });
        } catch (error) {
            console.error('Error saving settings:', error);
            // Error toast
            toast.error('Ayarlar kaydedilirken bir hata oluştu!', {
                id: loadingToast,
                duration: 4000,
                icon: '❌'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file: File, type: 'logo' | 'favicon') => {
        try {
            if (type === 'logo') {
                setUploadingLogo(true);
            } else {
                setUploadingFavicon(true);
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            // Update settings state with new URL
            handleInputChange(`${type}_url`, data.url);

            // Save to settings table
            const { error: saveError } = await supabase
                .from('settings')
                .upsert({ name: `${type}_url`, value: data.url }, { onConflict: 'name' });

            if (saveError) throw saveError;

            // Clear file input
            if (type === 'logo' && logoInputRef.current) {
                logoInputRef.current.value = '';
            } else if (type === 'favicon' && faviconInputRef.current) {
                faviconInputRef.current.value = '';
            }

            toast.success(`${type === 'logo' ? 'Logo' : 'Favicon'} başarıyla yüklendi`);

        } catch (error) {
            console.error('Upload error:', error);
            toast.error(`${type === 'logo' ? 'Logo' : 'Favicon'} yüklenirken bir hata oluştu`);
        } finally {
            if (type === 'logo') {
                setUploadingLogo(false);
            } else {
                setUploadingFavicon(false);
            }
        }
    };

    const handleDelete = async (type: 'logo' | 'favicon') => {
        try {
            if (type === 'logo') {
                setDeletingLogo(true);
            } else {
                setDeletingFavicon(true);
            }

            const response = await fetch(`/api/upload/delete?type=${type}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Silme işlemi başarısız oldu');
            }

            // Update local state
            handleInputChange(`${type}_url`, '');
            toast.success(data.message);

        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error(error.message || 'Silme işlemi başarısız oldu');
        } finally {
            if (type === 'logo') {
                setDeletingLogo(false);
            } else {
                setDeletingFavicon(false);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Genel Ayarlar
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Menü ve uygulama ayarlarınızı buradan yönetebilirsiniz
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`flex items-center px-6 py-3 rounded-xl text-white font-medium space-x-2 
                        ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                        } transition-all shadow-lg shadow-blue-600/20`}
                >
                    <FiSave className="h-5 w-5" />
                    <span>{loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
                </button>
            </div>

            {/* Settings Grid */}
            <div className="grid gap-6">
                {/* Restaurant Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Restoran Bilgileri</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sayfa Başlığı
                                </label>
                                <input
                                    type="text"
                                    value={settings.page_title}
                                    onChange={(e) => handleInputChange('page_title', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    placeholder="Tarayıcı sekmesinde görünecek başlık"
                                />
                                <p className="mt-2 text-xs text-gray-500">Örn: Restoran Adı - Online Menü</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Restoran Adı
                                </label>
                                <input
                                    type="text"
                                    value={settings.restaurant_name}
                                    onChange={(e) => handleInputChange('restaurant_name', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    placeholder="Restoran adını girin"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Slogan
                                </label>
                                <input
                                    type="text"
                                    value={settings.restaurant_slogan}
                                    onChange={(e) => handleInputChange('restaurant_slogan', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    placeholder="Markanızın sloganını girin"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Telefon
                                </label>
                                <PatternFormat
                                    format="+90 (###) ### ## ##"
                                    mask="_"
                                    value={settings.phone}
                                    onValueChange={(values) => handleInputChange('phone', values.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    placeholder="+90 (___) ___ __ __"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Adres
                                </label>
                                <textarea
                                    rows={3}
                                    value={settings.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                                    placeholder="Restoran adresini girin"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Yıldız Değerlendirme
                                </label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        value={settings.rating}
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value);
                                            if (value >= 0 && value <= 5) {
                                                handleInputChange('rating', value.toString());
                                            }
                                        }}
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        className="w-24 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    />
                                    <div className="flex items-center text-yellow-400">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className={`w-5 h-5 ${parseFloat(settings.rating) >= star ? 'fill-current' : 'fill-gray-300'}`}
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-gray-500">0 ile 5 arasında bir değer girin (örn: 4.8)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Menü Ayarları</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Para Birimi
                                </label>
                                <select
                                    value={settings.currency}
                                    onChange={(e) => handleInputChange('currency', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                >
                                    <option value="TRY">TL (₺)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dil
                                </label>
                                <select
                                    value={settings.language}
                                    onChange={(e) => handleInputChange('language', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                >
                                    <option value="tr">Türkçe</option>
                                    <option value="en">English</option>
                                </select>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Brand Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Marka Ayarları</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Logo
                                </label>
                                <div className="flex items-center space-x-4">
                                    <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                        {settings.logo_url ? (
                                            <Image
                                                src={settings.logo_url}
                                                alt="Logo"
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <FiImage className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                ref={logoInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileUpload(file, 'logo');
                                                }}
                                                className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100
                                                disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={uploadingLogo}
                                            />
                                            {settings.logo_url && (
                                                <button
                                                    onClick={() => handleDelete('logo')}
                                                    disabled={deletingLogo}
                                                    className={`p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors
                                                        ${deletingLogo ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    title="Logo'yu kaldır"
                                                >
                                                    {deletingLogo ? (
                                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <FiTrash2 className="w-5 h-5" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">PNG, JPG veya GIF (max. 2MB)</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Favicon
                                </label>
                                <div className="flex items-center space-x-4">
                                    <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                        {settings.favicon_url ? (
                                            <Image
                                                src={settings.favicon_url}
                                                alt="Favicon"
                                                width={32}
                                                height={32}
                                                className="w-8 h-8"
                                            />
                                        ) : (
                                            <FiImage className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                ref={faviconInputRef}
                                                type="file"
                                                accept="image/x-icon,image/png"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) handleFileUpload(file, 'favicon');
                                                }}
                                                className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100
                                                disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={uploadingFavicon}
                                            />
                                            {settings.favicon_url && (
                                                <button
                                                    onClick={() => handleDelete('favicon')}
                                                    disabled={deletingFavicon}
                                                    className={`p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors
                                                        ${deletingFavicon ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    title="Favicon'u kaldır"
                                                >
                                                    {deletingFavicon ? (
                                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <FiTrash2 className="w-5 h-5" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">ICO veya PNG (32x32px)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Footer Ayarları</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Footer Metni
                                </label>
                                <textarea
                                    rows={3}
                                    value={settings.footer_text}
                                    onChange={(e) => handleInputChange('footer_text', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                                    placeholder="Footer'da görünecek metni girin"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Telif Hakkı Metni
                                </label>
                                <input
                                    type="text"
                                    value={settings.copyright_text}
                                    onChange={(e) => handleInputChange('copyright_text', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    placeholder="© 2024 Restoran Adı. Tüm hakları saklıdır."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 