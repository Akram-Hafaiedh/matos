'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/user/profile')
            .then(res => res.json())
            .then(data => {
                if (data.success) setUserData(data.user);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                Mon <span className="text-yellow-400">Profil</span>
            </h2>

            <div className="bg-gray-900/60 p-10 rounded-[3rem] border border-gray-800 backdrop-blur-xl space-y-12">
                <div className="flex items-center gap-8 border-b border-gray-800 pb-10">
                    <div className="w-24 h-24 rounded-[2rem] bg-gray-950 border-2 border-yellow-400/20 overflow-hidden flex items-center justify-center text-4xl shadow-2xl relative">
                        {userData?.image && userData.image.length < 5 ? (
                            <span>{userData.image}</span>
                        ) : userData?.image ? (
                            <img src={userData.image} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-700">👤</span>
                        )}
                    </div>
                    <div className="space-y-1">
                        <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Mon identité</div>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{userData?.name || 'Utilisateur'}</h3>
                        <p className="text-gray-600 font-bold text-xs">Membre privilégié</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                        <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] block ml-4">Nom complet</label>
                        <div className="flex items-center gap-5 bg-gray-950 p-6 rounded-[2rem] border border-gray-800">
                            <User className="w-5 h-5 text-yellow-400" />
                            <span className="font-bold text-white">{userData?.name || '-'}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] block ml-4">Email</label>
                        <div className="flex items-center gap-5 bg-gray-950 p-6 rounded-[2rem] border border-gray-800">
                            <Mail className="w-5 h-5 text-yellow-400" />
                            <span className="font-bold text-white">{userData?.email || '-'}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] block ml-4">Téléphone</label>
                        <div className="flex items-center gap-5 bg-gray-950 p-6 rounded-[2rem] border border-gray-800">
                            <Phone className="w-5 h-5 text-yellow-400" />
                            <span className="font-bold text-white">{userData?.phone || 'Non renseigné'}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] block ml-4">Adresse de livraison</label>
                        <div className="flex items-center gap-5 bg-gray-950 p-6 rounded-[2rem] border border-gray-800">
                            <MapPin className="w-5 h-5 text-yellow-400" />
                            <span className="font-bold text-white line-clamp-1">{userData?.address || 'Non renseignée'}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Membre depuis le {new Date(userData?.createdAt).toLocaleDateString()}</p>
                    <Link href="/account/edit" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all border border-white/10 group">
                        Modifier les informations
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
