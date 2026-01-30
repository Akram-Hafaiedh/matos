'use client';

import { Trophy, Crown, Gem, ShieldCheck, Zap, ArrowLeft, Star, Medal, Users, LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import UserAvatar from "@/components/UserAvatar";

interface RankUser {
    id: string;
    name: string | null;
    image: string | null;
    loyaltyPoints: number;
}

interface HallOfFameItem {
    month: string;
    winner: string;
    points: number;
    award: string;
}

export default function FidelityPage() {
    const { data: session, status } = useSession();
    const [ranking, setRanking] = useState<RankUser[]>([]);
    const [hallOfFame, setHallOfFame] = useState<HallOfFameItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/loyalty/ranking')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setRanking(data.ranking);
                    setHallOfFame(data.hallOfFame);
                }
                setLoading(false);
            });
    }, []);

    const levels = [
        {
            name: 'Bronze',
            icon: <ShieldCheck className="w-8 h-8 text-orange-400" />,
            points: '0-1000',
            perc: '25%',
            benefit: '5% remise sur chaque commande',
            color: 'from-orange-400/20 to-transparent',
            borderColor: 'border-orange-400/30'
        },
        {
            name: 'Silver',
            icon: <Trophy className="w-8 h-8 text-gray-300" />,
            points: '1000-2500',
            perc: '50%',
            benefit: '10% remise + Boisson offerte',
            color: 'from-gray-300/20 to-transparent',
            borderColor: 'border-gray-300/30'
        },
        {
            name: 'Gold',
            icon: <Crown className="w-8 h-8 text-yellow-500" />,
            points: '2500-5000',
            perc: '75%',
            benefit: '15% remise + Livraison gratuite',
            color: 'from-yellow-500/20 to-transparent',
            borderColor: 'border-yellow-500/30'
        },
        {
            name: 'Platinum',
            icon: <Gem className="w-8 h-8 text-cyan-400" />,
            points: '5000+',
            perc: '100%',
            benefit: '20% remise + Invitations VIP',
            color: 'from-cyan-400/20 to-transparent',
            borderColor: 'border-cyan-400/30'
        }
    ];

    return (
        <div className="min-h-screen bg-black py-16 md:py-20 pb-32 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-gray-900/50 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-24 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-5xl md:text-8xl font-[1000] text-white italic tracking-tighter uppercase leading-[0.85] mb-4">
                                Mato's <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Privilege</span>
                            </h1>
                            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] max-w-lg leading-relaxed">
                                Le programme de fidélité le plus exclusif de Tunis. <br className="hidden md:block" />
                                Cumulez des points, débloquez des récompenses.
                            </p>
                        </div>
                    </div>

                    {status === 'authenticated' ? (
                        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 flex items-center gap-6 backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-colors">
                            <UserAvatar
                                image={session?.user?.image}
                                name={session?.user?.name}
                                size="lg"
                                className="w-16 h-16 rounded-2xl border border-white/10 shadow-2xl"
                            />
                            <div>
                                <div className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Vos Points Club</div>
                                <div className="text-4xl font-[1000] text-white italic tracking-tighter">
                                    {(session?.user as any)?.loyaltyPoints || 1482}
                                    <span className="text-xs text-yellow-500 uppercase not-italic font-bold ml-1">PTS</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] flex items-center gap-3 transition-all shadow-xl hover:scale-105 active:scale-95 group">
                            <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            Rejoindre le Club
                        </Link>
                    )}
                </div>

                {/* Levels Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {levels.map((level, idx) => (
                        <div
                            key={idx}
                            className={`group relative bg-white/[0.02] border border-white/5 rounded-3xl p-8 overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 flex flex-col`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>
                            <div className="relative z-10 space-y-6 flex flex-col h-full">
                                <div className="flex justify-between items-start">
                                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform duration-500">
                                        {level.icon}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-gray-600 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Palier</div>
                                        <div className="text-lg font-black text-white italic tracking-tight">{level.points}</div>
                                    </div>
                                </div>
                                <div className="space-y-2 flex-1">
                                    <h3 className="text-2xl font-[1000] text-white italic uppercase tracking-tighter">{level.name}</h3>
                                    <p className="text-gray-500 font-bold text-[10px] uppercase tracking-wider leading-relaxed">
                                        {level.benefit}
                                    </p>
                                </div>
                                {status === 'authenticated' && (
                                    <div className="pt-6 mt-auto">
                                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-500 rounded-full transition-all duration-1000"
                                                style={{ width: level.perc }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Leaderboard & Hall of Fame Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Ranking / Leaderboard */}
                    <div className="lg:col-span-2 bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-8 md:p-10 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-yellow-500 font-black text-[9px] uppercase tracking-[0.3em]">
                                    <Users className="w-3.5 h-3.5" />
                                    Classement Général
                                </div>
                                <h2 className="text-4xl font-[1000] text-white italic uppercase tracking-tighter">Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Members</span></h2>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse"></div>
                                ))
                            ) : ranking.map((user, idx) => (
                                <div key={user.id} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-2xl hover:bg-white/5 hover:border-white/10 transition-all group/item overflow-hidden relative">
                                    {idx < 3 && <div className={`absolute left-0 top-0 bottom-0 w-1 ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-400' : 'bg-orange-500'}`}></div>}
                                    <div className="flex items-center gap-5">
                                        <div className={`w-8 font-black text-xl italic text-right ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-500' : 'text-gray-700'}`}>
                                            #{idx + 1}
                                        </div>
                                        <UserAvatar
                                            image={user.image}
                                            name={user.name}
                                            size="md"
                                            className="w-12 h-12 rounded-xl border border-white/10"
                                        />
                                        <div>
                                            <div className="text-white font-black text-base italic uppercase tracking-tight">{user.name || 'Anonyme'}</div>
                                            <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">
                                                {user.loyaltyPoints >= 5000 ? 'Platinum' : user.loyaltyPoints >= 2500 ? 'Gold' : 'Silver'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right pr-2">
                                        <div className="text-lg font-black text-white italic tracking-tight">{user.loyaltyPoints.toLocaleString()} <span className="text-[9px] text-gray-600 uppercase not-italic font-bold">PTS</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Wall of Fame */}
                    <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-black rounded-[2.5rem] border border-white/5 p-8 flex flex-col space-y-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]"></div>
                        <div className="relative z-10 space-y-2">
                            <div className="flex items-center gap-2.5 text-orange-500 font-black text-[9px] uppercase tracking-[0.3em]">
                                <Medal className="w-3.5 h-3.5" />
                                Hall of Fame
                            </div>
                            <h2 className="text-3xl font-[1000] text-white italic uppercase tracking-tighter leading-none">Légendes <br /> du <span className="text-orange-500">Mois</span></h2>
                        </div>

                        <div className="relative z-10 space-y-6 flex-1">
                            {hallOfFame.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-center group">
                                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/10 group-hover:border-orange-500/30 transition-colors">
                                        <Medal className={`w-5 h-5 ${idx === 0 ? 'text-yellow-400' : 'text-gray-500'}`} />
                                    </div>
                                    <div>
                                        <div className="text-[8px] font-black text-orange-500 uppercase tracking-widest mb-0.5">{item.month}</div>
                                        <h4 className="text-sm font-black text-white italic truncate uppercase tracking-tight">{item.winner}</h4>
                                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-wider">{item.points} pts</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="relative z-10 bg-white/[0.03] p-6 rounded-2xl border border-white/5 text-center space-y-3 backdrop-blur-md">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">Devenez la légende de ce mois-ci.</p>
                            <Link href="/register" className="inline-block text-[10px] font-black text-white border-b border-white/20 hover:border-white hover:text-yellow-400 transition-all uppercase tracking-[0.2em] pb-1">En savoir plus</Link>
                        </div>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-[2rem] p-10 md:p-14 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-yellow-400/10 transition-colors duration-700"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="space-y-4 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full text-yellow-400 font-black text-[9px] uppercase tracking-[0.2em]">
                                <Zap className="w-3 h-3 fill-yellow-400" />
                                1 DT = 1 Point
                            </div>
                            <h2 className="text-4xl md:text-5xl font-[1000] text-white italic uppercase tracking-tighter leading-[0.9]">
                                Récompensez <br /> votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Appétit</span>
                            </h2>
                            <p className="font-medium text-sm text-gray-500 leading-relaxed max-w-sm">
                                Chaque commande vous rapproche de récompenses exclusives. Rejoignez le club Mato's maintenant.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <Link href="/menu" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.15em] hover:scale-105 active:scale-95 transition-all text-center shadow-lg shadow-yellow-400/20">
                                Commander
                            </Link>
                            {status !== 'authenticated' && (
                                <Link href="/register" className="bg-transparent border-2 border-white/10 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-[0.15em] hover:bg-white hover:text-black transition-all text-center">
                                    Créer un compte
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
