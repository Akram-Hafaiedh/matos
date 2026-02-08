'use client';

import { useEffect, useState } from 'react';
import {
    Mail,
    Search,
    Trash2,
    CheckCircle,
    XCircle,
    MessageSquare,
    User,
    Phone,
    Clock,
    Tag,
    ChevronRight,
    Loader2,
    MailOpen
} from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';
import TacticalAura from '@/components/TacticalAura';
import { motion, AnimatePresence } from 'framer-motion';
import UserAvatar from '@/components/UserAvatar';

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    status: string;
    created_at: string;
}

export default function ContactMessagesManagement() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/messages');
            const data = await res.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Erreur lors du chargement des messages');
        } finally {
            setLoading(false);
        }
    };

    const updateMessageStatus = async (id: number, status: string) => {
        try {
            const res = await fetch('/api/admin/messages', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) {
                setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
                if (selectedMessage?.id === id) {
                    setSelectedMessage({ ...selectedMessage, status });
                }
                toast.success('Statut mis à jour');
            }
        } catch (error) {
            console.error('Error updating message:', error);
            toast.error('Erreur de mise à jour');
        }
    };

    const deleteMessage = async (id: number) => {
        if (!confirm('Voulez-vous vraiment supprimer ce message ?')) return;
        try {
            const res = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessages(messages.filter(m => m.id !== id));
                if (selectedMessage?.id === id) setSelectedMessage(null);
                toast.success('Message supprimé');
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Erreur de suppression');
        }
    };

    const filteredMessages = messages.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full pb-20 space-y-12 animate-in fade-in duration-700">
            {/* Local Controls Area */}
            <div className="flex justify-end items-center">
                <div className="relative group w-full xl:w-96">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-700 w-5 h-5 group-focus-within:text-yellow-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Intercepter un message..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 text-white pl-16 pr-8 py-6 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest placeholder:text-gray-800"
                    />
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* List Pane */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white/[0.01] rounded-[3rem] border border-white/5 backdrop-blur-3xl overflow-hidden shadow-3xl max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center gap-4">
                                <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Chargement...</span>
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="py-20 text-center text-gray-600 text-[10px] font-black uppercase tracking-widest italic">Aucun message trouvé</div>
                        ) : (
                            <div className="divide-y divide-white/[0.03]">
                                {filteredMessages.map((msg) => (
                                    <button
                                        key={msg.id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className={`w-full text-left p-8 transition-all hover:bg-white/[0.02] flex items-center gap-6 group ${selectedMessage?.id === msg.id ? 'bg-white/[0.03] border-l-4 border-yellow-400' : 'border-l-4 border-transparent'}`}
                                    >
                                        <UserAvatar
                                            name={msg.name}
                                            size="sm"
                                            className={msg.status === 'unread' ? 'border-yellow-400' : 'border-white/5'}
                                        />
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <div className="font-[1000] text-sm uppercase tracking-tighter text-white group-hover:text-yellow-400 transition-colors">
                                                    {msg.name}
                                                </div>
                                                <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest">
                                                    {new Date(msg.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate max-w-[200px]">
                                                {msg.subject}
                                            </div>
                                        </div>
                                        {msg.status === 'unread' && (
                                            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Pane */}
                <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                        {selectedMessage ? (
                            <motion.div
                                key={selectedMessage.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white/[0.02] rounded-[4rem] border border-white/10 p-16 space-y-12 relative overflow-hidden group shadow-3xl h-full"
                            >
                                <TacticalAura />

                                <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-6">
                                            <UserAvatar
                                                name={selectedMessage.name}
                                                size="xl"
                                                className="border-yellow-400/20"
                                            />
                                            <div>
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic mb-1">Source de Transmission</p>
                                                <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter leading-none">{selectedMessage.name}</h2>
                                                <div className="flex items-center gap-4 text-[10px] font-black text-yellow-400/60 uppercase tracking-widest mt-2 italic">
                                                    <Mail size={12} className="text-yellow-400" />
                                                    {selectedMessage.email}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <button
                                            onClick={() => updateMessageStatus(selectedMessage.id, selectedMessage.status === 'unread' ? 'read' : 'unread')}
                                            className={`flex items-center gap-4 px-8 py-4 rounded-2xl font-[1000] text-[10px] uppercase tracking-[0.2em] transition-all ${selectedMessage.status === 'read' ? 'bg-white/5 text-gray-400 border border-white/5 hover:border-yellow-400/30' : 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'}`}
                                        >
                                            {selectedMessage.status === 'unread' ? <MailOpen size={16} /> : <Mail size={16} />}
                                            {selectedMessage.status === 'unread' ? 'Marquer comme lu' : 'Marquer comme non lu'}
                                        </button>
                                        <button
                                            onClick={() => deleteMessage(selectedMessage.id)}
                                            className="p-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5 group/del"
                                        >
                                            <Trash2 size={18} className="group-hover/del:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                    <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 space-y-3">
                                        <div className="flex items-center gap-3 text-[10px] font-black text-gray-600 uppercase tracking-widest italic">
                                            <Tag size={12} className="text-yellow-400/50" />
                                            Sujet du signal
                                        </div>
                                        <div className="text-xl font-[1000] text-white uppercase tracking-tighter italic leading-tight">{selectedMessage.subject}</div>
                                    </div>
                                    {selectedMessage.phone && (
                                        <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 space-y-3">
                                            <div className="flex items-center gap-3 text-[10px] font-black text-gray-600 uppercase tracking-widest italic">
                                                <Phone size={12} className="text-yellow-400/50" />
                                                Ligne Directe
                                            </div>
                                            <div className="text-xl font-[1000] text-white uppercase tracking-tighter italic leading-tight">{selectedMessage.phone}</div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-black/40 p-12 rounded-[3.5rem] border border-white/5 min-h-[350px] relative z-10 group/msg shadow-inner">
                                    <div className="absolute top-10 left-10">
                                        <MessageSquare size={50} strokeWidth={1} className="text-white/[0.02] group-hover/msg:text-yellow-400/5 transition-colors duration-1000" />
                                    </div>
                                    <p className="text-gray-400 text-lg font-bold leading-relaxed uppercase tracking-wider whitespace-pre-wrap relative z-10">
                                        {selectedMessage.message}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center text-[10px] font-black text-gray-700 uppercase tracking-[0.3em] italic relative z-10 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Clock size={14} className="text-yellow-400" />
                                        Transmission interceptée le {new Date(selectedMessage.created_at).toLocaleString('fr-FR')}
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                                        <div className={`w-2 h-2 rounded-full ${selectedMessage.status === 'unread' ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
                                        {selectedMessage.status === 'unread' ? 'Signal Brut' : 'Signal Décodé'}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 bg-white/[0.01] rounded-[4rem] border border-white/5 border-dashed relative overflow-hidden">
                                <div className="absolute inset-0 bg-yellow-400/[0.01] blur-[100px]"></div>
                                <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-gray-800 border border-white/5">
                                    <Mail size={40} strokeWidth={1} />
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <h3 className="text-3xl font-[1000] text-gray-700 uppercase italic tracking-tighter">Attente de Transmission</h3>
                                    <p className="text-gray-800 font-bold uppercase text-[10px] tracking-[0.5em] italic">Sélectionnez un signal pour décoder son contenu</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
