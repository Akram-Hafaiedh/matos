'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoyaltyRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.push('/account/loyalty/progress');
    }, [router]);

    return (
        <div className="flex items-center justify-center h-[50vh]">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}
