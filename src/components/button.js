'use client';

import React from 'react';

export default function Button({ onClick, width = 'w-full', text = 'Submit', isLoading = false }) {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`${width} bg-indigo-600 text-white py-2.5 px-4 rounded-xl hover:bg-indigo-700 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
        transition-colors text-sm font-medium shadow-sm flex justify-center items-center disabled:opacity-70`}
        >
            {isLoading && (
                <svg
                    className="animate-spin h-4 w-4 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                </svg>
            )}
            <span>{isLoading ? 'Loading...' : text}</span>
        </button>
    );
}
