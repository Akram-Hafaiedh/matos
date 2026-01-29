// app/(private)/dashboard/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle, RefreshCw } from 'lucide-react';

interface Order {
    id: string;
    orderNumber: string;
    deliveryInfo: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
    };
    finalTotal: number;
    status: string;
    createdAt: string;
    cart: any[];
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const url = filterStatus === 'all'
                ? '/api/orders'
                : `/api/orders?status=${filterStatus}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [filterStatus]);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();

            if (data.success) {
                fetchOrders();
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Erreur lors de la mise à jour');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-600';
            case 'confirmed': return 'bg-blue-600';
            case 'preparing': return 'bg-purple-600';
            case 'out_for_delivery': return 'bg-orange-600';
            case 'delivered': return 'bg-green-600';
            case 'cancelled': return 'bg-red-600';
            default: return 'bg-gray-600';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-5 h-5" />;
            case 'confirmed': return <CheckCircle className="w-5 h-5" />;
            case 'preparing': return <Package className="w-5 h-5" />;
            case 'out_for_delivery': return <Truck className="w-5 h-5" />;
            case 'delivered': return <CheckCircle className="w-5 h-5" />;
            case 'cancelled': return <XCircle className="w-5 h-5" />;
            default: return <Package className="w-5 h-5" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'En attente';
            case 'confirmed': return 'Confirmée';
            case 'preparing': return 'En préparation';
            case 'out_for_delivery': return 'En livraison';
            case 'delivered': return 'Livrée';
            case 'cancelled': return 'Annulée';
            default: return status;
        }
    };

    const statusOptions = [
        { value: 'all', label: 'Toutes' },
        { value: 'pending', label: 'En attente' },
        { value: 'confirmed', label: 'Confirmées' },
        { value: 'preparing', label: 'En préparation' },
        { value: 'out_for_delivery', label: 'En livraison' },
        { value: 'delivered', label: 'Livrées' },
        { value: 'cancelled', label: 'Annulées' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-5xl font-black text-white mb-2">
                        <span className="text-yellow-400">Commandes</span>
                    </h1>
                    <p className="text-gray-400">Gérez toutes vos commandes en temps réel</p>
                </div>

                {/* Refresh Button */}
                <button
                    onClick={fetchOrders}
                    className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition"
                >
                    <RefreshCw className="w-5 h-5" />
                    Actualiser
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl p-6">
                    <p className="text-gray-900 font-bold mb-2">Total</p>
                    <p className="text-4xl font-black text-gray-900">{orders.length}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6">
                    <p className="text-white font-bold mb-2">En attente</p>
                    <p className="text-4xl font-black text-white">
                        {orders.filter(o => o.status === 'pending').length}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6">
                    <p className="text-white font-bold mb-2">En préparation</p>
                    <p className="text-4xl font-black text-white">
                        {orders.filter(o => o.status === 'preparing').length}
                    </p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6">
                    <p className="text-white font-bold mb-2">Livrées</p>
                    <p className="text-4xl font-black text-white">
                        {orders.filter(o => o.status === 'delivered').length}
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {statusOptions.map(option => (
                    <button
                        key={option.value}
                        onClick={() => setFilterStatus(option.value)}
                        className={`px-6 py-3 rounded-xl font-bold transition ${filterStatus === option.value
                                ? 'bg-yellow-400 text-gray-900'
                                : 'bg-gray-800 text-white hover:bg-gray-700'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-400">Chargement des commandes...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20">
                    <Package className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                    <p className="text-2xl font-bold text-gray-400">Aucune commande</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div
                            key={order.id}
                            className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 hover:border-yellow-400 transition"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-6">

                                {/* Order Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl font-black text-yellow-400">
                                            #{order.orderNumber}
                                        </span>
                                        <span className={`${getStatusColor(order.status)} text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2`}>
                                            {getStatusIcon(order.status)}
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-400">Client</p>
                                            <p className="text-white font-bold">{order.deliveryInfo.fullName}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Téléphone</p>
                                            <p className="text-white font-bold">{order.deliveryInfo.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Adresse</p>
                                            <p className="text-white font-bold">{order.deliveryInfo.address}, {order.deliveryInfo.city}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Total</p>
                                            <p className="text-white font-bold text-lg">{order.finalTotal.toFixed(1)} DT</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-500 text-xs mt-3">
                                        Commandé le {new Date(order.createdAt).toLocaleString('fr-FR')}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-2 min-w-[200px]">
                                    {order.status === 'pending' && (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold transition"
                                        >
                                            ✅ Confirmer
                                        </button>
                                    )}
                                    {order.status === 'confirmed' && (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                                            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold transition"
                                        >
                                            👨‍🍳 Préparer
                                        </button>
                                    )}
                                    {order.status === 'preparing' && (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                                            className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-bold transition"
                                        >
                                            🛵 En livraison
                                        </button>
                                    )}
                                    {order.status === 'out_for_delivery' && (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                                            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold transition"
                                        >
                                            ✅ Livrée
                                        </button>
                                    )}
                                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold transition"
                                        >
                                            ❌ Annuler
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}