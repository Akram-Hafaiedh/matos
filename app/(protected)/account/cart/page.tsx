'use client';

import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight, ArrowLeft, Check, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/CartContext";
import { motion } from "framer-motion";
import { useState } from "react";
import ConfirmModal from "@/components/ConfirmModal";
import { useSupportModal } from "@/hooks/useSupportModal";

export default function AccountCartPage() {
    const router = useRouter();
    const { openSupportModal } = useSupportModal();
    const { cart, removeFromCart, addToCart, clearCart, getTotalPrice, getTotalItems, updateQuantity } = useCart();

    // Modal states
    const [isClearModalOpen, setClearModalOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState<string | null>(null);

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    // Check if empty
    if (totalItems === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in duration-700">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative group"
                >
                    <div className="absolute -inset-10 bg-yellow-400/10 blur-[60px] rounded-full group-hover:bg-yellow-400/20 transition-all duration-1000"></div>
                    <div className="relative w-40 h-40 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                        <ShoppingBag className="w-16 h-16 text-gray-700" />
                    </div>
                </motion.div>

                <div className="space-y-4 max-w-lg">
                    <h1 className="text-5xl md:text-7xl font-[1000] text-white italic tracking-tighter uppercase leading-none">
                        Panier <span className="text-yellow-400/50">Vide</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest leading-relaxed italic">
                        Votre arsenal de saveurs attend d'être déployé.
                    </p>
                </div>

                <Link
                    href="/menu"
                    className="bg-yellow-400 hover:bg-yellow-300 text-black px-12 py-6 rounded-[2rem] font-[1000] text-lg uppercase tracking-widest transition-all shadow-2xl active:scale-95 flex items-center gap-4 group italic"
                >
                    Explorer la Carte
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        );
    }

    const handleRemoveItem = (key: string) => {
        setItemToRemove(key);
    };

    const confirmRemoveItem = () => {
        if (itemToRemove) {
            const item = cart[itemToRemove];
            // If quantity > 1, we could just decrement, but the trash icon usually means remove all
            updateQuantity(itemToRemove, -item.quantity);
            setItemToRemove(null);
        }
    };

    return (
        <div className="w-full space-y-16 animate-in fade-in duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-400/20 bg-yellow-400/5">
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-400">Logistique Tactique</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-none text-white">
                        VOTRE <span className="text-yellow-400 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">PANIER</span>
                    </h1>
                </div>

                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-3 text-gray-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest italic"
                >
                    <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-yellow-400 group-hover:text-yellow-400 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Retour
                </button>
            </div>

            <div className="grid lg:grid-cols-12 gap-16">
                {/* Items List */}
                <div className="lg:col-span-8 space-y-8">
                    {Object.entries(cart).map(([key, cartItem], index) => {
                        const { item, quantity, selectedSize, type } = cartItem as any;

                        // SYNCED PRICE LOGIC FROM PUBLIC CART
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
                            if (promo.price && promo.price > 0) itemPrice = promo.price;
                            else if (promo.discount && originalTotal > 0) itemPrice = originalTotal * (1 - promo.discount / 100);
                            else itemPrice = originalTotal;
                        } else {
                            const menuItem = item as any;
                            if (typeof menuItem.price === 'number') itemPrice = menuItem.price;
                            else if (menuItem.price && typeof menuItem.price === 'object' && selectedSize) itemPrice = menuItem.price[selectedSize] || 0;
                        }

                        const itemImage = type === 'promotion'
                            ? ((item as any).imageUrl || (item as any).emoji || '🎁')
                            : ((item as any).imageUrl || (item as any).image || (item as any).emoji || '🍕');

                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative grid grid-cols-1 md:grid-cols-12 bg-[#0a0a0a] border border-white/5 rounded-[3rem] overflow-hidden hover:border-yellow-400/20 transition-all duration-500 shadow-xl"
                            >
                                {/* Image section */}
                                <div className="md:col-span-3 h-48 md:h-full bg-black/40 flex items-center justify-center p-6 border-r border-white/5">
                                    {itemImage.startsWith('/') || itemImage.startsWith('http') ? (
                                        <img src={itemImage} alt={item.name} className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="text-7xl filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-500">{itemImage}</div>
                                    )}
                                </div>

                                {/* Content section */}
                                <div className="md:col-span-9 p-8 flex flex-col justify-between space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <p className="text-yellow-400 font-black text-[9px] uppercase tracking-[0.3em] italic">{(item as any).category || 'Menu'}</p>
                                            <h3 className="text-3xl font-[1000] text-white italic tracking-tighter uppercase leading-none">{item.name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-4xl font-[1000] text-white italic tracking-tighter leading-none">{(itemPrice * quantity).toFixed(1)} <span className="text-xs text-gray-600 not-italic font-bold">DT</span></p>
                                            {originalTotal > itemPrice && (
                                                <p className="text-gray-700 line-through text-xs font-black italic mt-1">{(originalTotal * quantity).toFixed(1)} DT</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Choices / Badges */}
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSize && <span className="px-3 py-1 bg-yellow-400 text-black rounded-lg text-[9px] font-black uppercase tracking-widest italic">Format {selectedSize}</span>}
                                        {(cartItem as any).choices && Object.values((cartItem as any).choices).flatMap((items: any) =>
                                            Array.isArray(items) ? items.map((c, i) => (
                                                <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-gray-400 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-2">
                                                    <Check size={10} className="text-yellow-400" /> {c.name}
                                                </span>
                                            )) : []
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <button onClick={() => handleRemoveItem(key)} className="p-3 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"><Trash2 size={18} /></button>
                                        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/5">
                                            <button onClick={() => updateQuantity(key, -1)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90"><Minus size={16} /></button>
                                            <span className="w-10 text-center text-xl font-[1000] italic tabular-nums">{quantity}</span>
                                            <button onClick={() => updateQuantity(key, 1)} className="w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center transition-all active:scale-90"><Plus size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Summary */}
                <div className="lg:col-span-4">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[4rem] p-10 space-y-10 sticky top-28 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 blur-[80px] pointer-events-none group-hover:bg-yellow-400/10 transition-all duration-1000"></div>

                        <div className="space-y-2 relative z-10">
                            <h2 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter">RÉCAPITULATIF</h2>
                            <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.4em] italic pl-1">Données Transmises</p>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-center text-gray-500 font-bold uppercase text-[10px] tracking-widest pl-1">
                                <span>Articles</span>
                                <span className="text-white font-[1000] italic">{totalItems}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500 font-bold uppercase text-[10px] tracking-widest pl-1">
                                <span>Sous-Total</span>
                                <span className="text-white font-[1000] italic">{totalPrice.toFixed(1)} <span className="text-[8px] opacity-40">DT</span></span>
                            </div>

                            <div className="pt-8 border-t border-dashed border-white/10">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em] mb-2 italic">Total Tactique</p>
                                    <p className="text-7xl font-[1000] text-white italic tracking-tighter leading-none">{totalPrice.toFixed(1)} <span className="text-xl not-italic opacity-30 text-gray-500">DT</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 space-y-4 relative z-10">
                            <Link
                                href="/account/checkout"
                                className="w-full py-7 bg-yellow-400 hover:bg-yellow-300 text-black rounded-[2.5rem] font-[1000] text-xl uppercase tracking-widest flex items-center justify-center gap-4 transition-all shadow-2xl shadow-yellow-400/10 active:scale-[0.98] italic"
                            >
                                Passer la Commande
                                <ArrowRight size={24} />
                            </Link>
                            <button
                                onClick={() => setClearModalOpen(true)}
                                className="w-full py-4 text-gray-700 hover:text-red-500 font-black uppercase text-[10px] tracking-widest transition-all italic border-b border-white/5"
                            >
                                VIDER LE PANIER
                            </button>
                            <button
                                onClick={() => openSupportModal({ module: 'cart', subject: 'Aide avec mon Panier' })}
                                className="w-full py-4 text-gray-500 hover:text-yellow-400 font-black uppercase text-[10px] tracking-widest transition-all italic flex items-center justify-center gap-2"
                            >
                                Beside d'aide ?
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ConfirmModal
                isOpen={isClearModalOpen}
                onClose={() => setClearModalOpen(false)}
                onConfirm={() => { clearCart(); setClearModalOpen(false); }}
                title="Vider le Panier"
                message="Êtes-vous sûr de vouloir supprimer tous les articles de votre logistique ?"
                type="danger"
                confirmText="Vider"
            />

            <ConfirmModal
                isOpen={itemToRemove !== null}
                onClose={() => setItemToRemove(null)}
                onConfirm={confirmRemoveItem}
                title="Retirer l'article"
                message="Voulez-vous supprimer cet article de votre commande ?"
                type="danger"
                confirmText="Supprimer"
            />
        </div>
    );
}
