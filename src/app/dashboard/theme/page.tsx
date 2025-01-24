"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { FiSave, FiEye, FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ThemeSettings {
    template: 'elegance' | 'modern-feast' | 'classic-bistro';
    primary_color: string;
    font_family: string;
    button_style: 'rounded' | 'square';
    layout_style: 'grid' | 'list';
    show_prices: boolean;
    show_descriptions: boolean;
    category_style: 'tabs' | 'dropdown' | 'sidebar';
    image_style: 'square' | 'rounded' | 'circle';
    animations_enabled: boolean;
}

const defaultTheme: ThemeSettings = {
    template: 'elegance',
    primary_color: '#4F46E5',
    font_family: 'inter',
    button_style: 'rounded',
    layout_style: 'grid',
    show_prices: true,
    show_descriptions: true,
    category_style: 'tabs',
    image_style: 'rounded',
    animations_enabled: true
};

export default function ThemeSettingsPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [settings, setSettings] = useState<ThemeSettings>(defaultTheme);
    const [isSaving, setIsSaving] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            fetchSettings();
        }
    }, [user]);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('value')
                .eq('name', 'theme_settings')
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            if (data?.value) {
                setSettings(JSON.parse(data.value) as ThemeSettings);
            } else {
                // Eğer tema ayarları yoksa, varsayılan temayı kaydet
                await supabase
                    .from('settings')
                    .insert({
                        name: 'theme_settings',
                        value: JSON.stringify(defaultTheme)
                    });
            }
        } catch (error) {
            console.error('Error fetching theme settings:', error);
            toast.error('Tema ayarları yüklenirken bir hata oluştu');
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('settings')
                .update({
                    value: JSON.stringify(settings),
                    updated_at: new Date().toISOString()
                })
                .eq('name', 'theme_settings');

            if (error) throw error;
            toast.success('Tema ayarları kaydedildi');
        } catch (error) {
            console.error('Error saving theme settings:', error);
            toast.error('Tema ayarları kaydedilirken bir hata oluştu');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-100">
            {/* Settings Panel */}
            <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-transform duration-300 z-20 w-[320px] 
                ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col relative">
                    {/* Panel Header */}
                    <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
                        <h2 className="text-lg font-semibold">Tema Ayarları</h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    router.push('/dashboard');
                                }}
                                className="flex items-center justify-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200"
                            >
                                Vazgeç
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center justify-center gap-1 bg-indigo-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                <FiSave className="w-4 h-4" />
                                {isSaving ? 'Kaydediliyor' : 'Kaydet'}
                            </button>
                            <button
                                onClick={() => setIsPanelOpen(false)}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <FiChevronLeft className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-6">
                            {/* Şablon Seçimi */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                <h3 className="text-base font-medium text-gray-900 mb-3">
                                    Şablon
                                </h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {/* Elegance */}
                                    <button
                                        onClick={() => setSettings({ ...settings, template: 'elegance' })}
                                        className={`flex flex-col items-center p-2 border rounded-lg transition-all
                                            ${settings.template === 'elegance'
                                                ? 'border-indigo-600 bg-indigo-50'
                                                : 'border-gray-200 hover:border-indigo-200'}`}
                                    >
                                        <span className={`text-sm font-medium ${settings.template === 'elegance' ? 'text-indigo-600' : 'text-gray-600'}`}>
                                            Elegance
                                        </span>
                                    </button>

                                    {/* Modern Feast */}
                                    <button
                                        onClick={() => setSettings({ ...settings, template: 'modern-feast' })}
                                        className={`flex flex-col items-center p-2 border rounded-lg transition-all
                                            ${settings.template === 'modern-feast'
                                                ? 'border-indigo-600 bg-indigo-50'
                                                : 'border-gray-200 hover:border-indigo-200'}`}
                                    >
                                        <span className={`text-sm font-medium ${settings.template === 'modern-feast' ? 'text-indigo-600' : 'text-gray-600'}`}>
                                            Modern Feast
                                        </span>
                                    </button>

                                    {/* Classic Bistro */}
                                    <button
                                        onClick={() => setSettings({ ...settings, template: 'classic-bistro' })}
                                        className={`flex flex-col items-center p-2 border rounded-lg transition-all
                                            ${settings.template === 'classic-bistro'
                                                ? 'border-indigo-600 bg-indigo-50'
                                                : 'border-gray-200 hover:border-indigo-200'}`}
                                    >
                                        <span className={`text-sm font-medium ${settings.template === 'classic-bistro' ? 'text-indigo-600' : 'text-gray-600'}`}>
                                            Classic Bistro
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toggle Panel Button (Mobile) */}
            <button
                onClick={() => setIsPanelOpen(true)}
                className={`fixed left-4 top-4 z-30 lg:hidden bg-white p-2 rounded-lg shadow-lg ${isPanelOpen ? 'hidden' : 'block'}`}
            >
                <FiChevronRight className="w-5 h-5" />
            </button>

            {/* Preview Area */}
            <div className={`fixed inset-0 lg:left-[320px] transition-all duration-300 ${isPanelOpen ? 'lg:left-[320px]' : 'left-0'}`}>
                <div className="h-full p-4 lg:p-6 overflow-auto">
                    <div className="bg-white h-full rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FiEye className="w-5 h-5" />
                            Canlı Önizleme
                        </h2>
                        <div className="w-full h-[calc(100%-3rem)] bg-gray-50 rounded-lg border border-gray-200">
                            {/* Önizleme içeriği buraya gelecek */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isPanelOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-10 lg:hidden"
                    onClick={() => setIsPanelOpen(false)}
                />
            )}
        </div>
    );
}