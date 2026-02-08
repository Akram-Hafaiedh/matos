// app/(private)/dashboard/menu/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Pagination from '@/components/dashboard/Pagination';
import { Plus, Search, Edit, Trash2, Tag, Filter, Loader2, Utensils, Sparkles, ChevronRight, Hash, Signal, Activity, Layers } from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';
import { useConfirm } from '@/app/context/ConfirmContext';
import Image from 'next/image';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number | any;
    image_url: string;
    is_active: boolean;
    display_order: number;
    category: {
        id: number;
        name: string;
        emoji: string;
    };
}

interface Category {
    id: number;
    name: string;
    emoji: string;
}

export default function AdminMenuPage() {
    const { toast } = useToast();
    const confirm = useConfirm();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 12
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
        fetchData();
    }, [debouncedSearch, selectedCategory, statusFilter, pagination.currentPage]);

    // Fetch categories once
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                const data = await res.json();
                if (data.success) setCategories(data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                showInactive: 'true',
                page: pagination.currentPage.toString(),
                limit: pagination.limit.toString()
            });

            if (selectedCategory !== 'all') params.append('categoryId', selectedCategory);
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (debouncedSearch) params.append('search', debouncedSearch);

            const res = await fetch(`/api/menu-items?${params.toString()}`);
            const data = await res.json();

            if (data.success) {
                setMenuItems(data.menuItems);
                if (data.pagination) {
                    setPagination(data.pagination);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: 'Protocol de Suppression',
            message: 'Êtes-vous sûr de vouloir purger cet article de la base de données ? Cette action est irréversible.',
            type: 'danger',
            confirmText: 'Confirmer la Purge'
        });

        if (confirmed) {
            try {
                const res = await fetch(`/api/menu-items/${id}`, {
                    method: 'DELETE'
                });

                if (res.ok) {
                    toast.success('Données purgées avec succès');
                    fetchData();
                } else {
                    const errorData = await res.json();
                    toast.error(errorData.error || 'Erreur lors de la purge');
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                toast.error('Erreur critique système lors de la purge');
            }
        }
    };

    const getPriceDisplay = (price: any) => {
        if (typeof price === 'number') return `${price.toFixed(1)} DT`;
        if (price && typeof price === 'object') {
            const prices = Object.values(price) as number[];
            if (prices.length === 0) return '0.0 DT';
            const minPrice = Math.min(...prices);
            return `dès ${minPrice.toFixed(1)} DT`;
        }
        return '0.0 DT';
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const handleCategoryChange = (catId: string) => {
        setSelectedCategory(catId);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleStatusChange = (status: 'all' | 'active' | 'inactive') => {
        setStatusFilter(status);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Utensils size={12} className="text-yellow-400" />
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">Inventory Intelligence</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">
                        Menu <span className="text-yellow-400">Restaurant</span>
                    </h1>
                    <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1">Gestion tactique des articles et catégories ({pagination.totalItems} références)</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <Link
                        href="/dashboard/categories"
                        className="flex-1 md:flex-none flex items-center justify-center gap-4 bg-white/[0.02] border border-white/5 px-8 py-5 rounded-[2rem] text-white font-[1000] uppercase text-[11px] tracking-[0.2em] italic hover:border-yellow-400/50 hover:bg-white/[0.05] transition-all"
                    >
                        <Tag className="w-4 h-4" />
                        Catégories
                    </Link>
                    <Link
                        href="/dashboard/menu/new"
                        className="flex-1 md:flex-none flex items-center justify-center gap-4 bg-yellow-400 px-10 py-5 rounded-3xl text-black font-[1000] uppercase text-[11px] tracking-[0.2em] italic hover:scale-105 transition-all active:scale-95 shadow-[0_20px_40px_rgba(250,204,21,0.2)]"
                    >
                        <Plus className="w-5 h-5" strokeWidth={3} />
                        Nouvel Article
                    </Link>
                </div>
            </div>

            {/* Tactical Toolbar */}
            <div className="bg-white/[0.02] p-8 md:p-10 rounded-[4rem] border border-white/5 backdrop-blur-3xl space-y-10 shadow-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-full bg-yellow-400/[0.01] pointer-events-none"></div>

                <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-8 relative z-10">
                    {/* Search Analyzer */}
                    <div className="xl:w-1/4 relative group/search">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5 group-focus-within/search:text-yellow-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Analyser le catalogue..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 text-white pl-16 pr-8 py-6 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest placeholder:text-gray-800"
                        />
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-8">
                        {/* Status Matrix */}
                        <div className="flex bg-black/20 p-2 rounded-[2rem] border border-white/5 self-center md:self-auto min-w-fit">
                            {[
                                { id: 'all', label: 'Tout' },
                                { id: 'active', label: 'Opérationnels' },
                                { id: 'inactive', label: 'Désactivés' }
                            ].map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => handleStatusChange(s.id as any)}
                                    className={`px-8 py-4 text-[10px] font-[1000] uppercase tracking-[0.2em] rounded-[1.5rem] transition-all duration-500 whitespace-nowrap italic ${statusFilter === s.id
                                        ? 'bg-yellow-400 text-black shadow-xl shadow-yellow-400/10'
                                        : 'text-gray-600 hover:text-white'
                                        }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>

                        {/* Category Selector */}
                        <div className="flex-1 relative min-w-0">
                            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-1 px-4">
                                <button
                                    onClick={() => handleCategoryChange('all')}
                                    className={`px-8 py-4 rounded-[1.8rem] font-[1000] uppercase text-[10px] tracking-[0.2em] transition-all duration-500 border italic whitespace-nowrap shrink-0 ${selectedCategory === 'all'
                                        ? 'bg-yellow-400 border-yellow-400 text-black shadow-[0_10px_30px_rgba(250,204,21,0.2)]'
                                        : 'bg-black/30 border-white/5 text-gray-500 hover:border-white/20 hover:text-white'
                                        }`}
                                >
                                    Global Data
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.id.toString())}
                                        className={`px-8 py-4 rounded-[1.8rem] font-[1000] uppercase text-[10px] tracking-[0.2em] transition-all duration-500 border flex items-center gap-3 italic whitespace-nowrap shrink-0 ${selectedCategory === cat.id.toString()
                                            ? 'bg-yellow-400 border-yellow-400 text-black shadow-[0_10px_30px_rgba(250,204,21,0.2)]'
                                            : 'bg-black/30 border-white/5 text-gray-500 hover:border-white/20 hover:text-white'
                                            }`}
                                    >
                                        <span className="text-lg not-italic opacity-60">{cat.emoji}</span>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Architecture */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-60 space-y-8">
                    <div className="w-24 h-24 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin shadow-[0_0_50px_rgba(250,204,21,0.2)]"></div>
                    <p className="text-gray-700 font-[1000] uppercase text-xs tracking-[1em] animate-pulse italic">Decoding Inventory Matrix...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                        {menuItems.map(item => (
                            <div key={item.id} className={`group/card bg-white/[0.01] rounded-[3.5rem] p-6 border border-white/5 transition-all duration-700 hover:border-yellow-400/50 hover:bg-white/[0.03] hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)] relative overflow-hidden ${!item.is_active ? 'opacity-40 grayscale' : ''}`}>
                                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-yellow-400/[0.02] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>

                                {/* Image Intelligence */}
                                <div className="relative h-64 w-full mb-8 bg-black rounded-[2.5rem] overflow-hidden group/img ring-1 ring-white/5 shadow-2xl">
                                    {item.image_url && (item.image_url.startsWith('/') || item.image_url.startsWith('http')) ? (
                                        <Image
                                            src={item.image_url}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover/card:scale-110 transition-transform duration-[2000ms] ease-out brightness-75 group-hover/card:brightness-100"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-8xl opacity-10 group-hover/card:opacity-30 group-hover/card:scale-125 transition-all duration-1000">
                                            {item.image_url || item.category?.emoji || '🍽️'}
                                        </div>
                                    )}

                                    {/* Overlay Tags */}
                                    <div className="absolute top-6 right-6 flex flex-col gap-3">
                                        <div className={`px-5 py-2 rounded-full text-[9px] font-[1000] uppercase tracking-[0.3em] italic border backdrop-blur-md ${item.is_active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]'}`}>
                                            {item.is_active ? 'Operationnel' : 'Offline'}
                                        </div>
                                        <div className="px-5 py-2 rounded-full bg-black/60 text-white text-[9px] font-[1000] uppercase tracking-[0.3em] italic border border-white/10 backdrop-blur-md flex items-center gap-2">
                                            <Hash size={10} className="text-yellow-400" />
                                            SEQ-{item.display_order}
                                        </div>
                                    </div>

                                    <div className="absolute bottom-6 left-6 translate-y-2 group-hover/card:translate-y-0 opacity-80 group-hover/card:opacity-100 transition-all duration-500">
                                        <span className="bg-yellow-400 text-black font-[1000] px-6 py-3 rounded-[1.5rem] text-lg italic shadow-[0_20px_40px_rgba(250,204,21,0.3)] tracking-tighter">
                                            {getPriceDisplay(item.price)}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Briefing */}
                                <div className="space-y-6 px-3 pb-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 text-[10px] text-gray-600 font-[1000] uppercase tracking-[0.4em] italic">
                                            <span className="text-lg not-italic opacity-40">{item.category?.emoji || '🍽️'}</span>
                                            {item.category?.name || 'Sans Catégorie'}
                                        </div>
                                        <h3 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter leading-none group-hover/card:text-yellow-400 transition-colors">{item.name}</h3>
                                    </div>

                                    <p className="text-gray-600 text-xs font-bold leading-relaxed line-clamp-2 h-10 italic uppercase tracking-widest opacity-60 group-hover/card:opacity-100 transition-opacity">
                                        {item.description || 'PROTOCOLE STANDARD MATOS • AUCUN BRIEFING SUPPLÉMENTAIRE.'}
                                    </p>

                                    {/* Tactical Actions */}
                                    <div className="flex items-center gap-4 pt-4 opacity-0 group-hover/card:opacity-100 translate-y-4 group-hover/card:translate-y-0 transition-all duration-500">
                                        <Link
                                            href={`/dashboard/menu/${item.id}`}
                                            className="flex-1 flex items-center justify-center gap-3 bg-white/[0.03] border border-white/10 hover:border-yellow-400/50 hover:bg-yellow-400 hover:text-black py-5 rounded-[1.8rem] font-[1000] uppercase text-[10px] tracking-[0.3em] italic transition-all active:scale-95"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Reconfigurer
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="w-16 h-16 flex items-center justify-center bg-red-500/5 border border-red-500/10 hover:bg-red-500 hover:text-white rounded-[1.8rem] text-red-500 transition-all active:scale-90"
                                            title="Purger"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Logistics */}
                    <div className="flex justify-center pt-16">
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>

                    {/* Radio Silence State */}
                    {menuItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-60 bg-white/[0.01] rounded-[4rem] border border-white/5 border-dashed space-y-10 group">
                            <div className="bg-black/40 p-12 rounded-[3.5rem] border border-white/5 relative">
                                <div className="absolute inset-0 bg-yellow-400/5 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Signal className="w-20 h-20 text-gray-800 relative z-10 animate-pulse" strokeWidth={1} />
                            </div>
                            <div className="text-center space-y-3">
                                <h3 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter">Silence Radio</h3>
                                <p className="text-gray-700 font-black text-[10px] uppercase tracking-[0.5em] italic">Aucune forme de vie détectée dans cette section du catalogue.</p>
                            </div>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                    setStatusFilter('all');
                                }}
                                className="bg-gray-800 text-white px-10 py-5 rounded-3xl font-[1000] uppercase text-[10px] tracking-[0.3em] italic hover:bg-white hover:text-black transition-all active:scale-95"
                            >
                                Réinitialiser les Capteurs
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
