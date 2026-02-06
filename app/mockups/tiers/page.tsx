'use client';

import { motion } from 'framer-motion';
import { Target, Skull, Crown, Sword, Lock, CheckCircle2, ChevronRight, Star, Shield, Trophy, Flame } from 'lucide-react';

// The "Syndicate" Progression System
const QUEST_LINES = [
    {
        id: 'act-1',
        title: 'ACTE I : L\'INITIATION',
        theme: 'from-zinc-800 to-zinc-900',
        accent: 'text-zinc-400',
        border: 'border-zinc-700',
        ranks: [
            { name: 'Recrue', stars: 1, req: '0 - 150 pts' },
            { name: 'Prospect', stars: 2, req: '150 - 300 pts' },
            { name: 'Initié', stars: 3, req: '300 - 450 pts' },
        ],
        boss: {
            name: 'LE PACTE',
            desc: 'Commandez le "Menu Signature" pour activer votre carte de membre.',
            icon: <Shield className="w-8 h-8" />,
            status: 'COMPLETED', // 'LOCKED', 'ACTIVE', 'COMPLETED'
            reward: 'Carte Membre + Dessert Offert'
        }
    },
    {
        id: 'act-2',
        title: 'ACTE II : L\'ASCENSION',
        theme: 'from-emerald-900 to-emerald-950',
        accent: 'text-emerald-500',
        border: 'border-emerald-500/30',
        ranks: [
            { name: 'Soldat', stars: 1, req: '500 - 800 pts' },
            { name: 'Lieutenant', stars: 2, req: '800 - 1.2K pts' },
            { name: 'Capitaine', stars: 3, req: '1.2K - 1.5K pts' },
        ],
        boss: {
            name: 'L\'ÉPREUVE DU FEU',
            desc: 'Finir le "Tacos Inferno" (Niveau 5 Piquant) sans boire.',
            icon: <Flame className="w-8 h-8" />,
            status: 'ACTIVE',
            progress: 0, // Not started
            reward: 'Rang Or Débloqué + T-Shirt "Survivor"'
        }
    },
    {
        id: 'act-3',
        title: 'ACTE III : LE POUVOIR',
        theme: 'from-amber-900 to-amber-950',
        accent: 'text-amber-500',
        border: 'border-amber-500/30',
        ranks: [
            { name: 'Baron', stars: 1, req: '1.5K - 2.5K pts' },
            { name: 'Parrain', stars: 2, req: '2.5K - 4K pts' },
            { name: 'Sultan', stars: 3, req: '4K - 5K pts' },
        ],
        boss: {
            name: 'LE TITAN',
            desc: 'Terminer le plateau "Giga-Mato\'s" (2kg) en moins de 20min.',
            icon: <Crown className="w-8 h-8" />,
            status: 'LOCKED',
            reward: 'Rang Diamant + Plaque Murale au Restaurant'
        }
    },
    {
        id: 'act-4',
        title: 'ACTE IV : LÉGENDE',
        theme: 'from-purple-900 to-indigo-950',
        accent: 'text-purple-500',
        border: 'border-purple-500/30',
        ranks: [
            { name: 'Icône', stars: 1, req: '5K - 7.5K pts' },
            { name: 'Immortel', stars: 2, req: '7.5K - 10K pts' },
            { name: 'L\'Élu', stars: 3, req: '10K+ pts' },
        ],
        boss: {
            name: 'L\'HÉRITAGE',
            desc: 'Créer votre propre recette secrète avec le Chef et la valider.',
            icon: <Skull className="w-8 h-8" />,
            status: 'LOCKED',
            reward: 'Votre Recette à la Carte + Royalties'
        }
    }
];

export default function SyndicateQuestMockup() {
    return (
        <div className="min-h-screen bg-[#030303] text-white p-6 md:p-20 font-sans selection:bg-yellow-500/30">

            <header className="max-w-4xl mx-auto mb-20 text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-[10px] uppercase tracking-widest font-black">
                    <Sword size={12} />
                    <span>Système de Progression V5</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter leading-none">
                    La Voie du <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-red-600">Pouvoir</span>
                </h1>
                <p className="text-gray-500 uppercase tracking-[0.3em] text-xs font-bold max-w-lg mx-auto leading-relaxed">
                    Remplissez les contrats. Battez les boss. Réclamez votre territoire.
                </p>
            </header>

            <div className="max-w-3xl mx-auto space-y-12 relative">
                {/* Connecting Line */}
                <div className="absolute left-[27px] top-10 bottom-10 w-[2px] bg-white/5 z-0"></div>

                {QUEST_LINES.map((act, idx) => (
                    <motion.div
                        key={act.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-100px" }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative z-10"
                    >
                        {/* Act Header */}
                        <div className="flex items-center gap-6 mb-6">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${act.theme} border ${act.border} flex items-center justify-center shadow-2xl relative`}>
                                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity rounded-2xl"></div>
                                <span className={`text-xl font-[1000] ${act.accent}`}>{idx + 1}</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter text-white">{act.title}</h2>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Secteur {idx + 1} // Déverrouillé</p>
                            </div>
                        </div>

                        {/* Ranks & Progress */}
                        <div className="ml-[27px] border-l-2 border-white/5 pl-10 space-y-4 pb-8">

                            {/* Sub-Ranks Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {act.ranks.map((rank, rIdx) => (
                                    <div key={rIdx} className="bg-white/[0.03] border border-white/5 p-4 rounded-xl flex flex-col gap-2 hover:bg-white/[0.06] transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors">{rank.name}</span>
                                            <div className="flex gap-0.5">
                                                {[...Array(rank.stars)].map((_, i) => (
                                                    <Star key={i} size={8} className={`${act.accent} fill-current`} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-2">
                                            <div className={`h-full bg-current ${act.accent} w-full opacity-50`}></div>
                                        </div>
                                        <p className="text-[9px] text-gray-600 font-mono mt-auto">{rank.req}</p>
                                    </div>
                                ))}
                            </div>

                            {/* BOSS BATTLE CARD */}
                            <div className={`mt-6 relative overflow-hidden rounded-[2rem] border ${act.boss.status === 'LOCKED' ? 'border-white/5 bg-zinc-950/50' : `border-${act.accent.split('-')[1]}-500/40 bg-gradient-to-r ${act.theme}`}`}>

                                {act.boss.status === 'LOCKED' && <div className="absolute inset-0 backdrop-blur-[2px] bg-black/40 z-20 flex items-center justify-center">
                                    <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-md">
                                        <Lock size={12} className="text-gray-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Locked</span>
                                    </div>
                                </div>}

                                <div className="p-8 flex items-center gap-8 relative z-10">
                                    {/* Boss Icon */}
                                    <div className={`w-20 h-20 rounded-full border-4 ${act.boss.status === 'ACTIVE' ? 'border-yellow-500 animate-pulse' : 'border-white/10'} flex items-center justify-center bg-black/40 shadow-2xl shrink-0`}>
                                        <div className={`${act.boss.status === 'ACTIVE' ? 'text-yellow-400' : 'text-gray-500'}`}>
                                            {act.boss.icon}
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded bg-black/30 ${act.boss.status === 'ACTIVE' ? 'text-yellow-400' : 'text-gray-500'}`}>
                                                {act.boss.status === 'ACTIVE' ? '⚠️ COMBAT DE BOSS ACTIF' : 'DÉFI DE BOSS'}
                                            </span>
                                            {act.boss.status === 'COMPLETED' && <CheckCircle2 size={16} className="text-emerald-500" />}
                                        </div>

                                        <h3 className={`text-3xl font-[1000] uppercase italic tracking-tighter ${act.boss.status === 'LOCKED' ? 'text-gray-600' : 'text-white'}`}>
                                            {act.boss.name}
                                        </h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide max-w-sm">
                                            {act.boss.desc}
                                        </p>

                                        {/* Boss Progress Bar */}
                                        {act.boss.status === 'ACTIVE' && (
                                            <div className="mt-4 space-y-1">
                                                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-yellow-500/80">
                                                    <span>Progression du Défi</span>
                                                    <span>{act.boss.progress}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${act.boss.progress}%` }}
                                                        transition={{ duration: 1.5, ease: "circOut" }}
                                                        className="h-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Reward Preview */}
                                    <div className="hidden md:block w-40 text-right border-l border-white/10 pl-8">
                                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Butin (Loot)</p>
                                        <p className={`text-xs font-bold leading-tight ${act.boss.status === 'LOCKED' ? 'text-gray-700' : 'text-yellow-200'}`}>
                                            {act.boss.reward}
                                        </p>
                                    </div>
                                </div>

                                {/* Boss Background Pattern */}
                                <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                                {act.boss.status === 'ACTIVE' && <div className="absolute top-0 right-0 p-32 bg-yellow-500/10 blur-[80px] rounded-full pointer-events-none"></div>}
                            </div>

                        </div>
                    </motion.div>
                ))}

            </div>
        </div>
    );
}
