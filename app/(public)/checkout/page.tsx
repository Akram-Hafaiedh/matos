// app/checkout/page.tsx
'use client';

import { useCart } from "@/app/cart/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MapPin, Phone, Clock, CreditCard, ShoppingBag, ArrowLeft, User, AlertCircle, Loader2, ArrowRight, Store, Truck, Sparkles } from "lucide-react";
import TacticalAura from "@/components/TacticalAura";
import { motion } from "framer-motion";

interface DeliveryInfo {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    notes: string;
    deliveryTime: 'asap' | 'scheduled';
    scheduledTime?: string;
}

import { useSession } from "next-auth/react";
import { useToast } from "../../context/ToastContext";

export default function CheckoutPage() {
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
    const deliveryFee = orderType === 'pickup' ? 0 : (totalPrice > 30 ? 0 : 3); // Free if pickup or > 30 DT
    const finalTotal = totalPrice + deliveryFee;

    // Redirect if cart is empty
    useEffect(() => {
        if (totalItems === 0 && !isSubmitting) {
            router.push('/menu');
        }
    }, [totalItems, router, isSubmitting]);

    if (totalItems === 0) {
        return null; // Don't render anything while redirecting
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<DeliveryInfo> = {};

        if (!deliveryInfo.fullName.trim()) {
            newErrors.fullName = 'Le nom complet est requis';
        }
        if (!deliveryInfo.phone.trim()) {
            newErrors.phone = 'Le numéro de téléphone est requis';
        } else if (!/^[0-9]{8}$/.test(deliveryInfo.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Numéro invalide (8 chiffres requis)';
        }

        if (orderType === 'delivery') {
            if (!deliveryInfo.address.trim()) {
                newErrors.address = 'L\'adresse est requise';
            }
            if (deliveryInfo.deliveryTime === 'scheduled' && !deliveryInfo.scheduledTime) {
                newErrors.scheduledTime = 'Veuillez choisir une heure';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare order data
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

            // Send to backend API
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });


            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Erreur lors de la commande');
            }

            // For now, just store in localStorage and redirect
            localStorage.setItem('lastOrder', JSON.stringify({ ...orderData, orderNumber: result.order.orderNumber }));

            // Clear cart
            clearCart();

            // Show success toast
            toast.success('Commande validée avec succès !');

            // Store last order for easy access
            localStorage.setItem('lastOrder', JSON.stringify(result.order));

            router.push(`/track/${result.order.orderNumber}`);

        } catch (error) {
            console.error('Error submitting order:', error);
            toast.error('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black py-24 pb-48 relative overflow-hidden">
            <TacticalAura opacity={0.3} />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

                {/* Header */}
                <div className="mb-20 border-b border-white/5 pb-16">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-4 text-gray-600 hover:text-white transition-all mb-12 group uppercase text-[10px] font-black tracking-[0.3em] italic"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" strokeWidth={3} />
                        RETOUR AU PANIER
                    </button>

                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-400/20 bg-yellow-400/5 backdrop-blur-md">
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-400">Protocole de Règlement</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-none text-white">
                            VOTRE <span className="text-yellow-400 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">COMMANDE</span>
                        </h1>
                    </div>
                </div>

                {/* Order Type Toggle */}
                <div className="grid grid-cols-2 gap-4 max-w-2xl bg-white/[0.02] p-2 rounded-[2.5rem] border border-white/5 mb-16">
                    <button
                        onClick={() => setOrderType('delivery')}
                        className={`flex items-center justify-center gap-4 py-6 rounded-[2rem] transition-all duration-500 group ${orderType === 'delivery'
                            ? 'bg-yellow-400 text-black shadow-2xl shadow-yellow-400/20 scale-[1.02]'
                            : 'text-gray-500 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Truck className={`w-5 h-5 ${orderType === 'delivery' ? 'text-black' : 'text-gray-600 group-hover:text-yellow-400'}`} />
                        <span className="font-black uppercase text-xs tracking-[0.2em] italic">Livraison</span>
                    </button>
                    <button
                        onClick={() => setOrderType('pickup')}
                        className={`flex items-center justify-center gap-4 py-6 rounded-[2rem] transition-all duration-500 group ${orderType === 'pickup'
                            ? 'bg-yellow-400 text-black shadow-2xl shadow-yellow-400/20 scale-[1.02]'
                            : 'text-gray-500 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <Store className={`w-5 h-5 ${orderType === 'pickup' ? 'text-black' : 'text-gray-600 group-hover:text-yellow-400'}`} />
                        <span className="font-black uppercase text-xs tracking-[0.2em] italic">Sur Place</span>
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">

                    {/* Left Column - Form */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Delivery Information */}
                        <div className="bg-white/[0.02] rounded-[4rem] p-12 border border-white/5 backdrop-blur-3xl hover:border-yellow-400/10 transition-colors duration-500 shadow-2xl space-y-12">
                            <h2 className="text-3xl font-[1000] text-white flex items-center gap-6 uppercase italic tracking-tighter">
                                <div className="w-16 h-16 bg-white/[0.03] rounded-3xl border border-white/5 flex items-center justify-center shadow-2xl">
                                    <MapPin className="w-8 h-8 text-yellow-400" />
                                </div>
                                CORDONNÉES <span className="text-yellow-400">LIVRAISON</span>
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Full Name */}
                                    <div className="space-y-4">
                                        <label className="text-gray-600 font-black uppercase text-[10px] tracking-[0.4em] ml-6 italic">Signature Nominale *</label>
                                        <input
                                            type="text"
                                            value={deliveryInfo.fullName}
                                            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, fullName: e.target.value })}
                                            className={`w-full bg-black/40 border text-white px-8 py-6 rounded-[2rem] font-[1000] italic tracking-tight focus:outline-none transition-all placeholder:text-gray-900 ${errors.fullName ? 'border-red-500/50' : 'border-white/5 focus:border-yellow-400/50'
                                                }`}
                                            placeholder="Agent XXX"
                                        />
                                        {errors.fullName && (
                                            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-4 flex items-center gap-2">
                                                <AlertCircle className="w-3 h-3" /> {errors.fullName}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-4">
                                        <label className="text-gray-600 font-black uppercase text-[10px] tracking-[0.4em] ml-6 italic">Ligne de Contact *</label>
                                        <input
                                            type="tel"
                                            value={deliveryInfo.phone}
                                            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                                            className={`w-full bg-black/40 border text-white px-8 py-6 rounded-[2rem] font-[1000] italic tracking-tight focus:outline-none transition-all placeholder:text-gray-900 ${errors.phone ? 'border-red-500/50' : 'border-white/5 focus:border-yellow-400/50'
                                                }`}
                                            placeholder="XX XXX XXX"
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-4 flex items-center gap-2">
                                                <AlertCircle className="w-3 h-3" /> {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Address & City - Only for Delivery */}
                                <div className={`space-y-12 transition-all duration-500 overflow-hidden ${orderType === 'pickup' ? 'max-h-0 opacity-0' : 'max-h-[800px] opacity-100'}`}>
                                    <div className="space-y-4">
                                        <label className="text-gray-600 font-black uppercase text-[10px] tracking-[0.4em] ml-6 italic">Point de Déploiement *</label>
                                        <textarea
                                            value={deliveryInfo.address}
                                            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                                            className={`w-full bg-black/40 border text-white px-8 py-6 rounded-[2.5rem] font-[1000] italic tracking-tight focus:outline-none transition-all h-32 resize-none placeholder:text-gray-900 ${errors.address ? 'border-red-500/50' : 'border-white/5 focus:border-yellow-400/50'
                                                }`}
                                            placeholder="Rue, numéro, étage, code d'entrée..."
                                        />
                                        {errors.address && (
                                            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-4 flex items-center gap-2">
                                                <AlertCircle className="w-3 h-3" /> {errors.address}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* City */}
                                        <div className="space-y-4">
                                            <label className="text-gray-600 font-black uppercase text-[10px] tracking-[0.4em] ml-6 italic">Secteur Géo</label>
                                            <select
                                                value={deliveryInfo.city}
                                                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                                                className="w-full bg-black/40 border border-white/5 text-white px-8 py-6 rounded-3xl font-[1000] uppercase italic tracking-tight focus:outline-none focus:border-yellow-400/50 transition-all appearance-none"
                                            >
                                                <option value="Tunis">Tunis Central</option>
                                                <option value="Ariana">Secteur Ariana</option>
                                                <option value="Ben Arous">Secteur Ben Arous</option>
                                                <option value="La Marsa">Zone Littorale</option>
                                                <option value="Carthage">Cité Impériale</option>
                                                <option value="Manouba">Secteur Manouba</option>
                                            </select>
                                        </div>

                                        {/* Notes */}
                                        <div className="space-y-4">
                                            <label className="text-gray-600 font-black uppercase text-[10px] tracking-[0.4em] ml-6 italic">Protocoles Additionnels</label>
                                            <input
                                                type="text"
                                                value={deliveryInfo.notes}
                                                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, notes: e.target.value })}
                                                className="w-full bg-black/40 border border-white/5 text-white px-8 py-6 rounded-3xl font-[1000] uppercase italic tracking-tight focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-900"
                                                placeholder="Allergies, instructions..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Delivery Time - Only for Delivery */}
                            <div className={`bg-white/[0.02] rounded-[3rem] p-10 border border-white/5 backdrop-blur-3xl shadow-2xl transition-all duration-500 ${orderType === 'pickup' ? 'opacity-20 grayscale pointer-events-none' : ''}`}>
                                <h2 className="text-2xl font-[1000] text-white mb-8 flex items-center gap-4 uppercase italic tracking-tighter">
                                    <div className="w-12 h-12 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    TIMING
                                </h2>

                                <div className="space-y-4">
                                    <label className={`flex items-center gap-5 p-6 rounded-[2rem] cursor-pointer border transition-all ${deliveryInfo.deliveryTime === 'asap' ? 'bg-yellow-400 border-yellow-400 text-black' : 'bg-black/40 border-white/5 text-gray-500 hover:border-white/10'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="deliveryTime"
                                            checked={deliveryInfo.deliveryTime === 'asap'}
                                            onChange={() => setDeliveryInfo({ ...deliveryInfo, deliveryTime: 'asap' })}
                                            className="w-5 h-5 accent-black"
                                        />
                                        <div className="flex-1">
                                            <p className="font-black uppercase text-xs tracking-widest italic">IMMÉDIAT (ASAP)</p>
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${deliveryInfo.deliveryTime === 'asap' ? 'text-black/60' : 'text-gray-700'}`}>30-45 MIN ENV.</p>
                                        </div>
                                    </label>

                                    <label className={`flex flex-col gap-6 p-6 rounded-[2rem] cursor-pointer border transition-all ${deliveryInfo.deliveryTime === 'scheduled' ? 'bg-yellow-400 border-yellow-400 text-black' : 'bg-black/40 border-white/5 text-gray-500 hover:border-white/10'
                                        }`}>
                                        <div className="flex items-center gap-5 w-full">
                                            <input
                                                type="radio"
                                                name="deliveryTime"
                                                checked={deliveryInfo.deliveryTime === 'scheduled'}
                                                onChange={() => setDeliveryInfo({ ...deliveryInfo, deliveryTime: 'scheduled' })}
                                                className="w-5 h-5 accent-black"
                                            />
                                            <div className="flex-1">
                                                <p className="font-black uppercase text-xs tracking-widest italic">PROGRAMMER</p>
                                                <p className={`text-[10px] font-black uppercase tracking-widest ${deliveryInfo.deliveryTime === 'scheduled' ? 'text-black/60' : 'text-gray-700'}`}>PLANIFICATION TACTIQUE</p>
                                            </div>
                                        </div>
                                        {deliveryInfo.deliveryTime === 'scheduled' && (
                                            <input
                                                type="time"
                                                value={deliveryInfo.scheduledTime || ''}
                                                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, scheduledTime: e.target.value })}
                                                className="w-full bg-black/20 border border-black/10 text-black px-6 py-4 rounded-xl font-black focus:outline-none"
                                            />
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white/[0.02] rounded-[3rem] p-10 border border-white/5 backdrop-blur-3xl shadow-2xl">
                                <h2 className="text-2xl font-[1000] text-white mb-8 flex items-center gap-4 uppercase italic tracking-tighter">
                                    <div className="w-12 h-12 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    RÈGLEMENT
                                </h2>

                                <div className="space-y-4">
                                    <label className={`flex items-center gap-5 p-6 rounded-[2rem] cursor-pointer border transition-all ${paymentMethod === 'cash' ? 'bg-yellow-400 border-yellow-400 text-black' : 'bg-black/40 border-white/5 text-gray-500 hover:border-white/10'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === 'cash'}
                                            onChange={() => setPaymentMethod('cash')}
                                            className="w-5 h-5 accent-black"
                                        />
                                        <div className="flex-1">
                                            <p className="font-black uppercase text-xs tracking-widest italic">ESPÈCES</p>
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'cash' ? 'text-black/60' : 'text-gray-700'}`}>PAIEMENT À RÉCEPTION</p>
                                        </div>
                                    </label>

                                    <div className="flex items-center gap-5 p-6 rounded-[2rem] border border-dashed border-white/5 opacity-40">
                                        <div className="w-5 h-5 rounded-full border border-gray-700" />
                                        <div className="flex-1">
                                            <p className="font-black uppercase text-xs tracking-widest text-gray-500 italic">CARTES / D17</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 italic">PROCHAINEMENT DISPONIBLE</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Tactical Summary Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#0a0a0a] rounded-[3.5rem] p-10 border border-white/5 sticky top-24 shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden group/panel">
                            {/* Brand Accent Line */}
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-yellow-400 opacity-20" />

                            {/* Decoration Circle */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />

                            {/* Header - Kinetic Style */}
                            <div className="flex items-center gap-6 mb-12 relative z-10">
                                <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.2)] -rotate-3 group-hover/panel:rotate-0 transition-transform duration-500">
                                    <ShoppingBag className="w-8 h-8 text-black" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter leading-none pr-[0.4em]">Résumé</h2>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-[2px] bg-yellow-400/30" />
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-400/40 italic">Configuration Tactique</p>
                                    </div>
                                </div>
                            </div>

                            {/* Cart Items - Data Row Style */}
                            <div className="flex-1 space-y-4 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar mb-12 relative z-10">
                                {Object.entries(cart).map(([key, cartItem], idx) => {
                                    const { item, quantity, selectedSize } = cartItem;
                                    let itemPrice = 0;
                                    if (typeof item.price === 'number') {
                                        itemPrice = item.price;
                                    } else if (item.price && selectedSize) {
                                        itemPrice = item.price[selectedSize] || 0;
                                    }

                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={key}
                                            className="group relative bg-white/[0.02] hover:bg-white/[0.04] p-4 rounded-3xl border border-white/5 transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="bg-yellow-400 text-black font-[1000] text-[10px] w-8 h-8 rounded-xl flex items-center justify-center italic shrink-0">
                                                        {quantity}
                                                    </div>
                                                    <div className="space-y-1 min-w-0">
                                                        <p className="text-white font-[1000] text-sm uppercase tracking-tight group-hover:text-yellow-400 transition-colors leading-tight italic truncate pr-2">
                                                            {item.name}
                                                        </p>
                                                        {selectedSize && (
                                                            <div className="inline-flex px-2 py-0.5 rounded-lg bg-white/5 text-[8px] font-black text-gray-500 uppercase tracking-widest border border-white/5">
                                                                Edition {selectedSize}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-white font-[1000] text-base tabular-nums italic text-right whitespace-nowrap pt-1">
                                                    {(itemPrice * quantity).toFixed(1)} <span className="text-[10px] text-gray-700 not-italic ml-0.5">DT</span>
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Totals Section - Integrated Style */}
                            <div className="space-y-6 pt-10 border-t border-white/5 relative z-10">
                                <div className="flex justify-between items-center px-2 group/row">
                                    <span className="text-gray-600 font-black uppercase text-[9px] tracking-[0.4em] italic group-hover/row:text-gray-400 transition-colors">Base Tactique</span>
                                    <span className="text-white font-[1000] text-xl tabular-nums italic">{totalPrice.toFixed(1)} <span className="text-[12px] text-gray-700 ml-1">DT</span></span>
                                </div>

                                <div className="flex justify-between items-center px-2 group/row">
                                    <span className="text-gray-600 font-black uppercase text-[9px] tracking-[0.4em] italic group-hover/row:text-gray-400 transition-colors">Logistique</span>
                                    <div className="text-right flex flex-col items-end">
                                        <span className={`font-[1000] text-lg italic tracking-tight ${deliveryFee === 0 ? 'text-green-500' : 'text-white'}`}>
                                            {deliveryFee === 0 ? 'Protocol Offert' : (`${deliveryFee.toFixed(1)}`)}
                                            {deliveryFee !== 0 && <span className="text-[12px] text-gray-700 ml-1">DT</span>}
                                        </span>
                                    </div>
                                </div>

                                {/* UpSell */}
                                {totalPrice < 30 && deliveryFee > 0 && (
                                    <div className="bg-yellow-400/5 p-4 rounded-2xl border border-yellow-400/10 mb-2">
                                        <p className="text-yellow-400 text-[8px] font-black uppercase tracking-[0.3em] leading-relaxed text-center italic">
                                            Débloquez la logistique à <span className="text-white font-[1000]">30.0 DT</span>
                                        </p>
                                        <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-all duration-1000"
                                                style={{ width: `${(totalPrice / 30) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Total Final - The "Big Reveal" */}
                                <div className="pt-8 relative group/total">
                                    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    <div className="relative flex justify-between items-end px-2">
                                        <div className="space-y-1">
                                            <p className="text-gray-700 font-black uppercase text-[10px] tracking-[0.5em] italic leading-none">Total Final</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                <p className="text-[8px] text-gray-800 font-black uppercase tracking-widest">Calcul Optimisé</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-6xl font-[1000] text-yellow-400 italic tracking-tighter tabular-nums leading-none pr-[0.2em] transform -skew-x-6">
                                                {finalTotal.toFixed(1)}<span className="text-lg font-black text-yellow-400/30 ml-2 not-italic -skew-x-0">DT</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button Section */}
                                <div className="space-y-6 pt-10">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full relative group/btn active:scale-[0.97] transition-all duration-300 disabled:opacity-50"
                                    >
                                        {/* Button Body */}
                                        <div className="bg-yellow-400 group-hover/btn:bg-white text-black py-8 rounded-3xl flex items-center justify-center gap-6 overflow-hidden transition-all duration-500 shadow-[0_20px_40px_rgba(250,204,21,0.1)] group-hover/btn:shadow-[0_20px_40px_rgba(250,204,21,0.3)]">
                                            {isSubmitting ? (
                                                <div className="flex items-center gap-4">
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                    <span className="font-[1000] text-sm uppercase tracking-[0.4em] italic">Protocole...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="font-[1000] text-base uppercase tracking-[0.4em] italic relative z-10">Valider</span>
                                                    <div className="w-10 h-[2px] bg-black/20 relative overflow-hidden group-hover/btn:w-16 transition-all duration-500">
                                                        <motion.div
                                                            animate={{ x: ['-100%', '100%'] }}
                                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                            className="absolute inset-x-0 h-full bg-black shadow-[0_0_10px_black]"
                                                        />
                                                    </div>
                                                    <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-500" strokeWidth={3} />
                                                </>
                                            )}
                                        </div>
                                    </button>

                                    {/* Legal Protocol Box */}
                                    <div className="flex gap-4 items-start px-2 opacity-40 group-hover/panel:opacity-80 transition-opacity">
                                        <div className="bg-white/10 p-2 rounded-lg mt-1 shrink-0">
                                            <AlertCircle size={10} className="text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 text-[8px] font-black uppercase tracking-[0.2em] italic leading-relaxed">
                                            En validant, vous approuvez les protocoles de service et l'accord tactique de Mato's Clan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}