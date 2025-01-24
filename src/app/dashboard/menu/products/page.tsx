"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiPlus, FiTrash2, FiChevronLeft, FiChevronRight, FiAlertTriangle, FiSearch, FiFilter, FiX, FiImage } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, getCurrencySymbol } from '@/utils/price';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

interface Category {
    id: number;
    name: string;
}

interface Settings {
    currency: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category_id: number;
    is_available: boolean;
    categories: Category;
    order_index: number;
    created_at: string;
    cloudinary_public_id?: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<Settings>({ currency: '₺' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; product: Product | null }>({
        isOpen: false,
        product: null
    });
    const itemsPerPage = 5;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
    const [availabilityFilter, setAvailabilityFilter] = useState<boolean | 'all'>('all');

    useEffect(() => {
        fetchCategories();
        fetchSettings();
        fetchProducts();
    }, [currentPage, searchTerm, selectedCategory, availabilityFilter]);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('value')
                .eq('name', 'currency')
                .single();

            if (error) throw error;
            if (data) setSettings({ currency: data.value });
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Ayarlar yüklenirken bir hata oluştu');
        }
    };

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('id, name')
                .order('sort_order');

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Kategoriler yüklenirken bir hata oluştu');
        }
    };

    const fetchProducts = async () => {
        try {
            let query = supabase
                .from('products')
                .select(`
                    *,
                    categories (
                        id,
                        name
                    )
                `, { count: 'exact' });

            // Apply filters
            if (searchTerm) {
                query = query.ilike('name', `%${searchTerm}%`);
            }
            if (selectedCategory !== 'all') {
                query = query.eq('category_id', selectedCategory);
            }
            if (availabilityFilter !== 'all') {
                query = query.eq('is_available', availabilityFilter);
            }

            // Get total count first
            const { count } = await query;
            setTotalCount(count || 0);

            // Then get paginated data
            const { data, error } = await query
                .order('created_at', { ascending: false })
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Ürünler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAvailability = async (product: Product) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({ is_available: !product.is_available })
                .eq('id', product.id);

            if (error) throw error;

            setProducts(products.map(p =>
                p.id === product.id
                    ? { ...p, is_available: !p.is_available }
                    : p
            ));

            toast.success(`${product.name} ${!product.is_available ? 'stokta var' : 'stokta yok'} olarak işaretlendi`);
        } catch (error) {
            console.error('Error toggling product availability:', error);
            toast.error('Ürün durumu güncellenirken bir hata oluştu');
        }
    };

    const handleDelete = async (product: Product) => {
        setDeleteModal({ isOpen: true, product });
    };

    const confirmDelete = async () => {
        if (!deleteModal.product) return;

        try {
            // If product has an image, delete it from Cloudinary first
            if (deleteModal.product.cloudinary_public_id) {
                const response = await fetch('/api/product', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ public_id: deleteModal.product.cloudinary_public_id })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Görsel silinirken bir hata oluştu');
                }
            }

            // Delete product from database
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', deleteModal.product.id);

            if (error) throw error;

            toast.success('Ürün başarıyla silindi');
            fetchProducts(); // Refresh the products list
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Ürün silinirken bir hata oluştu');
        } finally {
            setDeleteModal({ isOpen: false, product: null });
        }
    };

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
                        <p className="text-sm text-gray-500 mt-1">Ürünlerinizi yönetin</p>
                    </div>
                    <Link
                        href="/dashboard/menu/products/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <FiPlus className="mr-2" />
                        Yeni Ürün Ekle
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Ürün Ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiFilter className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="all">Tüm Kategoriler</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Availability Filter */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiFilter className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            value={availabilityFilter === 'all' ? 'all' : availabilityFilter ? 'true' : 'false'}
                            onChange={(e) => setAvailabilityFilter(e.target.value === 'all' ? 'all' : e.target.value === 'true')}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="all">Tüm Durumlar</option>
                            <option value="true">Stokta</option>
                            <option value="false">Stok Dışı</option>
                        </select>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ürün
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kategori
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fiyat
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Durum
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                        Yükleniyor...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                        Ürün bulunamadı
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    {product.image ? (
                                                        <Image
                                                            src={product.image}
                                                            alt={product.name}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                            <FiImage className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product.name}
                                                    </div>
                                                    {product.description && (
                                                        <div className="text-sm text-gray-500">
                                                            {product.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.categories?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {product.price.toFixed(2)} {getCurrencySymbol(settings.currency)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggleAvailability(product)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${product.is_available
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {product.is_available ? 'Stokta' : 'Stok Dışı'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/menu/products/${product.id}/edit`}
                                                    className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-xl transition-colors"
                                                >
                                                    <FiEdit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product)}
                                                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-xl transition-colors"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && totalCount > itemsPerPage && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Toplam <span className="font-medium">{totalCount}</span> üründen{' '}
                                    <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)}</span>-
                                    <span className="font-medium">
                                        {Math.min(currentPage * itemsPerPage, totalCount)}
                                    </span>{' '}
                                    arası gösteriliyor
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                                >
                                    <FiChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                                >
                                    <FiChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                itemName={deleteModal.product?.name || ''}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModal({ isOpen: false, product: null })}
            />
        </div>
    );
} 