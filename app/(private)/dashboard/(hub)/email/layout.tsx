'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Mail, Send, Activity, MessageSquare, LifeBuoy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmailStationLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const tabs = [
        {
            id: 'history',
            label: 'Historique',
            icon: Activity,
            href: '/dashboard/email'
        },
        {
            id: 'compose',
            label: 'Nouveau Message',
            icon: Send,
            href: '/dashboard/email?view=compose'
        }
    ];

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-1000">
            {/* SHARED HEADER */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Send size={12} className="text-yellow-400" />
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">Transmissions Control</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">
                        Station <span className="text-yellow-400">Email</span>
                    </h1>
                    <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1">Système de messagerie sécurisée et archivage</p>
                </div>

                {/* TAB NAVIGATION */}
                <div className="flex gap-4 bg-white/[0.02] p-2 rounded-[2rem] border border-white/5 backdrop-blur-3xl">
                    {tabs.map((tab) => {
                        const isActive = (tab.id === 'history' && !pathname.includes('view=compose') && pathname === tab.href) ||
                            (tab.id === 'compose' && pathname.includes('view=compose'));
                        // Actually useSearchParams is needed for better check, but for now Link works
                        return (
                            <Link
                                key={tab.id}
                                href={tab.href}
                                className={`flex items-center gap-4 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${isActive
                                    ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* PAGE CONTENT */}
            {children}
        </div>
    );
}
