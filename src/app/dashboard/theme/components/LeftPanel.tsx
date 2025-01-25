import React from 'react';
import { FiSave, FiChevronLeft, FiChevronRight, FiLayout, FiEye, FiDroplet, FiType, FiGrid, FiImage } from 'react-icons/fi';
import { ThemeSettings } from '@/app/dashboard/theme/types';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
import TemplateSection from './TemplateSection';
import SiteIdentitySection from './SiteIdentitySection';
import AppearanceSection from './AppearanceSection';

interface LeftPanelProps {
    settings: ThemeSettings;
    setSettings: (settings: ThemeSettings) => void;
    isSaving: boolean;
    handleSave: () => void;
    isPanelOpen: boolean;
    setIsPanelOpen: (isOpen: boolean) => void;
    router: any;
    iframeRef: React.RefObject<HTMLIFrameElement>;
}

interface SettingSection {
    id: string;
    title: string;
    icon: React.ReactElement;
}

export default function LeftPanel({
    settings,
    setSettings,
    isSaving,
    handleSave,
    isPanelOpen,
    setIsPanelOpen,
    router,
    iframeRef
}: LeftPanelProps) {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const supabase = createClientComponentClient();

    const sections: SettingSection[] = [
        {
            id: 'template',
            title: 'Tema',
            icon: <FiLayout className="w-5 h-5" />
        },
        {
            id: 'site-identity',
            title: 'Site Kimliği',
            icon: <FiImage className="w-5 h-5" />
        },
        {
            id: 'appearance',
            title: 'Görünüm',
            icon: <FiEye className="w-5 h-5" />
        },
        {
            id: 'colors',
            title: 'Renkler',
            icon: <FiDroplet className="w-5 h-5" />
        },
        {
            id: 'typography',
            title: 'Tipografi',
            icon: <FiType className="w-5 h-5" />
        },
        {
            id: 'layout',
            title: 'Düzen',
            icon: <FiGrid className="w-5 h-5" />
        }
    ];

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Fetch all required settings
                const { data, error } = await supabase
                    .from('settings')
                    .select('name, value')
                    .in('name', ['logo_url', 'favicon_url', 'restaurant_name', 'restaurant_slogan']);

                if (error) {
                    console.error('Error fetching settings:', error);
                    return;
                }

                // Create settings object from results
                const settingsMap = data.reduce((acc, item) => {
                    acc[item.name] = item.value;
                    return acc;
                }, {} as Record<string, string>);

                // Update settings with fetched data
                setSettings({
                    ...settings,
                    logo_url: settingsMap.logo_url || settings.logo_url || '',
                    favicon_url: settingsMap.favicon_url || settings.favicon_url || '',
                    site_title: settingsMap.restaurant_name || settings.site_title || '',
                    tagline: settingsMap.restaurant_slogan || settings.tagline || ''
                });

            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };

        fetchSettings();
    }, []);

    const handleFileUpload = async (file: File, type: 'logo' | 'favicon' | 'hero') => {
        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', type === 'logo' ? 'logo_preset' : type === 'favicon' ? 'favicon_preset' : 'hero_preset');

            // Add transformation parameters
            if (type === 'logo') {
                formData.append('transformation', JSON.stringify({
                    width: 300,
                    height: 300,
                    crop: 'fit',
                    format: 'png',
                    quality: 'auto:best',
                    background: 'transparent'
                }));
            } else if (type === 'favicon') {
                formData.append('transformation', JSON.stringify({
                    width: 32,
                    height: 32,
                    crop: 'fit',
                    format: 'png',
                    quality: 'auto:best'
                }));
            } else {
                formData.append('transformation', JSON.stringify({
                    width: 1920,
                    height: 1080,
                    crop: 'fit',
                    format: 'png',
                    quality: 'auto:best'
                }));
            }

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Yükleme başarısız oldu');
            }

            const imageUrl = data.url;

            // Update settings
            if (type === 'hero') {
                setSettings({
                    ...settings,
                    appearance: {
                        ...settings.appearance,
                        hero: {
                            ...settings.appearance.hero,
                            image_url: imageUrl,
                            use_default_image: false
                        }
                    }
                });
            } else {
                setSettings({
                    ...settings,
                    [type === 'logo' ? 'logo_url' : 'favicon_url']: imageUrl
                });
            }

            // Show success message
            toast.success(`${type === 'logo' ? 'Logo' : type === 'favicon' ? 'Favicon' : 'Hero Görseli'} başarıyla yüklendi`);

            // Reload iframe
            if (iframeRef.current) {
                iframeRef.current.src = `/?preview=true&theme=${settings.template}`;
            }

        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(`${type === 'logo' ? 'Logo' : type === 'favicon' ? 'Favicon' : 'Hero Görseli'} yüklenirken bir hata oluştu`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileDelete = async (type: 'logo' | 'favicon' | 'hero') => {
        try {
            setIsUploading(true);

            if (type === 'hero') {
                setSettings({
                    ...settings,
                    appearance: {
                        ...settings.appearance,
                        hero: {
                            ...settings.appearance.hero,
                            image_url: '',
                            use_default_image: true
                        }
                    }
                });
            } else {
                setSettings({
                    ...settings,
                    [type === 'logo' ? 'logo_url' : 'favicon_url']: ''
                });
            }

            // Show success message
            toast.success(`${type === 'logo' ? 'Logo' : type === 'favicon' ? 'Favicon' : 'Hero Görseli'} başarıyla kaldırıldı`);

            // Reload iframe
            if (iframeRef.current) {
                iframeRef.current.src = `/?preview=true&theme=${settings.template}`;
            }

        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error(`${type === 'logo' ? 'Logo' : type === 'favicon' ? 'Favicon' : 'Hero Görseli'} kaldırılırken bir hata oluştu`);
        } finally {
            setIsUploading(false);
        }
    };

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'template':
                return <TemplateSection settings={settings} setSettings={setSettings} />;
            case 'site-identity':
                return (
                    <SiteIdentitySection
                        settings={settings}
                        setSettings={setSettings}
                        isUploading={isUploading}
                        handleFileUpload={handleFileUpload}
                        handleFileDelete={handleFileDelete}
                    />
                );
            case 'appearance':
                return (
                    <AppearanceSection
                        settings={settings}
                        setSettings={setSettings}
                        isUploading={isUploading}
                        handleFileUpload={handleFileUpload}
                        handleFileDelete={handleFileDelete}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className={`fixed left-0 top-0 h-full bg-[#23282d] text-gray-100 shadow-lg transition-transform duration-300 z-20 w-[300px] 
            ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    {/* Panel Header */}
                    <div className="bg-[#1e1e1e] p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {activeSection ? (
                                <button
                                    onClick={() => setActiveSection(null)}
                                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                >
                                    <FiChevronLeft className="w-5 h-5" />
                                </button>
                            ) : null}
                            <h2 className="text-sm font-medium">
                                {activeSection ? sections.find(s => s.id === activeSection)?.title : 'Tema Özelleştirme'}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
                            >
                                {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Yayınla'}
                            </button>
                            {!activeSection && (
                                <button
                                    onClick={() => setIsPanelOpen(false)}
                                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                >
                                    <FiChevronLeft className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {activeSection ? (
                                <motion.div
                                    key="section-content"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="p-4"
                                >
                                    {renderSectionContent()}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="section-list"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {sections.map((section, index) => (
                                        <motion.button
                                            key={section.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`${section.id == 'template' ? 'my-5' : ''} w-full p-4 flex items-center justify-between hover:bg-[#32373c] transition-colors border-b border-[#32373c]`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {section.icon}
                                                <div className="flex flex-col items-start px-2 py-1">
                                                    <span className="text-sm">{section.title}</span>
                                                    {section.id === 'template' && <span className="text-xs text-white block">{settings.template}</span>}
                                                </div>
                                            </div>
                                            <FiChevronRight className="w-5 h-5" />
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="bg-[#1e1e1e] p-3 flex justify-between items-center">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-xs hover:underline transition-colors"
                        >
                            Çıkış
                        </button>
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsPanelOpen(true)}
                className={`fixed left-0 top-1/2 -translate-y-1/2 bg-[#23282d] text-gray-100 p-2 rounded-r shadow-lg transition-transform duration-300 z-20
            ${isPanelOpen ? 'translate-x-[-100%]' : 'translate-x-0'}`}
            >
                <FiChevronRight className="w-5 h-5" />
            </button>
        </>
    );
}
