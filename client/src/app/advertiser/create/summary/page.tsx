'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/common/Header';
import { useCampaign } from '@/lib/contexts/CampaignContext';
import { useUser } from '@/lib/contexts/UserContext';
import { supabase } from '@/lib/supabase/client';

const promotionTypeLabels = {
    visit: '방문형',
    takeout: '포장형',
    delivery: '배송형',
    purchase: '구매형',
};

const categoryLabels = {
    food: '맛집',
    grocery: '식품',
    beauty: '뷰티',
    travel: '여행',
    digital: '디지털',
    pet: '반려동물',
    other: '기타',
};

const channelLabels = {
    blog: '블로그',
    instagram: '인스타그램',
    blog_clip: '블로그+클립',
    clip: '클립',
    reels: '릴스',
    youtube: '유튜브',
    shorts: '쇼츠',
    tiktok: '틱톡',
};

const dayLabels = {
    mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토', sun: '일',
};

export default function SummaryPage() {
    const router = useRouter();
    const { data, resetData } = useCampaign();
    const { user } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const requiredFields = [
            data.businessName,
            data.thumbnailUrl,
            data.contactPhone,
            data.promotionType,
            data.category,
            data.channel,
            data.availableDays.length > 0,
            data.mission,
            data.keywords[0],
            data.targetVisits > 0,
            data.campaignStartDate,
            data.campaignEndDate,
            data.providedItems,
            data.providedValue > 0,
        ];

        if (requiredFields.every(Boolean)) {
            setIsValid(true);
        } else {
            router.replace('/advertiser/create/step-1');
        }
    }, [data, router]);

    const handleSubmit = async () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('campaigns')
                .insert({
                    advertiser_id: user.id,
                    title: data.businessName,
                    thumbnail_url: data.thumbnailUrl,
                    contact_phone: data.contactPhone,
                    promotion_type: data.promotionType,
                    category: data.category,
                    channel: data.channel,
                    address: data.address,
                    available_days: data.availableDays,
                    start_time: data.startTime,
                    end_time: data.endTime,
                    is_24_hours: data.is24Hours,
                    same_day_booking: data.sameDayBooking,
                    booking_notes: data.bookingNotes,
                    mission: data.mission,
                    keywords: data.keywords.filter(k => k.trim()),
                    target_visits: data.targetVisits,
                    target_dwell_time: data.targetDwellTime,
                    target_roas: data.targetROAS,
                    campaign_start_date: data.campaignStartDate,
                    campaign_end_date: data.campaignEndDate,
                    provided_items: data.providedItems,
                    provided_value: data.providedValue,
                    influencer_points: data.influencerPoints,
                    phase: 'review',
                    status: 'active'
                });

            if (error) throw error;

            resetData();
            alert('체험단이 성공적으로 등록되었습니다!');
            router.push('/advertiser/dashboard');
        } catch (error) {
            console.error('Error creating campaign:', error);
            alert('체험단 등록 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isValid) {
        return null;
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ko-KR').format(value);
    };

    const totalCost = data.providedValue + data.influencerPoints;

    return (
        <div className="min-h-screen lg:min-h-0 bg-gray-50 lg:bg-transparent pb-20 lg:pb-8">
            <Header
                title="최종 확인"
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

            <main className="p-4 lg:p-6 space-y-4">
                <div className="mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                        이대로 시작해볼게요
                    </h1>
                    <p className="text-gray-500 mt-1">
                        마지막으로 내용을 확인해주세요
                    </p>
                </div>

                {data.thumbnailUrl && (
                    <div className="rounded-xl overflow-hidden">
                        <img
                            src={data.thumbnailUrl}
                            alt="칠페인 썸네일"
                            className="w-full h-40 object-cover"
                        />
                    </div>
                )}

                <Card className="space-y-4">
                    <div className="border-b border-gray-100 pb-4">
                        <h3 className="text-sm font-medium text-blue-600 mb-3">기본 정보</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">상호명</span>
                                <span className="font-medium text-gray-900">{data.businessName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">연락처</span>
                                <span className="font-medium text-gray-900">010-{data.contactPhone.slice(0, 4)}-{data.contactPhone.slice(4)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-100 pb-4">
                        <h3 className="text-sm font-medium text-blue-600 mb-3">홍보 설정</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">유형</span>
                                <span className="font-medium text-gray-900">{data.promotionType && promotionTypeLabels[data.promotionType]}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">카테고리</span>
                                <span className="font-medium text-gray-900">{data.category && categoryLabels[data.category]}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">채널</span>
                                <span className="font-medium text-gray-900">{data.channel && channelLabels[data.channel]}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-100 pb-4">
                        <h3 className="text-sm font-medium text-blue-600 mb-3">체험 일정</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">요일</span>
                                <span className="font-medium text-gray-900">
                                    {data.availableDays.map(d => dayLabels[d as keyof typeof dayLabels]).join(', ')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">시간</span>
                                <span className="font-medium text-gray-900">
                                    {data.is24Hours ? '24시간' : `${data.startTime} ~ ${data.endTime}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-100 pb-4">
                        <h3 className="text-sm font-medium text-blue-600 mb-3">성과 목표</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">방문수 목표</span>
                                <span className="font-medium text-gray-900">{data.targetVisits?.toLocaleString()}회</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">체류시간 목표</span>
                                <span className="font-medium text-gray-900">{data.targetDwellTime}분</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">예상 ROAS</span>
                                <span className="font-medium text-gray-900">{data.targetROAS}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">칠페인 기간</span>
                                <span className="font-medium text-gray-900">{data.campaignStartDate} ~ {data.campaignEndDate}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-blue-600 mb-3">제공 내역</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">제공 금액</span>
                                <span className="font-medium text-gray-900">₩{formatCurrency(data.providedValue)}</span>
                            </div>
                            {data.influencerPoints > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">인플루언서 포인트</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(data.influencerPoints)}P</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-2 border-t border-gray-100">
                                <span className="font-medium text-gray-700">예상 총 비용</span>
                                <span className="font-bold text-blue-600">₩{formatCurrency(totalCost)}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Button
                    fullWidth
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="!py-4"
                >
                    {isSubmitting ? '등록 중...' : '체험단 등록하기'}
                </Button>
            </main>
        </div>
    );
}
