'use client';

import { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, AlertCircle, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function SecurityPage() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setStatus({ type: 'error', message: 'Les nouveaux mots de passe ne correspondent pas' });
            return;
        }

        setLoading(true);
        setStatus({ type: 'idle', message: '' });

        try {
            const res = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erreur lors du changement de mot de passe');
            }

            setStatus({ type: 'success', message: 'Mot de passe mis à jour avec succès !' });
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                Sécurité & <span className="text-yellow-400">Accès</span>
            </h2>

            <div className="bg-gray-900/60 p-10 rounded-[3rem] border border-gray-800 backdrop-blur-xl space-y-10">
                <div className="flex items-center gap-6 pb-8 border-b border-gray-800">
                    <div className="w-16 h-16 bg-gray-950 rounded-2xl flex items-center justify-center border border-gray-800 shadow-xl">
                        <Lock className="w-7 h-7 text-yellow-500" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-white uppercase italic tracking-wider">Changer le mot de passe</h3>
                        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Sécurisez votre compte avec un nouveau secret</p>
                    </div>
                </div>

                {status.type !== 'idle' && (
                    <div className={`p-5 rounded-2xl flex items-center gap-4 animate-in fade-in zoom-in ${status.type === 'success' ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
                        }`}>
                        {status.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                        <p className={`font-black uppercase text-[10px] tracking-widest ${status.type === 'success' ? 'text-green-500' : 'text-red-500'
                            }`}>
                            {status.message}
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] block ml-4">Mot de passe actuel</label>
                            <div className="relative group">
                                <KeyRound className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-16 pr-6 py-5 rounded-[2rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-800"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] block ml-4">Nouveau mot de passe</label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-16 pr-6 py-5 rounded-[2rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-800"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] block ml-4">Confirmation</label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-16 pr-6 py-5 rounded-[2rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-800"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-gray-950 hover:bg-yellow-400 hover:text-gray-950 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Mettre à jour les accès
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
