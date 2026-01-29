'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Tag, Loader2, Search } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    emoji: string;
    displayOrder: number;
    _count?: {
        menuItems: number;
    };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 20
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

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (data.success) {
                fetchCategories();
            } else {
                alert(data.error || 'Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Erreur serveur lors de la suppression');
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">
                        Catégories <span className="text-yellow-400">Menu</span>
                    </h1>
                    <p className="text-gray-400">Gérez les catégories de votre restaurant ({pagination.totalItems})</p>
                </div>

                <Link
                    href="/dashboard/categories/new"
                    className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition justify-center w-full md:w-auto"
                >
                    <Plus className="w-5 h-5" />
                    Nouvelle Catégorie
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher une catégorie..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs font-black tracking-widest">
                            <tr>
                                <th className="px-6 py-5">Ordre</th>
                                <th className="px-6 py-5">Emoji</th>
                                <th className="px-6 py-5">Nom</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-750 transition group">
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-900 px-3 py-1 rounded-lg text-yellow-400 font-mono font-bold border border-gray-700">
                                            {category.displayOrder}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-3xl">
                                        {category.emoji || '📁'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-black text-white text-lg group-hover:text-yellow-400 transition">{category.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/dashboard/categories/${category.id}`}
                                                className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition shadow-lg"
                                                title="Editer"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="p-3 bg-red-900/20 hover:bg-red-900/40 text-red-500 rounded-xl transition border border-red-500/10"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && categories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="bg-gray-900 p-6 rounded-full">
                                                <Tag className="w-12 h-12 opacity-20" />
                                            </div>
                                            <p className="text-xl font-bold text-gray-400">Aucune catégorie trouvée</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3">
                    <button
                        disabled={pagination.currentPage === 1}
                        onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage - 1 }))}
                        className="p-3 rounded-xl bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 disabled:opacity-20 transition"
                    >
                        Précédent
                    </button>
                    <div className="flex gap-2">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            let pageNum = pagination.currentPage - 2 + i;
                            if (pageNum < 1) pageNum = i + 1;
                            if (pageNum > pagination.totalPages) return null;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPagination(p => ({ ...p, currentPage: pageNum }))}
                                    className={`w-12 h-12 rounded-xl font-black transition ${pagination.currentPage === pageNum ? 'bg-yellow-400 text-gray-900 shadow-lg' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage + 1 }))}
                        className="p-3 rounded-xl bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 disabled:opacity-20 transition"
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
}
