'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/app/cart/CartContext';

export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { getTotalItems } = useCart();
    const totalItems = getTotalItems();

    const navLinks = [
        { href: '/', label: 'Accueil' },
        { href: '/menu', label: 'Menu' },
        { href: '/promos', label: 'Promos' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <nav className="bg-gray-900 border-b border-yellow-400 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <Link href="/" className="flex items-center group">
                        <div className="relative w-14 h-14 bg-white/5 rounded-full border-2 border-yellow-400 p-1 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(250,204,21,0.3)] group-hover:shadow-[0_0_25px_rgba(250,204,21,0.5)] transition-all duration-300">
                            <Image
                                src="/logo.svg"
                                alt="Mato's Logo"
                                width={44}
                                height={44}
                                className="object-contain"
                            />
                        </div>
                        <span className="ml-3 text-3xl font-black text-white tracking-tight group-hover:text-yellow-400 transition">
                            MATO'S
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`font-bold text-lg transition hover:text-yellow-400 ${pathname === link.href
                                    ? 'text-yellow-400'
                                    : 'text-white'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Cart Indicator & Mobile Controls */}
                    <div className="flex items-center gap-4">
                        {/* Desktop Cart Indicator */}
                        {totalItems > 0 && (
                            <div className="hidden sm:flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-black">
                                <ShoppingBag className="w-4 h-4" />
                                <span>{totalItems}</span>
                            </div>
                        )}

                        {/* Mobile: Cart Indicator + Menu Toggle */}
                        <div className="md:hidden flex items-center gap-3">
                            {/* Mobile Cart Indicator */}
                            {totalItems > 0 && (
                                <div className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-3 py-1.5 rounded-full font-black text-sm">
                                    <ShoppingBag className="w-4 h-4" />
                                    <span>{totalItems}</span>
                                </div>
                            )}

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-white"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-800 border-t border-yellow-400 animate-slide-down">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-3 py-2 rounded transition ${pathname === link.href
                                    ? 'bg-yellow-400 text-gray-900 font-bold'
                                    : 'text-gray-300 hover:bg-yellow-500 hover:text-gray-900'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}