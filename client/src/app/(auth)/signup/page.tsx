'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { UI_TEXT } from '@/lib/constants/uiText';
import { supabase } from '@/lib/supabase/client';

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async () => {
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();
        const trimmedName = name.trim();
        const trimmedPhone = phone.trim();

        if (!trimmedEmail || !trimmedPassword || !trimmedName || !trimmedPhone) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            alert('이메일 형식이 올바르지 않습니다.');
            return;
        }

        if (trimmedPassword !== trimmedConfirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: trimmedEmail,
                password: trimmedPassword,
                options: {
                    data: {
                        name: trimmedName,
                        phone: trimmedPhone,
                    },
                },
            });

            if (error) throw error;

            if (data.user) {
                const { error: profileError } = await supabase
                    .from('user_profiles')
                    .upsert({
                        id: data.user.id,
                        name: trimmedName,
                        phone: trimmedPhone,
                        role: null
                    });

                if (profileError) {
                    console.error('Profile save error:', profileError);
                }
            }

            alert('회원가입이 완료되었습니다. 역할을 선택해주세요.');
            router.push('/role-select');
        } catch (error) {
            console.error('Signup error:', error);
            alert('회원가입 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {UI_TEXT.auth.signup.title}
                    </h1>
                    <p className="text-gray-500">
                        서비스 이용을 위해 정보를 입력해주세요
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
                        <Input
                            type="password"
                            placeholder="비밀번호를 한번 더 입력해주세요"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-100">
                        <Input
                            type="text"
                            placeholder="이름"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            type="tel"
                            placeholder="휴대폰 번호 (- 없이 입력)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <Button
                        fullWidth
                        onClick={handleSignup}
                        disabled={isLoading}
                    >
                        {isLoading ? UI_TEXT.common.loading : UI_TEXT.auth.signup.continue_action}
                    </Button>
                </div>

                <div className="text-center text-sm text-gray-500">
                    {UI_TEXT.auth.signup.have_account}{' '}
                    <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                        {UI_TEXT.auth.signup.login_link}
                    </Link>
                </div>
            </Card>
        </div>
    );
}
