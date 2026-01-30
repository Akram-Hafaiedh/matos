'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Clock, MapPin, Phone, Package, Loader2, Search, ArrowRight } from "lucide-react";

export default function OrderConfirmationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlOrderNumber = searchParams.get('orderNumber');
    const [orderData, setOrderData] = useState<any>(null);
    const [searchOrderNumber, setSearchOrderNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrder = async (number: string, isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const res = await fetch(`/api/tracking/${number}`, { cache: 'no-store' });
            const data = await res.json();
            if (data.success) {
                setOrderData(data.order);
                setError(null);
                localStorage.setItem('lastOrder', JSON.stringify(data.order));
            } else {
                if (!isSilent) {
                    setError(data.error || 'Commande introuvable');
                    setOrderData(null);
                }
            }
        } catch (err) {
            if (!isSilent) setError('Erreur de connexion');
        } finally {
            if (!isSilent) setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            if (urlOrderNumber) {
                await fetchOrder(urlOrderNumber);
            } else {
                const lastOrder = localStorage.getItem('lastOrder');
                if (lastOrder) {
                    try {
                        const parsed = JSON.parse(lastOrder);
                        setOrderData(parsed);
                        // Refresh silently but ensure we turn off the initial loader
                        await fetchOrder(parsed.orderNumber || parsed.order?.orderNumber, true);
                    } catch (e) {
                        console.error("Error parsing local order", e);
                    } finally {
                        setLoading(false);
                    }
                } else {
                    setLoading(false);
                }
            }
        };
        init();
    }, [urlOrderNumber]);

    useEffect(() => {
        const activeNum = orderData?.orderNumber || orderData?.order?.orderNumber;
        if (!activeNum) return;

        // Optimization: Stop polling if order is finished (delivered or cancelled)
        // OR if it's a pickup and it's ready (as requested)
        const isPickupReady = orderData.orderType === 'pickup' && orderData.status === 'ready';
        const isFinished = orderData.status === 'delivered' || orderData.status === 'cancelled' || isPickupReady;

        if (isFinished) return;

        // Optimization: Higher frequency for active tracking (confirmed -> out_for_delivery)
        // Lower frequency for pending to save resources as requested
        const isPending = orderData.status === 'pending';
        const intervalTime = isPending ? 15000 : 5000;

        const interval = setInterval(() => {
            fetchOrder(activeNum, true);
        }, intervalTime);

        return () => clearInterval(interval);
    }, [orderData?.orderNumber, orderData?.status]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchOrderNumber.trim()) {
            fetchOrder(searchOrderNumber.trim().toUpperCase());
            setSearchOrderNumber('');
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'confirmed': return { label: 'Confirmée', sub: 'Votre commande est validée', color: 'bg-blue-500', text: 'text-blue-500', glow: 'shadow-blue-500/20' };
            case 'preparing': return { label: 'En Préparation', sub: 'Le chef prépare votre festin', color: 'bg-purple-500', text: 'text-purple-500', glow: 'shadow-purple-500/20' };
            case 'ready': return { label: 'Prête', sub: 'Votre commande vous attend', color: 'bg-teal-500', text: 'text-teal-500', glow: 'shadow-teal-500/20' };
            case 'out_for_delivery': return { label: 'En Livraison', sub: 'Le livreur est en route', color: 'bg-orange-500', text: 'text-orange-500', glow: 'shadow-orange-400/20' };
            case 'delivered': return { label: 'Livrée', sub: 'Bon appétit !', color: 'bg-green-500', text: 'text-green-500', glow: 'shadow-green-500/20' };
            case 'cancelled': return { label: 'Annulée', sub: 'Cette commande a été annulée', color: 'bg-red-500', text: 'text-red-500', glow: 'shadow-red-500/20' };
            default: return { label: 'Reçue', sub: 'En attente de validation', color: 'bg-yellow-400', text: 'text-yellow-400', glow: 'shadow-yellow-400/20' };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center group">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-yellow-400/20 blur-[40px] rounded-full group-hover:bg-yellow-400/40 transition-all duration-1000"></div>
                        <Loader2 className="w-16 h-16 text-yellow-400 animate-spin relative z-10 mx-auto" />
                    </div>
                    <p className="text-white font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Chargement...</p>
                </div>
            </div>
        );
    }

    if (error || !orderData) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden text-center">
                <div className="absolute top-0 inset-x-0 h-[500px] bg-red-500/5 blur-[120px] pointer-events-none"></div>
                <div className="max-w-xl w-full space-y-12 relative z-10">
                    <div className="w-24 h-24 bg-gray-900/50 border border-gray-800 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-3xl">
                        <Package className="w-10 h-10 text-gray-700" />
                    </div>
                    <div className="space-y-4 text-center items-center flex flex-col">
                        <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Oups !</h2>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
                            {error || "Nous n'avons pas trouvé de commande active. Entrez votre numéro pour vérifier."}
                        </p>
                    </div>
                    <form onSubmit={handleSearch} className="relative group max-w-md mx-auto">
                        <input
                            type="text"
                            value={searchOrderNumber}
                            onChange={(e) => setSearchOrderNumber(e.target.value)}
                            placeholder="MAT123456"
                            className="w-full bg-gray-900/40 border-2 border-gray-800 text-white pl-8 pr-16 py-6 rounded-3xl font-black uppercase text-xl tracking-[0.2em] focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-800 backdrop-blur-3xl"
                        />
                        <button type="submit" className="absolute right-4 top-4 bottom-4 aspect-square bg-yellow-400 text-gray-950 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-yellow-400/20">
                            <ArrowRight className="w-6 h-6 stroke-[3px]" />
                        </button>
                    </form>
                    <button onClick={() => router.push('/menu')} className="text-gray-600 hover:text-white font-black uppercase text-[10px] tracking-[0.3em] transition-all">Retourner au menu</button>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(orderData.status);
    const orderNumber = orderData?.orderNumber || '---';

    return (
        <div className="min-h-screen bg-black relative pb-24 selection:bg-yellow-400 selection:text-black">
            {/* Dynamic Background Glows */}
            <div className={`absolute top-0 inset-x-0 h-[800px] opacity-20 blur-[150px] pointer-events-none transition-all duration-1000 ${statusConfig.color}`}></div>



            <div className="max-w-7xl mx-auto px-6 pt-40 relative z-10">

                <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4 text-left items-start flex flex-col">
                        <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[10px]">Statut Commande • #{orderNumber}</p>
                        <h1 className="text-6xl md:text-9xl font-black text-white italic uppercase tracking-tighter leading-none flex flex-wrap gap-x-4">
                            {statusConfig.label}
                            <span className={statusConfig.text}>!</span>
                        </h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">{statusConfig.sub}</p>
                    </div>

                    <button
                        onClick={() => router.push('/menu')}
                        className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 px-10 py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-3xl shadow-yellow-400/10 active:scale-95 flex items-center justify-center gap-3 group shrink-0"
                    >
                        <Package className="w-5 h-5" />
                        <span className="italic uppercase font-black">Nouveau Panier</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start text-left">

                    {/* Left Side: Timeline (Live) */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-gray-900/40 rounded-[3rem] p-10 border border-white/5 backdrop-blur-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[60px] -mr-16 -mt-16"></div>

                            <h2 className="text-xl font-black text-white mb-10 flex items-center gap-4 uppercase italic tracking-widest relative z-10 text-left">
                                <Clock className="w-5 h-5 text-yellow-400" />
                                Suivi Détaillé
                            </h2>

                            <div className="relative pl-6 border-l-2 border-dashed border-gray-800 space-y-12 z-10 text-left">
                                {[
                                    { id: 'pending', label: 'Commande reçue', sub: 'Nous avons bien reçu votre demande', time: orderData.createdAt },
                                    { id: 'confirmed', label: 'Confirmée', sub: 'Commande validée par le restaurant', time: orderData.confirmedAt || (orderData.status === 'confirmed' ? orderData.updatedAt : null) },
                                    { id: 'preparing', label: 'En préparation', sub: 'Le chef prépare vos produits', time: orderData.preparingAt || (orderData.status === 'preparing' ? orderData.updatedAt : null) },
                                    { id: 'ready', label: 'Prête', sub: 'Commande prête à être récupérée/livrée', time: orderData.readyAt || (orderData.status === 'ready' ? orderData.updatedAt : null) },
                                    { id: 'out_for_delivery', label: 'En livraison', sub: 'Le livreur est en route vers vous', time: orderData.outForDeliveryAt || (orderData.status === 'out_for_delivery' ? orderData.updatedAt : null) },
                                    { id: 'delivered', label: 'Livrée', sub: 'Bon appétit !', time: orderData.deliveredAt || (orderData.status === 'delivered' ? orderData.updatedAt : null) }
                                ].filter(s => {
                                    if (orderData.status === 'cancelled') return s.id === 'pending' || s.id === 'cancelled';

                                    const sequence = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
                                    const currentIndex = sequence.indexOf(orderData.status);
                                    const stepIndex = sequence.indexOf(s.id);

                                    return stepIndex <= currentIndex || !!s.time;
                                }).concat(orderData.status === 'cancelled' || orderData.cancelledAt ? [{ id: 'cancelled', label: 'Annulée', sub: 'La commande a été annulée', time: orderData.cancelledAt || orderData.updatedAt }] : []).sort((a, b) => {
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

                        {/* Order Identity Card */}
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[3rem] p-10 text-gray-950 shadow-3xl shadow-yellow-400/10 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                            <Package className="absolute bottom-4 right-8 w-32 h-32 text-black/5 -mr-12 -mb-12 transform -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />

                            <div className="relative z-10 space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 opacity-70 italic whitespace-nowrap truncate">Identifiant Commande Unique</p>
                                <p className="text-5xl font-black tracking-tighter italic leading-none">#{orderNumber}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Details & Actions */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* Summary */}
                        <div className="bg-gray-900/40 rounded-[3rem] border border-white/5 backdrop-blur-3xl overflow-hidden">
                            <div className="p-10 pb-0">
                                <h2 className="text-xl font-black text-white mb-8 uppercase italic tracking-widest text-left">Détails Panier</h2>
                                <div className="space-y-6">
                                    {(Array.isArray(orderData.cart) ? orderData.cart : Object.values(orderData.cart || {})).map((cartItem: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center group">
                                            <div className="space-y-1 text-left">
                                                <p className="text-white font-bold text-sm uppercase tracking-wide flex items-center gap-3">
                                                    <span className="text-yellow-400 text-xs font-black">{cartItem.quantity}x</span>
                                                    {cartItem.item.name}
                                                </p>
                                                {cartItem.selectedSize && <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] ml-8">{cartItem.selectedSize}</p>}
                                            </div>
                                            <span className="text-white font-black text-sm italic">
                                                {((typeof cartItem.item.price === 'number' ? cartItem.item.price : cartItem.item.price[cartItem.selectedSize]) * cartItem.quantity).toFixed(1)} <span className="text-[9px] text-gray-700 not-italic">DT</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-10 p-10 bg-white/5 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-baseline gap-6 h-fit text-left">
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 italic">Montant Total</span>
                                    <div className="text-5xl font-black text-white italic tracking-tighter">
                                        {(orderData.totalAmount || orderData.finalTotal).toFixed(1)} <span className="text-sm not-italic text-yellow-400">DT</span>
                                    </div>
                                </div>
                                <div className="px-5 py-2 rounded-full border border-white/10 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                    <span className="text-gray-400 font-bold uppercase text-[9px] tracking-widest">Paiement à la réception</span>
                                </div>
                            </div>
                        </div>

                        {/* Recipient & Location */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-gray-900/40 p-10 rounded-[3rem] border border-white/5 backdrop-blur-3xl group">
                                <div className="flex gap-6 text-left">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-yellow-400/10 transition-colors">
                                        <MapPin className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-gray-600 font-black uppercase text-[9px] tracking-[0.3em]">Destination</p>
                                        <p className="text-white font-bold text-sm leading-tight italic">{orderData.deliveryInfo?.address}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-900/40 p-10 rounded-[3rem] border border-white/5 backdrop-blur-3xl group">
                                <div className="flex gap-6 text-left">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-yellow-400/10 transition-colors">
                                        <Phone className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-gray-600 font-black uppercase text-[9px] tracking-[0.3em]">Contact Direct</p>
                                        <p className="text-white font-bold text-sm tracking-widest font-mono">
                                            {orderData.deliveryInfo?.phone ? (orderData.deliveryInfo.phone.slice(0, 2) + '*'.repeat(orderData.deliveryInfo.phone.length - 4) + orderData.deliveryInfo.phone.slice(-1)) : '---'}
                                        </p>
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