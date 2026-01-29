'use client';

import { useEffect, useState } from 'react';
import {
    Search,
    User,
    Package,
    Loader2,
    Calendar,
    MessageSquare,
    MoreHorizontal
} from 'lucide-react';

interface Ticket {
    id: number;
    subject: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;
    user: {
        name: string | null;
        email: string | null;
    } | null;
    order: {
        orderNumber: string;
    } | null;
}

export default function AdminSupportPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });

    useEffect(() => {
        fetchTickets();
    }, [statusFilter, pagination.currentPage, searchQuery]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.currentPage.toString(),
                limit: pagination.limit.toString(),
                status: statusFilter,
                search: searchQuery
            });
            const res = await fetch(`/api/support?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setTickets(data.tickets);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateTicketStatus = async (id: number, newStatus: string) => {
        try {
            const res = await fetch(`/api/support/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchTickets();
            }
        } catch (error) {
            console.error('Error updating ticket:', error);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">
                        Centre de <span className="text-yellow-400">Support</span>
                    </h1>
                    <p className="text-gray-400">Gérez les demandes d'assistance de vos clients</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-700/50 flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Rechercher par sujet, description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-900 text-white pl-12 pr-4 py-4 rounded-2xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {['all', 'open', 'in_progress', 'resolved', 'closed'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition ${statusFilter === s
                                    ? 'bg-yellow-400 text-gray-900'
                                    : 'bg-gray-900 text-gray-400 border border-gray-700 hover:text-white'
                                }`}
                        >
                            {s === 'all' ? 'Tous' : s === 'in_progress' ? 'En cours' : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden relative shadow-2xl">
                {loading && (
                    <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 uppercase text-[10px] font-black tracking-widest border-b border-gray-700">
                            <tr>
                                <th className="px-8 py-6">Status / Priorité</th>
                                <th className="px-8 py-6">Client / Commande</th>
                                <th className="px-8 py-6">Sujet</th>
                                <th className="px-8 py-6">Date</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-750 transition group">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-2">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${ticket.status === 'open' ? 'bg-yellow-400/10 text-yellow-400' :
                                                    ticket.status === 'resolved' ? 'bg-green-500/10 text-green-400' :
                                                        'bg-gray-700 text-gray-400'
                                                }`}>
                                                {ticket.status}
                                            </span>
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${ticket.priority === 'urgent' ? 'text-red-500' :
                                                    ticket.priority === 'high' ? 'text-orange-400' :
                                                        'text-gray-500'
                                                }`}>
                                                {ticket.priority}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 font-black text-white">
                                                <User className="w-4 h-4 text-gray-500" />
                                                {ticket.user?.name || 'Invité'}
                                            </div>
                                            {ticket.order && (
                                                <div className="flex items-center gap-2 text-xs text-yellow-400 font-bold mt-1">
                                                    <Package className="w-3 h-3" />
                                                    {ticket.order.orderNumber}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="max-w-xs">
                                            <div className="font-black text-white group-hover:text-yellow-400 transition">{ticket.subject}</div>
                                            <div className="text-gray-500 text-xs line-clamp-1 mt-1">{ticket.description}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition shadow-lg"
                                                title="Voir Détails"
                                            >
                                                <MessageSquare className="w-5 h-5" />
                                            </button>
                                            <div className="relative group/actions">
                                                <button className="p-3 bg-gray-900 border border-gray-700 hover:bg-gray-800 text-gray-400 rounded-xl transition">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                                {/* Dropdown would go here for updating status */}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination placeholder */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    {/* Pagination logic similar to menu items */}
                </div>
            )}
        </div>
    );
}
