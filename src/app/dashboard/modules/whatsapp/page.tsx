"use client";

import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import { supabase } from '@/utils/supabase';
import toast from 'react-hot-toast';
import Link from 'next/link';

type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
type Size = 'small' | 'medium' | 'large';

interface WhatsAppModule {
    settings: {
        whatsapp: {
            number: string;
            message: string;
            appearance: {
                position: Position;
                size: Size;
                margin: number;
                showOnMobile: boolean;
            };
        };
    };
    is_active: boolean;
}

interface WhatsAppSettings {
    number: string;
    message: string;
    appearance: {
        position: Position;
        size: Size;
        margin: { x: number; y: number };
        showOnMobile: boolean;
    };
}

// Format phone number as user types (5XX XXX XX XX)
const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
        return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
    }
    if (phoneNumberLength < 9) {
        return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6)}`;
    }
    return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 8)} ${phoneNumber.slice(8, 10)}`;
};

// Convert local format to WhatsApp format (905XXXXXXXXX)
const toWhatsAppFormat = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    return numbers.length === 10 ? `90${numbers}` : numbers;
};

// Convert WhatsApp format to local display format
const fromWhatsAppFormat = (value: string) => {
    if (!value) return '';
    // Remove 90 prefix if exists
    const local = value.startsWith('90') ? value.slice(2) : value;
    return formatPhoneNumber(local);
};

export default function WhatsAppSettingsPage() {
    const [settings, setSettings] = useState<WhatsAppSettings>({
        number: '',
        message: 'Merhaba, menünüz hakkında bilgi almak istiyorum.',
        appearance: {
            position: 'bottom-right',
            size: 'medium',
            margin: { x: 24, y: 24 },
            showOnMobile: true
        }
    });
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('modules')
                .select('settings, is_active')
                .eq('id', 'whatsapp')
                .single();

            if (error) throw error;
            if (data) {
                setIsActive(data.is_active);
                if (data.settings?.whatsapp) {
                    const appearance = data.settings.whatsapp.appearance || {};
                    setSettings({
                        number: fromWhatsAppFormat(data.settings.whatsapp.number || ''),
                        message: data.settings.whatsapp.message || 'Merhaba, menünüz hakkında bilgi almak istiyorum.',
                        appearance: {
                            position: appearance.position || 'bottom-right',
                            size: appearance.size || 'medium',
                            margin: {
                                x: appearance.margin?.x || 24,
                                y: appearance.margin?.y || 24
                            },
                            showOnMobile: appearance.showOnMobile ?? true
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching WhatsApp settings:', error);
            toast.error('Ayarlar yüklenirken bir hata oluştu');
        }
    };

    const handleToggle = async () => {
        try {
            const { error } = await supabase
                .from('modules')
                .update({ is_active: !isActive })
                .eq('id', 'whatsapp');

            if (error) throw error;

            setIsActive(!isActive);
            toast.success(`WhatsApp modülü ${!isActive ? 'aktif edildi' : 'devre dışı bırakıldı'}`);
        } catch (error) {
            console.error('Error toggling module:', error);
            toast.error('Modül durumu güncellenirken bir hata oluştu');
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setSettings(prev => ({ ...prev, number: formatted }));
    };

    const isValidPhone = (phone: string) => {
        const digits = phone.replace(/[^\d]/g, '');
        return digits.length === 10;
    };

    const handleSave = async () => {
        if (!isValidPhone(settings.number)) {
            toast.error('Lütfen geçerli bir telefon numarası girin');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('modules')
                .update({
                    settings: {
                        whatsapp: {
                            number: toWhatsAppFormat(settings.number),
                            message: settings.message,
                            appearance: settings.appearance
                        }
                    }
                })
                .eq('id', 'whatsapp');

            if (error) throw error;
            toast.success('WhatsApp ayarları kaydedildi');
        } catch (error) {
            console.error('Error saving WhatsApp settings:', error);
            toast.error('Ayarlar kaydedilirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
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
                            WhatsApp Ayarları
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            WhatsApp modülü için gerekli ayarları yapılandırın
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleToggle}
                    className={`
                        shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none
                        ${isActive ? 'bg-green-500' : 'bg-gray-200'}
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
                    {/* WhatsApp Settings */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">İletişim Ayarları</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                WhatsApp Numarası
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                                    +90
                                </span>
                                <input
                                    type="tel"
                                    value={settings.number}
                                    onChange={handlePhoneChange}
                                    maxLength={14}
                                    className={`
                                        pl-12 pr-4 py-2.5 w-full rounded-xl border transition-all outline-none
                                        ${!settings.number || isValidPhone(settings.number)
                                            ? 'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                                            : 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                        }
                                    `}
                                    placeholder="5XX XXX XX XX"
                                />
                            </div>
                            <p className={`mt-2 text-sm ${!settings.number || isValidPhone(settings.number) ? 'text-gray-500' : 'text-red-500'}`}>
                                {!settings.number || isValidPhone(settings.number)
                                    ? 'Müşterilerinizin size ulaşacağı WhatsApp numarası'
                                    : 'Geçerli bir telefon numarası girin (5XX XXX XX XX)'
                                }
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Varsayılan Mesaj
                            </label>
                            <textarea
                                value={settings.message}
                                onChange={(e) => setSettings(prev => ({ ...prev, message: e.target.value }))}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                rows={3}
                                placeholder="Müşterilerinizin size göndereceği varsayılan mesaj"
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                Müşterileriniz WhatsApp'ta sohbeti başlattığında otomatik olarak bu mesaj yazılacak
                            </p>
                        </div>
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
                                                appearance: { ...prev.appearance, position: pos.value as Position }
                                            }))}
                                            className={`
                                                p-3 border rounded-xl flex items-center justify-center text-sm font-medium
                                                ${settings.appearance.position === pos.value
                                                    ? 'border-green-500 bg-green-50 text-green-700'
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
                                                appearance: { ...prev.appearance, size: size.value as Size }
                                            }))}
                                            className={`
                                                px-4 py-2 border rounded-xl flex items-center justify-center text-sm font-medium flex-1
                                                ${settings.appearance.size === size.value
                                                    ? 'border-green-500 bg-green-50 text-green-700'
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
                                                value={settings.appearance.margin.x}
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
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700 w-12">
                                                {settings.appearance.margin.x}px
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
                                                value={settings.appearance.margin.y}
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
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700 w-12">
                                                {settings.appearance.margin.y}px
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Visibility */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700">Mobil Görünüm</h4>
                                    <p className="text-sm text-gray-500">Mobil cihazlarda WhatsApp butonunu göster</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSettings(prev => ({
                                        ...prev,
                                        appearance: { ...prev.appearance, showOnMobile: !prev.appearance.showOnMobile }
                                    }))}
                                    className={`
                                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none
                                        ${settings.appearance.showOnMobile ? 'bg-green-500' : 'bg-gray-200'}
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
                                style={{ padding: `${settings.appearance.margin.y}px ${settings.appearance.margin.x}px` }}
                            >
                                <div className={`
                                    flex items-center justify-center rounded-full bg-green-500 text-white cursor-pointer
                                    ${settings.appearance.size === 'small' ? 'w-10 h-10' : ''}
                                    ${settings.appearance.size === 'medium' ? 'w-12 h-12' : ''}
                                    ${settings.appearance.size === 'large' ? 'w-14 h-14' : ''}
                                `}>
                                    <FaWhatsapp className={`
                                        ${settings.appearance.size === 'small' ? 'w-5 h-5' : ''}
                                        ${settings.appearance.size === 'medium' ? 'w-6 h-6' : ''}
                                        ${settings.appearance.size === 'large' ? 'w-7 h-7' : ''}
                                    `} />
                                </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                                Sitenizin önizlemesi
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center space-x-2 text-sm">
                                <FaWhatsapp className="w-5 h-5 text-green-500" />
                                <span className="text-gray-600">
                                    {settings.number ? `+90 ${settings.number}` : 'Numara belirtilmedi'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">
                                {settings.message || 'Varsayılan mesaj belirtilmedi'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={loading || !isValidPhone(settings.number)}
                        className={`
                            px-4 py-2 rounded-xl bg-green-500 text-white font-medium 
                            hover:bg-green-600 transition-colors
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