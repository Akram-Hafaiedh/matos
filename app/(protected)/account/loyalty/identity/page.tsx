'use client';

import { useEffect, useState } from 'react';
import {
    Target, MapPin, QrCode, Shield, Loader2, CheckCircle2, Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import TacticalAura from '@/components/TacticalAura';
import { getUserTier } from '@/lib/loyalty';

interface UserQuest {
    quest: {
        title: string;
        reward_amount: number;
        reward_type: string;
    };
    completed_at: string;
}

export default function IdentityPage() {
    const [userData, setUserData] = useState<any>(null);
    const [completedQuests, setCompletedQuests] = useState<UserQuest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallel fetching
                const [profileRes, questsRes] = await Promise.all([
                    fetch('/api/user/profile'),
                    fetch('/api/quests') // Re-using quests API to filter completed
                ]);

                const profileData = await profileRes.json();
                const questsData = await questsRes.json();

                if (profileData.success) setUserData(profileData.user);

                if (questsData.success) {
                    // Filter for completed quests from the mixed response
                    // The /api/quests returns active quests merged with user progress. 
                    // We need to extract the completed ones.
                    const completed = questsData.quests.filter((q: any) => q.status === 'COMPLETED' || q.status === 'CLAIMED')
                        .map((q: any) => ({
                            quest: {
                                title: q.title,
                                reward_amount: q.reward_amount || q.rewardAmount,
                                reward_type: q.reward_type || q.rewardType
                            },
                            completed_at: q.completed_at || q.completedAt || new Date().toISOString()
                        }));
                    setCompletedQuests(completed);
                }
            } catch (e) {
                console.error("Identity fetch error", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
                <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
                <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] italic">CHARGEMENT DU DOSSIER...</p>
            </div>
        );
    }

    const points = userData?.loyalty_points || userData?.loyaltyPoints || 0;
    const tier = getUserTier(points);
    const act = points < 1000 ? 'I' : points < 2500 ? 'II' : points < 5000 ? 'III' : 'IV';

    // Dynamic Medals
    const medals = ['742']; // Always present
    if (act !== 'I') medals.push(`ACT-${act}`);
    if (userData?.role === 'admin') medals.push('ADMIN');
    if (completedQuests.length > 5) medals.push('VETERAN');
    if (completedQuests.length > 10) medals.push('LEGEND');

    // City Extraction or Default
    const sector = userData?.city || userData?.address?.split(',').pop()?.trim() || 'TUNIS';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full grid lg:grid-cols-12 gap-12 relative z-10"
        >
            <TacticalAura color={userData?.selected_bg || userData?.selectedBg} opacity={0.3} />
            <div className="lg:col-span-4 space-y-8">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-[4.5rem] p-12 space-y-12 relative overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
                    <div className="flex flex-col items-center text-center space-y-10">
                        <div className={`w-48 h-48 rounded-[3rem] bg-white/5 border-[8px] ${userData?.selected_frame || userData?.selectedFrame || 'border-white/10'} flex items-center justify-center text-8xl shadow-2xl relative group-hover:scale-105 transition-transform duration-700`}>
                            {/* Handle emoji vs image URL safely */}
                            {userData?.image && userData.image.startsWith('http')
                                ? <img src={userData.image} alt="" className="w-full h-full object-cover rounded-[3rem]" />
                                : <span className="text-8xl">{userData?.image || '👑'}</span>
                            }
                            <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black border-[6px] border-black shadow-2xl">
                                <Shield size={20} />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.5em] italic">{tier.name} Elite</div>
                            <h3 className="text-4xl font-[1000] italic uppercase tracking-tighter text-white">AGENT #{userData?.id?.slice(-3).toUpperCase() || 'XXX'}</h3>
                            <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.4em] mt-2 italic">Opérateur de l'Acte {act}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center space-y-6 group cursor-not-allowed opacity-75">
                    <QrCode className="w-32 h-32 text-white/5 group-hover:text-yellow-400 group-hover:scale-110 transition-all duration-700" />
                    <div className="space-y-2">
                        <div className="text-[10px] font-[1000] uppercase text-white tracking-widest italic">Pass Physique</div>
                        <div className="text-[8px] font-black uppercase text-gray-600 tracking-widest">Génération Bientôt Disponible</div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-8 space-y-12">
                <div className="bg-[#0a0a0a]/50 border border-white/5 rounded-[4rem] p-12 space-y-16 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-1 bg-yellow-400 rounded-full"></div>
                            <h4 className="text-3xl font-[1000] text-white italic uppercase tracking-tighter leading-none">Archives Dossier</h4>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6 group/item">
                            <div className="flex items-center gap-4 text-gray-700 group-hover/item:text-yellow-500 transition-colors">
                                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                    <Target size={16} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Spécialisation</span>
                            </div>
                            <div className="space-y-2 pl-12">
                                <div className="text-2xl font-[1000] italic uppercase text-white group-hover/item:translate-x-2 transition-transform">Tactical Gourmet</div>
                                <p className="text-xs text-gray-500 font-bold uppercase italic leading-relaxed">Opérateur de terrain.</p>
                            </div>
                        </div>

                        <div className="space-y-6 group/item">
                            <div className="flex items-center gap-4 text-gray-700 group-hover/item:text-cyan-500 transition-colors">
                                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                    <MapPin size={16} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Secteur</span>
                            </div>
                            <div className="space-y-2 pl-12">
                                <div className="text-2xl font-[1000] italic uppercase text-white group-hover/item:translate-x-2 transition-transform truncate">{sector}</div>
                                <p className="text-xs text-gray-500 font-bold uppercase italic">Zone d'Opération Principale.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 border-t border-white/5 space-y-12">
                        <div className="flex items-center justify-between">
                            <div className="text-[10px] font-black uppercase text-gray-700 tracking-[0.5em] italic">Médailles de Service</div>
                            <div className="text-[10px] font-black uppercase text-yellow-500 tracking-widest italic flex items-center gap-2">
                                <Trophy size={14} /> {medals.length} RÉCOMPENSES DÉBLOQUÉES
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {medals.map((m) => (
                                <div key={m} className="flex flex-col items-center gap-4 p-8 bg-black border border-white/5 rounded-[2.5rem] hover:bg-white/5 hover:border-white/10 transition-all cursor-help grayscale hover:grayscale-0 group/medal">
                                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-800 flex items-center justify-center text-xs font-[1000] text-gray-700 group-hover/medal:border-yellow-400 group-hover/medal:text-yellow-400 transition-all">{m}</div>
                                    <span className="text-[8px] font-black uppercase text-gray-700 tracking-widest group-hover/medal:text-white transition-colors">{m} PROTOCOL</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Completed Quests Section */}
                    <div className="pt-16 border-t border-white/5 space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Opérations Réussies</h4>
                        </div>
                        <div className="space-y-4">
                            {completedQuests.length > 0 ? (
                                completedQuests.slice(0, 5).map((q, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                                                <CheckCircle2 size={18} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-[1000] uppercase italic text-white group-hover:text-yellow-400 transition-colors">{q.quest.title}</div>
                                                <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">
                                                    Classé: {new Date(q.completed_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-black text-yellow-500 uppercase italic bg-yellow-400/10 px-4 py-2 rounded-xl border border-yellow-400/20">
                                            +{q.quest.reward_amount} {q.quest.reward_type === 'XP' ? 'XP' : 'JTN'}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center border border-dashed border-white/10 rounded-3xl">
                                    <p className="text-xs text-gray-500 font-bold uppercase italic">Aucune opération terminée.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-6">
                    <Link href="/account/profile" className="px-10 py-5 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-yellow-400 transition-all italic shadow-2xl">
                        Modifier Identité
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
