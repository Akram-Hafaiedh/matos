'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Tag, Loader2 } from 'lucide-react';

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

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            if (data.success) {
                setCategories(data.categories);
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
                setCategories(categories.filter(c => c.id !== id));
            } else {
                alert(data.error || 'Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Erreur serveur lors de la suppression');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">
                        Catégories <span className="text-yellow-400">Menu</span>
                    </h1>
                    <p className="text-gray-400">Gérez les catégories de votre restaurant</p>
                </div>

                <Link
                    href="/dashboard/categories/new"
                    className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition justify-center w-full md:w-auto"
                >
                    <Plus className="w-5 h-5" />
                    Nouvelle Catégorie
                </Link>
            </div>

            {/* Content */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 uppercase text-sm font-bold">
                            <tr>
                                <th className="px-6 py-4">Ordre</th>
                                <th className="px-6 py-4">Emoji</th>
                                <th className="px-6 py-4">Nom</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-750 transition">
                                    <td className="px-6 py-4 text-gray-400 font-mono">
                                        {category.displayOrder}
                                    </td>
                                    <td className="px-6 py-4 text-2xl">
                                        {category.emoji || '📁'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white text-lg">{category.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/dashboard/categories/${category.id}`}
                                                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                                                title="Editer"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="p-2 bg-red-900/30 hover:bg-red-900/50 text-red-500 rounded-lg transition"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <Tag className="w-12 h-12 opacity-20" />
                                            <p>Aucune catégorie trouvée</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
