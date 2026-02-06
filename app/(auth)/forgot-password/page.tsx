// app/(auth)/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Send, CheckCircle, KeyRound, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulation of reset request
        setTimeout(() => {
            setLoading(false);
            setStatus('success');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-black overflow-hidden selection:bg-yellow-400 selection:text-black">

            {/* Visual Side (50%) */}
            <div className="lg:flex-1 relative overflow-hidden hidden lg:block">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop"
                        alt="Mato's Atmosphere"
                        className="w-full h-full object-cover opacity-60 grayscale-[20%]"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black"></div>

                {/* Visual Content Overlay */}
                <div className="absolute bottom-16 left-16 space-y-8 z-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 bg-white px-5 py-2 -rotate-3 rounded-sm shadow-2xl"
                    >
                        <Sparkles className="w-4 h-4 text-black" />
                        <span className="text-[11px] font-[1000] uppercase tracking-[0.3em] text-black">Sécurité Mato's</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-7xl lg:text-8xl font-[1000] italic text-white uppercase tracking-tighter leading-none"
                    >
                        RÉCUPÉRATION<br />
                        <span className="text-yellow-400">D'ACCÈS.</span>
                    </motion.h2>
                </div>

                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/5 blur-[180px] rounded-full"></div>
            </div>

            {/* Form Side (50%) */}
            <div className="w-full lg:w-[550px] min-h-screen bg-black relative flex flex-col items-center justify-center p-8 lg:p-20 border-l border-white/5">

                {/* Back Button */}
                <div className="absolute top-10 left-10 lg:left-20">
                    <Link href="/login" className="group flex items-center gap-3 text-gray-600 hover:text-white transition-all font-black uppercase text-[10px] tracking-[0.3em] italic">
                        <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-yellow-400/50 group-hover:text-yellow-400 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">Connexion</span>
                    </Link>
                </div>

                <div className="w-full max-w-sm space-y-12">

                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center space-y-8"
                            >
                                <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.1)]">
                                    <CheckCircle className="w-10 h-10 text-green-500" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter leading-none">Lien Envoyé</h3>
                                    <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.4em] italic leading-relaxed">
                                        Consultez votre boîte mail pour<br />réinitialiser votre code secret.
                                    </p>
                                </div>
                                <Link href="/login" className="inline-block w-full bg-white text-black py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:bg-yellow-400 transition-all italic active:scale-[0.98]">
                                    Retourner à l'entrée
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-12"
                            >
                                <div className="space-y-4">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-16 h-16 bg-yellow-400 flex items-center justify-center rounded-2xl rotate-6 shadow-2xl shadow-yellow-400/20"
                                    >
                                        <KeyRound className="w-8 h-8 text-black" />
                                    </motion.div>
                                    <div className="space-y-2">
                                        <h1 className="text-4xl font-[1000] italic text-white uppercase tracking-tighter leading-none">Oubli de Code</h1>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500 italic">Identifiez-vous pour la récupération</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-gray-500 font-black uppercase text-[9px] tracking-[0.3em] ml-2 italic">Identifiant Email</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-yellow-400 transition-colors">
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-white/[0.03] border border-white/5 text-white pl-16 pr-6 py-5 rounded-2xl font-bold transition-all outline-none focus:bg-white/[0.07] focus:border-yellow-400/30 placeholder:text-gray-800 uppercase text-xs font-sans"
                                                placeholder="VOTRE@EMAIL.COM"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-yellow-400 hover:bg-white text-black py-6 rounded-2xl font-[1000] text-[11px] uppercase tracking-[0.4em] transition-all shadow-[0_20px_40px_rgba(250,204,21,0.1)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group/btn relative overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                            {loading ? 'TRAITEMENT...' : 'ENVOYER LE LIEN'}
                                            <Send className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                                        </span>
                                        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover/btn:animate-shimmer"></div>
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="text-center pt-8 border-t border-white/5 opacity-50 hover:opacity-100 transition-opacity">
                        <Link href="/register" className="text-gray-600 hover:text-white transition-all font-black uppercase text-[9px] tracking-[0.2em] italic">
                            Besoin d'un nouvel accès ? <span className="text-yellow-400 ml-2">Créer un compte</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
