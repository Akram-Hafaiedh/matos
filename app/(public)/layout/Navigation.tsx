'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import UserAvatar from '@/components/UserAvatar';
import { ShoppingBag, Menu, X, User, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';
import { useCart } from '@/app/cart/CartContext';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import NotificationsDropdown from '@/components/NotificationsDropdown';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { getTotalItems, setCartOpen } = useCart() as any;
    const totalItems = getTotalItems();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Accueil' },
        { href: '/menu', label: 'Menu' },
        { href: '/promos', label: 'Promos' },
        { href: '/reservations', label: 'Réservation' },
        { href: '/fidelity', label: 'Fidélité' },
        { href: '/contact', label: 'Contact' },
    ];

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-700 ${scrolled ? 'h-20 bg-black/80 backdrop-blur-3xl border-b border-white/5' : 'h-24 bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center justify-between">

                {/* Brand Identity */}
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="relative w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(250,204,21,0.2)] group-hover:scale-105 transition-all duration-500">
                        <Image
                            src="/logo.svg"
                            alt="Mato's Logo"
                            width={28}
                            height={28}
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl font-[1000] text-white tracking-tighter italic uppercase group-hover:text-yellow-400 transition-colors duration-500">
                        MATO'S
                    </span>
                </Link>

                {/* Cinematic Navigation Links */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="relative px-5 py-2 group overflow-hidden"
                        >
                            <span className={`text-[9px] font-black uppercase tracking-[0.4em] italic transition-colors duration-300 ${(link.href === '/' ? pathname === '/' : pathname.startsWith(link.href))
                                    ? 'text-yellow-400'
                                    : 'text-gray-400 group-hover:text-white'
                                }`}>
                                {link.label}
                            </span>

                            <motion.div
                                className="absolute bottom-0 left-5 right-5 h-0.5 bg-yellow-400 origin-left"
                                initial={{ scaleX: (link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)) ? 1 : 0 }}
                                animate={{ scaleX: (link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)) ? 1 : 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        </Link>
                    ))}
                </div>

                {/* Interaction Hub */}
                <div className="flex items-center gap-2">
                    {status === 'authenticated' && <NotificationsDropdown />}

                    <button
                        onClick={() => setCartOpen(true)}
                        className="relative group p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                        <ShoppingBag className={`w-5 h-5 transition-colors duration-300 ${totalItems > 0 ? 'text-yellow-400' : 'text-gray-400 group-hover:text-white'
                            }`} />
                        {totalItems > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20"
                            >
                                {totalItems}
                            </motion.span>
                        )}
                    </button>

                    <div className="hidden md:block relative">
                        {status === 'authenticated' ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-3 p-1 rounded-full pl-1 pr-4 bg-white/5 border border-white/10 hover:border-yellow-400/30 transition-all duration-300 group"
                                >
                                    <UserAvatar
                                        image={session.user?.image}
                                        name={session.user?.name}
                                        size="sm"
                                        backgroundColor={session.user?.selected_bg || undefined}
                                    />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest italic">{session.user?.name?.split(' ')[0]}</span>
                                </button>
                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-4 w-60 bg-[#0a0a0a] border border-white/5 rounded-[2rem] shadow-2xl z-20 overflow-hidden p-3 backdrop-blur-3xl"
                                            >
                                                <div className="flex items-center gap-3 p-3 mb-2 bg-white/5 rounded-2xl">
                                                    <UserAvatar
                                                        image={session.user?.image}
                                                        name={session.user?.name}
                                                        size="sm"
                                                        backgroundColor={session.user?.selected_bg || undefined}
                                                    />
                                                    <div className="truncate">
                                                        <p className="text-white font-black text-[10px] uppercase italic truncate">{session.user?.name}</p>
                                                        <p className="text-gray-500 text-[8px] font-bold uppercase tracking-widest truncate">{session.user?.email}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <Link href="/account" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest italic group">
                                                        <UserCircle className="w-4 h-4" /> Mon Compte
                                                    </Link>
                                                    {(session.user as any)?.role === 'admin' && (
                                                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 text-yellow-400 hover:bg-yellow-400/10 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest italic">
                                                            <LayoutDashboard className="w-4 h-4" /> Dashboard Admin
                                                        </Link>
                                                    )}
                                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest italic mt-1 pt-3 border-t border-white/5">
                                                        <LogOut className="w-4 h-4" /> Déconnexion
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="px-6 py-2 bg-white text-black text-[9px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-yellow-400 transition-all duration-300 italic"
                            >
                                Connexion
                            </Link>
                        )}
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-2xl md:hidden overflow-y-auto"
                    >
                        <div className="flex flex-col min-h-full p-10">
                            <div className="flex justify-between items-center mb-16">
                                <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                                        <Image src="/logo.svg" alt="Logo" width={24} height={24} />
                                    </div>
                                    <span className="text-xl font-black italic tracking-tighter">MATO'S</span>
                                </Link>
                                <button onClick={() => setIsMenuOpen(false)} className="p-4 bg-white/5 rounded-full">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <nav className="flex flex-col gap-6 mb-16">
                                {navLinks.map((link, idx) => (
                                    <motion.div key={link.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`text-6xl font-[1000] italic uppercase tracking-tighter block leading-none ${(link.href === '/' ? pathname === '/' : pathname.startsWith(link.href))
                                                    ? 'text-yellow-400'
                                                    : 'text-white/40'
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>
                            <div className="mt-auto pt-10 border-t border-white/5">
                                {status === 'authenticated' ? (
                                    <div className="flex items-center gap-6 p-6 bg-white/5 rounded-[2.5rem]">
                                        <UserAvatar image={session.user?.image} name={session.user?.name} size="lg" backgroundColor={session.user?.selected_bg || undefined} />
                                        <div>
                                            <p className="text-white font-[1000] text-3xl italic uppercase tracking-tighter leading-none">{session.user?.name?.split(' ')[0]}</p>
                                            <button onClick={handleLogout} className="text-red-500 font-black text-[10px] uppercase tracking-widest mt-2 block">DÉCONNEXION</button>
                                        </div>
                                    </div>
                                ) : (
                                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full bg-yellow-400 text-black py-8 rounded-[2rem] text-center font-[1000] italic uppercase tracking-[0.4em] text-xs">
                                        Connexion Membre
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
