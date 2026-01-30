'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, ArrowLeft, Clock, Package, User, Loader2, AlertCircle, Calendar, MessageSquare, UtensilsCrossed, Paperclip, ChevronRight, CheckCircle2, ChevronLeft } from 'lucide-react';
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
    user?: { name: string; image: string | null; } | null;
    order?: { orderNumber: string; totalAmount: number; status: string; } | null;
    lastAdminTypingAt?: string;
    lastUserTypingAt?: string;
}

export default function AccountTicketDetailsPage() {
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchTicket = async (isPolling = false) => {
        try {
            const res = await fetch(`/api/support/${id}`);
            const data = await res.json();
            if (data.success) {
                const t = data.ticket;

                // Typing logic
                if (t.lastAdminTypingAt) {
                    const lastType = new Date(t.lastAdminTypingAt).getTime();
                    const now = new Date().getTime();
                    setOtherUserTyping(now - lastType < 5000);
                } else {
                    setOtherUserTyping(false);
                }

                setTicket(prev => {
                    if (!prev) return t;
                    // Only update if there are new messages or status change
                    if (JSON.stringify(prev.messages) !== JSON.stringify(t.messages) || prev.status !== t.status) {
                        return t;
                    }
                    return prev;
                });
            } else if (!isPolling) {
                router.push('/account/tickets');
            }
        } catch (error) {
            console.error('Error fetching ticket:', error);
        } finally {
            if (!isPolling) setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;

        fetchTicket();

        let interval: NodeJS.Timeout;

        // Only start polling if we don't have a ticket yet OR if it's open
        if (!ticket || ticket.status === 'open') {
            interval = setInterval(() => {
                fetchTicket(true);
            }, 3000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [id, ticket?.status]);

    useEffect(() => {
        scrollToBottom();
    }, [ticket?.messages, otheruserTyping]);

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
            const validFiles = newFiles.filter(file => file.size <= 5 * 1024 * 1024);
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
                setNewMessage('');
                setAttachments([]);
                fetchTicket(true);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
                <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px]">Chargement de la conversation...</p>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="text-center py-20 bg-gray-900/30 rounded-[3rem] border border-gray-800 backdrop-blur-xl">
                <AlertCircle className="w-16 h-16 text-red-500/50 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-white italic uppercase mb-2">Ticket introuvable</h3>
                <p className="text-gray-500 font-bold mb-8">Ce ticket n'existe pas ou vous n'avez pas l'autorisation d'y accéder.</p>
                <Link href="/account/tickets" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-gray-800 hover:border-yellow-400/50 transition-all">
                    <ChevronLeft className="w-4 h-4" /> Retour à la liste
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
            {/* Header / Navigation */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="text-left">
                    <Link href="/account/tickets" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-4 transition-colors font-bold uppercase text-[10px] tracking-[0.2em] group">
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        Retour / Tickets
                    </Link>
                    <div className="flex items-center gap-4">
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                            Ticket <span className="text-yellow-400">#{ticket.id}</span>
                        </h2>
                    </div>
                </div>

                <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-2xl ${ticket.status === 'open'
                    ? 'bg-yellow-400 text-gray-900 border-yellow-400/50 shadow-yellow-400/10'
                    : 'bg-gray-900 text-gray-500 border-gray-800'
                    }`}>
                    {ticket.status === 'open' ? 'En cours de traitement' : 'Résolu'}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Content: Conversation */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Description Section */}
                    <div className="bg-gray-900/40 p-10 rounded-[3rem] border border-gray-800 backdrop-blur-3xl relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>

                        <div className="space-y-6 relative z-10 text-left">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <UserAvatar name={ticket.user?.name || 'U'} image={ticket.user?.image} size="md" className="border-2 border-gray-800 shadow-xl" />
                                    <div>
                                        <p className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-0.5">{ticket.user?.name}</p>
                                        <h3 className="text-2xl font-black text-yellow-400 uppercase italic tracking-tight leading-none">{ticket.subject}</h3>
                                    </div>
                                </div>
                                <p className="text-gray-500 font-bold text-[9px] uppercase tracking-widest">{new Date(ticket.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className="bg-gray-950/50 p-8 rounded-[2rem] border border-gray-800 text-gray-300 text-sm leading-relaxed font-bold">
                                <p className="font-bold mb-2 text-yellow-400/80 uppercase text-[10px] tracking-widest">Message initial</p>
                                {ticket.description}
                            </div>
                        </div>
                    </div>

                    {/* Conversation area - RESTORED STYLE */}
                    <div className="bg-gray-900/30 rounded-[3.5rem] border border-gray-800 backdrop-blur-3xl overflow-hidden flex flex-col h-[600px] shadow-2xl">
                        <div className="px-8 py-6 border-b border-gray-800 bg-gray-950/20 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <MessageSquare className="w-5 h-5 text-yellow-400" />
                                <h4 className="text-white font-black uppercase text-sm">Conversation</h4>
                            </div>
                            {uploading && <span className="text-[10px] text-yellow-400 animate-pulse font-black uppercase">Envoi...</span>}
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {ticket.messages.length === 0 ? (
                                <div className="text-center py-20 opacity-20">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Aucune réponse pour le moment</p>
                                </div>
                            ) : (
                                ticket.messages.map((msg) => (
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
                                                <UserAvatar image={msg.user.image} name={msg.user.name} size="lg" className="w-full h-full text-white" textClassName="text-lg" />
                                            )}
                                        </div>
                                        <div className={`space-y-2 max-w-[85%] ${msg.isAdmin ? 'items-end flex flex-col' : ''}`}>
                                            <div className={`p-6 rounded-[2.5rem] border shadow-lg backdrop-blur-sm ${msg.isAdmin
                                                ? 'bg-yellow-400/10 border-yellow-400/30 text-white rounded-tr-none'
                                                : 'bg-gray-950 border-gray-800 text-white rounded-tl-none'
                                                }`}>
                                                {msg.message && <p className="font-bold text-sm leading-relaxed text-left">{msg.message}</p>}

                                                {/* Attachments rendering */}
                                                {msg.attachments && Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                        {msg.attachments.map((att: any, idx: number) => (
                                                            <a
                                                                key={idx}
                                                                href={att.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${msg.isAdmin ? 'bg-yellow-400/20 border-yellow-400/30 hover:bg-yellow-400/40' : 'bg-gray-900 border-gray-800 hover:border-gray-700'}`}
                                                            >
                                                                {att.type?.startsWith('image/') ? (
                                                                    <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-white/10">
                                                                        <Image src={att.url} alt={att.name} fill className="object-cover" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-10 h-10 bg-gray-950 rounded-xl flex items-center justify-center text-xl">📎</div>
                                                                )}
                                                                <div className="flex flex-col text-left">
                                                                    <span className="text-[10px] font-black uppercase truncate max-w-[120px]">{att.name}</span>
                                                                    <span className="text-[8px] font-bold text-gray-500 uppercase">Fichier</span>
                                                                </div>
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`text-[10px] font-bold text-gray-600 uppercase tracking-widest ${msg.isAdmin ? 'mr-4' : 'ml-4'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}

                            {/* Typing Indicator */}
                            {otheruserTyping && (
                                <div className="flex gap-5 items-center animate-pulse">
                                    <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 border border-yellow-400/50 flex items-center justify-center">
                                        <Image src="/logo.svg" alt="Support" width={30} height={30} className="object-contain opacity-50" />
                                    </div>
                                    <span className="text-[10px] text-yellow-400 font-black uppercase tracking-widest">Mato's écrit...</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Reply Form - RESTORED STYLE */}
                        <div className="p-6 bg-gray-950/40 border-t border-gray-800 relative">
                            {ticket.status !== 'open' && (
                                <div className="absolute inset-0 bg-green-500/10 backdrop-blur-md flex items-center justify-center z-20 animate-in fade-in duration-500">
                                    <div className="flex items-center gap-4 px-10 py-5 bg-gray-950/90 border-2 border-green-500/30 rounded-[2rem] shadow-[0_0_50px_-12px_rgba(34,197,94,0.3)]">
                                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                                        </div>
                                        <p className="text-green-400 font-black uppercase tracking-widest text-[10px] italic leading-tight max-w-[280px]">
                                            Cette conversation est clôturée car le ticket a été marqué comme résolu.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4 px-2">
                                    {attachments.map((file, idx) => (
                                        <div key={idx} className="relative group p-2.5 bg-gray-800 rounded-xl border border-gray-700 flex items-center gap-3">
                                            <span className="text-[10px] font-black text-white max-w-[120px] truncate uppercase">{file.name}</span>
                                            <button onClick={() => removeAttachment(idx)} className="p-1 hover:bg-red-500/20 text-red-500 rounded-full transition-colors">
                                                <Loader2 size={12} className="rotate-45" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <form onSubmit={handleSendMessage} className="relative flex items-center gap-4">
                                <div className="relative flex-1 group">
                                    <input
                                        type="text"
                                        placeholder="Votre message... (Ctrl+V pour une image)"
                                        value={newMessage}
                                        onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
                                        onPaste={handlePaste}
                                        className="w-full bg-gray-900 border-2 border-gray-800 text-white pl-8 pr-24 py-5 rounded-[2rem] font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-sm group-hover:border-gray-700"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileSelect} />
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 hover:bg-gray-800 text-gray-500 hover:text-white rounded-xl transition-all">
                                            <Paperclip size={20} />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={(!newMessage.trim() && attachments.length === 0) || sending || uploading}
                                    className="w-14 h-14 bg-yellow-400 text-gray-900 rounded-[2rem] flex items-center justify-center transition-all disabled:opacity-50 hover:scale-110 active:scale-95 shadow-xl shadow-yellow-400/20"
                                >
                                    {sending || uploading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Metadata */}
                <div className="space-y-8">
                    <div className="bg-gray-900/60 p-8 rounded-[3rem] border border-gray-800 backdrop-blur-xl space-y-6 text-left shadow-2xl">
                        <div className="flex items-center gap-4 border-b border-gray-800/50 pb-6">
                            <div className="w-12 h-12 bg-gray-950 rounded-2xl flex items-center justify-center border border-gray-800 shadow-lg">
                                <Clock className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Mise à jour</p>
                                <p className="text-sm font-black text-white italic">Récemment</p>
                            </div>
                        </div>

                        {ticket.order && (
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Commande associée</p>
                                <Link
                                    href={`/account/orders/${ticket.order.orderNumber}`}
                                    className="block p-6 bg-gray-950 rounded-[2rem] border border-gray-800 hover:border-yellow-400/50 transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-4 h-4 text-yellow-400" />
                                            <span className="text-xs font-black text-white uppercase italic">#{ticket.order.orderNumber}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{ticket.order.status}</span>
                                        <span className="text-xs font-black text-white italic">{ticket.order.totalAmount} DT</span>
                                    </div>
                                </Link>
                            </div>
                        )}

                        <div className="p-6 bg-yellow-400/5 border border-yellow-400/10 rounded-[2rem] space-y-3">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-4 h-4 text-yellow-400" />
                                <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] italic">Information</span>
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-widest">
                                Nos experts support sont disponibles pour toute assistance prioritaire de 12h à 23h.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
