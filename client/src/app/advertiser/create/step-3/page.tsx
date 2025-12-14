'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { Header } from '@/components/common/Header';
import { useCampaign } from '@/lib/contexts/CampaignContext';

const daysOfWeek = [
    { key: 'mon', label: '월' },
    { key: 'tue', label: '화' },
    { key: 'wed', label: '수' },
    { key: 'thu', label: '목' },
    { key: 'fri', label: '금' },
    { key: 'sat', label: '토' },
    { key: 'sun', label: '일' },
];

const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return { value: `${hour}:00`, label: `${hour}:00` };
});

export default function Step3Page() {
    const router = useRouter();
    const { data, updateData } = useCampaign();

    const handleDayToggle = (day: string) => {
        const newDays = data.availableDays.includes(day)
            ? data.availableDays.filter(d => d !== day)
            : [...data.availableDays, day];
        updateData({ availableDays: newDays });
    };

    const handleNext = () => {
        if (data.availableDays.length > 0 && (data.is24Hours || (data.startTime && data.endTime))) {
            router.push('/advertiser/create/step-4');
        }
    };

    const isValid = data.availableDays.length > 0 && (data.is24Hours || (data.startTime && data.endTime));

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
                <StepIndicator currentStep={3} totalSteps={6} />

                <div className="mb-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span>
                        기본 정보
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</span>
                        홍보 유형 및 채널과 카테고리
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</span>
                        <h1 className="text-xl font-bold text-gray-900">체험 가능 요일 및 시간</h1>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">체험 가능 요일</label>
                        <div className="flex gap-2 flex-wrap">
                            {daysOfWeek.map((day) => (
                                <button
                                    key={day.key}
                                    onClick={() => handleDayToggle(day.key)}
                                    className={`w-12 h-12 rounded-lg border-2 font-medium transition-all ${data.availableDays.includes(day.key)
                                            ? 'border-blue-500 bg-blue-500 text-white'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">체험 가능 시간</label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is24Hours}
                                    onChange={(e) => updateData({ is24Hours: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">24시간 영업</span>
                            </label>
                        </div>

                        {!data.is24Hours && (
                            <div className="flex items-center gap-3">
                                <select
                                    value={data.startTime}
                                    onChange={(e) => updateData({ startTime: e.target.value })}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">선택</option>
                                    {timeSlots.map((slot) => (
                                        <option key={slot.value} value={slot.value}>{slot.label}</option>
                                    ))}
                                </select>
                                <span className="text-gray-500">부터</span>
                                <select
                                    value={data.endTime}
                                    onChange={(e) => updateData({ endTime: e.target.value })}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="">선택</option>
                                    {timeSlots.map((slot) => (
                                        <option key={slot.value} value={slot.value}>{slot.label}</option>
                                    ))}
                                </select>
                                <span className="text-gray-500">까지</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">당일 예약 및 방문</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sameDayBooking"
                                    checked={data.sameDayBooking === true}
                                    onChange={() => updateData({ sameDayBooking: true })}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm text-gray-700">가능</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sameDayBooking"
                                    checked={data.sameDayBooking === false}
                                    onChange={() => updateData({ sameDayBooking: false })}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm text-gray-700">불가능</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            예약 시 주의사항 <span className="text-gray-400 font-normal">(선택)</span>
                        </label>
                        <textarea
                            value={data.bookingNotes}
                            onChange={(e) => updateData({ bookingNotes: e.target.value.slice(0, 50) })}
                            placeholder="브레이크 타임 또는 예약 시 주의사항(대리체험 불가 등)을 입력해 주세요"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={3}
                        />
                        <p className="text-xs text-blue-500">50자 이내로 작성해 주세요.</p>
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
