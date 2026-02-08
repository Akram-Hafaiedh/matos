// app/(private)/dashboard/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Pagination from '@/components/dashboard/Pagination';
import { Plus, Edit, Trash2, Tag, Loader2, Search, Zap, Signal, Activity, Sparkles, Hash } from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';
import { useConfirm } from '@/app/context/ConfirmContext';

interface Category {
    id: number;
    name: string;
    emoji: string;
    display_order: number;
    _count?: {
        menu_items: number;
    };
}

export default function CategoriesPage() {
    const { toast } = useToast();
    const confirm = useConfirm();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isNormalizing, setIsNormalizing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
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
        fetchCategories();
    }, [debouncedSearch, pagination.currentPage]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.currentPage.toString(),
                limit: pagination.limit.toString()
            });
            if (debouncedSearch) params.append('search', debouncedSearch);

            const res = await fetch(`/api/categories?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setCategories(data.categories);
                if (data.pagination) setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNormalizeOrder = async () => {
        const confirmed = await confirm({
            title: 'Normalisation',
            message: 'Voulez-vous normaliser l\'ordre de toutes les catégories ? (Pizzas en premier, Boissons/Suppléments à la fin)',
            type: 'warning',
            confirmText: 'Normaliser maintenant'
        });

        if (confirmed) {
            setIsNormalizing(true);
            try {
                const res = await fetch('/api/admin/debug/fix-orders');
                const data = await res.json();
                if (data.success) {
                    toast.success('Ordre normalisé avec succès');
                    fetchCategories();
                } else {
                    toast.error(data.error || 'Erreur lors de la normalisation');
                }
            } catch (error) {
                console.error('Error normalizing order:', error);
                toast.error('Erreur serveur');
            } finally {
                setIsNormalizing(false);
            }
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: 'PURGE PROTOCOL',
            message: 'Voulez-vous supprimer définitivement cette catégorie ? Tous les articles associés perdront leur classification.',
            type: 'danger',
            confirmText: 'PURGE DATA'
        });

        if (confirmed) {
            try {
                const res = await fetch(`/api/categories/${id}`, {
                    method: 'DELETE'
                });
                const data = await res.json();

                if (data.success) {
                    toast.success('Catégorie purgée du système');
                    fetchCategories();
                } else {
                    toast.error(data.error || 'Echec de l\'opération');
                }
            } catch (error) {
                console.error('Error deleting category:', error);
                toast.error('Erreur de transmission');
            }
        }
    };

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header Area */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Tag size={12} className="text-yellow-400" />
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">Classification Matrix</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">
                        Catégories <span className="text-yellow-400">Menu</span>
                    </h1>
                    <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1">Organisation structurelle du catalogue ({pagination.totalItems} nœuds)</p>
                </div>

                <div className="flex items-center gap-4 w-full xl:w-auto">
                    <button
                        onClick={handleNormalizeOrder}
                        disabled={isNormalizing}
                        className="flex-1 xl:flex-none flex items-center justify-center gap-4 bg-white/[0.02] border border-white/5 px-10 py-5 rounded-[2rem] text-white font-[1000] uppercase text-[10px] tracking-[0.3em] italic hover:bg-white hover:text-black transition-all duration-700 active:scale-95 group shadow-2xl disabled:opacity-50"
                    >
                        {isNormalizing ? <Loader2 className="w-4 h-4 animate-spin text-yellow-400" /> : <Zap className="w-4 h-4 text-yellow-400 group-hover:text-black transition-colors" />}
                        {isNormalizing ? 'Normalizing...' : 'Reorder Matrix'}
                    </button>
                    <Link
                        href="/dashboard/categories/new"
                        className="flex-1 xl:flex-none flex items-center justify-center gap-4 bg-yellow-400 px-10 py-5 rounded-[2rem] text-black font-[1000] uppercase text-[10px] tracking-[0.3em] italic hover:scale-110 active:scale-95 transition-all shadow-[0_20px_40px_rgba(250,204,21,0.2)]"
                    >
                        <Plus className="w-4 h-4" strokeWidth={3} />
                        New Node
                    </Link>
                </div>
            </div>

            {/* Toolbar Area */}
            <div className="max-w-xl relative group">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-700 w-5 h-5 group-focus-within:text-yellow-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Scanner les classifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 text-white pl-18 pr-8 py-6 rounded-[2.5rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-[0.2em] placeholder:text-gray-800"
                />
            </div>

            {/* Data Table Matrix container */}
            <div className="bg-white/[0.01] rounded-[4rem] border border-white/5 backdrop-blur-3xl shadow-3xl relative overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Order Vector</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Visual Asset</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Désignation</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none text-right">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {categories.map((category) => (
                                <tr key={category.id} className="group/row hover:bg-yellow-400/[0.01] transition-all duration-500 relative">
                                    <td className="px-12 py-10">
                                        <div className="flex items-center gap-4">
                                            <span className="font-[1000] text-yellow-400 italic text-2xl tracking-tighter group-hover/row:scale-125 transition-transform origin-left">#{category.display_order}</span>
                                            <Activity size={12} className="text-gray-800 group-hover/row:text-yellow-400/30 transition-colors" />
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className="w-20 h-20 bg-black rounded-[2.2rem] flex items-center justify-center text-4xl shadow-inner border border-white/5 group-hover/row:border-yellow-400/50 group-hover/row:scale-105 transition-all duration-700 relative overflow-hidden group/emoji">
                                            <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover/emoji:opacity-100 transition-opacity blur-2xl"></div>
                                            <span className="relative z-10">{category.emoji || '📁'}</span>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className="space-y-1">
                                            <div className="font-[1000] text-white text-3xl uppercase italic group-hover/row:text-yellow-400 transition-all duration-500 tracking-tighter leading-none">
                                                {category.name}
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] text-gray-800 font-[1000] uppercase tracking-[0.2em] italic">
                                                <Hash size={10} className="text-yellow-400/30" />
                                                NODE_X{category.id}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10 text-right">
                                        <div className="flex items-center justify-end gap-4 opacity-0 group-hover/row:opacity-100 transition-all duration-500 translate-x-4 group-hover/row:translate-x-0">
                                            <Link
                                                href={`/dashboard/categories/${category.id}`}
                                                className="w-14 h-14 bg-black/40 border border-white/5 hover:border-yellow-400/50 text-white hover:text-yellow-400 rounded-2xl transition-all duration-500 flex items-center justify-center shadow-2xl active:scale-90"
                                                title="Modify Node"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="w-14 h-14 bg-red-500/5 border border-red-500/10 hover:bg-red-500 hover:text-black text-red-500 rounded-2xl transition-all duration-500 flex items-center justify-center shadow-2xl active:scale-90"
                                                title="Purge Node"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && categories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-12 py-60">
                                        <div className="flex flex-col items-center justify-center gap-8 text-center opacity-20">
                                            <Tag className="w-24 h-24 text-gray-500" strokeWidth={1} />
                                            <div className="space-y-2">
                                                <h3 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter">Null classification</h3>
                                                <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.5em] italic">Aucune structure détectée dans la matrice.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-20 flex flex-col items-center justify-center animate-in fade-in duration-500 scale-95 opacity-0 fill-mode-forwards space-y-6">
                        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-[0_0_50px_rgba(250,204,21,0.2)]"></div>
                        <p className="text-gray-500 font-[1000] uppercase text-[10px] tracking-[0.5em] italic animate-pulse">Syncing Structural Data...</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page: number) => setPagination(p => ({ ...p, currentPage: page }))}
            />
        </div>
    );
}
