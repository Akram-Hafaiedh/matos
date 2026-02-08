// app/(private)/dashboard/promotions/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Pagination from '@/components/dashboard/Pagination';
import { Plus, Edit, Trash2, Tag, Gift, Calendar, CheckCircle, XCircle, Search, Filter, Loader2, Sparkles, Zap, Clock, ChevronRight, Hash, Flame } from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';
import { useConfirm } from '@/app/context/ConfirmContext';

interface Promotion {
    id: number;
    name: string;
    description: string;
    price: number | null;
    original_price: number | null;
    discount: number | null;
    image_url: string | null;
    emoji: string | null;
    badge_text: string | null;
    badge_color: string | null;
    is_active: boolean;
    is_hot: boolean;
    tag: string | null;
    start_date: string | null;
    end_date: string | null;
}

export default function PromotionsPage() {
    const { toast } = useToast();
    const confirm = useConfirm();
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
        const confirmed = await confirm({
            title: 'Protocol de Suppression',
            message: 'Êtes-vous sûr de vouloir purger cette offre du système ? Cette action est irréversible.',
            type: 'danger',
            confirmText: 'Confirmer la Purge'
        });

        if (confirmed) {
            try {
                const res = await fetch(`/api/promotions/${id}`, {
                    method: 'DELETE'
                });
                const data = await res.json();

                if (data.success) {
                    toast.success('Offre purgée du système');
                    fetchPromotions();
                } else {
                    toast.error(data.error || 'Erreur lors de la purge');
                }
            } catch (error) {
                console.error('Error deleting promotion:', error);
                toast.error('Erreur critique lors de la purge');
            }
        }
    };

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles size={12} className="text-yellow-400" />
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">Campaign Intelligence</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">
                        Offres <span className="text-yellow-400">Spéciales</span>
                    </h1>
                    <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1">Gestion des protocoles promotionnels et bundles ({pagination.totalItems} actifs)</p>
                </div>

                <Link
                    href="/dashboard/promotions/new"
                    className="bg-yellow-400 text-black px-10 py-5 rounded-3xl font-[1000] uppercase text-[11px] tracking-[0.2em] italic hover:scale-105 transition-all active:scale-95 shadow-[0_20px_40px_rgba(250,204,21,0.2)] flex items-center gap-4 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" strokeWidth={3} />
                    Nouvelle Offre
                </Link>
            </div>

            {/* Tactical Toolbar */}
            <div className="bg-white/[0.02] p-8 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl space-y-8 shadow-3xl">
                <div className="flex flex-col xl:flex-row gap-8">
                    {/* Search Analyzer */}
                    <div className="xl:w-1/3 relative group">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5 group-focus-within:text-yellow-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Analyser le catalogue d'offres..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 text-white pl-16 pr-8 py-6 rounded-[2rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest placeholder:text-gray-800"
                        />
                    </div>

                    {/* Filter Matrix */}
                    <div className="flex bg-black/20 p-2 rounded-[2rem] border border-white/5 w-fit">
                        {[
                            { id: 'all', label: 'Tout le Flux' },
                            { id: 'active', label: 'Signaux Actifs' },
                            { id: 'inactive', label: 'Protocoles Archivés' }
                        ].map((s) => (
                            <button
                                key={s.id}
                                onClick={() => {
                                    setStatusFilter(s.id as any);
                                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                                }}
                                className={`px-8 py-4 text-[10px] font-[1000] uppercase tracking-[0.2em] rounded-[1.5rem] transition-all duration-500 italic ${statusFilter === s.id
                                    ? 'bg-yellow-400 text-black shadow-xl'
                                    : 'text-gray-600 hover:text-white'
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table Matrix Container */}
            <div className="bg-white/[0.01] rounded-[4rem] border border-white/5 backdrop-blur-3xl overflow-hidden shadow-3xl relative group/table">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Status</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Vector</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Designation</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Yield / Advantage</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none text-right">Overrides</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {promotions.map((promo) => (
                                <tr key={promo.id} className="group/row hover:bg-yellow-400/[0.02] transition-colors duration-500 relative">
                                    <td className="px-12 py-10">
                                        <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full text-[9px] font-[1000] uppercase tracking-[0.3em] italic border ${promo.is_active ? 'bg-green-500/5 text-green-400 border-green-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${promo.is_active ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></div>
                                            {promo.is_active ? 'En Ligne' : 'Hors Tension'}
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className="w-20 h-20 bg-black border border-white/5 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner group-hover/row:border-yellow-400/50 group-hover/row:scale-105 transition-all duration-700 italic">
                                            {promo.emoji || '🎁'}
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="font-[1000] text-white text-2xl uppercase italic group-hover/row:text-yellow-400 transition-colors tracking-tighter leading-none">
                                                    {promo.name}
                                                </div>
                                                {promo.is_hot && <Flame className="w-5 h-5 text-red-500 animate-pulse" />}
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] italic">
                                                <Clock size={12} className="text-yellow-400/50" />
                                                {promo.end_date ? `EXP: ${new Date(promo.end_date).toLocaleDateString('fr-FR')}` : 'PROTOCOLE PERMANENT'}
                                                {promo.tag && <span className="ml-2 text-yellow-400/80">// {promo.tag}</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        {promo.price ? (
                                            <div className="flex items-center gap-5">
                                                <span className="text-4xl font-[1000] text-yellow-400 italic tracking-tighter leading-none">
                                                    {promo.price.toFixed(1)} <span className="text-sm not-italic uppercase opacity-40 ml-1">DT</span>
                                                </span>
                                                {promo.original_price && (
                                                    <span className="text-gray-700 line-through text-xs font-[1000] italic tracking-widest leading-none pt-2">{promo.original_price.toFixed(1)} DT</span>
                                                )}
                                            </div>
                                        ) : promo.discount ? (
                                            <div className="bg-red-500/10 text-red-500 px-6 py-3 rounded-[1.5rem] border border-red-500/20 w-fit group-hover/row:scale-110 transition-transform shadow-[0_10px_30px_rgba(239,68,68,0.1)]">
                                                <span className="font-[1000] text-2xl italic tracking-tighter">-{promo.discount}%</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-800 font-[1000] uppercase text-[10px] tracking-[0.4em] italic border border-white/5 px-4 py-2 rounded-xl">Special Intel</span>
                                        )}
                                    </td>
                                    <td className="px-12 py-10 text-right">
                                        <div className="flex items-center justify-end gap-4 opacity-0 group-hover/row:opacity-100 transition-all translate-x-10 group-hover/row:translate-x-0 duration-700">
                                            <Link
                                                href={`/dashboard/promotions/${promo.id}`}
                                                className="w-14 h-14 bg-white/[0.02] border border-white/5 hover:border-yellow-400/50 text-white rounded-[1.2rem] transition-all flex items-center justify-center group/btn"
                                                title="Reconfigurer"
                                            >
                                                <Edit className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(promo.id)}
                                                className="w-14 h-14 bg-red-500/5 border border-red-500/10 hover:bg-red-500/20 text-red-500 rounded-[1.2rem] transition-all flex items-center justify-center group/btn"
                                                title="Purger"
                                            >
                                                <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!loading && promotions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-12 py-60">
                                        <div className="flex flex-col items-center justify-center gap-8 text-center">
                                            <div className="bg-white/[0.02] p-12 rounded-[3.5rem] border border-white/5 border-dashed relative group">
                                                <div className="absolute inset-0 bg-yellow-400/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <Gift className="w-20 h-20 text-gray-800 relative z-10" strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h3 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter mb-2">Silence Tactique</h3>
                                                <p className="text-gray-700 font-black text-[10px] uppercase tracking-[0.5em] italic">Aucune offensive promotionnelle détectée.</p>
                                            </div>
                                            <Link
                                                href="/dashboard/promotions/new"
                                                className="bg-gray-800 text-white px-10 py-5 rounded-3xl font-[1000] uppercase text-[10px] tracking-[0.2em] italic hover:bg-white hover:text-black transition-all"
                                            >
                                                Initialiser une Offre
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-20 flex flex-col items-center justify-center scale-90 opacity-0 animate-in fade-in zoom-in duration-500 fill-mode-forwards space-y-6">
                        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-[0_0_50px_rgba(250,204,21,0.2)]"></div>
                        <p className="text-gray-400 font-[1000] uppercase text-[10px] tracking-[0.6em] italic animate-pulse">Syncing Database...</p>
                    </div>
                )}
            </div>

            {/* Pagination Logistics */}
            <div className="flex justify-center pt-8">
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={(page: number) => setPagination(p => ({ ...p, currentPage: page }))}
                />
            </div>
        </div>
    );
}
