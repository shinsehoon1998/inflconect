'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
    category: string;
    channel: string;
    recruit_count: number;
    provided_value: number;
    phase: string;
    status: string;
    mission: string;
    keywords: string[];
    campaign_start_date: string;
    campaign_end_date: string;
}

interface Influencer {
    id: string;
    name: string;
    email: string;
    followers_count: number;
    blog_score: number;
    categories: string[];
    bio: string;
}

interface Proposal {
    id: string;
    influencer_id: string;
    status: string;
    created_at: string;
    influencer?: Influencer;
}

const phases = [
    { key: 'review', label: '검수중', icon: '🔍' },
    { key: 'recruiting', label: '모집', icon: '🎯' },
    { key: 'experience', label: '체험&리뷰', icon: '✏️' },
    { key: 'completed', label: '리뷰마감', icon: '✅' },
];

const promotionLabels: Record<string, string> = {
    visit: '방문형', takeout: '포장형', delivery: '배송형', purchase: '구매형',
};

const channelLabels: Record<string, string> = {
    blog: '블로그', instagram: '인스타그램', blog_clip: '블로그+클립',
    clip: '클립', reels: '릴스', youtube: '유튜브', shorts: '쇼츠', tiktok: '틱톡',
};

export default function CampaignDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useUser();
    const campaignId = params.id as string;

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [recommendedInfluencers, setRecommendedInfluencers] = useState<Influencer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sendingProposal, setSendingProposal] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!campaignId) return;

            try {
                const { data: campaignData, error: campaignError } = await supabase
                    .from('campaigns')
                    .select('*')
                    .eq('id', campaignId)
                    .single();

                if (campaignError) throw campaignError;
                setCampaign(campaignData);

                const { data: proposalData } = await supabase
                    .from('campaign_proposals')
                    .select('*')
                    .eq('campaign_id', campaignId);

                setProposals(proposalData || []);

                if (campaignData?.category) {
                    const { data: influencerData } = await supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('role', 'influencer')
                        .limit(10);

                    setRecommendedInfluencers(influencerData || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [campaignId]);

    const handleSendProposal = async (influencerId: string) => {
        if (!campaign) return;

        setSendingProposal(influencerId);
        try {
            const { error } = await supabase.from('campaign_proposals').insert({
                campaign_id: campaign.id,
                influencer_id: influencerId,
                message: `${campaign.title} 칠페인에 참여해주세요!`,
            });

            if (error) throw error;

            setProposals([...proposals, {
                id: Date.now().toString(),
                influencer_id: influencerId,
                status: 'pending',
                created_at: new Date().toISOString(),
            }]);

            alert('제안이 전송되었습니다!');
        } catch (error) {
            console.error('Error sending proposal:', error);
            alert('제안 전송 중 오류가 발생했습니다.');
        } finally {
            setSendingProposal(null);
        }
    };

    const handlePhaseChange = async (newPhase: string) => {
        if (!campaign) return;

        try {
            const { error } = await supabase
                .from('campaigns')
                .update({ phase: newPhase })
                .eq('id', campaign.id);

            if (error) throw error;

            setCampaign({ ...campaign, phase: newPhase });
            alert(`칠페인이 "${phases.find(p => p.key === newPhase)?.label}" 단계로 변경되었습니다.`);
        } catch (error) {
            console.error('Error updating phase:', error);
        }
    };

    const getCurrentPhaseIndex = () => {
        return phases.findIndex(p => p.key === campaign?.phase) || 0;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ko-KR').format(value);
    };

    if (isLoading) {
        return (
            <RoleGuard allowedRole="advertiser">
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-gray-500">로딩 중...</div>
                </div>
            </RoleGuard>
        );
    }

    if (!campaign) {
        return (
            <RoleGuard allowedRole="advertiser">
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-gray-500">칠페인을 찾을 수 없습니다.</div>
                </div>
            </RoleGuard>
        );
    }

    const currentPhaseIndex = getCurrentPhaseIndex();

    return (
        <RoleGuard allowedRole="advertiser">
            <div className="min-h-screen bg-gray-50">
                <Header
                    title="체험단 진행 상세"
                    leftAction={
                        <Button
                            variant="secondary"
                            className="px-2 h-8 text-xs bg-transparent hover:bg-gray-100"
                            onClick={() => router.back()}
                        >
                            ← 뒤로
                        </Button>
                    }
                    rightAction={
                        <div className="flex gap-2">
                            <Button variant="secondary" className="text-xs">일정 확인</Button>
                            <Button variant="primary" className="text-xs">결과보고서</Button>
                        </div>
                    }
                />

                <main className="max-w-4xl mx-auto p-4 lg:p-6">
                    <div className="flex gap-4 mb-6">
                        {campaign.thumbnail_url && (
                            <img
                                src={campaign.thumbnail_url}
                                alt={campaign.title}
                                className="w-20 h-20 rounded-xl object-cover"
                            />
                        )}
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-gray-900">{campaign.title}</h1>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                    {promotionLabels[campaign.promotion_type] || campaign.promotion_type}
                                </span>
                                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                    {channelLabels[campaign.channel] || campaign.channel}
                                </span>
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                    모집 {campaign.recruit_count}명
                                </span>
                            </div>
                        </div>
                    </div>

                    <Card className="mb-6">
                        <div className="flex items-center justify-between gap-2 py-4">
                            {phases.map((phase, index) => (
                                <div key={phase.key} className="flex-1 flex flex-col items-center">
                                    <button
                                        onClick={() => handlePhaseChange(phase.key)}
                                        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2 transition-all ${index <= currentPhaseIndex
                                                ? index === currentPhaseIndex
                                                    ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                                                    : 'bg-gray-800 text-white'
                                                : 'bg-gray-200 text-gray-400'
                                            }`}
                                    >
                                        {index < currentPhaseIndex ? '✓' : phase.icon}
                                    </button>
                                    <span className={`text-sm font-medium ${index === currentPhaseIndex ? 'text-blue-600' : 'text-gray-500'
                                        }`}>
                                        {phase.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {campaign.phase === 'recruiting' && (
                        <>
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">
                                    🎯 추천 인플루언서
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {recommendedInfluencers.map((influencer) => {
                                        const alreadySent = proposals.some(p => p.influencer_id === influencer.id);
                                        return (
                                            <Card key={influencer.id} className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                                        {influencer.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{influencer.name || '익명'}</p>
                                                        <div className="flex gap-2 mt-1">
                                                            <span className="text-xs text-gray-500">
                                                                팔로워 {formatCurrency(influencer.followers_count || 0)}
                                                            </span>
                                                            <span className="text-xs text-blue-500">
                                                                블로그지수 {influencer.blog_score?.toFixed(1) || '0.0'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant={alreadySent ? 'secondary' : 'primary'}
                                                        className="text-xs"
                                                        disabled={alreadySent || sendingProposal === influencer.id}
                                                        onClick={() => handleSendProposal(influencer.id)}
                                                    >
                                                        {alreadySent ? '제안됨' : sendingProposal === influencer.id ? '전송중...' : '제안하기'}
                                                    </Button>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-gray-500 font-medium">번호</th>
                                        <th className="px-4 py-3 text-left text-gray-500 font-medium">이름</th>
                                        <th className="px-4 py-3 text-left text-gray-500 font-medium">블로그 지수</th>
                                        <th className="px-4 py-3 text-left text-gray-500 font-medium">상태</th>
                                        <th className="px-4 py-3 text-left text-gray-500 font-medium">제안일</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proposals.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                                                아직 제안된 인플루언서가 없습니다.
                                            </td>
                                        </tr>
                                    ) : (
                                        proposals.map((proposal, index) => (
                                            <tr key={proposal.id} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="px-4 py-3">{index + 1}</td>
                                                <td className="px-4 py-3">인플루언서 #{index + 1}</td>
                                                <td className="px-4 py-3">-</td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-xs px-2 py-1 rounded ${proposal.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : proposal.status === 'accepted'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {proposal.status === 'pending' ? '대기중' :
                                                            proposal.status === 'accepted' ? '수락됨' : '거절됨'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {new Date(proposal.created_at).toLocaleDateString('ko-KR')}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </main>
            </div>
        </RoleGuard>
    );
}
