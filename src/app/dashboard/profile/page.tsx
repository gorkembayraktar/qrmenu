"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FiLock, FiSave } from 'react-icons/fi';
import { supabase } from '@/utils/supabase';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Yeni şifreler eşleşmiyor');
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error('Yeni şifre en az 6 karakter olmalıdır');
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading('Şifre güncelleniyor...');

        try {
            // Önce mevcut şifreyi kontrol et
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user?.email!,
                password: formData.currentPassword
            });

            if (signInError) {
                throw new Error('Mevcut şifre yanlış');
            }

            // Mevcut şifre doğruysa yeni şifreyi güncelle
            const { error: updateError } = await supabase.auth.updateUser({
                password: formData.newPassword
            });

            if (updateError) throw updateError;

            // Reset form
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            toast.success('Şifreniz başarıyla güncellendi', {
                id: loadingToast,
                duration: 3000
            });
        } catch (error: any) {
            console.error('Error updating password:', error);
            toast.error(error.message || 'Şifre güncellenirken bir hata oluştu', {
                id: loadingToast,
                duration: 4000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Profil Ayarları
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    Hesap bilgilerinizi ve güvenlik ayarlarınızı buradan yönetebilirsiniz
                </p>
            </div>

            {/* Content Grid */}
            <div className="grid gap-6">
                {/* Account Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Hesap Bilgileri</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    E-posta Adresi
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                                <p className="mt-2 text-xs text-gray-500">E-posta adresi değiştirilemez</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Update */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Şifre Değiştir</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mevcut Şifre
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Yeni Şifre
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Yeni Şifre (Tekrar)
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex items-center px-6 py-3 rounded-xl text-white font-medium space-x-2 
                                    ${loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                                    } transition-all shadow-lg shadow-blue-600/20`}
                            >
                                <FiLock className="h-5 w-5" />
                                <span>{loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 