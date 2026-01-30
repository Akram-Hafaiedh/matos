'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Package, Clock, CheckCircle2, Loader2, ArrowLeft, MapPin, Store, Shield } from 'lucide-react';
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

    useEffect(() => {
        // Fetch specific order by public endpoint
        fetch(`/api/tracking/${params.orderNumber}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setOrder(data.order);
                } else {
                    setError('Commande introuvable');
                }
                setLoading(false);
            })
            .catch(err => {
                setError('Erreur de connexion');
                setLoading(false);
            });
    }, [params.orderNumber]);

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

    const isPickup = order.deliveryFee === 0 && order.deliveryInfo?.address === 'Retrait sur Place';

    return (
        <div className="min-h-screen bg-black py-24 px-6 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <Link href="/tracking" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-4 transition-colors font-bold uppercase text-[10px] tracking-[0.2em] group">
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            Retour
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                            Statut <span className="text-yellow-400">Commande</span>
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

                <div className="grid md:grid-cols-5 gap-8">

                    {/* Main Content (3 cols) */}
                    <div className="md:col-span-3 space-y-8">

                        {/* Security Notice */}
                        <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-[2rem] flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                <Shield className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-blue-400 font-bold uppercase text-xs tracking-widest mb-1">Mode Public</p>
                                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wide leading-tight">
                                    Les informations personnelles (Nom, Téléphone) sont masquées pour votre sécurité.
                                </p>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="bg-gray-900/60 p-8 rounded-[2.5rem] border border-gray-800 backdrop-blur-xl">
                            <h2 className="text-xl font-black text-white mb-8 flex items-center gap-4 uppercase italic tracking-widest">
                                <Package className="w-5 h-5 text-yellow-400" />
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
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-gray-900/60 p-8 rounded-[2.5rem] border border-gray-800 backdrop-blur-xl">
                            <h2 className="text-xl font-black text-white mb-8 flex items-center gap-4 uppercase italic tracking-widest">
                                <Clock className="w-5 h-5 text-yellow-400" />
                                Suivi
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

                    {/* Sidebar (2 cols) */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Masked Info Card */}
                        <div className="bg-gray-900/60 p-8 rounded-[2.5rem] border border-gray-800 backdrop-blur-xl select-none relative overflow-hidden group">
                            {/* Privacy Pattern Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-4 uppercase italic tracking-widest relative z-10">
                                {isPickup ? <Store className="w-5 h-5 text-yellow-400" /> : <MapPin className="w-5 h-5 text-yellow-400" />}
                                {isPickup ? 'Retrait' : 'Livraison'}
                            </h2>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Destinataire</p>
                                    <p className="text-white font-bold text-sm blur-[0.5px] tracking-widest font-mono">
                                        {maskString(order.deliveryInfo.fullName, 'name')}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Téléphone</p>
                                    <p className="text-white font-bold text-sm blur-[0.5px] tracking-widest font-mono">
                                        {maskString(order.deliveryInfo.phone, 'phone')}
                                    </p>
                                </div>

                                {!isPickup && (
                                    <div>
                                        <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">Ville</p>
                                        <p className="text-white font-bold text-sm">{order.deliveryInfo.city}</p>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-800">
                                    <div className="bg-gray-950 px-4 py-2 rounded-lg border border-gray-800 inline-block">
                                        <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest">
                                            #{order.orderNumber}
                                        </span>
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
