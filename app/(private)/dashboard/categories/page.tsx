'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Pagination from '@/components/dashboard/Pagination';
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
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-black text-white mb-2 uppercase italic tracking-tighter">
                        Catégories <span className="text-yellow-400">Menu</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Gérez les catégories de votre restaurant ({pagination.totalItems})</p>
                </div>

                <Link
                    href="/dashboard/categories/new"
                    className="flex items-center gap-2 bg-yellow-400 px-6 py-4 rounded-2xl text-gray-900 font-black uppercase text-[10px] tracking-widest hover:bg-yellow-300 transition duration-500 shadow-xl shadow-yellow-400/10"
                >
                    <Plus className="w-4 h-4" />
                    Nouvelle
                </Link>
            </div>

            {/* Toolbar */}
            <div className="bg-gray-900/40 p-8 rounded-[3rem] border border-gray-800 backdrop-blur-3xl shadow-3xl">
                <div className="relative group max-w-xl">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-yellow-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Rechercher une catégorie..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-950 border-2 border-gray-800 text-white pl-16 pr-8 py-5 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                    />
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-gray-900/30 rounded-[3rem] border border-gray-800 backdrop-blur-3xl overflow-hidden shadow-3xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800/50 bg-gray-950/20">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Ordre</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Aperçu</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Désignation</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {categories.map((category) => (
                                <tr key={category.id} className="group hover:bg-white/[0.02] transition duration-500 relative">
                                    <td className="px-8 py-6">
                                        <span className="font-black text-yellow-400 italic text-xl">#{category.displayOrder}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="w-16 h-16 bg-gray-950 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-gray-800 group-hover:border-yellow-400/30 transition duration-500">
                                            {category.emoji || '📁'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-black text-white text-xl uppercase italic group-hover:text-yellow-400 transition duration-500 tracking-tight">
                                            {category.name}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <Link
                                                href={`/dashboard/categories/${category.id}`}
                                                className="p-4 bg-gray-900 border border-gray-800 hover:border-yellow-400/50 text-white rounded-2xl transition duration-500"
                                                title="Modifier"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="p-4 bg-red-500/5 border border-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition duration-500"
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
                                    <td colSpan={4} className="px-8 py-40">
                                        <div className="flex flex-col items-center justify-center gap-4 text-center">
                                            <div className="bg-gray-950 p-8 rounded-full mb-4">
                                                <Tag className="w-12 h-12 text-gray-700" />
                                            </div>
                                            <h3 className="text-2xl font-black text-white uppercase italic tracking-widest">Aucune catégorie</h3>
                                            <p className="text-gray-500 font-bold text-sm">Votre menu semble encore vide.</p>
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

            {/* Pagination */}
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page: number) => setPagination(p => ({ ...p, currentPage: page }))}
            />
        </div>
    );
}
