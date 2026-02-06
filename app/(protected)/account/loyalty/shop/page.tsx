'use client';

import {
    Coins, Lock, ChevronLeft, ChevronRight, Loader2, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { SHOP_ITEMS, ITEM_TYPES } from '@/lib/loyalty';
import { useToast } from '@/app/context/ToastContext';
import TacticalAura from '@/components/TacticalAura';

export default function ShopPage() {
    const { toast } = useToast();
    const [filter, setFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [points, setPoints] = useState<number | null>(null);
    const [loadingPoints, setLoadingPoints] = useState(true);
    const itemsPerPage = 8;

    useEffect(() => {
        // Fetch profile
        fetch('/api/user/profile')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setUserData(data.user);
                    setPoints(data.user.tokens || 0);
                }
                setLoadingPoints(false);
            })
            .catch(() => setLoadingPoints(false));

        // Fetch items
        fetch('/api/shop/items')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setItems(data.items);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handlePurchase = async (item: any) => {
        if (points === null) return;

        if (points < item.price) {
            toast.error(`Jetons Insuffisants : Il vous manque ${item.price - points} jetons pour débloquer ${item.name}.`);
            return;
        }

        try {
            const res = await fetch('/api/shop/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId: item.id })
            });

            const data = await res.json();

            if (data.success) {
                toast.success(`${item.name} débloqué avec succès !`);
                setPoints(prev => (prev !== null ? prev - item.price : null));
                // Update local inventory to show "POSSÉDÉ" instantly
                setUserData((prev: any) => ({
                    ...prev,
                    inventory: [...(prev?.inventory || []), data.item]
                }));
            } else {
                toast.error(data.error || 'Erreur lors de l\'achat');
            }
        } catch (error) {
            toast.error('Erreur technique lors de l\'achat');
        }
    };

    const filteredItems = items.filter(item => filter === 'All' || item.type === filter);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16 relative z-10"
        >
            <TacticalAura color={userData?.selectedBg} opacity={0.3} />
            <div className="flex flex-wrap gap-4 pb-8 border-b border-white/5">
                {['All', ...ITEM_TYPES].map((t) => (
                    <button
                        key={t}
                        onClick={() => { setFilter(t); setCurrentPage(1); }}
                        className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'bg-[#0a0a0a] border border-white/5 text-gray-500 hover:text-white'}`}
                    >
                        {t === 'All' ? 'Tout' : t}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentItems.map((item) => {
                    const isOwned = userData?.inventory?.some((i: any) => i.item_id === item.id);

                    return (
                        <div key={item.id} className={`group ${isOwned ? 'bg-yellow-400/5 border-yellow-400/40 shadow-[0_0_40px_rgba(250,204,21,0.05)]' : 'bg-[#0a0a0a] border-white/10'} border rounded-[3rem] p-8 flex flex-col space-y-6 relative overflow-hidden transition-all hover:border-yellow-400/30 hover:shadow-2xl hover:shadow-yellow-400/5 min-h-[400px]`}>
                            <div className="flex justify-between items-start">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${item.rarity === 'Legendary' ? 'text-yellow-400 border-yellow-400/30' : 'text-gray-500 border-white/10'}`}>{item.rarity}</span>
                                {isOwned ? <Sparkles size={12} className="text-yellow-400 animate-pulse" /> : <Lock size={12} className="text-gray-800 opacity-40 group-hover:opacity-100 transition-opacity" />}
                            </div>
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="text-7xl group-hover:scale-110 transition-transform duration-700 filter drop-shadow-[0_10px_20px_rgba(255,255,255,0.05)]">{item.emoji}</div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-black uppercase italic tracking-tight text-white group-hover:text-yellow-400 transition-colors">{item.name}</h4>
                                    <p className="text-[9px] font-black uppercase text-gray-700 italic tracking-[0.2em]">{item.type}</p>
                                    {item.description && (
                                        <p className="text-[9px] font-medium text-gray-500 italic leading-tight max-w-[200px] mx-auto pt-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                                <div className="flex justify-between items-center px-1">
                                    <div className="flex items-center gap-2">
                                        <Coins size={12} className="text-yellow-500" />
                                        <span className="text-[10px] font-black italic">{item.price.toLocaleString()}</span>
                                    </div>
                                    <span className="text-[8px] font-black text-gray-700 italic">ACT {item.act}.{item.level}</span>
                                </div>
                                <button
                                    onClick={() => handlePurchase(item)}
                                    disabled={loadingPoints || isOwned}
                                    className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all italic flex items-center justify-center gap-2 ${isOwned ? 'bg-yellow-400 text-black border-yellow-400 cursor-default shadow-lg shadow-yellow-400/20' : 'bg-white/5 border border-white/10 text-gray-500 hover:bg-yellow-400 hover:text-black hover:border-yellow-400'}`}
                                >
                                    {loadingPoints ? <Loader2 size={12} className="animate-spin" /> : isOwned ? 'POSSÉDÉ' : 'Déployer Jetons'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-4">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center disabled:opacity-20 transition-all hover:bg-white/10"><ChevronLeft size={16} /></button>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-600 italic">Page {currentPage} / {totalPages}</div>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center disabled:opacity-20 transition-all hover:bg-white/10"><ChevronRight size={16} /></button>
                </div>
            )}
        </motion.div>
    );
}
