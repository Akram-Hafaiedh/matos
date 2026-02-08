'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Mail, Send, Activity, MessageSquare, LifeBuoy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HubLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full animate-in fade-in duration-1000">
            {children}
        </div>
    );
}
