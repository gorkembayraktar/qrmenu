"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiUpload, FiDollarSign, FiHash, FiAlignLeft, FiImage, FiX } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrencySymbol } from '@/utils/price';

interface Category {
    id: number;
    name: string;
}

interface Settings {
    currency: string;
}

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [settings, setSettings] = useState<Settings>({ currency: '₺' });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<{ url: string; public_id: string } | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        nutritional_values: {
            calories: '',
            protein: '',
            fat: '',
            carbohydrates: ''
        }
    });

    useEffect(() => {
        fetchCategories();
        fetchSettings();
    }, []);

    const fetchCategories = async () => {
        try {
            console.log('Fetching categories...');

            const { data, error } = await supabase
                .from('categories')
                .select('id, name')
                .order('sort_order');

            if (error) {
                console.error('Categories fetch error:', error);
                throw error;
            }

            console.log('Categories data:', data);
            setCategories(data || []);
        } catch (error: any) {
            console.error('Failed to fetch categories:', error);

            // Check if it's an authentication error
            if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
                toast.error('Oturum hatası. Lütfen tekrar giriş yapın.');
                return;
            }

            // Check if it's a connection error
            if (error.code === 'NETWORK_ERROR' || error.message?.includes('network')) {
                toast.error('Bağlantı hatası. İnternet bağlantınızı kontrol edin.');
                return;
            }

            toast.error('Kategoriler yüklenirken bir hata oluştu.');
        }
    };

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
        }
    };

    const handleFileUpload = async (file: File) => {
        try {
            // Just set the file and preview, don't upload to Cloudinary yet
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error handling file:', error);
            toast.error('Görsel işlenirken bir hata oluştu');
        }
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleFileUpload(file);
        } else {
            toast.error('Lütfen geçerli bir görsel dosyası seçin');
        }
    };

    const handlePaste = async (e: ClipboardEvent) => {
        const file = e.clipboardData?.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFileUpload(file);
        }
    };

    useEffect(() => {
        document.addEventListener('paste', handlePaste);
        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleImageRemove = () => {
        setImageFile(null);
        setImagePreview(null);
        setUploadedImage(null);
    };

    const handlePriceChange = (value: string, isKurus = false) => {
        const currentPrice = parseFloat(formData.price || '0');
        let newPrice: number;

        if (isKurus) {
            // Kuruş değiştiğinde
            const tl = Math.floor(currentPrice);
            const kurus = parseInt(value) || 0;
            if (kurus >= 0 && kurus <= 99) {
                newPrice = tl + (kurus / 100);
            } else {
                return;
            }
        } else {
            // TL değiştiğinde
            const kurus = Math.round((currentPrice % 1) * 100);
            newPrice = (parseInt(value) || 0) + (kurus / 100);
        }

        setFormData({ ...formData, price: newPrice.toString() });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Form validation
            if (!formData.name || !formData.category_id || !formData.price) {
                toast.error('Lütfen gerekli alanları doldurun');
                return;
            }

            // Handle image upload if exists
            let imageData = null;
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);

                const response = await fetch('/api/product', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Görsel yüklenirken bir hata oluştu');
                }

                imageData = await response.json();
            }

            // Prepare product data
            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category_id: parseInt(formData.category_id),
                image: imageData?.url || null,
                cloudinary_public_id: imageData?.public_id || null,
                nutritional_values: {
                    calories: parseFloat(formData.nutritional_values.calories) || 0,
                    protein: parseFloat(formData.nutritional_values.protein) || 0,
                    fat: parseFloat(formData.nutritional_values.fat) || 0,
                    carbohydrates: parseFloat(formData.nutritional_values.carbohydrates) || 0
                },
                is_available: true
            };

            // Add product to database
            const { error } = await supabase.from('products').insert([productData]);

            if (error) throw error;

            toast.success('Ürün başarıyla eklendi');
            router.push('/dashboard/menu/products');
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Ürün eklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/menu/products"
                            className="p-2 hover:bg-white rounded-xl transition-colors"
                        >
                            <FiArrowLeft className="w-6 h-6 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Yeni Ürün Ekle</h1>
                            <p className="text-sm text-gray-500 mt-1">Menünüze yeni bir ürün ekleyin</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        form="product-form"
                        disabled={loading}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Kaydediliyor...
                            </>
                        ) : (
                            'Ürünü Kaydet'
                        )}
                    </button>
                </div>

                <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Ürün Görseli</h2>
                                    <p className="text-sm text-gray-500">Ürününüz için bir görsel seçin</p>
                                </div>
                                <FiImage className="w-5 h-5 text-gray-400" />
                            </div>

                            <div className="flex items-center gap-6">
                                <div
                                    className="w-40 h-40 relative rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                >
                                    {imagePreview ? (
                                        <>
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute top-1 right-1 flex gap-1">
                                                <label
                                                    className="p-1 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 cursor-pointer"
                                                    title="Görseli Değiştir"
                                                >
                                                    <FiUpload className="w-4 h-4" />
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={handleImageRemove}
                                                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                    title="Görseli Sil"
                                                >
                                                    <FiX className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                            <FiUpload className="w-8 h-8 text-gray-400" />
                                            <span className="mt-2 text-sm text-gray-500 text-center">
                                                Görsel Seç veya<br />Sürükle Bırak
                                            </span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">
                                        PNG, JPG, GIF dosyaları yükleyebilirsiniz.
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Önerilen boyut: 500x500px
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Temel Bilgiler</h2>
                                    <p className="text-sm text-gray-500">Ürünün temel bilgilerini girin</p>
                                </div>
                                <FiHash className="w-5 h-5 text-gray-400" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">Ürün Adı</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Örn: Taze Limonata"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">Kategori</label>
                                    <select
                                        required
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">Kategori Seçin</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">Fiyat</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (parseFloat(value) >= 0) {
                                                    setFormData({ ...formData, price: value });
                                                }
                                            }}
                                            className="w-full px-4 pr-12 py-2.5 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-right text-lg"
                                            placeholder="0.00"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <span className="text-gray-500">{getCurrencySymbol(settings.currency)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Açıklama</label>
                                <div className="relative">
                                    <div className="absolute top-3 left-4">
                                        <FiAlignLeft className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Ürün açıklaması..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Nutritional Values Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Besin Değerleri</h2>
                                    <p className="text-sm text-gray-500">Ürünün besin değerlerini girin</p>
                                </div>
                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">Kalori (kcal)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.nutritional_values.calories}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            nutritional_values: {
                                                ...formData.nutritional_values,
                                                calories: e.target.value
                                            }
                                        })}
                                        className="w-full px-4 py-2.5 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">Protein (g)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={formData.nutritional_values.protein}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            nutritional_values: {
                                                ...formData.nutritional_values,
                                                protein: e.target.value
                                            }
                                        })}
                                        className="w-full px-4 py-2.5 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="0.0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">Yağ (g)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={formData.nutritional_values.fat}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            nutritional_values: {
                                                ...formData.nutritional_values,
                                                fat: e.target.value
                                            }
                                        })}
                                        className="w-full px-4 py-2.5 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="0.0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">Karbonhidrat (g)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={formData.nutritional_values.carbohydrates}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            nutritional_values: {
                                                ...formData.nutritional_values,
                                                carbohydrates: e.target.value
                                            }
                                        })}
                                        className="w-full px-4 py-2.5 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="0.0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
} 