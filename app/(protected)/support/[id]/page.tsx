'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, ChevronLeft, Clock, Package, User, Loader2, AlertCircle, Calendar, MessageSquare, UtensilsCrossed, Paperclip } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
    user?: { name: string; image: string | null; } | null;
    order?: { orderNumber: string; totalAmount: number; status: string; } | null;
}

export default function TicketDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [otheruserTyping, setOtherUserTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Polling for real-time updates and typing indicator
    useEffect(() => {
        fetchTicket();
        const interval = setInterval(() => {
            fetchTicket(true);
        }, 3000); // Faster poll for typing

        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [ticket?.messages, otheruserTyping]);

    const fetchTicket = async (isPolling = false) => {
        try {
            const res = await fetch(`/api/support/${id}`);
            const data = await res.json();
            if (data.success) {
                const t = data.ticket;
                // Init typing
                if (t.lastAdminTypingAt) {
                    const lastType = new Date(t.lastAdminTypingAt).getTime();
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
            else if (!isPolling) router.push('/account');
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
            const validFiles = newFiles.filter(file => file.size <= 5 * 1024 * 1024); // 5MB limit
            setAttachments(prev => [...prev, ...validFiles]);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        const newFiles: File[] = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                if (blob) newFiles.push(blob);
            }
        }
        if (newFiles.length > 0) {
            setAttachments(prev => [...prev, ...newFiles]);
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

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center bg-black">
            <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
        </div>
    );

    if (!ticket) return null;

    return (
        <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-4">
                    <Link href="/account" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition font-black uppercase text-[10px] tracking-[0.2em] group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-1 bg-yellow-400 rounded-full"></div>
                        <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                            Ticket <span className="text-yellow-400">#{ticket.id}</span>
                        </h1>
                    </div>
                </div>
                <div className={`px-6 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 ${ticket.status === 'open' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' : 'bg-gray-900 text-gray-500 border-gray-800'
                    }`}>
                    Statut: {ticket.status === 'open' ? 'En attente' : 'Résolu'}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-gray-900/40 p-8 rounded-[3rem] border border-gray-800 backdrop-blur-3xl space-y-4 text-sm font-bold">
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest">Sujet</p>
                        <p className="text-white">{ticket.subject}</p>
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest pt-4">Priorité</p>
                        <div className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black rounded-lg w-fit">{ticket.priority.toUpperCase()}</div>
                    </div>
                </div>

                <div className="lg:col-span-2 flex flex-col h-[600px] bg-gray-900/30 rounded-[3.5rem] border border-gray-800 backdrop-blur-3xl overflow-hidden shadow-2xl">
                    <div className="px-8 py-6 border-b border-gray-800 bg-gray-950/20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <MessageSquare className="w-5 h-5 text-yellow-400" />
                            <h4 className="text-white font-black uppercase text-sm">Conversation</h4>
                        </div>
                        {uploading && <span className="text-xs text-yellow-400 animate-pulse">Envoi des fichiers...</span>}
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        {/* Initial Description */}
                        <div className="flex gap-5 group items-start">
                            <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center text-yellow-400/50 flex-shrink-0 border border-white/5 shadow-xl group-hover:border-yellow-400/30 transition-all duration-500">
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
                                <span className="text-[10px] font-bold text-gray-600 ml-2 uppercase tracking-widest">{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>

                        {/* Messages */}
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
                                        ? 'bg-yellow-400/10 border-yellow-400/30 text-white rounded-tr-none'
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
                                                            ? 'bg-yellow-400/20 border-yellow-400/30 hover:bg-yellow-400/30'
                                                            : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}
                                                    >
                                                        {att.type?.startsWith('image/') ? (
                                                            <div className="w-8 h-8 rounded-lg overflow-hidden relative">
                                                                <Image src={att.url} alt={att.name} fill className="object-cover" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8 flex items-center justify-center">📎</div>
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

                        {/* Typing Indicator */}
                        {otheruserTyping && (
                            <div className="flex gap-5 items-center animate-pulse">
                                <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 border border-yellow-400/50 flex items-center justify-center">
                                    <Image src="/logo.svg" alt="Support" width={30} height={30} className="object-contain opacity-50" />
                                </div>
                                <span className="text-xs text-yellow-400 font-bold uppercase tracking-widest">Mato's écrit...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-6 bg-gray-950/40 border-t border-gray-800">
                        {/* Attachments Preview */}
                        {attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4 px-2">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="relative group p-2 bg-gray-800 rounded-xl border border-gray-700 flex items-center gap-2">
                                        <span className="text-xs text-white max-w-[100px] truncate">{file.name}</span>
                                        <button
                                            onClick={() => removeAttachment(idx)}
                                            className="p-1 hover:bg-red-500/20 text-red-500 rounded-full transition"
                                        >
                                            <Loader2 size={12} className="rotate-45" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
                            <div className="relative flex-1 group">
                                <input
                                    type="text"
                                    placeholder="Répondre... (Ctrl+V pour coller une image)"
                                    value={newMessage}
                                    onChange={(e) => {
                                        setNewMessage(e.target.value);
                                        handleTyping();
                                    }}
                                    onPaste={handlePaste}
                                    className="w-full bg-gray-900/50 border-2 border-gray-800 text-white pl-8 pr-24 py-5 rounded-[2rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm group-hover:border-gray-700"
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
                                className="w-14 h-14 bg-yellow-400 text-gray-900 rounded-[2rem] flex items-center justify-center transition-all disabled:opacity-50 hover:scale-105 active:scale-95 shadow-lg shadow-yellow-400/20"
                            >
                                {sending || uploading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
