'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

//initialize auth data when page reloads
export default function AuthProvider({ children }) {
    const initialize = useAuthStore((state) => state.initialize);

    useEffect(() => {
        initialize();
    }, []);

    return <>{children}</>;
}
