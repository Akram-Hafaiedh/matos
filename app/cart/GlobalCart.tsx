'use client';

import { useState } from "react";
import { useCart } from "./CartContext";
import { Minus, Plus, ShoppingBag, Trash2, X, Check, ArrowRight, Trash } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function GlobalCart() {
    const router = useRouter();
    const { cart, removeFromCart, addToCart, clearCart, getTotalPrice, getTotalItems, isCartOpen, setCartOpen } = useCart() as any;

    const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);

    const handleClearCart = () => {
        clearCart();
        setIsConfirmResetOpen(false);
        setCartOpen(false);
    };

    const totalItems = getTotalItems();
    return (
        <>
            {/* Floating Cart Button - Bottom Right */}
            {totalItems > 0 && (
                <button
                    onClick={() => setCartOpen(true)}
                    className="fixed bottom-8 right-8 bg-yellow-400 hover:bg-yellow-300 text-black pr-8 pl-6 py-6 rounded-full shadow-[0_0_40px_rgba(250,204,21,0.3)] font-[1000] text-xl z-[60] flex items-center gap-4 transition-all transform hover:scale-105 active:scale-95 animate-bounce-in group"
                >
                    <div className="bg-black text-yellow-400 w-12 h-12 rounded-full flex items-center justify-center font-black text-sm group-hover:rotate-12 transition-transform shadow-inner border border-yellow-400/20">
                        {totalItems}
                    </div>
                    <span className="uppercase tracking-tighter italic mr-2 leading-none">Mon<br />Panier</span>
                </button>
            )}

            {/* Cart Sidebar - Slides from right - Premium Glassmorphism */}
            <div
                className={`fixed inset-y-0 right-0 w-full sm:w-[500px] bg-[#050505]/90 backdrop-blur-3xl border-l border-white/5 shadow-2xl z-[210] transform transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Ambient Glow inside Sidebar */}
                <div className="absolute top-0 right-0 w-full h-[500px] bg-yellow-400/5 blur-[100px] pointer-events-none"></div>

                <div className="h-full flex flex-col relative z-10">

                    {/* Header */}
                    <div className="p-8 md:p-12 pb-6 flex items-start justify-between">
                        <div className="space-y-2">
                            <span className="text-yellow-400 font-black text-[10px] uppercase tracking-[0.4em] italic mb-2 block">
                                Votre Sélection
                            </span>
                            <h2 className="text-5xl font-[1000] text-white italic tracking-tighter uppercase leading-none">
                                Panier
                            </h2>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                                {totalItems} {totalItems === 1 ? 'article' : 'articles'}
                            </p>
                        </div>
                        <button
                            onClick={() => setCartOpen(false)}
                            className="w-14 h-14 rounded-full bg-white/5 hover:bg-yellow-400 hover:text-black flex items-center justify-center text-white transition-all transform hover:rotate-90 group"
                            aria-label="Fermer le panier"
                        >
                            <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>

                    {/* Cart Items - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 scrollbar-hide">
                        {Object.entries(cart).map(([key, cartItem], index) => {
                            const { item, quantity, selectedSize, type } = cartItem as any;

                            // Calculate price for this item
                            let itemPrice = 0;
                            let originalTotal = 0;
                            if (type === 'promotion') {
                                const promo = item as any;
                                const choices = (cartItem as any).choices;

                                if (choices) {
                                    Object.values(choices).forEach((items: any) => {
                                        if (Array.isArray(items)) {
                                            items.forEach(choiceItem => {
                                                if (choiceItem.price) {
                                                    if (typeof choiceItem.price === 'number') {
                                                        originalTotal += choiceItem.price;
                                                    } else if (typeof choiceItem.price === 'object') {
                                                        originalTotal += choiceItem.price.xl || Object.values(choiceItem.price)[0] || 0;
                                                    }
                                                }
                                            });
                                        }
                                    });
                                } else if (promo.originalPrice) {
                                    originalTotal = promo.originalPrice;
                                }

                                if (promo.price && promo.price > 0) {
                                    itemPrice = promo.price;
                                } else if (promo.discount && originalTotal > 0) {
                                    itemPrice = originalTotal * (1 - promo.discount / 100);
                                } else {
                                    itemPrice = originalTotal;
                                }
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
                                    className="group relative bg-[#0a0a0a] hover:bg-[#111] rounded-[2.5rem] p-5 border border-white/5 hover:border-yellow-400/20 transition-all duration-500 animate-slide-up"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-start gap-6">

                                        {/* Item Image */}
                                        <div className="w-24 h-24 flex-shrink-0 bg-black rounded-[1.5rem] overflow-hidden border border-white/5 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500">
                                            {itemImage.startsWith('/') || itemImage.startsWith('http') ? (
                                                <img
                                                    src={itemImage}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain p-2 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                                                />
                                            ) : (
                                                <div className="text-4xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                                    {itemImage}
                                                </div>
                                            )}
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 min-w-0 py-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-[1000] text-2xl text-white uppercase leading-[0.9] italic tracking-tighter pr-4">
                                                    {item.name}
                                                </h3>
                                                <div className="flex flex-col items-end">
                                                    {/* Final Price - The Hero */}
                                                    <p className="text-white font-[1000] text-3xl tracking-tighter leading-none mb-1">
                                                        {(itemPrice * quantity).toFixed(1)}
                                                    </p>

                                                    {/* Discount Details - Secondary Row */}
                                                    {(originalTotal || item.originalPrice) > itemPrice && (
                                                        <div className="flex items-center gap-2">
                                                            {item.discount && (
                                                                <span className="bg-yellow-400 text-black px-1.5 py-0.5 rounded-md text-[9px] font-black italic leading-none">
                                                                    -{item.discount}%
                                                                </span>
                                                            )}
                                                            <p className="text-gray-600 line-through text-[11px] font-black italic tracking-tighter leading-none">
                                                                {((originalTotal || item.originalPrice) * quantity).toFixed(1)}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {selectedSize && (
                                                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-lg text-[9px] font-[1000] uppercase tracking-widest leading-none">
                                                        Format {selectedSize}
                                                    </span>
                                                )}

                                                {/* Choices Display */}
                                                {(cartItem as any).choices && typeof (cartItem as any).choices === 'object' && Object.keys((cartItem as any).choices).length > 0 ? (
                                                    Object.entries((cartItem as any).choices).flatMap(([ruleId, items]: [string, any]) => {
                                                        // items is an array of selected items for this rule
                                                        if (Array.isArray(items)) {
                                                            return items.map((choiceItem, idx) => (
                                                                <span key={`${ruleId}-${idx}`} className="flex items-center gap-1.5 text-[9px] bg-white/5 border border-white/5 px-3 py-1 rounded-lg text-gray-400 font-bold uppercase tracking-wider">
                                                                    {choiceItem.name}
                                                                </span>
                                                            ));
                                                        }
                                                        return [];
                                                    })
                                                ) : (
                                                    type === 'promotion' && (item as any).description && (
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {(item as any).description.split(/[•,]/).map((part: string, idx: number) => {
                                                                const trimmed = part.trim();
                                                                if (!trimmed) return null;
                                                                return (
                                                                    <span key={`desc-${idx}`} className="flex items-center gap-1.5 text-[9px] bg-white/5 border border-white/5 px-3 py-1 rounded-lg text-gray-400 font-bold uppercase tracking-wider">
                                                                        {trimmed}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Controls Footer */}
                                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                                        <button
                                            onClick={() => removeFromCart(key)}
                                            className="text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-2 opacity-50 hover:opacity-100 transition-all group/del"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center group-hover/del:scale-110 transition-transform">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </div>
                                            <span>Retirer</span>
                                        </button>

                                        <div className="flex items-center gap-1 bg-black rounded-full p-1.5 border border-white/10 shadow-inner">
                                            <button
                                                onClick={() => removeFromCart(key)}
                                                className="w-8 h-8 bg-white/5 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all active:scale-90"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>

                                            <span className="text-white font-[1000] w-8 text-center text-lg">
                                                {quantity}
                                            </span>

                                            <button
                                                onClick={() => addToCart(item, type, selectedSize, (cartItem as any).choices)}
                                                className="w-8 h-8 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full flex items-center justify-center transition-all active:scale-90 shadow-[0_0_15px_rgba(250,204,21,0.2)]"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {totalItems === 0 && (
                            <div className="h-64 flex flex-col items-center justify-center text-center opacity-30 space-y-6">
                                <ShoppingBag className="w-20 h-20" />
                                <p className="font-[1000] italic uppercase text-2xl tracking-tighter">Votre panier est vide</p>
                            </div>
                        )}
                    </div>

                    {/* Footer - Total & Actions */}
                    <div className="p-8 md:p-10 bg-[#050505]/80 backdrop-blur-2xl border-t border-white/10 space-y-6 z-10 relative">
                        {/* Total Price */}
                        <div className="flex items-end justify-between">
                            <span className="text-gray-500 font-black uppercase tracking-[0.2em] text-xs mb-1">Total Estimé</span>
                            <span className="text-5xl font-[1000] text-white italic tracking-tighter leading-none">
                                {getTotalPrice().toFixed(1)} <span className="text-yellow-400 text-xl not-italic ml-1">DT</span>
                            </span>
                        </div>

                        {/* Order Button */}
                        <button
                            className="group w-full bg-yellow-400 hover:bg-yellow-300 text-black py-6 rounded-[2rem] font-[1000] text-xl uppercase tracking-widest transition-all shadow-[0_0_40px_rgba(250,204,21,0.2)] hover:shadow-[0_0_60px_rgba(250,204,21,0.4)] relative overflow-hidden active:scale-[0.98]"
                            onClick={() => {
                                setCartOpen(false);
                                router.push('/checkout');
                            }}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-4">
                                Passer Commande
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        </button>

                        <button
                            onClick={() => setIsConfirmResetOpen(true)}
                            className="w-full text-gray-600 hover:text-red-500 py-3 font-bold text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-red-500/5 rounded-xl group/reset"
                        >
                            <span className="group-hover/reset:underline decoration-red-500/30 underline-offset-4">Vider le panier</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay - Dark background when cart is open */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] animate-fade-in"
                    onClick={() => setCartOpen(false)}
                />
            )}

            {/* Reset Confirmation Modal */}
            <ConfirmModal
                isOpen={isConfirmResetOpen}
                onClose={() => setIsConfirmResetOpen(false)}
                onConfirm={handleClearCart}
                title="Vider le panier"
                message="Êtes-vous sûr de vouloir supprimer tous les articles de votre panier ? Cette action est irréversible."
                confirmText="Oui, vider"
                cancelText="Annuler"
                type="danger"
            />
        </>
    )
}