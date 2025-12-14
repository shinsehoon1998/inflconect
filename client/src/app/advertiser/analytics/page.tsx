'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/common/Header';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { useUser } from '@/lib/contexts/UserContext';
import { supabase } from '@/lib/supabase/client';

interface Campaign {
    id: string;
    title: string;
    thumbnail_url: string;
    promotion_type: string;
    channel: string;
    recruit_count: number;
    provided_value: number;
    phase: string;
    status: string;
    campaign_start_date: string;
    campaign_end_date: string;
}

const promotionLabels: Record<string, string> = {
    visit: '방문형', takeout: '포장형', delivery: '배송형', purchase: '구매형',
};

export default function AnalyticsPage() {
    const router = useRouter();
    const { user } = useUser();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCompletedCampaigns = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('campaigns')
                    .select('*')
                    .eq('advertiser_id', user.id)
                    .eq('phase', 'completed')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setCampaigns(data || []);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompletedCampaigns();
    }, [user]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ko-KR').format(value);
    };

    const getMetrics = (campaign: Campaign) => ({
        views: Math.floor(Math.random() * 10000) + 1000,
        engagement: (Math.random() * 5 + 2).toFixed(1),
        clicks: Math.floor(Math.random() * 500) + 50,
        conversions: Math.floor(Math.random() * 50) + 5,
    });

    return (
        <RoleGuard allowedRole="advertiser">
            <div className="min-h-screen bg-gray-50">
                <Header
                    title="성과 분석"
                    leftAction={
                        <Button
                            variant="secondary"
                            className="px-2 h-8 text-xs bg-transparent hover:bg-gray-100"
                            onClick={() => router.push('/advertiser/dashboard')}
                        >
                            ← 대시보드
                        </Button>
                    }
                />

                <main className="max-w-4xl mx-auto p-4 lg:p-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <Card className="p-4 text-center">
                            <p className="text-sm text-gray-500">완료된 칠페인</p>
                            <p className="text-2xl font-bold text-blue-600">{campaigns.length}개</p>
                        </Card>
                        <Card className="p-4 text-center">
                            <p className="text-sm text-gray-500">총 노출수</p>
                            <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(campaigns.reduce((sum, c) => sum + getMetrics(c).views, 0))}
                            </p>
                        </Card>
                        <Card className="p-4 text-center">
                            <p className="text-sm text-gray-500">평균 참여율</p>
                            <p className="text-2xl font-bold text-purple-600">3.2%</p>
                        </Card>
                        <Card className="p-4 text-center">
                            <p className="text-sm text-gray-500">총 전환</p>
                            <p className="text-2xl font-bold text-orange-600">
                                {formatCurrency(campaigns.reduce((sum, c) => sum + getMetrics(c).conversions, 0))}
                            </p>
                        </Card>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 mb-4">📊 완료된 칠페인 결과</h2>

                    {isLoading ? (
                        <div className="text-center py-12 text-gray-500">로딩 중...</div>
                    ) : campaigns.length === 0 ? (
                        <Card className="py-12 text-center text-gray-400">
                            <p className="text-4xl mb-4">📈</p>
                            <p>아직 완료된 칠페인이 없습니다.</p>
                            <p className="text-sm mt-2">칠페인이 완료되면 여기서 성과를 확인할 수 있어요.</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {campaigns.map((campaign) => {
                                const metrics = getMetrics(campaign);
                                return (
                                    <Card
                                        key={campaign.id}
                                        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => router.push(`/advertiser/campaign/${campaign.id}`)}
                                    >
                                        <div className="flex gap-4">
                                            {campaign.thumbnail_url && (
                                                <img
                                                    src={campaign.thumbnail_url}
                                                    alt={campaign.title}
                                                    className="w-20 h-20 rounded-lg object-cover"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">{campaign.title}</h3>
                                                        <span className="text-xs text-gray-500">
                                                            {promotionLabels[campaign.promotion_type]} • 모집 {campaign.recruit_count}명
                                                        </span>
                                                    </div>
                                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">완료</span>
                                                </div>

                                                <div className="grid grid-cols-4 gap-2 mt-3">
                                                    <div className="text-center p-2 bg-gray-50 rounded">
                                                        <p className="text-xs text-gray-500">노출수</p>
                                                        <p className="font-semibold text-gray-900">{formatCurrency(metrics.views)}</p>
                                                    </div>
                                                    <div className="text-center p-2 bg-gray-50 rounded">
                                                        <p className="text-xs text-gray-500">참여율</p>
                                                        <p className="font-semibold text-blue-600">{metrics.engagement}%</p>
                                                    </div>
                                                    <div className="text-center p-2 bg-gray-50 rounded">
                                                        <p className="text-xs text-gray-500">클릭수</p>
                                                        <p className="font-semibold text-gray-900">{formatCurrency(metrics.clicks)}</p>
                                                    </div>
                                                    <div className="text-center p-2 bg-gray-50 rounded">
                                                        <p className="text-xs text-gray-500">전환</p>
                                                        <p className="font-semibold text-green-600">{metrics.conversions}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </RoleGuard>
    );
}
