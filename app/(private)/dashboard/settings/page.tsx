'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard/settings/general');
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-[0_0_50px_rgba(250,204,21,0.2)]"></div>
            <p className="text-gray-500 font-[1000] uppercase text-[10px] tracking-[0.5em] italic">Accessing Config Hub...</p>
        </div>
    );
}

