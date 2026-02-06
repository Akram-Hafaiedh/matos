// app/(private)/dashboard/support/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Search, RefreshCw, ChevronRight, Signal, Activity, Zap, ShieldAlert, Hash } from 'lucide-react';
import Link from 'next/link';
import UserAvatar from '@/components/UserAvatar';

interface Ticket {
    id: number;
    subject: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
        image?: string | null;
    } | null;
    order: {
        orderNumber: string;
    } | null;
}

export default function AdminSupportPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTickets = async () => {
        setLoading(true);
        try {
            let url = `/api/support?status=${filterStatus}`;
            if (searchQuery) url += `&search=${searchQuery}`;

            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setTickets(data.tickets);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [filterStatus]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchTickets();
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'open': return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.1)]';
            case 'in_progress': return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
            case 'resolved': return 'bg-green-400/10 text-green-400 border-green-400/20';
            case 'closed': return 'bg-gray-800/40 text-gray-700 border-gray-800';
            default: return 'bg-gray-800/20 text-gray-400 border-gray-800';
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'text-red-500 bg-red-500/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]';
            case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldAlert size={12} className="text-yellow-400" />
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">Crisis Control Center</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none mb-4">
                        Support <span className="text-yellow-400">Tickets</span>
                    </h1>
                    <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em] ml-1">Analyse des requêtes et protocoles d'intervention</p>
                </div>

                <div className="flex items-center gap-4 w-full xl:w-auto">
                    <button
                        onClick={fetchTickets}
                        className="flex-1 xl:flex-none flex items-center justify-center gap-4 bg-white/[0.02] border border-white/5 px-10 py-5 rounded-[2rem] text-white font-[1000] uppercase text-[10px] tracking-[0.3em] italic hover:bg-yellow-400 hover:text-black transition-all duration-700 active:scale-95 group shadow-2xl"
                    >
                        <RefreshCw className={`w-4 h-4 transition-transform duration-700 group-hover:rotate-180 ${loading ? 'animate-spin' : ''}`} />
                        Sync Data
                    </button>
                </div>
            </div>

            {/* Tactical Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                {[
                    { label: 'Total Base', value: tickets.length, color: 'text-white', icon: MessageSquare, bg: 'bg-white/5' },
                    { label: 'Transmission Open', value: tickets.filter(t => t.status === 'open').length, color: 'text-yellow-400', icon: Activity, bg: 'bg-yellow-400/10' },
                    { label: 'Priority Red', value: tickets.filter(t => t.priority === 'urgent').length, color: 'text-red-500', icon: ShieldAlert, bg: 'bg-red-500/10' },
                    { label: 'Resolved Ops', value: tickets.filter(t => t.status === 'resolved').length, color: 'text-green-500', icon: CheckCircle, bg: 'bg-green-500/10' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white/[0.02] p-8 rounded-[3rem] border border-white/5 flex items-center gap-8 group hover:border-white/10 transition-all shadow-2xl relative overflow-hidden">
                        <div className={`w-16 h-16 ${stat.bg} rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <stat.icon className={`w-7 h-7 ${stat.color}`} strokeWidth={2.5} />
                        </div>
                        <div>
                            <div className={`text-4xl font-[1000] ${stat.color} italic tracking-tighter leading-none mb-1`}>{stat.value}</div>
                            <div className="text-[10px] text-gray-700 font-[1000] uppercase tracking-[0.3em] italic">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Protocols */}
            <div className="flex flex-col xl:flex-row gap-8">
                <div className="flex flex-wrap gap-3 bg-white/[0.02] p-3 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-inner">
                    {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-8 py-3 rounded-[1.5rem] font-[1000] uppercase text-[10px] tracking-[0.2em] transition-all duration-700 italic border ${filterStatus === status
                                ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_10px_20px_rgba(250,204,21,0.1)]'
                                : 'text-gray-700 border-transparent hover:text-white'
                                }`}
                        >
                            {status === 'all' ? 'All Channels' : status.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSearch} className="flex-1 relative group">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-700 w-5 h-5 group-focus-within:text-yellow-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Scanner les communications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 text-white pl-18 pr-8 py-5 rounded-[2.5rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-[0.2em] placeholder:text-gray-800"
                    />
                </form>
            </div>

            {/* Data Matrix Table */}
            <div className="bg-white/[0.01] rounded-[4rem] border border-white/5 backdrop-blur-3xl overflow-hidden shadow-3xl relative">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Transmission</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Origin (Client)</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Subject Vector</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Status Block</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none">Priority Grade</th>
                                <th className="px-12 py-8 text-[10px] font-[1000] text-gray-600 uppercase tracking-[0.4em] italic leading-none text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-12 py-10 h-28 bg-white/[0.005]"></td>
                                    </tr>
                                ))
                            ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-12 py-40 text-center">
                                        <div className="flex flex-col items-center gap-6 py-10 opacity-20">
                                            <ShieldAlert className="w-20 h-20 text-gray-500" strokeWidth={1} />
                                            <p className="text-gray-500 font-[1000] uppercase tracking-[0.5em] text-xs italic text-center">Frequency Silent • Aucun ticket détecté</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : tickets.map((ticket) => (
                                <tr key={ticket.id} className="group/row hover:bg-yellow-400/[0.01] transition-all duration-500 relative">
                                    <td className="px-12 py-10">
                                        <div className="flex flex-col">
                                            <span className="font-[1000] text-yellow-400 text-xl italic tracking-tighter leading-none mb-1 group-hover/row:scale-110 transition-transform origin-left w-fit">#{ticket.id}</span>
                                            <div className="flex items-center gap-2 text-[9px] text-gray-700 font-[1000] uppercase tracking-widest italic leading-none">
                                                <Clock size={10} className="text-gray-800" />
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className="flex items-center gap-4">
                                            <UserAvatar
                                                image={ticket.user?.image}
                                                name={ticket.user?.name || 'U'}
                                                size="sm"
                                                className="border border-white/5"
                                            />
                                            <div className="flex flex-col space-y-1">
                                                <span className="text-white font-[1000] text-sm uppercase italic tracking-widest group-hover/row:text-yellow-400 transition-colors leading-none">{ticket.user?.name || 'ANONYMOUS'}</span>
                                                <span className="text-[10px] text-gray-700 font-bold tracking-tight leading-none opacity-60">{ticket.user?.email || '-'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className="space-y-2">
                                            <p className="text-gray-300 font-bold text-sm max-w-xs truncate uppercase tracking-tight italic leading-none">{ticket.subject}</p>
                                            {ticket.order && (
                                                <div className="flex items-center gap-2">
                                                    <Hash size={10} className="text-yellow-400/50" />
                                                    <span className="text-[10px] text-yellow-400/60 font-[1000] uppercase tracking-[0.2em] italic leading-none">ORDER_#{ticket.order.orderNumber}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className={`inline-flex px-6 py-2 rounded-full text-[9px] font-[1000] uppercase tracking-[0.3em] italic border-2 transition-all duration-700 ${getStatusStyle(ticket.status)}`}>
                                            {ticket.status.replace('_', ' ')}
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className={`inline-flex px-6 py-2 rounded-full text-[9px] font-[1000] uppercase tracking-[0.3em] italic border-2 transition-all duration-700 ${getPriorityStyle(ticket.priority)}`}>
                                            {ticket.priority}
                                        </div>
                                    </td>
                                    <td className="px-12 py-10 text-right">
                                        <Link
                                            href={`/dashboard/support/${ticket.id}`}
                                            className="inline-flex items-center gap-3 bg-black/40 text-white px-8 py-4 rounded-[1.5rem] font-[1000] uppercase text-[10px] tracking-[0.3em] italic border border-white/5 hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all duration-700 group/btn shadow-xl active:scale-95"
                                        >
                                            Intercept
                                            <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
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
