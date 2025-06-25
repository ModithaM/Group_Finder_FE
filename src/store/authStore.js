"use client";
import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
    token: null,
    user: null,
    isLoggedIn: false,
    isInitialized: false,

    login: (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ token, user, isLoggedIn: true, isInitialized: true });
    },

    userUpdate: (updatedUserData) => {
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...updatedUserData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
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
            set({ token, user, isLoggedIn: true, isInitialized: true });
        }
        else {
            set({ isInitialized: true });
        }
    },
}));
