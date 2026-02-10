'use client';

import { useState, useEffect } from 'react';
import {
    Zap, Smartphone, Lock, AlertCircle, Loader2, ChevronLeft, Save, Activity, Shield, Globe
} from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import TacticalAura from '@/components/TacticalAura';

export default function SMSIntegrationsPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        provider: 'simulator',
        api_key: '',
        api_secret: '',
        sender_id: '',
        is_active: false
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/admin/sms/config');
            const data = await res.json();
            if (data) setConfig(data);
        } catch (error) {
            console.error('Error fetching SMS config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/sms/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            if (res.ok) {
                toast.success('Configuration SMS Synchronisée');
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
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] italic">Initialisation du Spectre GSM...</p>
        </div>
    );

    const providers = [
        { id: 'simulator', name: '📟 SIMULATEUR', desc: 'Debug Console Only', color: 'gray' },
        { id: 'twilio', name: '☁️ TWILIO', desc: 'Global Standard', color: 'blue' },
        { id: 'ooredoo', name: '🔴 OOREDOO', desc: 'Tunisia Premium', color: 'red' },
        { id: 'tt', name: '🔵 TUNISIE TELECOM', desc: 'National Carrier', color: 'blue' },
        { id: 'orange', name: '🟠 ORANGE', desc: 'Tunisia Digital', color: 'orange' }
    ];

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
                        <Smartphone size={16} className="text-yellow-400" />
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic text-yellow-500">GSM Transmission Layer</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none">
                        SMS<span className="text-yellow-400"> Gateway</span>
                    </h1>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-yellow-400 hover:bg-white text-black px-12 py-6 rounded-3xl font-[1000] uppercase text-[11px] tracking-[0.3em] italic hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                    Déployer Configuration
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
                                    <Smartphone size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-[1000] text-white uppercase italic tracking-tighter">Paramètres de Flux</h3>
                                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest mt-1 italic">Activation et routage des vecteurs SMS</p>
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
                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4 italic">Transporteur Signal</label>
                                <div className="relative group/select">
                                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 z-10" />
                                    <select
                                        value={config.provider}
                                        onChange={(e) => setConfig({ ...config, provider: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-6 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs appearance-none italic cursor-pointer"
                                    >
                                        {providers.map(p => (
                                            <option key={p.id} value={p.id} className="bg-[#0a0a0a]">{p.name} - {p.desc}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4 italic">Identité de l'Expéditeur (Sender ID)</label>
                                <div className="relative">
                                    <Activity className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                    <input
                                        type="text"
                                        value={config.sender_id}
                                        onChange={(e) => setConfig({ ...config, sender_id: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-6 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase tracking-widest"
                                        placeholder="MATOS"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4 italic">Clé API (Token d'Authentification)</label>
                                <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                    <input
                                        type="password"
                                        value={config.api_key}
                                        onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-6 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs"
                                        placeholder="••••••••••••••••"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4 italic">Secret API / App ID (Optionnel)</label>
                                <div className="relative">
                                    <Shield className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                    <input
                                        type="password"
                                        value={config.api_secret}
                                        onChange={(e) => setConfig({ ...config, api_secret: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-6 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs"
                                        placeholder="••••••••••••••••"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Matrix */}
                    <div className="bg-yellow-400/5 border border-yellow-400/10 p-10 rounded-[3rem] flex items-start gap-8">
                        <AlertCircle className="w-8 h-8 text-yellow-400 shrink-0 mt-1" />
                        <div className="space-y-4">
                            <h4 className="text-sm font-[1000] text-white uppercase italic tracking-widest">Guide des Fournisseurs Tunisiens</h4>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-yellow-400/50 uppercase italic tracking-widest">Ooredoo Flux</p>
                                    <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed">Requiert une passerelle HTTP/GET ou SMPP. Contactez votre manager Ooredoo Business.</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-yellow-400/50 uppercase italic tracking-widest">TT Signal</p>
                                    <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed">Intégration via API REST sécurisée. Supporte les Sender ID personnalisés.</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-yellow-400/50 uppercase italic tracking-widest">Orange Connect</p>
                                    <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed">Plateforme Orange Business Services. API de communication unifiée.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Visual Status */}
                <div className="space-y-8">
                    <div className="bg-black/40 border border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center space-y-8 min-h-[400px] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-yellow-400/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        <div className="relative">
                            <div className={`w-32 h-32 rounded-full border-4 ${config.is_active ? 'border-yellow-400 animate-pulse shadow-[0_0_50px_rgba(250,204,21,0.2)]' : 'border-gray-800'} flex items-center justify-center transition-all duration-700`}>
                                <Smartphone size={48} className={config.is_active ? 'text-yellow-400' : 'text-gray-800'} />
                            </div>
                            {config.is_active && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-black flex items-center justify-center"
                                >
                                    <Zap size={16} className="text-white fill-white" />
                                </motion.div>
                            )}
                        </div>

                        <div className="text-center space-y-3 relative z-10">
                            <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic leading-none">Status Transmission</p>
                            <h4 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter">
                                {config.is_active ? 'LIVE SIGNAL' : 'OFFLINE'}
                            </h4>
                            <div className="pt-4 flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${config.is_active ? 'bg-green-500 animate-ping' : 'bg-red-500'} `}></div>
                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic">
                                        {config.provider.toUpperCase()} PROXY
                                    </span>
                                </div>
                                <p className="text-[8px] font-bold text-gray-800 uppercase tracking-[0.3em] font-mono">ENCRYPTION: AES-256-GCM</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <Shield className="w-4 h-4 text-yellow-400" />
                            <h5 className="text-[10px] font-black text-white uppercase italic tracking-widest">Protocoles de Sécurité</h5>
                        </div>
                        <ul className="space-y-4">
                            {['Data Isolation', 'Multi-region Routing', 'Automatic Fallback'].map((item, i) => (
                                <li key={i} className="flex items-center justify-between text-[9px] font-bold text-gray-600 uppercase tracking-widest italic">
                                    <span>{item}</span>
                                    <div className="w-1 h-1 rounded-full bg-yellow-400/30"></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
