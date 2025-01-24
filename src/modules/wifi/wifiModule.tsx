"use client";

import { useState } from 'react';
import { FiWifi } from 'react-icons/fi';
import { IoCopy } from 'react-icons/io5';
import { QRCodeSVG } from 'qrcode.react';

interface WifiModalProps {
    wifiData: {
        position: string;
        is_active: boolean;
        settings: {
            wifi: {
                appearance: {
                    margin: { x?: number; y?: number };
                    position: string;
                    showOnMobile: boolean;
                    size: 'small' | 'medium' | 'large';
                    stacKOrder: bigint;
                },
                ssid: string;
                security: string;
                password: string;
            }
        }
    }
}

interface WifiAppearanceSettings {
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    size: 'small' | 'medium' | 'large';
    margin: {
        x?: number;
        y?: number;
    };
    showOnMobile: boolean;
}

export default function WifiModule({ wifiData }: WifiModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // WiFi QR kodu için string oluştur
    const generateWifiQRString = () => {
        const { ssid, password, security } = wifiData.settings.wifi;
        const sec = security === 'nopass' ? 'nopass' : security;
        return `WIFI:T:${security};S:${ssid};${security !== 'nopass' ? `P:${password};` : ''}H:false;;`;
    };

    const getButtonPosition = (position: WifiAppearanceSettings['position'], margin: WifiAppearanceSettings['margin']) => {
        const marginX = Number(margin?.x) || 24;
        const marginY = Number(margin?.y) || 24;

        switch (position) {
            case 'bottom-right':
                return { bottom: marginY, right: marginX };
            case 'bottom-left':
                return { bottom: marginY, left: marginX };
            case 'top-right':
                return { top: marginY, right: marginX };
            case 'top-left':
                return { top: marginY, left: marginX };
            default:
                return { bottom: marginY, right: marginX };
        }
    };

    const getButtonSize = () => {
        const { size } = wifiData.settings.wifi.appearance;
        switch (size) {
            case 'small':
                return { buttonSize: 'p-3', iconSize: 'text-xl' };
            case 'large':
                return { buttonSize: 'p-5', iconSize: 'text-3xl' };
            case 'medium':
            default:
                return { buttonSize: 'p-4', iconSize: 'text-2xl' };
        }
    };

    const { buttonSize, iconSize } = getButtonSize();
    console.log(wifiData?.is_active, "wifiData?.is_active");
    if (wifiData?.is_active === false)
        return null;


    return (
        <>
            {/* Wifi Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed z-[9999] shadow-xl rounded-full ${buttonSize} bg-blue-500 text-white cursor-pointer hover:text-gray-900 hover:shadow-2xl transition-all duration-300`}
                style={{
                    ...getButtonPosition(
                        wifiData.settings.wifi.appearance.position as WifiAppearanceSettings['position'],
                        {
                            x: Number(wifiData.settings.wifi.appearance.margin?.x || 24),
                            y: Number(wifiData.settings.wifi.appearance.margin?.y || 24)
                        }
                    ),
                    display: !wifiData.settings.wifi.appearance.showOnMobile && window.innerWidth < 768 ? 'none' : 'block',
                    filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))'
                }}
            >
                <FiWifi className={iconSize} />
            </button>

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
                            <p className="text-sm text-gray-500">QR kodu tarayarak veya bilgileri kullanarak bağlanabilirsiniz</p>
                        </div>

                        {/* QR Code */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-white p-3 rounded-xl shadow-md">
                                <QRCodeSVG
                                    value={generateWifiQRString()}
                                    size={180}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>
                        </div>

                        {/* Network Details */}
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Ağ Adı</p>
                                        <p className="font-medium text-gray-900">{wifiData.settings.wifi.ssid}</p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(wifiData.settings.wifi.ssid)}
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
                                        <p className="font-medium text-gray-900">{wifiData.settings.wifi.password}</p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(wifiData.settings.wifi.password)}
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
