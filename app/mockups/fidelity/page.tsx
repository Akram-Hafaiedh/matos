'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Target, Skull, Crown, Sword, Lock, CheckCircle2,
    ChevronRight, Star, Shield, Trophy, Flame, Gift,
    Key, X, Sparkles, Zap, Timer, TrendingUp,
    Fingerprint, Scan, ShieldAlert, Coins, Palette,
    Layout, Smile, User, Camera, Bell
} from 'lucide-react';
import { useState, useRef } from 'react';
import AmbientBackground from '@/components/AmbientBackground';
import SectionHeader from '@/components/SectionHeader';

// --- DATA ---
const LOOT_ITEMS = [
    { name: 'Tacos Giga-Sultan', type: 'legendary', color: 'text-yellow-500', icon: <Crown /> },
    { name: 'Clé du Sanctuaire', type: 'epic', color: 'text-purple-500', icon: <Key /> },
    { name: 'Menu Baron d\'Or', type: 'legendary', color: 'text-yellow-500', icon: <Trophy /> },
];

const ACTS = [
    { id: 'I', name: 'INITIATION', tiers: ['Recrue', 'Soldat'], reward: 'Border Bronze' },
    { id: 'II', name: 'ASCENSION', tiers: ['Caporal', 'Sergent', 'Lieutenant'], reward: 'Chest Silver' },
    { id: 'III', name: 'POUVOIR', tiers: ['Capitaine', 'Baron', 'Gouverneur'], reward: 'Neon Background' },
    { id: 'IV', name: 'LÉGENDE', tiers: ['Sultan', 'Immortal'], reward: 'King Flair' },
];

const QUESTS = [
    { title: 'Le festin du Baron', desc: 'Commander 3 Pizzas Signature', reward: 50, icon: <Flame className="w-4 h-4" /> },
    { title: 'Soutien Logistique', desc: 'Laisser 2 avis détaillés', reward: 20, icon: <CheckCircle2 className="w-4 h-4" /> },
    { title: 'Infiltration Nocturne', desc: 'Commander après 22h', reward: 30, icon: <Zap className="w-4 h-4" /> },
];

const SHOP_ITEMS = [
    { category: 'Borders', name: 'Neon Yellow', price: 100, preview: <div className="w-12 h-12 rounded-full border-2 border-yellow-400 shadow-[0_0_10px_yellow]" /> },
    { category: 'Borders', name: 'Glitch Effect', price: 250, preview: <div className="w-12 h-12 rounded-full border-2 border-purple-500 animate-pulse" /> },
    { category: 'Backgrounds', name: 'Cyberpunk Red', price: 150, preview: <div className="w-12 h-12 rounded-lg bg-red-900/30 border border-red-500" /> },
    { category: 'Emojis', name: 'Sultan Pack', price: 80, preview: <div className="text-2xl pt-2">👑👳‍♂️💎</div> },
];

// --- COMPONENTS ---

const HeaderScanner = () => (
    <div className="absolute inset-x-0 inset-y-0 pointer-events-none overflow-hidden z-20">
        <motion.div
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-black/10 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
        />
    </div>
);

export default function MarketingFidelityPage() {
    const [lootResult, setLootResult] = useState<any>(null);
    const containerRef = useRef(null);

    return (
        <div ref={containerRef} className="min-h-screen bg-transparent text-white font-sans selection:bg-yellow-500/30 overflow-x-hidden pb-40">
            <AmbientBackground />

            {/* HERO SECTION */}
            <section className="relative pt-40 pb-20 px-6 flex flex-col items-center text-center">
                <div className="space-y-12 relative z-10 w-full max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-yellow-400/5 border border-yellow-400/10 backdrop-blur-sm shadow-2xl"
                    >
                        <Scan className="w-4 h-4 text-yellow-500 animate-pulse" />
                        <span className="text-yellow-400 font-black text-[10px] uppercase tracking-[0.5em] italic">Syndicate Protocol</span>
                    </motion.div>

                    <div className="relative group flex flex-col items-center">
                        <div className="absolute -inset-40 bg-yellow-400/5 blur-[160px] opacity-100 animate-pulse"></div>

                        <div className="relative bg-yellow-400 py-10 px-16 md:px-24 -rotate-1 hover:rotate-0 transition-all duration-700 shadow-[20px_20px_0_rgba(0,0,0,1)] border-4 border-black group overflow-hidden">
                            <h1 className="text-5xl md:text-[8rem] font-[1000] italic uppercase tracking-tighter text-black leading-none inline-block relative z-10 pr-[0.4em]">
                                LE PACTE
                            </h1>
                        </div>
                    </div>

                    <p className="max-w-xl mx-auto text-gray-400 font-bold uppercase tracking-[0.2em] leading-relaxed text-xs italic py-6 opacity-60">
                        Honneur • Territoire • Butins. <br />
                        Accédez aux rangs supérieurs et personnalisez votre légende.
                    </p>
                </div>
            </section>

            {/* SECTION 1: THE PATH (ACTS & TIERS) */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <SectionHeader
                    badge="L'Ascension Digitale"
                    title={<>Système <span className="text-yellow-500">d'Actes</span></>}
                    description="Votre progression est jalonnée de 4 actes majeurs, répartis en 10 paliers de prestige."
                    sideDescription={true}
                />

                <div className="mt-12 space-y-4">
                    {ACTS.map((act, i) => (
                        <motion.div
                            key={act.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 hover:border-yellow-500/20 transition-all"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
                                <div className="text-6xl font-[1000] italic text-yellow-500/10 group-hover:text-yellow-500 transition-colors w-20">
                                    {act.id}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-2">{act.name}</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {act.tiers.map((tier, idx) => (
                                            <span key={idx} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">
                                                {tier}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="md:text-right">
                                    <div className="text-[9px] font-black uppercase tracking-widest text-yellow-500/40 mb-1">Act Unlock</div>
                                    <div className="flex items-center gap-3 md:justify-end">
                                        <span className="text-xs font-black uppercase italic tracking-tighter">{act.reward}</span>
                                        <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                            <Gift size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* SECTION 2: QUESTS & TOKENS */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <SectionHeader
                            badge="Mission Board"
                            title={<>Quêtes & <span className="text-yellow-500">Jetons</span></>}
                            description="Chaque contrat rempli vous rapproche de l'Atelier. Amassez des Jetons Mato's pour débloquer l'exclusif."
                        />
                        <div className="space-y-4">
                            {QUESTS.map((quest, i) => (
                                <div key={i} className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/5 flex items-center justify-center text-yellow-500 border border-yellow-500/10 group-hover:bg-yellow-400 group-hover:text-black transition-all">
                                        {quest.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-black uppercase tracking-tight text-sm truncate">{quest.title}</h4>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest opacity-60 mt-1">{quest.desc}</p>
                                    </div>
                                    <div className="flex flex-col items-end shrink-0">
                                        <div className="text-yellow-500 font-black italic">+{quest.reward}</div>
                                        <div className="text-[7px] font-black uppercase tracking-widest text-gray-700">M-TOKENS</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#0c0c0c] border border-white/5 rounded-[4rem] p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 blur-[100px] -mr-32 -mt-32"></div>
                        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                            <div className="w-24 h-24 bg-yellow-400 rounded-[2.5rem] flex items-center justify-center shadow-2xl animate-float">
                                <Coins className="w-12 h-12 text-black" />
                            </div>
                            <div className="space-y-2">
                                <span className="text-yellow-500 font-black text-[10px] uppercase tracking-[0.4em] italic">Votre Solde Actuel</span>
                                <h3 className="text-6xl font-[1000] italic tracking-tighter uppercase">540</h3>
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Jetons Mato's Collectés</div>
                            </div>
                            <button className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">Aller à l'Atelier</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: THE ATELIER (PERSONALIZATION) */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <SectionHeader
                    badge="L'Atelier du Sultan"
                    title={<>Shop de <span className="text-yellow-500">Légende</span></>}
                    description="Dépensez vos jetons pour personnaliser votre identité sur le réseau Mato's."
                    align="center"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SHOP_ITEMS.map((item, i) => (
                        <div key={i} className="bg-black/40 backdrop-blur-xl border border-white/5 p-8 rounded-[3rem] hover:border-yellow-500/30 transition-all group relative animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="text-[9px] font-black uppercase text-gray-600 tracking-[0.2em] mb-6">{item.category}</div>
                            <div className="w-full h-32 bg-white/[0.02] rounded-[2rem] flex items-center justify-center mb-8 border border-white/5 group-hover:scale-105 transition-transform">
                                {item.preview}
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-black uppercase tracking-tighter text-sm italic">{item.name}</h4>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Coins size={10} className="text-yellow-500" />
                                        <span className="text-[10px] font-black text-white/40">{item.price} M-TOKENS</span>
                                    </div>
                                </div>
                                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 4: HAUTE TABLE (COMPACT) */}
            <section className="py-20 px-6 max-w-5xl mx-auto">
                <SectionHeader
                    badge="Syndicate Elite"
                    title={<>La Haute <span className="text-yellow-500">Table</span></>}
                    description="Seul le top 1% accède à l'immortalité."
                    align="center"
                />

                <div className="bg-[#080808]/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-4">
                    <div className="grid grid-cols-1 gap-1">
                        {[
                            { rank: 1, name: 'Akram H.', xp: '18,540', status: 'Sultan Immortal' },
                            { rank: 2, name: 'Leila D.', xp: '17,210', status: 'Baron Elite' },
                            { rank: 3, name: 'Sabrina K.', xp: '16,850', status: 'Baron Elite' },
                        ].map((user) => (
                            <div key={user.rank} className="p-4 rounded-xl hover:bg-white/[0.03] transition-all group flex items-center gap-6 border-b border-white/[0.02] last:border-0">
                                <span className="text-xl font-[1000] italic text-white/5 group-hover:text-yellow-500/30 w-8">{user.rank}</span>
                                <div className="flex-1">
                                    <h4 className="text-sm font-black uppercase tracking-tight italic">{user.name}</h4>
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-600 italic">{user.status}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-[1000] italic text-yellow-500">{user.xp}</div>
                                    <div className="text-[7px] font-black uppercase tracking-widest opacity-20">Points d'Honneur</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER CTA: SLANTED & REFINED */}
            <section className="relative mt-20">
                <div
                    className="absolute inset-0 z-0 bg-yellow-400"
                    style={{ clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0 100%)' }}
                >
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(black 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                </div>

                <div className="relative z-10 pt-48 pb-24 flex flex-col items-center text-center text-black">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="space-y-12">
                        <h2 className="text-5xl md:text-[7rem] font-[1000] uppercase italic tracking-tighter leading-[0.7]">
                            REJOIGNEZ LE <br />
                            <span className="relative">SYNDICAT</span>
                        </h2>

                        <div className="pt-6">
                            <button className="relative group overflow-hidden px-12 py-5 bg-black text-white font-[1000] uppercase italic tracking-widest rounded-full text-xs hover:scale-105 transition-all shadow-2xl">
                                <span className="relative z-10">Valider le Pacte</span>
                                <div className="absolute inset-0 flex items-center justify-center bg-white text-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 font-black uppercase text-xs">Accès Immédiat</div>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <style jsx global>{`
                .shadow-glow { filter: drop-shadow(0 0 10px rgba(250, 204, 21, 0.4)); }
                .text-shadow-glow { text-shadow: 0 0 30px rgba(0, 0, 0, 0.1); }
            `}</style>
        </div>
    );
}
