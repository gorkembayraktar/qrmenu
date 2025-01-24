"use client";

import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

interface WhatsappProps {
    whatsappData: {
        position: string;
        is_active: boolean;
        settings: {
            whatsapp: {
                appearance: {
                    margin: { x?: number; y?: number };
                    position: string;
                    showOnMobile: boolean;
                    size: 'small' | 'medium' | 'large';
                    stacKOrder: bigint;
                },
                number: string;
                message: string;
            }
        }
    }
}

interface WhatsappAppearanceSettings {
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    size: 'small' | 'medium' | 'large';
    margin: {
        x?: number;
        y?: number;
    };
    showOnMobile: boolean;
}

export default function WhatsappModule({ whatsappData }: WhatsappProps) {
    const getButtonPosition = (position: WhatsappAppearanceSettings['position'], margin: WhatsappAppearanceSettings['margin']) => {
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
        const { size } = whatsappData.settings.whatsapp.appearance;
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

    const handleClick = () => {
        const { number, message } = whatsappData.settings.whatsapp;
        const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const { buttonSize, iconSize } = getButtonSize();

    if (whatsappData?.is_active === false) return null;

    return (
        <button
            onClick={handleClick}
            className={`fixed z-[9999] shadow-xl rounded-full ${buttonSize} bg-green-500 text-white cursor-pointer hover:text-gray-900 hover:shadow-2xl transition-all duration-300`}
            style={{
                ...getButtonPosition(
                    whatsappData.settings.whatsapp.appearance.position as WhatsappAppearanceSettings['position'],
                    {
                        x: Number(whatsappData.settings.whatsapp.appearance.margin?.x || 24),
                        y: Number(whatsappData.settings.whatsapp.appearance.margin?.y || 24)
                    }
                ),
                display: !whatsappData.settings.whatsapp.appearance.showOnMobile && window.innerWidth < 768 ? 'none' : 'block',
                filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))'
            }}
        >
            <FaWhatsapp className={iconSize} />
        </button>
    );
}
