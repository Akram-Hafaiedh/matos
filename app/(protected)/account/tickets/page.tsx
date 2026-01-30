'use client';

import { useEffect, useState } from 'react';
import { LifeBuoy, ChevronRight, Loader2, Plus, MessageSquare, AlertCircle, Search, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function TicketsPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                status: status,
                search: search,
                limit: '4'
            });
            const res = await fetch(`/api/support?${queryParams.toString()}`);
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

    useEffect(() => {
        fetchTickets();
    }, [page, status]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchTickets();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                    Service <span className="text-yellow-400">Support</span>
                </h2>
                <Link href="/support/new" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-yellow-400/10 transition-all active:scale-95 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nouveau Ticket
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-yellow-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Rechercher un ticket..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-gray-900/50 border-2 border-gray-800 text-white pl-14 pr-6 py-4 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm"
                    />
                </form>

                <div className="flex items-center gap-2">
                    {['all', 'open', 'resolved'].map((s) => (
                        <button
                            key={s}
                            onClick={() => { setStatus(s); setPage(1); }}
                            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${status === s
                                ? 'bg-yellow-400 border-yellow-400 text-gray-950 shadow-lg shadow-yellow-400/10'
                                : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-700'
                                }`}
                        >
                            {s === 'all' ? 'Tous' : s === 'open' ? 'En cours' : 'Résolu'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20 font-sans">
                    <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
                </div>
            ) : tickets.length === 0 ? (
                <div className="text-center py-32 bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-800 backdrop-blur-xl">
                    <div className="w-24 h-24 bg-gray-950 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-gray-800">
                        <LifeBuoy className="w-10 h-10 text-gray-700" />
                    </div>
                    <h3 className="text-2xl font-black text-white/50 uppercase italic mb-2">Aucune demande</h3>
                    <p className="text-gray-600 font-bold text-sm uppercase tracking-widest px-4">Notre équipe est là pour vous 7j/7.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tickets.map((ticket) => (
                        <Link
                            key={ticket.id}
                            href={`/account/tickets/${ticket.id}`}
                            className="bg-gray-900/60 p-8 rounded-[2.5rem] border border-gray-800 hover:border-yellow-400/50 transition-all duration-500 group flex flex-col justify-between backdrop-blur-xl text-left"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${ticket.status === 'open'
                                    ? 'bg-yellow-400/10 text-yellow-500 border-yellow-400/20'
                                    : 'bg-green-500/10 text-green-400 border-green-500/20'
                                    }`}>
                                    {ticket.status === 'open' ? 'En traitement' : 'Résolu'}
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h4 className="text-xl font-black text-white uppercase italic group-hover:text-yellow-400 transition-colors mb-4 line-clamp-1">{ticket.subject}</h4>

                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-center">
                                        <MessageSquare className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-black tracking-[0.15em] uppercase">ID: #{ticket.id}</span>
                                </div>
                                <span className="text-yellow-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all">
                                    Détails <ChevronRight className="w-3 h-3" />
                                </span>
                            </div>
                        </Link>
                    ))}

                    {/* Pagination Controls */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-8 col-span-full">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-yellow-400/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm font-black text-white px-6 py-2 bg-gray-900 border border-gray-800 rounded-xl tracking-widest uppercase italic border-gray-800 text-white/80">
                                Page {page} / {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-yellow-400/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="bg-yellow-400/5 border border-yellow-400/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/20">
                        <AlertCircle className="w-7 h-7 text-gray-950" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-black text-white uppercase italic tracking-wider">Besoin d'aide immédiate?</h4>
                        <p className="text-gray-500 font-bold text-xs">Notre ligne directe est disponible pour les urgences de livraison.</p>
                    </div>
                </div>
                <a href="tel:+21670000000" className="text-2xl font-black text-yellow-400 italic tracking-tighter hover:scale-105 transition-transform">
                    +216 70 XXX XXX
                </a>
            </div>
        </div>
    );
}
