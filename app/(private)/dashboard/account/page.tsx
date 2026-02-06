// app/(private)/dashboard/account/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    User, Mail, Phone, MapPin, Camera, Save, Loader2, CheckCircle2,
    AlertCircle, UserCircle, Lock, KeyRound, ShieldCheck, ArrowRight,
    Eye, EyeOff, Signal, Activity, Zap, ShieldAlert, Cpu, Sparkles
} from 'lucide-react';
import Image from 'next/image';

const AVATAR_OPTIONS = [
    '👦', '👧', '🍕', '🍔', '🌮', '🥗', '🍗', '🍟', '🍩', '🍦', '🥩', '🥓', '🍣', '🥟'
];

export default function AdminAccountPage() {
    const { data: session, update: updateSession } = useSession();
    const router = useRouter();

    // Profile State
    const [profileData, setProfileData] = useState({
        name: '',
        phone: '',
        address: '',
        image: ''
    });
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [passwordStatus, setPasswordStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            const data = await res.json();
            if (data.success) {
                setProfileData({
                    name: data.user.name || '',
                    phone: data.user.phone || '',
                    address: data.user.address || '',
                    image: data.user.image || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);
        setProfileMessage(null);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData)
            });

            const data = await res.json();

            if (data.success) {
                setProfileMessage({ type: 'success', text: 'Protocoles de profil synchronisés !' });
                await updateSession({
                    ...session,
                    user: {
                        ...session?.user,
                        name: profileData.name,
                        image: profileData.image
                    }
                });
            } else {
                setProfileMessage({ type: 'error', text: data.error || 'Erreur d\'identification' });
            }
        } catch (error) {
            setProfileMessage({ type: 'error', text: 'Echec de transmission réseau' });
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordStatus({ type: 'error', message: 'Désaccord des vecteurs de sécurité' });
            return;
        }

        setLoadingPassword(true);
        setPasswordStatus({ type: 'idle', message: '' });

        try {
            const res = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Accès Refusé');
            }

            setPasswordStatus({ type: 'success', message: 'Vecteur d\'accès réinitialisé !' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            setPasswordStatus({ type: 'error', message: error.message });
        } finally {
            setLoadingPassword(false);
        }
    };

    if (loadingProfile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-[0_0_50px_rgba(250,204,21,0.2)]"></div>
                <p className="text-gray-500 font-[1000] uppercase text-[10px] tracking-[0.5em] italic">Accessing Personnel Files...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <User size={12} className="text-yellow-400" />
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">Personnel Identification Matrix</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">
                        Mon <span className="text-yellow-400">Compte Admin</span>
                    </h1>
                    <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1">Gestion des privilèges et vecteurs de sécurité MATO'S</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Profile Section Matrix */}
                <div className="space-y-10">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-1 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.3)]"></div>
                        <h2 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter leading-none">Profil Identité</h2>
                    </div>

                    {profileMessage && (
                        <div className={`p-8 rounded-[2.5rem] flex items-center gap-6 animate-in slide-in-from-top-10 duration-700 border backdrop-blur-3xl shadow-3xl ${profileMessage.type === 'success'
                            ? 'bg-green-500/5 border-green-500/20 text-green-400'
                            : 'bg-red-500/5 border-red-500/20 text-red-500'
                            }`}>
                            {profileMessage.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                            <span className="font-[1000] text-xs uppercase tracking-[0.3em] italic">{profileMessage.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleProfileSubmit} className="bg-white/[0.01] p-12 rounded-[4rem] border border-white/5 backdrop-blur-3xl space-y-12 shadow-3xl">
                        {/* Avatar Matrix */}
                        <div className="space-y-8">
                            <div className="flex justify-center">
                                <div className="w-40 h-40 bg-black/60 border-2 border-yellow-400/30 rounded-[3rem] flex items-center justify-center text-7xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    {profileData.image && profileData.image.length < 5 ? (
                                        <span className="relative z-10">{profileData.image}</span>
                                    ) : profileData.image ? (
                                        <div className="relative w-full h-full">
                                            <img src={profileData.image} alt="Avatar" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                        </div>
                                    ) : (
                                        <UserCircle className="w-20 h-20 text-gray-800" />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <p className="text-gray-800 font-[1000] text-[10px] text-center uppercase tracking-[0.4em] italic">Sélection d'Avatar</p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {AVATAR_OPTIONS.map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => setProfileData({ ...profileData, image: emoji })}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 border ${profileData.image === emoji
                                                ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_10px_30px_rgba(250,204,21,0.2)] scale-110'
                                                : 'bg-black/40 border-white/5 text-gray-600 hover:border-yellow-400/30'
                                                }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative group">
                                    <Camera className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="url"
                                        placeholder="Vecteur d'image personnalisé..."
                                        value={profileData.image.length > 5 ? profileData.image : ''}
                                        onChange={(e) => setProfileData({ ...profileData, image: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-16 pr-8 py-5 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest placeholder:text-gray-900"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-gray-800 text-[10px] font-[1000] uppercase tracking-[0.4em] italic ml-4">Codename / Signature</label>
                                <div className="relative group">
                                    <User className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-16 pr-8 py-6 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-gray-800 text-[10px] font-[1000] uppercase tracking-[0.4em] italic ml-4">Email Principal (Protégé)</label>
                                <div className="w-full bg-black/20 border border-white/5 text-gray-700 pl-16 pr-8 py-6 rounded-[2rem] font-[1000] flex items-center gap-4 opacity-50 cursor-not-allowed text-xs uppercase italic tracking-widest relative">
                                    <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-900" />
                                    {session?.user?.email}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-gray-800 text-[10px] font-[1000] uppercase tracking-[0.4em] italic ml-4">Fréquence de Contact</label>
                                <div className="relative group">
                                    <Phone className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-16 pr-8 py-6 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-[0.2em] font-mono"
                                        placeholder="+216 -- --- ---"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-gray-800 text-[10px] font-[1000] uppercase tracking-[0.4em] italic ml-4">Secteur de Déploiement</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type="text"
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-16 pr-8 py-6 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest"
                                        placeholder="Coordonnées de livraison..."
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={savingProfile}
                            className="w-full bg-yellow-400 hover:bg-white text-black px-10 py-6 rounded-[2.5rem] font-[1000] text-xs uppercase tracking-[0.4em] italic transition-all duration-700 shadow-[0_20px_50px_rgba(250,204,21,0.15)] flex items-center justify-center gap-6 active:scale-95 group disabled:opacity-50"
                        >
                            {savingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:scale-125 transition-transform" />}
                            Sync Personnel Database
                        </button>
                    </form>
                </div>

                {/* Security Section Matrix */}
                <div className="space-y-10">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-1 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.3)]"></div>
                        <h2 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter leading-none">Vecteurs de Sécurité</h2>
                    </div>

                    {passwordStatus.type !== 'idle' && (
                        <div className={`p-8 rounded-[2.5rem] flex items-center gap-6 animate-in zoom-in duration-700 border backdrop-blur-3xl shadow-3xl ${passwordStatus.type === 'success' ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                            {passwordStatus.type === 'success' ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <ShieldAlert className="w-6 h-6 text-red-500" />}
                            <p className={`font-[1000] uppercase text-xs tracking-[0.3em] italic ${passwordStatus.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                {passwordStatus.message}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} className="bg-white/[0.01] p-12 rounded-[4rem] border border-white/5 backdrop-blur-3xl space-y-10 shadow-3xl">
                        <div className="flex items-center gap-6 mb-4">
                            <div className="w-16 h-16 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                                <Lock className="w-8 h-8 text-yellow-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-[1000] text-white uppercase italic tracking-tighter">Réinitialiser Accès</h3>
                                <p className="text-[10px] text-gray-800 font-bold uppercase tracking-[0.2em] italic">Fréquence de rotation recommandée : 30 jours</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-gray-800 text-[10px] font-[1000] uppercase tracking-[0.4em] italic ml-4">Accès Actuel (PIN)</label>
                                <div className="relative group">
                                    <KeyRound className="absolute left-8 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-800 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        required
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-16 pr-16 py-6 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-900 text-xs tracking-[0.5em]"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-yellow-400 transition-colors"
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-gray-800 text-[10px] font-[1000] uppercase tracking-[0.4em] italic ml-4">Nouveau Vecteur</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-8 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-800 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-16 pr-16 py-6 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-900 text-xs tracking-[0.5em]"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-yellow-400 transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-gray-800 text-[10px] font-[1000] uppercase tracking-[0.4em] italic ml-4">Validation Vecteur</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-8 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-800 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white pl-16 pr-16 py-6 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-900 text-xs tracking-[0.5em]"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-yellow-400 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loadingPassword}
                            className="w-full bg-white hover:bg-yellow-400 text-black py-6 rounded-[2.5rem] font-[1000] uppercase text-xs tracking-[0.4em] transition-all duration-700 shadow-[0_20px_50px_rgba(255,255,255,0.05)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-6 group italic"
                        >
                            {loadingPassword ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Commit Security Vector
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
