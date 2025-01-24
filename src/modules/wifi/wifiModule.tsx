"use client";

import { useState } from 'react';
import { FiWifi } from 'react-icons/fi';
import { IoCopy } from 'react-icons/io5';

interface WifiModalProps {
    wifiData: {
        networkName: string;
        password: string;
        position: string;
        active: boolean;
    }
}

export default function WifiModule({ wifiData }: WifiModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            {/* Wifi Button */}
            <div
                className="fixed z-[9999]"
                style={{
                    bottom: '24px',
                    right: '24px'
                }}
            >
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-white shadow-xl rounded-full p-4 text-gray-600 hover:text-gray-900 hover:shadow-2xl transition-all duration-300"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))' }}
                >
                    <FiWifi className="text-2xl" />
                </button>
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[99999]">
                    <div
                        className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>

                        {/* Content */}
                        <div className="text-center mb-6">
                            <FiWifi className="text-4xl text-gray-600 mx-auto mb-3" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">WiFi Bilgileri</h3>
                            <p className="text-sm text-gray-500">Ağa bağlanmak için aşağıdaki bilgileri kullanabilirsiniz</p>
                        </div>

                        {/* Network Details */}
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Ağ Adı</p>
                                        <p className="font-medium text-gray-900">{wifiData.networkName}</p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(wifiData.networkName)}
                                        className="text-gray-400 hover:text-gray-600 p-2"
                                    >
                                        <IoCopy className="text-xl" />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Şifre</p>
                                        <p className="font-medium text-gray-900">{wifiData.password}</p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(wifiData.password)}
                                        className="text-gray-400 hover:text-gray-600 p-2"
                                    >
                                        <IoCopy className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Copy Status */}
                        {copied && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gray-900 text-white text-sm py-2 px-4 rounded-full">
                                    Kopyalandı!
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
