'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Target, Skull, Crown, Sword, Lock, CheckCircle2, ChevronRight, Star, Shield, Trophy, Flame, Gift, Key, X, Sparkles, LayoutDashboard, ShoppingBag, User, Settings, LogOut, Zap, TrendingUp } from 'lucide-react';
import { useState } from 'react';

// --- DATA ---
const QUEST_LINES = [
    {
        id: 'act-1',
        title: "ACTE I : L'INITIATION",
        theme: 'from-zinc-800 to-zinc-900',
        accent: 'text-zinc-400',
        border: 'border-zinc-700',
        ranks: [
            { name: 'Recrue', stars: 1, req: '0 - 150 pts' },
            { name: 'Prospect', stars: 2, req: '150 - 300 pts' },
            { name: 'Initié', stars: 3, req: '300 - 450 pts' },
        ],
        boss: {
            name: 'LE PACTE', // Renamed from Le Baptême
            desc: 'Commandez le "Menu Signature" pour activer votre carte de membre.',
            icon: <Shield className="w-8 h-8" />,
            status: 'COMPLETED',
            reward: 'Carte Membre + Dessert Offert'
        }
    },
    {
        id: 'act-2',
        title: "ACTE II : L'ASCENSION",
        theme: 'from-emerald-900 to-emerald-950',
        accent: 'text-emerald-500',
        border: 'border-emerald-500/30',
        ranks: [
            { name: 'Soldat', stars: 1, req: '500 - 800 pts' },
            { name: 'Lieutenant', stars: 2, req: '800 - 1.2K pts' },
            { name: 'Capitaine', stars: 3, req: '1.2K - 1.5K pts' },
        ],
        boss: {
            name: "L'ÉPREUVE DU FEU",
            desc: 'Finir le "Tacos Inferno" (Niveau 5 Piquant) sans boire.',
            icon: <Flame className="w-8 h-8" />,
            status: 'ACTIVE',
            progress: 33,
            reward: 'Rang Or Débloqué + T-Shirt "Survivor"'
        }
    }
];

// --- ELITE CINEMATIC CHEST SVG ---
const SyndicateChest = ({ isOpen }: { isOpen: boolean }) => (
    <div className="relative w-48 h-48 flex items-center justify-center scale-75">
        {/* Ambient Glow */}
        <div className={`absolute inset-0 bg-yellow-500/20 blur-[60px] rounded-full transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-40'}`}></div>

        <svg width="200" height="200" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl overflow-visible">
            <defs>
                <linearGradient id="metalDark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#27272a" />
                    <stop offset="50%" stopColor="#18181b" />
                    <stop offset="100%" stopColor="#09090b" />
                </linearGradient>
                <linearGradient id="goldLuxe" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#854d0e" />
                </linearGradient>
                <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* BASE / BODY */}
            <path d="M40 100 L200 100 L210 180 C210 190 200 200 190 200 L50 200 C40 200 30 190 30 180 Z" fill="url(#metalDark)" stroke="#3f3f46" strokeWidth="2" />

            {/* GOLDEN STRAPS - Vertical */}
            <rect x="60" y="100" width="12" height="100" fill="url(#goldLuxe)" opacity="0.8" />
            <rect x="168" y="100" width="12" height="100" fill="url(#goldLuxe)" opacity="0.8" />

            {/* TOP LID - Animated */}
            <motion.g
                initial={false}
                animate={{ rotateX: isOpen ? -110 : 0, y: isOpen ? -40 : 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
                style={{ originY: "100px" }}
            >
                <path d="M30 50 C30 40 40 30 50 30 L190 30 C200 30 210 40 210 50 L200 100 L40 100 Z" fill="url(#metalDark)" stroke="#facc15" strokeWidth="2" />
                <rect x="60" y="30" width="12" height="70" fill="url(#goldLuxe)" />
                <rect x="168" y="30" width="12" height="70" fill="url(#goldLuxe)" />

                <g filter="url(#innerGlow)">
                    <rect x="100" y="75" width="40" height="50" rx="8" fill="url(#goldLuxe)" />
                    <circle cx="120" cy="100" r="12" fill="#09090b" />
                    <motion.circle
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        cx="120" cy="100" r="6" fill="#facc15"
                    />
                </g>
            </motion.g>

            {/* LIGHT EXPLOSION ON OPEN */}
            <AnimatePresence>
                {isOpen && (
                    <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1.5 }} exit={{ opacity: 0 }}>
                        <circle cx="120" cy="80" r="20" fill="#facc15" filter="blur(20px)" />
                    </motion.g>
                )}
            </AnimatePresence>
        </svg>
    </div>
);


const LOOT_ITEMS = [
    { name: 'Remise 10%', type: 'common', color: 'text-zinc-500', icon: <Target className="w-4 h-4" /> },
    { name: 'Boisson Offerte', type: 'common', color: 'text-zinc-500', icon: <Flame className="w-4 h-4" /> },
    { name: 'Frites XL', type: 'common', color: 'text-zinc-500', icon: <Zap className="w-4 h-4" /> },
    { name: 'Sauce Secrète', type: 'common', color: 'text-zinc-500', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Tacos Simple', type: 'rare', color: 'text-emerald-500', icon: <Gift className="w-4 h-4" /> },
    { name: 'Menu Signature', type: 'rare', color: 'text-emerald-500', icon: <Star className="w-4 h-4" /> },
    { name: 'Dessert Surprise', type: 'rare', color: 'text-emerald-500', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Suppléments Illimités', type: 'rare', color: 'text-emerald-500', icon: <Flame className="w-4 h-4" /> },
    { name: 'Clé d\'Argent', type: 'epic', color: 'text-purple-500', icon: <Key className="w-4 h-4" /> },
    { name: 'Double XP 24h', type: 'epic', color: 'text-purple-500', icon: <Zap className="w-4 h-4" /> },
    { name: 'Accès Prioritaire', type: 'epic', color: 'text-purple-500', icon: <Shield className="w-4 h-4" /> },
    { name: 'Golden Ticket', type: 'legendary', color: 'text-yellow-500', icon: <Crown className="w-4 h-4" /> },
    { name: 'Le Giga-Mato\'s', type: 'legendary', color: 'text-yellow-500', icon: <Trophy className="w-4 h-4" /> },
    { name: 'Black Burger Kit', type: 'legendary', color: 'text-yellow-500', icon: <Gift className="w-4 h-4" /> },
    { name: 'Statut Sultan (1h)', type: 'legendary', color: 'text-yellow-500', icon: <Skull className="w-4 h-4" /> },
];

export default function DashboardFidelityMockup() {
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'QUESTS' | 'LOOT'>('OVERVIEW');
    const [isLootOpen, setIsLootOpen] = useState(false);
    const [lootResult, setLootResult] = useState<any>(null);

    const openLootBox = () => {
        if (isLootOpen) {
            setIsLootOpen(false);
            setLootResult(null);
            return;
        }
        setIsLootOpen(true);
        setTimeout(() => {
            setLootResult(LOOT_ITEMS[Math.floor(Math.random() * LOOT_ITEMS.length)]);
        }, 1500);
    };

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">

            {/* SIDEBAR SIMULATION */}
            <aside className="w-64 border-r border-white/5 bg-black/50 backdrop-blur-xl flex flex-col p-6 gap-2">
                <div className="h-10 w-32 bg-yellow-500/20 rounded-lg mb-8 flex items-center justify-center font-black text-yellow-500 tracking-widest italic uppercase">MATO'S</div>

                <div className="space-y-1">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer">
                        <LayoutDashboard size={18} /> <span className="text-xs font-bold uppercase tracking-wider">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer">
                        <ShoppingBag size={18} /> <span className="text-xs font-bold uppercase tracking-wider">Commandes</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-500/10 text-yellow-500 cursor-pointer border border-yellow-500/20">
                        <Shield size={18} /> <span className="text-xs font-bold uppercase tracking-wider">Fidélité</span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer">
                        <User size={18} /> <span className="text-xs font-bold uppercase tracking-wider">Compte</span>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 px-4 py-3 text-red-400/60 cursor-pointer hover:text-red-400">
                        <LogOut size={18} /> <span className="text-xs font-bold uppercase tracking-wider">Déconnexion</span>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col overflow-y-auto">

                {/* HEADER SIMULATION */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md sticky top-0 z-50">
                    <h1 className="text-xl font-[1000] uppercase italic tracking-tighter">Mon Programme</h1>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-500 text-[10px] font-black uppercase tracking-widest">
                            850 PTS
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/10"></div>
                    </div>
                </header>

                <div className="p-8 max-w-6xl mx-auto w-full space-y-8">

                    {/* TOP STATS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-2 p-8 rounded-[2rem] bg-gradient-to-br from-zinc-900 to-black border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Shield size={120} />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Rang Actuel</p>
                                <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter text-white">Lieutenant <span className="text-yellow-500">II</span></h2>
                                <div className="mt-6 w-full max-w-md space-y-2">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-500">
                                        <span>Progression XP</span>
                                        <span>1250 / 2000</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-500 w-[65%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 flex flex-col items-center justify-center text-center gap-4 relative group cursor-pointer hover:border-yellow-500/30 transition-colors" onClick={openLootBox}>
                            <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            {!lootResult ? (
                                <>
                                    <SyndicateChest isOpen={isLootOpen} />
                                    <div>
                                        <h3 className="text-xl font-[1000] italic uppercase tracking-tighter">Coffre Butin</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">1 Clé Disponible</p>
                                    </div>
                                </>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-2">
                                        {lootResult.icon}
                                    </div>
                                    <p className={`text-[8px] font-black uppercase tracking-widest ${lootResult.color}`}>{lootResult.type}</p>
                                    <h3 className="text-sm font-[1000] uppercase italic tracking-tighter">{lootResult.name}</h3>
                                    <button className="mt-4 text-[8px] font-black uppercase tracking-widest text-white/40 hover:text-white">Réclamer</button>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* MAIN TABS AREA */}
                    <div className="space-y-6">
                        <div className="flex gap-4 border-b border-white/5 pb-4">
                            {['OVERVIEW', 'QUESTS', 'LOOT'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-colors ${activeTab === tab ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="min-h-[400px]">
                            <h3 className="text-lg font-[1000] italic uppercase tracking-tighter mb-6 text-gray-400">
                                {activeTab === 'OVERVIEW' ? 'Quêtes Actives' : activeTab === 'QUESTS' ? 'Toutes les Quêtes' : 'Historique Butin'}
                            </h3>

                            <div className="space-y-4">
                                {QUEST_LINES.map((act, idx) => (
                                    <div key={idx} className="flex items-center gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${act.theme} flex items-center justify-center border ${act.border}`}>
                                            <span className={`font-[1000] ${act.accent}`}>{idx + 1}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm text-white">{act.boss.name}</h4>
                                            <p className="text-xs text-gray-500">{act.boss.desc}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-black ${act.boss.status === 'COMPLETED' ? 'text-emerald-500' : 'text-yellow-500'}`}>
                                                {act.boss.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
