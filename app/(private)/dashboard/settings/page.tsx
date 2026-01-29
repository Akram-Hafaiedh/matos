'use client';

import { useState, useEffect } from 'react';
import { Save, MapPin, Phone, Globe, Facebook, Instagram, Video, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/context/ToastContext';

export default function AdminSettingsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
        if (!formData.address.trim() || !formData.phone.trim()) {
            toast.error('L\'adresse et le téléphone sont obligatoires');
            return;
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
                router.refresh(); // Refresh to update server components if any
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

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 space-y-12">
            <div>
                <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                    Paramètres <span className="text-yellow-400">Généraux</span>
                </h1>
                <p className="text-gray-500 font-bold mt-4 uppercase tracking-wider text-xs">Gérez les informations de votre établissement et vos réseaux sociaux.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Contact Info Section */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-1 bg-yellow-400 rounded-full"></div>
                        <h2 className="text-xl font-black text-white uppercase italic tracking-widest">Coordonnées & Contact</h2>
                    </div>

                    <div className="bg-gray-900/40 p-8 rounded-[3rem] border border-gray-800 backdrop-blur-3xl space-y-6">
                        <div className="space-y-2">
                            <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">Adresse Complète</label>
                            <div className="relative group">
                                <MapPin className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-14 pr-6 py-4 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                    placeholder="ex: 2015, 1 Rue Abderrazak Karabaka, Carthage"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">Téléphone</label>
                                <div className="relative group">
                                    <Phone className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-14 pr-6 py-4 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm font-mono"
                                        placeholder="ex: 99 956 608"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">WhatsApp</label>
                                <div className="relative group">
                                    <MessageCircle className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="text"
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleChange}
                                        className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-14 pr-6 py-4 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm font-mono"
                                        placeholder="ex: 21699956608"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">Latitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    name="lat"
                                    value={formData.lat}
                                    onChange={handleChange}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white px-6 py-4 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">Longitude</label>
                                <input
                                    type="number"
                                    step="any"
                                    name="lng"
                                    value={formData.lng}
                                    onChange={handleChange}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white px-6 py-4 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-800 disabled:text-gray-600 text-gray-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                            >
                                {saving ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></div>
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Enregistrer les coordonnées
                            </button>
                        </div>
                    </div>
                </form>

                {/* Social Media Section */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-1 bg-yellow-400 rounded-full"></div>
                        <h2 className="text-xl font-black text-white uppercase italic tracking-widest">Réseaux Sociaux</h2>
                    </div>

                    <div className="bg-gray-900/40 p-8 rounded-[3rem] border border-gray-800 backdrop-blur-3xl space-y-6">
                        <div className="space-y-2">
                            <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">Facebook</label>
                            <div className="relative group">
                                <Facebook className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    name="facebook"
                                    value={formData.facebook}
                                    onChange={handleChange}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-14 pr-6 py-4 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                    placeholder="Lien Facebook"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">Instagram</label>
                            <div className="relative group">
                                <Instagram className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-pink-500 transition-colors" />
                                <input
                                    type="text"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-14 pr-6 py-4 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                    placeholder="Lien Instagram"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">TikTok</label>
                            <div className="relative group">
                                <Video className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-white transition-colors" />
                                <input
                                    type="text"
                                    name="tiktok"
                                    value={formData.tiktok}
                                    onChange={handleChange}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-14 pr-6 py-4 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                    placeholder="Lien TikTok"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-800 disabled:text-gray-600 text-gray-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                            >
                                {saving ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></div>
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Enregistrer les réseaux
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}