'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export type UserRole = 'advertiser' | 'influencer' | 'admin' | null;

interface UserContextType {
    user: User | null;
    role: UserRole;
    setRole: (role: UserRole) => void;
    isLoading: boolean;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', JSON.stringify(error, null, 2));
                if (error.code === 'PGRST116') return null;
            }

            if (data) {
                setRole(data.role as UserRole);
            }
        } catch (err) {
            console.error('Unexpected error fetching profile:', err);
        }
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id);
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    setUser(session.user);
                    await fetchProfile(session.user.id);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user);
                if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                    await fetchProfile(session.user.id);
                }
            } else {
                setUser(null);
                setRole(null);
            }

            if (event === 'SIGNED_OUT') {
                router.push('/login');
            }

            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    const logout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <UserContext.Provider value={{ user, role, setRole, isLoading, logout, refreshProfile }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
