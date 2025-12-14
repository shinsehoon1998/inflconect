'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { Header } from '@/components/common/Header';
import { useCampaign } from '@/lib/contexts/CampaignContext';

export default function Step6Page() {
    const router = useRouter();
    const { data, updateData } = useCampaign();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ko-KR').format(value);
    };

    const handleValueChange = (field: 'providedValue' | 'influencerPoints', value: string) => {
        const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
        updateData({ [field]: numValue });
    };

    const handleNext = () => {
        if (data.providedItems.trim() && data.providedValue > 0) {
            router.push('/advertiser/create/summary');
        }
    };

    const isValid = data.providedItems.trim() && data.providedValue > 0;
    const totalCost = data.providedValue + data.influencerPoints;

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
                <StepIndicator currentStep={6} totalSteps={6} />

                <div className="mb-6 space-y-2">
                    {['기본 정보', '홍보 유형 및 채널과 카테고리', '체험 가능 요일 및 시간', '체험단 설정', '목표 설정'].map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span>
                            {step}
                        </div>
                    ))}
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">6</span>
                        <h1 className="text-xl font-bold text-gray-900">제공 내역 및 포인트 결제</h1>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">제공 내역</label>
                        <p className="text-xs text-gray-500">
                            인플루언서에게 무료로 제공하는 상품/서비스를 설명해 주세요.
                        </p>
                        <textarea
                            value={data.providedItems}
                            onChange={(e) => updateData({ providedItems: e.target.value })}
                            placeholder="예) 코스요리 2인 (100,000원 상당)\n예) 샴푸 + 린스 세트 (30,000원 상당)"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">제공 금액 (원)</label>
                        <p className="text-xs text-gray-500">
                            제공하는 상품/서비스의 금액을 입력해 주세요.
                        </p>
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="0"
                                value={data.providedValue > 0 ? formatCurrency(data.providedValue) : ''}
                                onChange={(e) => handleValueChange('providedValue', e.target.value)}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">원</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            인플루언서 포인트 <span className="text-gray-400 font-normal">(선택)</span>
                        </label>
                        <p className="text-xs text-gray-500">
                            추가 지급 포인트가 있으면 지원률이 높아집니다.
                        </p>
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="0"
                                value={data.influencerPoints > 0 ? formatCurrency(data.influencerPoints) : ''}
                                onChange={(e) => handleValueChange('influencerPoints', e.target.value)}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">P</span>
                        </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
                        <h3 className="font-medium mb-3">💰 예상 비용 요약</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="opacity-80">제공 금액</span>
                                <span>₩{formatCurrency(data.providedValue)}</span>
                            </div>
                            {data.influencerPoints > 0 && (
                                <div className="flex justify-between">
                                    <span className="opacity-80">인플루언서 포인트</span>
                                    <span>{formatCurrency(data.influencerPoints)}P</span>
                                </div>
                            )}
                            <div className="border-t border-white/20 pt-2 mt-2 flex justify-between text-lg font-bold">
                                <span>예상 총 비용</span>
                                <span>₩{formatCurrency(totalCost)}</span>
                            </div>
                        </div>
                        <p className="text-xs opacity-70 mt-3">
                            * 인플루언서 매칭 후 실제 비용이 확정됩니다.
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <Button
                        fullWidth
                        disabled={!isValid}
                        onClick={handleNext}
                    >
                        최종 확인하기
                    </Button>
                </div>
            </main>
        </div>
    );
}
