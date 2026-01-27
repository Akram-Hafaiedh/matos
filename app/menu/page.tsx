'use client';

import { categories, menuItems } from '@/lib/data/menu';
import { Flame, Minus, Plus, Star } from 'lucide-react';
import { useState } from 'react';

import { MenuItem } from '@/types/menu';
import { useCart } from '../cart/CartContext';

export default function MenuPage() {

    const [selectedCategory, setSelectedCategory] = useState('all');

    const { addToCart } = useCart();

    const filteredItems = selectedCategory === 'all'
        ? Object.values(menuItems).flat()
        : menuItems[selectedCategory as keyof typeof menuItems] || [];

    const renderPriceAndButton = (item: MenuItem) => {
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

                {/* Menu Items Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map(item => (
                        <div
                            key={item.id}
                            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border-2 border-gray-700 hover:border-yellow-400 transition transform hover:scale-105 shadow-xl group"
                        >
                            {/* IMAGE SECTION - Big visual focal point */}
                            <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center overflow-hidden">
                                {item.image.startsWith('/') ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
                                        {item.image}
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
                            <div className="p-5">
                                <h3 className="text-xl font-black text-white mb-2 line-clamp-1">
                                    {item.name}
                                </h3>

                                {item.ingredients && (
                                    <p className="text-gray-400 text-xs mb-4 line-clamp-1">
                                        {item.ingredients}
                                    </p>
                                )}

                                {renderPriceAndButton(item)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}