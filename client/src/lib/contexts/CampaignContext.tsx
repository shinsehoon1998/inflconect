'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PromotionType = 'visit' | 'takeout' | 'delivery' | 'purchase' | null;
export type Category = 'food' | 'grocery' | 'beauty' | 'travel' | 'digital' | 'pet' | 'other' | null;
export type Channel = 'blog' | 'instagram' | 'blog_clip' | 'clip' | 'reels' | 'youtube' | 'shorts' | 'tiktok' | null;

interface CampaignData {
    businessName: string;
    thumbnailUrl: string;
    contactPhone: string;
    promotionType: PromotionType;
    category: Category;
    channel: Channel;
    address: string;
    availableDays: string[];
    startTime: string;
    endTime: string;
    is24Hours: boolean;
    sameDayBooking: boolean;
    bookingNotes: string;
    mission: string;
    keywords: string[];
    targetVisits: number;
    targetDwellTime: number;
    targetROAS: number;
    campaignStartDate: string;
    campaignEndDate: string;
    providedItems: string;
    providedValue: number;
    influencerPoints: number;
}

interface CampaignContextType {
    data: CampaignData;
    updateData: (updates: Partial<CampaignData>) => void;
    resetData: () => void;
}

const defaultData: CampaignData = {
    businessName: '',
    thumbnailUrl: '',
    contactPhone: '',
    promotionType: null,
    category: null,
    channel: null,
    address: '',
    availableDays: [],
    startTime: '',
    endTime: '',
    is24Hours: false,
    sameDayBooking: false,
    bookingNotes: '',
    mission: '',
    keywords: ['', '', ''],
    targetVisits: 1000,
    targetDwellTime: 5,
    targetROAS: 300,
    campaignStartDate: '',
    campaignEndDate: '',
    providedItems: '',
    providedValue: 0,
    influencerPoints: 0,
};

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<CampaignData>(defaultData);

    useEffect(() => {
        const saved = localStorage.getItem('campaign_draft_v2');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setData({ ...defaultData, ...parsed });
            } catch (e) {
                console.error('Failed to parse campaign draft', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('campaign_draft_v2', JSON.stringify(data));
    }, [data]);

    const updateData = (updates: Partial<CampaignData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const resetData = () => {
        setData(defaultData);
        localStorage.removeItem('campaign_draft_v2');
    };

    return (
        <CampaignContext.Provider value={{ data, updateData, resetData }}>
            {children}
        </CampaignContext.Provider>
    );
}

export function useCampaign() {
    const context = useContext(CampaignContext);
    if (context === undefined) {
        throw new Error('useCampaign must be used within a CampaignProvider');
    }
    return context;
}
