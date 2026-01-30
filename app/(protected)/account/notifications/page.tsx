'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCircle, Clock, ChevronLeft, Trash2, Filter, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    link: string | null;
    isRead: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
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
                limit: '10'
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
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
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
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
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
        ? notifications.filter(n => !n.isRead)
        : notifications;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-1 bg-yellow-400 rounded-full"></div>
                        <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                            Centre de <span className="text-yellow-400">Notifications</span>
                        </h1>
                    </div>
                </div>
                {notifications.some(n => !n.isRead) && (
                    <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-black text-yellow-400 uppercase tracking-widest hover:text-white transition bg-yellow-400/5 px-6 py-3 rounded-2xl border border-yellow-400/20 shadow-xl shadow-yellow-400/5"
                    >
                        Tout marquer comme lu
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-4 border-b border-gray-800">
                <button
                    onClick={() => setFilter('all')}
                    className={`pb-4 px-2 text-[10px] font-black uppercase tracking-widest transition relative ${filter === 'all' ? 'text-yellow-400' : 'text-gray-500 hover:text-white'}`}
                >
                    Toutes ({pagination?.totalItems || 0})
                    {filter === 'all' && <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-full"></div>}
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={`pb-4 px-2 text-[10px] font-black uppercase tracking-widest transition relative ${filter === 'unread' ? 'text-yellow-400' : 'text-gray-500 hover:text-white'}`}
                >
                    Non lues
                    {filter === 'unread' && <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-full"></div>}
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="py-20 bg-gray-900/40 rounded-[3rem] border border-gray-800 border-dashed text-center space-y-6">
                        <div className="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center mx-auto text-gray-700">
                            <Bell size={40} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-white font-black uppercase text-sm">Silence radio</p>
                            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Vous n'avez aucune notification pour le moment.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 text-left">
                        {filteredNotifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`group p-8 rounded-[2.5rem] border transition-all duration-500 flex items-start gap-8 relative overflow-hidden ${!notif.isRead
                                    ? 'bg-yellow-400/5 border-yellow-400/30 shadow-xl shadow-yellow-400/5'
                                    : 'bg-gray-900/40 border-gray-800 hover:bg-white/[0.02] hover:border-gray-700'
                                    }`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-500 ${!notif.isRead ? 'bg-yellow-400 text-gray-900 shadow-xl' : 'bg-gray-800 text-gray-500'
                                    }`}>
                                    <Bell size={24} />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-white font-black uppercase text-sm tracking-tight">{notif.title}</h3>
                                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{new Date(notif.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-400 text-xs font-bold leading-relaxed">{notif.message}</p>
                                    <div className="flex items-center gap-4 pt-2">
                                        {notif.link && (
                                            <Link href={notif.link} className="text-[9px] font-black text-yellow-400 uppercase tracking-widest hover:underline">
                                                Voir les détails
                                            </Link>
                                        )}
                                        {!notif.isRead && (
                                            <button
                                                onClick={() => markAsRead(notif.id)}
                                                className="text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white"
                                            >
                                                Marquer comme lu
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination Controls */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-8">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-yellow-400/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-sm font-black text-white px-6 py-2 bg-gray-900 border border-gray-800 rounded-xl tracking-widest uppercase italic bg-gray-950 border-gray-800 text-white/80">
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
            </div>
        </div>
    );
}
