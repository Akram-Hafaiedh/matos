'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Search, RefreshCw, ChevronRight } from 'lucide-react';
import Link from 'next/link';

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
            case 'open': return 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20';
            case 'in_progress': return 'bg-blue-400/10 text-blue-400 border-blue-400/20';
            case 'resolved': return 'bg-green-400/10 text-green-400 border-green-400/20';
            case 'closed': return 'bg-gray-800 text-gray-500 border-gray-700';
            default: return 'bg-gray-800 text-gray-400 border-gray-700';
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-5xl font-black text-white mb-2 uppercase italic tracking-tighter">
                        Support <span className="text-yellow-400">Tickets</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Gérez les demandes d'assistance des clients</p>
                </div>
                <button
                    onClick={fetchTickets}
                    className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-6 py-3 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest hover:border-yellow-400/50 transition duration-500"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Actualiser
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total', value: tickets.length, color: 'from-gray-800 to-gray-900' },
                    { label: 'Ouverts', value: tickets.filter(t => t.status === 'open').length, color: 'from-yellow-400/20 to-yellow-600/20 text-yellow-400' },
                    { label: 'Urgents', value: tickets.filter(t => t.priority === 'urgent').length, color: 'from-red-500/20 to-red-600/20 text-red-500' },
                    { label: 'Résolus', value: tickets.filter(t => t.status === 'resolved').length, color: 'from-green-500/20 to-green-600/20 text-green-500' }
                ].map((stat, i) => (
                    <div key={i} className={`bg-gradient-to-br ${stat.color} p-6 rounded-[2rem] border border-white/5 shadow-2xl`}>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">{stat.label}</p>
                        <p className="text-4xl font-black italic tracking-tighter">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex flex-wrap gap-2">
                    {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest border transition duration-500 ${filterStatus === status
                                    ? 'bg-yellow-400 text-gray-900 border-yellow-400'
                                    : 'bg-gray-900 text-gray-400 border-gray-800 hover:border-gray-700'
                                }`}
                        >
                            {status === 'all' ? 'Tous' : status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher par sujet, message..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-900/50 border-2 border-gray-800 text-white pl-16 pr-8 py-4 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition duration-500"
                    />
                </form>
            </div>

            {/* Tickets Table */}
            <div className="bg-gray-900/30 rounded-[3rem] border border-gray-800 backdrop-blur-3xl overflow-hidden shadow-3xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800/50 bg-gray-950/20">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Ticket</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Client</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Sujet</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Priorité</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-8 py-8"><div className="h-8 bg-gray-800/50 rounded-xl w-full"></div></td>
                                    </tr>
                                ))
                            ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-gray-500 font-bold uppercase tracking-widest">
                                        Aucun ticket trouvé
                                    </td>
                                </tr>
                            ) : tickets.map((ticket) => (
                                <tr key={ticket.id} className="group hover:bg-white/[0.02] transition duration-500">
                                    <td className="px-8 py-6">
                                        <span className="font-black text-yellow-400 italic">#{ticket.id}</span>
                                        <p className="text-[10px] text-gray-600 font-bold mt-1">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-white font-black text-sm uppercase">{ticket.user?.name || 'Inconnu'}</span>
                                            <span className="text-[10px] text-gray-500 font-bold">{ticket.user?.email || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-gray-300 font-bold text-sm max-w-xs truncate">{ticket.subject}</p>
                                        {ticket.order && (
                                            <span className="text-[10px] text-yellow-400 font-black uppercase tracking-widest">Ordre: #{ticket.order.orderNumber}</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-2 ${getStatusStyle(ticket.status)}`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-2 ${getPriorityStyle(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link
                                            href={`/dashboard/support/${ticket.id}`}
                                            className="inline-flex items-center gap-2 bg-gray-800 text-white px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-yellow-400 hover:text-gray-900 transition duration-500"
                                        >
                                            Répondre
                                            <ChevronRight size={14} />
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
