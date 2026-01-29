'use client';


import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight, ArrowLeft, Check, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/cart/CartContext";

export default function CartPage() {
    const router = useRouter();
    const { cart, removeFromCart, addToCart, clearCart, getTotalPrice, getTotalItems } = useCart();

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    const deliveryFee = totalPrice > 30 ? 0 : 3;
    const finalTotal = totalPrice + deliveryFee;

    // Check if empty
    if (totalItems === 0) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>

                <div className="w-32 h-32 bg-gray-900/50 rounded-full flex items-center justify-center border border-gray-800 mb-4 animate-bounce-slow">
                    <ShoppingCart className="w-12 h-12 text-gray-600" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase">
                    Votre Panier est <span className="text-gray-700">Vide</span>
                </h1>
                <p className="text-gray-500 font-bold max-w-md uppercase text-sm tracking-widest">
                    Il est temps de remplir votre estomac avec nos délices.
                </p>
                <Link
                    href="/menu"
                    className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-12 py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-xl shadow-yellow-400/10 hover:shadow-yellow-400/30 active:scale-95 flex items-center gap-3 group"
                >
                    Commander
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black py-24 pb-32 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-yellow-400/5 blur-[130px] -ml-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] -mr-64 -mb-64 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-3 text-gray-500 hover:text-white transition-all mb-6 group uppercase text-[10px] font-black tracking-[0.2em]"
                        >
                            <div className="w-8 h-8 rounded-full border border-gray-800 flex items-center justify-center group-hover:border-yellow-400 group-hover:text-yellow-400 transition-all">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            Retour au menu
                        </button>
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
                            Mon <span className="text-yellow-400">Panier</span>
                        </h1>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 px-6 py-3 rounded-2xl">
                        <span className="text-gray-400 uppercase text-xs font-black tracking-widest mr-2">Total Articles:</span>
                        <span className="text-yellow-400 font-black text-xl italic">{totalItems}</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">

                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {Object.entries(cart).map(([key, cartItem], index) => {
                            const { item, quantity, selectedSize, type } = cartItem as any;

                            // Calculate price
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
                                    className="group relative bg-gray-900/40 hover:bg-gray-900/60 rounded-[3rem] p-6 border border-gray-800 hover:border-yellow-400/30 transition-all duration-300 backdrop-blur-xl flex flex-col md:flex-row gap-8 items-start md:items-center"
                                >
                                    {/* Image */}
                                    <div className="w-full md:w-32 h-32 flex-shrink-0 bg-gray-950 rounded-[2rem] overflow-hidden shadow-2xl border border-gray-800 group-hover:scale-105 transition-transform duration-500">
                                        {itemImage.startsWith('/') || itemImage.startsWith('http') ? (
                                            <img
                                                src={itemImage}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-900">
                                                {itemImage}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 w-full space-y-3">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-2xl font-black text-white italic tracking-tight">{item.name}</h3>
                                            <p className="text-xl font-black text-yellow-400">
                                                {(itemPrice * quantity).toFixed(1)} <span className="text-sm text-white/50">DT</span>
                                            </p>
                                        </div>

                                        {type === 'menuItem' && (item as any).ingredients && (
                                            <p className="text-gray-500 text-xs font-bold line-clamp-1">
                                                {Array.isArray((item as any).ingredients) ? (item as any).ingredients.join(', ') : (item as any).ingredients}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-2">
                                            {selectedSize && (
                                                <span className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                    Taille {selectedSize}
                                                </span>
                                            )}
                                            {(cartItem as any).choices && Object.entries((cartItem as any).choices).map(([choiceId, choiceItem]: [string, any]) => (
                                                <span key={choiceId} className="bg-gray-800 text-gray-300 border border-gray-700 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> {choiceItem.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="w-full md:w-auto flex items-center justify-between md:flex-col gap-4 pl-0 md:pl-6 md:border-l border-gray-800">
                                        <div className="flex items-center gap-4 bg-gray-950 rounded-full p-1.5 border border-gray-800 shadow-inner">
                                            <button
                                                onClick={() => removeFromCart(key)}
                                                className="w-8 h-8 bg-gray-900 hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-white font-black w-6 text-center">{quantity}</span>
                                            <button
                                                onClick={() => addToCart(item, type, selectedSize, (cartItem as any).choices)}
                                                className="w-8 h-8 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-full flex items-center justify-center transition shadow-lg shadow-yellow-400/20"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(key)}
                                            className="text-red-500 hover:text-red-400 p-2 rounded-xl transition hover:bg-red-500/10"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900/60 rounded-[3rem] p-10 border border-gray-800 backdrop-blur-3xl sticky top-8 shadow-2xl space-y-8">
                            <h2 className="text-2xl font-black text-white flex items-center gap-4 uppercase italic tracking-tight">
                                <ShoppingBag className="w-6 h-6 text-yellow-400" /> Résumé
                            </h2>

                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between text-gray-500 font-black uppercase text-xs tracking-widest">
                                    <span>Sous-total</span>
                                    <span>{totalPrice.toFixed(1)} DT</span>
                                </div>
                                <div className="flex justify-between font-black uppercase text-xs tracking-widest">
                                    <span className="text-gray-500">Livraison</span>
                                    <span className={deliveryFee === 0 ? 'text-green-500' : 'text-gray-500'}>
                                        {deliveryFee === 0 ? 'Offerte' : `${deliveryFee} DT`}
                                    </span>
                                </div>
                                {totalPrice < 30 && deliveryFee > 0 && (
                                    <div className="bg-yellow-400/5 border border-yellow-400/10 p-4 rounded-2xl">
                                        <p className="text-yellow-400/70 text-[10px] font-black uppercase tracking-widest leading-relaxed text-center">
                                            Plus que {(30 - totalPrice).toFixed(1)} DT pour la livraison gratuite
                                        </p>
                                    </div>
                                )}
                                <div className="flex justify-between text-4xl font-black text-white pt-8 border-t border-gray-800 dashed">
                                    <span className="text-sm text-gray-500 uppercase tracking-widest self-center">Total TTC</span>
                                    <span className="italic tracking-tighter">{finalTotal.toFixed(1)} <span className="text-lg text-yellow-400 not-italic">DT</span></span>
                                </div>
                            </div>

                            <div className="pt-4 space-y-4">
                                <Link
                                    href="/checkout"
                                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-6 rounded-[2rem] font-black text-base uppercase tracking-[0.2em] transition-all shadow-2xl shadow-yellow-400/20 active:scale-95 flex items-center justify-center gap-3 group"
                                >
                                    Paiement
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button
                                    onClick={() => {
                                        if (confirm('Voulez-vous vraiment vider le panier ?')) {
                                            clearCart();
                                        }
                                    }}
                                    className="w-full text-gray-600 hover:text-red-500 py-2 font-bold text-[10px] uppercase tracking-[0.2em] transition-colors"
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
