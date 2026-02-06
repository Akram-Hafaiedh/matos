// app/(auth)/layout.tsx
'use client';

import React from 'react';

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-[#050505] selection:bg-yellow-400 selection:text-black overflow-x-hidden">
            {children}
        </div>
    );
}
