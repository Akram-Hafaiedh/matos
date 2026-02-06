// app/(protected)/account/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
    ShoppingBag, Trophy, Star, ChevronRight,
    Zap, Gem, Target, Clock, MessageSquare, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { TIERS, getUserTier, isItemExpired } from '@/lib/loyalty';
import UserAvatar from '@/components/UserAvatar';
import TacticalAura from '@/components/TacticalAura';

export default function AccountDashboard() {
    const { data: session } = useSession();
    const [userData, setUserData] = useState<any>(null);
    const [quests, setQuests] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        activeTickets: 0,
        availablePoints: 0,
        rank: '-'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, ordersRes, ticketsRes, questsRes] = await Promise.all([
                    fetch('/api/user/profile'),
                    fetch('/api/orders'),
                    fetch('/api/support/tickets'),
                    fetch('/api/quests')
                ]);

                const profileData = await profileRes.json();
                const ordersData = await ordersRes.json();
                const ticketsData = await ticketsRes.json();
                const questsData = await questsRes.json();

                if (profileData.success) {
                    setUserData(profileData.user);
                    setStats(prev => ({
                        ...prev,
                        availablePoints: profileData.user.loyaltyPoints || 0,
                        rank: profileData.user.rank || '-'
                    }));
                }

                if (ordersData.success) {
                    setStats(prev => ({ ...prev, totalOrders: ordersData.orders.length }));
                }

                if (ticketsData.success) {
                    setStats(prev => ({
                        ...prev,
                        activeTickets: ticketsData.tickets.filter((t: any) => t.status !== 'RESOLVED').length
                    }));
                }

                if (questsData.success) {
                    setQuests(questsData.quests || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400/20 blur-[30px] rounded-full animate-pulse"></div>
                    <Loader2 className="w-12 h-12 text-yellow-400 animate-spin relative z-10" />
                </div>
                <p className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.5em] italic animate-pulse">Synchronisation des Flux de Données...</p>
            </div>
        );
    }

    const tier = getUserTier(userData?.loyaltyPoints || 0);

    const activeBoosters = userData?.inventory?.filter((item: any) => {
        if (item.type !== 'Boosters') return false;
        return !isItemExpired(item);
    }) || [];

    const tacticalCards = [
        {
            label: "Secteur Fidélité",
            title: "Héritage Signature",
            value: stats.availablePoints,
            suffix: "CREDITS",
            icon: Trophy,
            href: "/account/loyalty",
            color: tier.textColor.replace('text-', '') || "yellow-400",
            desc: `Statut ${tier.name} — Accès aux privilèges archivés.`
        },
        {
            label: "Logistique Opérationnelle",
            title: "Manifestes de Livraison",
            value: stats.totalOrders,
            suffix: "MISSIONS",
            icon: ShoppingBag,
            href: "/account/orders",
            color: "blue-400",
            desc: "Historique complet et tracking temps réel des vecteurs."
        },
        {
            label: "Support Tactique",
            title: "Cellule d'Intervention",
            value: stats.activeTickets,
            suffix: "ACTIFS",
            icon: MessageSquare,
            href: "/account/tickets",
            color: "red-400",
            desc: "Communication directe avec la régie centrale."
        }
    ];

    // Find the quest with most progress
    const topQuest = quests.length > 0 ? quests.reduce((prev, current) => (prev.progress > current.progress) ? prev : current) : null;

    return (
        <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <TacticalAura />
            {/* Mission Briefing Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-16 h-1 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.4)]"></div>
                        <span className="text-[10px] font-[1000] uppercase tracking-[0.4em] text-gray-500 italic">Global Perspective Unit</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-[1000] italic tracking-tighter leading-none uppercase text-white">
                        Briefing <span className="text-yellow-400">Tactique</span>
                    </h1>
                    <p className="mt-6 text-gray-600 font-bold uppercase text-[11px] tracking-[0.5em] ml-1 max-w-xl leading-relaxed italic">
                        Bienvenue dans votre centre de contrôle, <span className="text-white">{session?.user?.name}</span>.
                        Supervision complète de vos protocoles et actifs Mato's.
                    </p>
                </div>

                {/* Highlights Bar */}
                {(activeBoosters.length > 0 || topQuest) && (
                    <div className="flex gap-4">
                        {activeBoosters.slice(0, 2).map((boost: any) => (
                            <div key={boost.id} className="px-6 py-4 bg-yellow-400/5 border border-yellow-400/20 rounded-[2rem] flex items-center gap-4 animate-in zoom-in duration-700">
                                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse appearance-none shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Booster Actif</span>
                                    <span className="text-[10px] font-[1000] text-yellow-400 uppercase italic tracking-tighter">{boost.name}</span>
                                </div>
                            </div>
                        ))}
                        {topQuest && topQuest.progress > 0 && (
                            <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-[2rem] flex items-center gap-4 animate-in zoom-in duration-700 delay-200">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Objectif Proche</span>
                                    <span className="text-[10px] font-[1000] text-white uppercase italic tracking-tighter">{topQuest.title} ({Math.round(topQuest.progress)}%)</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Tactical Grid Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tacticalCards.map((card, idx) => (
                    <Link
                        key={idx}
                        href={card.href}
                        className="bg-white/[0.02] border border-white/5 p-10 rounded-[3.5rem] relative overflow-hidden group hover:border-yellow-400/30 transition-all duration-1000 shadow-3xl flex flex-col justify-between min-h-[400px]"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.02] blur-[80px] -mr-24 -mt-24 pointer-events-none group-hover:bg-yellow-400/[0.05] transition-colors duration-1000"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-[1000] uppercase tracking-[0.4em] text-gray-600 italic">{card.label}</span>
                                <card.icon className={`w-6 h-6 text-gray-800 group-hover:text-yellow-400 transition-colors duration-700`} />
                            </div>
                            <h3 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter leading-tight group-hover:text-yellow-400 transition-colors">
                                {card.title}
                            </h3>
                            <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest leading-relaxed italic opacity-80">
                                {card.desc}
                            </p>
                        </div>

                        <div className="relative z-10 mt-10">
                            <div className="text-7xl font-[1000] text-white italic tracking-tighter leading-none flex items-baseline gap-4 group-hover:translate-x-2 transition-transform duration-700">
                                {card.value}
                                <span className="text-[10px] not-italic text-gray-700 uppercase tracking-[0.3em] font-black">{card.suffix}</span>
                            </div>
                            <div className="mt-8 flex items-center gap-3 text-yellow-400 font-[1000] uppercase text-[9px] tracking-[0.3em] italic opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                                Accéder au Système <ChevronRight size={12} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Intelligence Matrix */}
            <div className="bg-white/[0.01] border border-white/5 rounded-[4rem] p-12 relative overflow-hidden group">
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="space-y-6 flex-1">
                        <div className="flex items-center gap-4">
                            <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400/20" />
                            <h3 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter">
                                Pulse <span className="text-yellow-400">Utilisateur</span>
                            </h3>
                        </div>
                        <p className="text-gray-600 text-xs font-black uppercase tracking-[0.2em] leading-relaxed italic">
                            Votre empreinte numérique est optimisée. Protocoles de sécurité actifs. Session maintenue sous cryptage haute-fidélité.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/account/profile" className="px-10 py-5 rounded-[2rem] bg-white/[0.02] border border-white/5 text-white font-[1000] uppercase text-[10px] tracking-[0.3em] italic hover:bg-yellow-400 hover:text-black transition-all duration-700 active:scale-95">
                                Synchroniser Profil
                            </Link>
                            <Link href="/account/security" className="px-10 py-5 rounded-[2rem] bg-white/[0.02] border border-white/5 text-white font-[1000] uppercase text-[10px] tracking-[0.3em] italic hover:bg-white hover:text-black transition-all duration-700 active:scale-95">
                                Vecteurs de Sécurité
                            </Link>
                        </div>
                    </div>

                    <div className="flex gap-10">
                        <div className="text-center space-y-2">
                            <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic mb-4">Rang Global</p>
                            <div className="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center bg-black/40 shadow-2xl group-hover:border-yellow-400/30 transition-all duration-1000">
                                <span className="text-4xl font-[1000] italic text-white">#{stats.rank}</span>
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic mb-4">Statut Session</p>
                            <div className="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center bg-black/40 shadow-2xl group-hover:border-green-400/30 transition-all duration-1000">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-yellow-400/[0.01] blur-[100px] rounded-full"></div>
            </div>
        </div>
    );
}
