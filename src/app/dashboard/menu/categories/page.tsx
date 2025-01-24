"use client";

import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiArrowUp, FiArrowDown, FiMenu, FiAlertCircle } from 'react-icons/fi';
import { supabase } from '@/utils/supabase';
import toast from 'react-hot-toast';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Category {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
}

function SortableTableRow({ category, onEdit, onDelete }: {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: number) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: isDragging ? '#F3F4F6' : undefined,
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <tr ref={setNodeRef} style={style} className="border-b border-gray-50 last:border-0 group">
            <td className="py-4 px-6">
                <div className="flex items-center space-x-3">
                    <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 -m-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiMenu className="h-5 w-5" />
                    </div>
                    <span className="text-sm text-gray-600">{category.sort_order}</span>
                </div>
            </td>
            <td className="py-4 px-6">
                <div className="font-medium text-gray-900">{category.name}</div>
            </td>
            <td className="py-4 px-6">
                <div className="text-sm text-gray-600">{category.description || '-'}</div>
            </td>
            <td className="py-4 px-6">
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}>
                    {category.is_active ? 'Aktif' : 'Pasif'}
                </div>
            </td>
            <td className="py-4 px-6">
                <div className="flex items-center justify-end space-x-3">
                    <button
                        onClick={() => onEdit(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <FiEdit2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(category.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <FiTrash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none
                ${checked ? 'bg-blue-600' : 'bg-gray-200'}
                focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
            `}
        >
            <span
                className={`
                    inline-block h-5 w-5 transform rounded-full bg-white transition-transform
                    ${checked ? 'translate-x-6' : 'translate-x-1'}
                    shadow-sm
                `}
            />
        </button>
    );
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_active: true
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;

            setCategories(data || []);
        } catch (error) {
            console.error('Error loading categories:', error);
            toast.error('Kategoriler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Kategori adı gereklidir');
            return;
        }

        try {
            if (editingCategory) {
                const { error } = await supabase
                    .from('categories')
                    .update({
                        name: formData.name,
                        description: formData.description,
                        is_active: formData.is_active
                    })
                    .eq('id', editingCategory.id);

                if (error) throw error;
                toast.success('Kategori başarıyla güncellendi');
            } else {
                // Get max sort_order
                const maxSortOrder = Math.max(...categories.map(c => c.sort_order), 0);

                const { error } = await supabase
                    .from('categories')
                    .insert([{
                        name: formData.name,
                        description: formData.description,
                        is_active: formData.is_active,
                        sort_order: maxSortOrder + 1
                    }]);

                if (error) throw error;
                toast.success('Kategori başarıyla eklendi');
            }

            setShowModal(false);
            setEditingCategory(null);
            setFormData({ name: '', description: '', is_active: true });
            loadCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error('Kategori kaydedilirken bir hata oluştu');
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        try {
            const oldIndex = categories.findIndex((item) => item.id === active.id);
            const newIndex = categories.findIndex((item) => item.id === over.id);

            const newItems = arrayMove(categories, oldIndex, newIndex);

            // Optimistically update the UI
            setCategories(newItems);

            // Update sort orders in the database
            const updates = newItems.map((item, index) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                is_active: item.is_active,
                sort_order: index + 1
            }));

            const { error } = await supabase
                .from('categories')
                .upsert(updates);

            if (error) {
                throw error;
            }

            toast.success('Sıralama başarıyla güncellendi');
        } catch (error: any) {
            console.error('Error updating order:', error);
            toast.error(error.message || 'Sıralama güncellenirken bir hata oluştu');
            // Revert to original order
            loadCategories();
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            is_active: category.is_active
        });
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Kategori başarıyla silindi');
            loadCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Kategori silinirken bir hata oluştu');
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Kategoriler
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Menü kategorilerinizi buradan yönetebilirsiniz
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setFormData({ name: '', description: '', is_active: true });
                        setShowModal(true);
                    }}
                    className="flex items-center px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
                >
                    <FiPlus className="h-5 w-5 mr-1.5" />
                    Yeni Kategori
                </button>
            </div>

            {/* Categories List */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Sıra</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Kategori Adı</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Açıklama</th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Durum</th>
                                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-sm text-gray-600">
                                            Yükleniyor...
                                        </td>
                                    </tr>
                                ) : categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-8 text-sm text-gray-600">
                                            Henüz kategori eklenmemiş
                                        </td>
                                    </tr>
                                ) : (
                                    <SortableContext
                                        items={categories.map(cat => cat.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {categories.map((category) => (
                                            <SortableTableRow
                                                key={category.id}
                                                category={category}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                    </SortableContext>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </DndContext>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingCategory(null);
                                    setFormData({ name: '', description: '', is_active: true });
                                }}
                                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kategori Adı
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        placeholder="Kategori adını girin"
                                        required
                                    />
                                    {!formData.name && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                            <FiAlertCircle className="h-4 w-4" />
                                            Kategori adı gereklidir
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Açıklama
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                                        placeholder="Kategori açıklamasını girin (opsiyonel)"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Durum</label>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {formData.is_active ? 'Bu kategori aktif ve görünür' : 'Bu kategori pasif ve gizli'}
                                        </p>
                                    </div>
                                    <Toggle
                                        checked={formData.is_active}
                                        onChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                                    />
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingCategory(null);
                                        setFormData({ name: '', description: '', is_active: true });
                                    }}
                                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
                                >
                                    {editingCategory ? 'Güncelle' : 'Ekle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
} 