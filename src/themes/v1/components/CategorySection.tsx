'use client';

import MenuCard from './MenuCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    category?: string;
    nutritional_values?: {
        calories: number;
        protein: number;
        fat: number;
        carbohydrates: number;
    };
}

interface CategorySectionProps {
    title: string;
    items: MenuItem[];
    currency: string;
}

export default function CategorySection({ title, items, currency }: CategorySectionProps) {
    return (
        <section className="mb-8 scroll-mt-16" id={title.toLowerCase().replace(/\s+/g, '-')}>
            <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-background/80 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-gray-800">
                    {title}
                    <span className="ml-2 text-sm text-gray-500 font-normal">
                        ({items.length} ürün)
                    </span>
                </h2>
            </div>

            <div className="mt-3">
                <Swiper
                    modules={[FreeMode]}
                    slidesPerView="auto"
                    spaceBetween={12}
                    freeMode={true}
                    className="!-mx-4 !px-4"
                >
                    {items.map((item) => (
                        <SwiperSlide key={item.id} className="!w-[280px]">
                            <MenuCard {...item} category={title} currency={currency} nutritional_values={item.nutritional_values || { calories: 0, protein: 0, fat: 0, carbohydrates: 0 }} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
} 