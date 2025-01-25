import React from 'react';
import { FiTrash2, FiUpload } from 'react-icons/fi';
import { ThemeSettings } from '../types';

interface SiteIdentitySectionProps {
    settings: ThemeSettings;
    setSettings: (settings: ThemeSettings) => void;
    isUploading: boolean;
    handleFileUpload: (file: File, type: 'logo' | 'favicon') => Promise<void>;
    handleFileDelete: (type: 'logo' | 'favicon') => Promise<void>;
}

export default function SiteIdentitySection({
    settings,
    setSettings,
    isUploading,
    handleFileUpload,
    handleFileDelete
}: SiteIdentitySectionProps) {
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
} 