'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Package, Clock, CheckCircle2, Loader2, XCircle, MapPin, Shield, User, ArrowRight, Sparkles, Navigation, Target, ShoppingBag, FileText } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '../../../context/ToastContext';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic import for the Map to avoid SSR issues
const MissionMap = dynamic(() => import('@/components/MissionMap'), {
    ssr: false,
    loading: () => <div className="w-full h-[400px] bg-[#0a0a0a] rounded-[3rem] animate-pulse flex items-center justify-center font-black text-gray-800 uppercase italic tracking-widest text-[10px]">Initialisation GPS...</div>
});

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
        }, 8000);

        return () => clearInterval(interval);
    }, [order?.orderNumber, order?.status, prevStatus]);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'confirmed': return { label: 'Confirmée', sub: 'Validation confirmée', color: '#fbbf24', icon: CheckCircle2, progress: 20 };
            case 'preparing': return { label: 'En Cuisine', sub: 'Préparation artisanale', color: '#fbbf24', icon: Loader2, progress: 40 };
            case 'ready': return { label: 'Prête', sub: 'Prête à l\'envoi', color: '#fbbf24', icon: Package, progress: 70 };
            case 'out_for_delivery': return { label: 'En Route', sub: 'Livreur en approche', color: '#3b82f6', icon: MapPin, progress: 90 };
            case 'delivered': return { label: 'Livrée', sub: 'Bon appétit !', color: '#22c55e', icon: CheckCircle2, progress: 100 };
            case 'cancelled': return { label: 'Annulée', sub: 'Commande annulée', color: '#ef4444', icon: XCircle, progress: 0 };
            default: return { label: 'Reçue', sub: 'Attente validation', color: '#fbbf24', icon: Clock, progress: 5 };
        }
    };

    // Helper for live countdown
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    useEffect(() => {
        if (!order?.estimates?.totalTime || order.status === 'delivered' || order.status === 'cancelled') {
            setTimeLeft(null);
            return;
        }

        const calculateTimeLeft = () => {
            const start = new Date(order.createdAt).getTime();
            const now = new Date().getTime();
            const elapsedMins = Math.floor((now - start) / 60000);
            const remaining = Math.max(0, order.estimates.totalTime - elapsedMins);
            setTimeLeft(remaining);
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, [order?.estimates, order?.status, order?.createdAt]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-16 h-16 border-4 border-yellow-400/10 border-t-yellow-400 rounded-full"
                />
                <p className="font-[1000] text-white uppercase italic tracking-widest text-[10px] animate-pulse">Initialisation Radar...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center p-10">
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
                <Link href="/track" className="bg-yellow-400 text-black px-12 py-6 rounded-2xl font-[1000] uppercase text-[10px] tracking-[0.4em] transition-all hover:bg-yellow-300 active:scale-95 italic">
                    Retour au Suivi
                </Link>
            </div>
        );
    }

    const statusConfig = getStatusConfig(order.status);

    return (
        <div className="min-h-screen bg-[#050505] relative pb-32 pt-40 overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-[800px] bg-gradient-to-b from-yellow-400/5 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

                {/* Tactical Status Header */}
                <header className="mb-24 space-y-16">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-yellow-400/5 border border-yellow-400/20">
                                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                                <p className="text-yellow-400 font-black uppercase tracking-[0.4em] text-[10px] italic">#{order.orderNumber} • Mission Live</p>
                            </div>

                            <h1 className="text-6xl md:text-[8rem] font-[1000] italic uppercase tracking-tighter text-white leading-[0.85] mix-blend-screen">
                                {statusConfig.label}
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white/40 to-white/5">Status</span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-10 rounded-[3rem] min-w-[320px] shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 blur-[80px] pointer-events-none group-hover:bg-yellow-400/10 transition-colors duration-1000" />
                            <div className="relative z-10 space-y-4">
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] italic leading-tight">Total Mission</p>
                                <div className="flex items-center gap-4">
                                    <Target className="w-6 h-6 text-yellow-400" />
                                    <p className="text-3xl font-[1000] text-white italic tracking-tighter uppercase leading-none">{order.totalAmount.toFixed(1)} <span className="text-sm not-italic text-yellow-400">DT</span></p>
                                </div>
                                <div className="inline-flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-widest italic bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                    <Shield className="w-3.5 h-3.5 text-blue-400" /> Garanti Matos HQ
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Kinetic Progress Bar */}
                    <div className="relative">
                        <div className="absolute inset-0 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${statusConfig.progress}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="absolute inset-0 bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                            />
                        </div>
                        <div className="pt-8 flex justify-between">
                            {[
                                { id: 'confirmed', label: 'Briefing', icon: CheckCircle2 },
                                { id: 'preparing', label: 'Opérations', icon: Loader2, animate: true },
                                { id: 'ready', label: 'Extraction', icon: Package },
                                { id: 'out_for_delivery', label: 'Déploiement', icon: Navigation, animate: order.status === 'out_for_delivery' },
                                { id: 'delivered', label: 'Objectif Atteint', icon: Target }
                            ].map((step, idx) => {
                                const sequence = ['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
                                const currentIndex = sequence.indexOf(order.status);
                                const stepIndex = sequence.indexOf(step.id);
                                const isPast = stepIndex < currentIndex;
                                const isCurrent = stepIndex === currentIndex;

                                return (
                                    <div key={step.id} className="flex flex-col items-center gap-4 group">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-700 ${isCurrent ? 'bg-yellow-400 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.3)]' :
                                            isPast ? 'bg-white/5 border-yellow-400/20 text-yellow-400' :
                                                'bg-white/[0.02] border-white/5 text-gray-800'
                                            }`}>
                                            <step.icon size={20} className={step.animate && isCurrent ? 'animate-spin' : ''} />
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${isCurrent ? 'text-white' : 'text-gray-700'}`}>{step.label}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-16 md:gap-24">

                    {/* Left Column: Mission Map & Details */}
                    <div className="lg:col-span-8 space-y-16">
                        {/* Interactive Mission Map */}
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] italic flex items-center gap-4">
                                    <Navigation className="w-4 h-4" /> Radar Tactique (BETA)
                                </h3>
                            </div>
                            <MissionMap
                                status={order.status}
                                orderNumber={order.orderNumber}
                                lat={order.deliveryInfo?.lat}
                                lng={order.deliveryInfo?.lng}
                                distance={order.estimates?.travelTime ? order.estimates.totalTime > 0 ? (order.estimates.travelTime / 3) : 0 : null}
                                timeLeft={timeLeft}
                            />
                        </div>

                        {/* Order Passport Detail */}
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3.5rem] p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                                <Sparkles className="w-64 h-64 text-yellow-400" />
                            </div>

                            <div className="relative z-10 space-y-12">
                                <div className="flex flex-col md:flex-row justify-between gap-12">
                                    <div className="space-y-6 flex-1">
                                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic">Coordonnées Destination</p>
                                        <div className="flex items-start gap-6">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                                                <MapPin className="w-5 h-5 text-yellow-400" />
                                            </div>
                                            <p className="text-2xl font-[1000] text-white italic uppercase tracking-tighter leading-tight max-w-sm">{order.deliveryInfo?.address || '---'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6 flex-1">
                                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic">Personnel Assigné</p>
                                        <div className="flex items-start gap-6">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                                                <User className="w-5 h-5 text-yellow-400" />
                                            </div>
                                            <div>
                                                <p className="text-xl font-[1000] text-white italic uppercase tracking-tighter leading-none">{maskString(order.deliveryInfo?.fullName, 'name')}</p>
                                                <p className="text-xs font-black text-gray-600 uppercase tracking-[0.3em] italic mt-2">{maskString(order.deliveryInfo?.phone, 'phone')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-12 border-t border-white/5 grid md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic">Mode de Paiement</p>
                                        <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/5 inline-flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">{order.paymentMethod === 'cash' ? 'CASH • RÈGLEMENT À LA RÉCEPTION' : order.paymentMethod}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 text-left md:text-right">
                                        <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic">Canal de Support</p>
                                        <Link href="/contact" className="inline-flex items-center gap-4 text-white hover:text-yellow-400 transition-all font-black uppercase italic text-[10px] tracking-widest group">
                                            Fréquence Support Mato's
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Mission Chronology & Summary */}
                    <div className="lg:col-span-4 space-y-16">
                        {/* High-Fidelity Chronology */}
                        <div className="space-y-10">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] italic flex items-center gap-4">
                                    <Clock className="w-4 h-4" /> Rapport de Mission
                                </h4>

                                {order.estimates && order.status !== 'delivered' && order.status !== 'cancelled' && (
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${order.estimates.confidence === 'high' ? 'bg-green-500' :
                                            order.estimates.confidence === 'medium' ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
                                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest italic">SIGNAL {order.estimates.confidence === 'high' ? 'FORT' : order.estimates.confidence === 'medium' ? 'STABLE' : 'FAIBLE'}</span>
                                    </div>
                                )}
                            </div>

                            {order.estimates && order.status !== 'delivered' && order.status !== 'cancelled' && (
                                <div className="bg-yellow-400/5 border border-yellow-400/10 rounded-2xl p-6 space-y-2">
                                    <p className="text-[9px] font-black text-yellow-400/60 uppercase tracking-widest italic">Arrivée estimée</p>
                                    <p className="text-2xl font-[1000] text-yellow-400 italic uppercase tracking-tighter">
                                        {order.estimates.range.min}-{order.estimates.range.max} <span className="text-xs">MINUTES</span>
                                    </p>
                                </div>
                            )}

                            <div className="space-y-10 pl-5 border-l border-white/5">
                                {[
                                    { id: 'delivered', label: 'Livraison Terminée', time: order.deliveredAt },
                                    { id: 'out_for_delivery', label: 'Signal GPS Actif', time: order.outForDeliveryAt },
                                    { id: 'ready', label: 'Cargo Prêt à l\'envoi', time: order.readyAt },
                                    { id: 'preparing', label: 'Opérations en Cuisine', time: order.preparingAt },
                                    { id: 'confirmed', label: 'Mission Validée', time: order.confirmedAt },
                                    { id: 'pending', label: 'Réception du Signal', time: order.createdAt }
                                ].filter(s => s.time).map((step, idx) => (
                                    <motion.div
                                        key={step.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="relative"
                                    >
                                        <div className="absolute -left-[22px] top-1.5 w-2.5 h-2.5 rounded-full bg-yellow-400 ring-4 ring-[#050505] shadow-[0_0_15px_rgba(250,204,21,0.3)]" />
                                        <div className="flex flex-col gap-1">
                                            <p className="text-sm font-[1000] text-white italic uppercase tracking-tight">{step.label}</p>
                                            <span className="text-[9px] font-black text-gray-700 italic">{new Date(step.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} • MISSION LOG</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Cargo Summary */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-8 relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 p-8 opacity-5">
                                <ShoppingBag className="w-32 h-32" />
                            </div>
                            <h4 className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic">Manifeste de Cargo</h4>
                            <div className="space-y-6">
                                {order.cart?.slice(0, 4).map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-[1000] text-yellow-400 italic">{item.quantity}×</span>
                                            <p className="text-xs font-black text-white italic uppercase tracking-tight truncate max-w-[150px]">{item.item.name}</p>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-700 italic">{(item.item.price * item.quantity).toFixed(0)} DT</span>
                                    </div>
                                ))}
                                {order.cart?.length > 4 && (
                                    <p className="text-[9px] font-black text-gray-800 uppercase italic text-center pt-4 tracking-[0.3em]">+{order.cart.length - 4} AUTRES UNITÉS SÉCURISÉES</p>
                                )}
                            </div>
                        </div>

                        {/* Secondary Action */}
                        <button
                            onClick={() => window.open(`/track/${order.orderNumber}/invoice`, '_blank')}
                            className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-white/10 active:scale-95 transition-all shadow-xl group"
                        >
                            <FileText className="w-4 h-4 text-zinc-500 group-hover:text-yellow-400 transition-colors" />
                            Télécharger la Facture
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
