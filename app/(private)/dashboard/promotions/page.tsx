'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Tag, Gift, Calendar, CheckCircle, XCircle, Search, Filter } from 'lucide-react';

interface Promotion {
    id: number;
    name: string;
    description: string;
    price: number | null;
    originalPrice: number | null;
    discount: number | null;
    imageUrl: string | null;
    emoji: string | null;
    badgeText: string | null;
    badgeColor: string | null;
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
}

export default function PromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPagination(prev => ({ ...prev, currentPage: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchPromotions();
    }, [debouncedSearch, statusFilter, pagination.currentPage]);

    const fetchPromotions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.currentPage.toString(),
                limit: pagination.limit.toString()
            });
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (debouncedSearch) params.append('search', debouncedSearch);

            const res = await fetch(`/api/promotions?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setPromotions(data.promotions);
                if (data.pagination) setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching promotions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) return;

        try {
            const res = await fetch(`/api/promotions/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (data.success) {
                fetchPromotions();
            } else {
                alert(data.error || 'Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting promotion:', error);
            alert('Erreur serveur lors de la suppression');
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-black text-white mb-2 uppercase italic tracking-tighter">
                        Offres <span className="text-yellow-400">Spéciales</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Gérez vos promotions et bundles ({pagination.totalItems} offres)</p>
                </div>

                <Link
                    href="/dashboard/promotions/new"
                    className="flex items-center gap-2 bg-yellow-400 px-6 py-4 rounded-2xl text-gray-900 font-black uppercase text-[10px] tracking-widest hover:bg-yellow-300 transition duration-500 shadow-xl shadow-yellow-400/10"
                >
                    <Plus className="w-4 h-4" />
                    Créer une offre
                </Link>
            </div>

            {/* Toolbar */}
            <div className="bg-gray-900/40 p-8 rounded-[3rem] border border-gray-800 backdrop-blur-3xl space-y-8 shadow-3xl">
                <div className="flex flex-col xl:flex-row gap-8">
                    {/* Search */}
                    <div className="xl:w-1/3 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-yellow-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Rechercher une promotion..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-16 pr-8 py-5 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                        />
                    </div>

                    {/* Quick Filters */}
                    <div className="flex bg-gray-950 p-1.5 rounded-[1.5rem] border-2 border-gray-800 w-fit">
                        {[
                            { id: 'all', label: 'Toutes' },
                            { id: 'active', label: 'Actives' },
                            { id: 'inactive', label: 'Inactives' }
                        ].map((s) => (
                            <button
                                key={s.id}
                                onClick={() => {
                                    setStatusFilter(s.id as any);
                                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                                }}
                                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition duration-500 ${statusFilter === s.id
                                    ? 'bg-yellow-400 text-gray-900 shadow-lg'
                                    : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-gray-900/30 rounded-[3rem] border border-gray-800 backdrop-blur-3xl overflow-hidden shadow-3xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800/50 bg-gray-950/20">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Statut</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Aperçu</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Désignation</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Avantage</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {promotions.map((promo) => (
                                <tr key={promo.id} className="group hover:bg-white/[0.02] transition duration-500 relative">
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-2 border-opacity-20 ${promo.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${promo.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                            {promo.isActive ? 'En Ligne' : 'Masquée'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="w-16 h-16 bg-gray-950 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-gray-800 group-hover:border-yellow-400/30 transition duration-500">
                                            {promo.emoji || '🎁'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-black text-white text-xl uppercase italic group-hover:text-yellow-400 transition duration-500 tracking-tight">
                                            {promo.name}
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                            {promo.endDate ? `JUSQU'AU ${new Date(promo.endDate).toLocaleDateString('fr-FR')}` : 'OFFRE PERMANENTE'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {promo.price ? (
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-black text-yellow-400 italic">{promo.price.toFixed(1)} <span className="text-xs">DT</span></span>
                                                {promo.originalPrice && (
                                                    <span className="text-gray-600 line-through text-xs font-black">{promo.originalPrice.toFixed(1)} DT</span>
                                                )}
                                            </div>
                                        ) : promo.discount ? (
                                            <div className="bg-red-500/10 text-red-500 px-4 py-1.5 rounded-xl border border-red-500/20 w-fit">
                                                <span className="font-black text-lg italic animate-pulse">-{promo.discount}%</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-600 font-black uppercase text-[10px] tracking-widest italic">Avantage spécial</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <Link
                                                href={`/dashboard/promotions/${promo.id}`}
                                                className="p-4 bg-gray-900 border border-gray-800 hover:border-yellow-400/50 text-white rounded-2xl transition duration-500"
                                                title="Modifier"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(promo.id)}
                                                className="p-4 bg-red-500/5 border border-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition duration-500"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && promotions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-40">
                                        <div className="flex flex-col items-center justify-center gap-6 text-center">
                                            <div className="bg-gray-950 p-8 rounded-full mb-4">
                                                <Gift className="w-12 h-12 text-gray-700" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">Aucune promotion</h3>
                                                <p className="text-gray-500 font-bold text-sm mt-2">Préparez vos prochaines offres exclusives.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm z-20 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {!loading && pagination.totalPages > 1 && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 px-8">
                    <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                        Page {pagination.currentPage} / {pagination.totalPages}
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            disabled={pagination.currentPage === 1}
                            onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage - 1 }))}
                            className="px-6 py-4 rounded-2xl bg-gray-900 border border-gray-800 text-[10px] font-black uppercase tracking-widest text-white hover:border-yellow-400/50 disabled:opacity-30 transition duration-500"
                        >
                            Précédent
                        </button>

                        <div className="flex gap-3">
                            {Array.from({ length: Math.min(3, pagination.totalPages) }, (_, i) => {
                                let pageNum = pagination.currentPage;
                                if (pagination.currentPage === pagination.totalPages) pageNum = pagination.totalPages - 2 + i;
                                else if (pagination.currentPage > 1) pageNum = pagination.currentPage - 1 + i;
                                else pageNum = i + 1;

                                if (pageNum < 1 || pageNum > pagination.totalPages) return null;

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPagination(p => ({ ...p, currentPage: pageNum }))}
                                        className={`w-12 h-12 rounded-2xl font-black text-sm transition duration-500 ${pagination.currentPage === pageNum
                                            ? 'bg-yellow-400 text-gray-900 shadow-xl shadow-yellow-400/20'
                                            : 'bg-gray-900 text-gray-500 hover:text-white border border-gray-800'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            disabled={pagination.currentPage === pagination.totalPages}
                            onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage + 1 }))}
                            className="px-6 py-4 rounded-2xl bg-gray-900 border border-gray-800 text-[10px] font-black uppercase tracking-widest text-white hover:border-yellow-400/50 disabled:opacity-30 transition duration-500"
                        >
                            Suivant
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
