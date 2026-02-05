import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { UserRole } from '../types';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signOut: () => Promise<void>;
    isAdmin: boolean;
    isFranchiseAdmin: boolean;
    isBusinessOwner: boolean;
    role: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial session load
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen to auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    };

    // 🔑 JWT IS THE SINGLE SOURCE OF TRUTH
    //const role = (session?.user?.app_metadata?.role as UserRole) ?? null;
    const role = (session?.user?.app_metadata?.role as UserRole) ?? null;
    console.log('🔑 JWT app_metadata:', session?.user?.app_metadata);


    //🔍 TEMP: Verify JWT contents (REMOVE after verification)
    useEffect(() => {
        if (session) {
            console.log('🔑 JWT app_metadata:', session.user.app_metadata);
        }
    }, [session]);




    const value: AuthContextType = {
        user,
        session,
        loading,
        signOut,
        role,
        isAdmin: role === UserRole.SUPER_ADMIN,
        isFranchiseAdmin: role === UserRole.FRANCHISE_ADMIN,
        isBusinessOwner: role === UserRole.BUSINESS_OWNER,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
