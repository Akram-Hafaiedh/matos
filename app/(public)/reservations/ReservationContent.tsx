'use client';

import { useState, useRef } from 'react';
import {
    Calendar,
    Users,
    Clock,
    User,
    Phone,
    Mail,
    MessageCircle,
    Send,
    Sparkles,
    ShieldCheck,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useToast } from '@/app/context/ToastContext';
import { useSession } from 'next-auth/react';
import TacticalCalendar from '@/components/reservations/TacticalCalendar';

export default function ReservationContent() {
    const { data: session } = useSession();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const [formData, setFormData] = useState({
        customerName: session?.user?.name || '',
        customerEmail: session?.user?.email || '',
        customerPhone: '',
        reservationDate: '',
        reservationTime: '',
        partySize: '2',
        notes: ''
    });

    const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -30]);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                toast.success('Réservation envoyée ! Nous vous confirmerons bientôt.');
            } else {
                toast.error(data.error || 'Une erreur est survenue');
            }
        } catch (error) {
            console.error('Reservation error:', error);
            toast.error('Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-transparent text-white py-32 pb-40 relative overflow-hidden">
            {/* Background elements would be handled by AmbientBackground in layout */}

            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-32 relative z-10">
                {/* Header Section */}
                <motion.div
                    style={{ y: headerY, opacity: headerOpacity }}
                    className="flex flex-col items-center gap-12 text-center"
                >
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                            <span className="text-yellow-400 font-black text-[10px] uppercase tracking-[0.4em] italic">Art de la Table</span>
                        </motion.div>

                        <div className="relative group">
                            <div className="absolute -inset-16 bg-yellow-400/15 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <div className="relative bg-yellow-400 py-8 px-12 md:px-20 -rotate-1 hover:rotate-0 transition-all duration-700 shadow-[20px_20px_0_rgba(0,0,0,1)] border-4 border-black overflow-hidden">
                                <h1 className="text-5xl md:text-[8rem] font-[1000] italic uppercase tracking-tighter text-black leading-none inline-block relative z-10 pr-[0.4em]">
                                    RESERVER
                                </h1>
                            </div>
                        </div>

                        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-bold uppercase tracking-widest text-[11px] italic pt-8">
                            Réservez votre table pour une expérience immersive. <br />
                            Préparez-vous à entrer dans le Syndicat.
                        </p>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-5 gap-20 items-start">
                    {/* Info Sidebar */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-yellow-400 p-8 rounded-[2.5rem] text-black shadow-[0_30px_60px_rgba(250,204,21,0.15)] group relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="p-3 bg-black/10 rounded-xl">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <ShieldCheck className="w-6 h-6 opacity-40" />
                                </div>
                                <h3 className="text-2xl font-[1000] uppercase italic tracking-tighter mb-3">Garantie Mato's</h3>
                                <p className="font-bold text-black/70 mb-8 uppercase tracking-wide text-[10px] leading-relaxed">
                                    Toutes les réservations sont confirmées sous 30 minutes. Notre équipe s'assure de vous offrir le meilleur emplacement.
                                </p>
                                <div className="flex items-center gap-3 text-black font-black uppercase italic text-[9px] tracking-widest">
                                    <CheckCircle2 className="w-4 h-4" /> 100% Confirmé
                                </div>
                            </div>
                        </motion.div>

                        <div className="space-y-6">
                            {[
                                { icon: Clock, label: 'Horaires', value: '12:00 - 23:30' },
                                { icon: Users, label: 'Capacité Max', value: 'Grandes Tables OK' },
                                { icon: ShieldCheck, label: 'Support', value: '99 956 608' }
                            ].map((info, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * i }}
                                    className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] group hover:border-yellow-400/30 transition-all duration-500"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-yellow-400 group-hover:text-black transition-all duration-500">
                                            <info.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1 italic">{info.label}</p>
                                            <p className="text-base font-[1000] uppercase tracking-tighter text-white italic">{info.value}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#0a0a0a] border border-white/5 p-12 md:p-16 rounded-[4rem] shadow-3xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/[0.02] blur-[100px] rounded-full pointer-events-none"></div>

                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-24 text-center space-y-8"
                                >
                                    <div className="w-24 h-24 bg-yellow-400/10 text-yellow-400 rounded-full flex items-center justify-center mx-auto text-4xl border border-yellow-400/20 shadow-[0_0_50px_rgba(250,204,21,0.1)]">
                                        ✓
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-[1000] uppercase italic tracking-tighter">Réservation Reçue !</h3>
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] italic leading-relaxed max-w-sm mx-auto">
                                            Nous préparons votre venue. Un agent vous contactera par téléphone ou email pour confirmer les détails.
                                        </p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="text-yellow-400 font-black uppercase text-[10px] tracking-[0.3em] italic hover:text-white transition-colors"
                                        >
                                            Faire une autre réservation
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                                    <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter mb-12 flex items-center gap-6">
                                        <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-black">
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        Détails du Booking
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Nom Complet</label>
                                            <div className="relative">
                                                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="text"
                                                    name="customerName"
                                                    required
                                                    value={formData.customerName}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/5 border border-white/10 p-6 pl-14 rounded-2xl focus:border-yellow-400/50 focus:bg-white/10 focus:outline-none transition-all font-bold text-white tracking-widest text-xs"
                                                    placeholder="votre nom"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Téléphone</label>
                                            <div className="relative">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                <input
                                                    type="tel"
                                                    name="customerPhone"
                                                    required
                                                    value={formData.customerPhone}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/5 border border-white/10 p-6 pl-14 rounded-2xl focus:border-yellow-400/50 focus:bg-white/10 focus:outline-none transition-all font-bold text-white tracking-widest text-xs"
                                                    placeholder="99 000 000"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-10">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Date de Réservation</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                    <input
                                                        type="date"
                                                        name="reservationDate"
                                                        required
                                                        value={formData.reservationDate}
                                                        onChange={handleChange}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="w-full bg-white/5 border border-white/10 p-6 pl-14 rounded-2xl focus:border-yellow-400/50 focus:bg-white/10 focus:outline-none transition-all font-bold text-white tracking-widest text-xs [color-scheme:dark]"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Nombre de Personnes</label>
                                                <div className="relative group/select">
                                                    <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 z-10" />
                                                    <select
                                                        name="partySize"
                                                        required
                                                        value={formData.partySize}
                                                        onChange={handleChange}
                                                        className="w-full bg-white/5 border border-white/10 p-6 pl-14 rounded-2xl focus:border-yellow-400/50 focus:bg-white/10 focus:outline-none transition-all font-bold text-white uppercase tracking-[0.3em] text-xs appearance-none cursor-pointer"
                                                    >
                                                        {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map(n => (
                                                            <option key={n} value={n} className="bg-[#0a0a0a]">{n} {n === 1 ? 'Personne' : 'Personnes'}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-10">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Heure</label>
                                                <div className="relative group/select">
                                                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 z-10" />
                                                    <select
                                                        name="reservationTime"
                                                        required
                                                        value={formData.reservationTime}
                                                        onChange={handleChange}
                                                        className="w-full bg-white/5 border border-white/10 p-6 pl-14 rounded-2xl focus:border-yellow-400/50 focus:bg-white/10 focus:outline-none transition-all font-bold text-white uppercase tracking-[0.3em] text-xs appearance-none cursor-pointer"
                                                    >
                                                        <option value="" className="bg-[#0a0a0a]">Choisir</option>
                                                        {Array.from({ length: 12 }, (_, i) => i + 12).flatMap(h => [
                                                            <option key={`${h}:00`} value={`${h}:00`} className="bg-[#0a0a0a]">{h}:00</option>,
                                                            <option key={`${h}:30`} value={`${h}:30`} className="bg-[#0a0a0a]">{h}:30</option>
                                                        ])}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Email (Optionnel)</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                                    <input
                                                        type="email"
                                                        name="customerEmail"
                                                        value={formData.customerEmail}
                                                        onChange={handleChange}
                                                        className="w-full bg-white/5 border border-white/10 p-6 pl-14 rounded-2xl focus:border-yellow-400/50 focus:bg-white/10 focus:outline-none transition-all font-bold text-white tracking-widest text-xs"
                                                        placeholder="votre@email.com"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Notes Spéciales</label>
                                        <div className="relative">
                                            <MessageCircle className="absolute left-6 top-10 w-4 h-4 text-gray-500" />
                                            <textarea
                                                name="notes"
                                                rows={4}
                                                value={formData.notes}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 p-6 pl-14 rounded-2xl focus:border-yellow-400/50 focus:bg-white/10 focus:outline-none transition-all font-bold text-white tracking-widest text-xs resize-none"
                                                placeholder="Allergies, anniversaire, emplacement souhaité..."
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-yellow-400 hover:bg-white text-black py-8 rounded-2xl font-[1000] uppercase text-xs tracking-[0.3em] transition-all transform hover:scale-[1.01] shadow-[0_20px_50px_rgba(250,204,21,0.15)] flex items-center justify-center gap-4 group/form-btn active:scale-95 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 group-hover/form-btn:translate-x-1 group-hover/form-btn:-translate-y-1 transition-transform" />
                                                <span>Finaliser la Réservation</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
