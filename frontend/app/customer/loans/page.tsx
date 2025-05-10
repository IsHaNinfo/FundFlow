"use client";

import { RouteGuard } from '@/components/route-guard';

export default function CustomerLoansPage() {
    return (
        <RouteGuard allowedRoles={['customer']}>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">My Loans</h1>
                {/* Add your customer loans content here */}
            </div>
        </RouteGuard>
    );
} 