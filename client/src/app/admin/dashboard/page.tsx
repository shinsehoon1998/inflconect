'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/common/Header';
import { supabase } from '@/lib/supabase/client';
import { useUser } from '@/lib/contexts/UserContext';

export default function AdminDashboard() {
    const router = useRouter();
    const { role } = useUser();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const { data, error } = await supabase
                    .from('campaign_participations')
                    .select(`
                        id,
                        status,
                        video_url,
                        created_at,
                        campaign:campaigns(title, purpose),
                        influencer:user_profiles(id) 
                    `)
                    .eq('status', 'submitted')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setSubmissions(data || []);
            } catch (error) {
                console.error('Error fetching submissions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (role === 'admin') {
            fetchSubmissions();
        }
    }, [role]);

    const handleReview = async (id: string, newStatus: 'approved' | 'rejected') => {
        if (!confirm(`${newStatus === 'approved' ? '승인' : '거절'} 하시겠습니까?`)) return;

        try {
            const { error } = await supabase
                .from('campaign_participations')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            alert('처리되었습니다.');
            setSubmissions(prev => prev.filter(sub => sub.id !== id));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('오류가 발생했습니다.');
        }
    };

    if (role !== 'admin' && !isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>접근 권한이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header title="관리자 대시보드" />

            <main className="p-4 space-y-6">
                <h1 className="text-xl font-bold text-gray-900">검토 대기 영상 ({submissions.length})</h1>

                {isLoading ? (
                    <p className="text-center py-10 text-gray-400">로딩 중...</p>
                ) : submissions.length === 0 ? (
                    <Card>
                        <p className="text-center py-10 text-gray-400">대기 중인 제출 건이 없습니다.</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {submissions.map((sub) => (
                            <Card key={sub.id} className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        {sub.campaign?.title}
                                    </p>
                                    <p className="font-bold text-gray-900">
                                        인플루언서 ({sub.influencer?.id.slice(0, 8)}...)
                                    </p>
                                </div>

                                <div className="aspect-video bg-black rounded-lg overflow-hidden relative group">
                                    <video
                                        src={sub.video_url}
                                        controls
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        fullWidth
                                        variant="outline"
                                        onClick={() => handleReview(sub.id, 'rejected')}
                                    >
                                        거절
                                    </Button>
                                    <Button
                                        fullWidth
                                        onClick={() => handleReview(sub.id, 'approved')}
                                    >
                                        승인 (지급)
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
