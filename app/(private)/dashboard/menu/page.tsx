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
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [itemsRes, catsRes] = await Promise.all([
                fetch('/api/menu-items?showInactive=true'),
                fetch('/api/categories')
            ]);

            const itemsData = await itemsRes.json();
            const catsData = await catsRes.json();

            if (itemsData.success) setMenuItems(itemsData.menuItems);
            if (catsData.success) setCategories(catsData.categories);
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
                setMenuItems(menuItems.filter(item => item.id !== id));
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const filteredItems = menuItems.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category.id.toString() === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getPriceDisplay = (price: any) => {
        if (typeof price === 'number') return `${price.toFixed(1)} DT`;
        // If it's an object/JSON (e.g. sizes)
        const prices = Object.values(price) as number[];
        const minPrice = Math.min(...prices);
        return `dès ${minPrice.toFixed(1)} DT`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">
                        Menu <span className="text-yellow-400">Restaurant</span>
                    </h1>
                    <p className="text-gray-400">Gérez vos plats et catégories</p>
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

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400"
                    />
                </div>

                {/* Categories */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-3 rounded-xl font-bold whitespace-nowrap transition ${selectedCategory === 'all'
                            ? 'bg-yellow-400 text-gray-900'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                            }`}
                    >
                        Tout
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id.toString())}
                            className={`px-4 py-3 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-2 ${selectedCategory === cat.id.toString()
                                ? 'bg-yellow-400 text-gray-900'
                                : 'bg-gray-800 text-gray-400 hover:text-white'
                                }`}
                        >
                            <span>{cat.emoji}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className={`bg-gray-800 rounded-2xl p-4 border-2 transition ${!item.isActive ? 'border-red-900 opacity-75' : 'border-gray-700 hover:border-yellow-400'}`}>
                        {/* Image */}
                        <div className="relative h-48 w-full mb-4 bg-gray-700 rounded-xl overflow-hidden">
                            {item.imageUrl && (item.imageUrl.startsWith('/') || item.imageUrl.startsWith('http')) ? (
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500 bg-gray-800">
                                    <span className="text-6xl">{item.imageUrl || item.category.emoji}</span>
                                </div>
                            )}
                            {!item.isActive && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        Désactivé
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-white truncate">{item.name}</h3>
                                <span className="text-yellow-400 font-bold bg-yellow-400/10 px-2 py-1 rounded-lg text-sm">
                                    {getPriceDisplay(item.price)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <Tag className="w-4 h-4" />
                                <span>{item.category.name}</span>
                            </div>

                            <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px]">
                                {item.description || 'Aucune description'}
                            </p>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-2 pt-4 mt-2 border-t border-gray-700">
                                <Link
                                    href={`/dashboard/menu/${item.id}`}
                                    className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-bold transition"
                                >
                                    <Edit className="w-4 h-4" />
                                    Editer
                                </Link>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="flex items-center justify-center gap-2 bg-red-900/30 hover:bg-red-900/50 text-red-500 py-2 rounded-lg font-bold transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Suppr.
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
                <div className="text-center py-20 bg-gray-800 rounded-3xl border-2 border-dashed border-gray-700">
                    <div className="bg-gray-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Filter className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Aucun produit trouvé</h3>
                    <p className="text-gray-400 mb-6">Essayez de modifier vos filtres ou ajoutez un nouveau produit</p>
                    <Link
                        href="/dashboard/menu/new"
                        className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 rounded-xl font-bold transition"
                    >
                        <Plus className="w-5 h-5" />
                        Ajouter un produit
                    </Link>
                </div>
            )}
        </div>
    );
}
