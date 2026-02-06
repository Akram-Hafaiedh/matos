// app/(private)/dashboard/reviews/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Star, MessageSquare, CheckCircle, XCircle, Search, Trash2, Home, Signal, Activity, Sparkles, Hash } from 'lucide-react';

interface User {
    name: string | null;
    role: string;
    image: string | null;
}

interface MenuItem {
    name: string;
}

interface Review {
    id: number;
    userId: string;
    menuItemId: number;
    rating: number;
    comment: string | null;
    showOnHome: boolean;
    createdAt: string;
    user: User;
    menuItem: MenuItem;
}

export default function ReviewsManagement() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/reviews');
            const data = await res.json();
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleHomeStatus = async (review: Review) => {
        try {
            const res = await fetch('/api/admin/reviews', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: review.id, showOnHome: !review.showOnHome })
            });
            if (res.ok) {
                setReviews(prev => prev.map(r => r.id === review.id ? { ...r, showOnHome: !r.showOnHome } : r));
            }
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    const filteredReviews = reviews.filter(r =>
        (r.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (r.comment?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (r.menuItem?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
    );

    return (
        <div className="w-full pb-20 space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <MessageSquare size={12} className="text-yellow-400" />
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">Feedback Intelligence</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">
                        Gestion des <span className="text-yellow-400">Avis</span>
                    </h1>
                    <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1">Analyse des témoignages et protocoles d'affichage ({reviews.length} signaux)</p>
                </div>

                <div className="relative group w-full xl:w-96">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-700 w-5 h-5 group-focus-within:text-yellow-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Scanner les témoignages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 text-white pl-16 pr-8 py-6 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest placeholder:text-gray-800"
                    />
                </div>
            </div>

            {/* Table Matrix Container */}
            <div className="bg-white/[0.01] rounded-[4rem] border border-white/5 backdrop-blur-3xl overflow-hidden shadow-3xl relative">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Messenger</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Signal & Content</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Vector (Product)</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none text-center">Home Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredReviews.map((review) => (
                                <tr key={review.id} className="group/row hover:bg-yellow-400/[0.01] transition-all duration-500 relative">
                                    <td className="px-12 py-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-black border border-white/5 rounded-[1.8rem] flex items-center justify-center text-3xl shadow-inner group-hover/row:border-yellow-400/30 transition-all duration-700 group-hover:scale-110">
                                                {review.user?.image || '👤'}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="font-[1000] text-white italic uppercase tracking-tighter text-xl leading-none group-hover/row:text-yellow-400 transition-colors">{review.user?.name || 'ANONYMOUS CLIENT'}</div>
                                                <div className="text-[10px] text-yellow-400/40 font-[1000] uppercase tracking-[0.2em] italic">{review.user?.role || 'CLIENT'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10 max-w-lg">
                                        <div className="space-y-4">
                                            <div className="flex gap-1.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} className={`${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-800'}`} strokeWidth={3} />
                                                ))}
                                            </div>
                                            <p className="text-gray-500 text-sm font-bold italic leading-relaxed uppercase tracking-widest opacity-80 group-hover/row:opacity-100 transition-opacity">
                                                "{review.comment || 'NO VERBAL FEEDBACK TRANSMITTED.'}"
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-black/40 border border-white/5 rounded-[1.5rem] text-[10px] font-[1000] uppercase tracking-[0.2em] text-gray-400 italic group-hover/row:border-yellow-400/30 transition-all">
                                            <Hash size={12} className="text-yellow-400/50" />
                                            {review.menuItem?.name || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => toggleHomeStatus(review)}
                                                className={`group/sw flex items-center gap-4 px-10 py-4 rounded-[1.8rem] font-[1000] text-[10px] uppercase tracking-[0.3em] transition-all duration-700 italic border ${review.showOnHome
                                                    ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_15px_30px_rgba(250,204,21,0.2)]'
                                                    : 'bg-white/[0.02] text-gray-700 border-white/5 hover:border-white/20 hover:text-white'
                                                    }`}
                                            >
                                                <Home className={`w-4 h-4 ${review.showOnHome ? 'fill-black' : ''}`} />
                                                {review.showOnHome ? 'TRANSMITTING' : 'ARCHIVED'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-20 flex flex-col items-center justify-center scale-90 opacity-0 animate-in fade-in zoom-in duration-500 fill-mode-forwards space-y-6">
                        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-[0_0_50px_rgba(250,204,21,0.2)]"></div>
                        <p className="text-gray-400 font-[1000] uppercase text-[10px] tracking-[0.6em] italic animate-pulse">Syncing Sensors...</p>
                    </div>
                )}

                {!loading && filteredReviews.length === 0 && (
                    <div className="py-60 text-center space-y-8">
                        <div className="bg-white/[0.02] p-12 rounded-[4rem] border border-white/5 border-dashed w-fit mx-auto relative group">
                            <div className="absolute inset-0 bg-yellow-400/5 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Signal className="w-20 h-20 text-gray-800 relative z-10" strokeWidth={1} />
                        </div>
                        <h3 className="text-4xl font-[1000] text-white italic uppercase tracking-tighter">Frequency Silent</h3>
                        <p className="text-gray-700 font-black text-[10px] uppercase tracking-[0.5em] italic">Aucun feedback détecté sur cette longueur d'onde.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
