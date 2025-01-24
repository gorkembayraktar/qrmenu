"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { ThemeSettings } from './types';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

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
    const initialFetchDone = useRef(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user && !initialFetchDone.current) {
            initialFetchDone.current = true;
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
            <LeftPanel
                settings={settings}
                setSettings={setSettings}
                isSaving={isSaving}
                handleSave={handleSave}
                isPanelOpen={isPanelOpen}
                setIsPanelOpen={setIsPanelOpen}
                router={router}
            />

            {/* Toggle Panel Button (Mobile) */}
            <button
                onClick={() => setIsPanelOpen(true)}
                className={`fixed left-4 top-4 z-30 lg:hidden bg-white p-2 rounded-lg shadow-lg ${isPanelOpen ? 'hidden' : 'block'}`}
            >
                <FiChevronRight className="w-5 h-5" />
            </button>

            <RightPanel settings={settings} isPanelOpen={isPanelOpen} />

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