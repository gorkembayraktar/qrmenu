import { useState, useEffect } from 'react';
import { v1, v2, v3 } from '@/mockdata/theme';

interface ColorSectionProps {
    settings: any;
    setSettings: (settings: any) => void;
}

export default function ColorSection({ settings, setSettings }: ColorSectionProps) {
    // Seçilen temaya göre varsayılan renkleri al
    const getDefaultColors = () => {
        switch (settings.template) {
            case 'elegance':
                return v1.colors;
            case 'modern-feast':
                return v2.colors;
            case 'classic-bistro':
                return v3.colors;
            default:
                return v1.colors;
        }
    };

    const [defaultColors, setDefaultColors] = useState(getDefaultColors());

    // Tema değiştiğinde varsayılan renkleri güncelle
    useEffect(() => {
        setDefaultColors(getDefaultColors());
    }, [settings.template]);

    const resetToDefaultColors = () => {
        const newSettings = { ...settings };
        const template = settings.template || 'elegance';
        const currentDefaultColors = JSON.parse(JSON.stringify(getDefaultColors())); // Derin kopya oluştur

        // Diğer ayarları koru
        newSettings.appearance = {
            ...newSettings.appearance,
            [template]: {
                ...newSettings.appearance?.[template],
                colors: JSON.parse(JSON.stringify(currentDefaultColors)) // Derin kopya oluştur
            }
        };

        // Diğer ayarları koru
        newSettings.template = settings.template;
        newSettings.useLogo = settings.useLogo;
        newSettings.hero = settings.hero;
        newSettings.show_title_tagline = settings.show_title_tagline;
        newSettings.primary_color = settings.primary_color;
        newSettings.font_family = settings.font_family;
        newSettings.button_style = settings.button_style;
        newSettings.layout_style = settings.layout_style;
        newSettings.show_prices = settings.show_prices;
        newSettings.show_descriptions = settings.show_descriptions;
        newSettings.category_style = settings.category_style;
        newSettings.image_style = settings.image_style;
        newSettings.animations_enabled = settings.animations_enabled;
        newSettings.logo_url = settings.logo_url;
        newSettings.favicon_url = settings.favicon_url;
        newSettings.site_title = settings.site_title;
        newSettings.tagline = settings.tagline;

        // Preview için iframe'e varsayılan renkleri gönder
        const previewFrame = document.querySelector('iframe');
        if (previewFrame) {
            try {
                const currentUrl = new URL(previewFrame.src);
                const encodedColors = encodeURIComponent(JSON.stringify(currentDefaultColors));
                currentUrl.searchParams.set('colors', encodedColors);
                previewFrame.src = currentUrl.toString();
                console.log('Varsayılan renklere dönüldü:', currentDefaultColors);
            } catch (error) {
                console.error('Varsayılan renklere dönerken hata:', error);
            }
        }

        setDefaultColors(currentDefaultColors);
        setSettings(newSettings);
    };

    const updateColor = (path: string, value: string) => {
        const newSettings = { ...settings };
        const template = settings.template || 'elegance';

        // Appearance ve tema-spesifik colors objelerini oluştur
        newSettings.appearance = {
            ...newSettings.appearance,
            [template]: {
                ...newSettings.appearance?.[template],
                colors: {
                    ...newSettings.appearance?.[template]?.colors
                }
            }
        };

        const parts = path.split('.');
        let current: any = newSettings.appearance[template].colors;

        // Yolu oluştur ve değeri güncelle
        for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) {
                current[parts[i]] = {};
            }
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;

        // Diğer ayarları koru
        newSettings.template = settings.template;
        newSettings.useLogo = settings.useLogo;
        newSettings.hero = settings.hero;
        newSettings.show_title_tagline = settings.show_title_tagline;
        newSettings.primary_color = settings.primary_color;
        newSettings.font_family = settings.font_family;
        newSettings.button_style = settings.button_style;
        newSettings.layout_style = settings.layout_style;
        newSettings.show_prices = settings.show_prices;
        newSettings.show_descriptions = settings.show_descriptions;
        newSettings.category_style = settings.category_style;
        newSettings.image_style = settings.image_style;
        newSettings.animations_enabled = settings.animations_enabled;
        newSettings.logo_url = settings.logo_url;
        newSettings.favicon_url = settings.favicon_url;
        newSettings.site_title = settings.site_title;
        newSettings.tagline = settings.tagline;

        // Preview için iframe'e renkleri gönder
        const previewFrame = document.querySelector('iframe');
        if (previewFrame) {
            try {
                const currentUrl = new URL(previewFrame.src);
                const previewColors = newSettings.appearance[template].colors;

                // Renkleri URL-safe bir şekilde encode et
                const encodedColors = encodeURIComponent(JSON.stringify(previewColors));
                currentUrl.searchParams.set('colors', encodedColors);

                previewFrame.src = currentUrl.toString();
                console.log('Preview renkleri güncellendi:', previewColors);
            } catch (error) {
                console.error('Preview güncellenirken hata:', error);
            }
        }

        setSettings(newSettings);
    };

    const ColorInput = ({ label, path, defaultValue }: { label: string; path: string; defaultValue: string }) => {
        // Mevcut değeri güvenli bir şekilde al
        const getCurrentValue = () => {
            const template = settings.template || 'elegance';
            try {
                const colors = settings.appearance?.[template]?.colors;
                if (!colors) return defaultValue;

                const parts = path.split('.');
                let value = colors;
                for (const part of parts) {
                    value = value?.[part];
                    if (value === undefined) return defaultValue;
                }
                return value || defaultValue;
            } catch {
                return defaultValue;
            }
        };

        return (
            <div className="flex items-center gap-2 mb-2">
                <input
                    type="color"
                    value={getCurrentValue()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateColor(path, e.target.value)}
                    className="w-8 h-8 cursor-pointer rounded border border-gray-200"
                />
                <div className="text-sm text-gray-600">{label}</div>
            </div>
        );
    };

    const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="mb-6">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{title}</div>
            <div className="pl-1">{children}</div>
        </div>
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium text-gray-700">Renk Ayarları</div>
                <button
                    onClick={resetToDefaultColors}
                    className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                >
                    Varsayılana Dön
                </button>
            </div>

            {defaultColors.header && (
                <Section title="Header">
                    <ColorInput label="Arka plan rengi" path="header.background" defaultValue={defaultColors.header.background} />
                    <ColorInput label="Metin rengi" path="header.text" defaultValue={defaultColors.header.text} />
                </Section>
            )}

            <Section title="Ana Renkler">
                <ColorInput label="Ana Renk" path="primary" defaultValue={defaultColors.primary} />
                <ColorInput label="İkincil Renk" path="secondary" defaultValue={defaultColors.secondary} />
                <ColorInput label="Vurgu Rengi" path="accent" defaultValue={defaultColors.accent} />
                <ColorInput label="Arka Plan" path="background" defaultValue={defaultColors.background} />
            </Section>

            {defaultColors.text && typeof defaultColors.text === 'object' ? (
                <Section title="Metin">
                    <ColorInput label="Ana Metin" path="text.primary" defaultValue={defaultColors.text.primary} />
                    <ColorInput label="İkincil Metin" path="text.secondary" defaultValue={defaultColors.text.secondary} />
                    {defaultColors.text.light && (
                        <ColorInput label="Açık Metin" path="text.light" defaultValue={defaultColors.text.light} />
                    )}
                </Section>
            ) : defaultColors.text && (
                <Section title="Metin">
                    <ColorInput label="Metin Rengi" path="text" defaultValue={defaultColors.text} />
                </Section>
            )}

            {defaultColors.card && (
                <Section title="Kartlar">
                    <ColorInput label="Arka Plan" path="card.background" defaultValue={defaultColors.card.background} />
                    <ColorInput label="Hover" path="card.hover" defaultValue={defaultColors.card.hover} />
                    <ColorInput label="Kenarlık" path="card.border" defaultValue={defaultColors.card.border} />
                </Section>
            )}

            {defaultColors.footer && (
                <Section title="Footer">
                    <ColorInput label="Arka Plan" path="footer.background" defaultValue={defaultColors.footer.background} />
                    <ColorInput label="Metin" path="footer.text" defaultValue={defaultColors.footer.text} />
                    <ColorInput label="Kenarlık" path="footer.border" defaultValue={defaultColors.footer.border} />
                </Section>
            )}

            {defaultColors.overlay && (
                <Section title="Overlay">
                    <ColorInput label="Koyu" path="overlay.dark" defaultValue={defaultColors.overlay.dark} />
                    <ColorInput label="Açık" path="overlay.light" defaultValue={defaultColors.overlay.light} />
                </Section>
            )}

            {defaultColors.price && (
                <Section title="Fiyat">
                    <ColorInput label="Arka Plan" path="price.background" defaultValue={defaultColors.price.background} />
                    <ColorInput label="Metin" path="price.text" defaultValue={defaultColors.price.text} />
                    {defaultColors.price.border && (
                        <ColorInput label="Kenarlık" path="price.border" defaultValue={defaultColors.price.border} />
                    )}
                    {defaultColors.price.hover && (
                        <ColorInput label="Hover" path="price.hover" defaultValue={defaultColors.price.hover} />
                    )}
                </Section>
            )}
        </div>
    );
}