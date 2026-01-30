// app/(private)/dashboard/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle, RefreshCw, Store } from 'lucide-react';

interface Order {
    id: string;
    orderNumber: string;
    deliveryInfo: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        notes?: string;
    };
    finalTotal: number;
    status: string;
    orderType: string;
    createdAt: string;
    cart: any[];
    cancelMessage?: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
    const [cancelReason, setCancelReason] = useState('');

    const fetchOrders = async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const url = filterStatus === 'all'
                ? '/api/orders'
                : `/api/orders?status=${filterStatus}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            if (!isSilent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [filterStatus]);

    // Anti-refresh polling for new orders (every 10 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            fetchOrders(true);
        }, 10000);
        return () => clearInterval(interval);
    }, [filterStatus]);

    const updateOrderStatus = async (orderId: string, newStatus: string, cancelMessage?: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, cancelMessage })
            });

            const data = await response.json();

            if (data.success) {
                fetchOrders();
                setCancellingOrder(null);
                setCancelReason('');
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Erreur lors de la mise à jour');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-600';
            case 'confirmed': return 'bg-blue-600';
            case 'preparing': return 'bg-purple-600';
            case 'ready': return 'bg-teal-600';
            case 'out_for_delivery': return 'bg-orange-600';
            case 'delivered': return 'bg-green-600';
            case 'cancelled': return 'bg-red-600';
            default: return 'bg-gray-600';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-5 h-5" />;
            case 'confirmed': return <CheckCircle className="w-5 h-5" />;
            case 'preparing': return <Package className="w-5 h-5" />;
            case 'ready': return <Clock className="w-5 h-5" />;
            case 'out_for_delivery': return <Truck className="w-5 h-5" />;
            case 'delivered': return <CheckCircle className="w-5 h-5" />;
            case 'cancelled': return <XCircle className="w-5 h-5" />;
            default: return <Package className="w-5 h-5" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'confirmed': return 'Confirmée';
            case 'preparing': return 'En préparation';
            case 'ready': return 'Prête / Retrait';
            case 'out_for_delivery': return 'En livraison';
            case 'delivered': return 'Terminée';
            case 'cancelled': return 'Annulée';
            default: return status;
        }
    };

    const statusOptions = [
        { value: 'all', label: 'Toutes' },
        { value: 'pending', label: 'En attente' },
        { value: 'confirmed', label: 'Confirmées' },
        { value: 'preparing', label: 'En préparation' },
        { value: 'ready', label: 'Prêtes (Retrait)' },
        { value: 'out_for_delivery', label: 'En livraison' },
        { value: 'delivered', label: 'Terminées' },
        { value: 'cancelled', label: 'Annulées' },
    ];

    return (
        <>
            {/* Cancellation Modal */}
            {cancellingOrder && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-gray-900 border border-red-500/30 w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 shadow-3xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-5 text-red-500 mb-8">
                                <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center">
                                    <XCircle className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Annulation</h2>
                                    <p className="text-[10px] font-black text-red-500/50 uppercase tracking-[0.2em] mt-1">Commande #{cancellingOrder.orderNumber}</p>
                                </div>
                            </div>

                            <p className="text-gray-400 font-bold text-sm mb-10 leading-relaxed">
                                Veuillez indiquer la raison de l'annulation. Ce message sera transmis au client pour justifier la décision.
                            </p>

                            <div className="space-y-2 mb-10">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Motif de l'annulation</label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="Ex: Rupture de stock, fermeture exceptionnelle..."
                                    className="w-full bg-black/50 border-2 border-gray-800 rounded-3xl p-6 text-white font-bold h-40 focus:outline-none focus:border-red-500/50 transition-all resize-none shadow-inner"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => {
                                        setCancellingOrder(null);
                                        setCancelReason('');
                                    }}
                                    className="flex-1 order-2 sm:order-1 px-8 py-5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white font-black uppercase text-[10px] tracking-widest transition-all"
                                >
                                    Fermer
                                </button>
                                <button
                                    onClick={() => updateOrderStatus(cancellingOrder.id, 'cancelled', cancelReason)}
                                    className="flex-[2] order-1 sm:order-2 px-8 py-5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    disabled={!cancelReason.trim()}
                                >
                                    Confirmer l'Annulation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-10 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-5xl font-black text-white mb-2 uppercase italic tracking-tighter">
                            Gestion <span className="text-yellow-400">Commandes</span>
                        </h1>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Gérez toutes vos commandes en temps réel</p>
                    </div>

                    <button
                        onClick={() => fetchOrders()}
                        className="flex items-center gap-2 bg-yellow-400 px-6 py-4 rounded-2xl text-gray-900 font-black uppercase text-[10px] tracking-widest hover:bg-yellow-300 transition duration-500 shadow-xl shadow-yellow-400/10"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Actualiser
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total', value: orders.length, color: 'from-gray-800/10 to-gray-900/10 text-gray-400 border-gray-800' },
                        { label: 'En Attente', value: orders.filter(o => o.status === 'pending').length, color: 'from-yellow-400/10 to-yellow-600/10 text-yellow-400 border-yellow-400/20' },
                        { label: 'En Cours', value: orders.filter(o => ['confirmed', 'preparing', 'out_for_delivery'].includes(o.status)).length, color: 'from-blue-500/10 to-blue-600/10 text-blue-400 border-blue-500/20' },
                        { label: 'Livrées', value: orders.filter(o => o.status === 'delivered').length, color: 'from-green-500/10 to-green-600/10 text-green-400 border-green-500/20' }
                    ].map((stat, i) => (
                        <div key={i} className={`bg-gradient-to-br ${stat.color} p-6 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden group hover:scale-[1.02] transition duration-500`}>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">{stat.label}</p>
                            <p className="text-4xl font-black italic tracking-tighter">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-gray-900/40 p-1.5 rounded-[2rem] border-2 border-gray-800 w-fit backdrop-blur-3xl overflow-x-auto max-w-full no-scrollbar">
                    {statusOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setFilterStatus(option.value)}
                            className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition duration-500 whitespace-nowrap ${filterStatus === option.value
                                ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/20'
                                : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mb-6"></div>
                        <p className="text-gray-500 font-black uppercase text-xs tracking-widest">Récupération des commandes...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 bg-gray-900/40 rounded-[3rem] border border-gray-800 border-dashed">
                        <div className="bg-gray-950 p-8 rounded-full mb-6 text-gray-700">
                            <Package className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-widest">Aucune commande</h3>
                        <p className="text-gray-500 font-bold text-sm">Le flux est actuellement vide pour ce filtre.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {orders.map(order => (
                            <div
                                key={order.id}
                                className={`group bg-gray-900/40 rounded-[3rem] p-8 border backdrop-blur-3xl transition duration-500 relative overflow-hidden ${order.status === 'cancelled' ? 'border-red-500/20 hover:border-red-500/40' : 'border-gray-800 hover:border-yellow-400/30 hover:shadow-3xl'}`}
                            >
                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative z-10">

                                    {/* Info Box */}
                                    <div className="flex-1 space-y-6 text-left">
                                        <div className="flex flex-wrap items-center gap-4">
                                            <span className={`text-3xl font-black italic ${order.status === 'cancelled' ? 'text-gray-500' : 'text-yellow-400'}`}>#{order.orderNumber}</span>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-opacity-20 ${getStatusColor(order.status).replace('bg-', 'border-').replace('600', '500')} ${getStatusColor(order.status)} bg-opacity-10 text-white flex items-center gap-2`}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                                {getStatusLabel(order.status)}
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-4 py-1.5 bg-gray-950 rounded-full border border-gray-800">
                                                {new Date(order.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-opacity-20 flex items-center gap-2 ${order.orderType === 'pickup' ? 'border-pink-500 bg-pink-500/10 text-pink-400' : 'border-blue-500 bg-blue-500/10 text-blue-400'}`}>
                                                {order.orderType === 'pickup' ? <Store className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                                                {order.orderType === 'pickup' ? 'A Emporter' : 'Livraison'}
                                            </span>
                                        </div>

                                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Client</p>
                                                <p className="text-white font-black uppercase text-sm tracking-tight">{order.deliveryInfo.fullName}</p>
                                                <p className="text-[10px] text-gray-500 font-bold">{order.deliveryInfo.phone}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Destination</p>
                                                <p className="text-white font-black uppercase text-sm tracking-tight line-clamp-1 h-5">{order.deliveryInfo.address}</p>
                                                <p className="text-[10px] text-gray-500 font-bold italic uppercase">{order.deliveryInfo.city}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Total Transaction</p>
                                                <p className="text-2xl font-black text-white italic">{order.finalTotal.toFixed(1)} <span className="text-xs text-gray-500">DT</span></p>
                                            </div>
                                        </div>

                                        {order.status === 'cancelled' && order.cancelMessage && (
                                            <div className="mt-4 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                                                <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">Motif d'annulation</p>
                                                <p className="text-gray-400 font-bold text-xs italic">"{order.cancelMessage}"</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Items Preview */}
                                    <div className="hidden min-[1600px]:flex items-center gap-3 overflow-x-auto max-w-sm px-6 border-l border-gray-800">
                                        {order.cart.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="flex-shrink-0 w-12 h-12 bg-gray-950 rounded-xl flex items-center justify-center text-xs font-black text-gray-500 border border-gray-800 group-hover:border-yellow-400/30 transition duration-500">
                                                {item.quantity}x
                                            </div>
                                        ))}
                                        {order.cart.length > 3 && (
                                            <div className="text-[10px] font-black text-gray-600">+{order.cart.length - 3}</div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap xl:flex-col gap-3 min-w-[200px]">
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                                className="flex-1 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border-2 border-blue-500/20 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition duration-500 shadow-xl"
                                            >
                                                Confirmer
                                            </button>
                                        )}
                                        {order.status === 'confirmed' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                className="flex-1 bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white border-2 border-purple-500/20 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition duration-500 shadow-xl"
                                            >
                                                Préparer
                                            </button>
                                        )}
                                        {order.status === 'preparing' && (
                                            order.deliveryInfo.address === 'Retrait sur Place' ? (
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'ready')}
                                                    className="flex-1 bg-teal-500/10 hover:bg-teal-500 text-teal-400 hover:text-white border-2 border-teal-500/20 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition duration-500 shadow-xl"
                                                >
                                                    Prêt pour retrait
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                                                    className="flex-1 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white border-2 border-orange-500/20 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition duration-500 shadow-xl"
                                                >
                                                    En livraison
                                                </button>
                                            )
                                        )}
                                        {order.status === 'ready' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                                className="flex-1 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white border-2 border-green-500/20 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition duration-500 shadow-xl"
                                            >
                                                Retiré / Terminé
                                            </button>
                                        )}
                                        {order.status === 'out_for_delivery' && (
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                                className="flex-1 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white border-2 border-green-500/20 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition duration-500 shadow-xl"
                                            >
                                                Livrée
                                            </button>
                                        )}
                                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                            <button
                                                onClick={() => setCancellingOrder(order)}
                                                className="flex-1 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border-2 border-red-500/10 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition duration-500"
                                            >
                                                Annuler
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Modern Decorative Accent */}
                                <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl group-hover:bg-yellow-400/10 transition-colors"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
