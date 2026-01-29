'use client';

import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle2, Loader2, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/orders?limit=20')
            .then(res => res.json())
            .then(data => {
                if (data.success) setOrders(data.orders);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                Mes <span className="text-yellow-400">Commandes</span>
            </h2>

            {orders.length === 0 ? (
                <div className="text-center py-32 bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-800 backdrop-blur-xl">
                    <div className="w-24 h-24 bg-gray-950 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-gray-800">
                        <ShoppingBag className="w-10 h-10 text-gray-700" />
                    </div>
                    <h3 className="text-2xl font-black text-white/50 uppercase italic mb-2">Aucune commande</h3>
                    <p className="text-gray-600 font-bold text-sm uppercase tracking-widest px-4">Prêt à commander votre premier burger ?</p>
                    <Link href="/menu" className="mt-10 inline-block bg-yellow-400 text-gray-900 px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl shadow-yellow-400/10 hover:bg-yellow-300 transition-all">
                        Voir le Menu
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-gray-900/60 p-8 rounded-[2.5rem] border border-gray-800 hover:border-yellow-400/30 transition-all duration-500 group relative overflow-hidden backdrop-blur-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 blur-[60px] -mr-16 -mt-16 pointer-events-none group-hover:bg-yellow-400/10 transition-all duration-500"></div>

                            <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                                <div className="space-y-6 flex-1">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-yellow-400/10 text-yellow-500 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-yellow-400/20">
                                            {order.orderNumber}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                            <Clock className="w-3 h-3" />
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {order.cart?.map((item: any, idx: number) => (
                                            <span key={idx} className="text-[10px] font-black uppercase tracking-wider bg-gray-950 px-4 py-2 rounded-xl border border-gray-800 text-white/80">
                                                {item.quantity}x {item.itemName}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col justify-between md:items-end gap-4 border-t md:border-t-0 md:border-l border-gray-800/50 pt-6 md:pt-0 md:pl-8">
                                    <div className="text-3xl font-black text-white italic tracking-tighter">{order.finalTotal.toFixed(1)} <span className="text-sm uppercase not-italic text-yellow-400/50">DT</span></div>
                                    <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${order.status === 'delivered'
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                            : order.status === 'cancelled'
                                                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                : 'bg-yellow-400/10 text-yellow-500 border-yellow-400/20'
                                        }`}>
                                        {order.status === 'delivered' ? <CheckCircle2 className="w-3 h-3" /> : <Loader2 className="w-3 h-3 animate-spin" />}
                                        {order.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
