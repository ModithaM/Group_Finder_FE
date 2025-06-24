'use client';
import publicAxios from '@/lib/publicAxios';

export const loginUser = async (username, password) => {
    try {
        const res = await publicAxios.post('/api/auth/login', {
            username,
            password,
        });

        return { success: true, data: res.data };
    } catch (err) {
        if (err.response) {
            return {
                success: false,
                status: err.response.status,
                message: err.response.data?.message || 'Login failed',
            };
        } else {
            // Network error or unknown
            return {
                success: false,
                status: 0,
                message: 'Network error or unknown error',
            };
        }
    }
};
