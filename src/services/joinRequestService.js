'use client';

import privateAxios from '@/lib/privateAxios';

/**
 * Service to handle join requests for projects.
 * @module joinRequestService
 */
export const sendJoinRequest = async (requestData) => {
    try {
        const res = await privateAxios.post('/api/member/join-request', requestData);
        return { success: true, data: res.data };
    } catch (err) {
        if (err.response) {
            return {
                success: false,
                status: err.response.status,
                message: err.response.data?.message || 'Join request failed',
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

export const getJoinRequests = async (projectId) => {
    try {
        const res = await privateAxios.get(`/api/member/requests/${projectId}`);
        return { success: true, data: res.data };
    } catch (err) {
        if (err.response) {
            return {
                success: false,
                status: err.response.status,
                message: err.response.data?.message || 'Failed to fetch join requests',
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
}

export const handleJoinRequest = async (requestId, status) => {
    try {
        const res = await privateAxios.put(`/api/member/requests/${requestId}`, null, { params: { status: status } });
        return { success: true };
    } catch (err) {
        if (err.response) {
            console.log('Error handling join request:', err.response);
            return {
                success: false,
                status: err.response.status,
                message: err.response.data?.message || 'Failed to handle join request',
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
}