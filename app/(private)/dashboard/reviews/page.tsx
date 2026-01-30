'use client';

import { useEffect, useState } from 'react';
import { Star, MessageSquare, CheckCircle, XCircle, Search, Trash2, Home } from 'lucide-react';

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
        (r.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (r.comment?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        r.menuItem.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-5xl font-black text-white mb-2 uppercase italic tracking-tighter">
                    Gestion des <span className="text-yellow-400">Avis</span>
                </h1>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Gérez les témoignages clients et leur affichage sur la page d'accueil</p>
            </div>

            {/* Toolbar */}
            <div className="bg-gray-900/40 p-8 rounded-[3rem] border border-gray-800 backdrop-blur-3xl shadow-3xl">
                <div className="relative group max-w-xl">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-yellow-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Rechercher par client, commentaire ou produit..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-16 pr-8 py-5 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-gray-900/30 rounded-[3rem] border border-gray-800 backdrop-blur-3xl overflow-hidden shadow-3xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800/50 bg-gray-950/20">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Client</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Note & Commentaire</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Produit</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Page d'accueil</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {filteredReviews.map((review) => (
                                <tr key={review.id} className="group hover:bg-white/[0.02] transition duration-500">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-950 border border-gray-800 rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:border-yellow-400/30 transition-colors">
                                                {review.user.image || '👤'}
                                            </div>
                                            <div>
                                                <div className="font-black text-white italic uppercase tracking-tighter">{review.user.name || 'Client Anonyme'}</div>
                                                <div className="text-[8px] text-yellow-400/50 font-black uppercase tracking-[0.2em]">{review.user.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 max-w-md">
                                        <div className="flex gap-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'}`} />
                                            ))}
                                        </div>
                                        <p className="text-gray-400 text-sm italic line-clamp-2">"{review.comment}"</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-300">
                                            {review.menuItem.name}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => toggleHomeStatus(review)}
                                                className={`group/sw flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 border-2 ${review.showOnHome
                                                        ? 'bg-yellow-400 text-gray-900 border-yellow-400'
                                                        : 'bg-gray-950 text-gray-500 border-gray-800 hover:border-gray-600'
                                                    }`}
                                            >
                                                <Home className={`w-4 h-4 ${review.showOnHome ? 'fill-gray-900' : ''}`} />
                                                {review.showOnHome ? 'Affiché' : 'Masqué'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="p-20 flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
                    </div>
                )}

                {!loading && filteredReviews.length === 0 && (
                    <div className="p-20 text-center">
                        <MessageSquare className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-white italic uppercase">Aucun avis trouvé</h3>
                    </div>
                )}
            </div>
        </div>
    );
}
