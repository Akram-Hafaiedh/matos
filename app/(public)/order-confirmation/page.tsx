'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, MapPin, Phone, Package } from "lucide-react";

export default function OrderConfirmationPage() {
    const router = useRouter();
    const [orderData, setOrderData] = useState<any>(null);

    useEffect(() => {
        // Retrieve order from localStorage
        const lastOrder = localStorage.getItem('lastOrder');
        if (lastOrder) {
            setOrderData(JSON.parse(lastOrder));
        } else {
            // No order found, redirect to menu
            router.push('/menu');
        }
    }, []);

    if (!orderData) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto"></div>
                    <p className="text-white mt-4">Chargement...</p>
                </div>
            </div>
        );
    }

    const orderNumber = `MAT${Date.now().toString().slice(-6)}`;

    return (
        <div className="min-h-screen bg-gray-900 py-20">
            <div className="max-w-3xl mx-auto px-4">

                {/* Success Animation */}
                <div className="text-center mb-8">
                    <div className="inline-block bg-green-500 rounded-full p-4 mb-6 animate-bounce-in">
                        <CheckCircle className="w-20 h-20 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                        Commande <span className="text-yellow-400">Confirmée!</span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        Merci pour votre commande. Nous préparons vos plats avec soin!
                    </p>
                </div>

                {/* Order Number */}
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl p-6 mb-8 text-center">
                    <p className="text-gray-900 font-bold mb-2">Numéro de commande</p>
                    <p className="text-4xl font-black text-gray-900">#{orderNumber}</p>
                </div>

                {/* Order Status */}
                <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 mb-8">
                    <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                        <Package className="w-6 h-6 text-yellow-400" />
                        État de la Commande
                    </h2>

                    <div className="space-y-4">
                        {[
                            { label: 'Commande reçue', status: 'complete', icon: '✅' },
                            { label: 'En préparation', status: 'current', icon: '👨‍🍳' },
                            { label: 'En livraison', status: 'pending', icon: '🛵' },
                            { label: 'Livrée', status: 'pending', icon: '🎉' }
                        ].map((step, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${step.status === 'complete' ? 'bg-green-500' :
                                        step.status === 'current' ? 'bg-yellow-400 animate-pulse' :
                                            'bg-gray-700'
                                    }`}>
                                    {step.icon}
                                </div>
                                <span className={`font-bold ${step.status === 'pending' ? 'text-gray-500' : 'text-white'
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 mb-8">
                    <h2 className="text-2xl font-black text-white mb-6">Informations de Livraison</h2>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-yellow-400 mt-1" />
                            <div>
                                <p className="text-gray-400 text-sm">Adresse</p>
                                <p className="text-white font-bold">{orderData.deliveryInfo.address}</p>
                                <p className="text-white">{orderData.deliveryInfo.city}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-yellow-400 mt-1" />
                            <div>
                                <p className="text-gray-400 text-sm">Téléphone</p>
                                <p className="text-white font-bold">{orderData.deliveryInfo.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-yellow-400 mt-1" />
                            <div>
                                <p className="text-gray-400 text-sm">Heure estimée</p>
                                <p className="text-white font-bold">
                                    {orderData.deliveryInfo.deliveryTime === 'asap'
                                        ? '30-45 minutes'
                                        : orderData.deliveryInfo.scheduledTime}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 mb-8">
                    <h2 className="text-2xl font-black text-white mb-6">Résumé de la Commande</h2>

                    <div className="space-y-3 mb-6">
                        {Object.entries(orderData.cart).map(([key, cartItem]: [string, any]) => (
                            <div key={key} className="flex justify-between">
                                <span className="text-gray-300">
                                    {cartItem.quantity}x {cartItem.item.name}
                                    {cartItem.selectedSize && ` (${cartItem.selectedSize.toUpperCase()})`}
                                </span>
                                <span className="text-white font-bold">
                                    {(
                                        (typeof cartItem.item.price === 'number'
                                            ? cartItem.item.price
                                            : cartItem.item.price[cartItem.selectedSize]) * cartItem.quantity
                                    ).toFixed(1)} DT
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-700 pt-4 space-y-2">
                        <div className="flex justify-between text-gray-300">
                            <span>Sous-total</span>
                            <span>{orderData.totalPrice.toFixed(1)} DT</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Frais de livraison</span>
                            <span>{orderData.deliveryFee === 0 ? 'GRATUIT' : `${orderData.deliveryFee} DT`}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-black text-yellow-400 pt-3 border-t border-gray-700">
                            <span>Total</span>
                            <span>{orderData.finalTotal.toFixed(1)} DT</span>
                        </div>
                    </div>

                    <div className="mt-6 bg-gray-700 rounded-lg p-4">
                        <p className="text-white font-bold">💵 Paiement à la livraison</p>
                        <p className="text-gray-400 text-sm mt-1">Préparez {orderData.finalTotal.toFixed(1)} DT en espèces</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => router.push('/menu')}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-4 rounded-xl font-black text-lg transition"
                    >
                        Nouvelle Commande
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-black text-lg transition"
                    >
                        Retour à l'accueil
                    </button>
                </div>

                {/* Contact Info */}
                <div className="mt-8 text-center">
                    <p className="text-gray-400 mb-2">Besoin d'aide?</p>
                    <a href="tel:+21670000000" className="text-yellow-400 font-bold text-lg hover:underline">
                        📞 +216 70 XXX XXX
                    </a>
                </div>
            </div>
        </div>
    );
}