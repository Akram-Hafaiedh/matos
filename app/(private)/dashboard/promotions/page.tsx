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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">
                        Gestion des <span className="text-yellow-400">Promotions</span>
                    </h1>
                    <p className="text-gray-400">Créez des offres spéciales et des bundles pour vos clients ({pagination.totalItems} offres)</p>
                </div>

                <Link
                    href="/dashboard/promotions/new"
                    className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition justify-center w-full md:w-auto shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Nouvelle Promotion
                </Link>
            </div>

            {/* Filters Toolbar */}
            <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-700/50 flex flex-col md:flex-row gap-6">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher une offre par nom ou description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-900 text-white pl-12 pr-4 py-4 rounded-2xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition"
                    />
                </div>

                {/* Status Toggle */}
                <div className="flex items-center gap-1 bg-gray-900 p-1.5 rounded-2xl border border-gray-700 self-start md:self-stretch">
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
                            className={`px-6 py-2 text-sm font-black rounded-xl transition ${statusFilter === s.id
                                ? 'bg-yellow-400 text-gray-900 shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden shadow-2xl relative">
                {loading && (
                    <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-gray-700/50">
                            <tr>
                                <th className="px-8 py-6">Statut</th>
                                <th className="px-8 py-6">Promotion</th>
                                <th className="px-8 py-6">Économies / Prix</th>
                                <th className="px-8 py-6">Validité</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {promotions.map((promo) => (
                                <tr key={promo.id} className="hover:bg-gray-750 transition group">
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${promo.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                            {promo.isActive ? (
                                                <><CheckCircle className="w-3 h-3" /> En Ligne</>
                                            ) : (
                                                <><XCircle className="w-3 h-3" /> Masquée</>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-gray-700">
                                                {promo.emoji || '🎁'}
                                            </div>
                                            <div>
                                                <div className="font-black text-white text-xl group-hover:text-yellow-400 transition">{promo.name}</div>
                                                <div className="text-gray-500 text-sm line-clamp-1 max-w-xs mt-0.5">{promo.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            {promo.price ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-yellow-400 font-black text-xl">{promo.price.toFixed(1)} DT</span>
                                                    {promo.originalPrice && (
                                                        <span className="text-gray-500 line-through text-xs font-bold">{promo.originalPrice.toFixed(1)} DT</span>
                                                    )}
                                                </div>
                                            ) : promo.discount ? (
                                                <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-lg border border-red-500/20 self-start">
                                                    <span className="font-black text-lg">-{promo.discount}%</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500 font-bold italic">Voir détails</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`flex items-center gap-2 text-sm font-bold ${!promo.endDate ? 'text-gray-500' : 'text-gray-400'}`}>
                                            <Calendar className="w-4 h-4" />
                                            {promo.endDate ? (
                                                <span>jusqu'au {new Date(promo.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                                            ) : (
                                                <span>Offre permanente</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/dashboard/promotions/${promo.id}`}
                                                className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition shadow-lg border border-gray-600"
                                                title="Editer"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(promo.id)}
                                                className="p-3 bg-red-900/20 hover:bg-red-900/40 text-red-500 rounded-xl transition border border-red-500/10"
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
                                    <td colSpan={5} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center gap-6">
                                            <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center text-gray-700 border-2 border-dashed border-gray-700 ring-8 ring-gray-800/50">
                                                <Gift className="w-12 h-12" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-black text-3xl mb-2">Aucune offre trouvée</h3>
                                                <p className="text-gray-500 text-lg max-w-sm mx-auto">Ajustez vos filtres ou lancez une nouvelle recherche pour trouver vos promotions.</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setStatusFilter('all');
                                                }}
                                                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-bold transition border border-gray-600 shadow-xl"
                                            >
                                                Réinitialiser tout
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && pagination.totalPages > 1 && (
                    <div className="px-8 py-6 bg-gray-900/30 border-t border-gray-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                            Page <span className="text-white">{pagination.currentPage}</span> sur <span className="text-white">{pagination.totalPages}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={pagination.currentPage === 1}
                                onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage - 1 }))}
                                className="px-6 py-2.5 rounded-xl bg-gray-800 text-white font-bold border border-gray-700 hover:bg-gray-700 disabled:opacity-20 transition"
                            >
                                Précédent
                            </button>
                            <div className="flex gap-2">
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
                                            className={`w-10 h-10 rounded-xl font-black transition ${pagination.currentPage === pageNum ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                disabled={pagination.currentPage === pagination.totalPages}
                                onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage + 1 }))}
                                className="px-6 py-2.5 rounded-xl bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-300 disabled:opacity-20 transition"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
