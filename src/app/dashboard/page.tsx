"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { FiUsers, FiShoppingBag, FiStar, FiTrendingUp, FiGrid, FiCoffee, FiWifi, FiShare2, FiImage, FiMessageCircle } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

// Örnek istatistik kartı komponenti
const StatCard = ({ icon: Icon, label, value, trend, color, onClick, description }: any) => (
    <div
        className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-100 ${onClick ? 'cursor-pointer hover:border-${color}-200' : ''}`}
        onClick={onClick}
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
                <Icon className="h-6 w-6" />
            </div>
            <div className={`text-xs font-medium px-2.5 py-1 rounded-full bg-${color}-50 text-${color}-600`}>
                {description}
            </div>
        </div>
        <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                {trend && (
                    <div className="flex items-center text-green-600">
                        <FiTrendingUp className="h-4 w-4" />
                        <span className="ml-1 text-sm font-medium">{trend}</span>
                    </div>
                )}
            </div>
        </div>
    </div>
);

// Modül kartı komponenti
const ModuleCard = ({ icon: Icon, title, description, isActive, onClick }: any) => (
    <div
        className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-100 cursor-pointer ${isActive ? 'border-indigo-500 ring-2 ring-indigo-200' : ''
            }`}
        onClick={onClick}
    >
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${isActive ? 'bg-gradient-to-br from-indigo-400 to-indigo-600' : 'bg-gray-100'} text-white`}>
                <Icon className={`h-6 w-6 ${!isActive && 'text-gray-500'}`} />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
            <span className={`text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                {isActive ? 'Aktif' : 'Pasif'}
            </span>
            <span className="text-sm text-gray-400">
                Ayarları düzenle →
            </span>
        </div>
    </div>
);

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        activeModules: 0
    });
    const [modules, setModules] = useState<any[]>([]);
    const [recentProducts, setRecentProducts] = useState<any[]>([]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            fetchStats();
            fetchModules();
            fetchRecentProducts();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            // Fetch products count
            const { count: productsCount } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            // Fetch categories count
            const { count: categoriesCount } = await supabase
                .from('categories')
                .select('*', { count: 'exact', head: true });

            // Fetch active modules count
            const { count: modulesCount } = await supabase
                .from('modules')
                .select('*', { count: 'exact', head: true })
                .eq('is_active', true);

            setStats({
                totalProducts: productsCount || 0,
                totalCategories: categoriesCount || 0,
                activeModules: modulesCount || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchModules = async () => {
        try {
            const { data, error } = await supabase
                .from('modules')
                .select('*')
                .order('id');

            if (error) throw error;
            setModules(data || []);
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    };

    const fetchRecentProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    categories (
                        name
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            setRecentProducts(data || []);
        } catch (error) {
            console.error('Error fetching recent products:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const statCards = [
        {
            icon: FiShoppingBag,
            label: 'Toplam Ürün',
            value: stats.totalProducts,
            color: 'blue',
            description: 'Menüde Aktif',
            onClick: () => router.push('/dashboard/menu/products')
        },
        {
            icon: FiGrid,
            label: 'Toplam Kategori',
            value: stats.totalCategories,
            color: 'purple',
            description: 'Düzenli Menü',
            onClick: () => router.push('/dashboard/menu/categories')
        },
        {
            icon: FiStar,
            label: 'Aktif Modül',
            value: stats.activeModules,
            color: 'yellow',
            description: 'Kullanımda'
        }
    ];

    const modulesList = [
        {
            icon: FiMessageCircle,
            title: 'Whatsapp Modülü',
            description: 'Whatsapp ile müşterilerinizle iletişime geçebilirsiniz',
            isActive: modules.find(m => m.id === 'whatsapp')?.is_active || false,
            path: '/dashboard/modules/whatsapp'
        },
        {
            icon: FiWifi,
            title: 'WiFi Modülü',
            description: 'Müşterilerinizin WiFi ağınıza kolayca bağlanmasını sağlayın',
            isActive: modules.find(m => m.id === 'wifi')?.is_active || false,
            path: '/dashboard/modules/wifi'
        },
        {
            icon: FiShare2,
            title: 'Sosyal Medya Modülü',
            description: 'Sosyal medya hesaplarınızı müşterilerinizle paylaşın',
            isActive: modules.find(m => m.id === 'social')?.is_active || false,
            path: '/dashboard/modules/social'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Hoş Geldiniz 👋
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    İşletmenizin genel durumuna göz atın
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Modules Section */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Modüller
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modulesList.map((module, index) => (
                        <Link key={index} href={module.path}>
                            <ModuleCard {...module} />
                        </Link>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Products */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Son Eklenen Ürünler</h2>
                            <p className="text-sm text-gray-500">Son eklenen 5 ürün</p>
                        </div>
                        <Link
                            href="/dashboard/menu/products"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                            Tümünü Gör →
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentProducts.map((product) => (
                            <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={48}
                                                height={48}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FiImage className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/dashboard/menu/products/${product.id}/edit`}
                                            className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors truncate block"
                                        >
                                            {product.name}
                                        </Link>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500">
                                                {product.categories?.name}
                                            </span>
                                            <span className="text-xs text-gray-500">•</span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(product.created_at).toLocaleDateString('tr-TR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.is_available
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {product.is_available ? 'Stokta' : 'Stok Dışı'}
                                        </span>
                                        <div className="text-sm font-medium text-gray-900">
                                            {product.price.toFixed(2)} ₺
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {recentProducts.length === 0 && (
                            <div className="p-4 text-center text-sm text-gray-500">
                                Henüz ürün eklenmemiş
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Hızlı İşlemler
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        <Link
                            href="/dashboard/menu/products/new"
                            className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                <FiShoppingBag className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Yeni Ürün Ekle</span>
                        </Link>
                        <Link
                            href="/dashboard/menu/categories/new"
                            className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                <FiGrid className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">Yeni Kategori Ekle</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 