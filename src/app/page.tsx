import WhatsappModule from "@/modules/whatsapp/whatsappModule";
import WifiModule from "@/modules/wifi/wifiModule";
import ThemeV1 from "@/themes/v1/page";
import ThemeV2 from "@/themes/v2/page";
import ThemeV3 from "@/themes/v3/page";

import { createClient } from "@/utils/supabase_server";


interface MenuData {
  theme: {
    template: 'elegance' | 'modern-feast' | 'classic-bistro';
    [key: string]: any;
  } | null;
  settings: {
    [key: string]: string;
  };
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

type ThemeType = keyof typeof ThemeComponents;

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const params = await searchParams;
  const menuData = await getMenuData();
  const theme = typeof params.theme === 'string' ? params.theme : 'elegance';
  const preview = params.preview === 'true';

  const selectedTheme = preview && theme in ThemeComponents
    ? (theme as ThemeType)
    : (menuData.theme?.template || 'elegance');

  const ThemeComponent = ThemeComponents[selectedTheme];

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
