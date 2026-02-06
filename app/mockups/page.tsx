'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutDashboard, Sword, Trophy, ChevronRight, Palette, Layout, Shield, ShoppingBag, User } from 'lucide-react';

const MOCKUPS = [
    {
        title: 'Syndicate Tiers',
        description: 'V5 Progression System: Acts, Bosses, and Ranks (Public Page Components).',
        href: '/mockups/tiers',
        icon: <Sword size={24} />,
        color: 'text-red-500',
        bg: 'bg-red-500/10 border-red-500/20'
    },
    {
        title: 'Fidelity System (Public)',
        description: 'Full Loyalty Page Mockup with Tabs: Progression, Loot Box, Ranking.',
        href: '/mockups/fidelity',
        icon: <Trophy size={24} />,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10 border-yellow-500/20'
    },
    {
        title: 'Dashboard Integration',
        description: 'Client Dashboard Simulation with Sidebar, Header, and Widgets.',
        href: '/mockups/fidelity/dashboard',
        icon: <LayoutDashboard size={24} />,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
        title: 'Fidelity Sections',
        description: 'Updated teasers for Home & Promos featuring the Slanted CTA signature.',
        href: '/mockups/fidelity-sections',
        icon: <Layout size={24} />,
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10 border-yellow-400/20'
    },
    {
        title: 'Profile Loyalty',
        description: 'The Syndicate Dashboard: Sub-tiers, Acts progression, and Contract history.',
        href: '/mockups/profile-loyalty',
        icon: <Shield size={24} />,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
        title: 'The Black Market',
        description: 'Expanded Token Shop with 50+ items and Rank security.',
        href: '/mockups/fidelity/shop',
        icon: <ShoppingBag size={24} />,
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10 border-yellow-400/20'
    },
    {
        title: 'The Workshop',
        description: 'Personalization Hub: Borders, Icons, Backgrounds, and Titles.',
        href: '/mockups/fidelity/workshop',
        icon: <Palette size={24} />,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
        title: 'Deep Identity',
        description: 'Lore extraction, tactical archives, and global ranking matrix.',
        href: '/mockups/fidelity/identity',
        icon: <User size={24} />,
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10 border-cyan-400/20'
    }
];

export default function MockupsIndex() {
    return (
        <div className="min-h-screen bg-[#050505] text-white p-10 flex flex-col items-center justify-center font-sans">

            <div className="max-w-4xl w-full space-y-12">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400">
                        <Palette size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Design Laboratory</span>
                    </div>
                    <h1 className="text-6xl font-[1000] uppercase italic tracking-tighter">
                        Mockups <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">Index</span>
                    </h1>
                </div>

                <div className="grid gap-6">
                    {MOCKUPS.map((mockup, idx) => (
                        <Link href={mockup.href} key={idx}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className={`flex items-center gap-8 p-8 rounded-3xl border bg-black hover:bg-white/[0.02] transition-all duration-300 group cursor-pointer ${mockup.bg.replace('bg-', 'border-')}`}
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${mockup.bg} ${mockup.color}`}>
                                    {mockup.icon}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter group-hover:text-white transition-colors text-gray-200">
                                        {mockup.title}
                                    </h2>
                                    <p className="text-gray-500 font-medium">{mockup.description}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:text-black transition-all`}>
                                    <ChevronRight size={20} />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
}
