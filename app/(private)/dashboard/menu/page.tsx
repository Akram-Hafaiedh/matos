// app/(private)/dashboard/menu/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Tag, Filter } from 'lucide-react';
import Image from 'next/image';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number | any;
    imageUrl: string;
    isActive: boolean;
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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">
                        Menu <span className="text-yellow-400">Restaurant</span>
                    </h1>
                    <p className="text-gray-400">Gérez vos plats et catégories ({pagination.totalItems} articles)</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <Link
                        href="/dashboard/categories"
                        className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition justify-center"
                    >
                        <Tag className="w-5 h-5" />
                        Catégories
                    </Link>
                    <Link
                        href="/dashboard/menu/new"
                        className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition justify-center"
                    >
                        <Plus className="w-5 h-5" />
                        Nouveau
                    </Link>
                </div>
            </div>

            {/* Main Filters Toolbar */}
            <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-700/50 space-y-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Search */}
                    <div className="lg:w-1/3 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, description ou ingrédient..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-900 text-white pl-12 pr-4 py-4 rounded-2xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition"
                        />
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center gap-1 bg-gray-900 p-1.5 rounded-2xl border border-gray-700 self-start">
                        {[
                            { id: 'all', label: 'Tout' },
                            { id: 'active', label: 'Actifs' },
                            { id: 'inactive', label: 'Désactivés' }
                        ].map((s) => (
                            <button
                                key={s.id}
                                onClick={() => handleStatusChange(s.id as any)}
                                className={`px-4 py-2 text-sm font-bold rounded-xl transition ${statusFilter === s.id
                                    ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/20'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>

                    {/* Categories Quick Filter */}
                    <div className="flex-1 overflow-hidden relative group">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            <button
                                onClick={() => handleCategoryChange('all')}
                                className={`px-5 py-2.5 rounded-xl font-bold whitespace-nowrap transition border ${selectedCategory === 'all'
                                    ? 'bg-yellow-400 border-yellow-400 text-gray-900'
                                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                                    }`}
                            >
                                Tous les plats
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id.toString())}
                                    className={`px-5 py-2.5 rounded-xl font-bold whitespace-nowrap transition border flex items-center gap-2 ${selectedCategory === cat.id.toString()
                                        ? 'bg-yellow-400 border-yellow-400 text-gray-900'
                                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                                        }`}
                                >
                                    <span>{cat.emoji}</span>
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-800/50 rounded-3xl border-2 border-gray-700">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mb-4"></div>
                    <p className="text-gray-400 font-bold">Mise à jour de la liste...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {menuItems.map(item => (
                            <div key={item.id} className={`bg-gray-800 rounded-3xl p-4 border-2 transition group ${!item.isActive ? 'border-red-900/50 opacity-80' : 'border-gray-700 hover:border-yellow-400 shadow-xl'}`}>
                                {/* Image / Placeholder */}
                                <div className="relative h-48 w-full mb-4 bg-gray-900 rounded-2xl overflow-hidden ring-1 ring-white/5">
                                    {item.imageUrl && (item.imageUrl.startsWith('/') || item.imageUrl.startsWith('http')) ? (
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition duration-500"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-500 bg-gray-900">
                                            <span className="text-6xl">{item.imageUrl || item.category.emoji}</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.isActive ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                                            {item.isActive ? 'En Ligne' : 'Masqué'}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="text-lg font-black text-white truncate group-hover:text-yellow-400 transition">{item.name}</h3>
                                        <span className="text-yellow-400 font-black bg-yellow-400/10 px-2 py-1 rounded-lg text-sm whitespace-nowrap">
                                            {getPriceDisplay(item.price)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wide">
                                        <span className="p-1 px-2 bg-gray-700 rounded-md">{item.category.emoji} {item.category.name}</span>
                                    </div>

                                    <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px] leading-relaxed">
                                        {item.description || 'Aucune description'}
                                    </p>

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-2 pt-4">
                                        <Link
                                            href={`/dashboard/menu/${item.id}`}
                                            className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition shadow-lg"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Modifier
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="flex items-center justify-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-500 py-3 rounded-xl font-bold transition border border-red-500/10"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Suppr.
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 py-8">
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className="p-3 rounded-xl bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                            >
                                Précédent
                            </button>
                            <div className="flex gap-2">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-12 h-12 rounded-xl font-black transition ${pagination.currentPage === page
                                            ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/20'
                                            : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="p-3 rounded-xl bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                            >
                                Suivant
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {menuItems.length === 0 && (
                        <div className="text-center py-20 bg-gray-800 rounded-3xl border-2 border-dashed border-gray-700">
                            <div className="bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Filter className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Aucun produit trouvé</h3>
                            <p className="text-gray-400 mb-6">Essayez de modifier vos filtres ou effectuez une autre recherche</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                    setStatusFilter('all');
                                }}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition"
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
