'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, ChevronLeft, Loader2, MessageSquare, ShieldCheck, User, Package, AlertTriangle, Paperclip, X, FileIcon, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import UserAvatar from '@/components/UserAvatar';

interface Message {
    id: number;
    message: string;
    isAdmin: boolean;
    createdAt: string;
    user: { name: string; image: string | null; };
    attachments?: any[];
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
                const t = data.ticket;

                // Init typing check
                if (t.lastUserTypingAt) {
                    const lastType = new Date(t.lastUserTypingAt).getTime();
                    const now = new Date().getTime();
                    setOtherUserTyping(now - lastType < 5000);
                } else {
                    setOtherUserTyping(false);
                }

                // Only update if there are changes or it's the first load
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

    const handleTyping = () => {
        if (!isTyping) {
            setIsTyping(true);
            fetch(`/api/support/${id}/typing`, { method: 'POST' });
        }
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            // Simple size validation (e.g. 2MB limit per file)
            const validFiles = newFiles.filter(file => file.size <= 2 * 1024 * 1024);

            if (validFiles.length !== newFiles.length) {
                alert("Certains fichiers sont trop volumineux (max 2MB).");
            }

            setAttachments(prev => [...prev, ...validFiles]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
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
                if (data.url) {
                    uploadedUrls.push({
                        name: file.name,
                        type: file.type,
                        url: data.url
                    });
                }
            } catch (error) {
                console.error("Upload failed for", file.name, error);
            }
        }
        setUploading(false);
        return uploadedUrls;
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
                    isAdmin: true,
                    attachments: uploadedAttachments
                })
            });
            const data = await res.json();
            if (data.success) {
                setTicket(prev => prev ? { ...prev, messages: [...prev.messages, data.message] } : null);
                setNewMessage('');
                setAttachments([]);
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
        <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
        </div>
    );

    if (!ticket) return null;

    return (
        <div className="w-full py-12 px-4 space-y-12">
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
                            <UserAvatar
                                image={ticket.user?.image}
                                name={ticket.user?.name || 'U'}
                                size="md"
                                className="border border-white/5"
                            />
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
                            {uploading && <span className="text-xs text-yellow-400 animate-pulse ml-auto">Envoi des fichiers...</span>}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        {/* Initial Description */}
                        <div className="flex gap-5 group items-start">
                            <UserAvatar
                                image={ticket.user?.image}
                                name={ticket.user?.name || 'U'}
                                size="lg"
                                className="border border-white/5 shadow-xl transition-all duration-500"
                            />
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
                                        <UserAvatar image={msg.user.image} name={msg.user.name} size="lg" />
                                    )}
                                </div>
                                <div className={`space-y-2 max-w-[85%] ${msg.isAdmin ? 'items-end flex flex-col' : ''}`}>
                                    <div className={`p-6 rounded-[2.5rem] border shadow-lg backdrop-blur-sm space-y-3 ${msg.isAdmin
                                        ? 'bg-yellow-400/20 border-yellow-400/30 text-white rounded-tr-none'
                                        : 'bg-gray-950 border-gray-800 text-white rounded-tl-none'
                                        }`}>
                                        {msg.message && <p className="font-bold text-sm leading-relaxed">{msg.message}</p>}

                                        {/* Attachments */}
                                        {msg.attachments && Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {msg.attachments.map((att: any, idx: number) => (
                                                    <a
                                                        key={idx}
                                                        href={att.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${msg.isAdmin
                                                            ? 'bg-yellow-400/10 border-yellow-400/30 hover:bg-yellow-400/20'
                                                            : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}
                                                    >
                                                        {att.type?.startsWith('image/') ? (
                                                            <div className="w-8 h-8 rounded-lg overflow-hidden relative">
                                                                <Image src={att.url} alt={att.name} fill className="object-cover" />
                                                            </div>
                                                        ) : (
                                                            <FileIcon size={20} className={msg.isAdmin ? 'text-yellow-400' : 'text-gray-400'} />
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-bold truncate max-w-[100px]">{att.name}</span>
                                                            <span className="text-[8px] opacity-70 uppercase">Fichier</span>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
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
                        {/* Attachment Preview */}
                        {attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="p-2 bg-gray-800 rounded-xl border border-gray-700 flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                                                {file.type.startsWith('image/') ? <ImageIcon size={16} /> : <FileIcon size={16} />}
                                            </div>
                                            <span className="text-xs text-white max-w-[100px] truncate">{file.name}</span>
                                            <button
                                                onClick={() => removeAttachment(idx)}
                                                className="p-1 hover:bg-red-500/20 text-red-500 rounded-full transition"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Écrire une réponse officielle..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="w-full bg-gray-900/50 border-2 border-gray-800 text-white pl-8 pr-24 py-6 rounded-[2.5rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm shadow-inner"
                                />

                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
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
                                        className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-full transition"
                                        title="Joindre un fichier"
                                    >
                                        <Paperclip size={20} />
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={(!newMessage.trim() && attachments.length === 0) || sending || uploading}
                                className="w-14 h-14 bg-yellow-400 text-gray-900 rounded-[2rem] flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-xl flex-shrink-0"
                            >
                                {sending || uploading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
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
