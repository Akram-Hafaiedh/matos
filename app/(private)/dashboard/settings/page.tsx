'use client';

import { useState, useEffect } from 'react';
import { Save, MapPin, Phone, Globe, Facebook, Instagram, Video, MessageCircle, Settings, Star } from 'lucide-react';
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
        whatsapp: ''
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
                    whatsapp: data.whatsapp || ''
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
                toast.success('Paramètres mis à jour avec succès');
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
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    const tabs = [
        { id: 'general', label: 'Général', icon: MapPin },
        { id: 'social', label: 'Réseaux Sociaux', icon: MessageCircle },
        { id: 'maintenance', label: 'Maintenance', icon: Settings }
    ] as const;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                        Paramètres <span className="text-yellow-400">Système</span>
                    </h1>
                    <p className="text-gray-500 font-bold mt-4 uppercase tracking-wider text-xs italic">Configuration et gestion de l'infrastructure MATO'S.</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 bg-gray-900/40 p-2 rounded-[2rem] border border-gray-800 w-fit backdrop-blur-3xl">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id
                            ? 'bg-yellow-400 text-gray-900 shadow-xl shadow-yellow-400/10'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'general' && (
                    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-1 bg-yellow-400 rounded-full"></div>
                            <h2 className="text-xl font-black text-white uppercase italic tracking-widest leading-none">Coordonnées</h2>
                        </div>
                        <div className="bg-gray-900/40 p-10 rounded-[3rem] border border-gray-800 space-y-8">
                            <div className="space-y-2">
                                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">Adresse de l'établissement</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-14 pr-6 py-5 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                        placeholder="ex: Avenue Habib Bourguiba, Tunis"
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">Latitude</label>
                                    <input
                                        type="number" step="any" name="lat" value={formData.lat} onChange={handleChange}
                                        className="w-full bg-gray-950 border-2 border-gray-800 text-white px-6 py-5 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">Longitude</label>
                                    <input
                                        type="number" step="any" name="lng" value={formData.lng} onChange={handleChange}
                                        className="w-full bg-gray-950 border-2 border-gray-800 text-white px-6 py-5 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">Contact Principal</label>
                                <div className="relative group">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="text" name="phone" value={formData.phone} onChange={handleChange}
                                        className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-14 pr-6 py-5 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm font-mono"
                                        placeholder="ex: 20 123 456"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit" disabled={saving}
                                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-800 disabled:text-gray-600 text-gray-900 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
                            >
                                {saving ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900" /> : <Save className="w-4 h-4" />}
                                Enregistrer les modifications
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'social' && (
                    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-1 bg-yellow-400 rounded-full"></div>
                            <h2 className="text-xl font-black text-white uppercase italic tracking-widest leading-none">Présence Sociale</h2>
                        </div>
                        <div className="bg-gray-900/40 p-10 rounded-[3rem] border border-gray-800 space-y-6">
                            {[
                                { name: 'facebook', icon: Facebook, label: 'Facebook', color: 'blue-500', placeholder: 'https://facebook.com/matos' },
                                { name: 'instagram', icon: Instagram, label: 'Instagram', color: 'pink-500', placeholder: 'https://instagram.com/matos' },
                                { name: 'tiktok', icon: Video, label: 'TikTok', color: 'white', placeholder: 'https://tiktok.com/@matos' },
                                { name: 'whatsapp', icon: MessageCircle, label: 'WhatsApp Number', color: 'green-500', placeholder: '21620123456' }
                            ].map((social) => (
                                <div key={social.name} className="space-y-2">
                                    <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">{social.label}</label>
                                    <div className="relative group">
                                        <social.icon className={`absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-${social.color} transition-colors`} />
                                        <input
                                            type="text"
                                            name={social.name}
                                            value={(formData as any)[social.name]}
                                            onChange={handleChange}
                                            className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-14 pr-6 py-5 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                            placeholder={social.placeholder}
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                type="submit" disabled={saving}
                                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-800 disabled:text-gray-600 text-gray-900 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 mt-4"
                            >
                                {saving ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900" /> : <Save className="w-4 h-4" />}
                                Mettre à jour les réseaux
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'maintenance' && (
                    <div className="space-y-8 max-w-4xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-1 bg-red-500 rounded-full"></div>
                            <h2 className="text-xl font-black text-white uppercase italic tracking-widest leading-none">Maintenance & Système</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-gray-900/40 p-10 rounded-[3rem] border border-gray-800 backdrop-blur-3xl group hover:border-yellow-400/20 transition-all duration-500">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                                    <div className="flex items-center gap-8">
                                        <div className="w-20 h-20 bg-yellow-400/5 rounded-[2rem] border border-yellow-400/10 flex items-center justify-center text-yellow-400 group-hover:scale-110 group-hover:bg-yellow-400/10 transition-all duration-500">
                                            <Star className="w-10 h-10 fill-current" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-white font-black uppercase text-lg italic tracking-tighter">Synchronisation Fidélité</h3>
                                            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest max-w-sm leading-relaxed">
                                                Attribue les points pour les commandes livrées et active le bonus de bienvenue rétrospectivement.
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
                                        className="bg-gray-950 hover:bg-yellow-400 hover:text-gray-900 text-yellow-400 px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all border border-yellow-400/20 hover:border-transparent flex items-center gap-4 shadow-2xl active:scale-95"
                                    >
                                        <Save className="w-4 h-4" />
                                        Lancer la synchronisation
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-900/40 p-10 rounded-[3rem] border border-gray-800 backdrop-blur-3xl opacity-50 grayscale pointer-events-none">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                                    <div className="flex items-center gap-8">
                                        <div className="w-20 h-20 bg-gray-800 rounded-[2rem] flex items-center justify-center text-gray-600">
                                            <Settings className="w-10 h-10" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-white font-black uppercase text-lg italic tracking-tighter">Nettoyage Cache</h3>
                                            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest max-w-sm leading-relaxed">
                                                Bientôt disponible : optimisation automatique de la base de données et nettoyage des logs.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="px-8 py-4 bg-gray-950 border border-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">
                                        Prochainement
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

