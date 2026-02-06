'use client';

import { ArrowRight, Target, Trophy, Coins, Crown, Scan, Shield } from "lucide-react";
import Link from "next/link";
import SectionHeader from '@/components/SectionHeader';
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function Fidelity() {
    return (
        <section className="py-24 relative overflow-hidden bg-transparent">
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-yellow-400/5 blur-[160px] pointer-events-none transition-all duration-1000"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    {/* Left Content */}
                    <div className="space-y-12">
                        <div className="space-y-10">
                            <SectionHeader
                                badge="Programme de Fidélité"
                                title={<>Rejoignez le <span className="text-yellow-400">Syndicat</span></>}
                                description="Transformez chaque bouchée en Points d'Honneur. Gravissez les 4 Actes et débloquez l'exclusif."
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { label: 'Points', val: '1 DT = 1 pt', icon: <Target className="w-4 h-4" /> },
                                { label: 'Statuts', val: '10 Rangs', icon: <Trophy className="w-4 h-4" /> },
                                { label: 'Shop', val: 'Token Hunt', icon: <Coins className="w-4 h-4" /> },
                                { label: 'Elite', val: 'Hall of Fame', icon: <Crown className="w-4 h-4" /> },
                            ].map((item, i) => (
                                <div key={i} className="p-6 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-yellow-400/20 transition-all group">
                                    <div className="text-yellow-500 mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                                    <div className="text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">{item.label}</div>
                                    <div className="text-xs font-black uppercase tracking-tight text-white">{item.val}</div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6">
                            <Link
                                href="/fidelity"
                                className="group inline-flex items-center gap-6 bg-white text-black px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-yellow-400 transition-all shadow-2xl active:scale-95"
                            >
                                Découvrir le Programme
                                <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Right Visual - Rank Tracker Preview */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-yellow-400/10 blur-[120px] rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[4rem] p-12 w-[340px] md:w-[420px] shadow-3xl overflow-hidden group">
                                <div className="space-y-10 flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-yellow-400 to-orange-500 p-1 relative shadow-2xl">
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
                                        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                            <div className="h-full bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)] w-3/4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Flairs */}
                            <div className="absolute -bottom-8 -left-8 bg-yellow-400 w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-2xl z-20 rotate-12 group-hover:rotate-0 transition-transform duration-700 border-4 border-black">
                                <Scan className="w-8 h-8 text-black" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- THE SLANTED YELLOW CTA Pattern --- */}
            <div className="mt-32 relative group">
                <div
                    className="absolute inset-0 z-0 bg-yellow-400 transition-transform duration-700 group-hover:scale-105"
                    style={{ clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0 100%)' }}
                >
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(black 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                </div>

                <div className="relative z-10 pt-48 pb-24 flex flex-col items-center text-center text-black">
                    <div className="space-y-12 max-w-4xl px-6">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-black/10 bg-black/5 font-black uppercase italic text-[10px] tracking-widest">
                            <Shield className="w-4 h-4" />
                            Accès Alpha
                        </div>

                        <h2 className="text-5xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-[0.8]">
                            PASSEZ À <br />
                            <span className="relative">L'ÉLITE</span>
                        </h2>

                        <div className="pt-6">
                            <Link href="/register" className="relative group/btn overflow-hidden px-12 py-5 bg-black text-white font-[1000] uppercase italic tracking-widest rounded-full text-xs hover:scale-105 transition-all shadow-2xl inline-block">
                                <span className="relative z-10">Signer le Contrat</span>
                                <div className="absolute inset-0 flex items-center justify-center bg-white text-black translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 z-20 font-black uppercase text-xs">Rejoindre</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
