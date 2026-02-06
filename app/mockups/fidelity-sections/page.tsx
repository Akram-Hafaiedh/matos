'use client';

import { motion } from 'framer-motion';
import {
    ChevronRight, Star, Trophy, Flame, Gift,
    Coins, Crown, Shield, Target, ArrowRight,
    CircleDot, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import SectionHeader from '@/components/SectionHeader';

export default function FidelitySectionsMockup() {
    return (
        <div className="min-h-screen bg-[#050505] text-white py-20 px-6 space-y-40 overflow-x-hidden">

            {/* SUB-TASKS / CONTEXT */}
            <div className="max-w-4xl mx-auto p-8 bg-yellow-400/5 border border-yellow-400/10 rounded-3xl text-center">
                <h1 className="text-yellow-400 font-black uppercase italic tracking-widest text-sm mb-2">Fidelity Visual Sync</h1>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                    Ce mockup présente la refonte des sections de fidélité pour la Home et Promos, <br />
                    ainsi que l'intégration du pattern "Slanted Yellow CTA".
                </p>
            </div>

            {/* --- HOME PAGE SECTION: BOLD SYNDICATE PREVIEW --- */}
            <section className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="relative group">
                        {/* THE PILL TITLE (MATCHING NEW PUBLIC STYLE) */}
                        <div className="relative bg-yellow-400 py-10 px-16 -rotate-2 group-hover:rotate-0 transition-all duration-700 shadow-[20px_20px_0_rgba(0,0,0,1)] border-4 border-black group overflow-hidden inline-block mb-12">
                            <h2 className="text-5xl md:text-7xl font-[1000] italic uppercase tracking-tighter text-black leading-none inline-block relative z-10 pr-[0.4em]">
                                LE PACTE
                            </h2>
                        </div>

                        <SectionHeader
                            badge="Programme de Fidélité"
                            title={<>Rejoignez le <span className="text-yellow-500">Syndicat</span></>}
                            description="Transformez chaque bouchée en Points d'Honneur. Gravissez les 4 Actes et débloquez l'exclusif."
                        />

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            {[
                                { label: 'Points', val: '1 DT = 1 pt', icon: <Target className="w-4 h-4" /> },
                                { label: 'Statuts', val: '10 Rangs', icon: <Trophy className="w-4 h-4" /> },
                                { label: 'Shop', val: 'Token Hunt', icon: <Coins className="w-4 h-4" /> },
                                { label: 'Elite', val: 'Hall of Fame', icon: <Crown className="w-4 h-4" /> },
                            ].map((item, i) => (
                                <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-yellow-400/20 transition-all">
                                    <div className="text-yellow-500 mb-3">{item.icon}</div>
                                    <div className="text-[10px] font-black uppercase text-gray-500 mb-1">{item.label}</div>
                                    <div className="text-xs font-black uppercase tracking-tight">{item.val}</div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-12">
                            <Link href="/fidelity" className="group inline-flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-2xl">
                                Découvrir le Programme
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-400/10 blur-[120px] rounded-full scale-125"></div>
                        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[4rem] p-12 overflow-hidden group shadow-3xl">
                            {/* Mini Rank Tracker Preview */}
                            <div className="space-y-8 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-yellow-400 to-orange-500 p-1">
                                    <div className="w-full h-full bg-black rounded-[2.3rem] flex items-center justify-center text-5xl">👑</div>
                                </div>
                                <div>
                                    <div className="text-yellow-500 font-black text-xs uppercase tracking-widest mb-2 italic">Votre Ascension</div>
                                    <h3 className="text-4xl font-[1000] italic uppercase tracking-tighter">Baron Elite</h3>
                                </div>
                                <div className="w-full space-y-3">
                                    <div className="flex justify-between text-[10px] font-black uppercase italic tracking-widest text-gray-500">
                                        <span>Acte II: Ascension</span>
                                        <span>75%</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                        <div className="h-full bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)] w-3/4"></div>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 pt-2">
                                        <CircleDot className="w-4 h-4 text-yellow-500 animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Objectif: Chest Silver</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PROMOS PAGE SECTION: BOLD TRANSITION --- */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12 items-center">
                    <div className="lg:col-span-2">
                        <h2 className="text-6xl md:text-8xl font-[1000] italic uppercase tracking-tighter leading-[0.8] mb-8">
                            PLUS DE <span className="text-yellow-400">POINTS</span>. <br />
                            PLUS DE <span className="text-yellow-400">DROPS</span>.
                        </h2>
                        <p className="text-gray-500 font-bold text-sm uppercase tracking-widest leading-relaxed max-w-xl">
                            Les membres du Syndicat débloquent des réductions cachées sur chaque commande. Votre fidélité est votre monnaie.
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl relative group hover:border-yellow-400/30 transition-all">
                        <div className="absolute top-0 right-0 p-8">
                            <Sparkles className="w-10 h-10 text-yellow-500/20 group-hover:text-yellow-500 transition-colors" />
                        </div>
                        <div className="space-y-6">
                            <div className="text-4xl font-[1000] italic text-yellow-400">+10pts</div>
                            <div className="text-xs font-black uppercase text-gray-400 tracking-widest">Offerts à l'adhésion</div>
                            <Link href="/register" className="block text-center bg-yellow-400 text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all">S'inscrire</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- THE SLANTED YELLOW CTA Pattern --- */}
            <section className="relative mt-20">
                <div
                    className="absolute inset-0 z-0 bg-yellow-400"
                    style={{ clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0 100%)' }}
                >
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(black 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                </div>

                <div className="relative z-10 pt-48 pb-24 flex flex-col items-center text-center text-black">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="space-y-12 max-w-4xl px-6">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-black/10 bg-black/5 font-black uppercase italic text-[10px] tracking-widest">
                            <Shield className="w-4 h-4" />
                            Accès Alpha
                        </div>

                        <h2 className="text-5xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-[0.8]">
                            PASSEZ À <br />
                            <span className="relative">L'ÉLITE</span>
                        </h2>

                        <p className="max-w-lg mx-auto font-black uppercase text-[10px] tracking-widest italic opacity-60 leading-relaxed">
                            Ce footer slanted sera appliqué sur Menu, Promos et Contact pour une signature visuelle unifiée et impactante.
                        </p>

                        <div className="pt-6">
                            <button className="relative group overflow-hidden px-12 py-5 bg-black text-white font-[1000] uppercase italic tracking-widest rounded-full text-xs hover:scale-105 transition-all shadow-2xl">
                                <span className="relative z-10">Signer le Contrat</span>
                                <div className="absolute inset-0 flex items-center justify-center bg-white text-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 font-black uppercase text-xs">Rejoindre</div>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}
