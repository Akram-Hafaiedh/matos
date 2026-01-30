'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Camera,
    Save,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
    UserCircle
} from 'lucide-react';
import Link from 'next/link';
import UserAvatar from '@/components/UserAvatar';

const AVATAR_OPTIONS = [
    '🍕', '🍔', '🌮', '🥗', '🍗', '🍟', '🍩', '🍦', '🥩', '🥓', '🍣', '🥟'
];

export default function EditProfilePage() {
    const { data: session, update: updateSession } = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        image: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            const data = await res.json();
            if (data.success) {
                setFormData({
                    name: data.user.name || '',
                    phone: data.user.phone || '',
                    address: data.user.address || '',
                    image: data.user.image || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
                // Update next-auth session
                await updateSession({
                    ...session,
                    user: {
                        ...session?.user,
                        name: formData.name,
                        image: formData.image
                    }
                });
                setTimeout(() => router.push('/account'), 2000);
            } else {
                setMessage({ type: 'error', text: data.error || 'Une erreur est survenue' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur réseau lors de la mise à jour' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 shadow-2xl bg-gray-900/10 rounded-[4rem] border border-white/5 my-12">
            <Link
                href="/account"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition font-black uppercase text-xs tracking-[0.2em] mb-12 group px-8"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Retour au compte
            </Link>

            <div className="space-y-12 px-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                            Modifier mon <br />
                            <span className="text-yellow-400">Profil.</span>
                        </h1>
                        <p className="text-gray-500 font-bold mt-4">Gérez vos informations personnelles et votre avatar.</p>
                    </div>
                </div>

                {message && (
                    <div className={`p-6 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 ${message.type === 'success'
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border border-red-500/20 text-red-500'
                        }`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                        <span className="font-black text-sm uppercase tracking-widest">{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-12 pb-24">
                    {/* Avatar Selection */}
                    <div className="bg-gray-900/40 p-8 md:p-12 rounded-[3rem] border border-gray-800 backdrop-blur-3xl space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-1 text-yellow-400 bg-yellow-400 rounded-full"></div>
                            <h2 className="text-xl font-black text-white uppercase italic tracking-widest">Choix de l'avatar</h2>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <UserAvatar
                                image={formData.image}
                                name={formData.name}
                                size="xl"
                                className="border-2 border-yellow-400/30 shadow-2xl relative group overflow-hidden"
                            />

                            <div className="flex-1 space-y-4">
                                <p className="text-gray-500 font-bold text-sm">Sélectionnez une icône qui vous ressemble ou entrez l'URL d'une image :</p>
                                <div className="flex flex-wrap gap-3">
                                    {AVATAR_OPTIONS.map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, image: emoji })}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${formData.image === emoji
                                                ? 'bg-yellow-400 scale-110 shadow-lg shadow-yellow-400/20'
                                                : 'bg-gray-950 border border-gray-800 hover:border-yellow-400/30'
                                                }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                                <div className="pt-4">
                                    <input
                                        type="url"
                                        placeholder="URL de votre image personnalisée..."
                                        value={formData.image.length > 5 ? formData.image : ''}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full bg-gray-950 border-2 border-gray-800 text-white px-6 py-4 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="bg-gray-900/40 p-8 md:p-12 rounded-[3rem] border border-gray-800 backdrop-blur-3xl space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-1 text-yellow-400 bg-yellow-400 rounded-full"></div>
                            <h2 className="text-xl font-black text-white uppercase italic tracking-widest">Informations Personnelles</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <User className="w-3 h-3" /> Nom complet
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white px-6 py-5 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> Email
                                </label>
                                <div className="w-full bg-gray-900/50 border-2 border-gray-800 text-gray-500 px-6 py-5 rounded-[1.5rem] font-bold flex items-center gap-4 opacity-50 cursor-not-allowed text-sm">
                                    {session?.user?.email}
                                </div>
                                <p className="text-[10px] text-gray-700 font-bold ml-1 italic">* L'email ne peut pas être modifié.</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Phone className="w-3 h-3" /> Téléphone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white px-6 py-5 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all font-mono"
                                    placeholder="+216 -- --- ---"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> Adresse de livraison
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white px-6 py-5 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all"
                                    placeholder="N° de rue, Immeuble, Ville..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-800 disabled:text-gray-600 text-gray-900 px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-yellow-400/20 active:scale-95 flex items-center gap-3"
                        >
                            {saving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            Enregistrer les modifications
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
