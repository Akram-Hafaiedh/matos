'use client';

import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle2, Loader2, ArrowLeft, MapPin, Phone, CreditCard, ShoppingBag, Store, XCircle, Star, Target, Info, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { useSupportModal } from '@/hooks/useSupportModal';

const getStatusInfo = (status: string) => {
    switch (status) {
        case 'pending': return { label: 'COMMANDE REÇUE', color: 'bg-yellow-400', text: 'text-yellow-400', icon: Clock };
        case 'confirmed': return { label: 'CONFIRMÉE', color: 'bg-blue-500', text: 'text-blue-500', icon: CheckCircle2 };
        case 'preparing': return { label: 'PRÉPARATION', color: 'bg-purple-500', text: 'text-purple-500', icon: Loader2 };
        case 'ready': return { label: 'PRÊTE', color: 'bg-teal-500', text: 'text-teal-500', icon: Package };
        case 'out_for_delivery': return { label: 'EN LIVRAISON', color: 'bg-orange-500', text: 'text-orange-500', icon: Target };
        case 'delivered': return { label: 'LIVRÉE', color: 'bg-green-500', text: 'text-green-500', icon: CheckCircle2 };
        case 'cancelled': return { label: 'ANNULÉE', color: 'bg-red-500', text: 'text-red-500', icon: XCircle };
        default: return { label: 'INCONNU', color: 'bg-gray-500', text: 'text-gray-500', icon: Info };
    }
};

interface OrderDetailsViewProps {
    id: string;
    isModal?: boolean;
    onClose?: () => void;
}

export default function OrderDetailsView({ id, isModal, onClose }: OrderDetailsViewProps) {
    const { openSupportModal } = useSupportModal();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/orders/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setOrder(data.order);
                } else {
                    setError(data.error || 'COMMANDE INTROUVABLE');
                }
                setLoading(false);
            })
            .catch(err => {
                setError('ERREUR RÉSEAU');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-8">
                <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] animate-pulse italic">Chargement des détails...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-8 p-12">
                <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter">ERREUR <span className="text-red-500">DÉTECTÉE</span></h2>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] italic">{error || 'Cette commande n\'existe pas.'}</p>
                {!isModal && (
                    <Link href="/account/orders" className="bg-white/5 border border-white/10 px-10 py-5 rounded-2xl text-yellow-400 hover:text-white hover:bg-white/10 transition-all font-black uppercase tracking-[0.2em] text-[10px] italic">
                        RETOUR AUX COMMANDES
                    </Link>
                )}
            </div>
        );
    }

    const isPickup = (order.order_type === 'pickup') || (order.delivery_fee === 0 && order.delivery_info?.address === 'Retrait sur Place');
    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;

    return (
        <div className={`w-full space-y-12 relative text-left ${isModal ? 'pb-8' : 'pb-20'}`}>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        {!isModal ? (
                            <Link href="/account/orders" className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 transition-colors group">
                                <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:-translate-x-1 transition-all" />
                            </Link>
                        ) : (
                            <button onClick={onClose} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 transition-colors group">
                                <X className="w-4 h-4 text-gray-400 group-hover:text-white transition-all" />
                            </button>
                        )}
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic leading-none">Détails de Commande</span>
                    </div>
                    <h1 className={`${isModal ? 'text-3xl' : 'text-5xl'} font-[1000] text-white uppercase italic tracking-tighter leading-none`}>
                        COMMANDE <span className="text-yellow-400">#{order.order_number}</span>
                    </h1>
                </div>

                <div className={`px-8 py-4 rounded-2xl border backdrop-blur-xl flex items-center gap-4 transition-all duration-500 ${order.status === 'delivered' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                    order.status === 'cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                        'bg-yellow-400/10 border-yellow-400/20 text-yellow-400'
                    }`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${order.status === 'delivered' ? 'bg-green-500/20' :
                        order.status === 'cancelled' ? 'bg-red-500/20' :
                            'bg-yellow-400/20'
                        }`}>
                        <StatusIcon className={`w-4 h-4 ${order.status === 'delivered' || order.status === 'cancelled' ? '' : 'animate-pulse'}`} />
                    </div>
                    <span className="font-[1000] uppercase text-[10px] tracking-[0.3em] italic">{statusInfo.label}</span>
                </div>
            </div>

            <div className={`mx-auto space-y-12 ${isModal ? 'max-w-none' : 'w-full'}`}>
                {/* Details Section */}
                <div className={`grid ${isModal ? 'grid-cols-1' : 'lg:grid-cols-3'} gap-8`}>
                    <div className={`${isModal ? '' : 'lg:col-span-2'} space-y-8`}>
                        {/* Summary Card */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] italic leading-none">Destinataire</p>
                                    <h3 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter leading-none">{order.delivery_info.full_name}</h3>
                                    <p className="text-yellow-400/60 font-black text-xs tracking-widest flex items-center gap-2">
                                        <Phone size={12} /> {order.delivery_info.phone}
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 text-gray-500">
                                    {isPickup ? <Store size={24} /> : <MapPin size={24} />}
                                </div>
                            </div>

                            {!isPickup && (
                                <div className="space-y-3 pt-6 border-t border-white/5">
                                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] italic leading-none">Adresse de Livraison</p>
                                    <p className="text-gray-300 font-bold text-sm leading-relaxed uppercase italic">
                                        {order.delivery_info.address}, <span className="text-gray-500">{order.delivery_info.city}</span>
                                    </p>
                                </div>
                            )}

                            {order.delivery_info.notes && (
                                <div className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl">
                                    <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.4em] mb-2 italic">Note client</p>
                                    <p className="text-gray-500 italic text-xs font-bold leading-relaxed">"{order.delivery_info.notes}"</p>
                                </div>
                            )}
                        </div>

                        {/* Manifest Card */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
                            <h2 className="text-xl font-[1000] text-white mb-8 flex items-center gap-4 uppercase italic tracking-tighter">
                                <ShoppingBag className="w-5 h-5 text-yellow-400" />
                                Détails des Articles
                            </h2>
                            <div className="space-y-4">
                                {order.cart.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 px-4">
                                        <div className="flex items-center gap-6">
                                            <div className="w-8 h-8 bg-black rounded-lg border border-white/5 flex items-center justify-center font-[1000] text-yellow-400 text-xs italic">
                                                {item.quantity}X
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-white font-[1000] uppercase text-sm italic tracking-tight">{item.item_name}</p>
                                                {item.selected_size && <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.2em] italic">{item.selected_size}</p>}
                                            </div>
                                        </div>
                                        <div className="text-white font-[1000] text-base italic">
                                            {(item.item_price * item.quantity).toFixed(1)} <span className="text-[9px] opacity-20 not-italic uppercase ml-1">DT</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Totals Card */}
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 space-y-8">
                            <h2 className="text-lg font-[1000] text-white uppercase italic tracking-tighter flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-yellow-400" />
                                Récapitulatif
                            </h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black text-gray-700 uppercase tracking-widest italic">
                                    <span>SOUS-TOTAL</span>
                                    <span className="text-white">{order.subtotal.toFixed(1)} DT</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black text-gray-700 uppercase tracking-widest italic">
                                    <span>LIVRAISON</span>
                                    <span className="text-white">{order.delivery_fee === 0 ? 'OFFERTE' : `${order.delivery_fee.toFixed(1)} DT`}</span>
                                </div>
                                <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                                    <span className="text-[9px] font-black text-yellow-400/40 uppercase tracking-[0.4em] italic mb-1">TOTAL</span>
                                    <div className="text-4xl font-[1000] text-white italic tracking-tighter leading-none">
                                        {order.total_amount.toFixed(1)} <span className="text-[12px] opacity-20 not-italic ml-1">DT</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 text-center">
                                <p className="text-[8px] font-black text-gray-800 uppercase tracking-[0.4em] italic">
                                    Paiement: {order.payment_method === 'cash' ? 'ESPÈCES' : order.payment_method.toUpperCase()}
                                </p>
                            </div>
                        </div>

                        {/* Support Link */}
                        <button
                            onClick={() => openSupportModal({
                                module: 'orders',
                                orderId: order.id.toString(),
                                subject: `Assistance Commande #${order.order_number}`,
                                description: `J'ai besoin d'aide concernant ma commande #${order.order_number} du ${new Date(order.created_at).toLocaleDateString('fr-FR')}.`
                            })}
                            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black p-6 rounded-2xl transition-all group text-center"
                        >
                            <p className="text-black font-black uppercase text-[9px] tracking-[0.2em] italic mb-1 opacity-60">Besoin d'aide ?</p>
                            <p className="font-[1000] uppercase italic tracking-tighter flex items-center justify-center gap-2">
                                CONTACTER LE SUPPORT <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </p>
                        </button>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-10">
                    <h2 className="text-xl font-[1000] text-white mb-12 flex items-center gap-4 uppercase italic tracking-tighter">
                        <Clock className="w-5 h-5 text-yellow-400" />
                        État d'Avancement
                    </h2>

                    <div className="relative pl-10 border-l border-white/5 space-y-12">
                        {[
                            { id: 'pending', label: 'COMMANDE ENREGISTRÉE', time: order.created_at },
                            { id: 'confirmed', label: 'CONFIRMÉE', time: order.confirmed_at },
                            { id: 'preparing', label: 'EN PRÉPARATION', time: order.preparing_at },
                            { id: 'ready', label: 'PRÊTE', time: order.ready_at },
                            { id: 'out_for_delivery', label: isPickup ? 'DISPONIBLE AU RETRAIT' : 'EN COURS DE LIVRAISON', time: order.out_for_delivery_at },
                            { id: 'delivered', label: isPickup ? 'RÉCUPÉRÉE' : 'LIVRÉE AVEC SUCCÈS', time: order.delivered_at },
                            { id: 'cancelled', label: 'COMMANDE ANNULÉE', time: order.cancelled_at }
                        ].filter(step => step.time).map((step, idx, arr) => {
                            const isLast = idx === arr.length - 1;
                            return (
                                <div key={idx} className="relative">
                                    <div className={`absolute -left-[49px] top-1 w-4 h-4 rounded-full border-4 border-[#050505] transition-colors ${isLast ? 'bg-yellow-400' : 'bg-gray-800'}`}></div>
                                    <div className="space-y-1">
                                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic">
                                            {new Date(step.time).toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                                        </p>
                                        <p className={`font-[1000] text-base uppercase italic tracking-tighter ${isLast ? 'text-white' : 'text-gray-600'}`}>
                                            {step.label}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {order.status === 'cancelled' && order.cancel_message && (
                        <div className="mt-10 p-6 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-5">
                            <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-red-500 font-extrabold uppercase text-[8px] tracking-[0.3em] italic">Motif de l'annulation</p>
                                <p className="text-gray-500 font-bold text-sm italic leading-relaxed">"{order.cancel_message}"</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
