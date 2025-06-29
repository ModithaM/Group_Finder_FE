'use client';

import React, { useState, useEffect } from 'react';

export default function ErrorMessage({ message, onClose, autoClose = false, duration = 7000 }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (autoClose && message) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, autoClose, duration, onClose]);

    if (!message || !isVisible) return null;

    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md transition-opacity duration-300 ease-in-out opacity-100 mb-4">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm text-red-700">{message}</p>
                </div>
                {onClose && (
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            onClose();
                        }}
                        className="ml-auto flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}