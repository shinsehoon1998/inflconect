'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/common/Header';
import { UI_TEXT } from '@/lib/constants/uiText';
import { supabase } from '@/lib/supabase/client';
import { useUser } from '@/lib/contexts/UserContext';

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
    const { user } = useUser();
    const router = useRouter();
    const texts = UI_TEXT.influencer.upload;

    const [campaign, setCampaign] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const { data, error } = await supabase
                    .from('campaigns')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (error) throw error;
                setCampaign(data);
            } catch (error) {
                console.error('Error fetching campaign:', error);
                alert('칠페인 정보를 불러오는데 실패했습니다.');
                router.back();
            } finally {
                setIsLoading(false);
            }
        };

        fetchCampaign();
    }, [params.id, router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file || !user || !campaign) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${campaign.id}/${user.id}_${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('videos')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const videoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/${fileName}`;

            const { error: dbError } = await supabase
                .from('campaign_participations')
                .insert({
                    campaign_id: campaign.id,
                    influencer_id: user.id,
                    status: 'submitted',
                    video_url: videoUrl
                });

            if (dbError) {
                if (dbError.code === '23505') {
                    alert('이미 참여하신 칠페인입니다.');
                } else {
                    throw dbError;
                }
            } else {
                alert('영상이 성공적으로 제출되었어요!');
                router.push('/influencer/dashboard');
            }

        } catch (error) {
            console.error('Error submitting campaign:', error);
            alert('영상 제출 중 오류가 발생했습니다.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header
                title="칠페인 상세"
                leftAction={
                    <Button
                        variant="secondary"
                        className="px-2 h-8 text-xs bg-transparent hover:bg-gray-100"
                        onClick={() => router.back()}
                    >
                        {UI_TEXT.common.prev}
                    </Button>
                }
            />

            <main className="p-4 space-y-6">
                {isLoading ? (
                    <div className="py-20 text-center text-gray-400">칠페인 정보를 불러오는 중...</div>
                ) : campaign ? (
                    <>
                        <section className="space-y-2">
                            <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
                            <p className="text-xl font-bold text-blue-600">
                                {campaign.budget?.toLocaleString() || campaign.provided_value?.toLocaleString()}원
                            </p>
                            <p className="text-gray-600 text-sm mt-2">
                                {campaign.mission || UI_TEXT.advertiser.create.purposes[campaign.purpose as keyof typeof UI_TEXT.advertiser.create.purposes]}
                            </p>
                        </section>

                        <section>
                            <h2 className="font-bold text-lg mb-3 text-gray-900">칠페인 가이드</h2>
                            <Card className="space-y-3">
                                {[
                                    '본문 1000자 이상 작성 (사진 15장 이상)',
                                    '핵심 키워드 3회 이상 언급',
                                    '제공받은 가이드라인 준수 필수',
                                    '업로드 후 6개월 유지'
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <span className="w-5 h-5 text-gray-400 shrink-0 mt-0.5">✓</span>
                                        <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </Card>
                        </section>
                    </>
                ) : (
                    <div className="py-20 text-center text-gray-400">칠페인을 찾을 수 없습니다.</div>
                )}

                <section>
                    <h2 className="font-bold text-lg mb-3 text-gray-900">
                        {texts.title}
                    </h2>
                    <Card className="border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <label className="flex flex-col items-center justify-center py-8 cursor-pointer">
                            <input
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-600">
                                ↑
                            </div>
                            {file ? (
                                <div className="text-center">
                                    <p className="font-bold text-gray-900 truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-blue-600 mt-1">파일 변경하기</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="font-bold text-gray-900">{texts.desc}</p>
                                    <p className="text-xs text-gray-400 mt-1">터치하여 영상 선택</p>
                                </div>
                            )}
                        </label>
                    </Card>
                </section>
            </main>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-8">
                <Button
                    fullWidth
                    className="shadow-lg shadow-blue-600/20"
                    disabled={!file || isUploading}
                    onClick={handleSubmit}
                >
                    {isUploading ? UI_TEXT.common.loading : '영상 제출하기'}
                </Button>
            </div>
        </div>
    );
}
