'use client';

import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const privateAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add the token dynamically before each request
privateAxios.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

//globle exception handling. not implemented.
//TODO: modify conditions
privateAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            useAuthStore.getState().logout(); // auto logout
            window.location.href = '/login'; // redirect to login
        }
        return Promise.reject(error);
    }
);

export default privateAxios;
