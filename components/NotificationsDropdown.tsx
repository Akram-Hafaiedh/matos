'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
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
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
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
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error('Failed to mark notification as read');
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative">
            <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative group p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
            >
                <Bell className={`w-5 h-5 transition-colors duration-300 ${isNotifOpen || unreadNotifications > 0 ? 'text-yellow-400' : 'text-gray-400 group-hover:text-white'}`} />
                {unreadNotifications > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/20"
                    >
                        {unreadNotifications}
                    </motion.span>
                )}
                {/* Ambient Pulse */}
                {unreadNotifications > 0 && (
                    <span className="absolute inset-0 rounded-xl bg-yellow-400/10 animate-ping pointer-events-none" />
                )}
            </button>

            <AnimatePresence>
                {isNotifOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)}></div>
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-4 w-80 bg-[#0a0a0a] border border-white/5 rounded-[2rem] shadow-2xl z-20 overflow-hidden p-3 backdrop-blur-3xl"
                        >
                            <div className="flex items-center justify-between px-5 py-3 mb-2 bg-white/5 rounded-2xl">
                                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">Notifications</h4>
                                {unreadNotifications > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-[9px] font-black text-yellow-400 uppercase tracking-widest hover:text-white transition-colors italic"
                                    >
                                        Tout lire
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[350px] overflow-y-auto space-y-1 custom-scrollbar">
                                {notifications.length > 0 ? (
                                    notifications.map((notif, idx) => (
                                        <motion.div
                                            key={notif.id}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <Link
                                                href={notif.link || '/account/notifications'}
                                                onClick={() => setIsNotifOpen(false)}
                                                className={`flex items-start gap-4 p-4 hover:bg-white/5 transition-all rounded-2xl relative group/item ${!notif.is_read ? 'bg-yellow-400/[0.03]' : ''}`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${notif.type === 'ticket_response' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                                                    <Bell size={14} />
                                                </div>
                                                <div className="space-y-1 flex-1 pr-4">
                                                    <p className="text-[11px] font-[1000] text-white italic uppercase tracking-tight leading-tight">{notif.title}</p>
                                                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed line-clamp-2 italic">{notif.message}</p>
                                                    <p className="text-[8px] text-gray-700 font-black uppercase tracking-widest pt-1">
                                                        {notif.created_at ? new Date(notif.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '---'}
                                                    </p>
                                                </div>
                                                {!notif.is_read && (
                                                    <button
                                                        onClick={(e) => markRead(e, notif.id)}
                                                        className="absolute right-3 top-4 w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)] group-hover/item:scale-150 transition-transform"
                                                        title="Marquer comme lu"
                                                    />
                                                )}
                                            </Link>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center space-y-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-gray-700">
                                            <Bell size={20} />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Aucune alerte</p>
                                    </div>
                                )}
                            </div>

                            <Link
                                href="/account/notifications"
                                onClick={() => setIsNotifOpen(false)}
                                className="block mt-2 py-4 text-center text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] hover:text-white hover:bg-white/5 transition-all rounded-2xl border-t border-white/5 italic"
                            >
                                Voir l'historique
                            </Link>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
