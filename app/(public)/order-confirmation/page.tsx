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
        <div className="min-h-screen bg-black py-24 relative overflow-hidden">
            {/* Ambient Success Glow */}
            <div className="absolute top-0 inset-x-0 h-[600px] bg-green-500/5 blur-[120px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 relative z-10">

                {/* Success Animation & Title */}
                <div className="text-center mb-16 space-y-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-green-500 rounded-[2.5rem] shadow-3xl shadow-green-500/20 animate-in zoom-in duration-700">
                        <CheckCircle className="w-16 h-16 text-white stroke-[3px]" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">
                            C'est <span className="text-yellow-400">Prêt!</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase text-xs tracking-[0.4em]">Commande confirmée • Chef prévenu</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Left Column - Details */}
                    <div className="space-y-8">
                        {/* Order Number Card */}
                        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[3rem] p-10 text-gray-950 shadow-3xl shadow-yellow-400/10 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] -mr-16 -mt-16"></div>
                            <Package className="absolute bottom-4 right-8 w-24 h-24 text-black/5 -mr-8 -mb-8 transform -rotate-12" />

                            <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 opacity-60">Numéro de commande</p>
                            <p className="text-6xl font-black tracking-tighter italic">#{orderNumber}</p>
                        </div>

                        {/* Status Tracker */}
                        <div className="bg-gray-900/40 rounded-[3rem] p-10 border border-gray-800 backdrop-blur-3xl">
                            <h2 className="text-xl font-black text-white mb-8 flex items-center gap-4 uppercase italic tracking-widest">
                                <Clock className="w-5 h-5 text-yellow-400" />
                                Suivi en Direct
                            </h2>

                            <div className="space-y-8">
                                {[
                                    { label: 'Reçue', time: 'À l\'instant', status: 'done', icon: '🔥' },
                                    { label: 'En cuisine', time: 'En cours', status: 'current', icon: '👨‍🍳' },
                                    { label: 'Livraison', time: '--:--', status: 'pending', icon: '🛵' }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-6 group">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${step.status === 'done' ? 'bg-green-500 shadow-lg shadow-green-500/10' :
                                                step.status === 'current' ? 'bg-yellow-400 animate-pulse' :
                                                    'bg-gray-950 border border-gray-800'
                                            }`}>
                                            {step.icon}
                                        </div>
                                        <div className="space-y-1">
                                            <p className={`font-black uppercase text-xs tracking-widest ${step.status === 'pending' ? 'text-gray-600' : 'text-white'}`}>{step.label}</p>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{step.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Summary & Info */}
                    <div className="space-y-8">
                        {/* Summary */}
                        <div className="bg-gray-900/40 rounded-[3rem] p-10 border border-gray-800 backdrop-blur-3xl">
                            <h2 className="text-xl font-black text-white mb-8 uppercase italic tracking-widest">Résumé</h2>
                            <div className="space-y-4 mb-8">
                                {Object.entries(orderData.cart).map(([key, cartItem]: [string, any]) => (
                                    <div key={key} className="flex justify-between items-center">
                                        <span className="text-gray-400 font-bold text-xs uppercase tracking-wider">
                                            {cartItem.quantity}x {cartItem.item.name}
                                        </span>
                                        <span className="text-white font-black text-xs">
                                            {((typeof cartItem.item.price === 'number' ? cartItem.item.price : cartItem.item.price[cartItem.selectedSize]) * cartItem.quantity).toFixed(1)} <span className="text-[9px] opacity-30 italic">DT</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-8 border-t border-gray-800 flex justify-between items-center text-3xl font-black text-yellow-400 italic tracking-tighter">
                                <span className="text-xs not-italic uppercase tracking-[0.3em] text-gray-500">Total</span>
                                <div>{orderData.finalTotal.toFixed(1)} <span className="text-sm not-italic opacity-30">DT</span></div>
                            </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-gray-900/40 rounded-[3rem] p-10 border border-gray-800 backdrop-blur-3xl">
                            <div className="space-y-6">
                                <div className="flex gap-5">
                                    <MapPin className="w-5 h-5 text-yellow-400 mt-1" />
                                    <div className="space-y-1">
                                        <p className="text-gray-500 font-black uppercase text-[9px] tracking-widest">Destination</p>
                                        <p className="text-white font-bold text-sm leading-tight">{orderData.deliveryInfo.address}</p>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <Phone className="w-5 h-5 text-yellow-400 mt-1" />
                                    <div className="space-y-1">
                                        <p className="text-gray-500 font-black uppercase text-[9px] tracking-widest">Contact</p>
                                        <p className="text-white font-bold text-sm">{orderData.deliveryInfo.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => router.push('/menu')}
                                className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl shadow-yellow-400/10 active:scale-95"
                            >
                                Revenir au menu
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="w-full bg-white/5 hover:bg-white/10 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all border border-white/10"
                            >
                                Accueil
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mt-16 text-center text-gray-600 font-bold uppercase text-[10px] tracking-[0.4em]">Signature Mato's • Bon Appétit</p>
            </div>
        </div>
    );
}