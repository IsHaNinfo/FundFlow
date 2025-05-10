"use client";

import { RouteGuard } from '@/components/route-guard';

export default function CustomerProfilePage() {
    return (
        <RouteGuard allowedRoles={['customer']}>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">My Profile</h1>
                {/* Add your customer profile content here */}
            </div>
        </RouteGuard>
    );
} 