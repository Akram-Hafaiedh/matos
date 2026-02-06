'use client';

import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle2, Loader2, ChevronRight, ShoppingBag, Search, Filter, ChevronLeft, Store, Truck, XCircle, Star } from 'lucide-react';
import Link from 'next/link';
import TacticalAura from '@/components/TacticalAura';

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'pending': return 'En attente';
        case 'confirmed': return 'Confirmée';
        case 'preparing': return 'En préparation';
        case 'ready': return 'Prête';
        case 'out_for_delivery': return 'En livraison';
        case 'delivered': return 'Terminée';
        case 'cancelled': return 'Annulée';
        default: return status;
    }
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                status: status,
                search: search,
                limit: '5'
            });
            const res = await fetch(`/api/orders?${queryParams.toString()}`);
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, status]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchOrders();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-700 pb-20">
            <TacticalAura opacity={0.3} />
            <div className="flex flex-col md:flex-row gap-8 items-end justify-between border-b border-white/5 pb-16">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-400/20 bg-yellow-400/5 backdrop-blur-md">
                        <ShoppingBag size={12} className="text-yellow-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-400">Logistique Tactique</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-none text-white">
                        VOS <span className="text-yellow-400 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">COMMANDES</span>
                    </h1>
                </div>

                <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-yellow-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Rechercher une signature #..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/5 text-white pl-14 pr-6 py-5 rounded-3xl font-[1000] uppercase italic tracking-tight focus:outline-none focus:border-yellow-400/50 focus:bg-white/[0.04] transition-all text-sm placeholder:text-gray-800"
                    />
                </form>
            </div>

            <div className="flex flex-wrap gap-3 pb-4">
                {[
                    { val: 'all', label: 'Toutes' },
                    { val: 'pending', label: 'En attente' },
                    { val: 'confirmed', label: 'Confirmées' },
                    { val: 'preparing', label: 'Cuisine' },
                    { val: 'delivered', label: 'Terminées' },
                    { val: 'cancelled', label: 'Annulées' }
                ].map((s) => (
                    <button
                        key={s.val}
                        onClick={() => { setStatus(s.val); setPage(1); }}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic border transition-all duration-500 ${status === s.val
                            ? 'bg-yellow-400 border-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.2)]'
                            : 'bg-white/[0.02] border-white/5 text-gray-600 hover:text-white hover:border-white/10'
                            }`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                    <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic">Fetching Order Vault...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-32 bg-white/[0.01] rounded-[3.5rem] border border-white/5 border-dashed relative overflow-hidden">
                    <div className="w-24 h-24 bg-white/[0.02] rounded-[2rem] border border-white/5 flex items-center justify-center mx-auto mb-8 text-gray-800">
                        <ShoppingBag size={40} />
                    </div>
                    <h3 className="text-3xl font-[1000] text-gray-800 uppercase italic tracking-tighter mb-4">Archives Vides</h3>
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] px-4 italic">Il est temps de passer votre première commande exclusive.</p>
                    <Link href="/menu" className="mt-12 inline-flex items-center gap-4 bg-white text-black px-12 py-5 rounded-2xl font-[1000] uppercase text-[11px] tracking-[0.2em] italic hover:scale-105 transition-transform active:scale-95 shadow-2xl">
                        Visiter le Menu
                        <ChevronRight size={16} strokeWidth={3} />
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <Link href={`/account/orders/${order.orderNumber}`} key={order.id} className="block bg-white/[0.02] p-10 rounded-[3rem] border border-white/5 hover:border-yellow-400/30 transition-all duration-700 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/[0.01] blur-[150px] -mr-64 -mt-64 pointer-events-none group-hover:bg-yellow-400/[0.03] transition-all duration-1000"></div>

                            <div className="flex flex-col lg:flex-row justify-between gap-10 relative z-10">
                                <div className="space-y-8 flex-1">
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="bg-yellow-400/10 text-yellow-500 px-6 py-2.5 rounded-2xl text-[12px] font-[1000] italic uppercase tracking-tighter border border-yellow-400/20">
                                            #{order.orderNumber}
                                        </div>
                                        <div className="flex items-center gap-2.5 text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] italic">
                                            <Clock size={14} className="text-gray-800" />
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <div className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2.5 border border-2 border-opacity-10 italic ${order.orderType === 'pickup' ? 'border-pink-500 bg-pink-500/5 text-pink-400' : 'border-blue-500 bg-blue-500/5 text-blue-400'}`}>
                                            {order.orderType === 'pickup' ? <Store size={14} /> : <Truck size={14} />}
                                            {order.orderType === 'pickup' ? 'A Emporter' : 'Livraison'}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        {(Array.isArray(order.cart) ? order.cart : []).map((item: any, idx: number) => (
                                            <span key={idx} className="text-[10px] font-black uppercase tracking-widest bg-white/[0.03] px-5 py-3 rounded-2xl border border-white/5 text-gray-400 group-hover:text-white transition-colors italic">
                                                <span className="text-yellow-400 mr-2">{item.quantity}×</span> {item.itemName}
                                            </span>
                                        ))}
                                    </div>

                                    {order.status === 'cancelled' && order.cancelMessage && (
                                        <div className="p-6 bg-red-400/[0.02] border border-red-400/10 rounded-[2rem] max-w-xl">
                                            <p className="text-[9px] font-black text-red-500 uppercase tracking-[0.4em] mb-2 flex items-center gap-2 italic">
                                                <XCircle size={14} />
                                                Note de Service — Annulation
                                            </p>
                                            <p className="text-gray-600 font-bold text-[11px] italic leading-relaxed">"{order.cancelMessage}"</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-row lg:flex-col justify-between lg:items-end gap-6 border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-12 min-w-[220px]">
                                    <div className="space-y-2 text-right">
                                        <div className="text-4xl font-[1000] text-white italic tracking-tighter leading-none">{order.finalTotal.toFixed(1)} <span className="text-[11px] font-black uppercase not-italic text-yellow-400 opacity-40 ml-1">DT</span></div>
                                        {order.status !== 'cancelled' && (
                                            <div className="text-[9px] font-[1000] text-yellow-500 uppercase tracking-[0.3em] flex items-center justify-end gap-2 italic">
                                                <Star size={12} className="fill-current" />
                                                +{Math.floor(order.finalTotal)} POINTS CUMULÉS
                                            </div>
                                        )}
                                    </div>
                                    <div className={`px-6 py-2.5 rounded-2xl text-[10px] font-[1000] uppercase tracking-[0.2em] italic flex items-center gap-3 border border-2 border-opacity-10 shadow-lg ${order.status === 'delivered'
                                        ? 'bg-green-500/5 text-green-400 border-green-400/20'
                                        : order.status === 'cancelled'
                                            ? 'bg-red-500/5 text-red-500 border-red-500/20'
                                            : 'bg-yellow-400/5 text-yellow-400 border-yellow-400/20'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor] ${order.status === 'delivered' ? '' : 'animate-pulse'}`}></div>
                                        {getStatusLabel(order.status)}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* Pagination Controls */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-5 mt-12">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-700 hover:text-white hover:border-yellow-400/50 transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
                            >
                                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <span className="text-[11px] font-[1000] text-gray-500 px-8 py-4 bg-white/[0.03] border border-white/5 rounded-2xl tracking-[0.3em] uppercase italic">
                                Page <span className="text-white mx-1">{page}</span> / {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-700 hover:text-white hover:border-yellow-400/50 transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
                            >
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
