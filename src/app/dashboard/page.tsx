"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FiUsers, FiShoppingBag, FiStar, FiTrendingUp } from 'react-icons/fi';

// Örnek istatistik kartı komponenti
const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="mt-2 text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">{value}</p>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br from-${color}-400 to-${color}-600 text-white shadow-lg shadow-${color}-200`}>
                <Icon className="h-6 w-6" />
            </div>
        </div>
        {trend && (
            <div className="mt-4 flex items-center">
                <FiTrendingUp className="h-4 w-4 text-green-500" />
                <span className="ml-2 text-sm text-green-600 font-medium">{trend}</span>
            </div>
        )}
    </div>
);

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const stats = [
        {
            icon: FiUsers,
            label: 'Toplam Ziyaretçi',
            value: '2,345',
            trend: 'Son 7 günde %12 artış',
            color: 'blue'
        },
        {
            icon: FiShoppingBag,
            label: 'Menü Öğeleri',
            value: '48',
            color: 'purple'
        },
        {
            icon: FiStar,
            label: 'Ortalama Puan',
            value: '4.8',
            trend: 'Son ayda +0.2 artış',
            color: 'yellow'
        }
    ];

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    Menünüzün genel durumuna göz atın
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Son Aktiviteler</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-6">
                        {[1, 2, 3].map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between py-3 group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                                        <FiShoppingBag className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                            Yeni menü öğesi eklendi
                                        </p>
                                        <p className="text-sm text-gray-500">2 saat önce</p>
                                    </div>
                                </div>
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                    Detaylar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 