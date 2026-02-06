'use client';

import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight, ArrowLeft, Check, ShoppingCart, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/cart/CartContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function CartPage() {
    const router = useRouter();
    const { cart, removeFromCart, addToCart, clearCart, getTotalPrice, getTotalItems } = useCart();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    const deliveryFee = totalPrice > 30 ? 0 : 3;
    const finalTotal = totalPrice + deliveryFee;

    // Check if empty
    if (totalItems === 0) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center space-y-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-400/5 blur-[150px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-400/5 blur-[150px] pointer-events-none"></div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative group"
                >
                    <div className="absolute -inset-10 bg-yellow-400/10 blur-[60px] rounded-full group-hover:bg-yellow-400/20 transition-all duration-1000"></div>
                    <div className="relative w-40 h-40 bg-[#0a0a0a] rounded-full flex items-center justify-center border border-white/5 shadow-2xl">
                        <ShoppingBag className="w-16 h-16 text-gray-700 group-hover:text-yellow-400 transition-colors duration-500" />
                    </div>
                </motion.div>

                <div className="space-y-4 max-w-lg mx-auto">
                    <h1 className="text-5xl md:text-7xl font-[1000] text-white italic tracking-tighter uppercase leading-none">
                        Votre Panier est <span className="text-yellow-400/50">Vide</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest leading-relaxed">
                        L'art culinaire vous attend. Commencez votre voyage gastronomique dès maintenant.
                    </p>
                </div>

                <Link
                    href="/menu"
                    className="bg-yellow-400 hover:bg-yellow-300 text-black px-12 py-6 rounded-[2rem] font-[1000] text-lg uppercase tracking-widest transition-all shadow-[0_0_40px_rgba(250,204,21,0.2)] hover:shadow-[0_0_60px_rgba(250,204,21,0.4)] active:scale-95 flex items-center gap-4 group"
                >
                    Explorer la Carte
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-[#050505] pb-40 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-[800px] bg-gradient-to-b from-yellow-400/5 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 pt-40 space-y-24">

                {/* Header - STRICT MENU PARITY */}
                <motion.div style={{ y }} className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-12">
                    <div className="space-y-8 relative">
                        {/* Decorative Tag */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-400/20 bg-yellow-400/5 backdrop-blur-md">
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400/80">
                                Récapitulatif
                            </span>
                        </div>

                        {/* Massive Typography Title */}
                        <div className="relative">
                            <h1 className="text-6xl md:text-[9rem] leading-[0.8] font-[1000] uppercase italic tracking-tighter text-white mix-blend-screen relative z-10 ml-[-0.05em]">
                                Mon
                                <span className="block text-transparent bg-clip-text bg-gradient-to-br from-white to-white/20">
                                    Panier
                                </span>
                            </h1>

                            {/* The Signature Yellow Box - Rotated */}
                            <motion.div
                                initial={{ opacity: 0, rotate: 12, scale: 0.9 }}
                                animate={{ opacity: 1, rotate: 6, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                                className="absolute -top-12 -right-8 md:-right-24 bg-yellow-400 text-black px-6 md:px-10 py-2 md:py-4 transform rotate-6 z-20 shadow-[0_20px_50px_rgba(250,204,21,0.3)] hidden md:block"
                            >
                                <span className="text-xl md:text-3xl font-[1000] italic tracking-tighter uppercase">
                                    {totalItems} Articles
                                </span>
                            </motion.div>
                        </div>
                    </div>

                    <div className="w-full md:w-auto flex flex-col gap-4">
                        <Link
                            href="/menu"
                            className="inline-flex items-center gap-3 text-gray-500 hover:text-white transition-all group uppercase text-[10px] font-black tracking-[0.2em] self-end"
                        >
                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-yellow-400 group-hover:text-yellow-400 transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            Retour au menu
                        </Link>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-y-12 gap-x-12">

                    {/* Cart Items List - Spans 8 Columns */}
                    <div className="lg:col-span-8 space-y-6">
                        {Object.entries(cart).map(([key, cartItem], index) => {
                            const { item, quantity, selectedSize, type } = cartItem as any;

                            // Calculate price
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
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={key}
                                    className="group relative grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-[#0F0F0F] rounded-[2rem] border border-white/5 hover:border-yellow-400/20 transition-all duration-500"
                                >
                                    {/* Image Column (4 cols) - Matches ProductCard */}
                                    <div className="md:col-span-4 h-64 md:h-full relative overflow-hidden bg-black p-8 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                        {itemImage.startsWith('/') || itemImage.startsWith('http') ? (
                                            <img
                                                src={itemImage}
                                                alt={item.name}
                                                className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="text-8xl filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500">
                                                {itemImage}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Column (8 cols) */}
                                    <div className="md:col-span-8 p-8 flex flex-col justify-between space-y-6 bg-gradient-to-b from-white/5 to-transparent">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                {type === 'menuItem' && (
                                                    <span className="text-yellow-400 font-black text-[9px] uppercase tracking-[0.3em] italic block">
                                                        {(item as any).category || 'Menu'}
                                                    </span>
                                                )}
                                                <h3 className="text-3xl font-[1000] text-white italic tracking-tighter uppercase leading-[0.9]">
                                                    {item.name}
                                                </h3>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                {/* Final Price */}
                                                <p className="text-4xl font-[1000] text-white italic tracking-tighter leading-none mb-2">
                                                    {(itemPrice * quantity).toFixed(1)} <span className="text-sm text-gray-500 not-italic font-bold">DT</span>
                                                </p>

                                                {/* Discount Info */}
                                                {(originalTotal || item.originalPrice) > itemPrice && (
                                                    <div className="flex items-center gap-2">
                                                        {item.discount && (
                                                            <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-md text-[10px] font-black italic">
                                                                -{item.discount}%
                                                            </span>
                                                        )}
                                                        <p className="text-gray-600 line-through text-xs font-black italic tracking-tighter leading-none">
                                                            {((originalTotal || item.originalPrice) * quantity).toFixed(1)} DT
                                                        </p>
                                                    </div>
                                                )}

                                                {quantity > 1 && (
                                                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-2">{itemPrice.toFixed(1)} DT / UNITÉ</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Specs / Badges */}
                                        <div className="flex flex-wrap gap-2">
                                            {selectedSize && (
                                                <span className="bg-yellow-400 text-black border border-yellow-400 px-4 py-1.5 rounded-xl text-[10px] font-[1000] uppercase tracking-widest">
                                                    Format {selectedSize}
                                                </span>
                                            )}
                                            {(cartItem as any).choices && Object.keys((cartItem as any).choices).length > 0 ? (
                                                Object.entries((cartItem as any).choices).flatMap(([ruleId, items]: [string, any]) => {
                                                    if (Array.isArray(items)) {
                                                        return items.map((choiceItem, idx) => (
                                                            <span key={`${ruleId}-${idx}`} className="bg-black/50 text-gray-300 border border-white/10 px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                                                                <Check className="w-3 h-3 text-yellow-400" /> {choiceItem.name}
                                                            </span>
                                                        ));
                                                    }
                                                    return [];
                                                })
                                            ) : (
                                                type === 'promotion' && (item as any).description && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {(item as any).description.split(/[•,]/).map((part: string, idx: number) => {
                                                            const trimmed = part.trim();
                                                            if (!trimmed) return null;
                                                            return (
                                                                <span key={`desc-${idx}`} className="bg-black/50 text-gray-300 border border-white/10 px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                                                                    <Sparkles className="w-3 h-3 text-yellow-400/50" /> {trimmed}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {/* Actions Bar */}
                                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                            <button
                                                onClick={() => removeFromCart(key)}
                                                className="group/del flex items-center gap-2 text-red-500/60 hover:text-red-400 transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-full border border-red-500/20 flex items-center justify-center group-hover/del:bg-red-500/10 transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Supprimer</span>
                                            </button>

                                            <div className="flex items-center gap-1 bg-black p-1.5 rounded-full border border-white/10 shadow-inner">
                                                <button
                                                    onClick={() => removeFromCart(key)}
                                                    className="w-10 h-10 bg-[#1a1a1a] hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-all active:scale-90"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="text-white font-[1000] w-10 text-center text-xl tabular-nums">{quantity}</span>
                                                <button
                                                    onClick={() => addToCart(item, type, selectedSize, (cartItem as any).choices)}
                                                    className="w-10 h-10 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full flex items-center justify-center transition-all active:scale-90 shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Summary Sidebar - Spans 4 Columns */}
                    <div className="lg:col-span-4">
                        <div className="bg-[#0F0F0F] rounded-[2.5rem] p-8 md:p-10 border border-white/5 sticky top-8 shadow-2xl space-y-8 relative overflow-hidden group">
                            {/* Decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 blur-[80px] pointer-events-none group-hover:bg-yellow-400/10 transition-colors duration-1000"></div>

                            <div className="relative z-10 border-b border-dashed border-white/10 pb-8">
                                <h2 className="text-4xl font-[1000] text-white flex items-center gap-4 uppercase italic tracking-tighter leading-none">
                                    <Sparkles className="w-8 h-8 text-yellow-400" /> Total
                                </h2>
                                <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mt-2 pl-12 opacity-60">Ticket de caisse</p>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between text-gray-400 font-bold uppercase text-[11px] tracking-[0.2em]">
                                    <span>Sous-total</span>
                                    <span className="text-white">{totalPrice.toFixed(1)} DT</span>
                                </div>
                                <div className="flex justify-between font-bold uppercase text-[11px] tracking-[0.2em]">
                                    <span className="text-gray-400">Livraison</span>
                                    <span className={deliveryFee === 0 ? 'text-green-400' : 'text-gray-500'}>
                                        {deliveryFee === 0 ? 'OFFERTE' : `${deliveryFee} DT`}
                                    </span>
                                </div>

                                <div className="bg-black/50 p-6 rounded-2xl border border-white/5 space-y-1">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs text-gray-500 font-black uppercase tracking-widest mb-1">Total TTC</span>
                                        <span className="text-5xl font-[1000] text-white italic tracking-tighter">
                                            {finalTotal.toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="text-right text-yellow-400 font-black text-sm uppercase tracking-widest">Dinars Tunisiens</div>
                                </div>
                            </div>

                            {totalPrice < 30 && deliveryFee > 0 && (
                                <div className="bg-yellow-400/5 border border-yellow-400/10 p-5 rounded-2xl relative z-10">
                                    <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.1em] leading-relaxed text-center">
                                        Plus que <span className="text-white">{(30 - totalPrice).toFixed(1)} DT</span> pour la livraison gratuite
                                    </p>
                                </div>
                            )}

                            <div className="pt-4 space-y-4 relative z-10">
                                <Link
                                    href="/checkout"
                                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-7 rounded-[2rem] font-[1000] text-xl uppercase tracking-[0.2em] transition-all shadow-[0_0_40px_rgba(250,204,21,0.2)] hover:shadow-[0_0_60px_rgba(250,204,21,0.4)] active:scale-95 flex items-center justify-center gap-4 group"
                                >
                                    Paiement
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button
                                    onClick={() => {
                                        if (confirm('Voulez-vous vraiment vider le panier ?')) {
                                            clearCart();
                                        }
                                    }}
                                    className="w-full text-gray-600 hover:text-red-500 py-3 font-bold text-[10px] uppercase tracking-[0.3em] transition-colors"
                                >
                                    Vider le panier
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
