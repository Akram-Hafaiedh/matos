// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, TrendingUp, DollarSign, Users, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    todayOrders: number;
    todayRevenue: number;
}

export default function AdminDashboard() {
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
            // Fetch all orders
            const response = await fetch('/api/orders');
            const data = await response.json();

            if (data.success) {
                const orders = data.orders;

                // Calculate stats
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

                // Get recent orders (last 5)
                setRecentOrders(orders.slice(0, 5));
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500';
            case 'confirmed': return 'bg-blue-500';
            case 'preparing': return 'bg-purple-500';
            case 'out_for_delivery': return 'bg-orange-500';
            case 'delivered': return 'bg-green-500';
            case 'cancelled': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'confirmed': return 'Confirmée';
            case 'preparing': return 'En préparation';
            case 'out_for_delivery': return 'En livraison';
            case 'delivered': return 'Livrée';
            case 'cancelled': return 'Annulée';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-400">Chargement des données...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-black text-white mb-2 uppercase italic tracking-tighter">
                        Dashboard <span className="text-yellow-400">Principal</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Vue d'ensemble de votre établissement en temps réel</p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-6 py-3 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest hover:border-yellow-400/50 transition duration-500"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Actualiser
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { label: 'Commandes Totales', value: stats.totalOrders, icon: ShoppingBag, color: 'from-blue-500/10 to-blue-600/10 text-blue-400 border-blue-500/20' },
                    { label: 'Commandes Actives', value: stats.pendingOrders, icon: Clock, color: 'from-yellow-400/10 to-yellow-600/10 text-yellow-400 border-yellow-400/20' },
                    { label: 'Commandes Livrées', value: stats.completedOrders, icon: CheckCircle, color: 'from-green-500/10 to-green-600/10 text-green-400 border-green-500/20' },
                    { label: 'Revenu Total', value: `${stats.totalRevenue.toFixed(0)} DT`, icon: DollarSign, color: 'from-purple-500/10 to-purple-600/10 text-purple-400 border-purple-500/20' },
                    { label: 'Commandes (24h)', value: stats.todayOrders, icon: TrendingUp, color: 'from-orange-500/10 to-orange-600/10 text-orange-400 border-orange-500/20' },
                    { label: 'Revenu (24h)', value: `${stats.todayRevenue.toFixed(0)} DT`, icon: DollarSign, color: 'from-pink-500/10 to-pink-600/10 text-pink-400 border-pink-500/20' }
                ].map((stat, i) => (
                    <div key={i} className={`bg-gradient-to-br ${stat.color} p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition duration-500`}>
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">{stat.label}</p>
                                <p className="text-5xl font-black italic tracking-tighter">{stat.value}</p>
                            </div>
                            <stat.icon className="w-10 h-10 opacity-20 group-hover:opacity-40 transition-opacity" />
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
                    </div>
                ))}
            </div>

            {/* Recent Orders Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-1 bg-yellow-400 rounded-full"></div>
                        <h2 className="text-xl font-black text-white uppercase italic tracking-widest">Commandes Récentes</h2>
                    </div>
                    <Link
                        href="/dashboard/orders"
                        className="text-yellow-400 hover:text-yellow-300 font-black uppercase text-[10px] tracking-widest transition"
                    >
                        Voir tout l'historique →
                    </Link>
                </div>

                <div className="bg-gray-900/30 rounded-[3rem] border border-gray-800 backdrop-blur-3xl overflow-hidden shadow-3xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-800/50 bg-gray-950/20">
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Numéro</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Client</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Total</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-gray-500 font-bold uppercase tracking-widest">
                                            Aucune commande pour le moment
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="group hover:bg-white/[0.02] transition duration-500">
                                            <td className="px-8 py-6">
                                                <span className="font-black text-yellow-400 italic text-xl">#{order.orderNumber}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-black text-sm uppercase">{order.deliveryInfo.fullName}</span>
                                                    <span className="text-[10px] text-gray-500 font-bold">{order.deliveryInfo.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-white font-black text-lg">{order.finalTotal.toFixed(1)} <span className="text-[10px] text-gray-500">DT</span></span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-2 border-opacity-20 ${getStatusColor(order.status)} bg-opacity-10 text-opacity-100 flex items-center gap-2 w-fit`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(order.status).replace('bg-', 'bg-')}`}></div>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                                </p>
                                                <p className="text-[10px] text-gray-600 font-bold">
                                                    {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
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