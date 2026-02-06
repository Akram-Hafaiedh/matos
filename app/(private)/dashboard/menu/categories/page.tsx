// app/(private)/dashboard/menu/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Plus, GripVertical } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    emoji: string;
    displayOrder: number;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', emoji: '🍔' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) setCategories(data.categories);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newCategory,
                    displayOrder: categories.length + 1
                })
            });

            if (res.ok) {
                setNewCategory({ name: '', emoji: '🍔' });
                fetchCategories();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Control Center Protocol */}
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/menu"
                    className="p-2 bg-gray-800 rounded-xl text-gray-400 hover:text-white transition"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-4xl font-black text-white">
                        Gérer les <span className="text-yellow-400">Catégories</span>
                    </h1>
                    <p className="text-gray-400">Ajoutez ou modifiez les catégories du menu</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 h-fit">
                    <h2 className="text-xl font-bold text-white mb-4">Nouvelle Catégorie</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm font-bold">Nom</label>
                            <input
                                type="text"
                                required
                                value={newCategory.name}
                                onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="Ex: Pizzas"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm font-bold">Emoji</label>
                            <input
                                type="text"
                                required
                                value={newCategory.emoji}
                                onChange={e => setNewCategory({ ...newCategory, emoji: e.target.value })}
                                className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="🍔"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Ajouter
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="md:col-span-2 space-y-4">
                    {categories.map((cat) => (
                        <div key={cat.id} className="bg-gray-800 p-4 rounded-xl flex items-center justify-between border border-gray-700 group">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl bg-gray-700 w-12 h-12 flex items-center justify-center rounded-lg">
                                    {cat.emoji}
                                </span>
                                <div>
                                    <p className="font-bold text-white text-lg">{cat.name}</p>
                                    <p className="text-gray-500 text-xs">ID: {cat.id}</p>
                                </div>
                            </div>
                            {/* Actions would go here */}
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            Aucune catégorie pour le moment
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
