'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Mail, Bell, Shield, Cloud, Activity, Sparkles, ChevronRight } from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Général', href: '/dashboard/settings/general', icon: Settings },
    { label: 'Email SMTP', href: '/dashboard/settings/email', icon: Mail },
    { label: 'Hero Carousel', href: '/dashboard/settings/hero', icon: Sparkles },
    { label: 'Pages Statiques', href: '/dashboard/settings/content', icon: ChevronRight },
    { label: 'Infrastructure', href: '/dashboard/settings/maintenance', icon: Activity },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Cinematic Header */}
            <div className="relative overflow-hidden bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 md:p-14">
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-400/30 animate-pulse delay-75"></div>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-400/50 italic">Paramètres Système</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-[1000] italic tracking-tighter uppercase leading-none text-white">
                            Config<span className="text-yellow-400">Hub</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs max-w-md">
                            Contrôle centralisé des paramètres du restaurant, de la communication et de l'infrastructure numérique.
                        </p>
                    </div>

                    {/* Sub-navigation */}
                    <nav className="flex flex-wrap gap-2 md:gap-4 bg-black/40 p-2 rounded-3xl border border-white/5 backdrop-blur-xl">
                        {NAV_ITEMS.map((item) => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-500 group relative ${active
                                        ? 'text-black'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="settings-nav-active"
                                            className="absolute inset-0 bg-yellow-400 rounded-2xl shadow-[0_10px_30px_rgba(250,204,21,0.2)]"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <item.icon className={`w-4 h-4 relative z-10 ${active ? 'text-black' : 'group-hover:text-yellow-400'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest relative z-10 italic">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Ambient Decorative Elements */}
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-yellow-400/[0.03] blur-[120px] rounded-full"></div>
                <div className="absolute left-1/3 bottom-0 w-64 h-1 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"></div>
            </div>

            {/* Page Content */}
            <div className="relative">
                {children}
            </div>
        </div>
    );
}
