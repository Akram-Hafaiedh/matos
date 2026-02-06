'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Star, Crown, Sword, Lock, CheckCircle2, Target, Trophy, Flame, Skull, Gift } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface SyndicateOverviewProps {
    isOpen: boolean;
    onClose: () => void;
}

// Narrative Data structure from Mockup
const QUEST_LINES_DATA = [
    {
        id: 'act-1',
        title: "ACTE I : L'INITIATION",
        theme: 'from-zinc-800 to-zinc-900',
        accent: 'text-zinc-400',
        accentBg: 'bg-zinc-400',
        border: 'border-zinc-700',
        minPoints: 0,
        maxPoints: 1000,
        ranks: [
            { name: 'Recrue', stars: 1, req: '0 - 150 pts', min: 0, max: 150 },
            { name: 'Prospect', stars: 2, req: '151 - 300 pts', min: 151, max: 300 },
            { name: 'Initié', stars: 3, req: '301 - 450 pts', min: 301, max: 450 },
        ],
        boss: {
            name: 'LE PACTE',
            desc: 'Commandez le "Menu Signature" pour activer votre carte de membre.',
            icon: Shield,
            reward: 'Carte Membre + Dessert Offert'
        }
    },
    {
        id: 'act-2',
        title: "ACTE II : L'ASCENSION",
        theme: 'from-emerald-900 to-emerald-950',
        accent: 'text-emerald-500',
        accentBg: 'bg-emerald-500',
        border: 'border-emerald-500/30',
        minPoints: 1000,
        maxPoints: 2500,
        ranks: [
            { name: 'Soldat', stars: 1, req: '1K - 1.5K pts', min: 1000, max: 1500 },
            { name: 'Lieutenant', stars: 2, req: '1.5K - 2K pts', min: 1501, max: 2000 },
            { name: 'Capitaine', stars: 3, req: '2K - 2.5K pts', min: 2001, max: 2500 },
        ],
        boss: {
            name: "L'ÉPREUVE DU FEU",
            desc: 'Finir le "Tacos Inferno" (Niveau 5 Piquant) sans boire.',
            icon: Flame,
            reward: 'Rang Or Débloqué + T-Shirt "Survivor"'
        }
    },
    {
        id: 'act-3',
        title: 'ACTE III : LE POUVOIR',
        theme: 'from-amber-900 to-amber-950',
        accent: 'text-amber-500',
        accentBg: 'bg-amber-500',
        border: 'border-amber-500/30',
        minPoints: 2500,
        maxPoints: 5000,
        ranks: [
            { name: 'Baron', stars: 1, req: '2.5K - 3.5K pts', min: 2500, max: 3500 },
            { name: 'Parrain', stars: 2, req: '3.5K - 4.2K pts', min: 3501, max: 4200 },
            { name: 'Sultan', stars: 3, req: '4.2K - 5K pts', min: 4201, max: 5000 },
        ],
        boss: {
            name: 'LE TITAN',
            desc: "Terminer le plateau \"Giga-Mato's\" (2kg) en moins de 20min.",
            icon: Crown,
            reward: 'Rang Diamant + Plaque Murale au Restaurant'
        }
    },
    {
        id: 'act-4',
        title: 'ACTE IV : LÉGENDE',
        theme: 'from-purple-900 to-indigo-950',
        accent: 'text-purple-500',
        accentBg: 'bg-purple-500',
        border: 'border-purple-500/30',
        minPoints: 5000,
        maxPoints: 1000000,
        ranks: [
            { name: 'Icône', stars: 1, req: '5K - 7.5K pts', min: 5000, max: 7500 },
            { name: 'Immortel', stars: 2, req: '7.5K - 10K pts', min: 7501, max: 10000 },
            { name: 'L\'Élu', stars: 3, req: '10K+ pts', min: 10001, max: 1000000 },
        ],
        boss: {
            name: "L'HÉRITAGE",
            desc: 'Créer votre propre recette secrète avec le Chef et la valider.',
            icon: Skull,
            reward: 'Votre Recette à la Carte + Royalties'
        }
    }
];

export default function SyndicateOverview({ isOpen, onClose }: SyndicateOverviewProps) {
    const [points, setPoints] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetch('/api/user/profile')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setPoints(data.user.loyaltyPoints || 0);
                    }
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [isOpen]);

    const getActStatus = (act: typeof QUEST_LINES_DATA[0], userPoints: number) => {
        if (userPoints >= act.maxPoints) return 'COMPLETED';
        if (userPoints >= act.minPoints) return 'ACTIVE';
        return 'LOCKED';
    };

    const getBossProgress = (act: typeof QUEST_LINES_DATA[0], userPoints: number) => {
        if (userPoints >= act.maxPoints) return 100;
        if (userPoints < act.minPoints) return 0;
        const progress = ((userPoints - act.minPoints) / (act.maxPoints - act.minPoints)) * 100;
        return Math.min(Math.round(progress), 100);
    };
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 overflow-hidden">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        className="relative w-full max-w-5xl h-full max-h-[92vh] bg-[#030303] border border-white/5 rounded-[4rem] overflow-hidden flex flex-col shadow-[0_50px_150px_rgba(0,0,0,1)]"
                    >
                        {/* Header */}
                        <div className="px-10 py-12 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-yellow-400/5 via-transparent to-transparent">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-400/20 bg-yellow-400/10 backdrop-blur-md">
                                    <Sword className="w-3 h-3 text-yellow-500" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-500">Classification Syndicate V5</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-[1000] uppercase italic tracking-tighter text-white leading-none">
                                    LA VOIE DU <span className="text-yellow-400">POUVOIR</span>
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all active:scale-95 group"
                            >
                                <X size={28} className="group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        {/* Content Scrollable Area */}
                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
                            {/* Narrative Act Roadmap */}
                            <div className="max-w-4xl mx-auto space-y-20 relative pt-12">
                                {/* Vertical Connection Line */}
                                <div className="absolute left-[31px] top-12 bottom-0 w-[2px] bg-gradient-to-b from-yellow-400/20 via-white/5 to-transparent z-0"></div>

                                {QUEST_LINES_DATA.map((act, idx) => {
                                    const status = getActStatus(act, points);
                                    const progress = getBossProgress(act, points);
                                    const BossIcon = act.boss.icon;

                                    return (
                                        <motion.div
                                            key={act.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                                            className={`relative z-10 transition-opacity duration-700 ${status === 'LOCKED' && idx > 0 ? 'opacity-40' : 'opacity-100'}`}
                                        >
                                            {/* Act Header */}
                                            <div className="flex items-center gap-8 mb-10">
                                                <div className={`w-16 h-16 rounded-[2rem] bg-gradient-to-br ${act.theme} border ${act.border} flex items-center justify-center shadow-2xl relative group overflow-hidden`}>
                                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <span className={`text-2xl font-[1000] ${act.accent} italic`}>{idx + 1}</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter text-white">{act.title}</h3>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em]">Secteur Sécurisé</span>
                                                        <div className="w-8 h-[1px] bg-white/10"></div>
                                                        <span className={`${act.accent} text-[9px] font-black uppercase tracking-[0.3em]`}>
                                                            {status === 'COMPLETED' ? 'OPÉRATIONNEL' : status === 'ACTIVE' ? 'EN COURS' : 'VERROUILLÉ'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ranks & Boss Interaction */}
                                            <div className="ml-[31px] border-l-2 border-white/5 pl-12 space-y-10 pb-4">

                                                {/* Sub-Ranks Grid */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {act.ranks.map((rank, rIdx) => {
                                                        const isRankCompleted = points >= rank.max;
                                                        const isRankActive = points >= rank.min && points <= rank.max;
                                                        const rankProgress = isRankCompleted ? 100 : isRankActive ? Math.round(((points - rank.min) / (rank.max - rank.min)) * 100) : 0;

                                                        return (
                                                            <div key={rIdx} className={`bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] flex flex-col gap-4 transition-all cursor-pointer group ${isRankCompleted || isRankActive ? 'opacity-100' : 'opacity-40'}`}>
                                                                <div className="flex justify-between items-start">
                                                                    <div className="space-y-1">
                                                                        <span className={`text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors italic ${isRankCompleted || isRankActive ? act.accent : 'text-gray-500'}`}>{rank.name}</span>
                                                                        <p className="text-[8px] text-gray-700 font-mono tracking-tighter">{rank.req}</p>
                                                                    </div>
                                                                    <div className="flex gap-0.5">
                                                                        {[...Array(rank.stars)].map((_, i) => (
                                                                            <Star key={i} size={8} className={`${isRankCompleted || isRankActive ? act.accent : 'text-gray-800'} fill-current`} />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${rankProgress}%` }}
                                                                        className={`h-full ${act.accentBg} transition-all duration-1000 ${isRankCompleted ? 'opacity-100 shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'opacity-30'}`}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* BOSS BATTLE CARD */}
                                                <div className={`relative overflow-hidden rounded-[3rem] border transition-all duration-1000 ${status === 'LOCKED'
                                                    ? 'border-white/5 bg-zinc-950/40 grayscale'
                                                    : `border-${act.accent.split('-')[1]}-500/30 bg-gradient-to-br ${act.theme} shadow-3xl`
                                                    }`}>

                                                    {/* Locked Overlay */}
                                                    {status === 'LOCKED' && (
                                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-20 flex items-center justify-center">
                                                            <div className="flex items-center gap-4 px-6 py-3 rounded-full border border-white/10 bg-black/80 backdrop-blur-xl">
                                                                <Lock size={14} className="text-gray-600" />
                                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Protocole Verrouillé</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="p-10 flex flex-col md:flex-row items-center gap-10 relative z-10">
                                                        {/* Boss Icon Container */}
                                                        <div className={`w-24 h-24 rounded-full border-4 ${status === 'ACTIVE'
                                                            ? 'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] animate-pulse'
                                                            : 'border-white/10'
                                                            } flex items-center justify-center bg-black/40 shadow-2xl shrink-0 group-hover:scale-105 transition-transform`}>
                                                            <div className={`${status === 'ACTIVE' ? 'text-yellow-400' : status === 'COMPLETED' ? act.accent : 'text-gray-600'}`}>
                                                                <BossIcon className="w-8 h-8" />
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 space-y-4 text-center md:text-left">
                                                            <div className="flex flex-col md:flex-row items-center gap-4">
                                                                <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-xl ${status === 'ACTIVE'
                                                                    ? 'bg-yellow-400 text-black'
                                                                    : 'bg-black/30 text-gray-500'
                                                                    }`}>
                                                                    {status === 'ACTIVE' ? '⚠️ MISSION CRITIQUE' : 'OBJECTIF DE BOSS'}
                                                                </span>
                                                                {status === 'COMPLETED' && (
                                                                    <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                                                        <CheckCircle2 size={16} /> VALIDÉ
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <h4 className={`text-4xl font-[1000] uppercase italic tracking-tighter ${status === 'LOCKED' ? 'text-gray-700' : 'text-white'
                                                                }`}>
                                                                {act.boss.name}
                                                            </h4>
                                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest max-w-md leading-relaxed italic">
                                                                {act.boss.desc}
                                                            </p>

                                                            {/* Progress Bar for Active Boss */}
                                                            {status === 'ACTIVE' && (
                                                                <div className="mt-6 space-y-2">
                                                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500">
                                                                        <span>Séquence de Complétion</span>
                                                                        <span>{progress}%</span>
                                                                    </div>
                                                                    <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                                                        <motion.div
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: `${progress}%` }}
                                                                            transition={{ duration: 2, ease: "circOut" }}
                                                                            className="h-full bg-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.6)] rounded-full"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Reward Section */}
                                                        <div className="w-full md:w-56 text-center md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-10 space-y-3">
                                                            <div className="flex items-center justify-center md:justify-end gap-2 text-gray-600">
                                                                <Gift size={14} />
                                                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Butin Final</p>
                                                            </div>
                                                            <p className={`text-sm font-black italic leading-tight uppercase ${status === 'LOCKED' ? 'text-gray-800' : 'text-yellow-400'
                                                                }`}>
                                                                {act.boss.reward}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Background Decorative Layer */}
                                                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none"></div>
                                                    {status === 'ACTIVE' && (
                                                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Footer Content */}
                        <div className="px-12 py-8 border-t border-white/5 bg-black flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-12 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Stabilité du Réseau</p>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className={`w-3 h-1 rounded-full ${i < 4 ? 'bg-emerald-500/50' : 'bg-gray-800'}`}></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Données Chiffrées</p>
                                    <p className="text-[10px] font-mono text-emerald-500/50 uppercase tracking-tighter">AES-256 GCM SECURED</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Version du Système</p>
                                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">SYNDICATE-CORE v5.8.2-PROD</p>
                                </div>
                            </div>
                            <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">
                                Mato's Intelligence Unit
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
