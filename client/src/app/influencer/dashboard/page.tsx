'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/common/Header';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { UI_TEXT } from '@/lib/constants/uiText';
import { supabase } from '@/lib/supabase/client';

interface Campaign {
    id: string;
    title: string;
    budget: number;
    purpose: string;
}

export default function InfluencerDashboard() {
    const router = useRouter();
    const texts = UI_TEXT.influencer.dashboard;
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const { data, error } = await supabase
                    .from('campaigns')
                    .select('id, title, budget, purpose')
                    .eq('status', 'active')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data) setCampaigns(data);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    return (
        <RoleGuard allowedRole="influencer">
            <div className="min-h-screen bg-gray-50 pb-20">
                <Header
                    title="대시보드"
                    rightAction={
                        <Button
                            variant="secondary"
                            className="px-2 h-8 text-xs bg-transparent hover:bg-gray-100"
                            onClick={() => { }}
                        >
                            설정
                        </Button>
                    }
                />

                <main className="p-4 space-y-6">
                    <section>
                        <Card>
                            <h2 className="font-bold text-lg mb-2 text-gray-900">
                                {texts.earnings}
                            </h2>
                            <div className="py-4">
                                <p className="text-3xl font-bold text-blue-600">150,000원</p>
                                <p className="text-xs text-gray-400 mt-1">지난 달보다 3만원 더 벌었어요</p>
                            </div>
                        </Card>
                    </section>

                    <section>
                        <div className="mb-3 px-1">
                            <h2 className="font-bold text-lg text-gray-900">
                                {texts.available_campaigns}
                            </h2>
                        </div>

                        {isLoading ? (
                            <div className="py-12 text-center text-gray-400">
                                <p>로딩 중...</p>
                            </div>
                        ) : campaigns.length === 0 ? (
                            <Card className="border-dashed bg-gray-50 shadown-none">
                                <div className="py-12 text-center text-gray-400">
                                    <p>아직 새로운 칠페인이 없어요</p>
                                </div>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {campaigns.map((campaign) => (
                                    <Card key={campaign.id} className="active:scale-[0.98] transition-transform" onClick={() => router.push(`/influencer/campaign/${campaign.id}`)}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-gray-900 line-clamp-1">{campaign.title}</h3>
                                            <span className="text-blue-600 font-bold whitespace-nowrap text-sm">
                                                {campaign.budget.toLocaleString()}원
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                            {UI_TEXT.advertiser.create.purposes[campaign.purpose as keyof typeof UI_TEXT.advertiser.create.purposes] || campaign.purpose}
                                        </p>
                                        <Button size="sm" fullWidth variant="outline">
                                            자세히 보기
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </RoleGuard>
    );
}
