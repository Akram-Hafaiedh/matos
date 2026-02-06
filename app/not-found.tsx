// app/not-found.tsx
'use client';

import { motion } from 'framer-motion';
import { Home, ArrowLeft, Sparkles, Ghost } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-black overflow-hidden selection:bg-yellow-400 selection:text-black">

            {/* Visual Side (50%) */}
            <div className="lg:flex-1 relative overflow-hidden hidden lg:block">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <img
                        src="https://images.unsplash.com/photo-1550507992-eb63ffee0847?q=80&w=2070&auto=format&fit=crop"
                        alt="Mato's Atmosphere"
                        className="w-full h-full object-cover opacity-50 grayscale-[40%]"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/30 to-black"></div>

                {/* Visual Content Overlay */}
                <div className="absolute bottom-16 left-16 space-y-8 z-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 bg-white px-5 py-2 -rotate-3 rounded-sm shadow-2xl"
                    >
                        <Ghost className="w-4 h-4 text-black" />
                        <span className="text-[11px] font-[1000] uppercase tracking-[0.3em] text-black">Perdu dans le Goût</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-7xl lg:text-9xl font-[1000] italic text-white uppercase tracking-tighter leading-none"
                    >
                        404<br />
                        <span className="text-yellow-400">INTROUVABLE.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ delay: 0.5 }}
                        className="text-[10px] font-black uppercase tracking-[0.5em] text-white max-w-xs leading-relaxed"
                    >
                        Même les meilleures recettes ont parfois des ingrédients manquants. Cette page n'existe pas ou a été déplacée.
                    </motion.p>
                </div>

                {/* Ambient Light */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/5 blur-[200px] rounded-full"></div>
            </div>

            {/* Content Side (50%) */}
            <div className="w-full lg:w-[550px] min-h-screen bg-black relative flex flex-col items-center justify-center p-8 lg:p-20 border-l border-white/5">

                {/* Signature Brand Title for Mobile */}
                <div className="lg:hidden mb-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl font-[1000] italic text-white uppercase tracking-tighter"
                    >
                        404
                    </motion.h1>
                </div>

                <div className="w-full max-w-sm space-y-12">

                    <div className="space-y-6">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-20 h-20 bg-yellow-400 flex items-center justify-center rounded-[2.5rem] -rotate-6 shadow-2xl shadow-yellow-400/20"
                        >
                            <Sparkles className="w-10 h-10 text-black" />
                        </motion.div>
                        <div className="space-y-3">
                            <h2 className="text-4xl lg:text-5xl font-[1000] italic text-white uppercase tracking-tighter leading-none">
                                Page<br />Introuvable
                            </h2>
                            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-500 italic">
                                Maison Mato's — Erreur de Navigation
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            Nous vous présentons nos excuses. Il semble que l'adresse que vous tentez de rejoindre ne soit plus au menu. Laissez-nous vous ramener vers l'essentiel.
                        </p>

                        <div className="flex flex-col gap-4">
                            <Link
                                href="/"
                                className="w-full bg-white text-black py-6 rounded-2xl font-[1000] text-[11px] uppercase tracking-[0.4em] transition-all hover:bg-yellow-400 shadow-xl flex items-center justify-center gap-3 group active:scale-[0.98]"
                            >
                                <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                Retour à l'accueil
                            </Link>

                            <button
                                onClick={() => window.history.back()}
                                className="w-full bg-transparent border border-white/10 text-white py-6 rounded-2xl font-[1000] text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-white/5 flex items-center justify-center gap-3 group active:scale-[0.98]"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Revenir en arrière
                            </button>
                        </div>
                    </div>

                    {/* Elite Footer Section */}
                    <div className="text-center pt-12 border-t border-white/5 mt-12">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-transparent"></div>
                            <p className="text-gray-700 font-black text-[9px] uppercase tracking-[0.5em]">
                                Mato's Signature • {new Date().getFullYear()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Ambient Light Right */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-400/[0.02] blur-[100px] pointer-events-none"></div>
            </div>
        </div>
    );
}
