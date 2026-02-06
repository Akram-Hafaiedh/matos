// app/(private)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
    ShoppingBag, TrendingUp, DollarSign, Users,
    Clock, CheckCircle, RefreshCw, ArrowRight,
    Sparkles, Target, Zap, Signal, Activity, ShieldAlert, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    todayOrders: number;
    todayRevenue: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
        todayOrders: 0,
        todayRevenue: 0
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();

            if (data.success) {
                const orders = data.orders;
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const todayOrders = orders.filter((o: any) =>
                    new Date(o.createdAt) >= today
                );

                setStats({
                    totalOrders: orders.length,
                    pendingOrders: orders.filter((o: any) =>
                        ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(o.status)
                    ).length,
                    completedOrders: orders.filter((o: any) => o.status === 'delivered').length,
                    totalRevenue: orders.reduce((sum: number, o: any) => sum + o.finalTotal, 0),
                    todayOrders: todayOrders.length,
                    todayRevenue: todayOrders.reduce((sum: number, o: any) => sum + o.finalTotal, 0)
                });

                setRecentOrders(orders.slice(0, 8));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.1)]';
            case 'confirmed': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'preparing': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'out_for_delivery': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
            case 'delivered': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'confirmed': return 'Confirmée';
            case 'preparing': return 'Cuisine';
            case 'out_for_delivery': return 'Livraison';
            case 'delivered': return 'Livrée';
            case 'cancelled': return 'Annulée';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-[0_0_50px_rgba(250,204,21,0.2)]"></div>
                <p className="text-gray-500 font-[1000] uppercase text-[10px] tracking-[0.5em] italic animate-pulse">Synchronizing Tactical Data...</p>
            </div>
        );
    }

    const statCards = [
        { label: 'Revenu Global', value: `${stats.totalRevenue.toFixed(0)}`, suffix: 'DT', icon: DollarSign, trend: '+12.5%', color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { label: 'Commandes Actives', value: stats.pendingOrders, suffix: 'OPS', icon: Zap, trend: 'EN CUISINE', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { label: 'Revenue 24H', value: `${stats.todayRevenue.toFixed(0)}`, suffix: 'DT', icon: Target, trend: 'LIVE TRACK', color: 'text-green-400', bg: 'bg-green-400/10' },
    ];

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header Area */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Signal size={12} className="text-yellow-400" />
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">Global Intelligence Matrix</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">
                        Tableau <span className="text-yellow-400">de Bord</span>
                    </h1>
                    <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1">Analyse des flux et indicateurs de performance en temps réel</p>
                </div>

                <button
                    onClick={fetchDashboardData}
                    className="flex-1 xl:flex-none flex items-center justify-center gap-4 bg-white/[0.02] border border-white/5 px-10 py-5 rounded-[2rem] text-white font-[1000] uppercase text-[10px] tracking-[0.3em] italic hover:bg-yellow-400 hover:text-black transition-all duration-700 active:scale-95 group shadow-2xl"
                >
                    <RefreshCw className={`w-4 h-4 transition-transform duration-700 group-hover:rotate-180 ${loading ? 'animate-spin' : ''}`} />
                    Sync Systems
                </button>
            </div>

            {/* Tactical High-Fidelity Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 p-10 rounded-[3.5rem] relative overflow-hidden group hover:border-yellow-400/30 transition-all duration-1000 shadow-3xl">
                        <div className="relative z-10 space-y-8">
                            <div className="flex justify-between items-center">
                                <div className={`w-16 h-16 rounded-[1.5rem] ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-700 shadow-inner`}>
                                    <stat.icon size={28} strokeWidth={2.5} />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[9px] font-[1000] uppercase tracking-widest text-white/40 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">{stat.trend}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-[1000] uppercase tracking-[0.4em] text-gray-700 mb-2 italic">{stat.label}</p>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-6xl font-[1000] italic tracking-tighter text-white leading-none">{stat.value}</span>
                                    {stat.suffix && <span className="text-xl font-[1000] text-yellow-400 uppercase italic opacity-30">{stat.suffix}</span>}
                                </div>
                            </div>
                        </div>
                        {/* High Fidelity Background Glow */}
                        <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-yellow-400/[0.01] blur-[100px] rounded-full pointer-events-none group-hover:bg-yellow-400/[0.04] transition-colors duration-1000"></div>
                    </div>
                ))}
            </div>

            {/* Tactical Mini Stats & Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'TOTAL TRANSMISSIONS', value: stats.totalOrders, icon: ShoppingBag, link: '/dashboard/orders' },
                    { label: 'SUCCESS RATE', value: '98.5%', icon: CheckCircle, link: '/dashboard/reviews' },
                    { label: 'FLUX ANALYSIS', value: stats.todayOrders, icon: TrendingUp, link: '/dashboard/customers' },
                ].map((mini, i) => (
                    <Link key={i} href={mini.link} className="bg-white/[0.01] border border-white/5 p-8 rounded-[2rem] flex items-center justify-between group hover:bg-white/[0.03] hover:border-yellow-400/20 transition-all duration-500 shadow-xl">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center text-gray-800 group-hover:text-yellow-400 transition-colors">
                                <mini.icon size={20} />
                            </div>
                            <div>
                                <p className="text-[9px] font-[1000] uppercase tracking-[0.3em] text-gray-700 italic mb-1">{mini.label}</p>
                                <p className="text-2xl font-[1000] text-white italic tracking-tighter leading-none">{mini.value}</p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-900 group-hover:text-yellow-400 group-hover:translate-x-2 transition-all" />
                    </Link>
                ))}
            </div>

            {/* Tactical Activity Matrix */}
            <div className="space-y-10 pt-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-1 bg-yellow-400 rounded-full shadow-[0_0_30px_rgba(250,204,21,0.4)]"></div>
                        <h3 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter">Flux d'Activité <span className="text-yellow-400">Récent</span></h3>
                    </div>
                    <Link
                        href="/dashboard/orders"
                        className="group flex items-center gap-4 text-gray-700 hover:text-white font-[1000] uppercase text-[10px] tracking-[0.4em] transition-all duration-500 italic"
                    >
                        Archive Data Matrix
                        <ArrowRight size={14} className="group-hover:translate-x-3 transition-transform" />
                    </Link>
                </div>

                <div className="bg-white/[0.01] border border-white/5 rounded-[4rem] overflow-hidden shadow-3xl backdrop-blur-3xl relative">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.02] border-b border-white/5">
                                    <th className="px-12 py-10 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Transmission #</th>
                                    <th className="px-6 py-10 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Origin (Source)</th>
                                    <th className="px-6 py-10 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Volume</th>
                                    <th className="px-6 py-10 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Status Block</th>
                                    <th className="px-12 py-10 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none text-right">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-48 text-center opacity-30">
                                            <p className="text-[10px] font-[1000] uppercase tracking-[0.5em] italic">Frequency Silent • Aucune donnée active</p>
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="group hover:bg-yellow-400/[0.01] transition-all duration-500 cursor-pointer relative"
                                            onClick={() => router.push(`/dashboard/orders?id=${order.id}`)}
                                        >
                                            <td className="px-12 py-10">
                                                <span className="font-[1000] text-yellow-400 italic text-3xl tracking-tighter leading-none group-hover:scale-110 transition-transform origin-left block">#{order.orderNumber}</span>
                                            </td>
                                            <td className="px-6 py-10">
                                                <div className="space-y-1">
                                                    <p className="text-white font-[1000] text-sm uppercase tracking-widest group-hover:text-yellow-400 transition-colors leading-none">{order.deliveryInfo.fullName}</p>
                                                    <p className="text-[10px] text-gray-700 font-bold tracking-[0.2em] uppercase">{order.deliveryInfo.phone}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-10">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-white font-[1000] text-2xl italic tracking-tighter leading-none">{order.finalTotal.toFixed(1)}</span>
                                                    <span className="text-[10px] text-yellow-400 font-[1000] uppercase opacity-30 italic">DT</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-10">
                                                <div className={`px-6 py-2.5 rounded-full text-[9px] font-[1000] uppercase tracking-[0.3em] border-2 italic flex items-center gap-3 w-fit transition-all duration-700 ${getStatusColor(order.status)}`}>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_15px_currentColor]"></div>
                                                    {getStatusLabel(order.status)}
                                                </div>
                                            </td>
                                            <td className="px-12 py-10 text-right">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] text-white font-[1000] uppercase tracking-[0.3em] italic leading-none">{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</p>
                                                    <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.4em] italic leading-none">{new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

