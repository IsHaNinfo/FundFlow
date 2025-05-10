'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface RouteGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
}
interface DecodedToken {
    id: string
    email: string
    role: string
    iat: number
    exp: number
}
export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            if (!allowedRoles.includes(decoded.role)) {
                router.push('/unauthorized');
            }
        } catch (error) {
            router.push('/login');
        }
    }, [router, allowedRoles]);

    return <>{children}</>;
} 