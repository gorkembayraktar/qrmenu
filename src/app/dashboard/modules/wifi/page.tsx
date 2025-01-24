"use client";

import { useEffect, useState } from 'react';
import { FiArrowLeft, FiWifi } from 'react-icons/fi';
import { supabase } from '@/utils/supabase';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

interface WifiSettings {
    ssid: string;
    password: string;
    security: 'WPA' | 'WEP' | 'nopass';
    appearance: {
        position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
        size: 'small' | 'medium' | 'large';
        margin: { x: number; y: number };
        showOnMobile: boolean;
    };
}

export default function WifiSettingsPage() {
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
    const [settings, setSettings] = useState<WifiSettings>({
        ssid: '',
        password: '',
        security: 'WPA',
        appearance: {
            position: 'bottom-right',
            size: 'medium',
            margin: { x: 24, y: 24 },
            showOnMobile: true
        }
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('modules')
                .select('settings, is_active')
                .eq('id', 'wifi')
                .single();

            if (error) throw error;
            if (data) {
                setIsActive(data.is_active);
                if (data.settings?.wifi) {
                    setSettings(data.settings.wifi);
                }
            }
        } catch (error) {
            console.error('Error fetching WiFi settings:', error);
            toast.error('Ayarlar yüklenirken bir hata oluştu');
        }
    };

    const handleToggle = async () => {
        try {
            const { error } = await supabase
                .from('modules')
                .update({ is_active: !isActive })
                .eq('id', 'wifi');

            if (error) throw error;

            setIsActive(!isActive);
            toast.success(`WiFi modülü ${!isActive ? 'aktif edildi' : 'devre dışı bırakıldı'}`);
        } catch (error) {
            console.error('Error toggling module:', error);
            toast.error('Modül durumu güncellenirken bir hata oluştu');
        }
    };

    const handleSave = async () => {
        if (!settings.ssid.trim()) {
            toast.error('Lütfen bir WiFi adı girin');
            return;
        }

        if (settings.security !== 'nopass' && !settings.password.trim()) {
            toast.error('Lütfen bir WiFi şifresi girin');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('modules')
                .update({
                    settings: {
                        wifi: settings
                    }
                })
                .eq('id', 'wifi');

            if (error) throw error;
            toast.success('WiFi ayarları kaydedildi');
        } catch (error) {
            console.error('Error saving WiFi settings:', error);
            toast.error('Ayarlar kaydedilirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    // Generate WiFi QR Code string
    const getWifiQRString = () => {
        const security = settings.security === 'nopass' ? 'nopass' : settings.security;
        return `WIFI:T:${security};S:${settings.ssid};${settings.security !== 'nopass' ? `P:${settings.password};` : ''}H:false;;`;
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/dashboard/modules"
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            WiFi Ayarları
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            WiFi ağınıza kolay bağlanma için QR kod oluşturun
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleToggle}
                    className={`
                        shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none
                        ${isActive ? 'bg-blue-500' : 'bg-gray-200'}
                    `}
                >
                    <span className={`
                        inline-block h-5 w-5 transform rounded-full bg-white transition-transform
                        ${isActive ? 'translate-x-6' : 'translate-x-1'}
                        shadow-sm
                    `} />
                </button>
            </div>

            {/* Settings Form */}
            <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm transition-opacity ${!isActive ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="p-6 space-y-8">
                    {/* WiFi Settings */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">WiFi Bilgileri</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                WiFi Adı (SSID)
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-500">
                                    <FiWifi className="w-5 h-5" />
                                </span>
                                <input
                                    type="text"
                                    value={settings.ssid}
                                    onChange={(e) => setSettings(prev => ({ ...prev, ssid: e.target.value }))}
                                    className="pl-12 pr-4 py-2.5 w-full rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    placeholder="WiFi ağınızın adı"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Güvenlik Türü
                            </label>
                            <select
                                value={settings.security}
                                onChange={(e) => setSettings(prev => ({ ...prev, security: e.target.value as WifiSettings['security'] }))}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            >
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">Şifresiz</option>
                            </select>
                        </div>

                        {settings.security !== 'nopass' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    WiFi Şifresi
                                </label>
                                <input
                                    type="password"
                                    value={settings.password}
                                    onChange={(e) => setSettings(prev => ({ ...prev, password: e.target.value }))}
                                    className="px-4 py-2.5 w-full rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    placeholder="WiFi şifreniz"
                                />
                            </div>
                        )}
                    </div>

                    {/* Appearance Settings */}
                    <div className="space-y-6">
                        <button
                            type="button"
                            onClick={() => setIsAppearanceOpen(!isAppearanceOpen)}
                            className="w-full flex items-center justify-between text-left"
                        >
                            <h3 className="text-lg font-medium text-gray-900">Görünüm Ayarları</h3>
                            <svg
                                className={`w-5 h-5 text-gray-500 transition-transform ${isAppearanceOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div className={`space-y-6 transition-all duration-200 ease-in-out ${isAppearanceOpen ? 'block' : 'hidden'}`}>
                            {/* Position */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Konum
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: 'top-left', label: 'Sol Üst' },
                                        { value: 'top-right', label: 'Sağ Üst' },
                                        { value: 'bottom-left', label: 'Sol Alt' },
                                        { value: 'bottom-right', label: 'Sağ Alt' }
                                    ].map((pos) => (
                                        <button
                                            key={pos.value}
                                            type="button"
                                            onClick={() => setSettings(prev => ({
                                                ...prev,
                                                appearance: { ...prev.appearance, position: pos.value as WifiSettings['appearance']['position'] }
                                            }))}
                                            className={`
                                                p-3 border rounded-xl flex items-center justify-center text-sm font-medium
                                                ${settings.appearance.position === pos.value
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                }
                                            `}
                                        >
                                            {pos.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Buton Boyutu
                                </label>
                                <div className="flex space-x-3">
                                    {[
                                        { value: 'small', label: 'Küçük' },
                                        { value: 'medium', label: 'Orta' },
                                        { value: 'large', label: 'Büyük' }
                                    ].map((size) => (
                                        <button
                                            key={size.value}
                                            type="button"
                                            onClick={() => setSettings(prev => ({
                                                ...prev,
                                                appearance: { ...prev.appearance, size: size.value as WifiSettings['appearance']['size'] }
                                            }))}
                                            className={`
                                                px-4 py-2 border rounded-xl flex items-center justify-center text-sm font-medium flex-1
                                                ${settings.appearance.size === size.value
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                }
                                            `}
                                        >
                                            {size.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Margin */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kenar Boşlukları
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Yatay (X)</label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="range"
                                                min="10"
                                                max="150"
                                                value={settings.appearance.margin?.x || 24}
                                                onChange={(e) => setSettings(prev => ({
                                                    ...prev,
                                                    appearance: {
                                                        ...prev.appearance,
                                                        margin: {
                                                            ...prev.appearance.margin,
                                                            x: parseInt(e.target.value)
                                                        }
                                                    }
                                                }))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700 w-12">
                                                {settings.appearance.margin?.x || 24}px
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Dikey (Y)</label>
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="range"
                                                min="10"
                                                max="150"
                                                value={settings.appearance.margin?.y || 24}
                                                onChange={(e) => setSettings(prev => ({
                                                    ...prev,
                                                    appearance: {
                                                        ...prev.appearance,
                                                        margin: {
                                                            ...prev.appearance.margin,
                                                            y: parseInt(e.target.value)
                                                        }
                                                    }
                                                }))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700 w-12">
                                                {settings.appearance.margin?.y || 24}px
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Visibility */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700">Mobil Görünüm</h4>
                                    <p className="text-sm text-gray-500">Mobil cihazlarda WiFi butonunu göster</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSettings(prev => ({
                                        ...prev,
                                        appearance: { ...prev.appearance, showOnMobile: !prev.appearance.showOnMobile }
                                    }))}
                                    className={`
                                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none
                                        ${settings.appearance.showOnMobile ? 'bg-blue-500' : 'bg-gray-200'}
                                    `}
                                >
                                    <span className={`
                                        inline-block h-5 w-5 transform rounded-full bg-white transition-transform
                                        ${settings.appearance.showOnMobile ? 'translate-x-6' : 'translate-x-1'}
                                        shadow-sm
                                    `} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="rounded-xl border border-gray-100 p-4 bg-gray-50">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Önizleme</h4>
                        <div className="relative bg-white rounded-lg border border-gray-200 h-64">
                            <div
                                className={`
                                    absolute flex items-center justify-center
                                    ${settings.appearance.position === 'top-left' ? 'top-0 left-0' : ''}
                                    ${settings.appearance.position === 'top-right' ? 'top-0 right-0' : ''}
                                    ${settings.appearance.position === 'bottom-left' ? 'bottom-0 left-0' : ''}
                                    ${settings.appearance.position === 'bottom-right' ? 'bottom-0 right-0' : ''}
                                `}
                                style={{ padding: ` ${settings.appearance.margin.y || 24}px ${settings.appearance.margin.x || 24}px` }}
                            >
                                <div className={`
                                    flex items-center justify-center rounded-full bg-blue-500 text-white cursor-pointer
                                    ${settings.appearance.size === 'small' ? 'w-10 h-10' : ''}
                                    ${settings.appearance.size === 'medium' ? 'w-12 h-12' : ''}
                                    ${settings.appearance.size === 'large' ? 'w-14 h-14' : ''}
                                `}>
                                    <FiWifi className={`
                                        ${settings.appearance.size === 'small' ? 'w-5 h-5' : ''}
                                        ${settings.appearance.size === 'medium' ? 'w-6 h-6' : ''}
                                        ${settings.appearance.size === 'large' ? 'w-7 h-7' : ''}
                                    `} />
                                </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                {settings.ssid ? (
                                    <div className="text-center">
                                        <QRCodeSVG
                                            value={getWifiQRString()}
                                            size={200}
                                            level="H"
                                            includeMargin={true}
                                        />
                                        <div className="mt-4 space-y-1">
                                            <p className="font-medium text-gray-900">{settings.ssid}</p>
                                            {settings.security !== 'nopass' && (
                                                <p className="text-sm text-gray-500">
                                                    {settings.security === 'WPA' ? 'WPA/WPA2' : 'WEP'} Şifreli
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-sm">
                                        WiFi bilgilerini girin
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`
                            px-4 py-2 rounded-xl bg-blue-500 text-white font-medium 
                            hover:bg-blue-600 transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center space-x-2
                        `}
                    >
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            {!isActive && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-amber-800 text-sm">
                    Bu modül şu anda devre dışı. Ayarları düzenlemek için modülü aktif edin.
                </div>
            )}
        </div>
    );
} 