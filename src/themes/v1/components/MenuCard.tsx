'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiCamera } from 'react-icons/fi';
import { BiDish } from 'react-icons/bi';
import ProductModal from './ProductModal';
import { formatPrice } from '@/utils/price';

interface MenuItemProps {
    name: string;
    description: string;
    price: number;
    image?: string;
    category?: string;
    currency: string;
    nutritional_values: {
        calories: number;
        protein: number;
        fat: number;
        carbohydrates: number;
    };
}

export default function MenuCard({ name, description, price, image, category, currency, nutritional_values }: MenuItemProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    const renderPlaceholder = () => (
        <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col items-center justify-center group-hover:from-primary/10 group-hover:to-primary/20 transition-all duration-300">
            <BiDish className="w-8 h-8 text-primary mb-2" />
            <div className="text-center px-4">
                <span className="text-primary/80 text-sm font-medium">{name}</span>
                <div className="text-xs text-gray-400 mt-1">
                    {imageError ? "Görsel yüklenemedi" : "Fotoğraf yakında eklenecek"}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div
                className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <div className="aspect-[16/10] relative overflow-hidden">
                    {image && !imageError ? (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={() => setImageError(true)}
                        />
                    ) : renderPlaceholder()}
                    {category && (
                        <span className="absolute top-2 left-2 bg-black/50 text-white px-2 py-0.5 text-xs rounded-full backdrop-blur-sm">
                            {category}
                        </span>
                    )}
                </div>

                <div className="p-3">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="text-base font-medium text-gray-800 leading-tight">{name}</h3>
                        <span className="text-primary font-bold text-sm whitespace-nowrap">
                            {formatPrice(price, currency)}
                        </span>
                    </div>
                    <p className="text-gray-600 text-xs mt-1 line-clamp-2">{description}</p>
                </div>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={{ name, description, price, image: imageError ? undefined : image, category, nutritional_values }}
                currency={currency}
            />
        </>
    );
} 