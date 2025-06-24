"use client";
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    token: null,
    user: null,
    isLoggedIn: false,

    login: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ token, user, isLoggedIn: true });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ token: null, user: null, isLoggedIn: false });
    },

    initialize: () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (token && user) {
            set({ token, user, isLoggedIn: true });
        }
    },
}));
