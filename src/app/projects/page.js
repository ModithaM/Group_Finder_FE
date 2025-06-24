"use client"

import { ProtectedRoute } from '@/components/protectedRoute'

export default function Projects() {
    return (
        <ProtectedRoute requiredRole="MEMBER">
            <h1>Member Dashboard</h1>
        </ProtectedRoute>
    );
}