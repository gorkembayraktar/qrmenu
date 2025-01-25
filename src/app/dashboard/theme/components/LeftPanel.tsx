import React from 'react';
import { FiSave, FiChevronLeft, FiChevronRight, FiLayout, FiEye, FiDroplet, FiType, FiGrid, FiImage, FiUpload, FiTrash2 } from 'react-icons/fi';
import { ThemeSettings } from '@/app/dashboard/theme/types';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
                setSettings((prevSettings: ThemeSettings) => ({
                    ...prevSettings,
                    logo_url: settingsMap.logo_url || '',
                    favicon_url: settingsMap.favicon_url || '',
                    site_title: settingsMap.restaurant_name || '',
                    tagline: settingsMap.restaurant_slogan || ''
                }));

            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };

        fetchSettings();
    }, []);

    const handleFileUpload = async (file: File, type: 'logo' | 'favicon') => {
        try {
            setIsUploading(true);

            // Create form data
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', type === 'logo' ? 'logo_preset' : 'favicon_preset');

            // Add transformation parameters
            if (type === 'logo') {
                formData.append('transformation', JSON.stringify({
                    width: 200,
                    height: 60,
                    crop: 'fit',
                    format: 'png',
                    quality: 'auto:best',
                    background: 'transparent'
                }));
            } else {
                formData.append('transformation', JSON.stringify({
                    width: 32,
                    height: 32,
                    crop: 'fill',
                    format: 'png',
                    quality: 'auto:best'
                }));
            }

            // Upload to Cloudinary via our API route
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            const imageUrl = data.url;

            // Update settings table
            const { error: updateError } = await supabase
                .from('settings')
                .update({ value: imageUrl })
                .eq('name', type === 'logo' ? 'logo_url' : 'favicon_url');

            if (updateError) throw updateError;

            // Update local state
            setSettings({
                ...settings,
                [type === 'logo' ? 'logo_url' : 'favicon_url']: imageUrl
            });

            // Reload iframe
            if (iframeRef.current) {
                iframeRef.current.src = `/?preview=true&theme=${settings.template}`;
            }

        } catch (error) {
            console.error('Error uploading file:', error);
            // TODO: Show error message to user
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileDelete = async (type: 'logo' | 'favicon') => {
        try {
            setIsUploading(true);

            // Update settings table
            await supabase
                .from('settings')
                .update({ value: '' })
                .eq('name', `${type}_url`);

            // Update local state
            setSettings({
                ...settings,
                [type === 'logo' ? 'logo_url' : 'favicon_url']: ''
            });

            // Reload iframe
            if (iframeRef.current) {
                iframeRef.current.src = `/?preview=true&theme=${settings.template}`;
            }

        } catch (error) {
            console.error('Error deleting file:', error);
            // TODO: Show error message to user
        } finally {
            setIsUploading(false);
        }
    };

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'site-identity':
                return (
                    <div className="space-y-6">
                        {/* Logo Section */}
                        <div>
                            <h3 className="text-sm font-medium mb-2">Logo</h3>
                            <p className="text-xs text-gray-400 mb-4">Önerilen boyut: 200x60 piksel</p>
                            {settings.logo_url ? (
                                <div className="space-y-3">
                                    <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                                        <img
                                            src={settings.logo_url}
                                            alt="Site Logo"
                                            className="max-h-16 max-w-full object-contain"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleFileDelete('logo')}
                                            disabled={isUploading}
                                            className="text-xs px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded flex items-center gap-1.5 disabled:opacity-50"
                                        >
                                            <FiTrash2 className="w-3.5 h-3.5" />
                                            Kaldır
                                        </button>
                                        <label className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer flex items-center gap-1.5 disabled:opacity-50">
                                            <FiUpload className="w-3.5 h-3.5" />
                                            {isUploading ? 'Yükleniyor...' : 'Logo değiştir'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                disabled={isUploading}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        handleFileUpload(file, 'logo');
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <label className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer flex items-center gap-1.5 w-fit disabled:opacity-50">
                                    <FiUpload className="w-3.5 h-3.5" />
                                    {isUploading ? 'Yükleniyor...' : 'Logo seç'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={isUploading}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                handleFileUpload(file, 'logo');
                                            }
                                        }}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Favicon Section */}
                        <div>
                            <h3 className="text-sm font-medium mb-2">Favicon</h3>
                            <p className="text-xs text-gray-400 mb-4">Önerilen boyut: 32x32 piksel</p>
                            {settings.favicon_url ? (
                                <div className="space-y-3">
                                    <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                                        <img
                                            src={settings.favicon_url}
                                            alt="Site Favicon"
                                            className="w-8 h-8 object-contain"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleFileDelete('favicon')}
                                            disabled={isUploading}
                                            className="text-xs px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded flex items-center gap-1.5 disabled:opacity-50"
                                        >
                                            <FiTrash2 className="w-3.5 h-3.5" />
                                            Kaldır
                                        </button>
                                        <label className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer flex items-center gap-1.5 disabled:opacity-50">
                                            <FiUpload className="w-3.5 h-3.5" />
                                            {isUploading ? 'Yükleniyor...' : 'Favicon değiştir'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                disabled={isUploading}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        handleFileUpload(file, 'favicon');
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <label className="text-xs px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer flex items-center gap-1.5 w-fit disabled:opacity-50">
                                    <FiUpload className="w-3.5 h-3.5" />
                                    {isUploading ? 'Yükleniyor...' : 'Favicon seç'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={isUploading}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                handleFileUpload(file, 'favicon');
                                            }
                                        }}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Site Title */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Site başlığı
                            </label>
                            <input
                                type="text"
                                value={settings.site_title || ''}
                                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-700 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                placeholder="Sitenizin adı"
                            />
                        </div>

                        {/* Slogan */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Slogan
                            </label>
                            <input
                                type="text"
                                value={settings.tagline || ''}
                                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                                className="w-full px-3 py-2 bg-gray-700 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                placeholder="Kısa bir açıklama"
                            />
                        </div>

                        {/* Show Title and Tagline Toggle */}
                        <div>
                            <label className="flex items-center justify-between mb-2">
                                <span className="text-sm">Site başlığı ve sloganını göster</span>
                                <div className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-gray-700"
                                    onClick={() => setSettings({
                                        ...settings,
                                        show_title_tagline: !settings.show_title_tagline
                                    })}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.show_title_tagline ? 'translate-x-4' : 'translate-x-0'}`}
                                    />
                                </div>
                            </label>
                            <p className="text-xs text-gray-400">Logo varsa başlık yerine logoyu göster</p>
                        </div>
                    </div>
                );
            case 'template':
                return (
                    <div className="space-y-2">
                        {['elegance', 'modern-feast', 'classic-bistro'].map((template) => (
                            <button
                                key={template}
                                onClick={() => setSettings({ ...settings, template: template as ThemeSettings['template'] })}
                                className={`w-full p-3 text-left text-sm rounded ${settings.template === template ? 'bg-blue-500' : 'hover:bg-[#3c434a]'}`}
                            >
                                {template === 'elegance' ? 'Elegance (v1)' :
                                    template === 'modern-feast' ? 'Modern Feast (v2)' :
                                        'Classic Bistro (v3)'}
                            </button>
                        ))}
                    </div>
                );
            case 'appearance':
                return (
                    <div className="space-y-4">
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
                    </div>
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
                                            className="w-full p-4 flex items-center justify-between hover:bg-[#32373c] transition-colors border-b border-[#32373c]"
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
