'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/common/Header';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { UI_TEXT } from '@/lib/constants/uiText';
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
    status: string;
    created_at: string;
    campaign_start_date: string;
    campaign_end_date: string;
}

const promotionLabels: Record<string, string> = {
    visit: '방문형', takeout: '포장형', delivery: '배송형', purchase: '구매형',
};

const channelLabels: Record<string, string> = {
    blog: '블로그', instagram: '인스타그램', blog_clip: '블로그+클립',
    clip: '클립', reels: '릴스', youtube: '유튜브', shorts: '쇼츠', tiktok: '틱톡',
};

export default function AdvertiserDashboard() {
    const router = useRouter();
    const { user, logout } = useUser();
    const texts = UI_TEXT.advertiser.dashboard;
    const createTexts = UI_TEXT.advertiser.create;

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pointBalance, setPointBalance] = useState(0);
    const [showChargeModal, setShowChargeModal] = useState(false);
    const [chargeAmount, setChargeAmount] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                const { data: campaignData, error: campaignError } = await supabase
                    .from('campaigns')
                    .select('*')
                    .eq('advertiser_id', user.id)
                    .order('created_at', { ascending: false });

                if (campaignError) throw campaignError;
                setCampaigns(campaignData || []);

                const { data: profileData } = await supabase
                    .from('user_profiles')
                    .select('point_balance')
                    .eq('id', user.id)
                    .single();

                if (profileData) {
                    setPointBalance(profileData.point_balance || 0);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleCharge = async () => {
        const amount = parseInt(chargeAmount.replace(/[^0-9]/g, ''));
        if (!amount || amount < 1000) {
            alert('최소 1,000원 이상 충전해주세요.');
            return;
        }

        try {
            const newBalance = pointBalance + amount;
            await supabase
                .from('user_profiles')
                .update({ point_balance: newBalance })
                .eq('id', user?.id);

            await supabase.from('point_transactions').insert({
                user_id: user?.id,
                amount,
                type: 'charge',
                description: '포인트 충전',
            });

            setPointBalance(newBalance);
            setShowChargeModal(false);
            setChargeAmount('');
            alert(`${amount.toLocaleString()}원이 충전되었습니다!`);
        } catch (error) {
            console.error('Charge error:', error);
            alert('충전 중 오류가 발생했습니다.');
        }
    };

    const activeCampaigns = campaigns.filter(c => c.status === 'active');
    const completedCampaigns = campaigns.filter(c => c.status === 'completed');

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
    };

    const totalValue = activeCampaigns.reduce((sum, c) => sum + (c.provided_value || 0), 0);

    const Sidebar = () => (
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
            <div className="flex items-center h-16 px-6 border-b border-gray-100">
                <h1 className="text-xl font-bold text-gray-900">InfConnect</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl bg-blue-50 text-blue-600 font-medium">
                    <span>📊</span> 대시보드
                </button>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                    onClick={() => router.push('/advertiser/create')}
                >
                    <span>➕</span> 새 광고 만들기
                </button>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                    onClick={() => router.push('/advertiser/analytics')}
                >
                    <span>📈</span> 성과 분석
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                    <span>⚙️</span> 설정
                </button>
            </nav>
            <div className="p-4 border-t border-gray-100 space-y-3">
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">광고 포인트</p>
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-blue-600">{formatCurrency(pointBalance)}</p>
                        <button
                            onClick={() => setShowChargeModal(true)}
                            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            충전
                        </button>
                    </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">로그인 계정</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                >
                    <span>🚪</span> 로그아웃
                </button>
            </div>
        </aside>
    );

    const StatCard = ({ title, value, subtext, color = 'blue' }: { title: string; value: string; subtext?: string; color?: string }) => (
        <div className={`p-6 rounded-2xl bg-gradient-to-br ${color === 'blue' ? 'from-blue-500 to-blue-600' : color === 'green' ? 'from-green-500 to-green-600' : 'from-purple-500 to-purple-600'} text-white`}>
            <p className="text-sm opacity-80 mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {subtext && <p className="text-sm opacity-70 mt-1">{subtext}</p>}
        </div>
    );

    const CampaignCard = ({ campaign, isActive }: { campaign: Campaign; isActive: boolean }) => (
        <div
            className={`rounded-2xl border transition-all hover:shadow-md cursor-pointer overflow-hidden ${isActive ? 'bg-white border-blue-100 hover:border-blue-200' : 'bg-gray-50 border-gray-100'}`}
            onClick={() => router.push(`/advertiser/campaign/${campaign.id}`)}
        >
            {campaign.thumbnail_url && (
                <img src={campaign.thumbnail_url} alt={campaign.title} className="w-full h-32 object-cover" />
            )}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{campaign.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>
                        {isActive ? '진행중' : '완료'}
                    </span>
                </div>
                <div className="flex gap-2 flex-wrap mb-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{promotionLabels[campaign.promotion_type] || campaign.promotion_type}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{channelLabels[campaign.channel] || campaign.channel}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">모집 {campaign.recruit_count}명</span>
                    <span className={`font-semibold ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>{formatCurrency(campaign.provided_value || 0)}</span>
                </div>
            </div>
        </div>
    );

    return (
        <RoleGuard allowedRole="advertiser">
            <div className="min-h-screen bg-gray-50">
                <Sidebar />

                <div className="lg:hidden">
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
                </div>

                <main className="lg:pl-64">
                    <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-white border-b border-gray-100">
                        <h1 className="text-xl font-bold text-gray-900">광고 관리</h1>
                        <Button onClick={() => router.push('/advertiser/create')}>
                            + 새 광고 만들기
                        </Button>
                    </header>

                    <div className="p-4 lg:p-8 pb-24 lg:pb-8 space-y-6 lg:space-y-8">
                        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                            <StatCard
                                title="진행 중인 광고"
                                value={`${activeCampaigns.length}개`}
                                subtext="현재 노출 중"
                                color="blue"
                            />
                            <StatCard
                                title="총 제공 가치"
                                value={formatCurrency(totalValue)}
                                subtext="모든 칠페인 합계"
                                color="green"
                            />
                            <StatCard
                                title="완료된 광고"
                                value={`${completedCampaigns.length}개`}
                                subtext="종료된 칠페인"
                                color="purple"
                            />
                        </section>

                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-lg lg:text-xl text-gray-900">
                                    {texts.active_campaigns} ({activeCampaigns.length})
                                </h2>
                            </div>
                            {isLoading ? (
                                <Card><p className="py-8 text-center text-gray-400">로딩 중...</p></Card>
                            ) : activeCampaigns.length === 0 ? (
                                <Card>
                                    <div className="py-12 text-center">
                                        <p className="text-5xl mb-4">📢</p>
                                        <p className="text-gray-500 mb-4">아직 진행 중인 광고가 없어요</p>
                                        <Button onClick={() => router.push('/advertiser/create')}>
                                            첫 광고 시작하기
                                        </Button>
                                    </div>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {activeCampaigns.map((campaign) => (
                                        <CampaignCard key={campaign.id} campaign={campaign} isActive={true} />
                                    ))}
                                </div>
                            )}
                        </section>

                        <section>
                            <h2 className="font-bold text-lg lg:text-xl text-gray-900 mb-4">
                                {texts.past_results} ({completedCampaigns.length})
                            </h2>
                            {completedCampaigns.length === 0 ? (
                                <Card>
                                    <div className="py-8 text-center text-gray-400">
                                        <p>아직 완료된 광고가 없어요</p>
                                    </div>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {completedCampaigns.map((campaign) => (
                                        <CampaignCard key={campaign.id} campaign={campaign} isActive={false} />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </main>

                <div className="lg:hidden fixed bottom-6 left-4 right-4">
                    <Button
                        fullWidth
                        className="shadow-lg shadow-blue-600/30"
                        onClick={() => router.push('/advertiser/create')}
                    >
                        {texts.create_new}
                    </Button>
                </div>

                {showChargeModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">포인트 충전</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">충전 금액</label>
                                    <input
                                        type="text"
                                        value={chargeAmount}
                                        onChange={(e) => setChargeAmount(e.target.value.replace(/[^0-9]/g, ''))}
                                        placeholder="최소 1,000원"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex gap-3 flex-wrap">
                                    {[10000, 30000, 50000, 100000].map((amount) => (
                                        <button
                                            key={amount}
                                            onClick={() => setChargeAmount(amount.toString())}
                                            className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:border-blue-500 hover:text-blue-600"
                                        >
                                            +{(amount / 10000).toLocaleString()}만원
                                        </button>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500">
                                    충전 후 잔액: {formatCurrency(pointBalance + (parseInt(chargeAmount) || 0))}
                                </p>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <Button
                                    variant="secondary"
                                    fullWidth
                                    onClick={() => {
                                        setShowChargeModal(false);
                                        setChargeAmount('');
                                    }}
                                >
                                    취소
                                </Button>
                                <Button fullWidth onClick={handleCharge}>
                                    충전하기
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </RoleGuard>
    );
}
