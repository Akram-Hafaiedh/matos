'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Package, ArrowRight, ShieldCheck } from 'lucide-react';

export default function TrackingPage() {
    const router = useRouter();
    const [orderNumber, setOrderNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const cleanedNumber = orderNumber.trim().toUpperCase();

        if (!cleanedNumber) {
            setError('Veuillez entrer un numéro de commande');
            return;
        }

        if (!cleanedNumber.startsWith('MAT')) {
            setError('Le format doit commencer par MAT (ex: MAT123456)');
            return;
        }

        setIsLoading(true);

        // Simulate a small delay for better UX
        setTimeout(() => {
            router.push(`/tracking/${cleanedNumber}`);
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-black py-24 relative overflow-hidden flex flex-col items-center justify-center">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] -ml-64 -mb-64 pointer-events-none"></div>

            <div className="max-w-xl w-full px-6 relative z-10 flex flex-col items-center text-center">

                <div className="w-16 h-16 bg-gray-900 rounded-3xl border border-gray-800 flex items-center justify-center mb-10 shadow-2xl shadow-yellow-400/5">
                    <Package className="w-8 h-8 text-yellow-400" />
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase italic tracking-tighter">
                    Suivre ma <span className="text-yellow-400">Commande</span>
                </h1>

                <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mb-12 max-w-sm leading-relaxed">
                    Entrez votre numéro de commande pour consulter son statut en temps réel.
                </p>

                <div className="w-full bg-gray-900/60 p-8 rounded-[3rem] border border-gray-800 backdrop-blur-3xl shadow-2xl">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className="w-full bg-gray-950/80 border-2 border-gray-800 text-white pl-16 pr-6 py-5 rounded-2xl font-black uppercase text-lg tracking-widest focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-800 shadow-inner"
                                placeholder="MAT......"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-yellow-400/10 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3 group"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Recherche...
                                </>
                            ) : (
                                <>
                                    Rechercher
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-12 flex items-center gap-3 text-gray-600/50">
                    <ShieldCheck className="w-4 h-4" />
                    <p className="text-[9px] font-black uppercase tracking-[0.3em]">Confidentialité Protégée</p>
                </div>
            </div>
        </div>
    );
}
