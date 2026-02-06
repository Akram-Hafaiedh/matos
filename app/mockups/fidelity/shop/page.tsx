'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Coins, Lock, Sparkles, Zap, Shield, Crown, Gem, Box, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Rank Security Levels
const USER_ACT = 2; // Act II
const USER_LEVEL = 3; // Level 3 within Act II

const ITEM_TYPES = ['Loot Boxes', 'Auras', 'Frames', 'Titles', 'Boosters', 'Exclusive'];

const SHOP_ITEMS = [
    // LOOT BOXES
    { id: 1, name: 'Shadow Crate', type: 'Loot Boxes', price: 500, act: 1, level: 1, rarity: 'Common', icon: <Box className="text-gray-400" /> },
    { id: 2, name: 'Operative Cache', type: 'Loot Boxes', price: 1200, act: 1, level: 5, rarity: 'Uncommon', icon: <Box className="text-green-400" /> },
    { id: 3, name: 'Sultan Chest', type: 'Loot Boxes', price: 3000, act: 2, level: 2, rarity: 'Rare', icon: <Box className="text-blue-400" /> },
    { id: 4, name: 'Syndicate Vault', type: 'Loot Boxes', price: 7500, act: 3, level: 1, rarity: 'Epic', icon: <Box className="text-purple-400" /> },
    { id: 5, name: 'Obsidian Case', type: 'Loot Boxes', price: 15000, act: 4, level: 5, rarity: 'Legendary', icon: <Box className="text-yellow-400" /> },

    // AURAS (Backgrounds)
    { id: 6, name: 'Neon Pulse', type: 'Auras', price: 800, act: 1, level: 3, rarity: 'Common' },
    { id: 7, name: 'Acid Rain', type: 'Auras', price: 1500, act: 2, level: 1, rarity: 'Uncommon' },
    { id: 8, name: 'Digital Ghost', type: 'Auras', price: 2500, act: 2, level: 4, rarity: 'Rare' },
    { id: 9, name: 'Solar Flare', type: 'Auras', price: 5000, act: 3, level: 3, rarity: 'Epic' },
    { id: 10, name: 'Void Matter', type: 'Auras', price: 12000, act: 4, level: 2, rarity: 'Legendary' },

    // FRAMES
    { id: 11, name: 'Steel Wire', type: 'Frames', price: 600, act: 1, level: 2, rarity: 'Common' },
    { id: 12, name: 'Carbon Fiber', type: 'Frames', price: 1800, act: 2, level: 1, rarity: 'Uncommon' },
    { id: 13, name: 'Gold Trim', type: 'Frames', price: 4000, act: 2, level: 5, rarity: 'Rare' },
    { id: 14, name: 'Plasma Glow', type: 'Frames', price: 8000, act: 3, level: 4, rarity: 'Epic' },
    { id: 15, name: 'Reality Glitch', type: 'Frames', price: 20000, act: 4, level: 4, rarity: 'Legendary' },

    // TITLES
    { id: 16, name: 'Shadow', type: 'Titles', price: 300, act: 1, level: 1, rarity: 'Common' },
    { id: 17, name: 'Runner', type: 'Titles', price: 900, act: 1, level: 4, rarity: 'Uncommon' },
    { id: 18, name: 'Mastermind', type: 'Titles', price: 2200, act: 2, level: 3, rarity: 'Rare' },
    { id: 19, name: 'Ghost in Shell', type: 'Titles', price: 5500, act: 3, level: 2, rarity: 'Epic' },
    { id: 20, name: 'True Prophet', type: 'Titles', price: 15000, act: 4, level: 1, rarity: 'Legendary' },

    // BOOSTERS
    { id: 21, name: 'XP Overdrive (1h)', type: 'Boosters', price: 400, act: 1, level: 1, rarity: 'Common' },
    { id: 22, name: 'Token Magnet (3h)', type: 'Boosters', price: 1100, act: 2, level: 1, rarity: 'Uncommon' },
    { id: 23, name: 'Lucky Drop (24h)', type: 'Boosters', price: 3500, act: 2, level: 5, rarity: 'Rare' },
    { id: 24, name: 'Protocol Hack', type: 'Boosters', price: 7000, act: 3, level: 3, rarity: 'Epic' },

    // EXCLUSIVE
    { id: 25, name: 'VIP Pass - Act I', type: 'Exclusive', price: 1000, act: 1, level: 5, rarity: 'Epic' },
    { id: 26, name: 'Mato\'s Secret Sauce', type: 'Exclusive', price: 5000, act: 2, level: 10, rarity: 'Legendary' },
];

// Generate more items to reach ~50
for (let i = 27; i <= 52; i++) {
    const act = Math.floor(Math.random() * 4) + 1;
    const level = Math.floor(Math.random() * 10) + 1;
    const type = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
    SHOP_ITEMS.push({
        id: i,
        name: `${type.slice(0, -1)} Protocol #${i}`,
        type: type,
        price: i * 250,
        act: act,
        level: level,
        rarity: i > 40 ? 'Epic' : i > 30 ? 'Rare' : 'Common'
    });
}

export default function ShopPage() {
    const [filter, setFilter] = useState('All');
    const [openingBox, setOpeningBox] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredItems = SHOP_ITEMS.filter(item => filter === 'All' || item.type === filter);

    // Pagination logic
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // Reset page when filter changes
    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter);
        setCurrentPage(1);
    };

    const isLocked = (act: number, level: number) => {
        if (USER_ACT < act) return true;
        if (USER_ACT === act && USER_LEVEL < level) return true;
        return false;
    };

    return (
        <div className="min-h-screen bg-black text-white p-12 space-y-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-1 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.4)]"></div>
                        <span className="text-[10px] font-[1000] uppercase tracking-[0.4em] text-gray-500 italic">The Black Market</span>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-none">
                        TOKEN <span className="text-yellow-400">SHOP</span>
                    </h2>
                </div>

                <div className="flex items-center gap-6">
                    <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                        <Coins className="text-yellow-400 w-5 h-5" />
                        <span className="text-sm font-black italic tracking-widest">12,450 M-TOKENS</span>
                    </div>
                    <div className="text-right">
                        <div className="text-[8px] font-black uppercase text-gray-600 tracking-widest italic">Current Rank</div>
                        <div className="text-sm font-black italic text-yellow-500 uppercase">Act II - Level 3</div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 border-b border-white/5 pb-8">
                {['All', ...ITEM_TYPES].map((t) => (
                    <button
                        key={t}
                        onClick={() => handleFilterChange(t)}
                        className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-yellow-400 text-black' : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {currentItems.map((item) => {
                    const locked = isLocked(item.act, item.level);
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`group relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 flex flex-col space-y-6 transition-all h-[360px] overflow-hidden ${locked ? 'opacity-40 grayscale' : 'hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-400/5'}`}
                        >
                            {/* Rarity Tag */}
                            <div className="flex justify-between items-start">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${item.rarity === 'Legendary' ? 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5' : item.rarity === 'Epic' ? 'text-purple-400 border-purple-400/30 bg-purple-400/5' : 'text-gray-500 border-white/10'}`}>
                                    {item.rarity}
                                </span>
                                {locked && <Lock size={12} className="text-gray-700" />}
                            </div>

                            {/* Main Visual */}
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                                <div className={`w-24 h-24 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                                    {item.icon || <Sparkles className="text-gray-700 group-hover:text-yellow-400/50" />}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-black uppercase italic tracking-tight text-white group-hover:text-yellow-400 transition-colors line-clamp-1">{item.name}</h4>
                                    <p className="text-[9px] font-black uppercase text-gray-700 tracking-widest italic">{item.type}</p>
                                </div>
                            </div>

                            {/* Buy Button */}
                            <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Coins size={12} className="text-yellow-500" />
                                        <span className="text-[10px] font-[1000] italic text-white">{item.price.toLocaleString()}</span>
                                    </div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-gray-600 italic">
                                        Requirement: Act {item.act}.{item.level}
                                    </div>
                                </div>

                                {locked ? (
                                    <div className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-center text-[8px] font-black uppercase tracking-widest text-red-500/50 italic flex items-center justify-center gap-2">
                                        <Info size={10} />
                                        Security Override Required
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => item.type === 'Loot Boxes' && setOpeningBox(item.id)}
                                        className="w-full py-3 bg-white text-black rounded-xl font-[1000] uppercase text-[9px] tracking-widest hover:bg-yellow-400 transition-all active:scale-95"
                                    >
                                        Deploy Tokens
                                    </button>
                                )}
                            </div>

                            {/* BG Glow */}
                            <div className={`absolute -bottom-12 -right-12 w-32 h-32 blur-[60px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity ${item.rarity === 'Legendary' ? 'bg-yellow-400' : item.rarity === 'Epic' ? 'bg-purple-400' : 'bg-blue-400'}`}></div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-12 border-t border-white/5">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/5 hover:border-yellow-400'}`}
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === page ? 'bg-yellow-400 text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/5 hover:border-yellow-400'}`}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* Loot Box Opening Overlay (Simplified Animation) */}
            <AnimatePresence>
                {openingBox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.8, rotate: -5 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="text-center space-y-12"
                        >
                            <div className="relative">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-yellow-400/20 blur-[100px] rounded-full scale-150"
                                ></motion.div>
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-48 h-48 bg-white/5 border border-white/10 rounded-[3rem] flex items-center justify-center text-8xl shadow-3xl relative z-10"
                                >
                                    🎁
                                </motion.div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-4xl font-[1000] italic uppercase tracking-tighter">DECRYPTING ARCHIVE...</h3>
                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em] italic mb-8">Accessing Syndicate Data Stream</p>
                                <button onClick={() => setOpeningBox(null)} className="px-12 py-5 bg-yellow-400 text-black rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">
                                    Continue Protocol
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
