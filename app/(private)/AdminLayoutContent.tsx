// app/(private)/AdminLayoutContent.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Menu as MenuIcon, Bell, Settings as SettingsIcon, LogOut, ExternalLink, Sparkles } from 'lucide-react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import NotificationsDropdown from '@/components/NotificationsDropdown';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const mainRef = useRef<HTMLDivElement>(null);

    // Redirect if not authenticated or not admin
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') {
            router.push('/');
        }
    }, [status, session, router]);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    // Track scroll for header transitions
    useEffect(() => {
        const main = mainRef.current;
        if (!main) return;
        const handleScroll = () => {
            setScrolled(main.scrollTop > 20);
        };
        main.addEventListener('scroll', handleScroll);
        return () => main.removeEventListener('scroll', handleScroll);
    }, []);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-yellow-400 border-t-transparent mx-auto"></div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] italic">Initialisation Admin...</p>
                </div>
            </div>
        );
    }

    if (status !== 'authenticated' || (session?.user as any)?.role !== 'admin') {
        return null;
    }

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden selection:bg-yellow-400 selection:text-black font-sans">
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                session={session}
                handleLogout={handleLogout}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 lg:ml-80 relative h-screen">
                <main ref={mainRef} className="flex-1 overflow-y-auto custom-scrollbar relative">

                    {/* Global Header */}
                    <header className={`sticky top-0 z-40 transition-all duration-700 flex items-center justify-between px-6 md:px-12 ${scrolled
                        ? 'h-20 bg-black/60 backdrop-blur-3xl border-b border-white/5'
                        : 'h-24 bg-black/20 backdrop-blur-xl border-b border-white/[0.02]'
                        }`}>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-yellow-400"
                            >
                                <MenuIcon className="w-5 h-5" />
                            </button>

                            {/* Breadcrumb-style title */}
                            <div className="hidden md:block">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <Sparkles className="w-3 h-3 text-yellow-400" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600 italic">Mato's Maison Admin</span>
                                </div>
                                <h2 className="text-sm font-[1000] uppercase italic tracking-tighter text-white">
                                    {pathname === '/dashboard' ? 'Tableau de Bord' : pathname.split('/').pop()?.replace('-', ' ')}
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <NotificationsDropdown />

                            <div className="h-8 w-px bg-white/5 mx-2 hidden sm:block"></div>

                            {/* User Profile Summary */}
                            <div className="flex items-center gap-4 pl-2">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black text-white uppercase tracking-wider">{session?.user?.name}</p>
                                    <p className="text-[9px] text-yellow-400 font-bold uppercase tracking-widest italic">Administrateur</p>
                                </div>
                                <div className="relative group/menu">
                                    <button className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-black font-black uppercase text-sm shadow-xl shadow-yellow-400/10 active:scale-95 transition-transform">
                                        {(session?.user?.name?.[0] || 'A').toUpperCase()}
                                    </button>

                                    <div className="absolute right-0 mt-3 w-56 bg-black border border-white/5 rounded-2xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 transform origin-top-right overflow-hidden z-50">
                                        <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                                            <p className="text-[10px] font-black text-white uppercase tracking-wider truncate">{session?.user?.name}</p>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest truncate">{session?.user?.email}</p>
                                        </div>
                                        <div className="p-2">
                                            <button
                                                onClick={() => router.push('/dashboard/account')}
                                                className="w-full text-left px-4 py-3 text-[10px] font-black text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition uppercase tracking-widest flex items-center gap-3 italic"
                                            >
                                                <SettingsIcon size={14} className="text-yellow-400" />
                                                Mon Compte
                                            </button>
                                            <button
                                                onClick={() => router.push('/')}
                                                className="w-full text-left px-4 py-3 text-[10px] font-black text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition uppercase tracking-widest flex items-center gap-3 italic"
                                            >
                                                <ExternalLink size={14} className="text-yellow-400" />
                                                Site Public
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-3 text-[10px] font-black text-red-500 hover:bg-red-500/10 rounded-xl transition uppercase tracking-widest flex items-center gap-3 border-t border-white/5 mt-2 italic"
                                            >
                                                <LogOut size={14} />
                                                Déconnexion
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page Content Dashboard Main Area */}
                    <div className="w-full p-6 lg:p-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Ambient Background Glow */}
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-400/[0.015] blur-[200px] pointer-events-none rounded-full" />
                </main>
            </div>
        </div>
    );
}
