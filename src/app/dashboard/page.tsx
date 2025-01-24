"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        // TODO: Check authentication status
        const isAuthenticated = false; // This will be replaced with actual auth check

        if (!isAuthenticated) {
            router.push('/dashboard/login');
        }
    }, [router]);

    return null; // This page will redirect to login if not authenticated
} 