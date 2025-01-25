import { forwardRef, ForwardedRef } from 'react';
import { FiEye } from 'react-icons/fi';
import { ThemeSettings } from '@/app/dashboard/theme/types';

interface RightPanelProps {
    settings: ThemeSettings;
    isPanelOpen: boolean;
}

const RightPanel = forwardRef(({ settings, isPanelOpen }: RightPanelProps, ref: ForwardedRef<HTMLIFrameElement>) => {
    return (
        <div className={`fixed inset-0 transition-all duration-300 ${isPanelOpen ? 'pl-[300px]' : 'pl-0'}`}>
            <iframe
                ref={ref}
                className="w-full h-full"
                src={`/?preview=true&theme=${settings.template}`}
            />
        </div>
    );
});

RightPanel.displayName = 'RightPanel';

export default RightPanel;
