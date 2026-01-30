// app/(private)/dashboard/menu/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Pagination from '@/components/dashboard/Pagination';
import { Plus, Search, Edit, Trash2, Tag, Filter } from 'lucide-react';
import Image from 'next/image';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number | any;
    imageUrl: string;
    isActive: boolean;
    displayOrder: number;
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
            setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page on search
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
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

        try {
            const res = await fetch(`/api/menu-items/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchData(); // Refresh current page
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
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
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-black text-white mb-2 uppercase italic tracking-tighter">
                        Menu <span className="text-yellow-400">Restaurant</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Gérez vos plats et catégories ({pagination.totalItems} articles)</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <Link
                        href="/dashboard/categories"
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-900 border border-gray-800 px-6 py-4 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest hover:border-yellow-400/50 transition duration-500"
                    >
                        <Tag className="w-4 h-4" />
                        Catégories
                    </Link>
                    <Link
                        href="/dashboard/menu/new"
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-yellow-400 px-6 py-4 rounded-2xl text-gray-900 font-black uppercase text-[10px] tracking-widest hover:bg-yellow-300 transition duration-500 shadow-xl shadow-yellow-400/10"
                    >
                        <Plus className="w-4 h-4" />
                        Nouveau
                    </Link>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-gray-900/40 p-6 md:p-8 rounded-[3rem] border border-gray-800 backdrop-blur-3xl space-y-8 shadow-3xl">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6">
                    {/* Search - Full width on mobile/tablet, 1/4 on desktop */}
                    <div className="lg:w-1/4 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-yellow-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-950/50 border-2 border-gray-800 text-white pl-16 pr-8 py-4 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                        />
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-6 overflow-hidden">
                        {/* Status Filters - Centered on mobile, fixed width on desktop */}
                        <div className="flex bg-gray-950/50 p-1.5 rounded-[1.5rem] border-2 border-gray-800 self-center md:self-auto min-w-fit">
                            {[
                                { id: 'all', label: 'Tout' },
                                { id: 'active', label: 'Actifs' },
                                { id: 'inactive', label: 'Désactivés' }
                            ].map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => handleStatusChange(s.id as any)}
                                    className={`px-5 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition duration-500 whitespace-nowrap ${statusFilter === s.id
                                        ? 'bg-yellow-400 text-gray-900 shadow-lg'
                                        : 'text-gray-500 hover:text-white'
                                        }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>

                        {/* Category Badges - Horizontal scroll with mask */}
                        <div className="flex-1 relative min-w-0">
                            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 px-4 scroll-mask-h">
                                <button
                                    onClick={() => handleCategoryChange('all')}
                                    className={`px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition duration-500 border-2 whitespace-nowrap shrink-0 ${selectedCategory === 'all'
                                        ? 'bg-yellow-400 border-yellow-400 text-gray-900 shadow-xl shadow-yellow-400/10'
                                        : 'bg-gray-950/50 border-gray-800 text-gray-500 hover:border-gray-700'
                                        }`}
                                >
                                    Tous
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.id.toString())}
                                        className={`px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition duration-500 border-2 flex items-center gap-2 whitespace-nowrap shrink-0 ${selectedCategory === cat.id.toString()
                                            ? 'bg-yellow-400 border-yellow-400 text-gray-900 shadow-xl shadow-yellow-400/10'
                                            : 'bg-gray-950/50 border-gray-800 text-gray-500 hover:border-gray-700'
                                            }`}
                                    >
                                        <span className="text-sm">{cat.emoji}</span>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mb-6"></div>
                    <p className="text-gray-500 font-black uppercase text-xs tracking-widest">Mise à jour de la bibliothèque...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {menuItems.map(item => (
                            <div key={item.id} className={`group bg-gray-900/40 rounded-[3rem] p-5 border border-gray-800 backdrop-blur-3xl transition duration-500 hover:border-yellow-400/50 hover:shadow-3xl relative overflow-hidden ${!item.isActive ? 'opacity-60' : ''}`}>
                                {/* Image Wrapper */}
                                <div className="relative h-56 w-full mb-6 bg-gray-950 rounded-[2.5rem] overflow-hidden ring-1 ring-white/5">
                                    {item.imageUrl && (item.imageUrl.startsWith('/') || item.imageUrl.startsWith('http')) ? (
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition duration-700 blur-0"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-7xl opacity-40 group-hover:opacity-60 transition-opacity">
                                            {item.imageUrl || item.category.emoji}
                                        </div>
                                    )}

                                    {/* Overlay Tags */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-opacity-30 ${item.isActive ? 'bg-green-500/10 text-green-400 border-green-500' : 'bg-red-500/10 text-red-400 border-red-500 shadow-2xl'}`}>
                                            {item.isActive ? 'Actif' : 'Masqué'}
                                        </div>
                                        {/* Order Badge */}
                                        <div className="px-4 py-1.5 rounded-full bg-gray-900/80 text-white text-[9px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md">
                                            #{item.displayOrder}
                                        </div>
                                    </div>

                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-yellow-400 text-gray-900 font-black px-4 py-2 rounded-2xl text-sm shadow-2xl">
                                            {getPriceDisplay(item.price)}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-4 px-2">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">
                                            <span>{item.category.emoji}</span>
                                            {item.category.name}
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter truncate group-hover:text-yellow-400 transition duration-500">{item.name}</h3>
                                    </div>

                                    <p className="text-gray-500 text-xs font-medium leading-relaxed line-clamp-2 h-8">
                                        {item.description || 'Aucune description disponible pour ce délice.'}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 pt-4">
                                        <Link
                                            href={`/dashboard/menu/${item.id}`}
                                            className="flex-1 flex items-center justify-center gap-2 bg-gray-950 border border-gray-800 hover:border-yellow-400/50 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition duration-500"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                            Modifier
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="w-14 h-14 flex items-center justify-center bg-red-500/5 border border-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition duration-500"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />

                    {/* Empty State */}
                    {menuItems.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-40 bg-gray-900/40 rounded-[3rem] border border-gray-800 border-dashed">
                            <div className="bg-gray-950 p-8 rounded-full mb-6">
                                <Filter className="w-12 h-12 text-gray-700" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-widest">Aucun plat décelé</h3>
                            <p className="text-gray-500 font-bold text-sm mb-8">Essayez de modifier votre recherche ou vos filtres.</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                    setStatusFilter('all');
                                }}
                                className="bg-gray-800 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-700 transition duration-500"
                            >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
