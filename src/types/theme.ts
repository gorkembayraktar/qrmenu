export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
}

export interface ThemeConfig {
    name: string;
    colors: ThemeColors;
    fontFamily: {
        primary: string;
        secondary: string;
    };
    borderRadius: {
        small: string;
        medium: string;
        large: string;
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
} 