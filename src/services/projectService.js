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


export const getProjectById = async (id) => {
    try {
        const res = await privateAxios.get(`/api/projects/${id}`);
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


export const updateProject = async (id, userid, editedProject) => {
    try {
        const res = await privateAxios.put(`/api/projects/${id}/user/${userid}`, editedProject);
        return { success: true, data: res.data };

    } catch (err) {
        if (err.response) {
            return {
                success: false,
                status: err.response.status,
                message: err.response.data?.message || 'Project update failed',
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

export const createNewProject = async (projectData) => {
    try {
        const res = await privateAxios.post('/api/projects/create', projectData);
        return { success: true, data: res.data };

    } catch (err) {
        if (err.response) {
            return {
                success: false,
                status: err.response.status,
                message: err.response.data?.message || 'Project creation failed',
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