// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, TrendingUp, DollarSign, Users, Clock, CheckCircle } from 'lucide-react';
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
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-5xl font-black text-white mb-2">
                    Dashboard <span className="text-yellow-400">Principal</span>
                </h1>
                <p className="text-gray-400 text-lg">Vue d'ensemble de votre restaurant</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Orders */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <ShoppingBag className="w-10 h-10" />
                        <span className="text-blue-200 text-sm font-bold">TOTAL</span>
                    </div>
                    <p className="text-5xl font-black mb-2">{stats.totalOrders}</p>
                    <p className="text-blue-200">Commandes totales</p>
                </div>

                {/* Pending Orders */}
                <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <Clock className="w-10 h-10" />
                        <span className="text-yellow-200 text-sm font-bold">EN COURS</span>
                    </div>
                    <p className="text-5xl font-black mb-2">{stats.pendingOrders}</p>
                    <p className="text-yellow-200">Commandes actives</p>
                </div>

                {/* Completed Orders */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <CheckCircle className="w-10 h-10" />
                        <span className="text-green-200 text-sm font-bold">TERMINÉES</span>
                    </div>
                    <p className="text-5xl font-black mb-2">{stats.completedOrders}</p>
                    <p className="text-green-200">Commandes livrées</p>
                </div>

                {/* Total Revenue */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <DollarSign className="w-10 h-10" />
                        <span className="text-purple-200 text-sm font-bold">REVENU</span>
                    </div>
                    <p className="text-5xl font-black mb-2">{stats.totalRevenue.toFixed(0)} DT</p>
                    <p className="text-purple-200">Revenu total</p>
                </div>

                {/* Today's Orders */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <TrendingUp className="w-10 h-10" />
                        <span className="text-orange-200 text-sm font-bold">AUJOURD'HUI</span>
                    </div>
                    <p className="text-5xl font-black mb-2">{stats.todayOrders}</p>
                    <p className="text-orange-200">Commandes du jour</p>
                </div>

                {/* Today's Revenue */}
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <DollarSign className="w-10 h-10" />
                        <span className="text-pink-200 text-sm font-bold">AUJOURD'HUI</span>
                    </div>
                    <p className="text-5xl font-black mb-2">{stats.todayRevenue.toFixed(0)} DT</p>
                    <p className="text-pink-200">Revenu du jour</p>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black text-white">
                        Commandes Récentes
                    </h2>
                    <Link
                        href="/admin/orders"
                        className="text-yellow-400 hover:text-yellow-300 font-bold transition"
                    >
                        Voir tout →
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">Aucune commande pour le moment</p>
                ) : (
                    <div className="space-y-3">
                        {recentOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/admin/orders`}
                                className="block bg-gray-700 rounded-xl p-4 hover:bg-gray-600 transition"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-yellow-400 font-black text-lg">
                                                #{order.orderNumber}
                                            </span>
                                            <span className={`${getStatusColor(order.status)} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </div>
                                        <p className="text-gray-300">
                                            {order.deliveryInfo.fullName} • {order.deliveryInfo.phone}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(order.createdAt).toLocaleString('fr-FR')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-white">
                                            {order.finalTotal.toFixed(1)} DT
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}