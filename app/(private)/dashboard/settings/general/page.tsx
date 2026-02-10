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
        stamp_duty: 1.0
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
                    stamp_duty: data.stamp_duty || 1.0
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
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Identité & Déploiement</h2>
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
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Module Fiscal Tunisien</h2>
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
