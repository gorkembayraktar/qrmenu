"use client";

import { useState, useEffect } from 'react';
import { FiSave, FiClock, FiAlertCircle, FiSun } from 'react-icons/fi';
import { supabase } from '@/utils/supabase';
import toast from 'react-hot-toast';

interface WorkingHours {
    day: number;
    is_open: boolean;
    open_time: string;
    close_time: string;
}

const DAYS = [
    'Pazartesi',
    'Salı',
    'Çarşamba',
    'Perşembe',
    'Cuma',
    'Cumartesi',
    'Pazar'
];

const DEFAULT_HOURS: WorkingHours[] = DAYS.map((_, index) => ({
    day: index,
    is_open: true,
    open_time: '09:00',
    close_time: '22:00'
}));

function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none
                ${checked ? 'bg-blue-600' : 'bg-gray-200'}
                focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
            `}
        >
            <span
                className={`
                    inline-block h-5 w-5 transform rounded-full bg-white transition-transform
                    ${checked ? 'translate-x-6' : 'translate-x-1'}
                    shadow-sm
                `}
            />
        </button>
    );
}

function TimeInput({ value, onChange, disabled = false }: {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}) {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiClock className="h-4 w-4 text-gray-400" />
            </div>
            <input
                type="time"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`pl-9 pr-3 py-2 w-24 sm:w-32 rounded-lg border border-gray-200 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all
                    disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed text-sm sm:text-base`}
            />
        </div>
    );
}

export default function WorkingHoursPage() {
    const [loading, setLoading] = useState(false);
    const [workingHours, setWorkingHours] = useState<WorkingHours[]>(DEFAULT_HOURS);

    useEffect(() => {
        loadWorkingHours();
    }, []);

    const loadWorkingHours = async () => {
        try {
            const { data, error } = await supabase
                .from('working_hours')
                .select('*')
                .order('day');

            if (error) throw error;

            if (data && data.length > 0) {
                setWorkingHours(data);
            }
        } catch (error) {
            console.error('Error loading working hours:', error);
            toast.error('Çalışma saatleri yüklenirken bir hata oluştu');
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const loadingToast = toast.loading('Çalışma saatleri kaydediliyor...');

        try {
            const { error } = await supabase
                .from('working_hours')
                .upsert(workingHours);

            if (error) throw error;

            toast.success('Çalışma saatleri başarıyla kaydedildi', {
                id: loadingToast
            });
        } catch (error) {
            console.error('Error saving working hours:', error);
            toast.error('Çalışma saatleri kaydedilirken bir hata oluştu', {
                id: loadingToast
            });
        } finally {
            setLoading(false);
        }
    };

    const updateHours = (index: number, updates: Partial<WorkingHours>) => {
        setWorkingHours(prev => prev.map((item, i) =>
            i === index ? { ...item, ...updates } : item
        ));
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
            {/* Page Header */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Çalışma Saatleri
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        İşletmenizin çalışma saatlerini buradan yönetebilirsiniz
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2.5 rounded-xl text-white font-medium space-x-2 
                        ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                        } transition-all shadow-lg shadow-blue-600/20`}
                >
                    <FiSave className="h-5 w-5" />
                    <span>{loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
                </button>
            </div>

            {/* Working Hours Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                        <div>
                            <h2 className="font-semibold text-gray-900">Haftalık Program</h2>
                            <p className="mt-1 text-sm text-gray-500">Her gün için açılış ve kapanış saatlerini ayarlayın</p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FiSun className="h-4 w-4" />
                            <span>Varsayılan: 09:00 - 22:00</span>
                        </div>
                    </div>
                </div>
                <div className="divide-y divide-gray-100">
                    {workingHours.map((hours, index) => (
                        <div
                            key={hours.day}
                            className={`p-4 sm:p-6 transition-colors ${hours.is_open
                                ? 'bg-white hover:bg-gray-50/50'
                                : 'bg-gray-50/50'
                                }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center justify-between sm:justify-start sm:space-x-6">
                                    <div className="w-24 sm:w-32">
                                        <span className="font-medium text-gray-900">{DAYS[hours.day]}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Toggle
                                            checked={hours.is_open}
                                            onChange={(checked) => updateHours(index, { is_open: checked })}
                                        />
                                        <span className={`text-sm ${hours.is_open ? 'text-green-600' : 'text-gray-500'}`}>
                                            {hours.is_open ? 'Açık' : 'Kapalı'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 sm:space-x-4 ml-auto sm:ml-0">
                                    <TimeInput
                                        value={hours.open_time}
                                        onChange={(value) => updateHours(index, { open_time: value })}
                                        disabled={!hours.is_open}
                                    />
                                    <span className="text-gray-400">-</span>
                                    <TimeInput
                                        value={hours.close_time}
                                        onChange={(value) => updateHours(index, { close_time: value })}
                                        disabled={!hours.is_open}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="px-4 sm:px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        Not: Kapalı günlerde çalışma saatleri devre dışı bırakılır ve menünüz bu günlerde ziyaretçilere kapalı olarak görünür.
                    </p>
                </div>
            </div>
        </div>
    );
} 