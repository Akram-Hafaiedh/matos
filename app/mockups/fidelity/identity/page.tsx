'use client';

import { motion } from 'framer-motion';
import { User, Shield, Target, Trophy, Info, Sparkles, Fingerprint, Lock, CheckCircle2, QrCode } from 'lucide-react';
import Link from 'next/link';

export default function IdentityMockup() {
    return (
        <div className="min-h-screen bg-black text-white p-12 space-y-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-1 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.4)]"></div>
                        <span className="text-[10px] font-[1000] uppercase tracking-[0.4em] text-gray-500 italic">Deep Profile Matrix</span>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-none">
                        MY <span className="text-yellow-400">IDENTITY</span>
                    </h2>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Left: Tactical Card */}
                <div className="space-y-8">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[4rem] p-12 space-y-10 relative overflow-hidden group shadow-3xl">
                        <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
                        <div className="flex flex-col items-center text-center space-y-8">
                            <div className="w-40 h-40 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-7xl shadow-2xl relative">
                                👑
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black border-4 border-black">
                                    <Shield size={16} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl font-[1000] italic uppercase tracking-tighter">SULTAN ELITE</h3>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mt-1 italic">Agent #742-ALPHA</p>
                            </div>
                            <div className="w-full pt-8 border-t border-white/5 grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-xl font-[1000] italic text-yellow-400">ACT II</div>
                                    <div className="text-[8px] font-black uppercase text-gray-700">Progression</div>
                                </div>
                                <div>
                                    <div className="text-xl font-[1000] italic text-white">#142</div>
                                    <div className="text-[8px] font-black uppercase text-gray-700">Rang Global</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-[3rem] p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <QrCode className="w-24 h-24 text-white/20 group-hover:text-yellow-400 transition-colors" />
                        <div className="text-[9px] font-black uppercase text-gray-500 tracking-widest italic">Pass de Fidélité Physique</div>
                    </div>
                </div>

                {/* Center: Detailed Lore / Stats */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="bg-[#0a0a0a]/50 border border-white/5 rounded-[4rem] p-12 space-y-12">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-1 bg-yellow-400 rounded-full"></div>
                                <h4 className="text-2xl font-[1000] text-white italic uppercase tracking-tighter">Archives du Dossier</h4>
                            </div>
                            <button className="text-[10px] font-black uppercase text-yellow-500 italic hover:underline">Modifier Bio</button>
                        </div>

                        <div className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <div className="text-[10px] font-black uppercase text-gray-700 tracking-[0.3em] italic">Spécialisation</div>
                                    <div className="text-xl font-[1000] italic uppercase tracking-tight text-white">Maître des Signatures</div>
                                    <p className="text-[11px] text-gray-500 font-bold uppercase italic leading-relaxed">Expert en dégustation de pizzas artisanales à fermentation longue.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-[10px] font-black uppercase text-gray-700 tracking-[0.3em] italic">Lieu d'Opération</div>
                                    <div className="text-xl font-[1000] italic uppercase tracking-tight text-white">Sidi Bou Saïd, Tunis</div>
                                    <p className="text-[11px] text-gray-500 font-bold uppercase italic leading-relaxed">Secteur primaire de livraison et de ravitaillement tactique.</p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5 space-y-8">
                                <div className="text-[10px] font-black uppercase text-gray-700 tracking-[0.3em] italic">Hauts Faits Recents</div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    {[
                                        { icon: <Target className="text-cyan-400" />, text: "10 Commandes Act I" },
                                        { icon: <Trophy className="text-yellow-400" />, text: "Critique Elite" },
                                        { icon: <Sparkles className="text-purple-400" />, text: "Don de Parrainage" },
                                    ].map((feat, i) => (
                                        <div key={i} className="flex flex-col items-center gap-4 p-6 bg-black/40 border border-white/5 rounded-3xl group hover:border-white/20 transition-all">
                                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">{feat.icon}</div>
                                            <span className="text-[9px] font-black uppercase text-white/60 tracking-widest text-center">{feat.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-start gap-6">
                        <Link href="/account/profile" className="px-10 py-5 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-yellow-400 transition-all">
                            Paramètres Identité
                        </Link>
                        <Link href="/mockups/fidelity/atelier" className="px-10 py-5 bg-white/5 border border-white/10 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all italic">
                            Ouvrir l'Atelier
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
