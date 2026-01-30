'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Loader2, Crown, Trophy, ShieldCheck, Gem, User as UserIcon, Lock, CheckCircle2, AlertCircle, Save, Palette, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { TIERS, getUserTier } from '@/lib/loyalty';
import UserAvatar from '@/components/UserAvatar';
import EmojiPicker from '@/components/EmojiPicker';

const BACKGROUNDS = [
    { name: 'Classique', value: 'bg-yellow-400', tier: 0 },
    { name: 'Bronze', value: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white', tier: 0 },
    { name: 'Silver', value: 'bg-gradient-to-br from-gray-300 to-gray-500 text-white', tier: 1 },
    { name: 'Gold', value: 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black', tier: 2 },
    { name: 'Platinum', value: 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white', tier: 3 },
    { name: 'Obsidian', value: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white border border-gray-700', tier: 3 },
];

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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                    Mon <span className="text-yellow-400">Profil</span>
                </h2>
                {hasChanges() && (
                    <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-3 py-1 rounded-full font-bold animate-pulse">
                        Modifications non enregistrées
                    </span>
                )}
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-900/60 p-10 rounded-[3rem] border border-gray-800 backdrop-blur-xl space-y-12">

                {/* --- Identity & Avatar --- */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8 border-b border-gray-800 pb-10">
                    <UserAvatar
                        image={previewData.image}
                        name={previewData.name}
                        size={'xl'}
                        rank={userData?.rank}
                        backgroundColor={previewData.selectedBg}
                        className={`w-32 h-32 rounded-[2.5rem] border-8 transition-all duration-500 shadow-2xl ${previewData.selectedFrame ? previewData.selectedFrame : 'border-gray-800'} text-7xl`}
                    />
                    <div className="space-y-1 flex-1">
                        <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Mon identité</div>
                        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{previewData?.name || 'Utilisateur'}</h3>
                        <p className={`text-xs font-bold uppercase tracking-widest ${currentTier.textColor} flex items-center gap-2`}>
                            {currentTier.name === 'Bronze' && <ShieldCheck className="w-4 h-4" />}
                            {currentTier.name === 'Silver' && <Trophy className="w-4 h-4" />}
                            {currentTier.name === 'Gold' && <Crown className="w-4 h-4" />}
                            {currentTier.name === 'Platinum' && <Gem className="w-4 h-4" />}
                            Membre {currentTier.name}
                        </p>
                    </div>

                    {/* Quick Stats or Info */}
                    <div className="text-right hidden md:block">
                        <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Membre depuis le <br /> <span className="text-white text-xs">{new Date(userData?.createdAt).toLocaleDateString()}</span></p>
                    </div>
                </div>

                {message && (
                    <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="text-xs font-bold uppercase tracking-wider">{message.text}</span>
                    </div>
                )}

                {/* --- Editable Fields --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                        <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] block ml-4">Nom complet</label>
                        <div className="relative group">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                            <input
                                type="text"
                                value={previewData.name || ''}
                                onChange={(e) => updatePreview('name', e.target.value)}
                                className="w-full bg-gray-950 p-6 pl-16 rounded-[2rem] border border-gray-800 font-bold text-white focus:outline-none focus:border-yellow-400 focus:bg-black transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] block ml-4">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                            <div className="w-full bg-gray-900/50 p-6 pl-16 rounded-[2rem] border border-gray-800 font-bold text-gray-500 cursor-not-allowed">
                                {userData.email}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] block ml-4">Téléphone</label>
                        <div className="relative group">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                            <input
                                type="tel"
                                value={previewData.phone || ''}
                                onChange={(e) => updatePreview('phone', e.target.value)}
                                placeholder="+216 -- --- ---"
                                className="w-full bg-gray-950 p-6 pl-16 rounded-[2rem] border border-gray-800 font-bold text-white focus:outline-none focus:border-yellow-400 focus:bg-black transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] block ml-4">Adresse de livraison</label>
                        <div className="relative group">
                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                            <input
                                type="text"
                                value={previewData.address || ''}
                                onChange={(e) => updatePreview('address', e.target.value)}
                                placeholder="Votre adresse..."
                                className="w-full bg-gray-950 p-6 pl-16 rounded-[2rem] border border-gray-800 font-bold text-white focus:outline-none focus:border-yellow-400 focus:bg-black transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* --- Avatar Selection (Emoji Picker) --- */}
                <div className="space-y-6 pt-10 border-t border-gray-800">
                    <div className="flex items-end justify-between">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Votre Avatar</h3>
                            <p className="text-gray-500 text-xs font-bold mt-1">Choisissez un emoji qui vous représente.</p>
                        </div>
                        {/* Rank Icons Selection */}
                        <div className="hidden sm:flex items-center gap-2">
                            {TIERS.map((tier, idx) => {
                                const isLocked = currentTierIndex < idx;
                                return (
                                    <button
                                        key={tier.name}
                                        type="button"
                                        onClick={() => !isLocked && updatePreview('image', tier.emoji)}
                                        disabled={isLocked}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all border border-gray-800 ${isLocked ? 'opacity-30 cursor-not-allowed bg-gray-900' : 'hover:scale-110 hover:bg-gray-800 bg-gray-900 cursor-pointer'}`}
                                        title={`Icone ${tier.name}`}
                                    >
                                        <span className={`transition-all duration-300 ${isLocked ? 'filter grayscale opacity-60 scale-90' : 'group-hover:scale-110'}`}>
                                            {tier.emoji}
                                        </span>
                                        {isLocked && (
                                            <div className="absolute top-1 right-1">
                                                <Lock className="w-3 h-3 text-gray-500/70" />
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Rank Icons Mobile */}
                    <div className="flex sm:hidden items-center gap-2 mb-4">
                        {TIERS.map((tier, idx) => {
                            const isLocked = currentTierIndex < idx;
                            return (
                                <button
                                    key={tier.name}
                                    type="button"
                                    onClick={() => !isLocked && updatePreview('image', tier.emoji)}
                                    disabled={isLocked}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all border border-gray-800 ${isLocked ? 'opacity-30 cursor-not-allowed bg-gray-900' : 'hover:scale-110 hover:bg-gray-800 bg-gray-900 cursor-pointer'}`}
                                >
                                    <span className={`transition-all duration-300 ${isLocked ? 'filter grayscale opacity-60 scale-90' : 'group-hover:scale-110'}`}>
                                        {tier.emoji}
                                    </span>
                                    {isLocked && (
                                        <div className="absolute top-1 right-1">
                                            <Lock className="w-3 h-3 text-gray-500/70" />
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    <EmojiPicker
                        selected={previewData.image}
                        onSelect={(emoji) => updatePreview('image', emoji)}
                        label=""
                        allowClear={false}
                        userTierIndex={currentTierIndex}
                        loyaltyPoints={userData?.loyaltyPoints || 0}
                    />
                </div>

                {/* --- Background Selection --- */}
                <div className="space-y-6 pt-10 border-t border-gray-800">
                    <div className="flex items-end justify-between">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Votre Style</h3>
                            <p className="text-gray-500 text-xs font-bold mt-1 max-w-md">
                                Personnalisez la couleur de fond de votre avatar.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {BACKGROUNDS.map((bg) => {
                            const isNewcomer = (userData.loyaltyPoints || 0) < 100;
                            // Allow tier 0 backgrounds for newcomers if it's the classic one
                            const isLocked = bg.tier === 0 ? false : (currentTierIndex < bg.tier);
                            const isSelected = previewData.selectedBg === bg.value;

                            return (
                                <button
                                    key={bg.name}
                                    type="button"
                                    onClick={() => !isLocked && updatePreview('selectedBg', bg.value)}
                                    disabled={isLocked}
                                    className={`group relative h-16 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isSelected ? 'border-white scale-105 shadow-xl' : 'border-transparent hover:border-white/20'} ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className={`absolute inset-0 ${bg.value}`}></div>
                                    {isLocked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                            <Lock className="w-5 h-5 text-white/50" />
                                        </div>
                                    )}
                                    {!isLocked && isSelected && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <CheckCircle2 className="w-6 h-6 text-white drop-shadow-md" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-1 w-full text-center text-[8px] font-black uppercase text-white/80 tracking-widest bg-black/20 py-0.5">
                                        {bg.name}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>


                {/* --- Frame Selection Section --- */}
                <div className="space-y-6 pt-10 border-t border-gray-800">
                    <div className="flex items-end justify-between">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Cadres de Fidélité</h3>
                            <p className="text-gray-500 text-xs font-bold mt-1 max-w-md">
                                Personnalisez votre avatar avec un cadre exclusif correspondant à votre statut. Gravissez les échelons pour en débloquer davantage.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {/* Default / None */}
                        <button
                            type="button"
                            onClick={() => updatePreview('selectedFrame', null)}
                            className={`group relative p-4 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${!previewData.selectedFrame ? 'bg-white/10 border-white/40 shadow-xl' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-gray-500" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Par défaut</span>
                        </button>

                        {/* Tier Frames */}
                        {TIERS.map((tier) => {
                            const isLocked = (userData.loyaltyPoints || 0) < tier.min;
                            const isSelected = previewData.selectedFrame === tier.borderColor;

                            return (
                                <button
                                    key={tier.name}
                                    type="button"
                                    onClick={() => !isLocked && updatePreview('selectedFrame', tier.borderColor)}
                                    disabled={isLocked}
                                    className={`group relative p-4 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 overflow-hidden
                                        ${isSelected ? 'bg-white/10 border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.1)] scale-105' : 'bg-black/20 border-white/5'}
                                        ${isLocked ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-white/5 hover:border-white/20 cursor-pointer'}
                                    `}
                                >
                                    {isLocked && (
                                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                                            <Lock className="w-5 h-5 text-white/50" />
                                        </div>
                                    )}

                                    <div className={`relative w-16 h-16 rounded-2xl bg-gray-900 border-4 ${tier.borderColor} flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform`}>
                                        <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-30`}></div>
                                    </div>

                                    <div className="text-center z-10">
                                        <div className={`text-[9px] font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-gray-500'}`}>{tier.name}</div>
                                        {isLocked && <div className="text-[8px] font-bold text-gray-600 mt-0.5">{tier.min} pts</div>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-800 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving || !hasChanges()}
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
    );
}
