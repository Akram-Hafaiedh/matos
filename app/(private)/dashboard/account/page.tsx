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
    Loader2,
    CheckCircle2,
    AlertCircle,
    UserCircle,
    Lock,
    KeyRound,
    ShieldCheck,
    ArrowRight,
    Eye,
    EyeOff
} from 'lucide-react';
import Image from 'next/image';

const AVATAR_OPTIONS = [
    '🍕', '🍔', '🌮', '🥗', '🍗', '🍟', '🍩', '🍦', '🥩', '🥓', '🍣', '🥟'
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
                setProfileMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
                await updateSession({
                    ...session,
                    user: {
                        ...session?.user,
                        name: profileData.name,
                        image: profileData.image
                    }
                });
            } else {
                setProfileMessage({ type: 'error', text: data.error || 'Une erreur est survenue' });
            }
        } catch (error) {
            setProfileMessage({ type: 'error', text: 'Erreur réseau lors de la mise à jour' });
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordStatus({ type: 'error', message: 'Les nouveaux mots de passe ne correspondent pas' });
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
                throw new Error(data.error || 'Erreur lors du changement de mot de passe');
            }

            setPasswordStatus({ type: 'success', message: 'Mot de passe mis à jour avec succès !' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            setPasswordStatus({ type: 'error', message: error.message });
        } finally {
            setLoadingPassword(false);
        }
    };

    if (loadingProfile) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 space-y-12">
            <div>
                <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                    Mon <span className="text-yellow-400">Compte Admin</span>
                </h1>
                <p className="text-gray-500 font-bold mt-4 uppercase tracking-wider text-xs">Gérez vos informations et votre sécurité.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Profile Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-1 bg-yellow-400 rounded-full"></div>
                        <h2 className="text-xl font-black text-white uppercase italic tracking-widest">Profil</h2>
                    </div>

                    {profileMessage && (
                        <div className={`p-6 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 ${profileMessage.type === 'success'
                            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                            : 'bg-red-500/10 border border-red-500/20 text-red-500'
                            }`}>
                            {profileMessage.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                            <span className="font-black text-xs uppercase tracking-widest">{profileMessage.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleProfileSubmit} className="bg-gray-900/40 p-8 rounded-[3rem] border border-gray-800 backdrop-blur-3xl space-y-8">
                        {/* Avatar */}
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <div className="w-32 h-32 bg-gray-950 border-2 border-yellow-400/30 rounded-[2.5rem] flex items-center justify-center text-6xl shadow-2xl overflow-hidden relative group">
                                    {profileData.image && profileData.image.length < 5 ? (
                                        <span>{profileData.image}</span>
                                    ) : profileData.image ? (
                                        <div className="relative w-full h-full">
                                            <img src={profileData.image} alt="Avatar" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <UserCircle className="w-16 h-16 text-gray-800" />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-gray-500 font-bold text-xs text-center uppercase tracking-widest">Avatar</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {AVATAR_OPTIONS.map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => setProfileData({ ...profileData, image: emoji })}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${profileData.image === emoji
                                                ? 'bg-yellow-400 scale-110 shadow-lg shadow-yellow-400/20'
                                                : 'bg-gray-950 border border-gray-800 hover:border-yellow-400/30'
                                                }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="url"
                                    placeholder="Ou URL d'image personnalisée..."
                                    value={profileData.image.length > 5 ? profileData.image : ''}
                                    onChange={(e) => setProfileData({ ...profileData, image: e.target.value })}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white px-6 py-4 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">Nom complet</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white px-6 py-4 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">Email (Non modifiable)</label>
                                <div className="w-full bg-gray-900/50 border-2 border-gray-800 text-gray-500 px-6 py-4 rounded-[1.5rem] font-bold flex items-center gap-4 opacity-50 cursor-not-allowed text-sm">
                                    {session?.user?.email}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">Téléphone</label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white px-6 py-4 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm font-mono"
                                    placeholder="+216 -- --- ---"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">Adresse</label>
                                <input
                                    type="text"
                                    value={profileData.address}
                                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                    className="w-full bg-gray-950 border-2 border-gray-800 text-white px-6 py-4 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                                    placeholder="Adresse complète..."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={savingProfile}
                            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-800 disabled:text-gray-600 text-gray-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                        >
                            {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Mettre à jour le profil
                        </button>
                    </form>
                </div>

                {/* Security Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-1 bg-yellow-400 rounded-full"></div>
                        <h2 className="text-xl font-black text-white uppercase italic tracking-widest">Sécurité</h2>
                    </div>

                    {passwordStatus.type !== 'idle' && (
                        <div className={`p-6 rounded-[2rem] flex items-center gap-4 animate-in fade-in zoom-in ${passwordStatus.type === 'success' ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
                            }`}>
                            {passwordStatus.type === 'success' ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <AlertCircle className="w-6 h-6 text-red-500" />}
                            <p className={`font-black uppercase text-xs tracking-widest ${passwordStatus.type === 'success' ? 'text-green-500' : 'text-red-500'
                                }`}>
                                {passwordStatus.message}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} className="bg-gray-900/40 p-8 rounded-[3rem] border border-gray-800 backdrop-blur-3xl space-y-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gray-950 rounded-xl flex items-center justify-center border border-gray-800">
                                <Lock className="w-6 h-6 text-yellow-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white uppercase">Changer le mot de passe</h3>
                                <p className="text-xs text-gray-500 font-bold">Sécurisez votre compte admin</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">Mot de passe actuel</label>
                                <div className="relative group">
                                    <KeyRound className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        required
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-14 pr-12 py-4 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-800 text-sm"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-yellow-400 transition-colors"
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">Nouveau mot de passe</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-14 pr-12 py-4 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-800 text-sm"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-yellow-400 transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-600 text-[10px] font-black uppercase tracking-widest ml-4">Confirmation</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-yellow-400 transition-colors" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        minLength={6}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-14 pr-12 py-4 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-800 text-sm"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-yellow-400 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loadingPassword}
                            className="w-full bg-white text-gray-950 hover:bg-yellow-400 hover:text-gray-950 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group"
                        >
                            {loadingPassword ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Changer le mot de passe
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
