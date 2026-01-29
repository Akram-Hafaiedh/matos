'use client';

import { useState } from 'react';
import { Mail, ArrowLeft, Send, AlertCircle, CheckCircle, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const router = useRouter();
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
        <div className="w-full relative">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-400/10 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>

            <div className="text-center mb-10 relative z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-950 rounded-[2rem] border-2 border-yellow-400/20 shadow-2xl mb-6">
                    <KeyRound className="w-10 h-10 text-yellow-400" />
                </div>
                <h1 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">
                    Accès <span className="text-yellow-400">Perdu ?</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">Récupération de compte</p>
            </div>

            <div className="bg-gray-900/50 rounded-[3rem] p-10 border-2 border-gray-800 backdrop-blur-3xl shadow-3xl relative z-10">
                {status === 'success' ? (
                    <div className="text-center space-y-6 py-6 animate-in fade-in zoom-in">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-white uppercase italic">Email Envoyé !</h3>
                            <p className="text-gray-500 text-sm font-bold">Consultez votre boîte de réception pour les instructions de réinitialisation.</p>
                        </div>
                        <Link href="/login" className="inline-block w-full bg-gray-950 border-2 border-gray-800 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:border-yellow-400/50 transition-all">
                            Retour à la connexion
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-gray-500 font-black uppercase text-[10px] tracking-widest ml-4">Email de récupération</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-16 pr-6 py-5 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-700"
                                    placeholder="votre@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-yellow-400/10 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Traitement...' : (
                                <span className="flex items-center justify-center gap-2">
                                    Envoyer le lien
                                    <Send className="w-4 h-4" />
                                </span>
                            )}
                        </button>

                        <div className="text-center">
                            <Link href="/login" className="flex items-center justify-center gap-2 text-gray-500 hover:text-white font-black uppercase text-[10px] tracking-widest transition-colors">
                                <ArrowLeft className="w-3 h-3" />
                                Annuler
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
