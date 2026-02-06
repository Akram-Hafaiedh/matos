'use client';

import {
    ShieldCheck, Target, Fingerprint, Palette, Coins, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import SyndicateOverview from '@/components/SyndicateOverview';
import { useState } from 'react';

const TABS = [
    { id: 'progress', label: 'Progrès', icon: ShieldCheck, href: '/account/loyalty/progress' },
    { id: 'quests', label: 'Quêtes', icon: Target, href: '/account/loyalty/quests' },
    { id: 'identity', label: 'Identité', icon: Fingerprint, href: '/account/loyalty/identity' },
    { id: 'workshop', label: 'Atelier', icon: Palette, href: '/account/loyalty/workshop' },
    { id: 'shop', label: 'Boutique', icon: Coins, href: '/account/loyalty/shop' },
];

export default function LoyaltyLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isOverviewOpen, setIsOverviewOpen] = useState(false);

    return (
        <div className="w-full space-y-16 animate-in fade-in duration-1000 pb-40">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-white/5 pb-16">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-400/20 bg-yellow-400/5 backdrop-blur-md">
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-400">Archive du Syndicat</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-none text-white">
                        DOSSIER <span className="text-yellow-400 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">SYNDICAT</span>
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsOverviewOpen(true)}
                        className="group flex items-center gap-3 bg-white/[0.02] border border-white/5 px-8 py-4 rounded-2xl hover:bg-yellow-400 hover:text-black transition-all duration-500"
                    >
                        <ShieldCheck size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Aperçu Hiérarchique</span>
                    </button>
                    <div className="hidden xl:flex flex-col items-end">
                        <div className="text-[10px] text-gray-700 font-bold uppercase tracking-widest italic">Status de Session</div>
                        <div className="text-[9px] text-green-500 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            Synchronisé
                        </div>
                    </div>
                </div>
            </div>

            {/* TAB SYSTEM */}
            <div className="space-y-12">
                <div className="flex items-center gap-1 md:gap-4 overflow-x-auto pb-4 no-scrollbar border-b border-white/[0.02]">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const active = pathname === tab.href || (tab.id === 'progress' && pathname === '/account/loyalty');
                        return (
                            <Link
                                key={tab.id}
                                href={tab.href}
                                className={`flex items-center gap-3 px-8 py-4 rounded-full transition-all whitespace-nowrap group ${active ? 'bg-yellow-400 text-black shadow-2xl shadow-yellow-400/20 scale-105' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}
                            >
                                <Icon size={16} className={active ? 'text-black' : 'text-gray-700 group-hover:text-yellow-400'} />
                                <span className="text-[10px] font-black uppercase tracking-widest italic">{tab.label}</span>
                                {active && <motion.div layoutId="active-tab" className="w-1.5 h-1.5 rounded-full bg-black ml-1" />}
                            </Link>
                        );
                    })}
                </div>

                <main className="min-h-[50vh] relative">
                    {children}
                </main>
            </div>

            <SyndicateOverview
                isOpen={isOverviewOpen}
                onClose={() => setIsOverviewOpen(false)}
            />
        </div>
    );
}
