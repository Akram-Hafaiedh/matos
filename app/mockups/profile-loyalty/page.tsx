'use client';

import { motion } from 'framer-motion';
import {
    ChevronRight, Star, Trophy, Flame, Gift,
    Coins, Crown, Shield, Target, ArrowRight,
    CircleDot, Zap, Lock, Sparkles, User,
    Layout, Palette, Fingerprint
} from 'lucide-react';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';

export default function ProfileLoyaltyMockup() {
    return (
        <div className="min-h-screen bg-[#050505] text-white py-20 px-6 space-y-20 overflow-x-hidden">

            {/* CONTEXT HEADER */}
            <div className="max-w-4xl mx-auto text-center border-b border-white/5 pb-20">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 font-black uppercase italic text-[10px] tracking-widest mb-8">
                    <Fingerprint className="w-4 h-4" />
                    Archive du Syndicat
                </div>
                <h1 className="text-6xl md:text-8xl font-[1000] italic uppercase tracking-tighter leading-[0.8] mb-8">
                    VOTRE <span className="text-yellow-400">PACT</span>
                </h1>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.4em] italic mb-12">
                    Visualisation du Dashboard Privilège
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <div className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        540 M-Tokens
                    </div>
                    <div className="px-8 py-3 bg-yellow-400 text-black border border-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                        <Trophy className="w-4 h-4" />
                        Rang: Baron
                    </div>
                </div>
            </div>

            {/* DASHBOARD LAYOUT */}
            <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: STATUS & ACT PROGRESS */}
                <div className="lg:col-span-2 space-y-8">
                    {/* CURRENT ACT CARD */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[3.5rem] p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 blur-[120px] rounded-full -mr-32 -mt-32"></div>

                        <div className="relative z-10 space-y-12">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-yellow-500 font-black text-xs uppercase tracking-widest mb-2 italic">Acte II en cours</div>
                                    <h2 className="text-5xl font-[1000] italic uppercase tracking-tighter">L'ASCENSION</h2>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Récompense d'Acte</div>
                                    <div className="text-sm font-black italic text-yellow-500 uppercase mt-1">Chest Silver</div>
                                </div>
                            </div>

                            {/* PRECISE PROGRESS BAR */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Expérience Totale</div>
                                        <div className="text-3xl font-[1000] italic">2,450 XP</div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Objectif: Acte III</div>
                                        <div className="text-xl font-black italic text-gray-500">550 pts restants</div>
                                    </div>
                                </div>
                                <div className="relative h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '75%' }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.5)] relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* SUB-TIERS GRID */}
                            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
                                {[
                                    { name: 'Caporal', status: 'Unlocked', current: false },
                                    { name: 'Sergent', status: 'Active', current: true },
                                    { name: 'Lieutenant', status: 'Locked', current: false },
                                ].map((tier, i) => (
                                    <div key={i} className={`p-6 rounded-[2rem] border transition-all ${tier.current ? 'bg-yellow-400/10 border-yellow-400 shadow-2xl scale-105' : tier.status === 'Unlocked' ? 'bg-white/5 border-white/10 grayscale' : 'bg-white/[0.02] border-white/5 opacity-40'}`}>
                                        <div className="flex flex-col items-center gap-4">
                                            {tier.status === 'Locked' ? <Lock className="w-5 h-5 text-gray-600" /> : tier.current ? <Star className="w-5 h-5 text-yellow-500" /> : <Shield className="w-5 h-5 text-gray-400" />}
                                            <div className="text-center">
                                                <div className={`text-[9px] font-black uppercase tracking-widest ${tier.current ? 'text-yellow-500' : 'text-gray-500'}`}>{tier.status}</div>
                                                <div className="text-xs font-black uppercase italic tracking-tighter mt-1">{tier.name}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RECENT ACTIVITY / QUESTS LOG */}
                    <div className="bg-[#0a0a0a]/50 border border-white/5 rounded-[3.5rem] p-10">
                        <h3 className="text-xs font-[1000] uppercase tracking-[0.4em] italic text-gray-500 mb-8 px-2 flex items-center gap-3">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            Contrats Récents
                        </h3>
                        <div className="space-y-2">
                            {[
                                { title: 'Signature Drop', date: 'Hier', reward: '+50 M-Tokens', status: 'Completed' },
                                { title: 'Le festin du Baron', date: 'Lundi', reward: '+150 XP', status: 'Completed' },
                                { title: 'Soutien Logistique', date: '01 Fév', reward: '+20 M-Tokens', status: 'Completed' },
                            ].map((item, i) => (
                                <div key={i} className="group p-6 rounded-2xl hover:bg-white/[0.03] transition-all flex items-center justify-between border-b border-white/[0.02] last:border-0">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-400 group-hover:text-black transition-all">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black uppercase italic tracking-tight">{item.title}</h4>
                                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{item.date}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-black italic text-yellow-500">{item.reward}</div>
                                        <div className="text-[7px] font-black uppercase tracking-widest text-green-500 mt-1">{item.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: PERKS & DASHBOARD ACTIONS */}
                <div className="space-y-8">
                    {/* TOKEN HUB MINI CARD */}
                    <div className="bg-yellow-400 p-10 rounded-[3.5rem] text-black relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_120%_0%,rgba(0,0,0,0.1),transparent)]"></div>
                        <div className="relative z-10 space-y-8">
                            <Coins className="w-10 h-10 -rotate-12" />
                            <div>
                                <div className="text-[9px] font-black uppercase tracking-widest opacity-60">Solde de Jetons</div>
                                <h3 className="text-5xl font-[1000] italic tracking-tighter">540</h3>
                            </div>
                            <Link href="/fidelity" className="block text-center bg-black text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
                                Aller au Shop
                            </Link>
                        </div>
                    </div>

                    {/* SIDEBAR WIDGETS */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 space-y-10">
                        <div className="space-y-6">
                            <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-500 italic">Avantages de Rang</h4>
                            <div className="space-y-4">
                                {[
                                    { icon: <Gift className="w-4 h-4" />, text: "Drop Hebdomadaire" },
                                    { icon: <Shield className="w-4 h-4" />, text: "Support Prioritaire" },
                                    { icon: <Target className="w-4 h-4" />, text: "Multiplicateur XP x1.2" },
                                ].map((perk, i) => (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">{perk.icon}</div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{perk.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5 space-y-6">
                            <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-500 italic">Personnalisation</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center gap-3 hover:border-yellow-400 transition-all text-gray-500 hover:text-white group">
                                    <Palette className="w-4 h-4 group-hover:text-yellow-400" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Atelier</span>
                                </button>
                                <button className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center gap-3 hover:border-yellow-400 transition-all text-gray-500 hover:text-white group">
                                    <User className="w-4 h-4 group-hover:text-yellow-400" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Identité</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Pattern propagation: The Slanted Footer CTA will be here too */}
            <div className="h-40" />
        </div>
    );
}
