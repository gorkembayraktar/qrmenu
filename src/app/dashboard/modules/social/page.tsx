"use client";

import { useEffect, useState } from 'react';
import { FaInstagram, FaFacebook, FaTwitter, FaTiktok, FaYoutube, FaLinkedin, FaSnapchatGhost, FaPinterest, FaTelegram, FaWhatsapp, FaDiscord, FaTwitch, FaReddit, FaSpotify, FaMedium, FaGithub } from 'react-icons/fa';
import { FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';
import { MdDragIndicator } from 'react-icons/md';
import { supabase } from '@/utils/supabase';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Select, { components } from 'react-select';

type SocialPlatform = {
    id: string;
    name: string;
    icon: any;
    color: string;
    placeholder: string;
};

const SOCIAL_PLATFORMS: SocialPlatform[] = [
    {
        id: 'instagram',
        name: 'Instagram',
        icon: FaInstagram,
        color: 'text-pink-500',
        placeholder: 'instagram_kullanici_adi'
    },
    {
        id: 'facebook',
        name: 'Facebook',
        icon: FaFacebook,
        color: 'text-blue-600',
        placeholder: 'facebook.com/sayfaniz'
    },
    {
        id: 'twitter',
        name: 'Twitter',
        icon: FaTwitter,
        color: 'text-blue-400',
        placeholder: 'twitter_kullanici_adi'
    },
    {
        id: 'tiktok',
        name: 'TikTok',
        icon: FaTiktok,
        color: 'text-gray-900',
        placeholder: 'tiktok.com/@kullanici'
    },
    {
        id: 'youtube',
        name: 'YouTube',
        icon: FaYoutube,
        color: 'text-red-600',
        placeholder: 'youtube.com/c/kanaliniz'
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: FaLinkedin,
        color: 'text-blue-700',
        placeholder: 'linkedin.com/in/profiliniz'
    },
    {
        id: 'snapchat',
        name: 'Snapchat',
        icon: FaSnapchatGhost,
        color: 'text-yellow-400',
        placeholder: 'snapchat_kullanici'
    },
    {
        id: 'pinterest',
        name: 'Pinterest',
        icon: FaPinterest,
        color: 'text-red-500',
        placeholder: 'pinterest.com/kullanici'
    },
    {
        id: 'telegram',
        name: 'Telegram',
        icon: FaTelegram,
        color: 'text-blue-500',
        placeholder: 't.me/kullanici'
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: FaWhatsapp,
        color: 'text-green-500',
        placeholder: 'wa.me/905xxxxxxxxx'
    },
    {
        id: 'discord',
        name: 'Discord',
        icon: FaDiscord,
        color: 'text-indigo-500',
        placeholder: 'discord.gg/davetlinki'
    },
    {
        id: 'twitch',
        name: 'Twitch',
        icon: FaTwitch,
        color: 'text-purple-500',
        placeholder: 'twitch.tv/kanal'
    },
    {
        id: 'reddit',
        name: 'Reddit',
        icon: FaReddit,
        color: 'text-orange-500',
        placeholder: 'reddit.com/u/kullanici'
    },
    {
        id: 'spotify',
        name: 'Spotify',
        icon: FaSpotify,
        color: 'text-green-500',
        placeholder: 'open.spotify.com/artist/...'
    },
    {
        id: 'medium',
        name: 'Medium',
        icon: FaMedium,
        color: 'text-gray-800',
        placeholder: 'medium.com/@kullanici'
    },
    {
        id: 'github',
        name: 'GitHub',
        icon: FaGithub,
        color: 'text-gray-900',
        placeholder: 'github.com/kullanici'
    }
];

interface SocialAccount {
    id: string;
    platform: string;
    username: string;
}

interface SocialModule {
    settings: {
        social: {
            accounts: SocialAccount[];
        };
    };
    is_active: boolean;
}

function SortableAccount({ account, onRemove }: { account: SocialAccount; onRemove: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: account.id });

    const platform = SOCIAL_PLATFORMS.find(p => p.id === account.platform);
    const Icon = platform?.icon;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
        >
            <div className="flex items-center space-x-3">
                <div {...attributes} {...listeners}>
                    <MdDragIndicator className="w-5 h-5 text-gray-400 cursor-grab" />
                </div>
                <div className={`flex items-center space-x-2 ${platform?.color}`}>
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{platform?.name}</span>
                </div>
                <span className="text-gray-600">{account.username}</span>
            </div>
            <button
                onClick={() => onRemove(account.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
                <FiX className="w-5 h-5" />
            </button>
        </div>
    );
}

// Custom Option component for react-select
const Option = ({ children, ...props }: any) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.id === props.value);
    const Icon = platform?.icon;

    return (
        <components.Option {...props}>
            <div className="flex items-center space-x-2">
                <Icon className={`w-5 h-5 ${platform?.color}`} />
                <span>{children}</span>
            </div>
        </components.Option>
    );
};

export default function SocialSettingsPage() {
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
    const [accounts, setAccounts] = useState<SocialAccount[]>([]);
    const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram');
    const [newUsername, setNewUsername] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('modules')
                .select('settings, is_active')
                .eq('id', 'social')
                .single();

            if (error) throw error;
            if (data) {
                setIsActive(data.is_active);
                if (data.settings?.social?.accounts) {
                    setAccounts(data.settings.social.accounts);
                }
            }
        } catch (error) {
            console.error('Error fetching social settings:', error);
            toast.error('Ayarlar yüklenirken bir hata oluştu');
        }
    };

    const handleToggle = async () => {
        try {
            const { error } = await supabase
                .from('modules')
                .update({ is_active: !isActive })
                .eq('id', 'social');

            if (error) throw error;

            setIsActive(!isActive);
            toast.success(`Sosyal medya modülü ${!isActive ? 'aktif edildi' : 'devre dışı bırakıldı'}`);
        } catch (error) {
            console.error('Error toggling module:', error);
            toast.error('Modül durumu güncellenirken bir hata oluştu');
        }
    };

    const handleAddAccount = () => {
        if (!newUsername.trim()) {
            toast.error('Lütfen bir kullanıcı adı girin');
            return;
        }

        const newAccount = {
            id: `${selectedPlatform}-${Date.now()}`,
            platform: selectedPlatform,
            username: newUsername.trim()
        };

        setAccounts(prev => [...prev, newAccount]);
        setNewUsername('');
    };

    const handleRemoveAccount = (id: string) => {
        setAccounts(prev => prev.filter(acc => acc.id !== id));
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setAccounts((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('modules')
                .update({
                    settings: {
                        social: {
                            accounts
                        }
                    }
                })
                .eq('id', 'social');

            if (error) throw error;
            toast.success('Sosyal medya ayarları kaydedildi');
        } catch (error) {
            console.error('Error saving social settings:', error);
            toast.error('Ayarlar kaydedilirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/dashboard/modules"
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Sosyal Medya Ayarları
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Sosyal medya hesaplarınızı menünüze ekleyin
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleToggle}
                    className={`
                        shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none
                        ${isActive ? 'bg-blue-500' : 'bg-gray-200'}
                    `}
                >
                    <span className={`
                        inline-block h-5 w-5 transform rounded-full bg-white transition-transform
                        ${isActive ? 'translate-x-6' : 'translate-x-1'}
                        shadow-sm
                    `} />
                </button>
            </div>

            {/* Settings Form */}
            <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm transition-opacity ${!isActive ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="p-6 space-y-8">
                    {/* Add Account */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Hesap Ekle</h3>
                        <div className="flex space-x-3">
                            <Select
                                value={{ value: selectedPlatform, label: SOCIAL_PLATFORMS.find(p => p.id === selectedPlatform)?.name }}
                                onChange={(option: any) => setSelectedPlatform(option.value)}
                                options={SOCIAL_PLATFORMS.map(platform => ({
                                    value: platform.id,
                                    label: platform.name
                                }))}
                                components={{ Option }}
                                className="w-48"
                                classNames={{
                                    control: (state) =>
                                        `!rounded-xl !border-gray-200 ${state.isFocused ? '!border-blue-500 !ring-2 !ring-blue-500/20' : ''}`,
                                    option: (state) =>
                                        `!cursor-pointer ${state.isSelected ? '!bg-blue-500' : state.isFocused ? '!bg-blue-50' : ''}`,
                                    menu: () => "!rounded-xl !border !border-gray-100 !shadow-lg",
                                }}
                                placeholder="Platform seçin..."
                                noOptionsMessage={() => "Platform bulunamadı"}
                                isSearchable={true}
                            />
                            <div className="relative flex-1">
                                {(() => {
                                    const platform = SOCIAL_PLATFORMS.find(p => p.id === selectedPlatform);
                                    const Icon = platform?.icon;
                                    return (
                                        <>
                                            <span className={`absolute inset-y-0 left-0 pl-3 flex items-center ${platform?.color}`}>
                                                <Icon className="w-5 h-5" />
                                            </span>
                                            <input
                                                type="text"
                                                value={newUsername}
                                                onChange={(e) => setNewUsername(e.target.value)}
                                                className="pl-12 pr-4 py-2.5 w-full rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                                placeholder={platform?.placeholder}
                                            />
                                        </>
                                    );
                                })()}
                            </div>
                            <button
                                onClick={handleAddAccount}
                                className="px-4 py-2.5 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                            >
                                <FiPlus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Account List */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Hesaplarınız</h3>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={accounts.map(acc => acc.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {accounts.map((account) => (
                                        <SortableAccount
                                            key={account.id}
                                            account={account}
                                            onRemove={handleRemoveAccount}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                        {accounts.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                Henüz bir sosyal medya hesabı eklenmedi
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`
                            px-4 py-2 rounded-xl bg-blue-500 text-white font-medium 
                            hover:bg-blue-600 transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center space-x-2
                        `}
                    >
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            {!isActive && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-amber-800 text-sm">
                    Bu modül şu anda devre dışı. Ayarları düzenlemek için modülü aktif edin.
                </div>
            )}
        </div>
    );
} 