'use client';

import { useState, useEffect } from 'react';
import { Save, MapPin, Phone, MessageCircle, Facebook, Instagram, Video, Zap, Loader2, Globe } from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';

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
        google_maps_url: ''
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
                    google_maps_url: data.google_maps_url || ''
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
                toast.success('Paramètres synchronisés');
            } else {
                toast.error('Erreur lors de la sauvegarde');
            }
        } catch (error) {
            toast.error('Erreur de connexion');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null;

    return (
        <form onSubmit={handleSubmit} className="space-y-12 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Core Data */}
                <div className="space-y-8">
                    <div className="flex items-center gap-6">
                        <div className="w-10 h-1 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.3)]"></div>
                        <h2 className="text-xl font-[1000] text-white uppercase italic tracking-tighter leading-none">Identité & Localisation</h2>
                    </div>

                    <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 space-y-8 backdrop-blur-3xl">
                        <div className="space-y-3">
                            <label className="text-gray-800 text-[9px] font-[1000] uppercase tracking-widest ml-4 italic">Adresse Physique</label>
                            <div className="relative group">
                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 group-focus-within:text-yellow-400" />
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-5 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs"
                                    placeholder="ADRESSE..."
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-gray-800 text-[9px] font-[1000] uppercase tracking-widest ml-4 italic">Ligne Directe</label>
                            <div className="relative group">
                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 group-focus-within:text-yellow-400" />
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-5 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs"
                                    placeholder="PHONE..."
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-gray-800 text-[9px] font-[1000] uppercase tracking-widest ml-4 italic">Google Maps URL</label>
                            <div className="relative group">
                                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 group-focus-within:text-yellow-400" />
                                <input
                                    name="google_maps_url"
                                    value={formData.google_maps_url}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-5 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs"
                                    placeholder="URL MAPS..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Matrix */}
                <div className="space-y-8">
                    <div className="flex items-center gap-6">
                        <div className="w-10 h-1 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.3)]"></div>
                        <h2 className="text-xl font-[1000] text-white uppercase italic tracking-tighter leading-none">Matrice Sociale</h2>
                    </div>

                    <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 space-y-6 backdrop-blur-3xl">
                        {[
                            { name: 'facebook', icon: Facebook, label: 'Facebook' },
                            { name: 'instagram', icon: Instagram, label: 'Instagram' },
                            { name: 'tiktok', icon: Video, label: 'TikTok' },
                            { name: 'whatsapp', icon: MessageCircle, label: 'WhatsApp' }
                        ].map((social) => (
                            <div key={social.name} className="relative group">
                                <social.icon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 group-focus-within:text-yellow-400" />
                                <input
                                    name={social.name}
                                    value={(formData as any)[social.name]}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-6 py-4 rounded-xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs"
                                    placeholder={`${social.label.toUpperCase()} LINK...`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Commit bar */}
            <div className="flex justify-end pt-6 border-t border-white/5">
                <button
                    type="submit"
                    disabled={saving}
                    className="bg-yellow-400 hover:bg-white text-black px-12 py-6 rounded-[2rem] font-[1000] text-[10px] uppercase tracking-[0.4em] italic transition-all duration-700 shadow-2xl flex items-center gap-6 active:scale-95 group"
                >
                    {saving ? <Loader2 className="animate-spin w-5 h-5 text-black" /> : <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />}
                    Sync System Core
                </button>
            </div>
        </form>
    );
}
