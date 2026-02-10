'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    Calendar, Clock, Users, User, Phone, Mail,
    MessageCircle, Send, Sparkles, Loader2,
    ArrowLeft, CheckCircle2, ShieldCheck,
    Timer, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/app/context/ToastContext';
import TacticalAura from '@/components/TacticalAura';
import TacticalCalendar from '@/components/reservations/TacticalCalendar';
import Link from 'next/link';

export default function NewReservationPage() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        customerName: session?.user?.name || '',
        customerEmail: session?.user?.email || '',
        customerPhone: '',
        reservationDate: '',
        reservationTime: '',
        partySize: '2',
        notes: ''
    });

    useEffect(() => {
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                customerName: prev.customerName || session.user.name || '',
                customerEmail: prev.customerEmail || session.user.email || ''
            }));
        }
    }, [session]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleDateChange = (date: string) => {
        setFormData(prev => ({ ...prev, reservationDate: date }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.reservationDate || !formData.reservationTime) {
            toast.error('Veuillez sélectionner une date et une heure');
            return;
        }

        setLoading(true);
        try {
            const fullDate = `${formData.reservationDate}T${formData.reservationTime}`;
            const res = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: formData.customerName,
                    customerPhone: formData.customerPhone,
                    customerEmail: formData.customerEmail,
                    reservationDate: fullDate,
                    partySize: formData.partySize,
                    notes: formData.notes
                })
            });

            const data = await res.json();
            if (data.success) {
                setSubmitted(true);
                toast.success('Dépoiement Temporel Réussi !');
            } else {
                toast.error(data.error || 'Erreur de transmission');
            }
        } catch (error) {
            console.error('Reservation error:', error);
            toast.error('Signal Interrompu');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="w-full min-h-[70vh] flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in duration-1000">
                <TacticalAura opacity={0.5} />
                <div className="relative">
                    <div className="w-32 h-32 bg-yellow-400/10 text-yellow-400 rounded-[2.5rem] flex items-center justify-center text-5xl border border-yellow-400/20 shadow-[0_0_80px_rgba(250,204,21,0.2)] relative z-10">
                        ✓
                    </div>
                    <div className="absolute inset-0 bg-yellow-400 blur-[60px] opacity-20 animate-pulse"></div>
                </div>
                <div className="text-center space-y-6 max-w-xl relative z-10">
                    <h2 className="text-6xl font-[1000] text-white uppercase italic tracking-tighter leading-none">
                        MISSION <span className="text-yellow-400">PLANIFIÉE</span>
                    </h2>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[11px] italic leading-relaxed">
                        Votre déploiement tactique a été enregistré dans le registre central. <br />
                        Un agent de liaison confirmera votre position sous peu.
                    </p>
                    <div className="flex gap-4 justify-center pt-8">
                        <Link
                            href="/account/reservations"
                            className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest italic hover:bg-yellow-400 transition-all shadow-2xl active:scale-95"
                        >
                            Voir Chronologie
                        </Link>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="px-10 py-5 bg-white/5 border border-white/5 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest italic hover:bg-white/10 transition-all active:scale-95"
                        >
                            Nouveau Booking
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-16 animate-in fade-in duration-1000 pb-24">
            <TacticalAura opacity={0.3} />

            {/* Header */}
            <div className="flex flex-col xl:flex-row items-start justify-between gap-12 border-b border-white/5 pb-16">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400/10 rounded-2xl flex items-center justify-center border border-yellow-400/20">
                            <Target className="w-5 h-5 text-yellow-400" />
                        </div>
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic leading-none">Strategic Deployment Unit</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none">
                        NOUVELLE <span className="text-yellow-400">RÉSERVATION</span>
                    </h1>
                </div>

                <Link
                    href="/account/reservations"
                    className="group flex items-center gap-4 text-gray-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest italic"
                >
                    <div className="w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center group-hover:border-yellow-400 group-hover:text-yellow-400 transition-all bg-white/[0.02]">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    Retour au Registre
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 items-stretch">
                {/* Column 1: Temporal Selection (Calendar) */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-3xl relative overflow-hidden h-full flex flex-col">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400/5 blur-[80px] -ml-32 -mt-32 pointer-events-none"></div>
                    <h2 className="text-lg font-[1000] text-white uppercase italic tracking-tighter flex items-center gap-3 mb-8 relative z-10">
                        <div className="w-8 h-8 bg-yellow-400/10 rounded-xl flex items-center justify-center border border-yellow-400/20">
                            <Calendar className="w-4 h-4 text-yellow-400" />
                        </div>
                        SÉLECTION DATE
                    </h2>

                    <TacticalCalendar
                        value={formData.reservationDate}
                        onChange={handleDateChange}
                        variant="naked"
                    />
                </div>

                {/* Column 2: Impact Window (Time) */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-3xl h-full flex flex-col">
                    <h2 className="text-lg font-[1000] text-white uppercase italic tracking-tighter flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-yellow-400/10 rounded-xl flex items-center justify-center border border-yellow-400/20">
                            <Clock className="w-4 h-4 text-yellow-400" />
                        </div>
                        FENÊTRE D'IMPACT
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1 items-start content-start">
                        {Array.from({ length: 12 }, (_, i) => i + 12).flatMap(h => [`${h}:00`, `${h}:30`]).map(time => (
                            <button
                                key={time}
                                type="button"
                                onClick={() => setFormData({ ...formData, reservationTime: time })}
                                className={`py-3 rounded-xl text-[10px] font-[1000] uppercase italic tracking-tighter border transition-all duration-300 ${formData.reservationTime === time
                                    ? 'bg-yellow-400 border-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.2)]'
                                    : 'bg-white/[0.02] border-white/5 text-gray-500 hover:text-white hover:border-white/10'
                                    }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info & Requirements */}
                {/* Column 3: Unit Details & Finalization */}
                <div className="space-y-6 h-full flex flex-col">
                    {/* Party Size */}
                    <div className="bg-yellow-400 p-8 rounded-[2.5rem] text-black shadow-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="space-y-6">
                            <h3 className="text-lg font-[1000] uppercase italic tracking-tighter leading-tight flex items-center gap-3">
                                <div className="w-8 h-8 bg-black/5 rounded-xl flex items-center justify-center border border-black/10">
                                    <Users size={16} />
                                </div>
                                VOTRE UNITÉ
                            </h3>
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, partySize: n.toString() })}
                                        className={`py-3 rounded-lg text-[10px] font-black italic transition-all border ${formData.partySize === n.toString() ? 'bg-black text-yellow-400 border-black shadow-lg scale-105' : 'bg-transparent border-black/10 text-black/40 hover:border-black/30'}`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Notes & Confirm */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 shadow-3xl relative overflow-hidden flex-1 flex flex-col">
                        <div className="space-y-6 relative z-10 flex-1 flex flex-col">
                            <div className="space-y-2 flex-1 flex flex-col">
                                <label className="text-[7px] font-black text-gray-600 uppercase tracking-[0.4em] block ml-2 italic">Notes Tactiques</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="w-full flex-1 bg-white/[0.01] p-4 rounded-xl border border-white/5 font-bold text-[10px] uppercase italic tracking-tight text-white focus:outline-none focus:border-yellow-400 transition-all resize-none min-h-[120px]"
                                    placeholder="Instructions..."
                                />
                            </div>

                            <div className="space-y-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-white hover:bg-yellow-400 text-black py-6 rounded-2xl font-[1000] text-[10px] uppercase tracking-[0.3em] italic flex items-center justify-center gap-4 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            LANCER LA MISSION
                                            <Send size={14} />
                                        </>
                                    )}
                                </button>
                                <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/5">
                                    <ShieldCheck size={10} className="text-yellow-400/50" />
                                    <span className="text-[7px] text-gray-700 font-black uppercase tracking-[0.3em] italic">Protocoles Actif</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
