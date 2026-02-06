'use client';

import { useEffect, useState } from 'react';
import {
    Clock, Zap, Target, Sparkles, CheckCircle2, Lock, Loader2, PartyPopper, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TacticalAura from '@/components/TacticalAura';
import { useToast } from '@/app/context/ToastContext'; // Corrected import
import { ACTS } from '@/lib/loyalty';

interface Quest {
    id: string;
    title: string;
    description: string;
    type: string;
    rewardType: string;
    rewardAmount: number;
    minAct: number;
    progress: number;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'CLAIMED' | 'PENDING';
}

export default function QuestsPage() {
    const { toast } = useToast();
    const [quests, setQuests] = useState<Quest[]>([]);
    const [userPoints, setUserPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [claimingId, setClaimingId] = useState<string | null>(null);

    const fetchQuests = async () => {
        try {
            const res = await fetch('/api/quests');
            const data = await res.json();
            if (data.success) {
                setQuests(data.quests);
                setUserPoints(data.userPoints || 0);
            }
        } catch (error) {
            console.error('Failed to fetch quests', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuests();
    }, []);

    const handleClaim = async (questId: string, rewardAmount: number, rewardType: string) => {
        setClaimingId(questId);
        try {
            const res = await fetch(`/api/quests/${questId}/claim`, { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                toast.success(`Récompense récupérée : +${rewardAmount} ${rewardType === 'XP' ? 'XP' : 'Jetons'} !`);
                setQuests(prev => prev.map(q => q.id === questId ? { ...q, status: 'CLAIMED' } : q));
            } else {
                toast.error(data.error || "Erreur lors de la réclamation");
            }
        } catch (e) {
            toast.error("Erreur de connexion");
        } finally {
            setClaimingId(null);
        }
    };

    // Determine current User Act
    const currentActIndex = ACTS.findIndex(act => userPoints >= act.min && userPoints <= act.max);
    const currentAct = currentActIndex === -1 ? 0 : currentActIndex; // Default to 0 if not found (should be Act 0 or 4+)

    // Group Quests by Act requirement
    const groupedQuests = quests.reduce((acc, quest) => {
        const act = quest.minAct || 0;
        if (!acc[act]) acc[act] = [];
        acc[act].push(quest);
        return acc;
    }, {} as Record<number, Quest[]>);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <Loader2 className="w-10 h-10 text-yellow-400 animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic pb-5">Synchronisation des Protocoles...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-12 relative z-10"
        >
            <TacticalAura opacity={0.3} />

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter text-white">Tableau des Missions</h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest italic mt-1">
                        Niveau actuel: <span className="text-yellow-400">{ACTS[currentAct]?.title || 'INCONNU'}</span>
                    </p>
                </div>
            </div>

            <div className="space-y-12">
                {[0, 1, 2, 3, 4].map((actIndex) => {
                    const actQuests = groupedQuests[actIndex] || [];
                    if (actQuests.length === 0) return null;

                    const isLocked = actIndex > currentAct;
                    const isPast = actIndex < currentAct;
                    const isCurrent = actIndex === currentAct;

                    return (
                        <div key={actIndex} className="relative">
                            {/* Section Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`h-px flex-1 ${isCurrent ? 'bg-yellow-400' : 'bg-white/10'}`}></div>
                                <h3 className={`text-xl font-[1000] italic uppercase tracking-tighter ${isCurrent ? 'text-yellow-400' : isLocked ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {isLocked && <Lock className="inline-block w-4 h-4 mr-2 mb-1" />}
                                    {ACTS[actIndex]?.subtitle || `ACTE ${actIndex}`}
                                </h3>
                                <div className={`h-px flex-1 ${isCurrent ? 'bg-yellow-400' : 'bg-white/10'}`}></div>
                            </div>

                            {/* Quests Grid */}
                            <div className={`grid md:grid-cols-2 gap-6 ${isLocked ? 'opacity-50 blur-[1px] grayscale pointer-events-none select-none' : ''}`}>
                                {actQuests.map((quest) => {
                                    const isCompleted = quest.status === 'COMPLETED';
                                    const isClaimed = quest.status === 'CLAIMED';
                                    const progressPercent = Math.min(100, isCompleted || isClaimed ? 100 : quest.progress);

                                    return (
                                        <div key={quest.id} className={`p-10 bg-[#0a0a0a] border ${isCompleted ? 'border-yellow-400' : 'border-white/5'} rounded-[3rem] group hover:border-yellow-400/30 transition-all relative overflow-hidden shadow-xl`}>
                                            {isCompleted && <div className="absolute inset-0 bg-yellow-400/5 animate-pulse"></div>}

                                            {/* Locked Overlay if Act is locked logic fails safe */}
                                            {isLocked && (
                                                <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center backdrop-blur-sm">
                                                    <div className="text-center">
                                                        <ShieldAlert className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">Accréditation Insuffisante</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="relative z-10 flex items-start gap-8">
                                                <div className={`w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center ${isCompleted ? 'text-yellow-400' : isClaimed ? 'text-gray-600' : 'text-gray-400'} group-hover:scale-110 transition-transform`}>
                                                    {quest.type === 'TIME' && <Clock className="w-6 h-6" />}
                                                    {quest.type === 'STREAK' && <Zap className="w-6 h-6" />}
                                                    {quest.type === 'COLLECTION' && <Target className="w-6 h-6" />}
                                                    {quest.type === 'SOCIAL' && <Sparkles className="w-6 h-6" />}
                                                </div>
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex justify-between items-start">
                                                        <h5 className={`text-xl font-[1000] italic uppercase tracking-tighter ${isClaimed ? 'text-gray-500' : 'text-white'} group-hover:text-yellow-400 transition-colors`}>{quest.title}</h5>
                                                        <span className={`${isClaimed ? 'bg-white/5 text-gray-500' : 'bg-yellow-400 text-black'} px-4 py-1 rounded-full text-[9px] font-black italic`}>
                                                            {isClaimed ? 'RÉCLAMÉ' : `+${quest.rewardAmount} ${quest.rewardType === 'XP' ? 'XP' : 'JETONS'}`}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs font-bold text-gray-500 uppercase italic leading-tight">{quest.description}</p>

                                                    <div className="pt-6 space-y-3">
                                                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-600">
                                                            <span>Progression Tactique</span>
                                                            <span className={isCompleted && !isClaimed ? 'text-yellow-400' : 'text-white'}>{Math.round(progressPercent)}%</span>
                                                        </div>
                                                        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden p-0.5">
                                                            <div className={`h-full rounded-full shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all duration-1000 ${isClaimed ? 'bg-gray-700' : 'bg-yellow-400'}`} style={{ width: `${progressPercent}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {isCompleted && !isLocked && (
                                                    <motion.div
                                                        initial={{ y: '100%' }}
                                                        animate={{ y: 0 }}
                                                        exit={{ y: '100%' }}
                                                        className="absolute inset-0 bg-yellow-400 flex items-center justify-center cursor-pointer z-20"
                                                        onClick={() => !claimingId && handleClaim(quest.id, quest.rewardAmount, quest.rewardType)}
                                                    >
                                                        <div className="text-black font-black uppercase italic tracking-widest text-sm flex items-center gap-3">
                                                            {claimingId === quest.id ? (
                                                                <><Loader2 className="animate-spin" /> TRAITEMENT...</>
                                                            ) : (
                                                                <><PartyPopper size={24} className="animate-bounce" /> RÉCLAMER LA RÉCOMPENSE</>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
