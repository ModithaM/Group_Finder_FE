'use client';

import privateAxios from '@/lib/privateAxios';

export const filterProjects = async (courseId, frontendTechnology, backendTechnology, page, size = 9) => {
    try {
        const res = await privateAxios.get('/api/projects', {
            params: {
                courseId,
                frontendTechnology,
                backendTechnology,
                page,
                size
            },
        });
        console.log('Filtered Projects:', res);
        return { success: true, data: res.data };

    } catch (err) {
        if (err.response) {
            return {
                success: false,
                status: err.response.status,
                message: err.response.data?.message || 'Project filtering failed',
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