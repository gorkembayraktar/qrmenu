import { FiSave, FiChevronLeft } from 'react-icons/fi';
import { ThemeSettings } from '@/app/dashboard/theme/types';

interface LeftPanelProps {
    settings: ThemeSettings;
    setSettings: (settings: ThemeSettings) => void;
    isSaving: boolean;
    handleSave: () => void;
    isPanelOpen: boolean;
    setIsPanelOpen: (isOpen: boolean) => void;
    router: any;
}

export default function LeftPanel({
    settings,
    setSettings,
    isSaving,
    handleSave,
    isPanelOpen,
    setIsPanelOpen,
    router
}: LeftPanelProps) {
    return (
        <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-transform duration-300 z-20 w-[320px] 
            ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="h-full flex flex-col relative">
                {/* Panel Header */}
                <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
                    <h2 className="text-lg font-semibold">Tema Ayarları</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                router.push('/dashboard');
                            }}
                            className="flex items-center justify-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-200"
                        >
                            Vazgeç
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center justify-center gap-1 bg-indigo-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <FiSave className="w-4 h-4" />
                            {isSaving ? 'Kaydediliyor' : 'Kaydet'}
                        </button>
                        <button
                            onClick={() => setIsPanelOpen(false)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <FiChevronLeft className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Panel Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-6">
                        {/* Şablon Seçimi */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <h3 className="text-base font-medium text-gray-900 mb-3">
                                Şablon
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {/* Elegance */}
                                <button
                                    onClick={() => setSettings({ ...settings, template: 'elegance' })}
                                    className={`flex flex-col items-center p-2 border rounded-lg transition-all
                                        ${settings.template === 'elegance'
                                            ? 'border-indigo-600 bg-indigo-50'
                                            : 'border-gray-200 hover:border-indigo-200'}`}
                                >
                                    <span className={`text-sm font-medium ${settings.template === 'elegance' ? 'text-indigo-600' : 'text-gray-600'}`}>
                                        Elegance
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">v1</span>
                                </button>

                                {/* Modern Feast */}
                                <button
                                    onClick={() => setSettings({ ...settings, template: 'modern-feast' })}
                                    className={`flex flex-col items-center p-2 border rounded-lg transition-all
                                        ${settings.template === 'modern-feast'
                                            ? 'border-indigo-600 bg-indigo-50'
                                            : 'border-gray-200 hover:border-indigo-200'}`}
                                >
                                    <span className={`text-sm font-medium ${settings.template === 'modern-feast' ? 'text-indigo-600' : 'text-gray-600'}`}>
                                        Modern Feast
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">v2</span>
                                </button>

                                {/* Classic Bistro */}
                                <button
                                    onClick={() => setSettings({ ...settings, template: 'classic-bistro' })}
                                    className={`flex flex-col items-center p-2 border rounded-lg transition-all
                                        ${settings.template === 'classic-bistro'
                                            ? 'border-indigo-600 bg-indigo-50'
                                            : 'border-gray-200 hover:border-indigo-200'}`}
                                >
                                    <span className={`text-sm font-medium ${settings.template === 'classic-bistro' ? 'text-indigo-600' : 'text-gray-600'}`}>
                                        Classic Bistro
                                    </span>
                                    <span className="text-xs text-gray-500 mt-1">v3</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
