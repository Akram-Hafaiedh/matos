'use client';

import { useEffect, useState } from 'react';
import {
    Star, ShieldCheck, History, Gift, Loader2, Sparkles, Target, Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ACTS, TIERS, QUESTS, getUserTier, getNextTier, getDetailedProgress, getBoosterDescription } from '@/lib/loyalty';
import TacticalAura from '@/components/TacticalAura';
import { Coins, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PactePage() {
    const [userData, setUserData] = useState<any>(null);
    const [quests, setQuests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState<Record<string, string>>({});

    // Hooks for booster countdown
    const activeBoosters = userData?.inventory?.filter((item: any) => {
        if (item.type !== 'Boosters') return false;
        if (!item.expiresAt) return true;
        return new Date(item.expiresAt) > new Date();
    }) || [];

    useEffect(() => {
        if (!activeBoosters.length) return;

        const timer = setInterval(() => {
            const newTimeLeft: Record<string, string> = {};
            activeBoosters.forEach((boost: any) => {
                let expiryDate = boost.expiresAt ? new Date(boost.expiresAt) : null;

                // Fallback for boosters without expiresAt (detect from name)
                if (!expiryDate) {
                    const match = boost.name.match(/\((\d+)h\)/i);
                    if (match) {
                        const hours = parseInt(match[1]);
                        const start = new Date(boost.unlockedAt || userData.createdAt);
                        expiryDate = new Date(start.getTime() + hours * 60 * 60 * 1000);
                    }
                }

                if (!expiryDate) return;

                const expiry = expiryDate.getTime();
                const now = new Date().getTime();
                const diff = expiry - now;

                if (diff <= 0) {
                    newTimeLeft[boost.id] = 'Expiré';
                } else {
                    const h = Math.floor(diff / (1000 * 60 * 60));
                    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const s = Math.floor((diff % (1000 * 60)) / 1000);

                    if (h > 0) {
                        newTimeLeft[boost.id] = `${h}h ${m}m`;
                    } else if (m > 0) {
                        newTimeLeft[boost.id] = `${m}m ${s}s`;
                    } else {
                        newTimeLeft[boost.id] = `${s}s`;
                    }
                }
            });
            setTimeLeft(newTimeLeft);
        }, 1000);

        return () => clearInterval(timer);
    }, [activeBoosters, userData]);

    useEffect(() => {
        Promise.all([
            fetch('/api/user/profile').then(res => res.json()),
            fetch('/api/quests').then(res => res.json())
        ]).then(([userData, questData]) => {
            if (userData.success) setUserData(userData.user);
            if (questData.success) {
                setQuests(questData.quests || []);
            }
            setLoading(false);
        }).catch(err => {
            console.error("Failed to fetch loyalty data", err);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
                <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
                <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] italic">DÉCRYPTAGE DU PACTE...</p>
            </div>
        );
    }

    const points = userData?.loyaltyPoints || 0;
    const currentTier = getUserTier(points);
    const { act, rank, progress, pointsToNext, goalName } = getDetailedProgress(points);
    const nextAct = getNextTier(points);

    const hasBoosts = activeBoosters.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full grid lg:grid-cols-12 gap-12 relative z-10"
        >
            <TacticalAura color={userData?.selectedBg} opacity={0.3} />
            <div className="lg:col-span-8 space-y-12">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-[4rem] p-12 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] rounded-full -mr-64 -mt-64 opacity-60"></div>
                    <div className="relative z-10 space-y-12">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] italic">Statut du Pacte • {rank?.name || 'Inconnu'}</span>
                                </div>
                                {userData?.selectedTitle && (
                                    <div className="text-[12px] text-yellow-500 font-black uppercase tracking-[0.6em] italic mb-1 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                                        {userData.selectedTitle}
                                    </div>
                                )}
                                <h2 className="text-6xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-2">
                                    {act.title}
                                </h2>
                                <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1">{act.subtitle} PROJETÉ</p>
                            </div>
                            <div className="text-right">
                                <div className="text-5xl font-[1000] text-yellow-500 italic tracking-tighter leading-none">{points.toLocaleString()}</div>
                                <div className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em] italic mt-2">Points d'Honneur (XP)</div>
                            </div>
                        </div>

                        {/* XP Progress Matrix */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end mb-2">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest italic">{goalName}</span>
                                    <div className="text-[9px] font-bold text-gray-700 uppercase tracking-widest italic">Signal de Progression: {Math.round(progress)}%</div>
                                </div>
                                <div className="text-right space-y-1">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Objectif: {nextAct ? nextAct.min : 'MAX'} XP</span>
                                    <div className="text-[9px] font-bold text-yellow-500/50 uppercase tracking-widest italic">-{pointsToNext} XP requis</div>
                                </div>
                            </div>
                            <div className="h-4 bg-white/[0.02] border border-white/5 rounded-full overflow-hidden p-1 relative shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                    className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-500 rounded-full relative"
                                >
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></div>
                                </motion.div>
                            </div>
                            <div className="flex justify-end">
                                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest italic flex items-center gap-2">
                                    <Target size={12} className="text-gray-600" /> Gain d'XP via Quêtes & Commandes
                                </p>
                            </div>
                        </div>

                        {/* Active Boosts Indicator */}
                        {hasBoosts && (
                            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/5">
                                {activeBoosters.map((boost: any) => (
                                    <div key={boost.id} className="group/booster relative flex items-center gap-3 px-5 py-2.5 bg-yellow-400/10 border border-yellow-400/30 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-[0_0_20px_rgba(250,204,21,0.1)] cursor-help hover:bg-yellow-400/20 transition-colors">
                                        <div className="relative">
                                            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                                            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-[4px] animate-pulse opacity-50"></div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-[1000] uppercase tracking-wider text-yellow-400 italic leading-none">
                                                {boost.name}
                                            </span>
                                            {timeLeft[boost.id] && (
                                                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-yellow-500/70 italic mt-1">
                                                    TEMPS RESTANT: {timeLeft[boost.id]}
                                                </span>
                                            )}
                                        </div>

                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 px-3 py-2 bg-black/95 border border-yellow-400/20 rounded-xl backdrop-blur-md z-50 opacity-0 group-hover/booster:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl">
                                            <div className="text-[9px] font-medium text-gray-300 italic text-center leading-relaxed">
                                                {boost.description || (typeof getBoosterDescription === 'function' ? getBoosterDescription(boost.name) : 'Booster actif')}
                                            </div>
                                            {/* Arrow */}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/95"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/5">
                            {(() => {
                                const startIndex = points >= 100 ? 1 : 0;
                                const displayedActs = ACTS.slice(startIndex, startIndex + 4);

                                return displayedActs.map((actItem) => {
                                    const isCurrent = act.id === actItem.id;
                                    const isUnlocked = points >= actItem.min;

                                    return (
                                        <div key={actItem.id} className={`p-6 rounded-[2.5rem] border transition-all duration-500 ${isCurrent ? 'bg-yellow-400/5 border-yellow-400 shadow-2xl scale-105' : isUnlocked ? 'bg-white/5 border-white/10 opacity-60' : 'bg-black/40 border-white/5 opacity-30 shadow-none'}`}>
                                            <div className="flex flex-col items-center gap-3">
                                                {!isUnlocked ? <Lock className="w-5 h-5 text-gray-700" /> : isCurrent ? <Star className="w-5 h-5 text-yellow-500 animate-pulse" /> : <ShieldCheck className="w-5 h-5 text-white/40" />}
                                                <div className="text-center">
                                                    <div className={`text-[8px] font-black uppercase tracking-widest ${isCurrent ? 'text-yellow-500' : 'text-gray-500'}`}>{isUnlocked ? 'Actif' : 'Verrouillé'}</div>
                                                    <div className="text-[10px] font-black uppercase italic tracking-tighter mt-1 text-white">{actItem.subtitle}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[4rem] p-10 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic flex items-center gap-3">
                            <Gift size={14} className="text-yellow-500" /> Avantages Actuelles
                        </h4>
                        <div className="space-y-4">
                            {currentTier.benefit.split('+').map((p: string, i: number) => (
                                <div key={i} className="flex items-center gap-4 text-white/60 text-[11px] font-bold uppercase tracking-widest italic">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                                    {p.trim()}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-yellow-400 p-10 rounded-[4rem] text-black space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 italic">Statistiques Globales</h4>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <div className="text-3xl font-[1000] italic">{userData?._count?.orders || 0}</div>
                                <div className="text-[8px] font-black uppercase opacity-60">Commandes</div>
                            </div>
                            <div>
                                <div className="text-3xl font-[1000] italic">{userData?.rank ? `#${userData.rank}` : '--'}</div>
                                <div className="text-[8px] font-black uppercase opacity-60">Rang</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-12">
                {/* Tokens Balance Card */}
                <div className="bg-yellow-400 p-12 rounded-[4rem] text-black space-y-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-white/40 transition-all duration-1000"></div>
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-black rounded-[1.5rem] flex items-center justify-center shadow-2xl">
                            <Coins size={32} className="text-yellow-400" />
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 italic">Solde de Jetons</div>
                            <div className="text-6xl font-[1000] italic leading-none">{userData?.tokens !== undefined ? userData.tokens.toLocaleString() : '0'}</div>
                        </div>
                    </div>

                    {/* How to earn info */}
                    <div className="px-6 py-5 bg-black rounded-3xl border border-black/10 shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/10 blur-[40px] rounded-full -mr-10 -mt-10"></div>
                        <h5 className="text-[9px] font-black uppercase tracking-widest text-yellow-500 mb-2 italic flex items-center gap-2 relative z-10">
                            <Sparkles size={10} className="text-yellow-500" /> Acquisition de Jetons
                        </h5>
                        <p className="text-[10px] font-medium text-gray-400 leading-relaxed relative z-10">
                            Gagnez des jetons à chaque commande <span className="text-white font-bold italic">(1 TND = 1 Jeton)</span> ou en complétant des protocoles spéciaux. Utilisez-les pour débloquer des items exclusifs au Shop.
                        </p>
                    </div>

                    <Link href="/account/loyalty/shop" className="w-full py-6 bg-black text-white rounded-full font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-2xl italic">
                        ALLER AU SHOP
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Benefits / Stats Card */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[4rem] p-12 space-y-10 shadow-2xl">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic flex items-center gap-4">
                        <Sparkles size={14} className="text-yellow-500" /> Avantages de Rang
                    </h4>
                    <div className="space-y-6">
                        {[
                            { label: currentTier.benefit, icon: Sparkles, highlight: true },
                            { label: 'Drop Hebdomadaire', icon: Gift },
                            { label: 'Support Prioritaire', icon: ShieldCheck },
                            { label: 'Multiplicateur XP x1.2', icon: Coins }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-6 group cursor-default">
                                <div className={`w-12 h-12 rounded-2xl ${item.highlight ? 'bg-yellow-400/10 text-yellow-400' : 'bg-white/5 text-gray-700'} flex items-center justify-center group-hover:text-yellow-400 group-hover:bg-yellow-400/5 transition-all`}>
                                    <item.icon size={20} />
                                </div>
                                <span className={`text-[11px] font-black uppercase tracking-widest ${item.highlight ? 'text-white' : 'text-gray-400'} italic group-hover:text-white transition-colors`}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/5 rounded-[4rem] p-10 space-y-8 shadow-2xl overflow-hidden relative">
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-400/5 blur-[60px]"></div>
                    <div className="flex items-center gap-4">
                        <Target className="w-5 h-5 text-yellow-500" />
                        <h4 className="text-sm font-[1000] uppercase italic tracking-tighter text-white">Protocoles Actifs (Quêtes)</h4>
                    </div>

                    <div className="space-y-4">
                        {quests.length > 0 ? quests.filter(q => {
                            const currentActLevel = parseInt(act.id.split('-')[1]);
                            return currentActLevel >= (q.minAct || 0);
                        }).map((quest) => (
                            <div key={quest.id} className="group relative p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-yellow-400/30 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="text-[10px] font-black uppercase text-white tracking-widest">{quest.title}</div>
                                        <div className="text-[9px] font-bold text-gray-500 italic mt-0.5">{quest.description}</div>
                                    </div>
                                    <div className="px-2 py-1 bg-yellow-400/10 rounded-lg border border-yellow-400/20 text-[8px] font-black text-yellow-500 tracking-wider">
                                        {quest.rewardAmount} {quest.rewardType}
                                    </div>
                                </div>
                                <div className="h-1 bg-black rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-400" style={{ width: `${(quest.progress || 0)}%` }}></div>
                                </div>
                                <div className="text-[8px] text-right text-gray-600 font-bold mt-1 uppercase tracking-widest">{Math.round(quest.progress || 0)}% Complété</div>
                            </div>
                        )) : (
                            <div className="text-[10px] text-gray-600 italic text-center py-4 uppercase tracking-widest opacity-50">Aucun protocole détecté</div>
                        )}
                        {/* Locked Quests */}
                        {quests.length > 0 && quests.filter(q => parseInt(act.id.split('-')[1]) < (q.minAct || 0)).map((quest) => (
                            <div key={quest.id} className="group relative p-4 rounded-3xl bg-black/40 border border-white/5 opacity-50 flex justify-between items-center cursor-not-allowed">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/5 rounded-full">
                                        <Lock size={14} className="text-gray-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{quest.title}</div>
                                        <div className="text-[9px] font-bold text-gray-700 italic mt-0.5">Requis: Acte {quest.minAct !== undefined ? ACTS[quest.minAct].subtitle : 'Supérieur'}</div>
                                    </div>
                                </div>
                                <div className="px-2 py-1 bg-white/5 rounded-lg border border-white/5 text-[8px] font-black text-gray-600 tracking-wider">
                                    {quest.reward}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

