'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    link: string | null;
    isRead: boolean;
    createdAt: string;
}

export default function NotificationsDropdown() {
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            const data = await res.json();
            if (data.success) {
                setUnreadNotifications(data.unread);
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error('Failed to fetch notifications');
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                body: JSON.stringify({ all: true })
            });
            setUnreadNotifications(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark notifications as read');
        }
    };

    const markRead = async (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                body: JSON.stringify({ id })
            });
            setUnreadNotifications(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Failed to mark notification as read');
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative">
            <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2.5 bg-gray-900 border border-gray-800 rounded-2xl text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50 transition relative group"
            >
                <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-gray-950 animate-pulse">
                        {unreadNotifications}
                    </span>
                )}
            </button>

            {isNotifOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-80 bg-gray-950 border border-gray-800 rounded-[2rem] shadow-3xl z-20 overflow-hidden animate-slide-up backdrop-blur-3xl">
                        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                            <h4 className="text-sm font-black text-white uppercase tracking-tighter">Notifications</h4>
                            {unreadNotifications > 0 && (
                                <button onClick={markAllAsRead} className="text-[10px] font-black text-yellow-400 uppercase tracking-widest hover:text-white transition">Tout lire</button>
                            )}
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <Link
                                        key={notif.id}
                                        href={notif.link || '/account/notifications'}
                                        onClick={() => setIsNotifOpen(false)}
                                        className={`flex items-start gap-4 px-6 py-4 hover:bg-white/5 transition border-b border-gray-900 last:border-0 relative group/item ${!notif.isRead ? 'bg-yellow-400/5' : ''}`}
                                    >
                                        <div className={`p-2 rounded-xl flex-shrink-0 ${notif.type === 'ticket_response' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                                            <Bell size={16} />
                                        </div>
                                        <div className="space-y-1 flex-1 pr-6">
                                            <p className="text-xs font-black text-white leading-tight">{notif.title}</p>
                                            <p className="text-[10px] text-gray-500 font-bold leading-relaxed line-clamp-2">{notif.message}</p>
                                            <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{new Date(notif.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        {!notif.isRead && (
                                            <button
                                                onClick={(e) => markRead(e, notif.id)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-yellow-400/20 rounded-full opacity-0 group-hover/item:opacity-100 transition-all text-yellow-400"
                                                title="Marquer comme lu"
                                            >
                                                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400"></div>
                                            </button>
                                        )}
                                    </Link>
                                ))
                            ) : (
                                <div className="px-6 py-12 text-center">
                                    <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-700">
                                        <Bell size={24} />
                                    </div>
                                    <p className="text-xs font-bold text-gray-500">Aucune notification</p>
                                </div>
                            )}
                        </div>
                        <Link
                            href="/account/notifications"
                            onClick={() => setIsNotifOpen(false)}
                            className="block py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-white hover:bg-white/5 transition border-t border-gray-800 font-sans"
                        >
                            Voir tout
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
