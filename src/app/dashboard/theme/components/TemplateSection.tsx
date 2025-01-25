import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { ThemeSettings } from '../types';
import { themeOptions } from '@/mockdata/theme';

interface TemplateSectionProps {
    settings: ThemeSettings;
    setSettings: (settings: ThemeSettings) => void;
}


export default function TemplateSection({ settings, setSettings }: TemplateSectionProps) {
    return (
        <div className="space-y-4">
            {themeOptions.map((theme) => (
                <button
                    key={theme.id}
                    onClick={() => setSettings({ ...settings, template: theme.id })}
                    className={`w-full overflow-hidden rounded-lg transition-all duration-200 ${settings.template === theme.id
                        ? 'bg-blue-500 shadow-lg shadow-blue-500/20'
                        : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                >
                    {theme.image_src ? (
                        <div className="w-full h-32 bg-gray-900">
                            <img
                                src={theme.image_src}
                                alt={theme.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML = `
                                        <div class="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                            <svg class="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span class="text-sm">Görsel yüklenemedi</span>
                                        </div>
                                    `;
                                }}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-32 bg-gray-900 flex flex-col items-center justify-center text-gray-400">
                            <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">Önizleme mevcut değil</span>
                        </div>
                    )}
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col items-start gap-1">
                                <span className="font-medium">{theme.title}</span>
                                <span className={`text-xs ${settings.template === theme.id ? 'text-blue-200' : 'text-gray-400'
                                    }`}>
                                    {theme.description}
                                </span>
                            </div>
                            {settings.template === theme.id && (
                                <div className="bg-white/20 rounded-full p-1">
                                    <FiCheck className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
} 