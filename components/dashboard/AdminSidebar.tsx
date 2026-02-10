// components/dashboard/AdminSidebar.tsx
'use client';

import {
    LayoutDashboard, ShoppingBag, Users, Settings,
    LogOut, Menu as MenuIcon, X, Tag, Gift,
    LifeBuoy, Home, MessageSquare, ChevronRight,
    Utensils, Trophy, Inbox, Send, Mail, Calendar,
    Sparkles, Activity
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    session: any;
    handleLogout: () => Promise<void>;
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen, session, handleLogout }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();


    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(href);
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-full w-80 bg-black border-r border-white/5 z-50 transform transition-transform duration-500 ease-[0.16,1,0.3,1] shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 flex flex-col`}
        >
            {/* Logo Section */}
            <div className="p-8">
                <div className="flex items-center justify-between">
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-all duration-500">
                            <span className="text-xl">🍕</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-[1000] italic uppercase tracking-tighter leading-none text-white">
                                Mato's <span className="text-yellow-400">Admin</span>
                            </h1>
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1 italic">Command Center</p>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-10 overflow-y-auto custom-scrollbar relative z-10">
                {/* PILOTAGE TACTIQUE */}
                <div className="space-y-1.5">
                    <div className="px-5 mb-4">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Pilotage Tactique</p>
                    </div>
                    {[
                        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
                        { name: 'Commandes', href: '/dashboard/orders', icon: ShoppingBag },
                        { name: 'Réservations', href: '/dashboard/reservations', icon: Calendar },
                    ].map((item) => {
                        const active = isActive(item.href);
                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    router.push(item.href);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center justify-between group px-5 py-4 rounded-2xl transition-all duration-300 ${active
                                    ? 'bg-yellow-400 text-black shadow-[0_10px_30px_rgba(250,204,21,0.15)]'
                                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon className={`w-5 h-5 ${active ? 'text-black' : 'text-gray-500 group-hover:text-yellow-400'} transition-colors`} />
                                    <span className="text-[11px] font-[1000] uppercase tracking-wider">{item.name}</span>
                                </div>
                                {active && <motion.div layoutId="nav-pill-admin-1" className="w-1.5 h-1.5 rounded-full bg-black" />}
                                {!active && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gray-600" />}
                            </button>
                        );
                    })}
                </div>

                {/* LOGISTIQUE UNITÉS */}
                <div className="space-y-1.5">
                    <div className="px-5 mb-4">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Logistique Unités</p>
                    </div>
                    {[
                        { name: 'Menu', href: '/dashboard/menu', icon: Utensils },
                        { name: 'Catégories', href: '/dashboard/categories', icon: Tag },
                        { name: 'Promotions', href: '/dashboard/promotions', icon: Gift },
                    ].map((item) => {
                        const active = isActive(item.href);
                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    router.push(item.href);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center justify-between group px-5 py-4 rounded-2xl transition-all duration-300 ${active
                                    ? 'bg-yellow-400 text-black shadow-[0_10px_30px_rgba(250,204,21,0.15)]'
                                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon className={`w-5 h-5 ${active ? 'text-black' : 'text-gray-500 group-hover:text-yellow-400'} transition-colors`} />
                                    <span className="text-[11px] font-[1000] uppercase tracking-wider">{item.name}</span>
                                </div>
                                {active && <motion.div layoutId="nav-pill-admin-2" className="w-1.5 h-1.5 rounded-full bg-black" />}
                                {!active && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gray-600" />}
                            </button>
                        );
                    })}
                </div>

                {/* BASE DE RENSEIGNEMENT */}
                <div className="space-y-1.5">
                    <div className="px-5 mb-4">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Base Renseignement</p>
                    </div>
                    {[
                        { name: 'Clients', href: '/dashboard/customers', icon: Users },
                        { name: 'Loyauté', href: '/dashboard/loyalty', icon: Trophy },
                    ].map((item) => {
                        const active = isActive(item.href);
                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    router.push(item.href);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center justify-between group px-5 py-4 rounded-2xl transition-all duration-300 ${active
                                    ? 'bg-yellow-400 text-black shadow-[0_10px_30px_rgba(250,204,21,0.15)]'
                                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon className={`w-5 h-5 ${active ? 'text-black' : 'text-gray-500 group-hover:text-yellow-400'} transition-colors`} />
                                    <span className="text-[11px] font-[1000] uppercase tracking-wider">{item.name}</span>
                                </div>
                                {active && <motion.div layoutId="nav-pill-admin-3" className="w-1.5 h-1.5 rounded-full bg-black" />}
                                {!active && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gray-600" />}
                            </button>
                        );
                    })}
                </div>

                {/* CENTRE D'INTERACTION */}
                <div className="space-y-1.5">
                    <div className="px-5 mb-4">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Centre d'Interaction</p>
                    </div>
                    {[
                        { name: 'Tickets Support', href: '/dashboard/support', icon: LifeBuoy },
                        { name: 'Messages Contact', href: '/dashboard/inbox', icon: Inbox },
                        { name: 'Avis Clients', href: '/dashboard/reviews', icon: MessageSquare },
                        { name: 'Station Email', href: '/dashboard/email', icon: Mail },
                    ].map((item) => {
                        const active = isActive(item.href);
                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    router.push(item.href);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center justify-between group px-5 py-4 rounded-2xl transition-all duration-300 ${active
                                    ? 'bg-yellow-400 text-black shadow-[0_10px_30px_rgba(250,204,21,0.15)]'
                                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon className={`w-5 h-5 ${active ? 'text-black' : 'text-gray-500 group-hover:text-yellow-400'} transition-colors`} />
                                    <span className="text-[11px] font-[1000] uppercase tracking-wider">{item.name}</span>
                                </div>
                                {active && <motion.div layoutId="nav-pill-support" className="w-1.5 h-1.5 rounded-full bg-black" />}
                                {!active && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gray-600" />}
                            </button>
                        );
                    })}
                </div>

                {/* CONFIGURATION MISSION */}
                <div className="space-y-1.5">
                    <div className="px-5 mb-4">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Configuration Mission</p>
                    </div>
                    {[
                        { name: 'Protocoles', href: '/dashboard/settings/general', icon: Settings },
                        { name: 'Passerelles', href: '/dashboard/settings/integrations', icon: Send },
                        { name: 'Visuels Hero', href: '/dashboard/settings/hero', icon: Sparkles },
                        { name: 'Contenu Statique', href: '/dashboard/settings/content', icon: ChevronRight },
                        { name: 'Maintenance', href: '/dashboard/settings/maintenance', icon: Activity },
                    ].map((item) => {
                        const active = isActive(item.href);
                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    router.push(item.href);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center justify-between group px-5 py-4 rounded-2xl transition-all duration-300 ${active
                                    ? 'bg-yellow-400 text-black shadow-[0_10px_30px_rgba(250,204,21,0.15)]'
                                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon className={`w-5 h-5 ${active ? 'text-black' : 'text-gray-500 group-hover:text-yellow-400'} transition-colors`} />
                                    <span className="text-[11px] font-[1000] uppercase tracking-wider">{item.name}</span>
                                </div>
                                {active && <motion.div layoutId="nav-pill-config" className="w-1.5 h-1.5 rounded-full bg-black" />}
                                {!active && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gray-600" />}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom Section */}
            <div className="p-6 border-t border-white/5 space-y-4">
                <button
                    onClick={() => router.push('/')}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/5 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 hover:text-white transition-all italic"
                >
                    <Home size={16} />
                    Aller au Site Public
                </button>
            </div>

            {/* Sidebar Ambient Glow */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-yellow-400/5 blur-[100px] rounded-full pointer-events-none"></div>
        </aside>
    );
}
