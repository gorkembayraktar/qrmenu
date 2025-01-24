"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { FaWhatsapp } from 'react-icons/fa';
import { FiWifi } from 'react-icons/fi';
import { QRCodeSVG } from 'qrcode.react';

interface ModuleAppearance {
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    size: 'small' | 'medium' | 'large';
    margin: number;
    showOnMobile: boolean;
    stackOrder: number;
}

interface ModuleData {
    appearance: ModuleAppearance;
    [key: string]: any;
}

interface ModuleSettings {
    whatsapp?: ModuleData;
    wifi?: ModuleData;
}

interface Module {
    id: 'whatsapp' | 'wifi';
    settings: ModuleSettings;
    is_active: boolean;
}

type PositionKey = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';

function WhatsAppButton({ settings }: { settings: ModuleData }) {
    const handleClick = () => {
        const url = `https://wa.me/${settings.number}?text=${encodeURIComponent(settings.message)}`;
        window.open(url, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className={`
                flex items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:shadow-xl transition-all duration-300
                ${settings.appearance.size === 'small' ? 'w-10 h-10' : ''}
                ${settings.appearance.size === 'medium' ? 'w-12 h-12' : ''}
                ${settings.appearance.size === 'large' ? 'w-14 h-14' : ''}
            `}
        >
            <FaWhatsapp className={`
                ${settings.appearance.size === 'small' ? 'w-5 h-5' : ''}
                ${settings.appearance.size === 'medium' ? 'w-6 h-6' : ''}
                ${settings.appearance.size === 'large' ? 'w-7 h-7' : ''}
            `} />
        </button>
    );
}

function WifiButton({ settings }: { settings: ModuleData }) {
    const [isOpen, setIsOpen] = useState(false);

    const getWifiQRString = () => {
        const security = settings.security === 'nopass' ? 'nopass' : settings.security;
        return `WIFI:T:${security};S:${settings.ssid};${settings.security !== 'nopass' ? `P:${settings.password};` : ''}H:false;;`;
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`
                    flex items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300
                    ${settings.appearance.size === 'small' ? 'w-10 h-10' : ''}
                    ${settings.appearance.size === 'medium' ? 'w-12 h-12' : ''}
                    ${settings.appearance.size === 'large' ? 'w-14 h-14' : ''}
                `}
            >
                <FiWifi className={`
                    ${settings.appearance.size === 'small' ? 'w-5 h-5' : ''}
                    ${settings.appearance.size === 'medium' ? 'w-6 h-6' : ''}
                    ${settings.appearance.size === 'large' ? 'w-7 h-7' : ''}
                `} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[99999]" onClick={() => setIsOpen(false)}>
                    <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
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
                    </div>
                </div>
            )}
        </>
    );
}

export default function ModuleStack() {
    const [modules, setModules] = useState<Module[]>([]);
    const [stackedModules, setStackedModules] = useState<{
        [K in PositionKey]: Module[];
    }>({
        'bottom-left': [],
        'bottom-right': [],
        'top-left': [],
        'top-right': [],
    });

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const { data, error } = await supabase
                .from('modules')
                .select('*')
                .eq('is_active', true)
                .in('id', ['whatsapp', 'wifi']);

            if (error) throw error;
            if (data) {
                setModules(data as Module[]);
                organizeModules(data as Module[]);
            }
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    };

    const organizeModules = (modules: Module[]) => {
        const organized: { [K in PositionKey]: Module[] } = {
            'bottom-left': [],
            'bottom-right': [],
            'top-left': [],
            'top-right': [],
        };

        modules.forEach(module => {
            const moduleData = module.settings[module.id];
            if (moduleData?.appearance?.position) {
                organized[moduleData.appearance.position].push(module);
            }
        });

        // Sort modules by stack order in each position
        (Object.keys(organized) as PositionKey[]).forEach(position => {
            organized[position].sort((a: Module, b: Module) => {
                const aOrder = a.settings[a.id]?.appearance?.stackOrder || 0;
                const bOrder = b.settings[b.id]?.appearance?.stackOrder || 0;
                return aOrder - bOrder;
            });
        });

        setStackedModules(organized);
    };

    const getPositionStyle = (position: PositionKey): string => {
        switch (position) {
            case 'bottom-left':
                return 'bottom-0 left-0';
            case 'bottom-right':
                return 'bottom-0 right-0';
            case 'top-left':
                return 'top-0 left-0';
            case 'top-right':
                return 'top-0 right-0';
        }
    };

    const renderModule = (module: Module) => {
        const moduleData = module.settings[module.id];
        if (!moduleData) return null;

        switch (module.id) {
            case 'whatsapp':
                return <WhatsAppButton settings={moduleData} />;
            case 'wifi':
                return <WifiButton settings={moduleData} />;
            default:
                return null;
        }
    };

    return (
        <>
            {(Object.entries(stackedModules) as [PositionKey, Module[]][]).map(([position, modules]) => (
                modules.length > 0 && (
                    <div
                        key={position}
                        className={`fixed z-[9999] p-4 flex flex-col gap-4 ${getPositionStyle(position)}`}
                    >
                        {modules.map((module, index) => {
                            const moduleData = module.settings[module.id];
                            if (!moduleData?.appearance) return null;

                            return (
                                <div
                                    key={module.id}
                                    style={{
                                        marginBottom: index < modules.length - 1 ? moduleData.appearance.margin : 0
                                    }}
                                >
                                    {renderModule(module)}
                                </div>
                            );
                        })}
                    </div>
                )
            ))}
        </>
    );
} 
