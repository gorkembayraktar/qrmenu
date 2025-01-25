export interface ThemeSettings {
    template: 'elegance' | 'modern-feast' | 'classic-bistro';
    appearance: {
        useLogo: boolean;
        hero: {
            type: 'image' | 'video';
            overlay_enabled: boolean;
            height: 'small' | 'medium' | 'large' | 'full';
            content_alignment: 'left' | 'center' | 'right';
            image_url?: string;
            video_url?: string;
            image_url_default?: string;
            use_default_image?: boolean;
        };
    };
    // Site Identity Settings
    logo_url?: string;
    favicon_url?: string;
    site_title?: string;
    tagline?: string;
    show_title_tagline: boolean;
    // Theme Settings
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