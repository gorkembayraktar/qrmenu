export const v3 = {
    colors: {
        header: {
            background: '#FFFFFF',
            text: '#1F2937'
        },
        primary: '#3B82F6', // Modern mavi
        secondary: '#6366F1', // İndigo
        accent: '#F59E0B', // Amber
        background: '#F9FAFB', // Açık gri
        text: {
            primary: '#374151',
            secondary: '#6B7280',
            light: '#F9FAFB'
        },
        card: {
            background: '#FFFFFF', // Beyaz
            text: '#4B5563', // Orta gri
            border: '#E5E7EB', // Açık gri
            hover: '#F3F4F6' // Çok açık gri
        },
        footer: {
            background: '#111827',
            text: 'rgba(255, 255, 255, 0.8)',
            border: 'rgba(255, 255, 255, 0.1)'
        },
        overlay: {
            dark: 'rgba(0, 0, 0, 0.7)',
            light: 'rgba(255, 255, 255, 0.1)'
        },
        price: {
            background: '#F9FAFB',
            text: '#374151',
            border: '#E5E7EB',
            hover: '#F3F4F6'
        }
    }
}

export const v1 = {
    colors: {
        header: {
            background: '#FFFFFF',
            text: '#1F2937'
        },
        primary: '#F59E0B', // Amber - Ana tema rengi (rating yıldızı, sosyal medya hover, vb.)
        secondary: '#4F46E5', // İndigo - İkincil vurgular için
        accent: '#10B981', // Yeşil - Özel vurgular için (açık/kapalı durumu)
        background: '#FFFFFF', // Beyaz - Ana arka plan
        text: {
            primary: '#1F2937', // Koyu gri - Ana metin rengi
            secondary: '#6B7280', // Orta gri - İkincil metin
            light: 'rgba(255, 255, 255, 0.9)', // Beyaz - Açık arka plan üzerindeki metin
        },
        card: {
            background: '#FFFFFF', // Beyaz - Kart arka planı
            text: '#374151', // Koyu gri - Kart metni
            hover: '#F3F4F6', // Açık gri - Hover durumu
            border: '#E5E7EB', // Gri - Kenarlıklar
        },
        footer: {
            background: '#111827', // Koyu - Footer arka planı
            text: 'rgba(255, 255, 255, 0.8)', // Beyaz - Footer metni
            border: 'rgba(255, 255, 255, 0.1)', // Beyaz - Footer kenarlıkları
        },
        overlay: {
            dark: 'rgba(0, 0, 0, 0.7)', // Siyah - Koyu overlay
            light: 'rgba(255, 255, 255, 0.1)', // Beyaz - Açık overlay
        },
        price: {
            background: '#FEF3C7',
            text: '#92400E',
            border: '#FCD34D',
            hover: '#FDE68A'
        }
    }
}

export const v2 = {
    colors: {
        header: {
            background: '#FFFFFF',
            text: '#1F2937'
        },
        primary: '#F59E0B', // Amber - Tema ana rengi
        secondary: '#4F46E5', // İndigo - İkincil vurgular için
        accent: '#10B981', // Yeşil - Özel vurgular için
        background: '#FFFFFF', // Beyaz - Sayfa arka planı
        text: {
            primary: '#4B5563',
            secondary: '#6B7280',
            light: '#F9FAFB'
        },
        card: {
            background: '#FFFFFF', // Beyaz - Kart arka planı
            text: '#374151', // Koyu gri - Kart metni
            border: '#E5E7EB', // Açık gri - Kenarlıklar
            hover: '#F3F4F6' // Çok açık gri - Hover durumu
        },
        footer: {
            background: '#111827',
            text: 'rgba(255, 255, 255, 0.8)',
            border: 'rgba(255, 255, 255, 0.1)'
        },
        overlay: {
            dark: 'rgba(0, 0, 0, 0.7)',
            light: 'rgba(255, 255, 255, 0.1)'
        },
        price: {
            background: '#FEF3C7', // Amber açık - Fiyat arka planı
            text: '#92400E', // Amber koyu - Fiyat metni
            border: '#FCD34D', // Amber orta - Kenarlık
            hover: '#FDE68A' // Amber açık - Hover durumu
        }
    }
};


export const themeOptions = [
    {
        id: 'elegance' as const,
        title: 'Elegance',
        description: 'Zarif ve minimalist tasarım (v1)',
        image_src: '/themes/elegance.png'
    },
    {
        id: 'modern-feast' as const,
        title: 'Modern Feast',
        description: 'Modern ve şık görünüm (v2)',
        image_src: '/themes/modern-feast.png'
    },
    {
        id: 'classic-bistro' as const,
        title: 'Classic Bistro',
        description: 'Klasik restoran teması (v3)',
        image_src: '/themes/classic-bistro.png'
    }
];
