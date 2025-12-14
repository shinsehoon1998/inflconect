'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { Header } from '@/components/common/Header';
import { useCampaign, PromotionType, Category, Channel } from '@/lib/contexts/CampaignContext';

const promotionTypes: { key: Exclude<PromotionType, null>; label: string; desc: string; icon: string }[] = [
    { key: 'visit', label: '방문형', desc: '매장을 방문하고 체험 후 리뷰 작성', icon: '🍔' },
    { key: 'takeout', label: '포장형', desc: '방문 후 포장하여 리뷰 작성', icon: '📦' },
    { key: 'delivery', label: '배송형', desc: '배송받은 제품 사용 후 리뷰 작성', icon: '🚚' },
    { key: 'purchase', label: '구매형', desc: '제품 구매 후 리뷰, 구매평 리뷰 작성', icon: '🛒' },
];

const categories: { key: Exclude<Category, null>; label: string }[] = [
    { key: 'food', label: '맛집' },
    { key: 'grocery', label: '식품' },
    { key: 'beauty', label: '뷰티' },
    { key: 'travel', label: '여행' },
    { key: 'digital', label: '디지털' },
    { key: 'pet', label: '반려동물' },
    { key: 'other', label: '기타' },
];

const channels: { key: Exclude<Channel, null>; label: string; desc: string; premium?: boolean }[] = [
    { key: 'blog', label: '블로그', desc: '블로그 게시물 1건 업로드' },
    { key: 'instagram', label: '인스타그램', desc: '사진 3장 이상의 피드 게시물 1개 업로드' },
    { key: 'blog_clip', label: '블로그+클립', desc: '1회 체험으로 블로그 게시물 1건+15초 영상(클립) 1개', premium: true },
    { key: 'clip', label: '클립', desc: '30초 영상(클립) 1개 업로드', premium: true },
    { key: 'reels', label: '릴스', desc: '30초 이상의 영상(릴스) 1개 업로드', premium: true },
    { key: 'youtube', label: '유튜브', desc: '3분 이상의 영상(유튜브) 1개 업로드', premium: true },
    { key: 'shorts', label: '쇼츠', desc: '30초 이상의 영상(유튜브 쇼츠) 1개 업로드', premium: true },
    { key: 'tiktok', label: '틱톡', desc: '30초 이상의 영상(틱톡) 1개 업로드', premium: true },
];

export default function Step2Page() {
    const router = useRouter();
    const { data, updateData } = useCampaign();

    const handleNext = () => {
        if (data.promotionType && data.category && data.channel) {
            router.push('/advertiser/create/step-3');
        }
    };

    const isValid = data.promotionType && data.category && data.channel;
    const showAddress = data.promotionType === 'visit' || data.promotionType === 'takeout';

    return (
        <div className="min-h-screen lg:min-h-0 bg-gray-50 lg:bg-transparent pb-20 lg:pb-8">
            <Header
                title="체험단 등록"
                leftAction={
                    <Button
                        variant="secondary"
                        className="px-2 h-8 text-xs bg-transparent hover:bg-gray-100"
                        onClick={() => router.back()}
                    >
                        이전
                    </Button>
                }
            />

            <main className="p-4 lg:p-6">
                <StepIndicator currentStep={2} totalSteps={6} />

                <div className="mb-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span>
                        기본 정보
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</span>
                        <h1 className="text-xl font-bold text-gray-900">홍보 유형 및 채널과 카테고리</h1>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-3">
                        {promotionTypes.map((type) => (
                            <button
                                key={type.key}
                                onClick={() => updateData({ promotionType: type.key })}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${data.promotionType === type.key
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-2xl mb-2">{type.icon}</div>
                                <div className={`font-medium ${data.promotionType === type.key ? 'text-blue-600' : 'text-gray-900'}`}>
                                    {type.label}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
                            </button>
                        ))}
                    </div>

                    {showAddress && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-blue-600">주소</label>
                            <Input
                                type="text"
                                placeholder="주소를 입력해 주세요"
                                value={data.address}
                                onChange={(e) => updateData({ address: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-blue-600">카테고리</label>
                        <select
                            value={data.category || ''}
                            onChange={(e) => updateData({ category: (e.target.value || null) as Category })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">선택</option>
                            {categories.map((cat) => (
                                <option key={cat.key} value={cat.key}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-blue-600">채널</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {channels.map((ch) => (
                                <label
                                    key={ch.key}
                                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${data.channel === ch.key
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="channel"
                                        value={ch.key}
                                        checked={data.channel === ch.key}
                                        onChange={() => updateData({ channel: ch.key })}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">{ch.label}</span>
                                            {ch.premium && (
                                                <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded font-medium">P</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{ch.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {channels.some(c => c.premium) && (
                            <div className="p-4 bg-purple-50 rounded-xl text-sm">
                                <p className="font-medium text-purple-700 flex items-center gap-2">
                                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded text-xs">P</span>
                                    프리미엄 체험단이란?
                                </p>
                                <p className="text-purple-600 mt-1">
                                    인플루언서에게 포인트가 필수로 지급되는 체험단입니다.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8">
                    <Button
                        fullWidth
                        disabled={!isValid}
                        onClick={handleNext}
                    >
                        다음으로
                    </Button>
                </div>
            </main>
        </div>
    );
}
