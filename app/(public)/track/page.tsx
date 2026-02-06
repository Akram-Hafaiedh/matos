'use client';

import { useState } from 'react';
import { Search, Package, ChefHat, Truck, ArrowRight, Loader2, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const cleanedNumber = orderNumber.trim().toUpperCase();

        if (!cleanedNumber) {
            setError('Entrez un numéro de commande');
            return;
        }

        if (!cleanedNumber.startsWith('MAT')) {
            setError('Le format est MAT... (ex: MAT123456)');
            return;
        }

        setIsSearching(true);

        setTimeout(() => {
            router.push(`/track/${cleanedNumber}`);
            setIsSearching(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-transparent pt-48 pb-24 relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 md:px-12 space-y-24 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-12 text-center"
                >
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-yellow-400/5 border border-yellow-400/20 mx-auto">
                            <Globe className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                            <span className="text-yellow-400 font-black text-[9px] uppercase tracking-[0.4em] italic">Logistique Directe • Live</span>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-16 bg-yellow-400/15 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <div className="relative bg-yellow-400 py-8 px-12 md:px-20 -rotate-1 hover:rotate-0 transition-all duration-700 shadow-[0_0_80px_rgba(250,204,21,0.15)]">
                                <h1 className="text-5xl md:text-[9rem] font-[1000] italic uppercase tracking-tighter text-black leading-none inline-block pr-[0.4em]">
                                    Suivi
                                </h1>
                            </div>
                        </div>

                        <p className="text-gray-500 font-bold text-[11px] uppercase tracking-[0.3em] italic leading-relaxed max-w-xl mx-auto pt-8">
                            Entrez l'identifiant de votre expérience Gourmet pour <br className="hidden md:block" /> localiser votre festin en un instant.
                        </p>
                    </div>
                </motion.div>

                {/* Search Interaction */}
                <div className="space-y-12">
                    <div className="text-center space-y-4">
                        <p className="text-[10px] font-black text-yellow-400/60 uppercase tracking-[0.4em] italic">Identification Boutique Reclamee</p>
                        <p className="text-gray-500 font-bold text-[11px] uppercase tracking-widest leading-relaxed max-w-2xl mx-auto italic">
                            Munissez-vous de votre code de commande (Sceau MAT-XXXXX) <br />
                            pour synchroniser votre vision avec notre centre logistique.
                        </p>
                    </div>

                    <motion.form
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        onSubmit={handleSearch}
                        className="group relative"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-[3rem] blur opacity-25 group-focus-within:opacity-100 transition duration-1000" />
                        <div className="relative flex flex-col md:flex-row items-center gap-4 bg-[#0a0a0a] border border-white/5 p-3 rounded-[3rem] shadow-2xl backdrop-blur-3xl">
                            <div className="flex-1 w-full relative">
                                <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type="text"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                                    placeholder="VOTRE NUMÉRO (EX: MAT...)"
                                    className="w-full bg-transparent border-none focus:ring-0 pl-18 pr-8 py-7 font-[1000] text-xl text-white italic placeholder:text-gray-800 placeholder:uppercase"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!orderNumber || isSearching}
                                className="bg-white hover:bg-yellow-400 text-black px-12 py-7 rounded-[2.2rem] font-[1000] uppercase text-[10px] tracking-[0.4em] transition-all disabled:opacity-50 active:scale-95 w-full md:w-auto italic"
                            >
                                {isSearching ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Traquer'}
                            </button>
                        </div>
                    </motion.form>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="flex items-center gap-3 px-8 text-red-500 overflow-hidden"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                                <p className="text-[10px] font-black uppercase tracking-widest italic">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Informational Cards */}
                <div className="grid md:grid-cols-2 gap-10">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="bg-[#0a0a0a] border border-white/5 p-12 rounded-[3.5rem] space-y-8 group relative overflow-hidden"
                    >
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-yellow-400/50 transition-colors">
                            <Truck className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-[1000] text-white italic uppercase tracking-tighter">Zones Elite</h3>
                            <p className="text-gray-500 text-[10px] font-black leading-relaxed uppercase tracking-widest italic">
                                Nous couvrons le grand Tunis avec une rigueur absolue. <br />Suivez votre coursier en temps réel via notre badge d'authenticité.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="bg-[#0a0a0a] border border-white/5 p-12 rounded-[3.5rem] space-y-8 group relative overflow-hidden"
                    >
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-yellow-400/50 transition-colors">
                            <Package className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-xl font-[1000] text-white italic uppercase tracking-tighter">Retrait Express</h3>
                            <p className="text-gray-500 text-[10px] font-black leading-relaxed uppercase tracking-widest italic">
                                La commande vous attend. <br />Recevez une alerte instantanée dès que le chef appose le sceau de qualité Mato's.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center pt-12"
                >
                    <p className="text-gray-700 font-black text-[9px] uppercase tracking-[0.4em] mb-6 italic">Assistance Dédiée</p>
                    <Link
                        href="/support"
                        className="inline-flex items-center gap-4 text-white hover:text-yellow-400 transition-all font-[1000] uppercase text-[10px] tracking-[0.3em] group italic"
                    >
                        Besoin d'aide ?
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

            </div>
        </div>
    );
}
