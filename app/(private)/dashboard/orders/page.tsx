// app/(private)/dashboard/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle, RefreshCw, Store, Users, ChevronRight, Hash, Activity, MapPin, Phone, MessageSquare, ArrowRight, Loader2, Signal } from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';
import ConfirmModal from '@/components/ConfirmModal';

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
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [lastFetch, setLastFetch] = useState<Date>(new Date());

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
                setLastFetch(new Date());
                // Refresh selected order if it exists
                if (selectedOrder) {
                    const updated = data.orders.find((o: Order) => o.id === selectedOrder.id);
                    if (updated) setSelectedOrder(updated);
                }
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
    }, [filterStatus, selectedOrder]);

    const updateOrderStatus = async (orderId: string, newStatus: string, cancelMessage?: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, cancelMessage })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Protocole de commande mis à jour');
                fetchOrders();
                setCancellingOrder(null);
                setCancelReason('');
            } else {
                toast.error(data.error || 'Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending': return { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', icon: Clock, label: 'En attente' };
            case 'confirmed': return { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: CheckCircle, label: 'Confirmée' };
            case 'preparing': return { color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', icon: Package, label: 'Préparation' };
            case 'ready': return { color: 'text-teal-400', bg: 'bg-teal-400/10', border: 'border-teal-400/20', icon: Activity, label: 'Prête' };
            case 'out_for_delivery': return { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', icon: Truck, label: 'En livraison' };
            case 'delivered': return { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: CheckCircle, label: 'Terminée' };
            case 'cancelled': return { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: XCircle, label: 'Annulée' };
            default: return { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', icon: Package, label: status };
        }
    };

    const statusOptions = [
        { value: 'all', label: 'Toutes les transmissions' },
        { value: 'pending', label: 'Frais / En attente' },
        { value: 'confirmed', label: 'Approuvées' },
        { value: 'preparing', label: 'Cuisine Active' },
        { value: 'ready', label: 'Ready for Pickup' },
        { value: 'out_for_delivery', label: 'Units En Route' },
        { value: 'delivered', label: 'Archives / Success' },
        { value: 'cancelled', label: 'Abortées' },
    ];

    return (
        <div className="w-full pb-20 space-y-12 animate-in fade-in duration-700">
            {/* Cancellation Modal */}
            <ConfirmModal
                isOpen={!!cancellingOrder}
                onClose={() => {
                    setCancellingOrder(null);
                    setCancelReason('');
                }}
                onConfirm={() => cancellingOrder && updateOrderStatus(cancellingOrder.id, 'cancelled', cancelReason)}
                title="Protocol d'Annulation"
                message="Indiquez la raison de l'interruption du signal. Le client sera informé de cette rupture de protocole."
                type="danger"
                confirmText="Confirmer l'Interruption"
                disabled={!cancelReason.trim()}
            >
                {cancellingOrder && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">Motif de Rupture</label>
                            <span className="text-[10px] font-black text-red-500/50 uppercase tracking-widest italic tracking-[0.2em]">Flux #{cancellingOrder.orderNumber}</span>
                        </div>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Ex: Signature Thermique Invalide, Rupture de Stock..."
                            className="w-full bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 text-white font-bold h-40 focus:outline-none focus:border-red-500/50 transition-all resize-none shadow-inner uppercase text-xs italic tracking-widest"
                        />
                    </div>
                )}
            </ConfirmModal>

            {/* Order Details Sliding Panel */}
            <div className={`fixed inset-y-0 right-0 w-full md:w-[700px] bg-[#080808] border-l border-white/5 z-[60] shadow-[0_0_100px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${selectedOrder ? 'translate-x-0' : 'translate-x-full'}`}>
                {selectedOrder && (
                    <div className="h-full flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-full bg-yellow-400/[0.01] pointer-events-none"></div>

                        <div className="p-12 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-3xl sticky top-0 z-10">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Hash size={12} className="text-yellow-400" />
                                    <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic leading-none">Transmission Protocol</span>
                                </div>
                                <h3 className="text-4xl font-[1000] text-white italic tracking-tighter uppercase leading-none">ORDER <span className="text-yellow-400">#{selectedOrder.orderNumber}</span></h3>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-16 h-16 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-3xl text-gray-500 hover:text-white transition-all flex items-center justify-center group"
                            >
                                <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-16 pb-40 relative z-10">
                            {/* Client Intelligence */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                                    <h4 className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">Client Intelligence</h4>
                                </div>
                                <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/[0.01] blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-yellow-400/[0.03] transition-all"></div>

                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="space-y-2">
                                            <p className="text-3xl font-[1000] text-white uppercase tracking-tighter italic">{selectedOrder.deliveryInfo.fullName}</p>
                                            <div className="flex items-center gap-3 text-gray-400">
                                                <Phone size={14} className="text-yellow-400" />
                                                <p className="font-black text-xs tracking-widest">{selectedOrder.deliveryInfo.phone}</p>
                                            </div>
                                        </div>
                                        <div className={`p-6 rounded-[2rem] border transition-colors ${selectedOrder.orderType === 'pickup' ? 'bg-pink-500/5 border-pink-500/20 text-pink-400' : 'bg-blue-500/5 border-blue-400/20 text-blue-400'}`}>
                                            {selectedOrder.orderType === 'pickup' ? <Store size={32} /> : <Truck size={32} />}
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/5 relative z-10 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <MapPin size={14} className="text-gray-600" />
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] italic">Target Vector</p>
                                        </div>
                                        <p className="text-white font-[1000] uppercase italic tracking-widest text-sm leading-relaxed">
                                            {selectedOrder.deliveryInfo.address}, <span className="text-yellow-400/50">{selectedOrder.deliveryInfo.city}</span>
                                        </p>
                                    </div>

                                    {selectedOrder.deliveryInfo.notes && (
                                        <div className="pt-8 border-t border-white/5 relative z-10 bg-yellow-400/[0.02] -mx-10 -mb-10 p-10 mt-8 border-dashed border-yellow-400/10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <MessageSquare size={14} className="text-yellow-400/50" />
                                                <p className="text-[10px] font-black text-yellow-400/50 uppercase tracking-[0.3em] italic">Tactical Briefing</p>
                                            </div>
                                            <p className="text-gray-400 text-xs font-black uppercase italic tracking-widest leading-relaxed">"{selectedOrder.deliveryInfo.notes}"</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Signal Manifest (CartItems) */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
                                    <h4 className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">Signal Manifest</h4>
                                </div>
                                <div className="grid gap-4">
                                    {selectedOrder.cart.map((item: any, idx: number) => (
                                        <div key={idx} className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8 flex items-center justify-between group hover:bg-white/[0.03] hover:border-white/10 transition-all duration-500">
                                            <div className="flex items-center gap-8">
                                                <div className="w-16 h-16 bg-black border border-white/5 rounded-2xl flex items-center justify-center font-[1000] text-yellow-400 text-lg shadow-2xl italic">
                                                    {item.quantity}X
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-white font-[1000] uppercase text-base italic tracking-tight group-hover:text-yellow-400 transition-colors uppercase">{item.name || item.itemName}</p>
                                                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mt-0.5 italic">
                                                        {item.selectedSize ? `VARIANT: ${item.selectedSize}` : (item.type === 'promotion' ? 'MENU PROMOTIONNEL' : 'STANDARD PROTOCOL')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-[1000] text-white italic group-hover:scale-110 transition-transform tracking-tighter">{(item.price || item.itemPrice).toFixed(1)} <span className="text-[12px] opacity-40 not-italic uppercase ml-1">DT</span></p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Fiscal Status */}
                            <section className="bg-yellow-400/5 border border-yellow-400/10 rounded-[3.5rem] p-12 space-y-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-full h-full bg-yellow-400/[0.02] -skew-x-12 translate-x-1/2 pointer-events-none transition-transform group-hover:translate-x-1/3 duration-1000"></div>

                                <div className="flex justify-between items-center text-gray-500 font-black uppercase text-[10px] tracking-[0.3em] relative z-10">
                                    <span>Base Revenue</span>
                                    <span>{(selectedOrder.finalTotal - 0).toFixed(1)} DT</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500 font-black uppercase text-[10px] tracking-[0.3em] relative z-10">
                                    <span>Logistics Tax</span>
                                    <span className="text-green-500 italic">SYSTEM OVERRRIDE: 0.0 DT</span>
                                </div>
                                <div className="pt-8 border-t border-yellow-400/10 flex justify-between items-end relative z-10">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                            <p className="text-gray-400 font-black uppercase text-xs tracking-[0.4em] italic leading-none">Net Output</p>
                                        </div>
                                    </div>
                                    <p className="text-6xl font-[1000] text-white tracking-tighter italic leading-none">
                                        {selectedOrder.finalTotal.toFixed(1)} <span className="text-2xl text-yellow-400 not-italic uppercase ml-2">DT</span>
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Tactical Controls */}
                        <div className="p-12 bg-black/60 backdrop-blur-4xl border-t border-white/5 space-y-6 shadow-[0_-30px_60px_rgba(0,0,0,0.8)] sticky bottom-0 z-20">
                            <div className="flex gap-6">
                                {selectedOrder.status === 'pending' && (
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                                        className="flex-1 bg-yellow-400 text-black px-10 py-6 rounded-[2.5rem] font-[1000] uppercase text-xs tracking-[0.3em] italic shadow-[0_20px_40px_rgba(250,204,21,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                                    >
                                        Autoriser Commande
                                        <CheckCircle size={20} strokeWidth={3} />
                                    </button>
                                )}
                                {selectedOrder.status === 'confirmed' && (
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder.id, 'preparing')}
                                        className="flex-1 bg-white text-black px-10 py-6 rounded-[2.5rem] font-[1000] uppercase text-xs tracking-[0.3em] italic shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                                    >
                                        Initier Préparation
                                        <ArrowRight size={20} strokeWidth={3} />
                                    </button>
                                )}
                                {selectedOrder.status === 'preparing' && (
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder.id, selectedOrder.orderType === 'pickup' ? 'ready' : 'out_for_delivery')}
                                        className="flex-1 bg-yellow-400 text-black px-10 py-6 rounded-[2.5rem] font-[1000] uppercase text-xs tracking-[0.3em] italic shadow-[0_20px_40px_rgba(250,204,21,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                                    >
                                        {selectedOrder.orderType === 'pickup' ? 'MARQUER PRET [PICKUP]' : 'LANCER LOGISTIQUE [LIVRAISON]'}
                                        <Signal size={20} strokeWidth={3} />
                                    </button>
                                )}
                                {['ready', 'out_for_delivery'].includes(selectedOrder.status) && (
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                                        className="flex-1 bg-green-500 text-white px-10 py-6 rounded-[2.5rem] font-[1000] uppercase text-xs tracking-[0.3em] italic shadow-[0_20px_40px_rgba(34,197,94,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                                    >
                                        Clôturer Mission
                                        <CheckCircle size={20} strokeWidth={3} />
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setCancellingOrder(selectedOrder);
                                    setSelectedOrder(null);
                                }}
                                className="w-full bg-white/[0.03] hover:bg-red-500/10 text-gray-600 hover:text-red-500 border border-white/5 hover:border-red-500/20 px-8 py-5 rounded-[2.5rem] font-[1000] uppercase text-[10px] tracking-[0.4em] italic transition-all active:scale-95"
                            >
                                ABORT MISSION / ANNULER
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-12">
                {/* Header */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-400 animate-ping' : 'bg-green-500'} shadow-[0_0_10px_rgba(34,197,94,0.5)]`}></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Signal Status: {loading ? 'Scanning...' : 'Live Feed'}</span>
                        </div>
                        <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">
                            Sytème <span className="text-yellow-400">Commandes</span>
                        </h1>
                        <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1">Mato's Command Center • Real-time Logistics Platform</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-[9px] font-[1000] text-gray-700 uppercase tracking-[0.4em] italic mb-1">Dernière Sync</p>
                            <p className="text-xs font-black text-gray-500 italic uppercase">{lastFetch.toLocaleTimeString()}</p>
                        </div>
                        <button
                            onClick={() => fetchOrders()}
                            className="bg-white text-black px-10 py-5 rounded-3xl font-[1000] uppercase text-[11px] tracking-[0.2em] italic hover:scale-105 transition-all active:scale-95 shadow-2xl flex items-center gap-4 group"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} strokeWidth={3} />
                            Rafraîchir
                        </button>
                    </div>
                </div>

                {/* Tactical Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: 'Flux Global', value: orders.length, icon: Package, color: 'text-gray-700', bg: 'bg-white/[0.01]' },
                        { label: 'Signaux Frais', value: orders.filter(o => o.status === 'pending').length, icon: Signal, color: 'text-yellow-400', bg: 'bg-yellow-400/5' },
                        { label: 'Cuisine Active', value: orders.filter(o => ['confirmed', 'preparing'].includes(o.status)).length, icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/5' },
                        { label: 'Missions Terminées', value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/5' }
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.bg} border border-white/5 p-10 rounded-[3.5rem] flex items-center justify-between group hover:border-white/10 transition-all duration-700 relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] blur-[50px] pointer-events-none group-hover:bg-white/[0.03]"></div>
                            <div className="space-y-2 relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 italic">{stat.label}</p>
                                <p className="text-6xl font-[1000] text-white italic tracking-tighter leading-none">{stat.value}</p>
                            </div>
                            <stat.icon size={48} strokeWidth={2.5} className={`${stat.color} opacity-10 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 relative z-10`} />
                        </div>
                    ))}
                </div>

                {/* Filter Matrix */}
                <div className="bg-white/[0.02] p-2 rounded-[2.5rem] border border-white/5 w-fit backdrop-blur-4xl overflow-x-auto max-w-full custom-scrollbar flex gap-2">
                    {statusOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setFilterStatus(option.value)}
                            className={`px-10 py-5 rounded-[2rem] font-[1000] uppercase text-[10px] tracking-[0.3em] transition-all duration-700 whitespace-nowrap italic ${filterStatus === option.value
                                ? 'bg-yellow-400 text-black shadow-[0_10px_30px_rgba(250,204,21,0.2)]'
                                : 'text-gray-600 hover:text-white hover:bg-white/[0.03]'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Orders Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-60 space-y-8">
                        <div className="w-24 h-24 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-[0_0_50px_rgba(250,204,21,0.2)]"></div>
                        <p className="text-gray-700 font-[1000] uppercase text-xs tracking-[1em] animate-pulse italic">Decoding Transmission Data...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-60 bg-white/[0.01] rounded-[4rem] border border-white/5 border-dashed space-y-8">
                        <div className="w-32 h-32 bg-white/[0.02] rounded-[3rem] flex items-center justify-center text-gray-800 border border-white/5">
                            <Package size={64} strokeWidth={1.5} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter mb-2">Silence Radio</h3>
                            <p className="text-gray-700 font-black text-[10px] uppercase tracking-[0.5em] italic">Aucune commande détectée dans ce périmètre.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
                        {orders.map(order => {
                            const config = getStatusConfig(order.status);
                            return (
                                <div
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className={`group bg-white/[0.01] rounded-[3.5rem] p-10 border transition-all duration-700 relative overflow-hidden cursor-pointer hover:scale-[1.02] ${selectedOrder?.id === order.id ? 'border-yellow-400/50 bg-white/[0.03] ring-1 ring-yellow-400/20' : 'border-white/5 hover:border-white/20'}`}
                                >
                                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-yellow-400/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/[0.02] blur-[80px] -mr-32 -mt-32 pointer-events-none transition-transform group-hover:scale-150 duration-1000"></div>

                                    <div className="space-y-8 relative z-10">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Hash size={10} className="text-yellow-400" />
                                                    <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic">{order.orderNumber}</p>
                                                </div>
                                                <h3 className="text-3xl font-[1000] text-white uppercase tracking-tighter italic group-hover:text-yellow-400 transition-colors">{order.deliveryInfo.fullName}</h3>
                                            </div>
                                            <div className={`w-14 h-14 rounded-2xl ${config.bg} ${config.border} border flex items-center justify-center ${config.color} shadow-2xl transition-all group-hover:scale-110 duration-700`}>
                                                <config.icon size={24} strokeWidth={3} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 py-8 border-y border-white/5">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em] italic mb-2">Timestamp</p>
                                                <div className="flex items-center gap-3 text-white font-[1000] italic text-xs tracking-widest bg-white/[0.03] w-fit px-4 py-2 rounded-xl border border-white/5">
                                                    <Clock size={12} className="text-yellow-400" />
                                                    {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.3em] italic mb-2">Logistical Channel</p>
                                                <div className={`flex items-center gap-3 font-[1000] italic text-xs tracking-widest w-fit px-4 py-2 rounded-xl border border-white/5 ${order.orderType === 'pickup' ? 'bg-pink-500/5 text-pink-400 border-pink-500/20' : 'bg-blue-500/5 text-blue-400 border-blue-500/20'}`}>
                                                    {order.orderType === 'pickup' ? <Store size={12} /> : <Truck size={12} />}
                                                    <span className="uppercase">{order.orderType === 'pickup' ? 'Pickup' : 'Delivery'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end pt-2">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] italic mb-1">Fiscal Output</p>
                                                <p className="text-4xl font-[1000] text-white italic tracking-tighter">{order.finalTotal.toFixed(1)} <span className="text-[14px] text-yellow-400 not-italic uppercase ml-1">DT</span></p>
                                            </div>
                                            <div className="flex items-center -space-x-3">
                                                {order.cart.slice(0, 3).map((_, i) => (
                                                    <div key={i} className="w-10 h-10 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-lg shadow-2xl group-hover:-translate-y-2 transition-transform duration-500" style={{ transitionDelay: `${i * 100}ms` }}>
                                                        🍱
                                                    </div>
                                                ))}
                                                {order.cart.length > 3 && (
                                                    <div className="w-10 h-10 rounded-2xl bg-yellow-400 border-2 border-black flex items-center justify-center text-[11px] font-[1000] text-black shadow-2xl relative z-10 group-hover:-translate-y-2 transition-transform duration-500" style={{ transitionDelay: '300ms' }}>
                                                        +{order.cart.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute right-8 bottom-10 opacity-0 group-hover:opacity-100 transition-all translate-x-10 group-hover:translate-x-0 duration-700">
                                        <div className="flex items-center gap-3 text-yellow-400 font-[1000] uppercase text-[10px] tracking-[0.3em] italic">
                                            VIEW DATA
                                            <ChevronRight size={24} strokeWidth={3} className="animate-bounce-x" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
