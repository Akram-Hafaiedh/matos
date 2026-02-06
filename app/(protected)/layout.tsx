// app/(protected)/layout.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    Loader2, LayoutDashboard, ShoppingBag, Trophy,
    MessageSquare, Bell, User, Shield, LogOut,
    Menu, X, ChevronRight, Home, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import UserAvatar from '@/components/UserAvatar';
import NotificationsDropdown from '@/components/NotificationsDropdown';
import UserProfileHeader from '@/components/UserProfileHeader';
import { useCart } from '../cart/CartContext';

import { useRef } from 'react';

const MENU_ITEMS = [
    { icon: LayoutDashboard, label: "Aperçu", href: '/account' },
    { icon: ShoppingBag, label: "Panier", href: '/account/cart' },
    { icon: ShoppingBag, label: "Commandes", href: '/account/orders' },
    { icon: Trophy, label: "Fidélité", href: '/account/loyalty' },
    { icon: MessageSquare, label: "Tickets", href: '/account/tickets' },
    { icon: Bell, label: "Alertes", href: '/account/notifications' },
    { icon: User, label: "Profil", href: '/account/profile' },
    { icon: Shield, label: "Sécurité", href: '/account/security' },
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const { getTotalItems } = useCart();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const mainRef = useRef<HTMLDivElement>(null);

    const totalItems = getTotalItems();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    // Track scroll for header logic
    useEffect(() => {
        const main = mainRef.current;
        if (!main) return;
        const handleScroll = () => {
            setScrolled(main.scrollTop > 20);
        };
        main.addEventListener('scroll', handleScroll);
        return () => main.removeEventListener('scroll', handleScroll);
    }, []);

    // Close sidebar on navigation (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return null;
    }

    const isActive = (href: string) => {
        if (href === '/account') return pathname === '/account';
        return pathname.startsWith(href);
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <div className="min-h-screen bg-[#050505] flex text-white overflow-hidden selection:bg-yellow-400 selection:text-black">

            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex w-80 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex-col h-screen sticky top-0">
                <div className="p-8">
                    <Link href="/" className="group flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
                            <Home className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-xl font-[1000] italic uppercase tracking-tighter leading-none text-white">MATO'S</h2>
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">Espace Membre</p>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {MENU_ITEMS.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center justify-between group px-5 py-4 rounded-2xl transition-all duration-300 ${active
                                    ? 'bg-yellow-400 text-black shadow-[0_10px_30px_rgba(250,204,21,0.15)]'
                                    : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon className={`w-5 h-5 ${active ? 'text-black' : 'text-gray-500 group-hover:text-yellow-400'} transition-colors`} />
                                    <span className="text-[11px] font-[1000] uppercase tracking-wider">{item.label}</span>
                                </div>
                                {active && <motion.div layoutId="nav-pill" className="w-1.5 h-1.5 rounded-full bg-black" />}
                                {!active && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gray-600" />}
                            </Link>
                        );
                    })}
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
            </aside>

            {/* Mobile Drawer Wrapper */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 bg-black border-r border-white/10 z-[101] flex flex-col lg:hidden"
                        >
                            <div className="p-8 flex items-center justify-between">
                                <Link href="/" className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                                        <Home className="w-5 h-5 text-black" />
                                    </div>
                                    <h2 className="text-xl font-[1000] italic uppercase tracking-tighter">MATO'S</h2>
                                </Link>
                                <button onClick={() => setSidebarOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                                {MENU_ITEMS.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center justify-between group px-5 py-4 rounded-2xl transition-all duration-300 ${active
                                                ? 'bg-yellow-400 text-black shadow-[0_10px_30px_rgba(250,204,21,0.15)]'
                                                : 'hover:bg-white/5 text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <item.icon className={`w-5 h-5 ${active ? 'text-black' : 'text-gray-500 group-hover:text-yellow-400'} transition-colors`} />
                                                <span className="text-[11px] font-[1000] uppercase tracking-wider">{item.label}</span>
                                            </div>
                                            {active && <motion.div layoutId="nav-pill-mobile" className="w-1.5 h-1.5 rounded-full bg-black" />}
                                            {!active && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gray-600" />}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="p-6 border-t border-white/5 space-y-4">
                                <button
                                    onClick={() => router.push('/')}
                                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/5 text-gray-400 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 hover:text-white transition-all italic"
                                >
                                    <Home size={16} />
                                    Aller au Site Public
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Dashboard Main Scrollable Area */}
                <main ref={mainRef} className="flex-1 overflow-y-auto custom-scrollbar relative">
                    {/* Unified Sticky Header */}
                    <header className={`sticky top-0 z-40 transition-all duration-700 flex items-center justify-between px-6 md:px-12 ${scrolled
                        ? 'h-20 bg-black/60 backdrop-blur-3xl border-b border-white/5'
                        : 'h-24 bg-black/20 backdrop-blur-xl border-b border-white/[0.02]'
                        }`}>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-yellow-400 hover:bg-white/10 transition-colors"
                            >
                                <Menu size={24} />
                            </button>

                            {/* Breadcrumb Info */}
                            <div className="hidden sm:block">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <Sparkles className="w-3 h-3 text-yellow-400" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600 italic">Mato's Personnel Terminal</span>
                                </div>
                                <h2 className="text-sm font-[1000] uppercase italic tracking-tighter text-white">
                                    {MENU_ITEMS.find(item => isActive(item.href))?.label || 'Centre de Contrôle'}
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <Link
                                href="/account/cart"
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all relative ${pathname === '/account/cart' ? 'bg-yellow-400 text-black' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                            >
                                <ShoppingBag size={20} />
                                {totalItems > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-black text-[10px] font-black rounded-full flex items-center justify-center border-2 border-black"
                                    >
                                        {totalItems}
                                    </motion.span>
                                )}
                            </Link>

                            <div className="hidden md:block">
                                <NotificationsDropdown />
                            </div>

                            <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block"></div>

                            {/* User Profile Hook */}
                            <UserProfileHeader session={session} />

                        </div>
                    </header>

                    <div className="w-full p-6 md:p-10 lg:p-14">
                        {children}
                    </div>

                    {/* Background Decorative Ambient Glow */}
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-400/[0.02] blur-[200px] pointer-events-none rounded-full" />
                </main >
            </div >


        </div >
    );
}
