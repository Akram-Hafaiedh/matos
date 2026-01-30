'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Package, Clock, CheckCircle2, Loader2, ArrowLeft, MapPin, Phone, CreditCard, ShoppingBag, Store, XCircle, Star } from 'lucide-react';
import Link from 'next/link';

const getStatusInfo = (status: string) => {
    switch (status) {
        case 'pending': return { label: 'En attente', color: 'bg-yellow-400', text: 'text-yellow-400' };
        case 'confirmed': return { label: 'Confirmée', color: 'bg-blue-500', text: 'text-blue-500' };
        case 'preparing': return { label: 'En préparation', color: 'bg-purple-500', text: 'text-purple-500' };
        case 'ready': return { label: 'Prête', color: 'bg-teal-500', text: 'text-teal-500' };
        case 'out_for_delivery': return { label: 'En livraison', color: 'bg-orange-500', text: 'text-orange-500' };
        case 'delivered': return { label: 'Terminée', color: 'bg-green-500', text: 'text-green-500' };
        case 'cancelled': return { label: 'Annulée', color: 'bg-red-500', text: 'text-red-500' };
        default: return { label: status, color: 'bg-gray-500', text: 'text-gray-500' };
    }
};

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/orders`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const foundOrder = data.orders.find((o: any) => o.id === params.id || o.orderNumber === params.id);
                    if (foundOrder) {
                        setOrder(foundOrder);
                    } else {
                        setError('Commande introuvable');
                    }
                } else {
                    setError('Erreur lors du chargement');
                }
                setLoading(false);
            })
            .catch(err => {
                setError('Erreur de connexion');
                setLoading(false);
            });
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-black text-white mb-4 uppercase italic">Oups!</h2>
                <p className="text-gray-500 mb-8">{error || 'Cette commande n\'existe pas.'}</p>
                <Link href="/account/orders" className="text-yellow-400 hover:text-yellow-300 font-bold uppercase tracking-widest text-xs">
                    Retour aux commandes
                </Link>
            </div>
        );
    }

    const isPickup = (order.orderType === 'pickup') || (order.deliveryFee === 0 && order.deliveryInfo?.address === 'Retrait sur Place');
    const statusInfo = getStatusInfo(order.status);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link href="/account/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-4 transition-colors font-bold uppercase text-[10px] tracking-[0.2em] group">
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        Retour / Commandes
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                        Commande <span className="text-yellow-400">#{order.orderNumber}</span>
                    </h1>
                </div>

                <div className={`px-6 py-3 rounded-2xl border-2 self-start md:self-auto flex items-center gap-3 ${order.status === 'delivered' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                    order.status === 'cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                        'bg-yellow-400/10 border-yellow-400/20 text-yellow-400'
                    }`}>
                    {order.status === 'delivered' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Loader2 className="w-5 h-5 animate-spin" />}
                    <span className="font-black uppercase text-xs tracking-widest">{statusInfo.label}</span>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">

                    {/* Items List */}
                    <div className="bg-gray-900/60 p-8 rounded-[2.5rem] border border-gray-800 backdrop-blur-xl">
                        <h2 className="text-xl font-black text-white mb-8 flex items-center gap-4 uppercase italic tracking-widest">
                            <ShoppingBag className="w-5 h-5 text-yellow-400" />
                            Articles ({order.cart.length})
                        </h2>
                        <div className="space-y-6">
                            {order.cart.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-start border-b border-gray-800 pb-6 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-white font-bold text-sm uppercase tracking-wide text-left">
                                            <span className="text-yellow-400 mr-2">{item.quantity}x</span>
                                            {item.itemName}
                                        </p>
                                        {item.selectedSize && <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest ml-7 text-left">{item.selectedSize}</p>}
                                        {item.choices && (
                                            <div className="ml-7 text-xs text-gray-500 space-y-1 text-left">
                                                {Object.entries(item.choices).map(([key, value]: any) => (
                                                    <p key={key}><span className="opacity-50">{key}:</span> {value}</p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-white font-black text-sm">
                                        {(item.itemPrice * item.quantity).toFixed(1)} <span className="opacity-30 text-[10px]">DT</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline / Progress */}
                    <div className="bg-gray-900/60 p-8 rounded-[2.5rem] border border-gray-800 backdrop-blur-xl">
                        <h2 className="text-xl font-black text-white mb-8 flex items-center gap-4 uppercase italic tracking-widest">
                            <Clock className="w-5 h-5 text-yellow-400" />
                            Historique
                        </h2>
                        <div className="relative pl-6 border-l-2 border-gray-800 space-y-10">
                            {[
                                { id: 'pending', label: 'Commande reçue', time: order.createdAt },
                                { id: 'confirmed', label: 'Confirmée', time: order.confirmedAt },
                                { id: 'preparing', label: 'En préparation', time: order.preparingAt },
                                { id: 'ready', label: 'Prête', time: order.readyAt },
                                { id: 'out_for_delivery', label: isPickup ? 'Prêt pour retrait' : 'En livraison', time: order.outForDeliveryAt },
                                { id: 'delivered', label: isPickup ? 'Récupérée / Terminé' : 'Livrée / Terminé', time: order.deliveredAt },
                                { id: 'cancelled', label: 'Annulée', time: order.cancelledAt }
                            ].filter(step => step.time).map((step, idx, arr) => {
                                const isLast = idx === arr.length - 1;
                                const info = getStatusInfo(step.id);
                                return (
                                    <div key={idx} className="relative">
                                        <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-black ring-2 ring-gray-900 ${isLast ? info.color : 'bg-gray-700'}`}></div>
                                        <div className="text-left">
                                            <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">{new Date(step.time).toLocaleString('fr-FR')}</p>
                                            <p className={`font-bold text-sm uppercase italic tracking-tight ${isLast ? 'text-white' : 'text-gray-500'}`}>{step.label}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {order.status === 'cancelled' && order.cancelMessage && (
                            <div className="mt-10 p-6 bg-red-500/5 border border-red-500/10 rounded-3xl text-left">
                                <p className="text-red-500 font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2">
                                    <XCircle className="w-4 h-4" />
                                    Motif d'annulation
                                </p>
                                <p className="text-gray-400 font-bold text-xs italic leading-relaxed">
                                    "{order.cancelMessage}"
                                </p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Sidebar */}
                <div className="space-y-8">

                    {/* Delivery / Pickup Info */}
                    <div className="bg-gray-900/60 p-8 rounded-[2.5rem] border border-gray-800 backdrop-blur-xl">
                        <h2 className="text-xl font-black text-white mb-6 flex items-center gap-4 uppercase italic tracking-widest">
                            {isPickup ? <Store className="w-5 h-5 text-yellow-400" /> : <MapPin className="w-5 h-5 text-yellow-400" />}
                            {isPickup ? 'Retrait' : 'Livraison'}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Contact</p>
                                <p className="text-white font-bold text-sm">{order.deliveryInfo.fullName}</p>
                                <p className="text-gray-400 text-xs">{order.deliveryInfo.phone}</p>
                            </div>

                            {!isPickup && (
                                <div>
                                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Destination</p>
                                    <p className="text-white font-bold text-sm leading-tight">{order.deliveryInfo.address}</p>
                                    <p className="text-gray-400 text-xs mt-1">{order.deliveryInfo.city}</p>
                                </div>
                            )}

                            {order.deliveryInfo.notes && (
                                <div className="pt-4 border-t border-gray-800">
                                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Instructions</p>
                                    <p className="text-yellow-400/80 italic text-xs">"{order.deliveryInfo.notes}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-yellow-400 rounded-[2.5rem] p-8 text-gray-900 shadow-xl shadow-yellow-400/10">
                        <h2 className="text-xl font-black mb-6 uppercase italic tracking-widest flex items-center gap-3">
                            <CreditCard className="w-5 h-5" />
                            Total
                        </h2>

                        <div className="space-y-3 mb-6 border-b border-black/10 pb-6">
                            <div className="flex justify-between font-bold uppercase text-[10px] tracking-widest opacity-60">
                                <span>Sous-total</span>
                                <span>{order.totalPrice.toFixed(1)} DT</span>
                            </div>
                            <div className="flex justify-between font-bold uppercase text-[10px] tracking-widest opacity-60">
                                <span>Livraison</span>
                                <span>{order.deliveryFee === 0 ? 'Offerte' : `${order.deliveryFee.toFixed(1)} DT`}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <span className="font-black uppercase text-xs tracking-widest mb-1">Total Payé</span>
                            <span className="text-4xl font-black italic tracking-tighter">{order.finalTotal.toFixed(1)} <span className="text-sm not-italic opacity-40">DT</span></span>
                        </div>

                        {/* Loyalty Points Section */}
                        {order.status !== 'cancelled' && (
                            <div className="mt-8 pt-6 border-t border-black/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-black/10 rounded-lg">
                                        <Star className="w-4 h-4 fill-current" />
                                    </div>
                                    <span className="font-bold uppercase text-[10px] tracking-widest opacity-60">Points Fidélité</span>
                                </div>
                                <span className="font-black text-xl italic">+{Math.floor(order.finalTotal)}</span>
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-black/10 text-center">
                            <p className="font-bold uppercase text-[10px] tracking-widest opacity-60">
                                Payé en {order.paymentMethod === 'cash' ? 'Espèces' : order.paymentMethod}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
