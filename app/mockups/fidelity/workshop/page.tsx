'use client';

import { motion } from 'framer-motion';
import { Palette, Shield, Sparkles, Lock, CheckCircle2, User, Trophy, Crown, Gem, Zap, Fingerprint, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { TIERS } from '@/lib/loyalty';

const BACKGROUNDS = [
    { name: 'Classique Mato\'s', value: 'bg-yellow-400', tier: 0 },
    { name: 'Acte I: Initiation', value: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white', tier: 0 },
    { name: 'Acte II: Ascension', value: 'bg-gradient-to-br from-gray-300 to-gray-500 text-white', tier: 1 },
    { name: 'Acte III: Domination', value: 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black', tier: 2 },
    { name: 'Acte IV: Légende', value: 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white', tier: 3 },
    { name: 'Obsidienne Elite', value: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white border border-gray-700', tier: 3 },
];

const TITLES = [
    { name: 'Initié du Pacte', tier: 0 },
    { name: 'Ombre du Syndicat', tier: 1 },
    { name: 'Opérateur Elite', tier: 2 },
    { name: 'Légende Vivante', tier: 3 },
];

export default function AtelierPage() {
    const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[0].value);
    const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
    const [selectedEmoji, setSelectedEmoji] = useState('🛡️');
    const [selectedTitle, setSelectedTitle] = useState('Initié du Pacte');

    // Données simulées
    const userPoints = 1500; // Acte II
    const currentTierIndex = 1;

    return (
        <div className="min-h-screen bg-[#050505] text-white p-12 space-y-20 relative overflow-hidden">
            {/* Décoration Ambient */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-400/[0.03] blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none"></div>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-10 relative z-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-1 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.4)]"></div>
                        <span className="text-[10px] font-[1000] uppercase tracking-[0.4em] text-gray-500 italic">Protocole d'Identité v4.0</span>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-none">
                        L'<span className="text-yellow-400 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">ATELIER</span>
                    </h2>
                </div>

                <Link href="/account/loyalty" className="group flex items-center gap-4 px-10 py-5 bg-white/5 border border-white/10 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all italic shadow-2xl">
                    <Fingerprint className="w-4 h-4 text-yellow-500" />
                    Retour au Pacte
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-16 relative z-10">
                {/* Left: Live Preview Card */}
                <div className="space-y-8">
                    <div className="sticky top-12 space-y-8">
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-[4rem] p-12 space-y-12 relative overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.5)] border-t-yellow-400/30">
                            {/* Card Decoration */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>

                            <div className="flex flex-col items-center text-center space-y-10">
                                <div className={`w-48 h-48 rounded-[3rem] ${selectedBg} border-[12px] transition-all duration-700 shadow-2xl relative flex items-center justify-center text-8xl ${selectedFrame || 'border-white/5'}`}>
                                    {selectedEmoji}
                                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-black border border-white/10 rounded-full flex items-center justify-center text-yellow-400 shadow-2xl ring-4 ring-black">
                                        <Star size={20} fill="currentColor" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.4em] italic drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">{selectedTitle}</div>
                                    <h3 className="text-4xl font-[1000] italic uppercase tracking-tighter text-white">SULTAN ELITE</h3>
                                    <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.5em] mt-1 italic">Agent de l'Acte II</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-8 bg-yellow-400 text-black rounded-[2.5rem] font-[1000] uppercase italic tracking-widest text-sm hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(250,204,21,0.3)] active:scale-95 transition-all shadow-2xl">
                            Graver l'Identité Visual
                        </button>
                    </div>
                </div>

                {/* Right: Customization Panels */}
                <div className="lg:col-span-2 space-y-20">
                    {/* Emojis / Icons */}
                    <div className="space-y-10 bg-white/[0.02] border border-white/5 p-12 rounded-[3.5rem] backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-1 bg-yellow-400 rounded-full"></div>
                            <h4 className="text-2xl font-[1000] italic uppercase tracking-tighter">Iconographie Tactique</h4>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                            {TIERS.concat(TIERS).map((tier, i) => {
                                const realIndex = i % TIERS.length;
                                const isLocked = realIndex > currentTierIndex;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => !isLocked && setSelectedEmoji(tier.emoji)}
                                        className={`w-full aspect-square rounded-3xl flex items-center justify-center text-3xl border transition-all relative group/item ${isLocked ? 'bg-black/40 border-white/5 opacity-20 cursor-not-allowed' : selectedEmoji === tier.emoji ? 'bg-yellow-400/10 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.1)]' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                                    >
                                        <span className={`transition-transform duration-500 ${selectedEmoji === tier.emoji ? 'scale-125' : 'group-hover/item:scale-110'}`}>{tier.emoji}</span>
                                        {isLocked && <Lock className="absolute w-3 h-3 text-white/40 bottom-2 right-2" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Backgrounds */}
                    <div className="space-y-10 bg-white/[0.02] border border-white/5 p-12 rounded-[3.5rem] backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-1 bg-yellow-400 rounded-full"></div>
                            <h4 className="text-2xl font-[1000] italic uppercase tracking-tighter">Aura d'Identité</h4>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                            {BACKGROUNDS.map((bg, i) => {
                                const isLocked = bg.tier > currentTierIndex;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => !isLocked && setSelectedBg(bg.value)}
                                        className={`h-28 rounded-[2.5rem] relative overflow-hidden border-2 transition-all group/bg ${isLocked ? 'opacity-20 cursor-not-allowed border-white/5' : selectedBg === bg.value ? 'border-yellow-400 scale-105 shadow-2xl' : 'border-white/10 hover:border-white/30'}`}
                                    >
                                        <div className={`absolute inset-0 ${bg.value} transition-transform duration-700 group-hover/bg:scale-110`}></div>
                                        {isLocked && <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]"><Lock className="w-5 h-5 text-white/50" /></div>}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/bg:opacity-100 transition-opacity"></div>
                                        <div className="absolute bottom-3 w-full text-center text-[9px] font-black uppercase tracking-[0.2em] text-white drop-shadow-lg">{bg.name}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Frames */}
                    <div className="space-y-10 bg-white/[0.02] border border-white/5 p-12 rounded-[3.5rem] backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                            <h4 className="text-2xl font-[1000] italic uppercase tracking-tighter">Ornementation d'Élite</h4>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                            {TIERS.map((tier, i) => {
                                const isLocked = i > currentTierIndex;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => !isLocked && setSelectedFrame(tier.borderColor)}
                                        className={`p-8 rounded-[3rem] border-2 transition-all flex flex-col items-center gap-6 group/frame ${isLocked ? 'opacity-20 cursor-not-allowed border-white/5' : selectedFrame === tier.borderColor ? 'bg-yellow-400/10 border-yellow-400 shadow-2xl scale-105' : 'bg-black/40 border-white/10 hover:border-white/30'}`}
                                    >
                                        <div className={`w-16 h-16 rounded-2xl border-4 ${tier.borderColor} bg-gradient-to-br ${tier.color} opacity-40 group-hover/frame:scale-110 transition-transform duration-500`}></div>
                                        <div className="text-[10px] font-[1000] uppercase tracking-widest text-gray-500 group-hover/frame:text-white transition-colors">{tier.name}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Honorific Titles */}
                    <div className="space-y-10 bg-white/[0.02] border border-white/5 p-12 rounded-[3.5rem] backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-1 bg-yellow-400 rounded-full"></div>
                            <h4 className="text-2xl font-[1000] italic uppercase tracking-tighter">Titres Honorifiques</h4>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6">
                            {TITLES.map((title, i) => {
                                const isLocked = title.tier > currentTierIndex;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => !isLocked && setSelectedTitle(title.name)}
                                        className={`px-10 py-7 rounded-[2rem] border-2 transition-all flex items-center justify-between group/title ${isLocked ? 'opacity-20 cursor-not-allowed border-white/5' : selectedTitle === title.name ? 'bg-white text-black border-white shadow-2xl scale-[1.02]' : 'bg-black/40 border-white/10 hover:border-white/30'}`}
                                    >
                                        <span className="text-lg font-[1000] italic uppercase tracking-tight">{title.name}</span>
                                        {isLocked ? <Lock size={16} /> : selectedTitle === title.name ? <CheckCircle2 size={20} /> : <Zap size={14} className="opacity-20 group-hover/title:opacity-100 transition-opacity text-yellow-500" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
