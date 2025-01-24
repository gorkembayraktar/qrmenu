"use client";

import { useState } from 'react';
import { FiBell, FiX, FiCheck, FiInfo } from 'react-icons/fi';

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

const notifications = [
    {
        id: 1,
        type: 'info',
        title: 'Yeni Sipariş',
        message: 'Masa 5 için yeni sipariş geldi',
        time: '2 dakika önce',
        isRead: false
    },
    {
        id: 2,
        type: 'success',
        title: 'Menü Güncellendi',
        message: 'Menü başarıyla güncellendi',
        time: '1 saat önce',
        isRead: false
    },
    {
        id: 3,
        type: 'info',
        title: 'Yeni Yorum',
        message: 'Menünüz için yeni bir yorum yapıldı',
        time: '2 saat önce',
        isRead: true
    }
];

export default function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <FiCheck className="h-4 w-4 text-green-500" />;
            case 'info':
                return <FiInfo className="h-4 w-4 text-blue-500" />;
            default:
                return null;
        }
    };

    return (
        <div className={`absolute right-0 mt-1 w-80 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-200 ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div>
                    <h3 className="font-semibold text-gray-900">Bildirimler</h3>
                    <p className="text-xs text-gray-500">2 okunmamış bildirim</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all"
                >
                    <FiX className="h-5 w-5" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-2 py-2 border-b border-gray-100">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'all'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    Tümü
                </button>
                <button
                    onClick={() => setActiveTab('unread')}
                    className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'unread'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    Okunmamış
                </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
                {notifications
                    .filter(n => activeTab === 'all' || !n.isRead)
                    .map((notification) => (
                        <div
                            key={notification.id}
                            className={`px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-all ${!notification.isRead ? 'bg-blue-50/50' : ''
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-full bg-gray-100">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                        {notification.title}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {notification.time}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-gray-100">
                <button className="w-full px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all">
                    Tümünü Okundu İşaretle
                </button>
            </div>
        </div>
    );
} 