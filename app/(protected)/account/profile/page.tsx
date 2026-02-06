'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Loader2, Crown, Trophy, ShieldCheck, Gem, User as UserIcon, Lock, CheckCircle2, AlertCircle, Save, Palette, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { TIERS, getUserTier } from '@/lib/loyalty';
import UserAvatar from '@/components/UserAvatar';
import EmojiPicker from '@/components/EmojiPicker';
import TacticalAura from '@/components/TacticalAura';



export default function ProfilePage() {
    const { data: session, update: updateSession } = useSession();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Preview State - initialized with userData when loaded
    const [previewData, setPreviewData] = useState<any>(null);

    // Form State
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetch('/api/user/profile')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUserData(data.user);
                    setPreviewData(data.user);
                }
                setLoading(false);
            });
    }, []);

    const updatePreview = (key: string, value: any) => {
        setPreviewData((prev: any) => ({ ...prev, [key]: value }));
    };

    const hasChanges = () => {
        if (!userData || !previewData) return false;
        return JSON.stringify(userData) !== JSON.stringify(previewData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const payload = {
                name: previewData.name,
                phone: previewData.phone,
                address: previewData.address,
                image: previewData.image,
                selectedBg: previewData.selectedBg,
                selectedFrame: previewData.selectedFrame
            };

            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
                // Update next-auth session
                await updateSession({
                    ...session,
                    user: {
                        ...session?.user,
                        name: previewData.name,
                        image: previewData.image,
                        selectedBg: previewData.selectedBg,
                        selectedFrame: previewData.selectedFrame
                    }
                });
                setUserData(previewData); // Sync userData with saved changes
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
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
            </div>
        );
    }

    if (!userData || !previewData) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <p className="text-red-500 font-bold">Impossible de charger le profil.</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-gray-800 rounded-xl text-white">Réessayer</button>
            </div>
        );
    }

    const currentTier = getUserTier(userData?.loyaltyPoints || 0);
    const currentTierIndex = TIERS.findIndex(t => t.name === currentTier.name);

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-1000">
            <TacticalAura opacity={0.5} />
            <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-12 border-b border-white/5 pb-16">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-400/20 bg-yellow-400/5 backdrop-blur-md">
                        <UserIcon className="w-3 h-3 text-yellow-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-400">Identity Matrix Control</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-none text-white">
                        VOTRE <span className="text-yellow-400 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">PROFIL</span>
                    </h1>
                </div>
                {hasChanges() && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 px-8 py-5 rounded-[2rem] bg-yellow-400/5 border border-yellow-400/20 shadow-2xl"
                    >
                        <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)] animate-pulse"></div>
                        <span className="text-[10px] text-yellow-400 font-[1000] uppercase tracking-widest italic">
                            Modifications en Attente
                        </span>
                    </motion.div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="bg-[#0a0a0a] p-10 md:p-16 rounded-[4rem] border border-white/10 relative overflow-hidden space-y-20 shadow-3xl">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400/5 blur-[120px] rounded-full -mr-80 -mt-80 opacity-40"></div>

                {/* --- Identity & Avatar --- */}
                <div className="flex flex-col md:flex-row items-center gap-10 border-b border-white/5 pb-16">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-yellow-400/20 blur-[40px] rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <UserAvatar
                            image={previewData.image}
                            name={previewData.name}
                            size={'xl'}
                            rank={userData?.rank}
                            backgroundColor={previewData.selectedBg}
                            className={`w-40 h-40 rounded-[2.5rem] border-8 transition-all duration-700 shadow-2xl relative z-10 ${previewData.selectedFrame ? previewData.selectedFrame : 'border-white/5'} text-8xl`}
                        />
                    </div>
                    <div className="space-y-3 flex-1 text-center md:text-left">
                        <div className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] italic mb-1">Détention du Titre</div>
                        <h3 className="text-4xl font-[1000] text-white italic tracking-tighter uppercase leading-none">{previewData?.name || 'Utilisateur'}</h3>
                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${currentTier.textColor} flex items-center justify-center md:justify-start gap-2 italic`}>
                            {currentTier.name === 'Bronze' && <ShieldCheck className="w-3.5 h-3.5" />}
                            {currentTier.name === 'Silver' && <Trophy className="w-3.5 h-3.5" />}
                            {currentTier.name === 'Gold' && <Crown className="w-3.5 h-3.5" />}
                            {currentTier.name === 'Platinum' && <Gem className="w-3.5 h-3.5" />}
                            HÉRITAGE {currentTier.name}
                        </p>
                    </div>

                    {/* Quick Stats or Info */}
                    <div className="text-right hidden lg:block">
                        <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.4em] italic leading-relaxed">Activation du Compte<br /> <span className="text-white text-[11px] font-[1000] tracking-widest">{new Date(userData?.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span></p>
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="text-xs font-bold uppercase tracking-wider">{message.text}</span>
                    </div>
                )}

                {/* --- Editable Fields --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                    <div className="space-y-4">
                        <label className="text-gray-600 text-[9px] font-black uppercase tracking-[0.5em] block ml-4 italic">Signature Nominale</label>
                        <div className="relative group">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-yellow-400 transition-colors" />
                            <input
                                type="text"
                                value={previewData.name || ''}
                                onChange={(e) => updatePreview('name', e.target.value)}
                                className="w-full bg-white/[0.01] p-6 pl-16 rounded-3xl border border-white/5 font-[1000] text-sm uppercase italic tracking-tight text-white focus:outline-none focus:border-yellow-400 focus:bg-white/[0.03] transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-gray-600 text-[9px] font-black uppercase tracking-[0.5em] block ml-4 italic">Canal Digitale</label>
                        <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800" />
                            <div className="w-full bg-black/40 p-6 pl-16 rounded-3xl border border-white/5 font-[1000] text-sm uppercase italic tracking-tight text-gray-700 cursor-not-allowed">
                                {userData.email}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-gray-600 text-[9px] font-black uppercase tracking-[0.5em] block ml-4 italic">Ligne Directe</label>
                        <div className="relative group">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-yellow-400 transition-colors" />
                            <input
                                type="tel"
                                value={previewData.phone || ''}
                                onChange={(e) => updatePreview('phone', e.target.value)}
                                placeholder="+216 -- --- ---"
                                className="w-full bg-white/[0.01] p-6 pl-16 rounded-3xl border border-white/5 font-[1000] text-sm uppercase italic tracking-tight text-white focus:outline-none focus:border-yellow-400 focus:bg-white/[0.03] transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-gray-600 text-[9px] font-black uppercase tracking-[0.5em] block ml-4 italic">Lieu de Livraison</label>
                        <div className="relative group">
                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-yellow-400 transition-colors" />
                            <input
                                type="text"
                                value={previewData.address || ''}
                                onChange={(e) => updatePreview('address', e.target.value)}
                                placeholder="Votre adresse..."
                                className="w-full bg-white/[0.01] p-6 pl-16 rounded-3xl border border-white/5 font-[1000] text-sm uppercase italic tracking-tight text-white focus:outline-none focus:border-yellow-400 focus:bg-white/[0.03] transition-all"
                            />
                        </div>
                    </div>
                </div>


                <div className="pt-16 border-t border-white/5 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving || !hasChanges()}
                        className="bg-yellow-400 hover:bg-white disabled:bg-white/5 disabled:text-gray-700 text-black px-16 py-6 rounded-[2rem] font-[1000] text-[11px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-yellow-400/10 active:scale-95 flex items-center gap-4 italic"
                    >
                        {saving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        Graver les Changements
                    </button>
                </div>
            </form>
        </div>
    );
}
