"use client";

import { useState } from 'react';
import { FiMessageSquare, FiShare2, FiLock, FiCheck, FiX } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import { supabase } from '@/utils/supabase';
import toast from 'react-hot-toast';

interface Module {
    id: string;
    title: string;
    description: string;
    icon: any;
    isActive: boolean;
    isPro: boolean;
    settings?: {
        whatsapp?: {
            number: string;
            message: string;
        };
        social?: {
            instagram: string;
            facebook: string;
            twitter: string;
        };
    };
}

const modules: Module[] = [
    {
        id: 'whatsapp',
        title: 'WhatsApp Modülü',
        description: 'Müşterilerinizin tek tıkla size WhatsApp üzerinden ulaşmasını sağlayın.',
        icon: FaWhatsapp,
        isActive: false,
        isPro: false,
        settings: {
            whatsapp: {
                number: '',
                message: 'Merhaba, menünüz hakkında bilgi almak istiyorum.'
            }
        }
    },
    {
        id: 'social',
        title: 'Sosyal Medya Modülü',
        description: 'Sosyal medya hesaplarınızı menünüze ekleyin ve takipçi sayınızı artırın.',
        icon: FiShare2,
        isActive: false,
        isPro: false,
        settings: {
            social: {
                instagram: '',
                facebook: '',
                twitter: ''
            }
        }
    }
];

function ModuleCard({ module, onToggle, onConfigure }: {
    module: Module;
    onToggle: (id: string) => void;
    onConfigure: (module: Module) => void;
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${module.id === 'whatsapp'
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-white'
                            }`}>
                            <module.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                                {module.isPro && (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                        PRO
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{module.description}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onToggle(module.id)}
                        className={`shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none
                            ${module.isActive ? 'bg-green-500' : 'bg-gray-200'}
                            ${module.isPro ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                        `}
                        disabled={module.isPro}
                    >
                        <span className={`
                            inline-block h-5 w-5 transform rounded-full bg-white transition-transform
                            ${module.isActive ? 'translate-x-6' : 'translate-x-1'}
                            shadow-sm
                        `} />
                    </button>
                </div>
                {module.isActive && !module.isPro && (
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={() => onConfigure(module)}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                            <span>Ayarları Düzenle</span>
                        </button>
                    </div>
                )}
                {module.isPro && (
                    <div className="mt-4 flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-100">
                        <div className="flex items-center space-x-2">
                            <FiLock className="h-4 w-4 text-amber-500" />
                            <p className="text-sm font-medium text-amber-800">
                                Bu modül PRO pakette kullanılabilir
                            </p>
                        </div>
                        <button className="px-3 py-1 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-100 transition-colors">
                            Yükselt
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ModulesPage() {
    const [activeModules, setActiveModules] = useState<Module[]>(modules);
    const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
    const [whatsappSettings, setWhatsappSettings] = useState({
        number: '',
        message: 'Merhaba, menünüz hakkında bilgi almak istiyorum.'
    });

    const handleToggle = (id: string) => {
        setActiveModules(prev => prev.map(module =>
            module.id === id ? { ...module, isActive: !module.isActive } : module
        ));
    };

    const handleConfigure = (module: Module) => {
        if (module.id === 'whatsapp') {
            setWhatsappSettings(module.settings?.whatsapp || whatsappSettings);
            setShowWhatsAppModal(true);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Modüller
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    Menünüzü özelleştirmek için modülleri aktif edin ve yapılandırın
                </p>
            </div>

            {/* Modules Grid */}
            <div className="grid gap-6">
                {activeModules.map(module => (
                    <ModuleCard
                        key={module.id}
                        module={module}
                        onToggle={handleToggle}
                        onConfigure={handleConfigure}
                    />
                ))}
            </div>

            {/* WhatsApp Settings Modal */}
            {showWhatsAppModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center space-x-2">
                                <FaWhatsapp className="h-5 w-5 text-green-500" />
                                <h2 className="text-lg font-semibold text-gray-900">
                                    WhatsApp Ayarları
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowWhatsAppModal(false)}
                                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
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
                                        value={whatsappSettings.number}
                                        onChange={(e) => setWhatsappSettings(prev => ({ ...prev, number: e.target.value }))}
                                        className="pl-12 pr-4 py-2.5 w-full rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                        placeholder="5XX XXX XX XX"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Varsayılan Mesaj
                                </label>
                                <textarea
                                    value={whatsappSettings.message}
                                    onChange={(e) => setWhatsappSettings(prev => ({ ...prev, message: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                                    rows={3}
                                    placeholder="Müşterilerinizin size göndereceği varsayılan mesaj"
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex justify-end space-x-3">
                            <button
                                onClick={() => setShowWhatsAppModal(false)}
                                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={() => {
                                    // Save settings
                                    setActiveModules(prev => prev.map(module =>
                                        module.id === 'whatsapp'
                                            ? {
                                                ...module,
                                                settings: {
                                                    ...module.settings,
                                                    whatsapp: whatsappSettings
                                                }
                                            }
                                            : module
                                    ));
                                    setShowWhatsAppModal(false);
                                    toast.success('WhatsApp ayarları kaydedildi');
                                }}
                                className="px-4 py-2 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 