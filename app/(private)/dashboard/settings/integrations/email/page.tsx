'use client';

import { useState, useEffect } from 'react';
import {
    Zap, Mail, Lock, AlertCircle, Loader2, ChevronLeft, Save, Activity, Shield, Server, AtSign, Globe
} from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import TacticalAura from '@/components/TacticalAura';

export default function EmailIntegrationsPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        host: '',
        port: 587,
        user: '',
        password: '',
        from_email: '',
        from_name: "Mato's",
        encryption: 'TLS',
        is_active: true
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/admin/email/config');
            const data = await res.json();
            if (data) setConfig(data);
        } catch (error) {
            console.error('Error fetching Email config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/email/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            if (res.ok) {
                toast.success('Configuration Email Synchronisée');
            } else {
                toast.error('Erreur de synchronisation');
            }
        } catch (error) {
            toast.error('Erreur de connexion');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
            <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] italic">Extraction des Protocoles SMTP...</p>
        </div>
    );

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-700 pb-20">
            <TacticalAura />

            {/* Header Area */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="space-y-4">
                    <Link
                        href="/dashboard/settings/integrations"
                        className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-yellow-400 transition-colors group"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Retour aux Passerelles
                    </Link>
                    <div className="flex items-center gap-3">
                        <Mail size={16} className="text-yellow-400" />
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic text-yellow-500">SMTP Relay Hub</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none">
                        Email<span className="text-yellow-400"> Gateway</span>
                    </h1>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-white hover:bg-yellow-400 text-black px-12 py-6 rounded-3xl font-[1000] uppercase text-[11px] tracking-[0.3em] italic hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                    Mettre à Jour SMTP
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Configuration Panel */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-12 space-y-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/[0.02] blur-[100px] pointer-events-none"></div>

                        <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-8">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-400">
                                    <Server size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-[1000] text-white uppercase italic tracking-tighter">Vecteur SMTP</h3>
                                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest mt-1 italic">Configuration du serveur de courrier sortant</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.is_active}
                                    onChange={(e) => setConfig({ ...config, is_active: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-gray-700 after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-yellow-400 peer-checked:after:bg-black shadow-inner"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4 italic">Hôte SMTP (Relay)</label>
                                <div className="relative">
                                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                    <input
                                        type="text"
                                        value={config.host}
                                        onChange={(e) => setConfig({ ...config, host: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-6 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs italic"
                                        placeholder="smtp.gmail.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4 italic">Port de Connexion</label>
                                <div className="relative">
                                    <Zap className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                    <input
                                        type="number"
                                        value={config.port}
                                        onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-6 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs"
                                        placeholder="587"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[9px) font-black text-gray-600 uppercase tracking-widest ml-4 italic">Utilisateur SMTP</label>
                                <div className="relative">
                                    <AtSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                    <input
                                        type="text"
                                        value={config.user}
                                        onChange={(e) => setConfig({ ...config, user: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-6 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs"
                                        placeholder="hello@matos.tn"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4 italic">Mot de Passe App / SMTP</label>
                                <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                    <input
                                        type="password"
                                        value={config.password}
                                        onChange={(e) => setConfig({ ...config, password: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-6 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs"
                                        placeholder="••••••••••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6 pt-6 border-t border-white/5">
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4 italic">Email de l'Expéditeur</label>
                                <input
                                    type="text"
                                    value={config.from_email}
                                    onChange={(e) => setConfig({ ...config, from_email: e.target.value })}
                                    className="w-full bg-black/40 border border-white/5 text-white px-6 py-6 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs"
                                    placeholder="noreply@matos.tn"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4 italic">Nom de l'Expéditeur</label>
                                <input
                                    type="text"
                                    value={config.from_name}
                                    onChange={(e) => setConfig({ ...config, from_name: e.target.value })}
                                    className="w-full bg-black/40 border border-white/5 text-white px-6 py-6 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase tracking-widest"
                                    placeholder="MATO'S"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security Alert */}
                    <div className="bg-blue-400/5 border border-blue-400/10 p-10 rounded-[3rem] flex items-start gap-8">
                        <Shield className="w-8 h-8 text-blue-400 shrink-0 mt-1" />
                        <div className="space-y-4">
                            <h4 className="text-sm font-[1000] text-white uppercase italic tracking-widest">Couche de Sécurité TLS/SSL</h4>
                            <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest leading-loose italic">
                                Le système force une connexion chiffrée pour protéger les données clients. <br />
                                Si vous utilisez Gmail, créez un "Mot de passe d'application" spécifique. <br />
                                Mato's ne stocke pas vos mots de passe en clair dans les logs système.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Visual Status */}
                <div className="space-y-8">
                    <div className="bg-black/40 border border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center space-y-10 min-h-[450px] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-400/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        <div className="relative">
                            <div className={`w-36 h-36 rounded-full border-4 ${config.is_active ? 'border-blue-400 animate-pulse shadow-[0_0_50px_rgba(96,165,250,0.2)]' : 'border-gray-800'} flex items-center justify-center transition-all duration-1000`}>
                                <Mail size={56} className={config.is_active ? 'text-blue-400' : 'text-gray-800'} />
                            </div>
                        </div>

                        <div className="text-center space-y-4 relative z-10">
                            <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic leading-none">Canal Transactionnel</p>
                            <h4 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter">
                                {config.is_active ? 'SMTP ACTIVE' : 'DISABLED'}
                            </h4>
                            <div className="pt-4 flex flex-col items-center gap-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${config.is_active ? 'bg-green-500 animate-ping' : 'bg-red-500'} `}></div>
                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic">
                                        {config.host || 'DISCONNECTED'}
                                    </span>
                                </div>
                                <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10">
                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] italic font-mono">PORT {config.port} | SSL REQUIRED</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                        <div className="flex items-center gap-4">
                            <Activity className="w-4 h-4 text-blue-400" />
                            <h5 className="text-[10px] font-black text-white uppercase italic tracking-widest">Délivrabilité Flux</h5>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-widest italic">
                                    <span>Vitesse d'envoi</span>
                                    <span>High Priority</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-400 w-[95%]"></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-widest italic">
                                    <span>Reputation IP</span>
                                    <span>Clean / Neutral</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-400 w-[100%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
