'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, User, LogOut, LayoutDashboard, UserCircle, Settings, Bell } from 'lucide-react';
import { useCart } from '@/app/cart/CartContext';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import NotificationsDropdown from '@/components/NotificationsDropdown';

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { getTotalItems } = useCart();
    const totalItems = getTotalItems();

    const navLinks = [
        { href: '/', label: 'Accueil' },
        { href: '/menu', label: 'Menu' },
        { href: '/promos', label: 'Promos' },
        { href: '/contact', label: 'Contact' },
    ];

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <nav className="bg-gray-950 border-b border-yellow-400/30 sticky top-0 z-50 backdrop-blur-xl bg-opacity-90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Left: Logo */}
                    <Link href="/" className="flex items-center group">
                        <div className="relative w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-yellow-400/10 group-hover:scale-105 transition-transform duration-300">
                            <Image
                                src="/logo.svg"
                                alt="Mato's Logo"
                                width={36}
                                height={36}
                                className="object-contain"
                            />
                        </div>
                        <span className="ml-3 text-2xl font-black text-white tracking-tighter group-hover:text-yellow-400 transition">
                            MATO'S
                        </span>
                    </Link>

                    {/* Middle: Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all hover:bg-white/5 ${pathname === link.href
                                    ? 'text-yellow-400 bg-yellow-400/5'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        {status === 'authenticated' && <NotificationsDropdown />}

                        {/* Cart Indicator */}
                        {totalItems > 0 && (
                            <div className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl font-black text-xs shadow-lg shadow-yellow-400/20">
                                <ShoppingBag className="w-4 h-4" />
                                <span>{totalItems}</span>
                            </div>
                        )}

                        {/* User Access */}
                        <div className="hidden md:block relative">
                            {status === 'authenticated' ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 p-1.5 pr-4 bg-gray-900 border border-gray-800 rounded-2xl hover:border-yellow-400/50 transition truncate max-w-[180px]"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-yellow-400 flex items-center justify-center text-gray-900 font-black">
                                            {session.user?.name?.[0].toUpperCase() || 'U'}
                                        </div>
                                        <span className="text-sm font-bold text-white truncate">{session.user?.name}</span>
                                    </button>

                                    {/* User Dropdown */}
                                    {isUserMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                                            <div className="absolute right-0 mt-3 w-56 bg-gray-900 border border-gray-800 rounded-3xl shadow-3xl z-20 overflow-hidden py-2 animate-slide-up">
                                                <div className="px-4 py-3 border-b border-gray-800 mb-2">
                                                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Connecté en tant que</p>
                                                    <p className="text-sm font-bold text-white truncate">{session.user?.email}</p>
                                                </div>

                                                <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 transition font-bold text-sm">
                                                    <UserCircle className="w-4 h-4" /> Mon Compte
                                                </Link>

                                                {(session.user as any)?.role === 'admin' && (
                                                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-yellow-400 hover:bg-yellow-400/10 transition font-black text-sm">
                                                        <LayoutDashboard className="w-4 h-4" /> Dashboard Admin
                                                    </Link>
                                                )}

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-400/10 transition font-bold text-sm mt-2 border-t border-gray-800 pt-4"
                                                >
                                                    <LogOut className="w-4 h-4" /> Déconnexion
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-black hover:bg-yellow-400 hover:text-gray-900 hover:border-yellow-400 transition transform hover:scale-105"
                                >
                                    Connexion
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-white md:hidden hover:bg-white/5 rounded-xl transition"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-950 border-t border-gray-900 animate-slide-down pb-8">
                    <div className="px-4 py-6 space-y-4">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-5 py-4 rounded-2xl font-black text-lg transition ${pathname === link.href
                                    ? 'bg-yellow-400 text-gray-900 shadow-xl shadow-yellow-400/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="pt-6 border-t border-gray-900">
                            {status === 'authenticated' ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 px-5 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-gray-900 font-black">
                                            {session.user?.name?.[0].toUpperCase()}
                                        </div>
                                        <div className="truncate">
                                            <p className="text-white font-black truncate">{session.user?.name}</p>
                                            <p className="text-gray-500 text-xs font-bold truncate">{session.user?.email}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/account"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 px-5 py-3 text-gray-400 font-bold"
                                    >
                                        <UserCircle className="w-5 h-5" /> Mon Compte
                                    </Link>
                                    {(session.user as any)?.role === 'admin' && (
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 px-5 py-3 text-yellow-400 font-black"
                                        >
                                            <LayoutDashboard className="w-5 h-5" /> Dashboard Admin
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 px-5 py-3 text-red-500 font-bold w-full"
                                    >
                                        <LogOut className="w-5 h-5" /> Déconnexion
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block w-full text-center bg-yellow-400 text-gray-900 py-4 rounded-2xl font-black text-lg shadow-xl shadow-yellow-400/20"
                                >
                                    Connexion
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
