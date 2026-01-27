// app/checkout/page.tsx
'use client';

import { useCart } from "../cart/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Phone, Clock, CreditCard, ShoppingBag, ArrowLeft, User } from "lucide-react";

interface DeliveryInfo {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    notes: string;
    deliveryTime: 'asap' | 'scheduled';
    scheduledTime?: string;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, getTotalPrice, getTotalItems, clearCart } = useCart();
    const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
        fullName: '',
        phone: '',
        address: '',
        city: 'Tunis',
        notes: '',
        deliveryTime: 'asap'
    });
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'd17'>('cash');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<DeliveryInfo>>({});

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    const deliveryFee = totalPrice > 30 ? 0 : 3; // Free delivery over 30 DT
    const finalTotal = totalPrice + deliveryFee;

    // Redirect if cart is empty
    if (totalItems === 0) {
        router.push('/menu');
        return null;
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
        if (!deliveryInfo.address.trim()) {
            newErrors.address = 'L\'adresse est requise';
        }
        if (deliveryInfo.deliveryTime === 'scheduled' && !deliveryInfo.scheduledTime) {
            newErrors.scheduledTime = 'Veuillez choisir une heure';
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
                deliveryInfo,
                paymentMethod,
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
            localStorage.setItem('lastOrder', JSON.stringify(orderData));

            // Clear cart
            clearCart();

            // Redirect to confirmation
            router.push(`/order-confirmation?orderNumber=${result.order.orderNumber}`);

        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 py-20 pb-32">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Retour
                    </button>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-2">
                        Finaliser la <span className="text-yellow-400">Commande</span>
                    </h1>
                    <p className="text-xl text-gray-400">Encore quelques détails...</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Column - Form */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Delivery Information */}
                        <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700">
                            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-yellow-400" />
                                Informations de Livraison
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-white font-bold mb-2">
                                        Nom Complet *
                                    </label>
                                    <input
                                        type="text"
                                        value={deliveryInfo.fullName}
                                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, fullName: e.target.value })}
                                        className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${errors.fullName ? 'border-2 border-red-500' : ''
                                            }`}
                                        placeholder="Votre nom complet"
                                    />
                                    {errors.fullName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-white font-bold mb-2">
                                        Numéro de Téléphone *
                                    </label>
                                    <input
                                        type="tel"
                                        value={deliveryInfo.phone}
                                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                                        className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 ${errors.phone ? 'border-2 border-red-500' : ''
                                            }`}
                                        placeholder="XX XXX XXX"
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-white font-bold mb-2">
                                        Adresse Complète *
                                    </label>
                                    <textarea
                                        value={deliveryInfo.address}
                                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                                        className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 h-24 resize-none ${errors.address ? 'border-2 border-red-500' : ''
                                            }`}
                                        placeholder="Rue, numéro, étage, code d'entrée..."
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                                    )}
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-white font-bold mb-2">
                                        Ville
                                    </label>
                                    <select
                                        value={deliveryInfo.city}
                                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    >
                                        <option value="Tunis">Tunis</option>
                                        <option value="Ariana">Ariana</option>
                                        <option value="Ben Arous">Ben Arous</option>
                                        <option value="La Marsa">La Marsa</option>
                                        <option value="Carthage">Carthage</option>
                                    </select>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-white font-bold mb-2">
                                        Instructions Spéciales (optionnel)
                                    </label>
                                    <textarea
                                        value={deliveryInfo.notes}
                                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, notes: e.target.value })}
                                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 h-20 resize-none"
                                        placeholder="Allergie, pas d'oignon, bien cuit, etc..."
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Delivery Time */}
                        <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700">
                            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                                <Clock className="w-6 h-6 text-yellow-400" />
                                Heure de Livraison
                            </h2>

                            <div className="space-y-4">
                                <label className="flex items-center gap-4 bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition">
                                    <input
                                        type="radio"
                                        name="deliveryTime"
                                        checked={deliveryInfo.deliveryTime === 'asap'}
                                        onChange={() => setDeliveryInfo({ ...deliveryInfo, deliveryTime: 'asap' })}
                                        className="w-5 h-5 accent-yellow-400"
                                    />
                                    <div className="flex-1">
                                        <p className="text-white font-bold">Le Plus Vite Possible</p>
                                        <p className="text-gray-400 text-sm">Environ 30-45 minutes</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-4 bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition">
                                    <input
                                        type="radio"
                                        name="deliveryTime"
                                        checked={deliveryInfo.deliveryTime === 'scheduled'}
                                        onChange={() => setDeliveryInfo({ ...deliveryInfo, deliveryTime: 'scheduled' })}
                                        className="w-5 h-5 accent-yellow-400"
                                    />
                                    <div className="flex-1">
                                        <p className="text-white font-bold">Programmer pour plus tard</p>
                                        {deliveryInfo.deliveryTime === 'scheduled' && (
                                            <input
                                                type="time"
                                                value={deliveryInfo.scheduledTime || ''}
                                                onChange={(e) => setDeliveryInfo({ ...deliveryInfo, scheduledTime: e.target.value })}
                                                className="mt-2 bg-gray-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                            />
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700">
                            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                                <CreditCard className="w-6 h-6 text-yellow-400" />
                                Mode de Paiement
                            </h2>

                            <div className="space-y-4">
                                <label className="flex items-center gap-4 bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === 'cash'}
                                        onChange={() => setPaymentMethod('cash')}
                                        className="w-5 h-5 accent-yellow-400"
                                    />
                                    <div className="flex-1">
                                        <p className="text-white font-bold">💵 Espèces à la Livraison</p>
                                        <p className="text-gray-400 text-sm">Payez en espèces au livreur</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-4 bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition opacity-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === 'd17'}
                                        onChange={() => setPaymentMethod('d17')}
                                        className="w-5 h-5 accent-yellow-400"
                                        disabled
                                    />
                                    <div className="flex-1">
                                        <p className="text-white font-bold">📱 D17 / Sobflous</p>
                                        <p className="text-gray-400 text-sm">Bientôt disponible</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 sticky top-24">
                            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                                <ShoppingBag className="w-6 h-6 text-yellow-400" />
                                Résumé
                            </h2>

                            {/* Cart Items */}
                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                {Object.entries(cart).map(([key, cartItem]) => {
                                    const { item, quantity, selectedSize } = cartItem;
                                    let itemPrice = 0;
                                    if (typeof item.price === 'number') {
                                        itemPrice = item.price;
                                    } else if (item.price && selectedSize) {
                                        itemPrice = item.price[selectedSize] || 0;
                                    }

                                    return (
                                        <div key={key} className="flex justify-between text-sm">
                                            <span className="text-gray-300">
                                                {quantity}x {item.name}
                                                {selectedSize && ` (${selectedSize.toUpperCase()})`}
                                            </span>
                                            <span className="text-white font-bold">
                                                {(itemPrice * quantity).toFixed(1)} DT
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-gray-700 pt-4 space-y-3">
                                <div className="flex justify-between text-gray-300">
                                    <span>Sous-total</span>
                                    <span>{totalPrice.toFixed(1)} DT</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Frais de livraison</span>
                                    <span className={deliveryFee === 0 ? 'text-green-500 font-bold' : ''}>
                                        {deliveryFee === 0 ? 'GRATUIT' : `${deliveryFee} DT`}
                                    </span>
                                </div>
                                {totalPrice < 30 && deliveryFee > 0 && (
                                    <p className="text-yellow-400 text-xs">
                                        💡 Livraison gratuite dès 30 DT
                                    </p>
                                )}
                                <div className="flex justify-between text-2xl font-black text-yellow-400 pt-3 border-t border-gray-700">
                                    <span>Total</span>
                                    <span>{finalTotal.toFixed(1)} DT</span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-4 rounded-xl font-black text-lg transition mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Envoi en cours...' : 'Confirmer la Commande'}
                            </button>

                            <p className="text-gray-500 text-xs text-center mt-4">
                                En passant commande, vous acceptez nos conditions générales
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}