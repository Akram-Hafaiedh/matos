'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Star, Cpu, Zap, Loader2 } from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';
import { useState } from 'react';

export default function MaintenanceSettingsPage() {
    const { toast } = useToast();
    const [running, setRunning] = useState(false);

    const runSync = async () => {
        if (!confirm('Voulez-vous vraiment lancer la synchronisation globale des points de fidélité ?')) return;
        setRunning(true);
        try {
            const res = await fetch('/api/admin/loyalty/retroactive', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error('Erreur lors de la synchronisation');
        } finally {
            setRunning(false);
        }
    };

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header Area */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Activity size={12} className="text-yellow-400" />
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">System Core Integrity</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">
                        Maintenance<span className="text-yellow-400"> Système</span>
                    </h1>
                    <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1">Intégrité des données et protocoles de synchronisation</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-[9px] font-[1000] text-gray-700 uppercase tracking-[0.4em] italic mb-1">Status Noyau</p>
                        <p className="text-xs font-black text-yellow-400 italic uppercase">Prêt pour Opérations</p>
                    </div>
                </div>
            </div>

            <main className="w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-10"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-1 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.3)]"></div>
                            <h2 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter leading-none">Maintenance & System Integrity</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-10 pb-20">
                            <div className="bg-white/[0.01] p-12 rounded-[4rem] border border-white/5 backdrop-blur-3xl group hover:border-yellow-400/20 transition-all duration-700 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
                                    <Activity size={180} />
                                </div>
                                <div className="flex flex-col xl:flex-row items-center justify-between gap-12 relative z-10">
                                    <div className="flex items-center gap-10">
                                        <div className="w-24 h-24 bg-yellow-400/5 rounded-[2.5rem] border border-yellow-400/10 flex items-center justify-center text-yellow-400 group-hover:scale-110 group-hover:bg-yellow-400/10 transition-all duration-700">
                                            <Star className="w-12 h-12 fill-current" />
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-white font-[1000] uppercase text-2xl italic tracking-tighter">Synchronisation Fidélité</h3>
                                            <p className="text-gray-700 font-bold text-[10px] uppercase tracking-[0.2em] italic max-w-sm leading-relaxed">
                                                Attribution des points pour les commandes livrées et activation du bonus de bienvenue rétrospectif.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={running}
                                        onClick={runSync}
                                        className="bg-black/40 hover:bg-yellow-400 hover:text-black text-yellow-400 px-12 py-6 rounded-[2rem] font-[1000] text-[10px] uppercase tracking-[0.3em] transition-all duration-700 border border-yellow-400/20 hover:border-transparent flex items-center gap-6 shadow-2xl active:scale-95 group"
                                    >
                                        {running ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                                        Execute Sync Protocol
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white/[0.01] p-12 rounded-[4rem] border border-white/5 backdrop-blur-3xl opacity-20 grayscale pointer-events-none">
                                <div className="flex flex-col xl:flex-row items-center justify-between gap-12">
                                    <div className="flex items-center gap-10">
                                        <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-gray-700">
                                            <Cpu className="w-12 h-12" />
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-white font-[1000] uppercase text-2xl italic tracking-tighter">Nettoyage Cache</h3>
                                            <p className="text-gray-700 font-bold text-[10px] uppercase tracking-[0.2em] italic max-w-sm leading-relaxed">
                                                Optimisation automatique de la base de données et purge des logs système.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="px-10 py-5 bg-black border border-white/5 rounded-[1.5rem] text-[10px] font-[1000] uppercase tracking-[0.4em] text-gray-800 italic">
                                        Soon Active
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
