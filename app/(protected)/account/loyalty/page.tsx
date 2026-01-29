'use client';

import { useEffect, useState } from 'react';
import { Star, AlertCircle, Loader2, Sparkles, Trophy } from 'lucide-react';

export default function LoyaltyPage() {
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

    const points = userData?.loyaltyPoints || 0;
    const progress = (points % 500) / 5;
    const pointsToNext = 500 - (points % 500);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                Programme <span className="text-yellow-400">Fidélité</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Points Card */}
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-12 rounded-[4rem] text-gray-950 flex flex-col justify-between shadow-3xl shadow-yellow-400/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[80px] -mr-24 -mt-24 pointer-events-none group-hover:bg-white/20 transition-all duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 blur-[80px] -ml-24 -mb-24 pointer-events-none"></div>

                    <Star className="absolute top-8 right-8 w-40 h-40 text-black/5 -mr-16 -mt-16 transform rotate-12 group-hover:scale-110 group-hover:rotate-[20deg] transition-all duration-1000" />

                    <div className="relative z-10">
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-70 border-b border-black/10 pb-2 inline-block">Solde cumulé</div>
                        <div className="text-8xl font-black tracking-tighter italic leading-none">{points} <span className="text-2xl not-italic opacity-50 uppercase tracking-widest">pts</span></div>
                    </div>

                    <div className="mt-16 space-y-5 relative z-10">
                        <div className="w-full bg-black/10 rounded-full h-4 overflow-hidden p-1 backdrop-blur-sm">
                            <div
                                className="bg-white rounded-full h-full transition-all duration-1000 ease-out shadow-lg"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-4 h-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-black/60 italic">+{pointsToNext} points avant votre prochain cadeau gastronomique</p>
                        </div>
                    </div>
                </div>

                {/* Benefits List */}
                <div className="bg-gray-900/60 p-12 rounded-[4rem] border border-gray-800 space-y-10 backdrop-blur-xl">
                    <h3 className="text-2xl font-black text-white uppercase italic flex items-center gap-4">
                        <Trophy className="w-8 h-8 text-yellow-400" />
                        Privilèges Membres
                    </h3>

                    <div className="space-y-8">
                        {[
                            { num: '01', title: '1 DT = 1 Point', desc: 'Gagnez des points sur chaque millime dépensé chez Mato\'s.' },
                            { num: '02', title: 'Récompenses Flash', desc: 'Échangez vos points contre des burgers offerts ou des remises.' },
                            { num: '03', title: 'Accès Prioritaire', desc: 'Soyez le premier à goûter nos nouvelles créations limitées.' }
                        ].map((benefit, idx) => (
                            <div key={idx} className="flex gap-6 group">
                                <div className="w-12 h-12 bg-gray-950 border border-gray-800 rounded-2xl flex items-center justify-center font-black text-yellow-400 text-sm group-hover:border-yellow-400/50 transition-colors flex-shrink-0 shadow-xl">
                                    {benefit.num}
                                </div>
                                <div className="space-y-1 pt-1">
                                    <h4 className="font-black text-white uppercase tracking-widest text-xs italic">{benefit.title}</h4>
                                    <p className="text-gray-500 text-xs font-bold leading-relaxed">{benefit.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-950/50 border border-gray-800/50 p-6 rounded-3xl flex items-center gap-4">
                <AlertCircle className="w-5 h-5 text-gray-500" />
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Le programme de fidélité est personnel et non transférable. Voir conditions complètes en restaurant.</p>
            </div>
        </div>
    );
}
