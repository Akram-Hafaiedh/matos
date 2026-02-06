'use client';

import {
    LifeBuoy,
    Send,
    Loader2,
    CheckCircle2,
    Ticket,
    ShieldCheck,
    Clock,
    Sparkles,
    ChevronRight,
    MessageCircle,
    User,
    ArrowLeft
} from 'lucide-react';
import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

export default function SupportPage() {
    const { data: session, status: authStatus } = useSession();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const headerY = useTransform(scrollYProgress, [0, 0.1], [0, -30]);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);

    const isGuest = authStatus === 'unauthenticated';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-transparent text-white py-32 pb-40 relative overflow-hidden">
            {/* Ambient Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-yellow-400/5 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-orange-500/5 blur-[150px] rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-32 relative z-10">

                {/* Header Section with Parallax */}
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
                            <LifeBuoy className="w-3.5 h-3.5 text-yellow-400" />
                            <span className="text-yellow-400 font-black text-[10px] uppercase tracking-[0.4em] italic">Centre de Support Mato's</span>
                        </motion.div>

                        <div className="relative group">
                            <div className="absolute -inset-16 bg-yellow-400/15 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                            {/* THE PILL TITLE */}
                            <div className="relative bg-yellow-400 py-8 px-12 md:px-20 -rotate-1 hover:rotate-0 transition-all duration-700 shadow-[20px_20px_0_rgba(0,0,0,1)] border-4 border-black overflow-hidden group">
                                <h1 className="text-5xl md:text-[9rem] font-[1000] italic uppercase tracking-tighter text-black leading-none inline-block relative z-10 pr-[0.4em]">
                                    {isGuest ? 'Aide' : 'Privilège'}
                                </h1>
                            </div>
                        </div>

                        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-bold uppercase tracking-widest text-[11px] italic pt-8 leading-relaxed">
                            {isGuest
                                ? "Besoin d'aide pour votre commande ? Notre équipe est là pour vous guider 7j/7."
                                : "En tant que membre privilégié, vous bénéficiez d'une assistance prioritaire dédiée."}
                        </p>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-5 gap-20 items-start">
                    {/* Support Info Sidebar */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Member Status Card */}
                        {!isGuest && (
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="bg-yellow-400 p-10 rounded-[3.5rem] text-black shadow-[0_30px_60px_rgba(250,204,21,0.15)] group relative overflow-hidden"
                            >
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="p-4 bg-black/10 rounded-2xl">
                                            <ShieldCheck className="w-8 h-8" />
                                        </div>
                                        <div className="px-4 py-2 bg-black text-white rounded-full font-black text-[9px] uppercase tracking-widest italic">Actif</div>
                                    </div>
                                    <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter mb-4">Mato's Elite</h3>
                                    <div className="space-y-4 mb-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                                            <p className="font-bold text-black/70 uppercase tracking-wide text-[10px]">Réponse sous 15 minutes</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                                            <p className="font-bold text-black/70 uppercase tracking-wide text-[10px]">Ligne directe prioritaire</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl rounded-full -mr-20 -mt-20"></div>
                            </motion.div>
                        )}

                        {/* Guest Promotion Card */}
                        {isGuest && (
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[3.5rem] group relative overflow-hidden"
                            >
                                <div className="relative z-10 space-y-8">
                                    <div className="w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center text-yellow-400 border border-yellow-400/20">
                                        <Sparkles className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter text-white">Privilège Client</h3>
                                        <p className="font-bold text-gray-500 uppercase tracking-wide text-xs leading-relaxed">
                                            Connectez-vous pour bénéficier d'un support prioritaire et suivre vos tickets en temps réel.
                                        </p>
                                    </div>
                                    <Link href="/login" className="flex items-center justify-between bg-white text-black p-6 rounded-2xl font-black transition hover:bg-yellow-400 shadow-2xl group/btn">
                                        <span className="uppercase tracking-[0.2em] text-[10px]">Se Connecter</span>
                                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        )}

                        {/* Stats/Status Cards */}
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { icon: Clock, label: 'Temps de réponse', value: isGuest ? '~2 heures' : 'PRIORITAIRE', delay: 0.1 },
                                { icon: Ticket, label: 'Tickets ouverts', value: isGuest ? '0' : 'Aucun actif', delay: 0.2 },
                            ].map((info, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: info.delay + 0.3, duration: 0.6 }}
                                    className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] group hover:border-yellow-400/30 transition-all duration-500"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-yellow-400 group-hover:text-black transition-all duration-500">
                                            <info.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1 italic">{info.label}</p>
                                            <p className="text-lg font-[1000] uppercase tracking-tighter text-white italic">{info.value}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Public Link if Admin/Logged in doesn't want ticket */}
                        <Link href="/contact" className="flex items-center justify-center p-8 border border-white/5 rounded-[2.5rem] hover:bg-white/5 transition group">
                            <ArrowLeft className="w-4 h-4 mr-4 text-gray-500 group-hover:text-yellow-400 transition-colors" />
                            <span className="font-black uppercase tracking-[0.2em] text-[10px] text-gray-500 group-hover:text-white transition-colors">Retour au contact public</span>
                        </Link>
                    </div>

                    {/* Support Form */}
                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-[#0a0a0a] border border-white/5 p-12 md:p-16 rounded-[4rem] shadow-3xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/[0.02] blur-[100px] rounded-full pointer-events-none group-hover:bg-yellow-400/[0.04] transition-colors duration-1000"></div>

                            <h2 className="text-4xl font-[1000] italic uppercase tracking-tighter mb-12 flex items-center gap-6 relative z-10">
                                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-black">
                                    <Ticket className="w-6 h-6" />
                                </div>
                                {isGuest ? 'Ouvrir une demande' : "Nouveau Ticket Support"}
                            </h2>

                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-24 text-center space-y-8 relative z-10"
                                >
                                    <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto text-4xl border border-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
                                        ✓
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-4xl font-[1000] uppercase italic tracking-tighter">Ticket Enregistré !</h3>
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] italic leading-relaxed max-w-sm mx-auto">
                                            Votre demande a été prise en compte. Un conseiller vous répondra très prochainement par email.
                                        </p>
                                    </div>
                                    <Link href="/" className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-10 py-5 rounded-2xl hover:bg-white/10 transition font-black uppercase tracking-widest text-[10px]">
                                        Retour à l'accueil
                                    </Link>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Objet de votre demande</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl focus:border-yellow-400/50 focus:bg-white/10 focus:outline-none transition-all font-bold text-white uppercase tracking-widest text-xs"
                                                placeholder="ex: Problème avec ma commande"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Identifiant de commande (Optionnel)</label>
                                            <input
                                                type="text"
                                                className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl focus:border-yellow-400/50 focus:bg-white/10 focus:outline-none transition-all font-bold text-white uppercase tracking-widest text-xs"
                                                placeholder="ex: MAT-12345"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Niveau de priorité</label>
                                        <div className="relative group/select">
                                            <select
                                                required
                                                className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl focus:border-yellow-400/50 focus:bg-white/10 focus:outline-none transition-all font-[1000] text-white uppercase tracking-widest text-xs appearance-none cursor-pointer"
                                            >
                                                <option value="normal" className="bg-[#0a0a0a]">Normal</option>
                                                <option value="urgent" className="bg-[#0a0a0a]">Urgent</option>
                                                <option value="critique" className="bg-[#0a0a0a]">Critique (Problème de paiement / livraison)</option>
                                            </select>
                                            <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 rotate-90 pointer-events-none transition-colors group-hover/select:text-yellow-400" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Description détaillée</label>
                                        <textarea
                                            required
                                            rows={8}
                                            className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl focus:border-yellow-400/50 focus:bg-white/10 focus:outline-none transition-all font-bold text-white uppercase tracking-widest text-xs resize-none"
                                            placeholder="Comment pouvons-nous vous aider de manière précise ?"
                                        />
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
                                                <span>{isGuest ? 'Contacter le support public' : 'Ouvrir mon ticket'}</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* FAQ Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-col items-center gap-12 text-center"
                >
                    <div className="space-y-4">
                        <h3 className="text-3xl font-[1000] uppercase italic tracking-tighter text-white">Solutions Rapides</h3>
                        <p className="font-bold text-gray-500 uppercase tracking-widest text-[10px] italic">Consultez nos questions fréquentes pour une aide immédiate.</p>
                    </div>
                    <Link href="/faq" className="group flex items-center gap-6 px-12 py-6 bg-white/5 border border-white/10 rounded-3xl hover:border-yellow-400/40 transition-all duration-500">
                        <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-black transform group-hover:rotate-12 transition-transform">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <span className="font-black uppercase tracking-[0.2em] text-xs text-white">Consulter la FAQ</span>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
