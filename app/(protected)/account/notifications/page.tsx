'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCircle, Clock, ChevronLeft, Trash2, Filter, ChevronRight, Loader2, Sparkles, AlertCircle, Signal } from 'lucide-react';
import Link from 'next/link';
import TacticalAura from '@/components/TacticalAura';
import { useSupportModal } from '@/hooks/useSupportModal';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
}

export default function NotificationsPage() {
    const { openSupportModal } = useSupportModal();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '6'
            });
            const res = await fetch(`/api/notifications?${queryParams.toString()}`);
            const data = await res.json();
            if (data.success) {
                setNotifications(data.notifications);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        try {
            await fetch(`/api/notifications`, {
                method: 'PATCH',
                body: JSON.stringify({ id })
            });
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                body: JSON.stringify({ all: true })
            });
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [page]);

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.is_read)
        : notifications;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] italic">Syncing Transmission Lines...</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-1000">
            <TacticalAura />
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 border-b border-white/5 pb-16">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400/10 rounded-2xl flex items-center justify-center border border-yellow-400/20">
                            <Signal className="w-5 h-5 text-yellow-400" />
                        </div>
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic leading-none">Signal Intelligence Unit</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none">
                        FLUX DE <span className="text-yellow-400">SIGNAUX</span>
                    </h1>
                </div>
                {notifications.some(n => !n.is_read) && (
                    <button
                        onClick={markAllAsRead}
                        className="bg-yellow-400 text-black px-10 py-5 rounded-2xl font-[1000] uppercase text-[10px] tracking-[0.2em] italic hover:scale-105 transition-transform active:scale-95 shadow-2xl flex items-center gap-4 group"
                    >
                        <CheckCircle size={16} strokeWidth={4} />
                        Tout marquer comme lu
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-8 border-b border-white/5 pb-1">
                <button
                    onClick={() => setFilter('all')}
                    className={`pb-6 px-2 text-[10px] font-[1000] uppercase tracking-[0.3em] transition-all relative italic ${filter === 'all' ? 'text-yellow-400' : 'text-gray-700 hover:text-white'}`}
                >
                    Toutes ({pagination?.totalItems || 0})
                    {filter === 'all' && <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>}
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={`pb-6 px-2 text-[10px] font-[1000] uppercase tracking-[0.3em] transition-all relative italic ${filter === 'unread' ? 'text-yellow-400' : 'text-gray-700 hover:text-white'}`}
                >
                    Non lues
                    {filter === 'unread' && <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>}
                </button>
            </div>

            {/* Content */}
            <div className="space-y-8">
                {filteredNotifications.length === 0 ? (
                    <div className="py-32 bg-white/[0.01] rounded-[3.5rem] border border-white/5 border-dashed text-center space-y-8 relative overflow-hidden">
                        <div className="w-24 h-24 bg-white/[0.02] rounded-[2rem] border border-white/5 flex items-center justify-center mx-auto text-gray-800">
                            <Bell size={40} />
                        </div>
                        <div className="space-y-4">
                            <p className="text-3xl font-[1000] text-gray-800 uppercase italic tracking-tighter">Silence Tactique</p>
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] italic">Aucune interference detectée sur vos canaux de reception.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 text-left">
                        {filteredNotifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`group p-10 rounded-[3rem] border transition-all duration-700 flex flex-col md:flex-row items-start md:items-center gap-10 relative overflow-hidden ${!notif.is_read
                                    ? 'bg-yellow-400/5 border-yellow-400/20 shadow-[0_0_30px_rgba(250,204,21,0.05)]'
                                    : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.02] hover:border-white/10'
                                    }`}
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/[0.01] blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-yellow-400/[0.03] transition-all duration-1000"></div>

                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110 duration-700 ${!notif.is_read ? 'bg-yellow-400 text-black shadow-2xl' : 'bg-white/[0.02] text-gray-700 border border-white/5'
                                    }`}>
                                    <Bell size={28} strokeWidth={notif.is_read ? 2 : 3} className={!notif.is_read ? 'animate-pulse' : ''} />
                                </div>
                                <div className="flex-1 space-y-4 relative z-10 w-full">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="space-y-1">
                                            {!notif.is_read && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.5)]"></span>
                                                    <span className="text-[9px] font-black text-yellow-400 uppercase tracking-[0.3em] italic">Nouveau Signal</span>
                                                </div>
                                            )}
                                            <h3 className="text-xl font-[1000] text-white uppercase italic tracking-tighter group-hover:text-yellow-400 transition-colors">
                                                {notif.title}
                                            </h3>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] italic bg-white/[0.02] px-4 py-2 rounded-xl border border-white/5">
                                            {new Date(notif.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-[11px] font-black uppercase tracking-widest leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                                        {notif.message}
                                    </p>
                                    <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                                        {notif.link && (
                                            <Link href={notif.link} className="text-[10px] font-[1000] text-yellow-400 uppercase tracking-[0.3em] hover:scale-105 transition-transform italic flex items-center gap-3 group/link">
                                                <span className="w-8 h-px bg-yellow-400 opacity-30 group-hover/link:w-12 transition-all"></span>
                                                Détails de Mission
                                                <ChevronRight size={14} strokeWidth={3} />
                                            </Link>
                                        )}
                                        {!notif.is_read && (
                                            <button
                                                onClick={() => markAsRead(notif.id)}
                                                className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] hover:text-white transition-colors italic ml-auto"
                                            >
                                                Archiver le Signal
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
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
            </div>

            <div className="bg-white/[0.01] border border-white/5 p-10 rounded-[3.5rem] flex flex-col lg:flex-row items-center gap-10 justify-between relative overflow-hidden group">
                <div className="flex items-center gap-8 relative z-10">
                    <div className="w-16 h-16 bg-white/[0.02] rounded-3xl flex items-center justify-center text-yellow-400 border border-white/5 group-hover:bg-yellow-400/5 transition-colors">
                        <Sparkles size={32} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter">Alerte de Proximité?</h4>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] italic">Activez les notifications push pour ne rater aucune signature.</p>
                            <button
                                onClick={() => openSupportModal({ module: 'notifications', subject: 'Aide avec les Notifications' })}
                                className="text-yellow-400 font-black uppercase text-[9px] tracking-[0.2em] italic hover:text-white transition-colors"
                            >
                                Besoin d'aide technique ?
                            </button>
                        </div>
                    </div>
                </div>
                <button className="bg-white text-black px-12 py-5 rounded-2xl font-[1000] uppercase text-[11px] tracking-[0.2em] italic hover:scale-105 transition-transform active:scale-95 shadow-2xl">
                    Activer
                </button>
            </div>
        </div>
    );
}
