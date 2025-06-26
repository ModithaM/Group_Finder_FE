"use client"

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function Header() {

    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    const handleSignUp = () => {
        router.push('/register');
    };

    const handleLogin = () => {
        router.push('/login');
    };

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        router.replace('/');
    };

    const handleProfile = () => {
        setDropdownOpen(false);
        router.push('/myprofile');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900">SLIIT GroupFinder</span>
                        </div>
                    </div>
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link key="home" href="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-semibold transition-colors">
                            Home
                        </Link>
                        <Link key="projects" href="/projects" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-semibold transition-colors">
                            Projects
                        </Link>
                        {isLoggedIn && (
                            <Link href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-semibold transition-colors">
                                My Projects
                            </Link>
                        )}
                        <Link href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-semibold transition-colors">
                            Contact Us
                        </Link>
                    </nav>

                    {/* Auth Buttons / User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {!isLoggedIn && (
                            <>
                                <button
                                    onClick={handleLogin}
                                    className="text-gray-700 hover:text-indigo-600 px-4 py-2 text-sm font-semibold transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={handleSignUp}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                        {isLoggedIn && (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                        </span>
                                    </div>
                                    <span className="text-gray-700 text-sm font-medium">Hello {user?.firstName}</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                                        <button
                                            onClick={handleProfile}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            My Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                router.push('/');
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Settings
                                        </button>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-700 hover:text-indigo-600 p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link href="/projects" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 text-sm font-medium">Projects</Link>
                        {isLoggedIn && (
                            <Link href="#" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 text-sm font-medium">My Projects</Link>
                        )}
                        <Link href="#" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 text-sm font-medium">Contact Us</Link>

                        {!isLoggedIn && (
                            <div className="px-3 py-2 border-t border-gray-100 mt-2 pt-2">
                                <button onClick={handleLogin} className="block w-full text-left text-gray-700 hover:text-indigo-600 text-sm font-medium py-1">
                                    Login
                                </button>
                                <button onClick={handleSignUp} className="block w-full mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                    Sign Up
                                </button>
                            </div>
                        )}

                        {isLoggedIn && (
                            <div className="px-3 py-2 border-t border-gray-100 mt-2 pt-2">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                        </span>
                                    </div>
                                    <span className="text-gray-700 text-sm">Hello {user?.firstName}</span>
                                </div>
                                <button onClick={handleProfile} className="block w-full text-left text-gray-700 hover:text-indigo-600 text-sm font-medium py-1">
                                    My Profile
                                </button>
                                <button onClick={() => router.push('/')} className="block w-full text-left text-gray-700 hover:text-indigo-600 text-sm font-medium py-1">
                                    Settings
                                </button>
                                <button onClick={handleLogout} className="block w-full text-left text-red-600 hover:text-red-700 text-sm font-medium py-1 mt-2">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}