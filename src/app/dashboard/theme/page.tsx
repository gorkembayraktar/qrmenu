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
    appearance: {
        useLogo: true,
        hero: {
            type: 'image',
            overlay_enabled: true,
            height: 'medium',
            content_alignment: 'center',
            image_url: '',
            use_default_image: true,
            image_url_default: '/images/hero.jpg',
            video_url: ''
        }
    },
    show_title_tagline: true,
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
    const iframeRef = useRef<HTMLIFrameElement>(null);

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
            // Fetch theme settings
            const { data: themeData, error: themeError } = await supabase
                .from('settings')
                .select('value')
                .eq('name', 'theme_settings')
                .single();

            if (themeError && themeError.code !== 'PGRST116') throw themeError;

            // Fetch other settings
            const { data: otherData, error: otherError } = await supabase
                .from('settings')
                .select('name, value')
                .in('name', ['logo_url', 'favicon_url', 'restaurant_name', 'restaurant_slogan']);

            if (otherError) throw otherError;

            // Create settings object from other settings
            const settingsMap = otherData.reduce((acc, item) => {
                acc[item.name] = item.value;
                return acc;
            }, {} as Record<string, string>);

            // Merge theme settings with other settings
            if (themeData?.value) {
                const savedThemeSettings = JSON.parse(themeData.value);
                setSettings({
                    ...defaultTheme,
                    ...savedThemeSettings,
                    logo_url: settingsMap.logo_url || savedThemeSettings.logo_url || '',
                    favicon_url: settingsMap.favicon_url || savedThemeSettings.favicon_url || '',
                    site_title: settingsMap.restaurant_name || savedThemeSettings.site_title || '',
                    tagline: settingsMap.restaurant_slogan || savedThemeSettings.tagline || '',
                    appearance: {
                        ...defaultTheme.appearance,
                        ...savedThemeSettings.appearance,
                        hero: {
                            ...defaultTheme.appearance.hero,
                            ...savedThemeSettings.appearance?.hero
                        }
                    }
                });
            } else {
                // If no theme settings exist, create with defaults
                await supabase
                    .from('settings')
                    .insert({
                        name: 'theme_settings',
                        value: JSON.stringify(defaultTheme)
                    });

                setSettings({
                    ...defaultTheme,
                    logo_url: settingsMap.logo_url || '',
                    favicon_url: settingsMap.favicon_url || '',
                    site_title: settingsMap.restaurant_name || '',
                    tagline: settingsMap.restaurant_slogan || ''
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
            // Save theme settings
            const { error: themeError } = await supabase
                .from('settings')
                .update({ value: JSON.stringify(settings) })
                .eq('name', 'theme_settings');

            if (themeError) {
                console.error('Error saving theme settings:', themeError);
                throw themeError;
            }

            // Update site title and tagline
            const promises = [
                supabase
                    .from('settings')
                    .update({ value: settings.site_title || '' })
                    .eq('name', 'restaurant_name'),
                supabase
                    .from('settings')
                    .update({ value: settings.tagline || '' })
                    .eq('name', 'restaurant_slogan')
            ];

            const results = await Promise.all(promises);
            const errors = results.filter(result => result.error);

            if (errors.length > 0) {
                console.error('Error saving settings:', errors);
                throw errors[0].error;
            }

            toast.success('Değişiklikler başarıyla kaydedildi');

            // Reload the iframe
            if (iframeRef.current) {
                iframeRef.current.src = `/?preview=true&theme=${settings.template}`;
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Değişiklikler kaydedilirken bir hata oluştu');
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
                iframeRef={iframeRef}
            />

            {/* Toggle Panel Button (Mobile) */}
            <button
                onClick={() => setIsPanelOpen(true)}
                className={`fixed left-4 top-4 z-30 lg:hidden bg-white p-2 rounded-lg shadow-lg ${isPanelOpen ? 'hidden' : 'block'}`}
            >
                <FiChevronRight className="w-5 h-5" />
            </button>

            <RightPanel
                ref={iframeRef}
                settings={settings}
                isPanelOpen={isPanelOpen}
            />

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