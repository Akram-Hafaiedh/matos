'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Send,
    ChevronLeft,
    Loader2,
    MessageSquare,
    ShieldCheck,
    User,
    Package,
    AlertTriangle,
    Paperclip,
    X,
    FileIcon,
    ImageIcon,
    Activity,
    ShieldAlert,
    Hash,
    Clock,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import UserAvatar from '@/components/UserAvatar';
import TacticalAura from '@/components/TacticalAura';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: number;
    message: string;
    is_admin: boolean;
    created_at: string;
    user: { name: string; image: string | null; };
    attachments?: any[];
}

interface Ticket {
    id: number;
    subject: string;
    description: string;
    status: string;
    priority: string;
    created_at: string;
    messages: Message[];
    user: { name: string; email: string; image: string | null; } | null;
    order?: { order_number: string; total_amount: number; status: string; } | null;
}

export default function AdminTicketDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [otheruserTyping, setOtherUserTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Polling for real-time updates
    useEffect(() => {
        fetchTicket();
        const interval = setInterval(() => {
            fetchTicket(true);
        }, 3000); // 3s for polling

        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [ticket?.messages, otheruserTyping]);

    const fetchTicket = async (isPolling = false) => {
        try {
            const res = await fetch(`/api/support/${id}`);
            const data = await res.json();
            if (data.success) {
                const t: Ticket = {
                    ...data.ticket,
                    user: data.ticket.users,
                    messages: (data.ticket.ticket_messages || []).map((msg: any) => ({
                        ...msg,
                        user: msg.users
                    })),
                    order: data.ticket.orders
                };

                // Init typing check
                if (data.ticket.last_user_typing_at) {
                    const lastType = new Date(data.ticket.last_user_typing_at).getTime();
                    const now = new Date().getTime();
                    setOtherUserTyping(now - lastType < 5000);
                } else {
                    setOtherUserTyping(false);
                }

                setTicket(prev => {
                    if (!prev) return t;
                    if (JSON.stringify(prev.messages) !== JSON.stringify(t.messages) || prev.status !== t.status) {
                        return t;
                    }
                    return prev;
                });
            }
            else if (!isPolling) router.push('/dashboard/support');
        } catch (error) { console.error(error); } finally { if (!isPolling) setLoading(false); }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newMessage.trim() && attachments.length === 0) || sending) return;

        setSending(true);
        try {
            let uploadedAttachments: any[] = [];
            if (attachments.length > 0) {
                uploadedAttachments = await uploadFiles();
            }

            const res = await fetch(`/api/support/${id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: newMessage,
                    is_admin: true,
                    attachments: uploadedAttachments
                })
            });
            const data = await res.json();
            if (data.success) {
                // The polling will pick up the new message anyway, but update locally for speed
                const newMsg = {
                    ...data.message,
                    user: data.message.users
                };
                setTicket(prev => prev ? { ...prev, messages: [...prev.messages, newMsg] } : null);
                setNewMessage('');
                setAttachments([]);
            }
        } catch (error) { console.error(error); } finally { setSending(false); }
    };

    const uploadFiles = async () => {
        if (attachments.length === 0) return [];
        setUploading(true);
        const uploadedUrls = [];
        for (const file of attachments) {
            try {
                const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                    method: 'POST',
                    body: file,
                });
                const data = await res.json();
                if (data.url) uploadedUrls.push({ name: file.name, type: file.type, url: data.url });
            } catch (error) { console.error("Upload failed", error); }
        }
        setUploading(false);
        return uploadedUrls;
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const validFiles = newFiles.filter(file => file.size <= 2 * 1024 * 1024);
            if (validFiles.length !== newFiles.length) alert("Max 2MB per file.");
            setAttachments(prev => [...prev, ...validFiles]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
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
            if (data.success) setTicket(prev => prev ? { ...prev, status: newStatus } : null);
        } catch (error) { console.error(error); } finally { setUpdatingStatus(false); }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
            <Loader2 className="w-16 h-16 text-yellow-400 animate-spin" strokeWidth={1} />
            <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] italic animate-pulse">Scanning Transmission Channel...</p>
        </div>
    );

    if (!ticket) return null;

    const getStatusGlow = (status: string) => {
        switch (status) {
            case 'open': return 'text-yellow-400 group-hover:shadow-[0_0_20px_rgba(250,204,21,0.2)]';
            case 'resolved': return 'text-green-500';
            case 'closed': return 'text-gray-600';
            default: return 'text-blue-400';
        }
    };

    return (
        <div className="w-full space-y-12 pb-20 text-left">
            {/* Tactical Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400/10 rounded-2xl flex items-center justify-center border border-yellow-400/20">
                            <MessageSquare className="w-5 h-5 text-yellow-400" />
                        </div>
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic leading-none">Transmission Control System</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none">
                        Transmission <span className="text-yellow-400">Support</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/support"
                            className="bg-white/[0.02] border border-white/5 px-6 py-3 rounded-2xl text-gray-500 hover:text-white transition-all flex items-center gap-2 text-[10px] font-[1000] uppercase tracking-widest italic"
                        >
                            <ChevronLeft size={14} />
                            Retour au Centre de Crise
                        </Link>
                        <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em]">Analyse du Signal #{ticket.id} et Protocoles d'Intervention</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white/[0.02] p-1.5 rounded-[1.5rem] border border-white/5 backdrop-blur-3xl shadow-2xl">
                    <select
                        value={ticket.status}
                        onChange={(e) => updateStatus(e.target.value)}
                        disabled={updatingStatus}
                        className={`bg-black border-2 border-white/5 text-white px-6 py-3 rounded-[1.2rem] font-[1000] uppercase text-[9px] tracking-widest focus:border-yellow-400/50 outline-none transition-all duration-700 disabled:opacity-50 italic ${getStatusGlow(ticket.status)}`}
                    >
                        <option value="open">Statut: OUVERT</option>
                        <option value="in_progress">Statut: EN COURS</option>
                        <option value="resolved">Statut: RÉSOLU</option>
                        <option value="closed">Statut: FERMÉ</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                {/* Side Info */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl space-y-6 shadow-3xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-yellow-400/[0.01] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex items-center gap-5 relative z-10">
                            <UserAvatar
                                image={ticket.user?.image}
                                name={ticket.user?.name || 'U'}
                                size="lg"
                                className="border border-white/5 shadow-2xl"
                            />
                            <div className="min-w-0">
                                <p className="text-[9px] text-gray-700 uppercase tracking-widest font-black italic mb-0.5">Origine Signal</p>
                                <p className="text-white font-[1000] uppercase text-lg italic tracking-tighter leading-none truncate">{ticket.user?.name || 'Inconnu'}</p>
                            </div>
                        </div>

                        <div className="space-y-5 pt-6 border-t border-white/5 relative z-10">
                            <div className="space-y-1.5">
                                <p className="text-[8px] text-gray-700 uppercase tracking-[0.3em] font-black italic">Canal de Transmission</p>
                                <p className="text-yellow-400/60 text-[9px] font-black italic truncate bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{ticket.user?.email || '-'}</p>
                            </div>

                            {ticket.order && (
                                <div className="space-y-1.5">
                                    <p className="text-[8px] text-gray-700 uppercase tracking-[0.3em] font-black italic">Vecteur Commande</p>
                                    <div className="flex items-center gap-2 text-yellow-400 font-[1000] text-[9px] italic bg-yellow-400/5 px-3 py-2 rounded-lg border border-yellow-400/10">
                                        <Package size={12} />
                                        #{ticket.order.order_number}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <p className="text-[8px] text-gray-700 uppercase tracking-[0.3em] font-black italic">Niveau d'Urgence</p>
                                <div className={`px-4 py-2 border text-[9px] font-[1000] rounded-xl w-fit uppercase italic tracking-tighter transition-all ${ticket.priority === 'urgent'
                                    ? 'text-red-500 border-red-500/20 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                                    : 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10'
                                    }`}>
                                    {ticket.priority.replace('_', ' ')} Grade
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl space-y-3 shadow-3xl">
                        <p className="text-[8px] text-gray-700 uppercase tracking-[0.3em] font-black italic">Sujet de la Requête</p>
                        <p className="text-gray-300 font-bold text-xs uppercase italic tracking-widest leading-relaxed">{ticket.subject}</p>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-9 flex flex-col h-[700px] bg-white/[0.01] rounded-[3rem] border border-white/5 backdrop-blur-3xl overflow-hidden shadow-3xl relative">
                    <TacticalAura />

                    <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center relative z-10">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-8 h-8 bg-yellow-400/10 rounded-xl flex items-center justify-center text-yellow-400 border border-yellow-400/20">
                                <ShieldCheck size={16} />
                            </div>
                            <div>
                                <h4 className="text-white font-[1000] uppercase text-[10px] tracking-[0.3em] italic mb-0.5">Communication Directe</h4>
                                <p className="text-[8px] text-gray-700 font-black uppercase tracking-widest italic">Canal Sécurisé Mato's</p>
                            </div>
                            {uploading && (
                                <div className="ml-auto flex items-center gap-2.5 bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/20">
                                    <Loader2 size={10} className="text-yellow-400 animate-spin" />
                                    <span className="text-[8px] text-yellow-400 font-[1000] uppercase tracking-widest italic">Sync Fichiers...</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 space-y-10 relative z-10 custom-scrollbar">
                        {/* Initial Description */}
                        <div className="flex gap-6 group items-start animate-in fade-in slide-in-from-left-4 duration-700">
                            <UserAvatar
                                image={ticket.user?.image}
                                name={ticket.user?.name || 'U'}
                                size="md"
                                className="border border-white/5 shadow-2xl group-hover:border-yellow-400/20 transition-all bg-yellow-400 text-black font-black"
                            />
                            <div className="space-y-2 max-w-[85%]">
                                <div className="bg-gray-900/40 p-6 rounded-[2rem] rounded-tl-none border border-white/5 text-gray-400 text-sm font-bold leading-relaxed backdrop-blur-md shadow-2xl group-hover:border-yellow-400/10 transition-all italic">
                                    <p className="font-[1000] mb-3 text-yellow-400/40 uppercase text-[8px] tracking-[0.4em] italic border-b border-white/5 pb-2">Description Initiale du Client</p>
                                    {ticket.description}
                                </div>
                                <div className="flex items-center gap-2 ml-4 opacity-40">
                                    <Clock size={10} className="text-gray-500" />
                                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em]">
                                        {new Date(ticket.created_at).toLocaleString('fr-FR')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Conversation */}
                        {ticket.messages && Array.isArray(ticket.messages) && ticket.messages.map((msg, idx) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, x: msg.is_admin ? 15 : -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className={`flex gap-6 group items-start ${msg.is_admin ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all duration-700 shadow-3xl overflow-hidden ${msg.is_admin
                                    ? 'bg-yellow-400 border-yellow-400/50 group-hover:rotate-6'
                                    : 'bg-black border-white/5 group-hover:border-yellow-400/30'
                                    }`}>
                                    {msg.is_admin ? (
                                        <div className="p-2">
                                            <Image src="/logo.svg" alt="Mato's" width={40} height={40} className="object-contain" />
                                        </div>
                                    ) : (
                                        <UserAvatar image={msg.user?.image} name={msg.user?.name} size="md" className="bg-yellow-400 text-black font-bold" />
                                    )}
                                </div>
                                <div className={`space-y-2 max-w-[80%] ${msg.is_admin ? 'items-end flex flex-col' : ''}`}>
                                    <div className={`p-6 rounded-[2rem] border shadow-2xl backdrop-blur-xl space-y-4 transition-all duration-700 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] ${msg.is_admin
                                        ? 'bg-yellow-400/10 border-yellow-400/30 text-white rounded-tr-none'
                                        : 'bg-black border-white/10 text-gray-300 rounded-tl-none group-hover:border-yellow-400/10'
                                        }`}>
                                        <p className={`font-[1000] mb-1.5 uppercase text-[8px] tracking-[0.5em] italic ${msg.is_admin ? 'text-yellow-400/60' : 'text-gray-700'}`}>
                                            {msg.is_admin ? 'Réponse Officielle Mato\'s' : 'Message du Client'}
                                        </p>

                                        {msg.message && <p className="font-bold text-sm leading-relaxed uppercase italic tracking-tight">{msg.message}</p>}

                                        {/* Attachments */}
                                        {msg.attachments && Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                                            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/5">
                                                {msg.attachments.map((att: any, attIdx: number) => (
                                                    <a
                                                        key={attIdx}
                                                        href={att.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-700 transform hover:scale-[1.03] ${msg.is_admin
                                                            ? 'bg-yellow-400/5 border-yellow-400/10 hover:bg-yellow-400/10'
                                                            : 'bg-white/5 border-white/5 hover:border-yellow-400/20'}`}
                                                    >
                                                        {att.type?.startsWith('image/') ? (
                                                            <div className="w-8 h-8 rounded-lg overflow-hidden relative shadow-lg">
                                                                <Image src={att.url} alt={att.name} fill className="object-cover" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-gray-600">
                                                                <FileIcon size={16} />
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-black uppercase tracking-widest truncate max-w-[120px]">{att.name}</span>
                                                            <span className="text-[7px] opacity-40 uppercase font-black tracking-[0.1em]">Scellé</span>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`flex items-center gap-1.5 opacity-30 ${msg.is_admin ? 'mr-4' : 'ml-4'}`}>
                                        <Clock size={8} className="text-gray-500" />
                                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest italic">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Controls */}
                    <div className="p-8 bg-black/60 border-t border-white/10 relative z-10 shadow-[0_-15px_40px_rgba(0,0,0,0.5)]">
                        {/* Attachment Preview */}
                        <AnimatePresence>
                            {attachments.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-wrap gap-3 mb-6"
                                >
                                    {attachments.map((file, idx) => (
                                        <div key={idx} className="relative group/att">
                                            <div className="p-3 bg-white/[0.03] rounded-xl border border-white/10 flex items-center gap-3 pr-10 group-hover/att:border-yellow-400/30 transition-all shadow-xl backdrop-blur-3xl">
                                                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-yellow-400 shadow-inner">
                                                    {file.type.startsWith('image/') ? <ImageIcon size={18} /> : <FileIcon size={18} />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] text-white font-black uppercase tracking-widest max-w-[100px] truncate">{file.name}</span>
                                                    <span className="text-[7px] text-gray-700 font-bold uppercase italic">Pre-Sync</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeAttachment(idx)}
                                                className="absolute -right-2 -top-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-black transition-all border-2 border-black"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSendMessage} className="relative flex items-center gap-4">
                            <div className="relative flex-1 group">
                                <input
                                    type="text"
                                    placeholder="Écrire une réponse officielle..."
                                    value={newMessage}
                                    onChange={(e) => { setNewMessage(e.target.value); }}
                                    className="w-full bg-black border border-white/10 text-white pl-8 pr-24 py-7 rounded-[1.8rem] font-[1000] uppercase text-[10px] tracking-[0.2em] italic focus:outline-none focus:border-yellow-400/50 transition-all shadow-inner placeholder:text-gray-800"
                                />

                                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        multiple
                                        onChange={handleFileSelect}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2.5 bg-white/5 hover:bg-yellow-400/10 text-gray-700 hover:text-yellow-400 rounded-xl transition-all border border-transparent hover:border-yellow-400/20 shadow-xl"
                                        title="Joindre un fichier"
                                    >
                                        <Paperclip size={20} />
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={(!newMessage.trim() && attachments.length === 0) || sending || uploading}
                                className="w-16 h-16 bg-yellow-400 text-black rounded-[1.5rem] flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(250,204,21,0.2)] flex-shrink-0 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                {sending || uploading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} className="-mr-1" />}
                            </button>
                        </form>

                        <div className="mt-6 flex items-center gap-3 justify-center bg-white/[0.01] py-3 rounded-xl border border-white/5">
                            <div className="flex gap-1">
                                <Zap size={10} className="text-yellow-400 animate-pulse" />
                                <Zap size={10} className="text-yellow-400 animate-pulse opacity-50" />
                            </div>
                            <p className="text-[8px] text-gray-600 font-[1000] uppercase tracking-[0.2em] italic">Confirmation protocolle • Archivage instantané.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
