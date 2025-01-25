"use client";

import { useState, useEffect } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
import { supabase } from '@/utils/supabase';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null;
    category_id: number | null;
    nutritional_values: {
        calories: number;
        protein: number;
        fat: number;
        carbohydrates: number;
    };
    is_active: boolean;
    is_available: boolean;
    order_index: number;
}

interface Category {
    id: number;
    name: string;
}

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product | null;
    onSuccess: () => void;
    categories: Category[];
}

export default function ProductFormModal({
    isOpen,
    onClose,
    product,
    onSuccess,
    categories
}: ProductFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        image: null,
        category_id: categories[0]?.id || null,
        nutritional_values: {
            calories: 0,
            protein: 0,
            fat: 0,
            carbohydrates: 0
        },
        is_active: true,
        is_available: true,
        order_index: 0
    });

    useEffect(() => {
        if (product) {
            setFormData(product);
            setImagePreview(product.image);
        } else {
            setFormData({
                name: '',
                description: '',
                price: 0,
                image: null,
                category_id: categories[0]?.id || null,
                nutritional_values: {
                    calories: 0,
                    protein: 0,
                    fat: 0,
                    carbohydrates: 0
                },
                is_active: true,
                is_available: true,
                order_index: 0
            });
            setImagePreview(null);
        }
    }, [product, categories]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.image;

            // Upload image if new file is selected
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `products/${fileName}`;

                const { error: uploadError, data } = await supabase.storage
                    .from('images')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('images')
                    .getPublicUrl(filePath);

                imageUrl = publicUrl;
            }

            const productData = {
                ...formData,
                image: imageUrl
            };

            if (product) {
                // Update existing product
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', product.id);

                if (error) throw error;
                toast.success('Ürün başarıyla güncellendi');
            } else {
                // Create new product
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);

                if (error) throw error;
                toast.success('Ürün başarıyla eklendi');
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Ürün kaydedilirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {product ? 'Ürünü Düzenle' : 'Yeni Ürün'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-129px)]">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ürün Görseli
                        </label>
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200">
                            {imagePreview ? (
                                <>
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <label className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors">
                                            <FiUpload className="w-5 h-5" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </>
                            ) : (
                                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                                    <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm text-gray-500">Görsel yüklemek için tıklayın</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ürün Adı
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kategori
                            </label>
                            <select
                                value={formData.category_id || ''}
                                onChange={e => setFormData({ ...formData, category_id: Number(e.target.value) })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                required
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fiyat (₺)
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Açıklama
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            rows={3}
                        />
                    </div>

                    {/* Nutritional Values */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Besin Değerleri</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Kalori
                                </label>
                                <input
                                    type="number"
                                    value={formData.nutritional_values?.calories}
                                    onChange={e => setFormData({
                                        ...formData,
                                        nutritional_values: {
                                            ...formData.nutritional_values!,
                                            calories: Number(e.target.value)
                                        }
                                    })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Protein (g)
                                </label>
                                <input
                                    type="number"
                                    value={formData.nutritional_values?.protein}
                                    onChange={e => setFormData({
                                        ...formData,
                                        nutritional_values: {
                                            ...formData.nutritional_values!,
                                            protein: Number(e.target.value)
                                        }
                                    })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Yağ (g)
                                </label>
                                <input
                                    type="number"
                                    value={formData.nutritional_values?.fat}
                                    onChange={e => setFormData({
                                        ...formData,
                                        nutritional_values: {
                                            ...formData.nutritional_values!,
                                            fat: Number(e.target.value)
                                        }
                                    })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">
                                    Karbonhidrat (g)
                                </label>
                                <input
                                    type="number"
                                    value={formData.nutritional_values?.carbohydrates}
                                    onChange={e => setFormData({
                                        ...formData,
                                        nutritional_values: {
                                            ...formData.nutritional_values!,
                                            carbohydrates: Number(e.target.value)
                                        }
                                    })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Kaydediliyor...' : product ? 'Güncelle' : 'Ekle'}
                    </button>
                </div>
            </div>
        </div>
    );
} 