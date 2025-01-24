import { FiEye } from 'react-icons/fi';
import { ThemeSettings } from '@/app/dashboard/theme/types';
import { useRef, useEffect } from 'react';

interface RightPanelProps {
    settings: ThemeSettings;
    isPanelOpen: boolean;
}

export default function RightPanel({ settings, isPanelOpen }: RightPanelProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current) {
            iframeRef.current.src = `/?preview=true&theme=${settings.template}`;
        }
    }, [settings.template]);

    return (
        <div className={`fixed inset-0 lg:left-[320px] transition-all duration-300 ${isPanelOpen ? 'lg:left-[320px]' : 'left-0'}`}>
            <div className="h-full p-4 lg:p-6 overflow-auto">
                <div className="bg-white h-full rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FiEye className="w-5 h-5" />
                        Canlı Önizleme
                        <span className="text-xs text-gray-500 font-normal ml-2">
                            ({settings.template === 'elegance' ? 'v1' : settings.template === 'modern-feast' ? 'v2' : 'v3'})
                        </span>
                    </h2>
                    <div className="w-full h-[calc(100%-3rem)] bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                        <iframe
                            ref={iframeRef}
                            className="w-full h-full"
                            style={{ border: 'none' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
