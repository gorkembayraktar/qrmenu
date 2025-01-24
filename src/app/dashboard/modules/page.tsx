"use client";

import { useEffect, useState } from 'react';
import { FiMessageSquare, FiShare2, FiLock, FiWifi } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { supabase } from '@/utils/supabase';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Module {
    id: string;
    title: string;
    description: string;
    icon: string;
    is_active: boolean;
    is_pro: boolean;
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

const iconMap: { [key: string]: any } = {
    FaWhatsapp,
    FiShare2,
    FiWifi
};

function ModuleCard({ module }: { module: Module }) {
    const Icon = iconMap[module.icon];

    const handleToggle = async () => {
        try {
            const { error } = await supabase
                .from('modules')
                .update({ is_active: !module.is_active })
                .eq('id', module.id);

            if (error) throw error;

            toast.success(`${module.title} ${!module.is_active ? 'aktif edildi' : 'devre dışı bırakıldı'}`);
            window.location.reload();
        } catch (error) {
            console.error('Error toggling module:', error);
            toast.error('Modül durumu güncellenirken bir hata oluştu');
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${module.id === 'whatsapp'
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-white'
                            }`}>
                            <Icon className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                                {module.is_pro && (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                        PRO
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{module.description}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleToggle}
                        className={`shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none
                            ${module.is_active ? 'bg-green-500' : 'bg-gray-200'}
                            ${module.is_pro ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                        `}
                        disabled={module.is_pro}
                    >
                        <span className={`
                            inline-block h-5 w-5 transform rounded-full bg-white transition-transform
                            ${module.is_active ? 'translate-x-6' : 'translate-x-1'}
                            shadow-sm
                        `} />
                    </button>
                </div>
                {module.is_active && !module.is_pro && (
                    <div className="mt-6 flex justify-end">
                        <Link
                            href={`/dashboard/modules/${module.id}`}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                            <span>Ayarları Düzenle</span>
                        </Link>
                    </div>
                )}
                {module.is_pro && (
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
    const [modules, setModules] = useState<Module[]>([]);

    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const { data, error } = await supabase
                .from('modules')
                .select('*');

            if (error) throw error;
            setModules(data || []);
        } catch (error) {
            console.error('Error fetching modules:', error);
            toast.error('Modüller yüklenirken bir hata oluştu');
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
                {modules.map(module => (
                    <ModuleCard
                        key={module.id}
                        module={module}
                    />
                ))}
            </div>
        </div>
    );
} 