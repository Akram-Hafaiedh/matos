'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Package, Clock, CheckCircle2, Loader2, ArrowLeft, MapPin, Phone, CreditCard, ShoppingBag, Store } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch specific order
        // Note: You might need to adjust your API to support fetching by single ID/Number
        // For now, filtering from the list API or creating a new endpoint might be needed.
        // Assuming /api/orders?id=XYZ or similar, but typically REST is /api/orders/ID
        // Let's assume we filter client side from the list or add a new route.
        // Actually, the best way without backend changes is to fetch all and find, OR add the endpoint.
        // Let's try to add the endpoint or update the existing one to handle single ID?
        // Wait, the existing GET /api/orders returns a list.
        // I will update /api/orders to support ?orderNumber or ?id but for now let's try fetching the list and filtering (inefficient but safe for now)
        // BETTER: Create /api/orders/[id]/route.ts
        // BUT: I want to avoid creating too many files if I can help it.
        // Let's modify the GET in /api/orders/route.ts to accept 'id' param?
        // Actually, let's just fetch all and filter for now to avoid breaking the backend, or better yet, I will update /api/orders/route.ts to support single fetch.

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

    const isPickup = order.deliveryFee === 0 && order.deliveryInfo?.address === 'Retrait sur Place';

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

                <div className={`px-6 py-3 rounded-2xl border-2 self-start md:self-auto flex items-center gap-3 ${order.status === 'delivered' ? 'bg-green-500/10 border-green-500 text-green-500' :
                        order.status === 'cancelled' ? 'bg-red-500/10 border-red-500 text-red-500' :
                            'bg-yellow-400/10 border-yellow-400 text-yellow-400'
                    }`}>
                    {order.status === 'delivered' ? <CheckCircle2 className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
                    <span className="font-black uppercase text-xs tracking-widest">{order.status}</span>
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
                                        <p className="text-white font-bold text-sm uppercase tracking-wide">
                                            <span className="text-yellow-400 mr-2">{item.quantity}x</span>
                                            {item.itemName}
                                        </p>
                                        {item.selectedSize && <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest ml-7">{item.selectedSize}</p>}
                                        {item.choices && (
                                            <div className="ml-7 text-xs text-gray-500 space-y-1">
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
                    {/* Assuming simple timeline for now */}
                    <div className="bg-gray-900/60 p-8 rounded-[2.5rem] border border-gray-800 backdrop-blur-xl">
                        <h2 className="text-xl font-black text-white mb-8 flex items-center gap-4 uppercase italic tracking-widest">
                            <Clock className="w-5 h-5 text-yellow-400" />
                            Historique
                        </h2>
                        <div className="relative pl-4 border-l-2 border-gray-800 space-y-8">
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-yellow-400 border-2 border-black ring-2 ring-gray-900"></div>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{new Date(order.createdAt).toLocaleString('fr-FR')}</p>
                                <p className="text-white font-bold text-sm">Commande reçue</p>
                            </div>
                            {order.status !== 'pending' && (
                                <div className="relative">
                                    <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-black ring-2 ring-gray-900 ${order.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-400'}`}></div>
                                    <p className="text-white font-bold text-sm uppercase">{order.status}</p>
                                </div>
                            )}
                        </div>
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
