// app/(private)/dashboard/customers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
    Users, Search, Star, Package, Calendar, MoreVertical,
    ChevronRight, Loader2, ArrowUpDown, Filter, Edit2,
    Check, X, Phone, Mail, User, MapPin, Signal, Activity, Zap, Sparkles, Hash
} from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';

interface Customer {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    image: string | null;
    loyalty_points: number;
    tokens: number;
    total_orders: number;
    total_revenue: number;
    created_at: string;
}

import UserAvatar from '@/components/UserAvatar';

export default function AdminCustomersPage() {
    const { toast } = useToast();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 1,
        limit: 10
    });
    const [editingPoints, setEditingPoints] = useState<string | null>(null);
    const [editingTokens, setEditingTokens] = useState<string | null>(null);
    const [newValue, setNewValue] = useState<number>(0);
    const [updating, setUpdating] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

    useEffect(() => {
        fetchCustomers(1);
    }, [search]);

    const fetchCustomers = async (page = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/customers?search=${search}&page=${page}&limit=10`);
            const data = await res.json();
            if (data.success) {
                setCustomers(data.customers);
                setPagination(data.pagination);
                setCurrentPage(data.pagination.currentPage);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (userId: string, field: 'loyalty_points' | 'tokens') => {
        setUpdating(true);
        try {
            const res = await fetch('/api/admin/customers', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, [field]: newValue })
            });
            const data = await res.json();
            if (data.success) {
                setCustomers(customers.map(c => c.id === userId ? { ...c, [field]: newValue } : c));
                setEditingPoints(null);
                setEditingTokens(null);
                toast.success(`${field === 'tokens' ? 'Jetons' : 'Points'} mis à jour avec succès !`);
            } else {
                toast.error(data.error || 'Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            toast.error('Erreur technique lors de la mise à jour');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-700 pb-20 p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Signal size={12} className="text-yellow-400" />
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">User Intelligence Matrix</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">
                        Gestion <span className="text-yellow-400">Clients</span>
                    </h1>
                    <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1">Analyse des flux et protocoles de fidélité ({pagination.totalItems} cibles)</p>
                </div>

                <div className="relative group w-full xl:w-96">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700 group-focus-within:text-yellow-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Scanner la base clients (Nom, Tel)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 text-white pl-16 pr-8 py-6 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest placeholder:text-gray-800"
                    />
                </div>
            </div>

            {/* Stats matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                {[
                    { label: 'Base Clients', value: pagination.totalItems, icon: Users, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                    { label: 'Revenue Global', value: `${customers.reduce((acc, c) => acc + c.total_revenue, 0).toLocaleString()} DT`, icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
                    { label: 'Points Actifs', value: customers.reduce((acc, c) => acc + c.loyalty_points, 0).toLocaleString(), icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                    { label: 'Total Services', value: customers.reduce((acc, c) => acc + c.total_orders, 0).toLocaleString(), icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white/[0.02] p-8 rounded-[3rem] border border-white/5 flex items-center gap-8 group hover:border-white/10 transition-all shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] -rotate-45 translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className={`w-16 h-16 ${stat.bg} rounded-[1.5rem] flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform`}>
                            <stat.icon className={`w-7 h-7 ${stat.color}`} strokeWidth={2.5} />
                        </div>
                        <div className="relative z-10">
                            <div className="text-3xl font-[1000] text-white italic tracking-tighter leading-none mb-1">{stat.value}</div>
                            <div className="text-[10px] text-gray-700 font-[1000] uppercase tracking-[0.3em] italic">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Table Matrix */}
            <div className="bg-white/[0.01] rounded-[4rem] border border-white/5 backdrop-blur-3xl overflow-hidden shadow-3xl relative">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic">Profile</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic">Coordinates</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic text-right">Yield</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic">Loyalty Matrix</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic text-center">Transmission</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-12 py-10 h-32 bg-white/[0.005]"></td>
                                    </tr>
                                ))
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-12 py-40 text-center">
                                        <div className="flex flex-col items-center gap-6 py-10 opacity-20">
                                            <Users className="w-20 h-20 text-gray-500" strokeWidth={1} />
                                            <p className="text-gray-500 font-[1000] uppercase tracking-[0.5em] text-xs italic">Silence Tactique • Aucun Signal</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-yellow-400/[0.01] transition-all duration-500 group relative">
                                    <td className="px-12 py-10">
                                        <div className="flex items-center gap-6">
                                            <UserAvatar
                                                image={customer.image}
                                                name={customer.name || 'U'}
                                                size="lg"
                                                className="border-white/5 group-hover:border-yellow-400/50 shadow-inner group-hover:shadow-[0_0_40px_rgba(250,204,21,0.1)] transition-all duration-700"
                                            />
                                            <div className="space-y-2">
                                                <div className="text-white font-[1000] text-2xl uppercase italic tracking-tighter group-hover:text-yellow-400 transition-colors leading-none">{customer.name || 'ANONYMOUS ENTITY'}</div>
                                                <div className="flex items-center gap-3 text-[10px] text-gray-700 font-[1000] uppercase tracking-[0.2em] italic">
                                                    <Hash size={12} className="text-yellow-400/50" />
                                                    ID-{customer.id.slice(-8).toUpperCase()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4 text-xs font-[1000] text-gray-400 italic uppercase tracking-widest leading-none">
                                                <Phone className="w-4 h-4 text-yellow-400/50" /> {customer.phone || 'NO COORDS'}
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] font-black text-gray-700 uppercase tracking-widest italic line-clamp-1 max-w-[240px]">
                                                <MapPin className="w-4 h-4 text-blue-500/50" /> {customer.address || 'UNDEFINED LOCATION'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10 text-right">
                                        <div className="space-y-1">
                                            <div className="text-3xl font-[1000] text-white italic tracking-tighter leading-none group-hover:text-yellow-400 transition-colors transition-all">
                                                {customer.total_revenue.toFixed(1)} <span className="text-sm not-italic text-gray-700 uppercase ml-1">DT</span>
                                            </div>
                                            <div className="text-[10px] font-[1000] uppercase tracking-[0.3em] text-gray-800 italic">
                                                {customer.total_orders} Mission Logged
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className="flex flex-col gap-4">
                                            {/* Loyalty Points */}
                                            {editingPoints === customer.id ? (
                                                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
                                                    <input
                                                        type="number"
                                                        value={newValue}
                                                        onChange={(e) => setNewValue(parseInt(e.target.value))}
                                                        className="w-28 bg-black/60 border border-yellow-400/30 rounded-[1.2rem] px-5 py-3 text-white font-[1000] text-sm focus:outline-none focus:border-yellow-400 transition-all shadow-2xl italic tracking-tighter"
                                                        disabled={updating}
                                                    />
                                                    <button
                                                        onClick={() => handleUpdate(customer.id, 'loyalty_points')}
                                                        className="w-12 h-12 flex items-center justify-center bg-yellow-400 rounded-xl text-black hover:scale-110 active:scale-90 transition-all shadow-[0_10px_30px_rgba(250,204,21,0.2)]"
                                                        disabled={updating}
                                                    >
                                                        {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" strokeWidth={3} />}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingPoints(null)}
                                                        className="w-12 h-12 flex items-center justify-center bg-white/[0.05] border border-white/5 rounded-xl text-gray-500 hover:text-white transition-all hover:bg-white/[0.1]"
                                                        disabled={updating}
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-6">
                                                    <div className="w-40 px-6 py-3 bg-yellow-400/5 border border-yellow-400/10 rounded-[1.5rem] text-yellow-500 font-[1000] text-base italic tracking-tighter group-hover:bg-yellow-400/10 transition-all shadow-inner flex items-center gap-3">
                                                        <Zap className="w-3.5 h-3.5 text-yellow-400" />
                                                        {customer.loyalty_points.toLocaleString()} <span className="text-[9px] uppercase not-italic opacity-40 ml-1 tracking-[0.2em]">PTS</span>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setEditingPoints(customer.id);
                                                            setEditingTokens(null);
                                                            setNewValue(customer.loyalty_points);
                                                        }}
                                                        className="w-10 h-10 flex items-center justify-center text-gray-800 hover:text-yellow-400 hover:bg-yellow-400/5 rounded-xl transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Tokens */}
                                            {editingTokens === customer.id ? (
                                                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
                                                    <input
                                                        type="number"
                                                        value={newValue}
                                                        onChange={(e) => setNewValue(parseInt(e.target.value))}
                                                        className="w-28 bg-black/60 border border-cyan-400/30 rounded-[1.2rem] px-5 py-3 text-white font-[1000] text-sm focus:outline-none focus:border-cyan-400 transition-all shadow-2xl italic tracking-tighter"
                                                        disabled={updating}
                                                    />
                                                    <button
                                                        onClick={() => handleUpdate(customer.id, 'tokens')}
                                                        className="w-12 h-12 flex items-center justify-center bg-cyan-400 rounded-xl text-black hover:scale-110 active:scale-90 transition-all shadow-[0_10px_30px_rgba(34,211,238,0.2)]"
                                                        disabled={updating}
                                                    >
                                                        {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" strokeWidth={3} />}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingTokens(null)}
                                                        className="w-12 h-12 flex items-center justify-center bg-white/[0.05] border border-white/5 rounded-xl text-gray-500 hover:text-white transition-all hover:bg-white/[0.1]"
                                                        disabled={updating}
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-6">
                                                    <div className="w-40 px-6 py-3 bg-cyan-400/5 border border-cyan-400/10 rounded-[1.5rem] text-cyan-500 font-[1000] text-base italic tracking-tighter group-hover:bg-cyan-400/10 transition-all shadow-inner flex items-center gap-3">
                                                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                                                        {customer.tokens.toLocaleString()} <span className="text-[9px] uppercase not-italic opacity-40 ml-1 tracking-[0.2em]">JTN</span>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setEditingTokens(customer.id);
                                                            setEditingPoints(null);
                                                            setNewValue(customer.tokens);
                                                        }}
                                                        className="w-10 h-10 flex items-center justify-center text-gray-800 hover:text-cyan-400 hover:bg-cyan-400/5 rounded-xl transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-12 py-10 text-center">
                                        <button className="w-14 h-14 bg-white/[0.02] rounded-[1.5rem] text-gray-800 group-hover:text-yellow-400 border border-white/5 group-hover:border-yellow-400/50 group-hover:shadow-[0_10px_30px_rgba(250,204,21,0.1)] transition-all active:scale-95 flex items-center justify-center mx-auto">
                                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Matrix */}
                {pagination.totalPages > 1 && (
                    <div className="p-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                        <div className="text-[10px] font-[1000] text-gray-700 uppercase tracking-[0.4em] italic leading-none">
                            Transmissions {currentPage} / {pagination.totalPages} <span className="mx-4 text-gray-800">•</span> Total: {pagination.totalItems}
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => fetchCustomers(currentPage - 1)}
                                disabled={currentPage === 1 || loading}
                                className="px-8 py-4 rounded-xl border border-white/5 text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:pointer-events-none transition-all italic"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => fetchCustomers(currentPage + 1)}
                                disabled={currentPage === pagination.totalPages || loading}
                                className="px-8 py-4 rounded-xl border border-white/5 text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:pointer-events-none transition-all italic"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
