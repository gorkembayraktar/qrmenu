import { v1, v2, v3 } from "@/mockdata/theme";
import WhatsappModule from "@/modules/whatsapp/whatsappModule";
import WifiModule from "@/modules/wifi/wifiModule";
import ThemeV1 from "@/themes/v1/page";
import ThemeV2 from "@/themes/v2/page";
import ThemeV3 from "@/themes/v3/page";

import { createClient } from "@/utils/supabase_server";
import { Metadata } from 'next';


interface MenuData {
  theme: {
    template: 'elegance' | 'modern-feast' | 'classic-bistro';
    [key: string]: any;
  } | null;
  settings: {
    [key: string]: string;
  };
  colors: any;
  categories: Array<{
    title: string;
    items: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      image?: string;
      nutritional_values?: {
        calories: number;
        protein: number;
        fat: number;
        carbohydrates: number;
      };
    }>;
  }>;
  products: Array<{
    id: string;
    name: string;
    price: number;
    description?: string;
    category_id: string;
    order: number;
    image_url?: string;
    [key: string]: any;
  }>;
  modules: {
    wifi?: {
      is_active: boolean;
      settings: {
        wifi: {
          appearance: {
            margin: {
              x: number;
              y: number;
            };
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
      position: string;
    };
    [key: string]: {
      is_active: boolean;
      [key: string]: any;
      settings: any;
      position: string;
    } | undefined;
  };
  restaurantInfo: {
    name: string;
    description: string;
    tagline: string;
    phone: string;
    address: string;
    currency: string;
    rating: string;
    footer_text: string;
    email: string;
    page_title: string;
    seo_description: string;
    seo_keywords: string;
    keywords?: string;
    workingHours: Array<{
      day: number;
      is_open: boolean;
      open_time: string;
      close_time: string;
    }>;
  };
}

async function getMenuData(): Promise<MenuData> {
  const supabase = await createClient();

  // Tema ayarlarını al
  const { data: themeData } = await supabase
    .from('settings')
    .select('value')
    .eq('name', 'theme_settings')
    .single();

  // Genel ayarları al
  const { data: settings } = await supabase
    .from('settings')
    .select('name, value');

  // Kategorileri al
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  // Ürünleri al
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  // çalışma saatlerini al
  const { data: workingHours } = await supabase
    .from('working_hours')
    .select('*');

  // Ürünleri kategorilere göre grupla
  const categoriesWithProducts = categories?.map(category => ({
    title: category.name,
    items: products?.filter(product => product.category_id === category.id).map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      image: product.image,
      nutritional_values: product.nutritional_values || {
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0
      }
    })) || []
  })) || [];

  // Modül ayarlarını al
  const { data: moduleSettings } = await supabase
    .from('modules')
    .select('*');

  // Settings'i objeye dönüştür
  const settingsObj = settings ? settings.reduce((acc, curr) => ({
    ...acc,
    [curr.name]: curr.value
  }), {} as { [key: string]: string }) : {};

  // Modülleri objeye dönüştür
  const modulesObj = moduleSettings ? moduleSettings.reduce((acc, curr) => ({
    ...acc,
    [curr.id]: {
      ...curr
    }
  }), {} as MenuData['modules']) : {
    wifi: {
      is_active: false,
      networkName: '',
      password: '',
      position: 'bottom-right'
    }
  };


  return {
    colors: {},
    theme: themeData?.value ? JSON.parse(themeData.value) : null,
    settings: {
      restaurant_name: '',
      restaurant_slogan: '',
      page_title: '',
      phone: '',
      address: '',
      currency: 'TRY',
      language: 'tr',
      logo_url: '',
      favicon_url: '',
      footer_text: '',
      rating: '4.8',
      email: '',
      copyright_text: '© 2024. Tüm hakları saklıdır.',
      ...settingsObj
    },
    categories: categoriesWithProducts,
    products: products || [],
    modules: modulesObj || {},
    restaurantInfo: {
      email: settingsObj.email || '',
      name: settingsObj.restaurant_name || '',
      description: settingsObj.restaurant_slogan || '',
      seo_description: settingsObj.description || '',
      seo_keywords: settingsObj.keywords || '',
      page_title: settingsObj.page_title || '',
      tagline: settingsObj.page_title || '',
      phone: settingsObj.phone || '',
      address: settingsObj.address || '',
      footer_text: settingsObj.footer_text || '',
      currency: settingsObj.currency || 'TRY',
      rating: settingsObj.rating || '4.8',
      workingHours: workingHours || []
    }
  };
}

const ThemeComponents = {
  'elegance': ThemeV1,
  'modern-feast': ThemeV2,
  'classic-bistro': ThemeV3
} as const;

const ThemeColors = {
  'elegance': v1.colors,
  'modern-feast': v2.colors,
  'classic-bistro': v3.colors
} as const;

type ThemeType = keyof typeof ThemeComponents;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const menuData = await getMenuData();
  const theme = typeof params.theme === 'string' ? params.theme : 'elegance';
  const preview = params.preview === 'true';



  const selectedTheme = preview && theme in ThemeComponents
    ? (theme as ThemeType)
    : (menuData.theme?.template || 'elegance');

  const ThemeComponent = ThemeComponents[selectedTheme];

  const previewColors = typeof params.colors === 'string' ? JSON.parse(decodeURIComponent(params.colors)) : {};

  const defaultColors = ThemeColors[selectedTheme];
  const colors = {
    ...defaultColors,
    ...menuData.theme?.appearance?.[selectedTheme]?.colors,
    ...previewColors
  }

  menuData.colors = colors;

  return (
    <>
      <ThemeComponent menuData={menuData} />
      {!preview && menuData.modules?.wifi && menuData.modules.wifi.is_active && (
        <WifiModule wifiData={menuData.modules.wifi} />
      )}
      {!preview && menuData.modules?.whatsapp && menuData.modules.whatsapp.is_active && (
        <WhatsappModule whatsappData={menuData.modules.whatsapp} />
      )}
    </>
  );
}

export const generateMetadata = async ({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
): Promise<Metadata> => {
  try {
    const params = await searchParams;
    const menuData = await getMenuData();

    // Varsayılan metadata
    const defaultMetadata = {
      title: menuData.restaurantInfo?.page_title || 'QR Menu',
      description: menuData.restaurantInfo?.seo_description || 'Modern ve şık dijital menü çözümü',
      keywords: menuData.restaurantInfo?.seo_keywords || 'qr menu, dijital menu, restoran menüsü, cafe menüsü',
    };

    // Preview modunda ise farklı başlık göster
    if (params.preview === 'true') {
      return {
        ...defaultMetadata,
        title: menuData.restaurantInfo?.page_title || 'QR Menu - Önizleme Modu',
        robots: {
          index: false,
          follow: false,
        }
      };
    }



    // Metadata objesi
    const metadata: Metadata = {
      title: defaultMetadata.title,
      description: defaultMetadata.description,
      keywords: defaultMetadata.keywords,
      icons: {
        icon: [
          {
            url: menuData.settings?.favicon_url || '/favicon.ico',
            sizes: 'any',
          }
        ],
        apple: [
          {
            url: menuData.settings?.favicon_url || '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
          }
        ],
        shortcut: [
          { url: menuData.settings?.favicon_url || '/favicon.ico' }
        ],
      },
      manifest: '/manifest.json',
      openGraph: {
        title: menuData.restaurantInfo?.name || defaultMetadata.title,
        description: menuData.restaurantInfo?.description || defaultMetadata.description,
        type: 'website',
        url: process.env.NEXT_PUBLIC_SITE_URL,
        siteName: menuData.restaurantInfo?.name || defaultMetadata.title,
        images: [
          {
            url: menuData.settings?.logo_url || '/images/og-image.jpg',
            width: 1200,
            height: 630,
            alt: menuData.restaurantInfo?.name || defaultMetadata.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: menuData.restaurantInfo?.name || defaultMetadata.title,
        description: menuData.restaurantInfo?.description || defaultMetadata.description,
        images: [menuData.settings?.logo_url || '/images/og-image.jpg'],
      },
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL,
      },
    };

    return metadata;
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'QR Menu',
      description: 'Modern ve şık dijital menü çözümü',
      icons: {
        icon: [{ url: '/favicon.ico' }],
        shortcut: [{ url: '/favicon.ico' }],
      },
    };
  }
};