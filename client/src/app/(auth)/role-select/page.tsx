'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { UI_TEXT } from '@/lib/constants/uiText';
import { useUser } from '@/lib/contexts/UserContext';
import { supabase } from '@/lib/supabase/client';

export default function RoleSelectPage() {
    const router = useRouter();
    const { role, setRole, isLoading } = useUser();
    const [selectedRole, setSelectedRole] = useState<'advertiser' | 'influencer' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isLoading && role) {
            if (role === 'admin') router.replace('/admin/dashboard');
            else if (role === 'advertiser') router.replace('/advertiser/dashboard');
            else if (role === 'influencer') router.replace('/influencer/dashboard');
        }
    }, [isLoading, role, router]);

    const texts = UI_TEXT.auth.signup.role_select;

    const handleContinue = async () => {
        if (!selectedRole) return;
        setIsSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert('로그인이 필요합니다.');
                router.push('/login');
                return;
            }

            const { error } = await supabase
                .from('user_profiles')
                .upsert({
                    id: user.id,
                    role: selectedRole
                });

            if (error) throw error;

            setRole(selectedRole);

            if (selectedRole === 'advertiser') {
                router.push('/advertiser/dashboard');
            } else {
                router.push('/influencer/dashboard');
            }
        } catch (error) {
            console.error('Error saving role:', error);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md space-y-6 sm:space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {texts.title}
                    </h1>
                    <p className="text-gray-500">
                        {texts.desc}
                    </p>
                </div>

                <div className="space-y-4">
                    <SelectionCard
                        title={texts.advertiser}
                        description={texts.advertiser_desc}
                        selected={selectedRole === 'advertiser'}
                        onClick={() => setSelectedRole('advertiser')}
                    />
                    <SelectionCard
                        title={texts.influencer}
                        description={texts.influencer_desc}
                        selected={selectedRole === 'influencer'}
                        onClick={() => setSelectedRole('influencer')}
                    />
                </div>

                <Button
                    fullWidth
                    disabled={!selectedRole || isSubmitting}
                    onClick={handleContinue}
                >
                    {isSubmitting ? UI_TEXT.common.loading : texts.continue}
                </Button>
            </Card>
        </div>
    );
}
