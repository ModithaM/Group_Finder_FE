"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    const handleSignUp = () => {
        router.push('/register');
    };

    const handleLogin = () => {
        router.push('/login');
    };

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
                        <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                            Projects
                        </a>
                        <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                            My Profile
                        </a>
                        <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                            My Projects
                        </a>
                        <a href="#" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                            Contact Us
                        </a>
                    </nav>

                    {/* Auth Buttons (Hidden when logged in) */}
                    <div className="hidden md:flex items-center space-x-4">
                        {!isLoggedIn && (
                            <>
                                <button
                                    onClick={handleLogin}
                                    className="text-gray-700 hover:text-indigo-600 px-4 py-2 text-sm font-medium transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={handleSignUp}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                        {isLoggedIn && (
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">JS</span>
                                </div>
                                <span className="text-gray-700 text-sm">John Smith</span>
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
                        <a href="#" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 text-sm font-medium">Projects</a>
                        <a href="#" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 text-sm font-medium">My Profile</a>
                        <a href="#" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 text-sm font-medium">My Projects</a>
                        <a href="#" className="block px-3 py-2 text-gray-700 hover:text-indigo-600 text-sm font-medium">Contact Us</a>
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
                    </div>
                </div>
            )}
        </header>
    );
}