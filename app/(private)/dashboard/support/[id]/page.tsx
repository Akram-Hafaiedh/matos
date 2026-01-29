'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, ChevronLeft, Loader2, MessageSquare, ShieldCheck, User, Package, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Message {
    id: number;
    message: string;
    isAdmin: boolean;
    createdAt: string;
    user: { name: string; image: string | null; };
}

interface Ticket {
    id: number;
    subject: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;
    messages: Message[];
    user: { name: string; email: string; image: string | null; } | null;
    order?: { orderNumber: string; totalAmount: number; status: string; } | null;
}

export default function AdminTicketDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { fetchTicket(); }, [id]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [ticket?.messages]);

    const fetchTicket = async () => {
        try {
            const res = await fetch(`/api/support/${id}`);
            const data = await res.json();
            if (data.success) setTicket(data.ticket);
            else router.push('/dashboard/support');
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;
        setSending(true);
        try {
            const res = await fetch(`/api/support/${id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage, isAdmin: true })
            });
            const data = await res.json();
            if (data.success) {
                setTicket(prev => prev ? { ...prev, messages: [...prev.messages, data.message] } : null);
                setNewMessage('');
            }
        } catch (error) { console.error(error); } finally { setSending(false); }
    };

    const updateStatus = async (newStatus: string) => {
        setUpdatingStatus(true);
        try {
            const res = await fetch(`/api/support/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setTicket(prev => prev ? { ...prev, status: newStatus } : null);
            }
        } catch (error) { console.error(error); } finally { setUpdatingStatus(false); }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center bg-black">
            <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
        </div>
    );

    if (!ticket) return null;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-4">
                    <Link href="/dashboard/support" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition font-black uppercase text-[10px] tracking-[0.2em] group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour aux tickets
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-1 bg-yellow-400 rounded-full"></div>
                        <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                            Ticket <span className="text-yellow-400">#{ticket.id}</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <select
                        value={ticket.status}
                        onChange={(e) => updateStatus(e.target.value)}
                        disabled={updatingStatus}
                        className="bg-gray-900 border-2 border-gray-800 text-white px-6 py-2.5 rounded-2xl font-black uppercase text-[10px] tracking-widest focus:border-yellow-400/50 outline-none transition duration-500 disabled:opacity-50"
                    >
                        <option value="open">Ouvert</option>
                        <option value="in_progress">En cours</option>
                        <option value="resolved">Résolu</option>
                        <option value="closed">Fermé</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <div className="lg:col-span-1 space-y-8">
                    {/* User Info */}
                    <div className="bg-gray-900/40 p-8 rounded-[3rem] border border-gray-800 backdrop-blur-3xl space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center border border-white/5">
                                <User className="text-gray-500" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">Client</p>
                                <p className="text-white font-black uppercase text-sm">{ticket.user?.name || 'Inconnu'}</p>
                            </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-gray-800">
                            <div>
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black mb-1">Email</p>
                                <p className="text-gray-400 text-xs font-bold truncate">{ticket.user?.email || '-'}</p>
                            </div>
                            {ticket.order && (
                                <div>
                                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black mb-1">Commande</p>
                                    <div className="flex items-center gap-2 text-yellow-400 font-black text-xs italic">
                                        <Package size={14} />
                                        #{ticket.order.orderNumber}
                                    </div>
                                </div>
                            )}
                            <div>
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black mb-1">Priorité</p>
                                <div className={`px-3 py-1 border text-[10px] font-black rounded-lg w-fit uppercase ${ticket.priority === 'urgent' ? 'text-red-500 border-red-500/20 bg-red-500/10' : 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10'
                                    }`}>
                                    {ticket.priority}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900/40 p-8 rounded-[3rem] border border-gray-800 backdrop-blur-3xl space-y-4">
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">Sujet du ticket</p>
                        <p className="text-white font-black text-sm">{ticket.subject}</p>
                    </div>
                </div>

                <div className="lg:col-span-3 flex flex-col h-[700px] bg-gray-900/30 rounded-[3.5rem] border border-gray-800 backdrop-blur-3xl overflow-hidden shadow-3xl">
                    <div className="px-8 py-6 border-b border-gray-800 bg-gray-950/20 flex items-center bg-yellow-400/5">
                        <div className="flex items-center gap-4 flex-1">
                            <ShieldCheck className="w-5 h-5 text-yellow-400" />
                            <h4 className="text-white font-black uppercase text-sm tracking-widest italic">Interface Admin Support</h4>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        {/* Initial Description */}
                        <div className="flex gap-5 group items-start">
                            <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-yellow-400/50 flex-shrink-0 border border-white/5 shadow-xl transition-all duration-500">
                                {ticket.user?.image ? (
                                    <Image src={ticket.user.image} alt={ticket.user.name} width={48} height={48} className="rounded-2xl object-cover" />
                                ) : (
                                    <div className="text-xl font-black uppercase">{ticket.user?.name?.[0] || 'U'}</div>
                                )}
                            </div>
                            <div className="space-y-2 max-w-[85%]">
                                <div className="bg-gray-800/40 p-6 rounded-[2.5rem] rounded-tl-none border border-white/5 text-gray-300 text-sm leading-relaxed backdrop-blur-sm">
                                    <p className="font-bold mb-2 text-yellow-400/80 uppercase text-[10px] tracking-widest">Message initial</p>
                                    {ticket.description}
                                </div>
                                <span className="text-[10px] font-bold text-gray-600 ml-2 uppercase tracking-widest">
                                    {new Date(ticket.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Conversation */}
                        {ticket.messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-5 group items-start ${msg.isAdmin ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all duration-500 shadow-xl overflow-hidden ${msg.isAdmin
                                    ? 'bg-yellow-400 border-yellow-400/50'
                                    : 'bg-gray-800 border-white/5 group-hover:border-yellow-400/30'
                                    }`}>
                                    {msg.isAdmin ? (
                                        <div className="p-2.5">
                                            <Image src="/logo.svg" alt="Mato's" width={40} height={40} className="object-contain" />
                                        </div>
                                    ) : (
                                        msg.user.image ? (
                                            <Image src={msg.user.image} alt={msg.user.name} width={48} height={48} className="object-cover" />
                                        ) : (
                                            <span className="font-black text-gray-400 uppercase text-lg">{msg.user.name?.[0] || 'U'}</span>
                                        )
                                    )}
                                </div>
                                <div className={`space-y-2 max-w-[85%] ${msg.isAdmin ? 'items-end flex flex-col' : ''}`}>
                                    <div className={`p-6 rounded-[2.5rem] border shadow-lg backdrop-blur-sm ${msg.isAdmin
                                        ? 'bg-yellow-400/20 border-yellow-400/30 text-white rounded-tr-none'
                                        : 'bg-gray-950 border-gray-800 text-white rounded-tl-none'
                                        }`}>
                                        <p className="font-bold text-sm leading-relaxed">{msg.message}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold text-gray-600 uppercase tracking-widest ${msg.isAdmin ? 'mr-2' : 'ml-2'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-8 bg-gray-950/40 border-t border-gray-800">
                        <form onSubmit={handleSendMessage} className="relative">
                            <input
                                type="text"
                                placeholder="Écrire une réponse officielle..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="w-full bg-gray-900/50 border-2 border-gray-800 text-white pl-8 pr-16 py-6 rounded-[2.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm shadow-inner"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim() || sending}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-yellow-400 text-gray-900 rounded-[2rem] flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-xl"
                            >
                                {sending ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                            </button>
                        </form>
                        <div className="mt-4 flex items-center gap-2 justify-center">
                            <AlertTriangle size={12} className="text-gray-600" />
                            <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">Votre réponse sera immédiatement notifiée au client.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
