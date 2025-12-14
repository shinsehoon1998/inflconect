'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, UserRole } from '@/lib/contexts/UserContext';
import { UI_TEXT } from '@/lib/constants/uiText';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRole: UserRole;
}

export function RoleGuard({ children, allowedRole }: RoleGuardProps) {
    const { role } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!role) {
            router.replace('/role-select');
            return;
        }

        if (role !== allowedRole) {
            if (role === 'advertiser') {
                router.replace('/advertiser/dashboard');
            } else {
                router.replace('/influencer/dashboard');
            }
        }
    }, [role, allowedRole, router]);

    if (role !== allowedRole) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">{UI_TEXT.common.loading}</p>
            </div>
        );
    }

    return <>{children}</>;
}
