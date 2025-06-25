'use client';
import privateAxios from '@/lib/privateAxios';

export const updateUser = async (userData) => {
    try {
        const res = await privateAxios.put('/api/users/profile', {
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            specialization: userData.specialization,
            year: userData.year,
            semester: userData.semester,
            bio: userData.bio,
            skills: userData.skills,
            github: userData.github,
            linkedin: userData.linkedin,
            profilePicture: userData.profilePicture
        });

        return { success: true, data: res.data };
    } catch (err) {
        if (err.response) {
            return {
                success: false,
                status: err.response.status,
                message: err.response.data?.message || 'Profile update failed',
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