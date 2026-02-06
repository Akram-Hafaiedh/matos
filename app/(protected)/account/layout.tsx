'use client';

import { useSession } from 'next-auth/react';

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();

    if (!session) return null;

    return (
        <div className="animate-in fade-in duration-1000">
            {/* Content Area */}
            <div className="min-h-[60vh] animate-in slide-in-from-bottom-5 duration-1000">
                {children}
            </div>
        </div>
    );
}
