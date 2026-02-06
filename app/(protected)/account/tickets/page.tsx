'use client';

import { useEffect, useState } from 'react';
import { LifeBuoy, ChevronRight, Loader2, Plus, MessageSquare, AlertCircle, Search, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import TacticalAura from '@/components/TacticalAura';
import UserAvatar from '@/components/UserAvatar';

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
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic">Opening Support Channels...</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-1000">
            <TacticalAura opacity={0.3} />
            <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-12 border-b border-white/5 pb-16">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-400/20 bg-yellow-400/5 backdrop-blur-md">
                        <LifeBuoy className="w-3 h-3 text-yellow-400" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-400">Concierge Service Unit</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-[1000] uppercase italic tracking-tighter leading-none text-white">
                        LIGNE DE <span className="text-yellow-400 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">SUPPORT</span>
                    </h1>
                </div>
                <Link href="/support/new" className="bg-white text-black px-12 py-6 rounded-2xl font-[1000] uppercase text-[11px] tracking-[0.3em] italic hover:bg-yellow-400 hover:scale-105 transition-all active:scale-95 shadow-2xl flex items-center gap-6 group">
                    <Plus size={18} strokeWidth={4} className="group-hover:rotate-90 transition-transform" />
                    Ouvrir un Nouveau Ticket
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-end justify-between">
                <form onSubmit={handleSearch} className="relative w-full lg:w-96 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-yellow-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Rechercher une session..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/5 text-white pl-14 pr-6 py-5 rounded-3xl font-[1000] uppercase italic tracking-tight focus:outline-none focus:border-yellow-400/50 focus:bg-white/[0.04] transition-all text-sm placeholder:text-gray-800"
                    />
                </form>

                <div className="flex items-center gap-3">
                    {['all', 'open', 'resolved'].map((s) => (
                        <button
                            key={s}
                            onClick={() => { setStatus(s); setPage(1); }}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic border transition-all duration-500 ${status === s
                                ? 'bg-yellow-400 border-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.2)]'
                                : 'bg-white/[0.02] border-white/5 text-gray-600 hover:text-white hover:border-white/10'
                                }`}
                        >
                            {s === 'all' ? 'Tous' : s === 'open' ? 'En cours' : 'Résolu'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                    <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic">Syncing Channels...</p>
                </div>
            ) : tickets.length === 0 ? (
                <div className="text-center py-32 bg-white/[0.01] rounded-[3.5rem] border border-white/5 border-dashed relative overflow-hidden">
                    <div className="w-24 h-24 bg-white/[0.02] rounded-[2rem] border border-white/5 flex items-center justify-center mx-auto mb-8 text-gray-800">
                        <LifeBuoy size={40} />
                    </div>
                    <h3 className="text-3xl font-[1000] text-gray-800 uppercase italic tracking-tighter mb-4">Canaux Inactifs</h3>
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] px-4 italic">Nos agents sont en attente de votre premier signal.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    {tickets.map((ticket) => (
                        <Link
                            key={ticket.id}
                            href={`/account/tickets/${ticket.id}`}
                            className="bg-white/[0.02] p-10 rounded-[3rem] border border-white/5 hover:border-yellow-400/50 transition-all duration-700 group flex flex-col justify-between relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/[0.01] blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-yellow-400/[0.03] transition-all duration-1000"></div>

                            <div className="flex justify-between items-start mb-10">
                                <div className={`px-5 py-2 rounded-2xl text-[10px] font-[1000] uppercase tracking-[0.2em] italic border border-2 border-opacity-10 shadow-lg ${ticket.status === 'open'
                                    ? 'bg-yellow-400/5 text-yellow-400 border-yellow-400/20'
                                    : 'bg-green-500/5 text-green-400 border-green-500/20'
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor] ${ticket.status === 'open' ? 'animate-pulse' : ''}`}></div>
                                        {ticket.status === 'open' ? 'En Traitement' : 'Résolu'}
                                    </div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 italic">
                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h4 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter group-hover:text-yellow-400 transition-colors mb-6 line-clamp-1">
                                {ticket.subject}
                            </h4>

                            <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/5">
                                <div className="flex items-center gap-4">
                                    <UserAvatar
                                        image={ticket.user?.image}
                                        name={ticket.user?.name || 'U'}
                                        size="sm"
                                        className="border border-white/5"
                                    />
                                    <span className="text-[11px] text-gray-600 font-[1000] tracking-[0.3em] uppercase italic">SESSION: #{ticket.id}</span>
                                </div>
                                <span className="text-yellow-400 text-[10px] font-[1000] uppercase tracking-[0.3em] flex items-center gap-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all italic">
                                    OUVRIR LE CANAL <ChevronRight size={16} strokeWidth={3} />
                                </span>
                            </div>
                        </Link>
                    ))}

                    {/* Pagination Controls */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-5 mt-12 col-span-full">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-700 hover:text-white hover:border-yellow-400/50 transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
                            >
                                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <span className="text-[11px] font-[1000] text-gray-500 px-8 py-4 bg-white/[0.03] border border-white/5 rounded-2xl tracking-[0.3em] uppercase italic">
                                Page <span className="text-white mx-1">{page}</span> / {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-700 hover:text-white hover:border-yellow-400/50 transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
                            >
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="bg-yellow-400/[0.02] border border-yellow-400/10 p-12 rounded-[3.5rem] flex flex-col lg:flex-row items-center gap-12 justify-between relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400/[0.01] blur-[150px] -ml-48 -mt-48 pointer-events-none group-hover:bg-yellow-400/[0.03] transition-all duration-1000"></div>

                <div className="flex items-center gap-8 relative z-10">
                    <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.3)] group-hover:scale-110 transition-transform duration-700">
                        <AlertCircle size={36} className="text-black" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter">Signal de Détresse?</h4>
                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] italic">Notre ligne tactique est ouverte 24/7 pour les urgences vitales.</p>
                    </div>
                </div>
                <a href="tel:+21670000000" className="text-4xl font-[1000] text-yellow-400 italic tracking-tighter hover:scale-105 transition-transform flex items-center gap-6 relative z-10 group/phone">
                    <span className="w-12 h-1 bg-yellow-400 opacity-20 mr-2 rounded-full hidden lg:block group-hover/phone:w-20 transition-all duration-700"></span>
                    +216 70 XXX XXX
                </a>
            </div>
        </div>
    );
}
