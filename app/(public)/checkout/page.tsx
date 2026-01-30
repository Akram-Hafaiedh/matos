// app/checkout/page.tsx
'use client';

import { useCart } from "../../cart/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MapPin, Phone, Clock, CreditCard, ShoppingBag, ArrowLeft, User, AlertCircle, Loader2, ArrowRight, Store, Truck } from "lucide-react";

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

            // Delay redirect slightly for toast visibility
            setTimeout(() => {
                router.push(`/order-confirmation?orderNumber=${result.order.orderNumber}`);
            }, 1500);

        } catch (error) {
            console.error('Error submitting order:', error);
            toast.error('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black py-24 pb-32 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] -ml-64 -mb-64 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-3 text-gray-500 hover:text-white transition-all mb-8 group uppercase text-[10px] font-black tracking-[0.2em]"
                    >
                        <div className="w-8 h-8 rounded-full border border-gray-800 flex items-center justify-center group-hover:border-yellow-400 group-hover:text-yellow-400 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Retour au panier
                    </button>
                    <h1 className="text-6xl md:text-7xl font-black text-white mb-4 uppercase italic tracking-tighter leading-none">
                        Finaliser la <span className="text-yellow-400">Commande</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-[0.3em] mb-12">Signature Mato's • Livraison Privilège</p>

                    {/* Order Type Toggle */}
                    <div className="grid grid-cols-2 gap-4 max-w-2xl bg-gray-900/50 p-2 rounded-[2rem] border border-gray-800 backdrop-blur-md">
                        <button
                            onClick={() => setOrderType('delivery')}
                            className={`flex flex-col md:flex-row items-center justify-center gap-3 py-6 rounded-[1.5rem] transition-all duration-500 relative overflow-hidden group ${orderType === 'delivery'
                                ? 'bg-yellow-400 text-gray-900 shadow-xl shadow-yellow-400/20 scale-[1.02]'
                                : 'text-gray-500 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Truck className={`w-6 h-6 ${orderType === 'delivery' ? 'text-gray-900' : 'text-gray-500 group-hover:text-white'}`} />
                            <div className="text-center md:text-left">
                                <span className="block font-black uppercase text-xs tracking-widest">Livraison</span>
                                <span className={`text-[9px] font-bold ${orderType === 'delivery' ? 'text-gray-800' : 'text-gray-600'}`}>À domicile</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setOrderType('pickup')}
                            className={`flex flex-col md:flex-row items-center justify-center gap-3 py-6 rounded-[1.5rem] transition-all duration-500 relative overflow-hidden group ${orderType === 'pickup'
                                ? 'bg-yellow-400 text-gray-900 shadow-xl shadow-yellow-400/20 scale-[1.02]'
                                : 'text-gray-500 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Store className={`w-6 h-6 ${orderType === 'pickup' ? 'text-gray-900' : 'text-gray-500 group-hover:text-white'}`} />
                            <div className="text-center md:text-left">
                                <span className="block font-black uppercase text-xs tracking-widest">Sur Place</span>
                                <span className={`text-[9px] font-bold ${orderType === 'pickup' ? 'text-gray-800' : 'text-gray-600'}`}>A emporter / Manger ici</span>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">

                    {/* Left Column - Form */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Delivery Information */}
                        <div className="bg-gray-900/60 rounded-[3rem] p-10 border border-gray-800 backdrop-blur-3xl hover:border-yellow-400/10 transition-colors duration-500 shadow-2xl">
                            <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-5 uppercase italic tracking-tight">
                                <div className="w-12 h-12 bg-gray-950 rounded-2xl border border-gray-800 flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-yellow-400" />
                                </div>
                                Livraison
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Full Name */}
                                    <div className="space-y-2">
                                        <label className="text-gray-500 font-black uppercase text-[10px] tracking-widest ml-4">Nom Complet *</label>
                                        <input
                                            type="text"
                                            value={deliveryInfo.fullName}
                                            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, fullName: e.target.value })}
                                            className={`w-full bg-gray-950 border-2 text-white px-6 py-4 rounded-2xl font-bold focus:outline-none transition-all placeholder:text-gray-800 ${errors.fullName ? 'border-red-500/50' : 'border-gray-800 focus:border-yellow-400/50'
                                                }`}
                                            placeholder="Votre nom complet"
                                        />
                                        {errors.fullName && (
                                            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-4 flex items-center gap-2">
                                                <AlertCircle className="w-3 h-3" /> {errors.fullName}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="text-gray-500 font-black uppercase text-[10px] tracking-widest ml-4">Téléphone *</label>
                                        <input
                                            type="tel"
                                            value={deliveryInfo.phone}
                                            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                                            className={`w-full bg-gray-950 border-2 text-white px-6 py-4 rounded-2xl font-bold focus:outline-none transition-all placeholder:text-gray-800 ${errors.phone ? 'border-red-500/50' : 'border-gray-800 focus:border-yellow-400/50'
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
                                <div className={`space-y-8 transition-all duration-500 overflow-hidden ${orderType === 'pickup' ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'}`}>
                                    <div className="space-y-2">
                                        <label className="text-gray-500 font-black uppercase text-[10px] tracking-widest ml-4">Adresse Complète *</label>
                                        <textarea
                                            value={deliveryInfo.address}
                                            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                                            className={`w-full bg-gray-950 border-2 text-white px-6 py-4 rounded-2xl font-bold focus:outline-none transition-all h-24 resize-none placeholder:text-gray-800 ${errors.address ? 'border-red-500/50' : 'border-gray-800 focus:border-yellow-400/50'
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
                                        <div className="space-y-2">
                                            <label className="text-gray-500 font-black uppercase text-[10px] tracking-widest ml-4">Ville</label>
                                            <select
                                                value={deliveryInfo.city}
                                                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                                                className="w-full bg-gray-950 border-2 border-gray-800 text-white px-6 py-4 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all appearance-none"
                                            >
                                                <option value="Tunis">Tunis</option>
                                                <option value="Ariana">Ariana</option>
                                                <option value="Ben Arous">Ben Arous</option>
                                                <option value="La Marsa">La Marsa</option>
                                                <option value="Carthage">Carthage</option>
                                                <option value="Manouba">Manouba</option>
                                            </select>
                                        </div>

                                        {/* Notes */}
                                        <div className="space-y-2">
                                            <label className="text-gray-500 font-black uppercase text-[10px] tracking-widest ml-4">Instructions (optionnel)</label>
                                            <input
                                                type="text"
                                                value={deliveryInfo.notes}
                                                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, notes: e.target.value })}
                                                className="w-full bg-gray-950 border-2 border-gray-800 text-white px-6 py-4 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all placeholder:text-gray-800 text-sm"
                                                placeholder="Allergies, pas d'oignons..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Delivery Time - Only for Delivery */}
                            <div className={`bg-gray-900/60 rounded-[3rem] p-10 border border-gray-800 backdrop-blur-3xl shadow-2xl transition-all duration-500 ${orderType === 'pickup' ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                                <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-4 uppercase italic tracking-tight">
                                    <div className="w-10 h-10 bg-gray-950 rounded-xl border border-gray-800 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    Timing
                                </h2>

                                <div className="space-y-4">
                                    <label className={`flex items-center gap-5 p-5 rounded-2.5xl cursor-pointer border-2 transition-all ${deliveryInfo.deliveryTime === 'asap' ? 'bg-yellow-400 border-yellow-400 text-gray-900' : 'bg-gray-950 border-gray-800 text-white hover:border-gray-700'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="deliveryTime"
                                            checked={deliveryInfo.deliveryTime === 'asap'}
                                            onChange={() => setDeliveryInfo({ ...deliveryInfo, deliveryTime: 'asap' })}
                                            className="w-5 h-5 accent-gray-900"
                                        />
                                        <div className="flex-1">
                                            <p className="font-black uppercase text-xs tracking-widest">ASAP</p>
                                            <p className={`text-[10px] font-bold ${deliveryInfo.deliveryTime === 'asap' ? 'text-gray-950/70' : 'text-gray-500'}`}>30-45 minutes</p>
                                        </div>
                                    </label>

                                    <label className={`flex flex-col gap-4 p-5 rounded-2.5xl cursor-pointer border-2 transition-all ${deliveryInfo.deliveryTime === 'scheduled' ? 'bg-yellow-400 border-yellow-400 text-gray-900' : 'bg-gray-950 border-gray-800 text-white hover:border-gray-700'
                                        }`}>
                                        <div className="flex items-center gap-5 w-full">
                                            <input
                                                type="radio"
                                                name="deliveryTime"
                                                checked={deliveryInfo.deliveryTime === 'scheduled'}
                                                onChange={() => setDeliveryInfo({ ...deliveryInfo, deliveryTime: 'scheduled' })}
                                                className="w-5 h-5 accent-gray-900"
                                            />
                                            <div className="flex-1">
                                                <p className="font-black uppercase text-xs tracking-widest">Programmer</p>
                                                <p className={`text-[10px] font-bold ${deliveryInfo.deliveryTime === 'scheduled' ? 'text-gray-950/70' : 'text-gray-500'}`}>Choisir une heure</p>
                                            </div>
                                        </div>
                                        {deliveryInfo.deliveryTime === 'scheduled' && (
                                            <input
                                                type="time"
                                                value={deliveryInfo.scheduledTime || ''}
                                                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, scheduledTime: e.target.value })}
                                                className="w-full bg-white/20 border border-black/10 text-gray-950 px-4 py-3 rounded-xl font-bold focus:outline-none"
                                            />
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-gray-900/60 rounded-[3rem] p-10 border border-gray-800 backdrop-blur-3xl shadow-2xl">
                                <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-4 uppercase italic tracking-tight">
                                    <div className="w-10 h-10 bg-gray-950 rounded-xl border border-gray-800 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    Paiement
                                </h2>

                                <div className="space-y-4">
                                    <label className={`flex items-center gap-5 p-5 rounded-2.5xl cursor-pointer border-2 transition-all ${paymentMethod === 'cash' ? 'bg-yellow-400 border-yellow-400 text-gray-900' : 'bg-gray-950 border-gray-800 text-white hover:border-gray-700'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === 'cash'}
                                            onChange={() => setPaymentMethod('cash')}
                                            className="w-5 h-5 accent-gray-900"
                                        />
                                        <div className="flex-1">
                                            <p className="font-black uppercase text-xs tracking-widest">Espèces</p>
                                            <p className={`text-[10px] font-bold ${paymentMethod === 'cash' ? 'text-gray-950/70' : 'text-gray-500'}`}>À la livraison</p>
                                        </div>
                                    </label>

                                    <div className="flex items-center gap-5 p-5 rounded-2.5xl border-2 border-dashed border-gray-800 opacity-40">
                                        <div className="w-5 h-5 rounded-full border border-gray-700" />
                                        <div className="flex-1">
                                            <p className="font-black uppercase text-xs tracking-widest text-gray-500">Cartes / D17</p>
                                            <p className="text-[10px] font-bold text-gray-600 italic">Bientôt disponible</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900/60 rounded-[3rem] p-10 border border-gray-800 backdrop-blur-3xl sticky top-24 shadow-2xl">
                            <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-4 uppercase italic tracking-tight">
                                <div className="w-10 h-10 bg-gray-950 rounded-xl border border-gray-800 flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-yellow-400" />
                                </div>
                                Résumé
                            </h2>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-10 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {Object.entries(cart).map(([key, cartItem]) => {
                                    const { item, quantity, selectedSize } = cartItem;
                                    let itemPrice = 0;
                                    if (typeof item.price === 'number') {
                                        itemPrice = item.price;
                                    } else if (item.price && selectedSize) {
                                        itemPrice = item.price[selectedSize] || 0;
                                    }

                                    return (
                                        <div key={key} className="flex justify-between items-center group">
                                            <div className="space-y-1">
                                                <p className="text-gray-300 font-bold text-xs uppercase tracking-wider group-hover:text-white transition-colors">
                                                    {quantity}x {item.name}
                                                </p>
                                                {selectedSize && (
                                                    <p className="text-yellow-400/50 text-[9px] font-black uppercase tracking-widest">{selectedSize}</p>
                                                )}
                                            </div>
                                            <span className="text-white font-black text-xs tabular-nums">
                                                {(itemPrice * quantity).toFixed(1)} <span className="text-[9px] opacity-30 italic">DT</span>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-gray-800/50 pt-8 space-y-4">
                                <div className="flex justify-between text-gray-500 font-black uppercase text-[10px] tracking-widest">
                                    <span>Sous-total</span>
                                    <span>{totalPrice.toFixed(1)} DT</span>
                                </div>
                                <div className="flex justify-between font-black uppercase text-[10px] tracking-widest">
                                    <span className="text-gray-500">Livraison</span>
                                    <span className={deliveryFee === 0 ? 'text-green-500' : 'text-gray-500'}>
                                        {deliveryFee === 0 ? 'Offerte' : `${deliveryFee} DT`}
                                    </span>
                                </div>
                                {totalPrice < 30 && deliveryFee > 0 && (
                                    <div className="bg-yellow-400/5 border border-yellow-400/10 p-4 rounded-2xl">
                                        <p className="text-yellow-400/70 text-[9px] font-black uppercase tracking-widest leading-relaxed text-center">
                                            Ajoutez {(30 - totalPrice).toFixed(1)} DT pour la livraison gratuite
                                        </p>
                                    </div>
                                )}
                                <div className="flex justify-between text-4xl font-black text-yellow-400 pt-6 border-t border-gray-800/50 italic tracking-tighter">
                                    <span className="text-lg not-italic uppercase tracking-widest text-gray-500 self-center">Total</span>
                                    <span>{finalTotal.toFixed(1)} <span className="text-sm not-italic opacity-30">DT</span></span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all mt-10 shadow-2xl shadow-yellow-400/10 active:scale-95 disabled:opacity-50 group overflow-hidden relative"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Envoi...
                                        </>
                                    ) : (
                                        <>
                                            Confirmer
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </button>

                            <p className="text-gray-700 text-[9px] font-black uppercase tracking-widest text-center mt-6 leading-relaxed">
                                En confirmant, vous acceptez nos<br />Conditions Générales Mato's
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}