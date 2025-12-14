'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { Header } from '@/components/common/Header';
import { useCampaign } from '@/lib/contexts/CampaignContext';

export default function Step5Page() {
    const router = useRouter();
    const { data, updateData } = useCampaign();

    useEffect(() => {
        if (!data.targetVisits) {
            updateData({
                targetVisits: 1000,
                targetDwellTime: 5,
                targetROAS: 300,
            });
        }
    }, []);

    const isValid = data.campaignStartDate && data.campaignEndDate && data.targetVisits > 0;

    const handleNext = () => {
        if (isValid) {
            router.push('/advertiser/create/step-6');
        }
    };

    return (
        <div className="min-h-screen lg:min-h-0 bg-gray-50 lg:bg-transparent pb-24 lg:pb-8">
            <Header
                title="칠페인 등록"
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
                <StepIndicator currentStep={5} totalSteps={6} />

                <div className="mb-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span>
                        기본 정보
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span>
                        홍보 유형 및 채널과 카테고리
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span>
                        체험 가능 요일 및 시간
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span>
                        체험단 설정
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">5</span>
                        목표 설정
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-gray-900">🎯 성과 목표</h2>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                플레이스 방문수 목표
                            </label>
                            <div className="flex items-center gap-4">
                                <Input
                                    type="number"
                                    value={data.targetVisits || 1000}
                                    onChange={(e) => updateData({ targetVisits: parseInt(e.target.value) || 0 })}
                                    className="flex-1"
                                />
                                <span className="text-gray-500 font-medium">회</span>
                            </div>
                            <p className="text-xs text-gray-400">
                                인플루언서 콘텐츠를 통해 예상되는 플레이스 페이지 방문수
                            </p>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                평균 체류시간 목표
                            </label>
                            <div className="flex items-center gap-4">
                                <Input
                                    type="number"
                                    value={data.targetDwellTime || 5}
                                    onChange={(e) => updateData({ targetDwellTime: parseInt(e.target.value) || 0 })}
                                    className="flex-1"
                                />
                                <span className="text-gray-500 font-medium">분</span>
                            </div>
                            <p className="text-xs text-gray-400">
                                방문자가 플레이스에서 머무르는 평균 시간
                            </p>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                예상 광고효율 (ROAS)
                            </label>
                            <div className="flex items-center gap-4">
                                <Input
                                    type="number"
                                    value={data.targetROAS || 300}
                                    onChange={(e) => updateData({ targetROAS: parseInt(e.target.value) || 0 })}
                                    className="flex-1"
                                />
                                <span className="text-gray-500 font-medium">%</span>
                            </div>
                            <p className="text-xs text-gray-400">
                                광고비 대비 예상 매출 비율 (예: 300% = 1만원 투자 시 3만원 매출)
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-900">📅 칠페인 기간</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">시작일</label>
                                <Input
                                    type="date"
                                    value={data.campaignStartDate || ''}
                                    onChange={(e) => updateData({ campaignStartDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">종료일</label>
                                <Input
                                    type="date"
                                    value={data.campaignEndDate || ''}
                                    onChange={(e) => updateData({ campaignEndDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">
                            모집 기간 동안 인플루언서들이 칠페인에 지원할 수 있습니다.
                        </p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-blue-600">📋</span>
                            <span className="font-medium text-blue-900">예상 진행 일정</span>
                        </div>
                        <ul className="space-y-2 text-sm text-blue-800">
                            <li>• 모집 기간: {data.campaignStartDate || '___'} ~ {data.campaignEndDate || '___'}</li>
                            <li>• 선정 발표: 종료일 + 1일</li>
                            <li>• 체험 및 리뷰 작성: 선정 후 7일 이내</li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-purple-600">📊</span>
                            <span className="font-medium text-purple-900">예상 성과 미리보기</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 bg-white rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{(data.targetVisits || 1000).toLocaleString()}</p>
                                <p className="text-xs text-gray-500">예상 방문수</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{data.targetDwellTime || 5}분</p>
                                <p className="text-xs text-gray-500">체류시간</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                                <p className="text-2xl font-bold text-purple-600">{data.targetROAS || 300}%</p>
                                <p className="text-xs text-gray-500">ROAS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:mt-6">
                <Button
                    fullWidth
                    onClick={handleNext}
                    disabled={!isValid}
                    className="!py-4"
                >
                    다음으로
                </Button>
            </div>
        </div>
    );
}
