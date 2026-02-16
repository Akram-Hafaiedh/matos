'use client';

import { useState, useEffect } from 'react';
import {
    Save, MapPin, Phone, MessageCircle, Facebook,
    Instagram, Video, Zap, Loader2, Globe,
    Coins, Receipt, Briefcase, Activity, Settings
} from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';
import TacticalAura from '@/components/TacticalAura';
import { motion } from 'framer-motion';

export default function GeneralSettingsPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        address: '',
        phone: '',
        lat: 36.8391,
        lng: 10.3200,
        facebook: '',
        instagram: '',
        tiktok: '',
        whatsapp: '',
        google_maps_url: '',
        vat_rate: 0.19,
        stamp_duty: 1.0,
        invoice_template: 'standard'
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (res.ok) {
                setFormData({
                    address: data.address || '',
                    phone: data.phone || '',
                    lat: data.lat || 36.8391,
                    lng: data.lng || 10.3200,
                    facebook: data.facebook || '',
                    instagram: data.instagram || '',
                    tiktok: data.tiktok || '',
                    whatsapp: data.whatsapp || '',
                    google_maps_url: data.google_maps_url || '',
                    vat_rate: data.vat_rate || 0.19,
                    stamp_duty: data.stamp_duty || 1.0,
                    invoice_template: data.invoice_template || 'standard'
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                toast.success('Protocoles Synchronisés');
            } else {
                toast.error('Erreur de sauvegarde');
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
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] italic">Lecture des protocoles de base...</p>
        </div>
    );

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header Area */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Activity size={12} className="text-yellow-400" />
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">Core System Parameters</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">
                        Protocoles<span className="text-yellow-400"> Système</span>
                    </h1>
                    <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1">Identité du restaurant et paramètres fiscaux de base</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-[9px] font-[1000] text-gray-700 uppercase tracking-[0.4em] italic mb-1">Status Base</p>
                        <p className="text-xs font-black text-green-500 italic uppercase">Signal Synchronisé</p>
                    </div>
                </div>
            </div>

            <main className="w-full">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-12 pb-20">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                            {/* IDENTITÉ & LOCALISATION */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="flex items-center gap-6 px-4">
                                    <div className="w-10 h-1 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.3)]"></div>
                                    <div className="flex flex-1 items-center justify-between">
                                        <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Identité & Déploiement</h2>
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="text-[9px] font-black text-yellow-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            <Save size={10} /> Enregistrer ce module
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-8 backdrop-blur-3xl relative overflow-hidden group">
                                    <TacticalAura />
                                    <div className="relative z-10 grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4 italic">Adresse Physique</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800" />
                                                <input
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-5 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                                    placeholder="ADRESSE..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4 italic">Ligne de Contact</label>
                                            <div className="relative">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800" />
                                                <input
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-5 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                                    placeholder="TEL..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3 md:col-span-2">
                                            <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4 italic">Google Maps Point</label>
                                            <div className="relative">
                                                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800" />
                                                <input
                                                    name="google_maps_url"
                                                    value={formData.google_maps_url}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-5 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                                    placeholder="LIEN MAPS..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* TUNISIAN TAX MODULE */}
                                <div className="flex items-center gap-6 px-4 pt-4">
                                    <div className="w-10 h-1 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.3)]"></div>
                                    <div className="flex flex-1 items-center justify-between">
                                        <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Module Fiscal Tunisien</h2>
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="text-[9px] font-black text-yellow-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            <Save size={10} /> Enregistrer ce module
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl relative overflow-hidden group">
                                    <div className="relative z-10 grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4 italic">Taux TVA (Ex: 0.19 pour 19%)</label>
                                            <div className="relative">
                                                <Receipt className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800" />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    name="vat_rate"
                                                    value={formData.vat_rate}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-5 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                                    placeholder="0.19"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4 italic">Timbre Fiscal (DT)</label>
                                            <div className="relative">
                                                <Coins className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800" />
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    name="stamp_duty"
                                                    value={formData.stamp_duty}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-5 rounded-2xl font-bold focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                                                    placeholder="1.0"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6 md:col-span-2">
                                            <div className="flex items-center justify-between px-4">
                                                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic">Modèle de Facture & Prévisualisation</label>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                {/* Standard Template Preview */}
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, invoice_template: 'standard' }))}
                                                    className={`group relative overflow-hidden rounded-[2rem] border-2 transition-all p-4 text-left ${formData.invoice_template === 'standard' ? 'border-yellow-400 bg-yellow-400/5' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}`}
                                                >
                                                    <div className="aspect-[4/5] bg-white rounded-xl mb-4 overflow-hidden border border-zinc-200 p-2 shadow-inner group-hover:shadow-md transition-shadow">
                                                        <div className="w-full h-full border border-zinc-100 flex flex-col p-3 space-y-1.5 bg-white">
                                                            {/* Header */}
                                                            <div className="flex justify-between items-start mb-2 border-b-2 border-zinc-50 pb-2">
                                                                <div className="space-y-1">
                                                                    <div className="h-2.5 w-12 bg-zinc-900 rounded-sm"></div>
                                                                    <div className="h-1 w-8 bg-zinc-200 rounded-sm"></div>
                                                                </div>
                                                                <div className="text-right space-y-1">
                                                                    <div className="h-1.5 w-10 bg-zinc-800 rounded-sm ml-auto"></div>
                                                                    <div className="h-1 w-14 bg-zinc-100 rounded-sm"></div>
                                                                </div>
                                                            </div>

                                                            {/* Customer Row */}
                                                            <div className="flex justify-between mb-4">
                                                                <div className="space-y-0.5">
                                                                    <div className="h-1 w-6 bg-zinc-300 rounded-sm"></div>
                                                                    <div className="h-1.5 w-14 bg-zinc-800 rounded-sm"></div>
                                                                </div>
                                                                <div className="space-y-0.5 text-right">
                                                                    <div className="h-1 w-6 bg-zinc-300 rounded-sm ml-auto"></div>
                                                                    <div className="h-1.5 w-10 bg-zinc-400 rounded-sm"></div>
                                                                </div>
                                                            </div>

                                                            {/* Item Manifest */}
                                                            <div className="flex-1 space-y-2">
                                                                <div className="border-b border-zinc-50 pb-1">
                                                                    <div className="flex justify-between items-center px-1">
                                                                        <div className="h-1.5 w-1/3 bg-zinc-100 rounded-sm"></div>
                                                                        <div className="h-1.5 w-1/4 bg-zinc-100 rounded-sm"></div>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1.5">
                                                                    {[1, 2].map(i => (
                                                                        <div key={i} className="flex justify-between items-center px-1">
                                                                            <div className="h-1.5 w-1/2 bg-zinc-50 rounded-sm"></div>
                                                                            <div className="h-1.5 w-4 bg-zinc-900 rounded-sm"></div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Summary & Brand Grid */}
                                                            <div className="grid grid-cols-2 gap-1 pt-2 border-t border-zinc-100 mb-1">
                                                                <div className="flex flex-col justify-end">
                                                                    <div className="h-4 w-full bg-zinc-50 rounded-sm border border-zinc-100/50"></div>
                                                                    <div className="h-2 w-2/3 border-zinc-200 border rounded-full mt-1 mx-auto"></div>
                                                                </div>
                                                                <div className="space-y-1 pt-1">
                                                                    <div className="flex justify-between"><div className="h-1 w-4 bg-zinc-100 rounded-sm"></div><div className="h-1 w-4 bg-zinc-800 rounded-sm"></div></div>
                                                                    <div className="flex justify-between"><div className="h-1 w-4 bg-zinc-100 rounded-sm"></div><div className="h-1 w-4 bg-zinc-800 rounded-sm"></div></div>
                                                                    <div className="flex justify-between bg-zinc-900 p-0.5 rounded-sm"><div className="h-1 w-3 bg-zinc-500 rounded-sm"></div><div className="h-1.5 w-4 bg-white rounded-sm"></div></div>
                                                                </div>
                                                            </div>

                                                            {/* Technical Footer */}
                                                            <div className="mt-auto border-t border-zinc-50 pt-1 flex justify-between items-center opacity-30">
                                                                <div className="h-1 w-1/3 bg-zinc-300 rounded-sm"></div>
                                                                <div className="h-1 w-4 bg-zinc-200 rounded-sm"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] font-black uppercase tracking-widest block">CLASSIQUE PRO</span>
                                                        <span className="text-[8px] font-black text-zinc-500 italic">80.000 DT</span>
                                                    </div>
                                                    <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter block leading-tight">Structure fiscale légale, haute lisibilité (A4/Thermique)</span>
                                                    {formData.invoice_template === 'standard' && (
                                                        <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
                                                            <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/20">
                                                                <Save size={10} className="text-black" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </button>

                                                {/* Tactical Template Preview */}
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, invoice_template: 'tactical' }))}
                                                    className={`group relative overflow-hidden rounded-[2rem] border-2 transition-all p-4 text-left ${formData.invoice_template === 'tactical' ? 'border-yellow-400 bg-yellow-400/5' : 'border-white/5 bg-white/[0.02] hover:border-white/20'}`}
                                                >
                                                    <div className="aspect-[4/5] bg-[#050505] rounded-xl mb-4 overflow-hidden border border-white/10 p-3 shadow-2xl group-hover:border-white/20 transition-all">
                                                        <div className="w-full h-full border border-white/5 flex flex-col p-3 space-y-2 bg-[url('/grid.png')] bg-repeat relative">
                                                            {/* Watermark Simulation */}
                                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] rotate-[-25deg] pointer-events-none">
                                                                <div className="border-[3px] border-white p-2 text-white font-black text-[12px] whitespace-nowrap">INVOICE VALID</div>
                                                            </div>

                                                            {/* Header */}
                                                            <div className="flex justify-between items-end mb-1 border-b border-white/10 pb-2 relative z-10">
                                                                <div className="flex items-center gap-1.5">
                                                                    <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
                                                                    <div className="h-2 w-12 bg-white rounded-sm opacity-80"></div>
                                                                </div>
                                                                <div className="h-3 w-8 bg-zinc-800 rounded-sm border border-white/10"></div>
                                                            </div>

                                                            {/* Intel Section Miniature */}
                                                            <div className="grid grid-cols-2 gap-2 mb-2 relative z-10">
                                                                <div className="h-10 bg-white/5 border border-white/5 rounded-md p-1.5">
                                                                    <div className="h-0.5 w-4 bg-yellow-400 mb-1"></div>
                                                                    <div className="h-1.5 w-full bg-white/40 rounded-sm mb-1"></div>
                                                                    <div className="h-1 w-2/3 bg-white/10 rounded-sm"></div>
                                                                </div>
                                                                <div className="space-y-1.5 pl-1.5 border-l border-white/5">
                                                                    <div className="h-1 w-full bg-white/5 rounded-sm"></div>
                                                                    <div className="h-1 w-3/4 bg-white/5 rounded-sm"></div>
                                                                    <div className="h-1 w-1/2 bg-white/5 rounded-sm"></div>
                                                                </div>
                                                            </div>

                                                            {/* Manifest Area */}
                                                            <div className="flex-1 space-y-1.5 relative z-10 bg-white/[0.02] border border-white/5 rounded p-1.5">
                                                                <div className="flex justify-between items-center opacity-20"><div className="h-0.5 w-6 bg-white"></div><div className="h-0.5 w-2 bg-white"></div></div>
                                                                {[1, 2, 3].map(i => (
                                                                    <div key={i} className="flex justify-between items-center"><div className="h-1 w-1/3 bg-white/30 rounded-sm"></div><div className="h-1 w-4 bg-white/60 rounded-sm"></div></div>
                                                                ))}
                                                            </div>

                                                            {/* Tactical Summary */}
                                                            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/10 relative z-10">
                                                                <div className="h-5 w-full bg-white/5 rounded border border-white/5"></div>
                                                                <div className="space-y-1">
                                                                    <div className="h-0.5 w-full bg-white/10 rounded-sm"></div>
                                                                    <div className="h-2 w-full bg-yellow-400 rounded-sm"></div>
                                                                </div>
                                                            </div>

                                                            {/* Master Footer Technical */}
                                                            <div className="mt-auto border-t border-white/5 pt-1 flex justify-between items-center opacity-20 relative z-10">
                                                                <div className="h-0.5 w-1/3 bg-white rounded-sm"></div>
                                                                <div className="h-0.5 w-4 bg-white rounded-sm"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] font-black uppercase tracking-widest block">MANIFESTE TACTIQUE</span>
                                                        <span className="text-[8px] font-black text-yellow-400 italic">UNIT: MOB-1</span>
                                                    </div>
                                                    <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter block leading-tight">Design Mission Matrix, esthétique "Cargo Manifest"</span>
                                                    {formData.invoice_template === 'tactical' && (
                                                        <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
                                                            <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/20">
                                                                <Save size={10} className="text-black" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SOCIAL MATRIX */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-6 px-4">
                                    <div className="w-10 h-1 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.3)]"></div>
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Matrice Sociale</h2>
                                </div>

                                <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 space-y-6">
                                    {[
                                        { name: 'facebook', icon: Facebook, label: 'Facebook' },
                                        { name: 'instagram', icon: Instagram, label: 'Instagram' },
                                        { name: 'tiktok', icon: Video, label: 'TikTok' },
                                        { name: 'whatsapp', icon: MessageCircle, label: 'WhatsApp' }
                                    ].map((social) => (
                                        <div key={social.name} className="space-y-2">
                                            <div className="relative group">
                                                <social.icon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 group-focus-within:text-yellow-400 transition-colors" />
                                                <input
                                                    name={social.name}
                                                    value={(formData as any)[social.name]}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/5 border border-white/10 text-white pl-14 pr-6 py-4 rounded-xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs"
                                                    placeholder={`${social.label.toUpperCase()} URL...`}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-6 border-t border-white/5">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="w-full bg-yellow-400 hover:bg-white text-black py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] italic transition-all flex items-center justify-center gap-4 group shadow-2xl active:scale-95"
                                        >
                                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />}
                                            Sync System Core
                                        </button>
                                    </div>
                                </div>

                                {/* STATUS CARD */}
                                <div className="bg-white/[0.01] p-10 rounded-[3rem] border border-white/5 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <Activity className="w-5 h-5 text-gray-500" />
                                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Intégrité Système</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Base de Données</span>
                                            <span className="text-[9px] font-black text-green-500 uppercase italic">Opérationnel</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Calcul Fiscal</span>
                                            <span className="text-[9px] font-black text-yellow-400 uppercase italic">Actif</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}
