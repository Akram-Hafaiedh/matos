'use client';

import { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, AlertCircle, CheckCircle, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import TacticalAura from '@/components/TacticalAura';

export default function SecurityPage() {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

            setStatus({ type: 'success', message: 'Accès Mis à Jour : Le Nouveau Protocole est Actif.' });
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-1000">
            <TacticalAura opacity={0.3} />
            <div className="flex flex-col md:flex-row gap-8 items-end justify-between border-b border-white/5 pb-16">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-400/20 bg-yellow-400/5 backdrop-blur-md">
                        <Lock className="w-3 h-3 text-yellow-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-400">Security Sector</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-none text-white">
                        VECTEURS DE <span className="text-yellow-400 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">SÉCURITÉ</span>
                    </h1>
                </div>
            </div>

            <div className="bg-white/[0.02] p-12 rounded-[4rem] border border-white/5 space-y-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/[0.01] blur-[150px] -mr-48 -mt-48 pointer-events-none group-hover:bg-yellow-400/[0.03] transition-all duration-1000"></div>

                <div className="flex items-center gap-8 pb-10 border-b border-white/5 relative z-10">
                    <div className="w-16 h-16 bg-white/[0.02] rounded-3xl flex items-center justify-center border border-white/5 shadow-2xl">
                        <Lock className="w-8 h-8 text-yellow-400" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter">Gestion des Identifiants</h3>
                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] italic">Mise à jour du protocole d'accès cryptographique</p>
                    </div>
                </div>

                {status.type !== 'idle' && (
                    <div className={`p-8 rounded-[2.5rem] flex items-center gap-6 animate-in fade-in zoom-in-95 duration-500 relative z-10 ${status.type === 'success' ? 'bg-green-500/5 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'bg-red-500/5 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]'
                        }`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${status.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {status.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                        </div>
                        <div className="space-y-1">
                            <p className={`font-[1000] uppercase text-xs tracking-[0.2em] italic ${status.type === 'success' ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {status.type === 'success' ? 'Accès Autorisé' : 'Erreur Système'}
                            </p>
                            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 italic">{status.message}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4 md:col-span-2">
                            <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] block ml-6 italic">Signature Actuelle</label>
                            <div className="relative group">
                                <KeyRound className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-800 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    required
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    className="w-full bg-white/[0.02] border border-white/5 text-white pl-20 pr-16 py-6 rounded-[2.5rem] font-[1000] uppercase italic tracking-tight focus:outline-none focus:border-yellow-400/50 focus:bg-white/[0.04] transition-all placeholder:text-gray-900"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-800 hover:text-yellow-400 transition-colors"
                                >
                                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] block ml-6 italic">Nouveau Code Alpha</label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-800 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    required
                                    minLength={6}
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    className="w-full bg-white/[0.02] border border-white/5 text-white pl-20 pr-16 py-6 rounded-[2.5rem] font-[1000] uppercase italic tracking-tight focus:outline-none focus:border-yellow-400/50 focus:bg-white/[0.04] transition-all placeholder:text-gray-900"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-800 hover:text-yellow-400 transition-colors"
                                >
                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] block ml-6 italic">Confirmation Sigma</label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-800 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    minLength={6}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full bg-white/[0.02] border border-white/5 text-white pl-20 pr-16 py-6 rounded-[2.5rem] font-[1000] uppercase italic tracking-tight focus:outline-none focus:border-yellow-400/50 focus:bg-white/[0.04] transition-all placeholder:text-gray-900"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-800 hover:text-yellow-400 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black hover:bg-yellow-400 hover:scale-[1.01] py-7 rounded-[2.5rem] font-[1000] uppercase text-[11px] tracking-[0.4em] transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 group italic"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                Valider la Nouvelle Identité
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" strokeWidth={3} />
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="bg-white/[0.01] border border-white/5 p-8 rounded-[2.5rem] flex items-center gap-6 group hover:bg-white/[0.02] transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-gray-800 group-hover:text-yellow-400 transition-colors">
                    <ShieldCheck size={24} />
                </div>
                <div className="space-y-1 text-left">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] italic mb-1">Protection de Données Niveau 4</p>
                    <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.2em] italic leading-relaxed">Vos informations sont cryptées via le protocole Mato's Vault. Ne partagez jamais vos identifiants.</p>
                </div>
            </div>
        </div>
    );
}
