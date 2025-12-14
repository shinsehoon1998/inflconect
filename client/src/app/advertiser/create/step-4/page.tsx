'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { Header } from '@/components/common/Header';
import { useCampaign } from '@/lib/contexts/CampaignContext';

export default function Step4Page() {
    const router = useRouter();
    const { data, updateData } = useCampaign();

    const handleKeywordChange = (index: number, value: string) => {
        const newKeywords = [...data.keywords];
        newKeywords[index] = value.slice(0, 10);
        updateData({ keywords: newKeywords });
    };

    const handleNext = () => {
        if (data.mission.trim() && data.keywords[0].trim()) {
            router.push('/advertiser/create/step-5');
        }
    };

    const isValid = data.mission.trim() && data.keywords[0]?.trim();

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
                <StepIndicator currentStep={4} totalSteps={6} />

                <div className="mb-6 space-y-2">
                    {['기본 정보', '홍보 유형 및 채널과 카테고리', '체험 가능 요일 및 시간'].map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span>
                            {step}
                        </div>
                    ))}
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">4</span>
                        <h1 className="text-xl font-bold text-gray-900">체험단 설정</h1>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">체험단 미션</label>
                        <p className="text-xs text-gray-500">
                            영수증 리뷰/네이버 예약은 불가합니다.<br />
                            필수 가이드(사진 개수, 글자수 등)은 리뷰노트 가이드로 진행됩니다.
                        </p>
                        <textarea
                            value={data.mission}
                            onChange={(e) => updateData({ mission: e.target.value })}
                            placeholder="홍보를 하고 싶은 키워드 위주로 명확하게 작성해 주세요!\n예시)\n- 3대 째 내려온 치킨집\n- 바삭한 식감 강조\n- 단체석, 회식, 넓은 주차장\n- 감성적인 인테리어"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={6}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">홍보할 검색 키워드</label>
                        <p className="text-xs text-gray-500">
                            키워드는 명확하게 3가지를 선택해서 작성해 주세요.
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 w-16">키워드 1*</span>
                                <Input
                                    type="text"
                                    placeholder="예) 강남역 맛집(10자 이내)"
                                    value={data.keywords[0] || ''}
                                    onChange={(e) => handleKeywordChange(0, e.target.value)}
                                    className="flex-1"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 w-16">키워드 2</span>
                                <Input
                                    type="text"
                                    placeholder="선택사항"
                                    value={data.keywords[1] || ''}
                                    onChange={(e) => handleKeywordChange(1, e.target.value)}
                                    className="flex-1"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 w-16">키워드 3</span>
                                <Input
                                    type="text"
                                    placeholder="선택사항"
                                    value={data.keywords[2] || ''}
                                    onChange={(e) => handleKeywordChange(2, e.target.value)}
                                    className="flex-1"
                                />
                            </div>
                        </div>

                        <div className="text-xs text-blue-500 space-y-1">
                            <p>*띄어쓰기까지 반영되므로 명확하게 작성해 주세요</p>
                            <p>*해당 키워드는 리뷰 순위를 체크하는데 활용됩니다</p>
                        </div>
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
