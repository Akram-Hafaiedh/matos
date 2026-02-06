// app/(private)/dashboard/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Save, MapPin, Phone, Globe, Facebook, Instagram, Video, MessageCircle, Settings, Star, Signal, Activity, Zap, ShieldAlert, Cpu, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/context/ToastContext';

export default function AdminSettingsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'social' | 'maintenance'>('general');

    // Form state
    const [formData, setFormData] = useState({
        address: '',
        phone: '',
        lat: 36.8391,
        lng: 10.3200,
        facebook: '',
        instagram: '',
        tiktok: '',
        whatsapp: '',
        googleMapsUrl: ''
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
                    googleMapsUrl: data.googleMapsUrl || ''
                });
            } else {
                toast.error('Erreur lors du chargement des paramètres');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (activeTab === 'general') {
            if (!formData.address.trim() || !formData.phone.trim()) {
                toast.error('L\'adresse et le téléphone sont obligatoires');
                return;
            }
        }

        setSaving(true);

        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Paramètres synchronisés avec succès');
                router.refresh();
            } else {
                toast.error(data.error || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erreur de connexion');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-[0_0_50px_rgba(250,204,21,0.2)]"></div>
                <p className="text-gray-500 font-[1000] uppercase text-[10px] tracking-[0.5em] italic">Accessing System Core...</p>
            </div>
        );
    }

    const tabs = [
        { id: 'general', label: 'Général', icon: MapPin },
        { id: 'social', label: 'Réseaux Sociaux', icon: MessageCircle },
        { id: 'maintenance', label: 'Maintenance', icon: Cpu }
    ] as const;

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Settings size={12} className="text-yellow-400" />
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">System Configuration Matrix</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">
                        Paramètres <span className="text-yellow-400">Système</span>
                    </h1>
                    <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1">Gestion de l'infrastructure et des protocoles MATO'S</p>
                </div>
            </div>

            {/* Tab Navigation Matrix */}
            <div className="flex flex-wrap gap-3 bg-white/[0.02] p-3 rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-inner w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-4 px-10 py-5 rounded-[2rem] font-[1000] uppercase text-[10px] tracking-[0.3em] transition-all duration-700 italic border ${activeTab === tab.id
                            ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_10px_40px_rgba(250,204,21,0.15)]'
                            : 'text-gray-600 border-transparent hover:text-white'
                            }`}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-black' : 'text-gray-800 group-hover:text-yellow-400'}`} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
                {activeTab === 'general' && (
                    <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-1 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.3)]"></div>
                            <h2 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter leading-none">Coordonnées Géospatiales</h2>
                        </div>
                        <div className="bg-white/[0.01] p-12 rounded-[4rem] border border-white/5 backdrop-blur-3xl space-y-10 shadow-3xl">
                            <div className="space-y-4">
                                <label className="text-gray-800 text-[10px] font-[1000] uppercase tracking-[0.4em] italic ml-4">Adresse de l'établissement</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-800 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-18 pr-8 py-6 rounded-[2.5rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest placeholder:text-gray-900"
                                        placeholder="LOCATION COORDINATES..."
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-gray-800 text-[10px] font-[1000] uppercase tracking-[0.4em] italic ml-4">Latitude</label>
                                    <input
                                        type="number" step="any" name="lat" value={formData.lat} onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/5 text-white px-8 py-6 rounded-[2.5rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-gray-800 text-[10px] font-[1000] uppercase tracking-[0.4em] italic ml-4">Longitude</label>
                                    <input
                                        type="number" step="any" name="lng" value={formData.lng} onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/5 text-white px-8 py-6 rounded-[2.5rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-gray-800 text-[10px] font-[1000] uppercase tracking-[0.4em] italic ml-4">Contact Principal</label>
                                <div className="relative group">
                                    <Phone className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-800 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="text" name="phone" value={formData.phone} onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-18 pr-8 py-6 rounded-[2.5rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-[0.2em] font-mono"
                                        placeholder="COMMUNICATION LINE..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-gray-800 text-[10px] font-[1000] uppercase tracking-[0.4em] italic ml-4">Google Maps Vector</label>
                                <div className="relative group">
                                    <Globe className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-800 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="text" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-18 pr-8 py-6 rounded-[2.5rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest"
                                        placeholder="MAPS URL..."
                                    />
                                </div>
                            </div>
                            <button
                                type="submit" disabled={saving}
                                className="w-full bg-yellow-400 hover:bg-white text-black px-10 py-6 rounded-[2.5rem] font-[1000] text-xs uppercase tracking-[0.4em] italic transition-all duration-700 shadow-[0_20px_50px_rgba(250,204,21,0.15)] flex items-center justify-center gap-6 active:scale-95 group disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5 group-hover:scale-125 transition-transform" />}
                                Commit Changes
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'social' && (
                    <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-1 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.3)]"></div>
                            <h2 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter leading-none">Présence Sociale Matrix</h2>
                        </div>
                        <div className="bg-white/[0.01] p-12 rounded-[4rem] border border-white/5 backdrop-blur-3xl space-y-8 shadow-3xl">
                            {[
                                { name: 'facebook', icon: Facebook, label: 'Facebook', color: 'blue-500', placeholder: 'https://facebook.com/matos' },
                                { name: 'instagram', icon: Instagram, label: 'Instagram', color: 'pink-500', placeholder: 'https://instagram.com/matos' },
                                { name: 'tiktok', icon: Video, label: 'TikTok', color: 'white', placeholder: 'https://tiktok.com/@matos' },
                                { name: 'whatsapp', icon: MessageCircle, label: 'WhatsApp Number', color: 'green-500', placeholder: '21620123456' }
                            ].map((social) => (
                                <div key={social.name} className="space-y-4">
                                    <label className="text-gray-800 text-[10px] font-[1000] uppercase tracking-[0.4em] italic ml-4">{social.label}</label>
                                    <div className="relative group">
                                        <social.icon className={`absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-800 transition-colors group-focus-within:text-yellow-400`} />
                                        <input
                                            type="text"
                                            name={social.name}
                                            value={(formData as any)[social.name]}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/5 text-white pl-18 pr-8 py-6 rounded-[2.5rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest placeholder:text-gray-900"
                                            placeholder={`${social.label.toUpperCase()} LINK...`}
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                type="submit" disabled={saving}
                                className="w-full bg-yellow-400 hover:bg-white text-black px-10 py-6 rounded-[2.5rem] font-[1000] text-xs uppercase tracking-[0.4em] italic transition-all duration-700 shadow-[0_20px_50px_rgba(250,204,21,0.15)] flex items-center justify-center gap-6 active:scale-95 group mt-6"
                            >
                                {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />}
                                Sync Social Nodes
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'maintenance' && (
                    <div className="space-y-10 max-w-4xl">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-1 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.3)]"></div>
                            <h2 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter leading-none">Maintenance & System Integrity</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-10">
                            <div className="bg-white/[0.01] p-12 rounded-[4rem] border border-white/5 backdrop-blur-3xl group hover:border-yellow-400/20 transition-all duration-700 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-12 opacity-5">
                                    <Activity size={120} />
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
                                        onClick={async () => {
                                            if (!confirm('Voulez-vous vraiment lancer la synchronisation globale des points de fidélité ?')) return;
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
                                            }
                                        }}
                                        className="bg-black/40 hover:bg-yellow-400 hover:text-black text-yellow-400 px-12 py-6 rounded-[2rem] font-[1000] text-[10px] uppercase tracking-[0.3em] transition-all duration-700 border border-yellow-400/20 hover:border-transparent flex items-center gap-6 shadow-2xl active:scale-95"
                                    >
                                        <Activity className="w-5 h-5" />
                                        Execute Sync
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
                    </div>
                )}
            </div>
        </div>
    );
}

