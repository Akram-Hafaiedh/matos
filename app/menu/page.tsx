'use client';

import { categories, menuItems } from '@/lib/data/menu';
import { Flame, Minus, Plus, Star, Percent } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

import { MenuItem } from '@/types/menu';
import { useCart } from '../cart/CartContext';

export default function MenuPage() {

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSauce, setSelectedSauce] = useState<'all' | 'rouge' | 'blanche'>('all');

    const { addToCart } = useCart();

    let filteredItems = selectedCategory === 'all'
        ? Object.values(menuItems).flat()
        : menuItems[selectedCategory as keyof typeof menuItems] || [];

    // If pizza category is selected, filter by sauce
    if (selectedCategory === 'pizza' && selectedSauce !== 'all') {
        filteredItems = filteredItems.filter((item: MenuItem) =>
            'sauce' in item && item.sauce === selectedSauce
        );
    }

    const renderPriceAndButton = (item: MenuItem) => {

        // NEW: Special rendering for promo items
        if (item.category === 'promos' && item.originalPrice && item.price && typeof item.price === 'number') {
            return (
                <div className="space-y-3">
                    {/* Savings Badge */}
                    <div className="flex items-center justify-between">
                        <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                            <Percent className="w-3 h-3" />
                            -{item.discount}%
                        </div>
                        <span className="text-green-400 font-bold text-sm">
                            Économisez {item.savings} DT
                        </span>
                    </div>

                    {/* Prices */}
                    <div className="flex items-center gap-3">
                        <span className="text-xl text-gray-500 line-through">
                            {item.originalPrice} DT
                        </span>
                        <span className="text-3xl font-black text-yellow-400">
                            {item.price} DT
                        </span>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => addToCart(item)}
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-3 rounded-full font-black text-base transition flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Ajouter au panier
                    </button>
                </div>
            );
        }
        if (!item.price) {
            return (
                <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-bold text-sm">Prix variable</span>
                    <button
                        onClick={() => addToCart(item)}
                        className="bg-yellow-400 text-gray-900 p-2 rounded-full hover:bg-yellow-300 transition shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            );
        }

        if (typeof item.price === 'number') {
            return (
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-yellow-400">{item.price} DT</span>
                    <button
                        onClick={() => addToCart(item)}
                        className="bg-yellow-400 text-gray-900 p-2 rounded-full hover:bg-yellow-300 transition shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            );
        }

        if (typeof item.price === 'object') {
            // Pizza with XL/XXL sizes
            if ('xl' in item.price && 'xxl' in item.price) {
                return (
                    <div className="space-y-2">
                        <button
                            onClick={() => addToCart(item, 'xl')}
                            className="w-full bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 text-white px-4 py-2 rounded-lg font-bold text-sm transition flex items-center justify-between"
                        >
                            <span>XL</span>
                            <span>{item.price.xl} DT</span>
                        </button>
                        <button
                            onClick={() => addToCart(item, 'xxl')}
                            className="w-full bg-gray-800 hover:bg-yellow-400 hover:text-gray-900 text-white px-4 py-2 rounded-lg font-bold text-sm transition flex items-center justify-between"
                        >
                            <span>XXL</span>
                            <span>{item.price.xxl} DT</span>
                        </button>
                    </div>
                );
            }
            // Multiple sizes (tacos)
            return (
                <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-bold text-sm">Tailles multiples</span>
                    <button
                        onClick={() => addToCart(item)}
                        className="bg-yellow-400 text-gray-900 p-2 rounded-full hover:bg-yellow-300 transition shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="min-h-screen bg-gray-900 py-20 pb-32">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl md:text-7xl font-black text-white mb-4">
                        Notre <span className="text-yellow-400">Menu</span>
                    </h1>
                    <p className="text-2xl text-gray-400">Découvrez nos délicieuses spécialités</p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-6 py-3 rounded-full font-black text-lg transition transform hover:scale-105 ${selectedCategory === cat.id
                                ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-500/50'
                                : 'bg-gray-800 text-white hover:bg-gray-700'
                                }`}
                        >
                            <span className="mr-2">{cat.emoji}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Sauce Filter - Only show when Pizza category is selected */}
                {selectedCategory === 'pizza' && (
                    <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-down">
                        <div className="bg-gray-800 rounded-full p-1 flex gap-1">
                            <button
                                onClick={() => setSelectedSauce('all')}
                                className={`px-5 py-2 rounded-full font-bold text-sm transition ${selectedSauce === 'all'
                                    ? 'bg-yellow-400 text-gray-900'
                                    : 'text-white hover:bg-gray-700'
                                    }`}
                            >
                                Toutes
                            </button>
                            <button
                                onClick={() => setSelectedSauce('rouge')}
                                className={`px-5 py-2 rounded-full font-bold text-sm transition flex items-center gap-2 ${selectedSauce === 'rouge'
                                    ? 'bg-red-600 text-white'
                                    : 'text-white hover:bg-gray-700'
                                    }`}
                            >
                                <span className="text-lg">🍅</span>
                                Sauce Tomate
                            </button>
                            <button
                                onClick={() => setSelectedSauce('blanche')}
                                className={`px-5 py-2 rounded-full font-bold text-sm transition flex items-center gap-2 ${selectedSauce === 'blanche'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-white hover:bg-gray-700'
                                    }`}
                            >
                                <span className="text-lg">🥛</span>
                                Sauce Blanche
                            </button>
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="text-center mb-8">
                    <p className="text-gray-400 text-sm">
                        {filteredItems.length} {filteredItems.length === 1 ? 'article' : 'articles'}
                    </p>
                </div>

                {/* Menu Items Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map(item => (
                        <div
                            key={item.id}
                            className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border-2 transition transform hover:scale-105 shadow-xl group flex flex-col h-full ${item.category === 'promos'
                                ? 'border-yellow-400 shadow-yellow-400/20'
                                : 'border-gray-700 hover:border-yellow-400'
                                }`}
                        >
                            {/* IMAGE SECTION - Big visual focal point */}
                            <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center overflow-hidden">
                                {item.image.startsWith('/') ? (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
                                        {item.image}
                                    </div>
                                )}

                                {/* Sauce Badge for Pizzas */}
                                {'sauce' in item && item.sauce && (
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${item.sauce === 'rouge'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-blue-600 text-white'
                                            }`}>
                                            {item.sauce === 'rouge' ? '🍅 Tomate' : '🥛 Blanche'}
                                        </span>
                                    </div>
                                )}

                                {/* Badges overlaid on image */}
                                <div className="absolute top-3 right-3 flex gap-2">
                                    {item.bestseller && (
                                        <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
                                            <Star className="w-3 h-3 fill-current" />
                                        </span>
                                    )}
                                    {item.popular && (
                                        <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-black shadow-lg">
                                            🔥
                                        </span>
                                    )}
                                    {item.hot && (
                                        <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
                                            <Flame className="w-3 h-3" />
                                        </span>
                                    )}
                                </div>
                            </div>
                            {/* CONTENT SECTION */}
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-xl font-black text-white mb-2 line-clamp-1">
                                    {item.name}
                                </h3>

                                <div className="h-14 mb-4">
                                    {item.ingredients && (
                                        <p className={`text-gray-400 text-xs ${item.category === 'promos' ? 'line-clamp-3' : 'line-clamp-2'
                                            }`}>
                                            {item.ingredients}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-auto">
                                    {renderPriceAndButton(item)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-2xl font-black text-white mb-2">Aucun article trouvé</h3>
                        <p className="text-gray-400">Essayez de sélectionner une autre catégorie</p>
                    </div>
                )}
            </div>
        </div>
    )
}