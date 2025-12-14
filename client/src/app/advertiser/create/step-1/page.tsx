'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { Header } from '@/components/common/Header';
import { useCampaign } from '@/lib/contexts/CampaignContext';

export default function Step1Page() {
    const router = useRouter();
    const { data, updateData } = useCampaign();

    const handleNext = () => {
        if (data.businessName && data.thumbnailUrl && data.contactPhone) {
            router.push('/advertiser/create/step-2');
        }
    };

    const isValid = data.businessName.trim() && data.thumbnailUrl && data.contactPhone.trim();

    return (
        <div className="min-h-screen lg:min-h-0 bg-gray-50 lg:bg-transparent pb-20 lg:pb-8">
            <Header
                title="체험단 등록"
                leftAction={
                    <Button
                        variant="secondary"
                        className="px-2 h-8 text-xs bg-transparent hover:bg-gray-100"
                        onClick={() => router.push('/advertiser/dashboard')}
                    >
                        취소
                    </Button>
                }
            />

            <main className="p-4 lg:p-6">
                <StepIndicator currentStep={1} totalSteps={6} />

                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</span>
                        <h1 className="text-xl font-bold text-gray-900">기본 정보</h1>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">상호명</label>
                        <p className="text-xs text-gray-500">방문형/포장형의 경우 네이버 플레이스에 등록되어 있는 업체명으로 입력해 주세요</p>
                        <Input
                            type="text"
                            placeholder="상호명을 작성해 주세요"
                            value={data.businessName}
                            onChange={(e) => updateData({ businessName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">썸네일 등록</label>
                        <ImageUploader
                            value={data.thumbnailUrl}
                            onChange={(url) => updateData({ thumbnailUrl: url })}
                        />
                        <p className="text-xs text-blue-500">
                            검수 불가 사진: 간판 / 로고 / 화면 측쳐 / 텍스트가 크게 들어간 이미지
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">담당자 연락처</label>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">010 -</span>
                            <Input
                                type="tel"
                                placeholder="0000"
                                value={data.contactPhone.slice(0, 4)}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                    const rest = data.contactPhone.slice(4);
                                    updateData({ contactPhone: val + rest });
                                }}
                                className="w-24"
                            />
                            <span className="text-gray-400">-</span>
                            <Input
                                type="tel"
                                placeholder="0000"
                                value={data.contactPhone.slice(4, 8)}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                                    const first = data.contactPhone.slice(0, 4);
                                    updateData({ contactPhone: first + val });
                                }}
                                className="w-24"
                            />
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
