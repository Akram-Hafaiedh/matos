'use client';

import { categories, menuItems } from '@/lib/data/menu';
import { Flame, Minus, Plus, Star, Percent, ChevronRight, Search, ArrowRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { MenuItem } from '@/types/menu';
import { useCart } from '../../cart/CartContext';

export default function MenuPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSauce, setSelectedSauce] = useState<'all' | 'rouge' | 'blanche'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const { addToCart } = useCart();

    const filteredItems = useMemo(() => {
        let items = selectedCategory === 'all'
            ? Object.values(menuItems).flat()
            : menuItems[selectedCategory as keyof typeof menuItems] || [];

        // Apply Search
        if (searchQuery) {
            items = items.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.ingredients && item.ingredients.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Apply Sauce Filter for Pizzas
        if (selectedCategory === 'pizza' && selectedSauce !== 'all') {
            items = items.filter((item: MenuItem) =>
                'sauce' in item && item.sauce === selectedSauce
            );
        }

        return items;
    }, [selectedCategory, selectedSauce, searchQuery]);

    const renderPriceAndButton = (item: MenuItem) => {
        // Special rendering for promo items
        if (item.category === 'promos' && item.originalPrice && item.price && typeof item.price === 'number') {
            return (
                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 uppercase tracking-widest shadow-lg">
                            <Percent className="w-3 h-3" />
                            -{item.discount}%
                        </div>
                        <span className="text-green-400 font-bold text-xs">
                            -{item.savings}DT
                        </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white italic">
                            {item.price}
                            <span className="text-yellow-400 text-sm ml-1 not-italic font-bold">DT</span>
                        </span>
                        <span className="text-sm text-gray-500 line-through font-bold">
                            {item.originalPrice}DT
                        </span>
                    </div>

                    <button
                        onClick={() => addToCart(item, 'menuItem')}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-yellow-400/20 active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        Profiter de l'offre
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            );
        }

        if (!item.price) {
            return (
                <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-black text-xs uppercase tracking-widest">Prix variable</span>
                    <button
                        onClick={() => addToCart(item, 'menuItem')}
                        className="bg-yellow-400 text-gray-900 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-yellow-300 transition shadow-lg group-active:scale-90"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            );
        }

        if (typeof item.price === 'number') {
            return (
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-white italic">
                        {item.price}
                        <span className="text-yellow-400 text-sm ml-1 not-italic font-bold">DT</span>
                    </span>
                    <button
                        onClick={() => addToCart(item, 'menuItem')}
                        className="bg-yellow-400 text-gray-900 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-yellow-300 transition shadow-lg group-active:scale-90"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            );
        }

        if (typeof item.price === 'object') {
            if ('xl' in item.price && 'xxl' in item.price) {
                return (
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => addToCart(item, 'menuItem', 'xl')}
                            className="bg-gray-800/50 hover:bg-yellow-400 hover:text-gray-900 text-white p-2 rounded-xl font-black text-[10px] transition-all flex flex-col items-center justify-center gap-1 border border-gray-700 hover:border-yellow-400"
                        >
                            <span className="uppercase tracking-widest opacity-60">XL</span>
                            <span>{item.price.xl} DT</span>
                        </button>
                        <button
                            onClick={() => addToCart(item, 'menuItem', 'xxl')}
                            className="bg-gray-800/50 hover:bg-yellow-400 hover:text-gray-900 text-white p-2 rounded-xl font-black text-[10px] transition-all flex flex-col items-center justify-center gap-1 border border-gray-700 hover:border-yellow-400"
                        >
                            <span className="uppercase tracking-widest opacity-60">XXL</span>
                            <span>{item.price.xxl} DT</span>
                        </button>
                    </div>
                );
            }
            return (
                <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-black text-xs uppercase tracking-widest">Multi-tailles</span>
                    <button
                        onClick={() => addToCart(item, 'menuItem')}
                        className="bg-yellow-400 text-gray-900 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-yellow-300 transition shadow-lg group-active:scale-90"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="min-h-screen bg-black pb-32 overflow-hidden relative">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-400/5 blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Modern Header Section */}
                <div className="pt-32 pb-16 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-3 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.3em]">
                                Carte Gastronomique
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-none uppercase">
                                Notre <br />
                                <span className="text-yellow-400">Menu.</span>
                            </h1>
                        </div>

                        {/* Search Bar */}
                        <div className="relative group w-full md:w-96">
                            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Rechercher un délice..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-900/50 border-2 border-gray-800 text-white pl-16 pr-6 py-5 rounded-[2rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-600 backdrop-blur-xl"
                            />
                        </div>
                    </div>
                </div>

                {/* Categories Navigation */}
                <div className="flex flex-col gap-8 mb-16">
                    <div className="flex flex-wrap gap-3">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setSelectedCategory(cat.id);
                                    setSelectedSauce('all');
                                }}
                                className={`px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center gap-3 active:scale-95 ${selectedCategory === cat.id
                                        ? 'bg-yellow-400 text-gray-900 shadow-2xl shadow-yellow-400/20'
                                        : 'bg-gray-900/40 text-gray-500 border-2 border-gray-800/50 hover:border-yellow-400/30 hover:text-white backdrop-blur-md'
                                    }`}
                            >
                                <span className="text-xl">{cat.emoji}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Sub-Filters for Pizza */}
                    {selectedCategory === 'pizza' && (
                        <div className="flex items-center gap-4 bg-gray-900/40 p-2 rounded-[2rem] border-2 border-gray-800/50 w-fit backdrop-blur-md animate-in fade-in slide-in-from-top-4">
                            <button
                                onClick={() => setSelectedSauce('all')}
                                className={`px-6 py-2.5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition ${selectedSauce === 'all'
                                        ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                                        : 'text-gray-600 hover:text-white'
                                    }`}
                            >
                                Toutes
                            </button>
                            <button
                                onClick={() => setSelectedSauce('rouge')}
                                className={`px-6 py-2.5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition flex items-center gap-2 ${selectedSauce === 'rouge'
                                        ? 'bg-red-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:text-white'
                                    }`}
                            >
                                🍅 Base Tomate
                            </button>
                            <button
                                onClick={() => setSelectedSauce('blanche')}
                                className={`px-6 py-2.5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition flex items-center gap-2 ${selectedSauce === 'blanche'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:text-white'
                                    }`}
                            >
                                🥛 Base Blanche
                            </button>
                        </div>
                    )}
                </div>

                {/* Items Grid */}
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItems.map(item => (
                            <div
                                key={item.id}
                                className={`group relative bg-gray-900/30 border-2 border-gray-800 rounded-[3rem] overflow-hidden backdrop-blur-3xl hover:border-yellow-400/30 transition-all duration-500 flex flex-col h-full hover:shadow-3xl hover:shadow-yellow-400/5 ${item.category === 'promos' ? 'border-yellow-400/50' : ''
                                    }`}
                            >
                                {/* Media Section */}
                                <div className="relative h-64 overflow-hidden border-b-2 border-gray-800/50">
                                    {item.image && (item.image.startsWith('/') || item.image.startsWith('http')) ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-gray-900/50 group-hover:bg-gray-800/50 transition-colors">
                                            <span className="text-8xl filter drop-shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                                                {item.image || '🍽️'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Badges Overlays */}
                                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
                                        <div className="flex flex-col gap-2">
                                            {item.bestseller && (
                                                <span className="bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-[0.2em] shadow-2xl ring-2 ring-black/50">
                                                    TOP VENTE
                                                </span>
                                            )}
                                            {item.popular && (
                                                <span className="bg-orange-600 text-white px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-[0.2em] shadow-2xl ring-2 ring-black/50 flex items-center gap-1 w-fit">
                                                    <Flame className="w-3 h-3" /> POPULAIRE
                                                </span>
                                            )}
                                        </div>

                                        {/* Category Badge */}
                                        <span className="bg-black/40 backdrop-blur-md text-white/60 px-3 py-1.5 rounded-xl font-black text-[8px] uppercase tracking-widest border border-white/5">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-8 flex flex-col flex-1 gap-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className="text-2xl font-black text-white italic group-hover:text-yellow-400 transition-colors line-clamp-2 uppercase leading-none tracking-tight">
                                                {item.name}
                                            </h3>
                                        </div>
                                        {item.ingredients && (
                                            <p className="text-gray-500 font-bold text-xs leading-relaxed line-clamp-3 italic opacity-70 group-hover:opacity-100 transition-opacity">
                                                {item.ingredients}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Section */}
                                    <div className="mt-auto pt-6 border-t border-gray-800/50">
                                        {renderPriceAndButton(item)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 space-y-8 animate-in fade-in zoom-in duration-500">
                        <div className="w-32 h-32 bg-gray-900/50 rounded-[3rem] border border-gray-800 flex items-center justify-center mx-auto text-6xl opacity-50">
                            🥡
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black text-white italic">Aucune pépite trouvée</h3>
                            <p className="text-gray-500 font-bold">Affinez votre recherche pour trouver votre bonheur.</p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedCategory('all');
                                setSearchQuery('');
                            }}
                            className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition"
                        >
                            Réinitialiser
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}