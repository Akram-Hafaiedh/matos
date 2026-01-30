'use client';

import { useState } from "react";
import { useCart } from "./CartContext";
import { Minus, Plus, ShoppingBag, Trash2, X, Check, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function GlobalCart() {
    const router = useRouter();

    const { cart, removeFromCart, addToCart, clearCart, getTotalPrice, getTotalItems, isCartOpen, setCartOpen } = useCart() as any;

    const totalItems = getTotalItems();
    return (
        <>
            {/* Floating Cart Button - Bottom Right */}
            {totalItems > 0 && (
                <button
                    onClick={() => setCartOpen(true)}
                    className="fixed bottom-8 right-8 bg-yellow-400 hover:bg-yellow-300 text-gray-900 pr-6 pl-4 py-4 rounded-full shadow-2xl shadow-yellow-400/20 font-black text-lg z-[60] flex items-center gap-3 transition-all transform hover:scale-110 active:scale-95 animate-bounce-in group"
                >
                    <div className="bg-gray-900 text-yellow-400 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm group-hover:rotate-12 transition-transform">
                        {totalItems}
                    </div>
                    <span className="uppercase tracking-tighter italic mr-1">Mon Panier</span>
                </button>
            )}

            {/* Cart Sidebar - Slides from right - Premium Glassmorphism */}
            <div
                className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-black/60 backdrop-blur-3xl border-l border-white/10 shadow-3xl z-[70] transform transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">

                    {/* Header */}
                    <div className="p-8 pb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
                                Votre <span className="text-yellow-400">Panier</span>
                            </h2>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">
                                {totalItems} {totalItems === 1 ? 'article' : 'articles'}
                            </p>
                        </div>
                        <button
                            onClick={() => setCartOpen(false)}
                            className="w-12 h-12 rounded-full bg-gray-800/50 hover:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-all transform hover:rotate-90"
                            aria-label="Fermer le panier"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Cart Items - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                        {Object.entries(cart).map(([key, cartItem], index) => {
                            const { item, quantity, selectedSize, type } = cartItem as any;

                            // Calculate price for this item
                            let itemPrice = 0;
                            if (type === 'promotion') {
                                itemPrice = (item as any).price || 0;
                            } else {
                                const menuItem = item as any;
                                if (typeof menuItem.price === 'number') {
                                    itemPrice = menuItem.price;
                                } else if (menuItem.price && typeof menuItem.price === 'object' && selectedSize) {
                                    itemPrice = menuItem.price[selectedSize] || 0;
                                }
                            }

                            const itemImage = type === 'promotion'
                                ? ((item as any).imageUrl || (item as any).emoji || '🎁')
                                : ((item as any).imageUrl || (item as any).image || (item as any).emoji || '🍕');

                            return (
                                <div
                                    key={key}
                                    className="group relative bg-gray-800/40 hover:bg-gray-800/60 rounded-[2rem] p-4 border border-white/5 hover:border-yellow-400/30 transition-all duration-300 animate-slide-up"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-start gap-4">

                                        {/* Item Image */}
                                        <div className="w-20 h-20 flex-shrink-0 bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-white/5 group-hover:scale-105 transition-transform duration-500">
                                            {itemImage.startsWith('/') || itemImage.startsWith('http') ? (
                                                <img
                                                    src={itemImage}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl bg-gray-800">
                                                    {itemImage}
                                                </div>
                                            )}
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 min-w-0 py-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-black text-white text-lg uppercase leading-tight italic tracking-tight">
                                                    {item.name}
                                                </h3>
                                                {itemPrice > 0 && (
                                                    <p className="text-yellow-400 font-black text-lg">
                                                        {(itemPrice * quantity).toFixed(1)}
                                                    </p>
                                                )}
                                            </div>

                                            {selectedSize && (
                                                <div className="inline-block bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-2 py-0.5 mt-2">
                                                    <span className="text-yellow-400 text-[10px] font-black uppercase tracking-widest leading-none">
                                                        TAILLE {selectedSize}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Show ingredients if available */}
                                            {type === 'menuItem' && (item as any).ingredients && (
                                                <p className="text-gray-500 text-xs mt-2 font-medium line-clamp-1">
                                                    {Array.isArray((item as any).ingredients) ? (item as any).ingredients.join(', ') : (item as any).ingredients}
                                                </p>
                                            )}

                                            {/* Choices Display */}
                                            {(cartItem as any).choices && typeof (cartItem as any).choices === 'object' && (
                                                <div className="mt-3 flex flex-wrap gap-1.5">
                                                    {Object.entries((cartItem as any).choices).map(([choiceId, choiceItem]: [string, any]) => (
                                                        <div key={choiceId} className="flex items-center gap-1.5 text-[10px] bg-gray-900/50 border border-white/5 px-2 py-1 rounded-lg text-gray-300">
                                                            <Check className="w-3 h-3 text-yellow-400" />
                                                            <span className="font-bold text-gray-500 uppercase tracking-wider">{choiceId}:</span>
                                                            {choiceItem.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Controls Footer */}
                                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                                        <button
                                            onClick={() => removeFromCart(key)}
                                            className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-1 opacity-60 hover:opacity-100 transition"
                                        >
                                            <Trash2 className="w-3 h-3" /> Supprimer
                                        </button>

                                        <div className="flex items-center gap-3 bg-gray-900 rounded-full p-1 border border-white/5 shadow-inner">
                                            <button
                                                onClick={() => removeFromCart(key)}
                                                className="w-7 h-7 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>

                                            <span className="text-white font-black w-4 text-center text-sm">
                                                {quantity}
                                            </span>

                                            <button
                                                onClick={() => addToCart(item, type, selectedSize, (cartItem as any).choices)}
                                                className="w-7 h-7 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-full flex items-center justify-center transition shadow-lg shadow-yellow-400/20"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer - Total & Actions */}
                    <div className="p-8 bg-gray-900/80 backdrop-blur-xl border-t border-white/10 space-y-6 z-10">

                        {/* Total Price */}
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Total à payer</span>
                            <span className="text-4xl font-black text-white italic tracking-tighter">
                                {getTotalPrice().toFixed(1)} <span className="text-yellow-400 text-2xl not-italic">DT</span>
                            </span>
                        </div>

                        {/* Order Button */}
                        <button
                            className="group w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40 relative overflow-hidden"
                            onClick={() => {
                                setCartOpen(false);
                                router.push('/checkout');
                            }}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                Commander
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>

                        {/* Clear Cart Button */}
                        <button
                            onClick={() => {
                                if (confirm('Voulez-vous vraiment vider le panier ?')) {
                                    clearCart();
                                    setCartOpen(false);
                                }
                            }}
                            className="w-full text-gray-500 hover:text-white py-2 font-bold text-xs uppercase tracking-[0.2em] transition-colors"
                        >
                            Vider le panier
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay - Dark background when cart is open */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] animate-fade-in"
                    onClick={() => setCartOpen(false)}
                />
            )}
        </>
    )
}