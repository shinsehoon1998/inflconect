'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { UI_TEXT } from '@/lib/constants/uiText';
import { supabase } from '@/lib/supabase/client';
import { useUser } from '@/lib/contexts/UserContext';

export default function LoginPage() {
    const router = useRouter();
    const { refreshProfile } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) return;
        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();

                const role = profile?.role;

                if (role === 'admin') router.push('/admin/dashboard');
                else if (role === 'advertiser') router.push('/advertiser/dashboard');
                else if (role === 'influencer') router.push('/influencer/dashboard');
                else router.push('/role-select');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md space-y-6 sm:space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {UI_TEXT.auth.login.title}
                    </h1>
                    <p className="text-gray-500">
                        {UI_TEXT.auth.login.subtitle}
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="email"
                            placeholder={UI_TEXT.auth.login.email_placeholder}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder={UI_TEXT.auth.login.password_placeholder}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Button
                        fullWidth
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? UI_TEXT.common.loading : UI_TEXT.auth.login.action}
                    </Button>
                </div>

                <div className="text-center text-sm text-gray-500">
                    {UI_TEXT.auth.login.no_account}{' '}
                    <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-500">
                        {UI_TEXT.auth.login.signup_link}
                    </Link>
                </div>
            </Card>
        </div>
    );
}
