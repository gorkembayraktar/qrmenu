'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { FiX } from 'react-icons/fi';
import { BiDish } from 'react-icons/bi';
import { formatPrice } from '@/utils/price';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        name: string;
        description: string;
        price: number;
        image?: string;
        category?: string;
        nutritional_values: {
            calories: number;
            protein: number;
            fat: number;
            carbohydrates: number;
        };
    };
    currency: string;
}

export default function ProductModal({ isOpen, onClose, product, currency }: ProductModalProps) {
    const [imageError, setImageError] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setImageError(false);
        }
    }, [isOpen, product.image]);

    const handleOutsideClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const renderPlaceholder = () => (
        <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col items-center justify-center">
            <BiDish className="w-16 h-16 text-primary mb-3" />
            <div className="text-center px-4">
                <span className="text-primary/80 text-base font-medium block mb-1">{product.name}</span>
                <div className="text-sm text-gray-400">
                    {imageError ? "Görsel yüklenemedi" : "Fotoğraf yakında eklenecek"}
                </div>
            </div>
        </div>
    );

    const modalContent = (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                style={{ zIndex: 9998 }}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="fixed inset-0 flex items-center justify-center p-4"
                style={{ zIndex: 9999 }}
                onClick={handleOutsideClick}
            >
                <div
                    ref={modalRef}
                    className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden animate-modal-enter"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-1 hover:bg-white transition-colors"
                    >
                        <FiX className="h-6 w-6" />
                    </button>

                    {/* Product Image */}
                    <div className="aspect-[16/10] relative">
                        {product.image && !imageError ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority
                                onError={() => setImageError(true)}
                            />
                        ) : renderPlaceholder()}
                        {product.category && (
                            <span className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 text-sm rounded-full backdrop-blur-sm">
                                {product.category}
                            </span>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                            <h2 className="text-xl font-bold text-gray-900">
                                {product.name}
                            </h2>
                            <span className="text-lg font-bold text-primary whitespace-nowrap">
                                {formatPrice(product.price, currency)}
                            </span>
                        </div>

                        <p className="text-gray-600 text-base leading-relaxed">
                            {product.description}
                        </p>

                        {/* Additional Info */}
                        <div className="border-t pt-4 mt-6">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Besin Değerleri</h4>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="text-lg font-semibold text-gray-900">{product.nutritional_values.calories}</div>
                                    <div className="text-xs text-gray-500">kalori</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="text-lg font-semibold text-gray-900">{product.nutritional_values.protein}g</div>
                                    <div className="text-xs text-gray-500">protein</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="text-lg font-semibold text-gray-900">{product.nutritional_values.carbohydrates}g</div>
                                    <div className="text-xs text-gray-500">karbonhidrat</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return createPortal(modalContent, document.body);
} 