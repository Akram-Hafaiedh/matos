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
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-4xl font-black text-white mb-2">
                    <span className="text-yellow-400">Paramètres</span> Généraux
                </h1>
                <p className="text-gray-400">Gérez les informations de votre établissement et vos réseaux sociaux</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Info Section */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <MapPin className="text-yellow-400" />
                        Coordonnées & Contact
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-2">Adresse Complète</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                                placeholder="ex: 2015, 1 Rue Abderrazak Karabaka, Carthage"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Téléphone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                                placeholder="ex: 99 956 608"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">WhatsApp (ex: 21699956608)</label>
                            <input
                                type="text"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                                placeholder="ex: 21699956608"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                name="lat"
                                value={formData.lat}
                                onChange={handleChange}
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                name="lng"
                                value={formData.lng}
                                onChange={handleChange}
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Globe className="text-yellow-400" />
                        Réseaux Sociaux
                    </h2>

                    <div className="site-input-group space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Facebook className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                name="facebook"
                                value={formData.facebook}
                                onChange={handleChange}
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                                placeholder="Lien Facebook"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Instagram className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                                placeholder="Lien Instagram"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Video className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                name="tiktok"
                                value={formData.tiktok}
                                onChange={handleChange}
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
                                placeholder="Lien TikTok"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-xl font-black text-lg transition-all shadow-xl shadow-yellow-400/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900"></div>
                                Sauvegarde...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Enregistrer les modifications
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}