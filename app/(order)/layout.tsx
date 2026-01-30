'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import UserMenu from '@/components/UserMenu';
import SubFooter from '@/components/SubFooter';
import { Providers } from "../providers";

export default function OrderLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const [searchNumber, setSearchNumber] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchNumber.trim()) {
            router.push(`/tracking/${searchNumber.trim().toUpperCase()}`);
            setSearchNumber('');
        }
    };

    return (
        <Providers>
            <div className="min-h-screen bg-black flex flex-col">
                {/* Dedicated Order Header */}
                <nav className="fixed top-0 left-0 right-0 z-[60] bg-black/50 backdrop-blur-xl border-b border-white/5 py-4">
                    <div className="max-w-7xl mx-auto px-6 flex items-center gap-8">

                        {/* Left side: Logo & Home link */}
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center group">
                                <div className="relative w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-yellow-400/10 group-hover:scale-105 transition-transform duration-300">
                                    <Image
                                        src="/logo.svg"
                                        alt="Mato's Logo"
                                        width={28}
                                        height={28}
                                        className="object-contain"
                                    />
                                </div>
                                <span className="ml-3 text-xl font-black text-white tracking-tighter group-hover:text-yellow-400 transition hidden sm:inline">
                                    MATO'S
                                </span>
                            </Link>

                            <div className="hidden md:flex items-center gap-6">
                                <Link href="/" className="text-gray-400 hover:text-white font-black uppercase text-[10px] tracking-widest transition-all">Accueil</Link>
                            </div>
                        </div>

                        {/* Middle: Integrated Search bar */}
                        <div className="flex-1 max-w-md mx-auto hidden sm:block">
                            <form onSubmit={handleSearch} className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-400 transition-all" />
                                <input
                                    type="text"
                                    value={searchNumber}
                                    onChange={(e) => setSearchNumber(e.target.value)}
                                    placeholder="SUIVRE UNE COMMANDE..."
                                    className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-2xl font-bold uppercase text-[10px] tracking-widest focus:outline-none focus:border-yellow-400/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
                                />
                            </form>
                        </div>

                        {/* Right: User Menu */}
                        <div className="flex items-center gap-4 ml-auto">
                            <UserMenu />
                        </div>
                    </div>
                </nav>

                {/* Mobile Search */}
                <div className="sm:hidden fixed top-20 left-0 right-0 z-[55] px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/5">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={searchNumber}
                            onChange={(e) => setSearchNumber(e.target.value)}
                            placeholder="SUIVRE UNE COMMANDE..."
                            className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest"
                        />
                    </form>
                </div>

                <main className="flex-1">{children}</main>

                <footer className="py-12">
                    <div className="max-w-7xl mx-auto px-6">
                        <SubFooter />
                    </div>
                </footer>
            </div>
        </Providers>
    );
}
