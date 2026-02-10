'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
    Calendar, Clock, Users, MapPin,
    ChevronLeft, Loader2, AlertCircle,
    CheckCircle2, XCircle, Timer, Info,
    Search, CalendarDays, Plus
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import TacticalAura from '@/components/TacticalAura';

export default function UserReservationsPage() {
    const { data: session } = useSession();
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);

    useEffect(() => {
        if (session) {
            fetchReservations();
        }
    }, [session, statusFilter, page]);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                status: statusFilter,
                limit: '6'
            });
            const res = await fetch(`/api/reservations?${queryParams.toString()}`);
            const data = await res.json();
            if (data.success) {
                setReservations(data.reservations || []);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusDetails = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return {
                label: 'Confirmée',
                color: 'text-green-400 bg-green-400/10 border-green-400/20',
                icon: CheckCircle2
            };
            case 'cancelled': return {
                label: 'Annulée',
                color: 'text-red-400 bg-red-400/10 border-red-400/20',
                icon: XCircle
            };
            case 'completed': return {
                label: 'Terminée',
                color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
                icon: CheckCircle2
            };
            case 'pending': return {
                label: 'En attente',
                color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
                icon: Timer
            };
            default: return {
                label: status,
                color: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
                icon: Info
            };
        }
    };

    if (loading && reservations.length === 0) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
            <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] italic">Synchronisation du Registre Chronologique...</p>
        </div>
    );

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-700 pb-24">
            <TacticalAura opacity={0.3} />

            {/* Header Area */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 border-b border-white/5 pb-16">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400/10 rounded-2xl flex items-center justify-center border border-yellow-400/20">
                            <CalendarDays size={18} className="text-yellow-400" />
                        </div>
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic leading-none">Temporal Planning Unit</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none">
                        VOS <span className="text-yellow-400">RÉSERVATIONS</span>
                    </h1>
                </div>

                <Link
                    href="/account/reservations/new"
                    className="bg-yellow-400 hover:bg-white text-black px-12 py-6 rounded-[2rem] font-[1000] uppercase text-[11px] tracking-[0.3em] italic hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4"
                >
                    <Plus size={20} strokeWidth={3} />
                    Nouvelle Mission
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                {[
                    { val: 'all', label: 'Toutes' },
                    { val: 'pending', label: 'En attente' },
                    { val: 'confirmed', label: 'Confirmées' },
                    { val: 'cancelled', label: 'Annulées' }
                ].map((s) => (
                    <button
                        key={s.val}
                        onClick={() => { setStatusFilter(s.val); setPage(1); }}
                        className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic border transition-all duration-500 ${statusFilter === s.val
                            ? 'bg-yellow-400 border-yellow-400 text-black shadow-[0_0_25px_rgba(250,204,21,0.2)]'
                            : 'bg-white/[0.02] border-white/5 text-gray-600 hover:text-white hover:border-white/10'
                            }`}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {loading && reservations.length > 0 ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                    <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic">Updating Registry...</p>
                </div>
            ) : reservations.length === 0 ? (
                <div className="text-center py-32 bg-white/[0.01] rounded-[4rem] border border-white/5 border-dashed relative overflow-hidden">
                    <div className="w-24 h-24 bg-white/[0.02] rounded-[2.5rem] border border-white/5 flex items-center justify-center mx-auto mb-8 text-gray-800">
                        <Calendar size={40} />
                    </div>
                    <h3 className="text-3xl font-[1000] text-gray-800 uppercase italic tracking-tighter mb-4">Registre Vide</h3>
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] px-4 italic">Aucune donnée temporelle détectée pour ce secteur.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
                    {reservations.map((res, idx) => {
                        const status = getStatusDetails(res.status);
                        const StatusIcon = status.icon;
                        const date = new Date(res.reservation_date);

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={res.id}
                                className="group bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-10 space-y-10 relative overflow-hidden hover:border-yellow-400/30 transition-all duration-1000 shadow-3xl flex flex-col justify-between min-h-[400px]"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/[0.01] blur-[100px] -mr-32 -mt-32 group-hover:bg-yellow-400/10 transition-colors duration-1000"></div>

                                <div className="relative z-10 flex justify-between items-start">
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] italic">Code Mission</p>
                                        <div className="bg-yellow-400/10 text-yellow-500 px-5 py-2 rounded-xl text-[12px] font-[1000] italic uppercase tracking-tighter border border-yellow-400/20">
                                            #{String(res.id).slice(0, 8)}
                                        </div>
                                    </div>
                                    <div className={`px-5 py-2 rounded-2xl border text-[9px] font-black uppercase tracking-widest flex items-center gap-2.5 italic border-2 border-opacity-10 ${status.color}`}>
                                        <StatusIcon size={14} className={res.status === 'pending' ? 'animate-pulse' : ''} />
                                        {status.label}
                                    </div>
                                </div>

                                <div className="relative z-10 space-y-8 pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-yellow-400 border border-white/5">
                                            <Calendar size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] leading-none mb-2 italic">Date & Secteur</p>
                                            <p className="text-xl font-[1000] text-white uppercase italic tracking-tighter">
                                                {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-yellow-400 border border-white/5">
                                            <Clock size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] leading-none mb-2 italic">Heure d'Impact</p>
                                            <p className="text-xl font-[1000] text-white uppercase italic tracking-tighter">
                                                {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-yellow-400 border border-white/5">
                                            <Users size={22} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] leading-none mb-2 italic">Effectifs</p>
                                            <p className="text-xl font-[1000] text-white uppercase italic tracking-tighter">{res.party_size} Personnes</p>
                                        </div>
                                    </div>
                                </div>

                                {res.table_number ? (
                                    <div className="relative z-10 pt-8 border-t border-white/5 flex items-center gap-4 text-yellow-500 animate-in slide-in-from-left-4 duration-700">
                                        <MapPin size={18} />
                                        <span className="text-[11px] font-[1000] uppercase tracking-[0.3em] italic">Zone Assignée: Table PV-#{res.table_number}</span>
                                    </div>
                                ) : (
                                    <div className="relative z-10 pt-8 border-t border-white/5">
                                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex items-center gap-4 group-hover:bg-yellow-400/5 transition-colors">
                                            <Info size={16} className="text-gray-600 group-hover:text-yellow-400 transition-colors" />
                                            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed italic group-hover:text-gray-400 transition-colors">
                                                {res.status === 'pending' ? 'Validation de zone en cours...' : 'Présentez-vous 15 min avant.'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
