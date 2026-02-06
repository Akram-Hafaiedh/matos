'use client';

import { useCart } from "@/app/cart/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    MapPin, Phone, Clock, CreditCard, ShoppingBag, ArrowLeft,
    AlertCircle, Loader2, ArrowRight, Store, Truck, Sparkles, Check
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/app/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

interface DeliveryInfo {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    notes: string;
    deliveryTime: 'asap' | 'scheduled';
    scheduledTime?: string;
}

export default function AccountCheckoutPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { data: session } = useSession();
    const { cart, getTotalPrice, getTotalItems, clearCart, orderType, setOrderType } = useCart();

    const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
        fullName: session?.user?.name || '',
        phone: session?.user?.phone || '',
        address: '',
        city: 'Tunis',
        notes: '',
        deliveryTime: 'asap'
    });

    useEffect(() => {
        if (session?.user) {
            setDeliveryInfo(prev => ({
                ...prev,
                fullName: prev.fullName || session.user.name || '',
                phone: prev.phone || session.user.phone || ''
            }));
        }
    }, [session]);

    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'd17'>('cash');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<DeliveryInfo>>({});

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    const deliveryFee = orderType === 'pickup' ? 0 : (totalPrice > 30 ? 0 : 3);
    const finalTotal = totalPrice + deliveryFee;

    // Redirect if cart is empty
    useEffect(() => {
        if (totalItems === 0 && !isSubmitting) {
            router.push('/account/cart');
        }
    }, [totalItems, router, isSubmitting]);

    if (totalItems === 0) return null;

    const validateForm = (): boolean => {
        const newErrors: Partial<DeliveryInfo> = {};
        if (!deliveryInfo.fullName.trim()) newErrors.fullName = 'Le nom est requis';
        if (!deliveryInfo.phone.trim()) newErrors.phone = 'Le téléphone est requis';
        else if (!/^[0-9]{8}$/.test(deliveryInfo.phone.replace(/\s/g, ''))) newErrors.phone = '8 chiffres requis';

        if (orderType === 'delivery') {
            if (!deliveryInfo.address.trim()) newErrors.address = 'L\'adresse est requise';
            if (deliveryInfo.deliveryTime === 'scheduled' && !deliveryInfo.scheduledTime) newErrors.scheduledTime = 'Heure requise';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const orderData = {
                cart,
                deliveryInfo: {
                    ...deliveryInfo,
                    address: orderType === 'pickup' ? 'Retrait sur Place' : deliveryInfo.address,
                    city: orderType === 'pickup' ? 'N/A' : deliveryInfo.city,
                },
                paymentMethod,
                orderType,
                totalPrice,
                deliveryFee,
                finalTotal,
                orderDate: new Date().toISOString()
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            if (!result.success) throw new Error(result.error || 'Erreur lors de la commande');

            clearCart();
            toast.success('Commande validée !');
            localStorage.setItem('lastOrder', JSON.stringify(result.order));
            router.push(`/track/${result.order.orderNumber}`);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Une erreur est survenue.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full space-y-16 animate-in fade-in duration-1000">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-white/5 pb-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-400/20 bg-yellow-400/5">
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-400">Section Sécurisée</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-none text-white">
                        FINALISER LE <span className="text-yellow-400 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">DÉPLOIEMENT</span>
                    </h1>
                </div>

                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-3 text-gray-500 hover:text-white transition-all uppercase text-[10px] font-black tracking-widest italic"
                >
                    <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:border-yellow-400 group-hover:text-yellow-400 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Retour au Panier
                </button>
            </div>

            {/* Order Type Toggle */}
            <div className="max-w-xl bg-[#0a0a0a] border border-white/5 p-2 rounded-[2.5rem] flex gap-2">
                <button
                    onClick={() => setOrderType('delivery')}
                    className={`flex-1 py-6 rounded-3xl flex flex-col items-center gap-2 transition-all ${orderType === 'delivery' ? 'bg-yellow-400 text-black shadow-2xl' : 'text-gray-500 hover:bg-white/5'}`}
                >
                    <Truck size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Livraison</span>
                </button>
                <button
                    onClick={() => setOrderType('pickup')}
                    className={`flex-1 py-6 rounded-3xl flex flex-col items-center gap-2 transition-all ${orderType === 'pickup' ? 'bg-yellow-400 text-black shadow-2xl' : 'text-gray-500 hover:bg-white/5'}`}
                >
                    <Store size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Sur Place</span>
                </button>
            </div>

            <div className="grid lg:grid-cols-12 gap-16">
                {/* Form Column */}
                <div className="lg:col-span-8 space-y-12">
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[4rem] p-12 space-y-12 shadow-2xl">
                        <h2 className="text-3xl font-[1000] text-white italic tracking-tighter flex items-center gap-6">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                <MapPin className="w-6 h-6 text-yellow-400" />
                            </div>
                            COORDONNÉES TACTIQUES
                        </h2>

                        <form className="space-y-10">
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] ml-2 italic">Nom complet</label>
                                    <input
                                        type="text"
                                        value={deliveryInfo.fullName}
                                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, fullName: e.target.value })}
                                        className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-yellow-400/50 transition-all outline-none"
                                    />
                                    {errors.fullName && <p className="text-red-500 text-[9px] font-black uppercase italic ml-2">{errors.fullName}</p>}
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] ml-2 italic">Téléphone</label>
                                    <input
                                        type="tel"
                                        value={deliveryInfo.phone}
                                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                                        className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-yellow-400/50 transition-all outline-none"
                                        placeholder="8 chiffres"
                                    />
                                    {errors.phone && <p className="text-red-500 text-[9px] font-black uppercase italic ml-2">{errors.phone}</p>}
                                </div>
                            </div>

                            <AnimatePresence>
                                {orderType === 'delivery' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden space-y-10"
                                    >
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] ml-2 italic">Adresse de Livraison</label>
                                            <textarea
                                                value={deliveryInfo.address}
                                                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                                                className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-yellow-400/50 transition-all outline-none h-32 resize-none"
                                                placeholder="Étage, code, appartement..."
                                            />
                                            {errors.address && <p className="text-red-500 text-[9px] font-black uppercase italic ml-2">{errors.address}</p>}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-10">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] ml-2 italic">Ville de Déploiement</label>
                                                <select
                                                    value={deliveryInfo.city}
                                                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                                                    className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-yellow-400/50 transition-all outline-none appearance-none"
                                                >
                                                    <option value="Tunis">Tunis</option>
                                                    <option value="Ariana">Ariana</option>
                                                    <option value="La Marsa">La Marsa</option>
                                                    <option value="Sidi Bou Said">Sidi Bou Saïd</option>
                                                </select>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase text-gray-600 tracking-[0.2em] ml-2 italic">Notes Spéciales</label>
                                                <input
                                                    type="text"
                                                    value={deliveryInfo.notes}
                                                    onChange={(e) => setDeliveryInfo({ ...deliveryInfo, notes: e.target.value })}
                                                    className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold focus:border-yellow-400/50 transition-all outline-none"
                                                    placeholder="Allergies, instructions..."
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Timing */}
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 space-y-8 shadow-xl">
                            <h2 className="text-xl font-[1000] text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <Clock size={18} className="text-yellow-400" /> TIMING
                            </h2>
                            <div className="space-y-4">
                                <button onClick={() => setDeliveryInfo({ ...deliveryInfo, deliveryTime: 'asap' })} className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all ${deliveryInfo.deliveryTime === 'asap' ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-black border-white/5 text-gray-500 hover:border-white/10'}`}>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest italic">IMMÉDIAT (ASAP)</p>
                                        <p className="text-[9px] font-bold opacity-60">30-45 minutes</p>
                                    </div>
                                    <Check className={`w-5 h-5 transition-opacity ${deliveryInfo.deliveryTime === 'asap' ? 'opacity-100' : 'opacity-0'}`} />
                                </button>
                                <div className={`w-full p-6 rounded-2xl border transition-all ${deliveryInfo.deliveryTime === 'scheduled' ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-black border-white/5 text-gray-500 hover:border-white/10'}`}>
                                    <button onClick={() => setDeliveryInfo({ ...deliveryInfo, deliveryTime: 'scheduled' })} className="w-full flex items-center justify-between mb-2">
                                        <div className="text-left">
                                            <p className="text-[10px] font-black uppercase tracking-widest italic">PROGRAMMER</p>
                                            <p className="text-[9px] font-bold opacity-60">Choisir une heure</p>
                                        </div>
                                        <Check className={`w-5 h-5 transition-opacity ${deliveryInfo.deliveryTime === 'scheduled' ? 'opacity-100' : 'opacity-0'}`} />
                                    </button>
                                    {deliveryInfo.deliveryTime === 'scheduled' && (
                                        <input
                                            type="time"
                                            value={deliveryInfo.scheduledTime}
                                            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, scheduledTime: e.target.value })}
                                            className="w-full bg-black/20 border border-black/10 text-gray-900 px-4 py-3 rounded-xl font-black mt-2 outline-none"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 space-y-8 shadow-xl">
                            <h2 className="text-xl font-[1000] text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <CreditCard size={18} className="text-yellow-400" /> PAIEMENT
                            </h2>
                            <div className="space-y-4">
                                <button onClick={() => setPaymentMethod('cash')} className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all ${paymentMethod === 'cash' ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-black border-white/5 text-gray-500 hover:border-white/10'}`}>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest italic">ESPÈCES</p>
                                        <p className="text-[9px] font-bold opacity-60">À la remise</p>
                                    </div>
                                    <Check className={`w-5 h-5 transition-opacity ${paymentMethod === 'cash' ? 'opacity-100' : 'opacity-0'}`} />
                                </button>
                                <div className="w-full p-6 rounded-2xl border border-dashed border-white/5 opacity-30 text-gray-600 flex flex-col gap-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest italic">CARTE / D17</p>
                                    <p className="text-[9px] font-bold">Bientôt disponible</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Sidebar */}
                <div className="lg:col-span-4">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[4rem] p-10 space-y-10 sticky top-28 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 blur-[80px] pointer-events-none transition-all duration-1000"></div>

                        <div className="space-y-2 relative z-10">
                            <h2 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter flex items-center gap-4">
                                <ShoppingBag size={24} className="text-yellow-400" /> RÉSUMÉ
                            </h2>
                            <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.4em] italic pl-1">Finalisation Dossier</p>
                        </div>

                        <div className="space-y-6 relative z-10 max-h-64 overflow-y-auto pr-2 custom-scrollbar border-b border-white/5 pb-6">
                            {Object.entries(cart).map(([key, cartItem]: [string, any]) => (
                                <div key={key} className="flex justify-between items-start gap-4">
                                    <div className="flex-1 space-y-1">
                                        <p className="text-[10px] font-black text-white uppercase tracking-wider italic leading-none">{cartItem.quantity}x {cartItem.item.name}</p>
                                        {cartItem.selectedSize && <p className="text-[8px] font-black text-yellow-400/50 uppercase tracking-widest">{cartItem.selectedSize}</p>}
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 italic">{((cartItem.item.price || 0) * cartItem.quantity).toFixed(1)} DT</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between text-gray-500 font-black uppercase text-[10px] tracking-widest">
                                <span>SOUS-TOTAL</span>
                                <span>{totalPrice.toFixed(1)} DT</span>
                            </div>
                            <div className="flex justify-between font-black uppercase text-[10px] tracking-widest">
                                <span className="text-gray-500">FRAIS DE DÉPLOIEMENT</span>
                                <span className={deliveryFee === 0 ? 'text-green-500' : 'text-gray-500'}>
                                    {deliveryFee === 0 ? 'OFFERT' : `${deliveryFee.toFixed(1)} DT`}
                                </span>
                            </div>

                            <div className="pt-8 border-t border-dashed border-white/10">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em] mb-2 italic">Total Final</p>
                                    <p className="text-7xl font-[1000] text-white italic tracking-tighter leading-none">{finalTotal.toFixed(1)} <span className="text-xl not-italic opacity-30 text-gray-500">DT</span></p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full py-7 bg-yellow-400 hover:bg-yellow-300 text-black rounded-[2.5rem] font-[1000] text-xl uppercase tracking-widest flex items-center justify-center gap-4 transition-all shadow-2xl shadow-yellow-400/10 active:scale-[0.98] italic disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    TRANSMISSION EN COURS
                                </>
                            ) : (
                                <>
                                    CONFIRMER L'OPÉRATION
                                    <ArrowRight size={24} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
