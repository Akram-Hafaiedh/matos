'use client';

import { useState, useEffect } from 'react';
import {
    Users, Search, Star, Package, Calendar, MoreVertical,
    ChevronRight, Loader2, ArrowUpDown, Filter, Edit2,
    Check, X, Phone, Mail, User, MapPin
} from 'lucide-react';

interface Customer {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    loyaltyPoints: number;
    totalOrders: number;
    totalRevenue: number;
    createdAt: string;
}

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingPoints, setEditingPoints] = useState<string | null>(null);
    const [newPoints, setNewPoints] = useState<number>(0);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, [search]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/customers?search=${search}`);
            const data = await res.json();
            if (data.success) {
                setCustomers(data.customers);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePoints = async (userId: string) => {
        setUpdating(true);
        try {
            const res = await fetch('/api/admin/customers', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, loyaltyPoints: newPoints })
            });
            const data = await res.json();
            if (data.success) {
                setCustomers(customers.map(c => c.id === userId ? { ...c, loyaltyPoints: newPoints } : c));
                setEditingPoints(null);
            }
        } catch (error) {
            console.error('Error updating points:', error);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="space-y-10 pb-20 p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-[1000] text-white mb-2 uppercase italic tracking-tighter">
                        Gestion <span className="text-yellow-400">Clients</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Gérez votre base de clients et leurs récompenses</p>
                </div>

                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Rechercher un client (Nom, Email, Tel)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-gray-900/50 border-2 border-gray-800 text-white pl-16 pr-6 py-4 rounded-[1.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                    />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-900/40 p-8 rounded-[2rem] border border-gray-800 flex items-center gap-6">
                    <div className="w-14 h-14 bg-yellow-400/10 rounded-2xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white italic">{customers.length}</div>
                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Clients Actifs</div>
                    </div>
                </div>
                <div className="bg-gray-900/40 p-8 rounded-[2rem] border border-gray-800 flex items-center gap-6">
                    <div className="w-14 h-14 bg-green-400/10 rounded-2xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white italic">
                            {customers.reduce((acc, c) => acc + c.totalRevenue, 0).toLocaleString()} <span className="text-xs text-gray-500 not-italic">DT</span>
                        </div>
                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Revenu Total</div>
                    </div>
                </div>
                <div className="bg-gray-900/40 p-8 rounded-[2rem] border border-gray-800 flex items-center gap-6">
                    <div className="w-14 h-14 bg-orange-400/10 rounded-2xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white italic">
                            {customers.reduce((acc, c) => acc + c.loyaltyPoints, 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Points Fidélité</div>
                    </div>
                </div>
                <div className="bg-gray-900/40 p-8 rounded-[2rem] border border-gray-800 flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-400/10 rounded-2xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-white italic">
                            {customers.reduce((acc, c) => acc + c.totalOrders, 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Commandes</div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-gray-900/20 border border-gray-800 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-3xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900/50 border-b border-gray-800">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Client</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Contact & Adresse</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Stats Financières</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Points</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Depuis le</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-8 py-8 h-20 bg-white/[0.02]"></td>
                                    </tr>
                                ))
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                                                <Users className="w-8 h-8 text-gray-600" />
                                            </div>
                                            <p className="text-gray-500 font-bold">Aucun client trouvé</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-800 rounded-2xl border border-gray-700 flex items-center justify-center font-black text-white text-lg group-hover:bg-yellow-400 group-hover:text-gray-900 transition-all duration-300">
                                                {customer.name?.charAt(0) || <User className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <div className="text-white font-black text-sm uppercase tracking-tight">{customer.name || 'Anonyme'}</div>
                                                <div className="text-[10px] text-gray-600 font-bold truncate max-w-[150px]">ID: {customer.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                <Phone className="w-3 h-3 text-yellow-400" /> {customer.phone || 'Pas de tel'}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 italic">
                                                <MapPin className="w-3 h-3 text-blue-400" /> {customer.address || 'Pas d\'adresse'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="text-lg font-black text-white italic">
                                                {customer.totalRevenue.toFixed(1)} <span className="text-[10px] not-italic text-gray-600">DT</span>
                                            </div>
                                            <div className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                                                {customer.totalOrders} commande{customer.totalOrders > 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        {editingPoints === customer.id ? (
                                            <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                                                <input
                                                    type="number"
                                                    value={newPoints}
                                                    onChange={(e) => setNewPoints(parseInt(e.target.value))}
                                                    className="w-24 bg-gray-950 border-2 border-yellow-400/30 rounded-lg px-3 py-1.5 text-white font-black text-sm focus:outline-none focus:border-yellow-400"
                                                    disabled={updating}
                                                />
                                                <button
                                                    onClick={() => handleUpdatePoints(customer.id)}
                                                    className="p-1.5 bg-yellow-400 rounded-lg text-gray-900 hover:bg-yellow-300 transition-colors"
                                                    disabled={updating}
                                                >
                                                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => setEditingPoints(null)}
                                                    className="p-1.5 bg-gray-800 rounded-lg text-gray-400 hover:bg-gray-700 transition-colors"
                                                    disabled={updating}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <div className="px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-xl text-yellow-400 font-black text-sm italic">
                                                    {customer.loyaltyPoints.toLocaleString()} <span className="text-[10px] uppercase not-italic opacity-50 ml-1">pts</span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setEditingPoints(customer.id);
                                                        setNewPoints(customer.loyaltyPoints);
                                                    }}
                                                    className="p-2 text-gray-600 hover:text-white transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-xs font-bold text-gray-500 italic uppercase">
                                        {new Date(customer.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6">
                                        <button className="p-3 bg-gray-800/50 rounded-xl text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/20 border border-transparent transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
