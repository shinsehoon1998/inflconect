'use client';

import { CampaignProvider } from '@/lib/contexts/CampaignContext';

export default function CreateCampaignLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CampaignProvider>
            <div className="min-h-screen bg-gray-50 lg:bg-gray-100">
                <div className="lg:flex lg:items-start lg:justify-center lg:py-12">
                    <div className="lg:w-full lg:max-w-2xl lg:bg-white lg:rounded-2xl lg:shadow-xl lg:shadow-gray-200/50 lg:overflow-hidden">
                        {children}
                    </div>
                </div>
            </div>
        </CampaignProvider>
    );
}
