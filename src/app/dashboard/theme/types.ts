export interface ThemeSettings {
    template: 'elegance' | 'modern-feast' | 'classic-bistro';
    primary_color: string;
    font_family: string;
    button_style: 'rounded' | 'square';
    layout_style: 'grid' | 'list';
    show_prices: boolean;
    show_descriptions: boolean;
    category_style: 'tabs' | 'dropdown' | 'sidebar';
    image_style: 'square' | 'rounded' | 'circle';
    animations_enabled: boolean;
} 