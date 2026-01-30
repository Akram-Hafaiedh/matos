'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Package, Clock, CheckCircle2, Loader2, ArrowLeft, ArrowRight, MapPin, Store, Shield, User, Search } from 'lucide-react';
import Link from 'next/link';

// Masking helper function
const maskString = (str: string, type: 'name' | 'phone') => {
    if (!str) return '***';
    if (type === 'phone') {
        // Keep first 2 and last 1: "22 *** **9"
        return str.length > 3 ? `${str.slice(0, 2)} *** **${str.slice(-1)}` : '***';
    }
    // Name: Keep first letters: "Ah*** Be***"
    return str.split(' ').map(part => part.length > 2 ? `${part[0]}${part[1]}***` : '***').join(' ');
};

export default function PublicOrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrder = async (number: string, isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const res = await fetch(`/api/tracking/${number}`, { cache: 'no-store' });
            const data = await res.json();
            if (data.success) {
                setOrder(data.order);
                setError(null);
                localStorage.setItem('lastOrder', JSON.stringify(data.order));
            } else {
                if (!isSilent) {
                    setError(data.error || 'Commande introuvable');
                    setOrder(null);
                }
            }
        } catch (err) {
            if (!isSilent) setError('Erreur de connexion');
        } finally {
            if (!isSilent) setLoading(false);
        }
    };

    useEffect(() => {
        if (params.orderNumber) {
            fetchOrder(params.orderNumber as string);
        }
    }, [params.orderNumber]);

    useEffect(() => {
        const activeNum = order?.orderNumber;
        if (!activeNum) return;

        // Optimization: Stop polling if order is finished
        const isFinished = order.status === 'delivered' || order.status === 'cancelled';

        if (isFinished) return;

        // Higher frequency for active tracking, lower for pending
        const isPending = order.status === 'pending';
        const intervalTime = isPending ? 15 * 1000 : 5 * 1000;

        const interval = setInterval(() => {
            fetchOrder(activeNum, true);
        }, intervalTime);

        return () => clearInterval(interval);
    }, [order?.orderNumber, order?.status]);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'confirmed': return { label: 'Confirmée', sub: 'Votre commande est validée', color: 'bg-blue-500', text: 'text-blue-500' };
            case 'preparing': return { label: 'En Préparation', sub: 'Le chef prépare votre festin', color: 'bg-purple-500', text: 'text-purple-500' };
            case 'ready': return { label: 'Prête', sub: 'Votre commande vous attend', color: 'bg-teal-500', text: 'text-teal-500' };
            case 'out_for_delivery': return { label: 'En Livraison', sub: 'Le livreur est en route', color: 'bg-orange-500', text: 'text-orange-500' };
            case 'delivered': return { label: 'Livrée', sub: 'Bon appétit !', color: 'bg-green-500', text: 'text-green-500' };
            case 'cancelled': return { label: 'Annulée', sub: 'Cette commande a été annulée', color: 'bg-red-500', text: 'text-red-500' };
            default: return { label: 'Reçue', sub: 'En attente de validation', color: 'bg-yellow-400', text: 'text-yellow-400' };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 bg-gray-900 rounded-[2rem] flex items-center justify-center mb-8 border border-gray-800">
                    <Package className="w-10 h-10 text-gray-700" />
                </div>
                <h2 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">Commande Introuvable</h2>
                <p className="text-gray-500 mb-10 max-w-sm uppercase text-xs font-bold tracking-widest leading-relaxed">
                    Le numéro <span className="text-white bg-gray-900 px-2 py-1 rounded border border-gray-800">{params.orderNumber}</span> ne correspond à aucune commande active.
                </p>
                <Link href="/tracking" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl shadow-yellow-400/10 active:scale-95">
                    Nouvelle Recherche
                </Link>
            </div>
        );
    }

    const statusConfig = getStatusConfig(order.status);
    const isPickup = order.orderType === 'pickup';

    return (
        <div className="min-h-screen bg-black relative pb-24 selection:bg-yellow-400 selection:text-black pt-40 overflow-hidden">
            {/* Dynamic Background Glows */}
            <div className={`absolute top-0 inset-x-0 h-[800px] opacity-20 blur-[150px] pointer-events-none transition-all duration-1000 ${statusConfig.color}`}></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header Section */}
                <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-4 text-left items-start flex flex-col">
                        <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[10px]">Statut Commande • #{order.orderNumber}</p>
                        <h1 className="text-6xl md:text-9xl font-black text-white italic uppercase tracking-tighter leading-none flex flex-wrap gap-x-4">
                            {statusConfig.label}
                            <span className={statusConfig.text}>!</span>
                        </h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">{statusConfig.sub}</p>
                    </div>

                    <div className="flex flex-col gap-4 w-full lg:w-auto">
                        <Link href="/tracking" className="bg-gray-900/50 hover:bg-gray-800 border border-white/5 px-10 py-5 rounded-[2rem] flex items-center justify-center gap-4 transition-all group shrink-0 whitespace-nowrap shadow-xl">
                            <Search className="w-5 h-5 text-yellow-400" />
                            <p className="text-white font-black text-sm uppercase tracking-[0.2em] italic">Nouvelle Recherche</p>
                        </Link>

                        <div className="bg-blue-500/5 border border-blue-500/10 p-5 rounded-[2rem] flex items-center gap-4 shrink-0 lg:max-w-md">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                <Shield className="w-4 h-4 text-blue-400" />
                            </div>
                            <p className="text-gray-500 text-[9px] uppercase font-bold tracking-wide leading-tight">
                                Informations masquées pour votre sécurité.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start text-left">
                    {/* Left Side: Timeline */}
                    <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                        <div className="bg-gray-900/40 rounded-[3rem] p-10 border border-white/5 backdrop-blur-3xl relative overflow-hidden">
                            <h2 className="text-xl font-black text-white mb-10 flex items-center gap-4 uppercase italic tracking-widest relative z-10 text-left">
                                <Clock className="w-5 h-5 text-yellow-400" />
                                Suivi Détaillé
                            </h2>

                            <div className="relative pl-6 border-l-2 border-dashed border-gray-800 space-y-12 z-10 text-left">
                                {[
                                    { id: 'pending', label: 'Commande reçue', sub: 'Nous avons bien reçu votre demande', time: order.createdAt },
                                    { id: 'confirmed', label: 'Confirmée', sub: 'Commande validée par le restaurant', time: order.confirmedAt },
                                    { id: 'preparing', label: 'En préparation', sub: 'Le chef prépare vos produits', time: order.preparingAt },
                                    { id: 'ready', label: 'Prête', sub: isPickup ? 'Votre commande est prête à être récupérée' : 'Votre commande est prête', time: order.readyAt },
                                    { id: 'out_for_delivery', label: 'En livraison', sub: 'Le livreur est en route vers vous', time: order.outForDeliveryAt },
                                    { id: 'delivered', label: isPickup ? 'Récupérée' : 'Livrée', sub: isPickup ? 'Merci de votre visite !' : 'Bon appétit !', time: order.deliveredAt }
                                ].filter(s => {
                                    if (order.status === 'cancelled') return s.id === 'pending' || s.id === 'cancelled';

                                    // Filter out delivery step for pickup orders
                                    if (isPickup && s.id === 'out_for_delivery') return false;

                                    const sequence = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
                                    const currentIndex = sequence.indexOf(order.status);
                                    const stepIndex = sequence.indexOf(s.id);
                                    return stepIndex <= currentIndex || !!s.time;
                                }).concat(order.status === 'cancelled' ? [{ id: 'cancelled', label: 'Annulée', sub: 'La commande a été annulée', time: order.cancelledAt }] : []).sort((a, b) => {
                                    const sequence = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
                                    return sequence.indexOf(a.id) - sequence.indexOf(b.id);
                                }).map((step, idx, arr) => {
                                    const isLast = idx === arr.length - 1;
                                    const config = getStatusConfig(step.id);

                                    return (
                                        <div key={step.id} className={`relative ${!isLast ? 'opacity-50' : 'animate-in fade-in slide-in-from-left-4 duration-500'}`}>
                                            <div className={`absolute -left-[32px] top-1.5 w-3 h-3 rounded-full border-2 border-black ring-4 ${isLast ? config.color + ' ring-' + config.color.split('-')[1] + '-500/20 scale-125' : 'bg-gray-700 ring-transparent'}`}></div>
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between gap-4">
                                                    <p className={`font-black uppercase text-xs italic tracking-tight ${isLast ? config.text : 'text-gray-400'}`}>
                                                        {step.label}
                                                    </p>
                                                    {step.time && (
                                                        <span className="text-[9px] font-bold text-gray-600 bg-white/5 px-2 py-0.5 rounded-md">
                                                            {new Date(step.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`text-[10px] font-bold leading-tight ${isLast ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {step.sub}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Identity Badge */}
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[3rem] p-10 text-gray-950 shadow-3xl shadow-yellow-400/10 relative overflow-hidden group">
                            <Package className="absolute bottom-4 right-8 w-32 h-32 text-black/5 -mr-12 -mb-12 transform -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                            <div className="relative z-10 space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 opacity-70 italic whitespace-nowrap truncate">Identifiant Commande Unique</p>
                                <p className="text-5xl font-black tracking-tighter italic leading-none">#{order.orderNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Details */}
                    <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                        {/* Summary */}
                        <div className="bg-gray-900/40 rounded-[3rem] border border-white/5 backdrop-blur-3xl overflow-hidden">
                            <div className="p-10 pb-0">
                                <h2 className="text-xl font-black text-white mb-8 uppercase italic tracking-widest text-left">Détails Panier</h2>
                                <div className="space-y-6">
                                    {order.cart.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center group">
                                            <div className="space-y-1 text-left">
                                                <p className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-3">
                                                    <span className="text-yellow-400 text-xs font-black">{item.quantity}x</span>
                                                    {item.item.name}
                                                </p>
                                                {item.selectedSize && <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] ml-8">{item.selectedSize}</p>}
                                            </div>
                                            <span className="text-white font-black text-sm italic">
                                                {(item.item.price * item.quantity).toFixed(1)} <span className="text-[9px] text-gray-700 not-italic">DT</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-10 p-10 bg-white/5 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-baseline gap-6 h-fit text-left">
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 italic">Montant Total</span>
                                    <div className="text-5xl font-black text-white italic tracking-tighter">
                                        {order.totalAmount.toFixed(1)} <span className="text-sm not-italic text-yellow-400">DT</span>
                                    </div>
                                </div>
                                <div className="px-5 py-2 rounded-full border border-white/10 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                    <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest">
                                        Méthode: {order.paymentMethod === 'cash' ? 'Paiement à la réception' : order.paymentMethod}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Recipient Card */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-gray-900/40 p-10 rounded-[3rem] border border-white/5 backdrop-blur-3xl group relative overflow-hidden">
                                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
                                <div className="flex gap-6 text-left relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-yellow-400/10 transition-colors">
                                        {isPickup ? <Store className="w-5 h-5 text-yellow-400" /> : <MapPin className="w-5 h-5 text-yellow-400" />}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-gray-600 font-black uppercase text-[9px] tracking-[0.3em]">{isPickup ? 'Retrait' : 'Destination'}</p>
                                        <p className="text-white font-bold text-sm leading-tight italic">{order.deliveryInfo.address}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900/40 p-10 rounded-[3rem] border border-white/5 backdrop-blur-3xl group relative overflow-hidden">
                                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
                                <div className="flex gap-6 text-left relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-yellow-400/10 transition-colors">
                                        <User className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-gray-600 font-black uppercase text-[9px] tracking-[0.3em]">Client</p>
                                            <p className="text-white font-bold text-sm tracking-widest blur-[0.5px]">
                                                {maskString(order.deliveryInfo.fullName, 'name')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 font-black uppercase text-[9px] tracking-[0.3em]">Contact</p>
                                            <p className="text-white font-bold text-sm tracking-widest blur-[0.5px] font-mono">
                                                {maskString(order.deliveryInfo.phone, 'phone')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
