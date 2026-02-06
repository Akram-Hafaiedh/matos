'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Package, Clock, CheckCircle2, Loader2, Search, XCircle, MapPin, Store, Shield, User, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

// Masking helper function
const maskString = (str: string, type: 'name' | 'phone') => {
    if (!str) return '***';
    if (type === 'phone') {
        return str.length > 3 ? `${str.slice(0, 2)} *** **${str.slice(-1)}` : '***';
    }
    return str.split(' ').map(part => part.length > 2 ? `${part[0]}${part[1]}***` : '***').join(' ');
};

export default function PublicOrderDetailsPage() {
    const params = useParams();
    const [order, setOrder] = useState<any>(null);
    const [prevStatus, setPrevStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchOrder = async (number: string, isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const res = await fetch(`/api/tracking/${number}`, { cache: 'no-store' });
            const data = await res.json();
            if (data.success) {
                if (prevStatus && prevStatus !== data.order.status) {
                    const config = getStatusConfig(data.order.status);
                    toast.info(`Mise à jour: Votre commande est maintenant ${config.label.toLowerCase()} !`);
                }
                setOrder(data.order);
                setPrevStatus(data.order.status);
                setError(null);
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
        if (!activeNum || order.status === 'delivered' || order.status === 'cancelled') return;

        const interval = setInterval(() => {
            fetchOrder(activeNum, true);
        }, 8000); // Polling every 8s for production stability

        return () => clearInterval(interval);
    }, [order?.orderNumber, order?.status, prevStatus]);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'confirmed': return { label: 'Confirmée', sub: 'Validation confirmée', color: '#3b82f6', icon: CheckCircle2, progress: 20 };
            case 'preparing': return { label: 'Cuisine', sub: 'Préparation artisanale', color: '#a855f7', icon: Loader2, progress: 40 };
            case 'ready': return { label: 'Prête', sub: 'Prêt à l\'envoi', color: '#14b8a6', icon: Package, progress: 70 };
            case 'out_for_delivery': return { label: 'Route', sub: 'Livreur en approche', color: '#f59e0b', icon: MapPin, progress: 90 };
            case 'delivered': return { label: 'Livrée', sub: 'Bon appétit !', color: '#22c55e', icon: CheckCircle2, progress: 100 };
            case 'cancelled': return { label: 'Annulée', sub: 'Commande annulée', color: '#ef4444', icon: XCircle, progress: 0 };
            default: return { label: 'Reçue', sub: 'Attente validation', color: '#eab308', icon: Clock, progress: 5 };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-transparent flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-12 h-12 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full"
                />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-center p-10">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 border border-white/10"
                >
                    <Package className="w-10 h-10 text-gray-700" />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-[1000] text-white mb-6 uppercase italic tracking-tighter">Commande Introuvable</h2>
                <p className="text-gray-500 mb-12 max-w-sm uppercase text-[10px] font-black tracking-[0.3em] leading-relaxed italic">
                    Le numéro <span className="text-white">#{params.orderNumber}</span> n'est pas répertorié.
                </p>
                <Link href="/track" className="bg-white text-black px-12 py-6 rounded-2xl font-[1000] uppercase text-[10px] tracking-[0.4em] transition-all hover:bg-yellow-400 active:scale-95 italic">
                    Retour au Suivi
                </Link>
            </div>
        );
    }

    const statusConfig = getStatusConfig(order.status);
    const isPickup = order.orderType === 'pickup';
    const isFinished = order.status === 'delivered' || order.status === 'cancelled';

    return (
        <div className="min-h-screen bg-transparent relative pb-32 pt-40">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* Cinematic Header */}
                <header className="mb-32 flex flex-col items-center gap-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-yellow-400/5 border border-yellow-400/20 mx-auto">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                            <p className="text-yellow-400 font-black uppercase tracking-[0.4em] text-[10px] italic">#{order.orderNumber} • Live Tracking</p>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-16 bg-yellow-400/15 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <div className="relative bg-yellow-400 py-8 px-12 md:px-20 -rotate-1 hover:rotate-0 transition-all duration-700 shadow-[0_0_80px_rgba(250,204,21,0.15)]">
                                <h1 className="text-5xl md:text-[9rem] font-[1000] italic uppercase tracking-tighter text-black leading-none inline-block pr-[0.4em]">
                                    {statusConfig.label}
                                </h1>
                            </div>
                        </div>

                        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[11px] italic pt-8">{statusConfig.sub}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row gap-4"
                    >
                        <Link href="/track" className="bg-white/5 hover:bg-white/10 border border-white/5 px-10 py-5 rounded-2xl flex items-center justify-center gap-4 transition-all group backdrop-blur-xl shrink-0">
                            <Search className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                            <span className="text-white font-black text-[10px] uppercase tracking-[0.2em] italic">Search Order</span>
                        </Link>
                        <div className="bg-blue-500/5 border border-blue-500/10 p-5 rounded-2xl flex items-center gap-4 shrink-0">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <p className="text-gray-500 text-[8px] uppercase font-black tracking-widest italic pr-4">Authenticité Garanti</p>
                        </div>
                    </motion.div>
                </header>

                {/* Status Visualizer */}
                <section className="mb-24">
                    <div className="relative h-2 bg-white/5 rounded-full overflow-hidden mb-12">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${statusConfig.progress}%` }}
                            transition={{ duration: 2, ease: "circOut" }}
                            className="absolute inset-0 bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                        />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
                        {[
                            { id: 'confirmed', label: 'Confirmée', icon: CheckCircle2 },
                            { id: 'preparing', label: 'En Cuisine', icon: Loader2 },
                            { id: 'ready', label: 'Prête', icon: Package },
                            { id: 'out_for_delivery', label: isPickup ? 'En Attente' : 'En Route', icon: isPickup ? Store : MapPin },
                            { id: 'delivered', label: isFinished ? 'Finalisée' : 'Arrivée', icon: CheckCircle2 }
                        ].map((step, idx) => {
                            const sequence = ['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
                            const currentIndex = sequence.indexOf(order.status);
                            const stepIndex = sequence.indexOf(step.id);
                            const isPast = stepIndex < currentIndex;
                            const isCurrent = stepIndex === currentIndex;

                            return (
                                <div key={step.id} className={`space-y-4 px-6 py-8 rounded-3xl border transition-all duration-700 ${isCurrent ? 'bg-yellow-400/5 border-yellow-400/20 shadow-2xl' : 'bg-[#0a0a0a] border-white/5 opacity-40'
                                    }`}>
                                    <step.icon className={`w-6 h-6 ${isCurrent || isPast ? 'text-yellow-400' : 'text-gray-700'}`} />
                                    <div>
                                        <p className="text-white font-[1000] italic uppercase tracking-tighter text-sm">{step.label}</p>
                                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic mt-1">
                                            {isPast ? 'Terminé' : isCurrent ? 'En cours' : 'À venir'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className="grid lg:grid-cols-12 gap-16">
                    {/* Activity Feed */}
                    <div className="lg:col-span-4 space-y-12">
                        <div className="space-y-8">
                            <h2 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] italic flex items-center gap-3">
                                <Clock className="w-3.5 h-3.5" /> Chronologie
                            </h2>
                            <div className="space-y-10 pl-4 border-l border-white/5">
                                {[
                                    { id: 'pending', label: 'Enregistrée', time: order.createdAt },
                                    { id: 'confirmed', label: 'Confirmée', time: order.confirmedAt },
                                    { id: 'preparing', label: 'En Cuisine', time: order.preparingAt },
                                    { id: 'ready', label: 'Prête', time: order.readyAt },
                                    { id: 'out_for_delivery', label: 'Expédiée', time: order.outForDeliveryAt },
                                    { id: 'delivered', label: 'Finalisée', time: order.deliveredAt }
                                ].filter(s => s.time).reverse().map((step, idx) => (
                                    <motion.div
                                        key={step.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="relative"
                                    >
                                        <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-yellow-400 ring-4 ring-black" />
                                        <div className="flex justify-between items-baseline gap-4">
                                            <p className="text-sm font-[1000] text-white italic uppercase tracking-tight">{step.label}</p>
                                            <span className="text-[9px] font-black text-gray-700 italic">{new Date(step.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Order Passport Badge */}
                        <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[3rem] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-yellow-400 shadow-[inset_0_0_100px_rgba(250,204,21,0.03)]" />
                            <Package className="absolute bottom-[-10%] right-[-10%] w-48 h-48 text-yellow-400/5 -rotate-12 transition-transform duration-1000 group-hover:rotate-0" />
                            <div className="relative z-10 space-y-6">
                                <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] italic leading-tight">Authenticité Matos</p>
                                <div className="space-y-1">
                                    <p className="text-4xl font-[1000] text-white italic tracking-tighter uppercase leading-none truncate">#{order.orderNumber}</p>
                                    <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest italic">{isPickup ? 'Retrait sur place' : 'Livraison Gourmet'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Basket Items */}
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3.5rem] p-12 relative overflow-hidden">
                            <h2 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] italic mb-12">Votre Sélection</h2>
                            <div className="divide-y divide-white/[0.03]">
                                {order.cart.map((item: any, idx: number) => (
                                    <div key={idx} className="py-8 first:pt-0 last:pb-0 flex justify-between items-center group">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-6">
                                                <span className="text-2xl font-[1000] text-yellow-400 italic leading-none">{item.quantity}×</span>
                                                <p className="text-xl font-[1000] text-white italic uppercase tracking-tight leading-none group-hover:text-yellow-400 transition-colors uppercase">{item.item.name}</p>
                                            </div>
                                            {item.selectedSize && (
                                                <p className="ml-14 text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] italic">{item.selectedSize}</p>
                                            )}
                                        </div>
                                        <p className="text-xl font-[1000] text-white italic tracking-tighter">
                                            {(item.item.price * item.quantity).toFixed(1)} <span className="text-[10px] text-gray-800 not-italic">DT</span>
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Sum */}
                            <div className="mt-16 pt-16 border-t border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic leading-tight">Montant Prestige</p>
                                        <p className="text-7xl font-[1000] text-white italic tracking-tighter leading-none">
                                            {order.totalAmount.toFixed(1)}<span className="text-2xl text-yellow-400 ml-3">DT</span>
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">{order.paymentMethod === 'cash' ? 'Cash à l\'arrivée' : order.paymentMethod}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/contact"
                                    className="px-10 py-6 border border-white/10 bg-white/5 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all italic flex items-center justify-between min-w-[280px]"
                                >
                                    <span>Support Dédié</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        {/* Destination & Profile */}
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[3rem] space-y-8">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                    {isPickup ? <Store className="w-5 h-5 text-yellow-400" /> : <MapPin className="w-5 h-5 text-yellow-400" />}
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] italic">Destination</p>
                                    <p className="text-white font-[1000] text-lg italic uppercase tracking-tight leading-tight">{order.deliveryInfo.address}</p>
                                </div>
                            </div>
                            <div className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[3rem] space-y-8">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                    <User className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] italic">Client</p>
                                        <p className="text-white font-black text-xs uppercase tracking-widest italic">{maskString(order.deliveryInfo.fullName, 'name')}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] italic">Contact</p>
                                        <p className="text-white font-black text-xs uppercase tracking-widest italic">{maskString(order.deliveryInfo.phone, 'phone')}</p>
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
