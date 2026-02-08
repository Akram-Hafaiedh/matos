'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Mail,
    Send,
    Clock,
    Search,
    Trash2,
    Type,
    User,
    ChevronRight,
    Loader2,
    PenTool,
    Inbox,
    RefreshCw,
    Paperclip,
    Activity
} from 'lucide-react';
import { useToast } from '@/app/context/ToastContext';
import TacticalAura from '@/components/TacticalAura';
import { motion, AnimatePresence } from 'framer-motion';

interface SentEmail {
    id: number;
    to: string;
    subject: string;
    content: string;
    status: string;
    created_at: string;
}

function EmailManagementContent() {
    const searchParams = useSearchParams();
    const view = searchParams.get('view');
    const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'history' | 'compose'>('history');
    const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(null);

    const [formData, setFormData] = useState({
        to: '',
        subject: '',
        content: ''
    });

    const { toast } = useToast();

    useEffect(() => {
        if (view === 'compose') setActiveTab('compose');
        else setActiveTab('history');
    }, [view]);

    useEffect(() => {
        fetchSentEmails();
    }, []);

    const fetchSentEmails = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/email/sent');
            const data = await res.json();
            if (Array.isArray(data)) setSentEmails(data);
        } catch (error) {
            console.error('Error fetching sent emails:', error);
            toast.error('Erreur lors du chargement de l\'historique');
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            const res = await fetch('/api/admin/email/sent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Email envoyé avec succès');
                setSentEmails([data, ...sentEmails]);
                setFormData({ to: '', subject: '', content: '' });
                // We don't automatically switch back to history here to allow user to see success or depends on UX
                // But usually we go back to history
                window.history.pushState({}, '', '/dashboard/email');
                setActiveTab('history');
            } else {
                toast.error(data.error || 'Échec de l\'envoi');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            toast.error('Erreur de connexion');
        } finally {
            setSending(false);
        }
    };

    const filteredSent = sentEmails.filter(e =>
        e.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full pb-20 space-y-12 animate-in fade-in duration-700">
            <div className="grid lg:grid-cols-12 gap-10 text-left">
                {activeTab === 'history' ? (
                    <>
                        {/* List Pane */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 w-4 h-4 group-focus-within:text-yellow-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Filtrer l'historique..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-black/40 border border-white/5 text-white pl-14 pr-8 py-5 rounded-2xl font-bold focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest placeholder:text-gray-800"
                                />
                            </div>

                            <div className="bg-white/[0.01] rounded-[3rem] border border-white/5 backdrop-blur-3xl overflow-hidden shadow-3xl max-h-[60vh] overflow-y-auto custom-scrollbar">
                                {loading ? (
                                    <div className="py-20 flex flex-col items-center gap-4">
                                        <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Synchronisation...</span>
                                    </div>
                                ) : filteredSent.length === 0 ? (
                                    <div className="py-20 text-center text-gray-600 text-[10px] font-black uppercase tracking-widest italic">Aucun enregistrement</div>
                                ) : (
                                    <div className="divide-y divide-white/[0.03]">
                                        {filteredSent.map((msg) => (
                                            <button
                                                key={msg.id}
                                                onClick={() => setSelectedEmail(msg)}
                                                className={`w-full text-left p-8 transition-all hover:bg-white/[0.02] flex items-center gap-6 group ${selectedEmail?.id === msg.id ? 'bg-white/[0.03] border-l-4 border-yellow-400' : 'border-l-4 border-transparent'}`}
                                            >
                                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-yellow-400/10 group-hover:text-yellow-400 transition-all">
                                                    <Send size={18} />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex justify-between items-start">
                                                        <div className="font-[1000] text-sm uppercase tracking-tighter text-white group-hover:text-yellow-400 transition-colors truncate max-w-[150px]">
                                                            {msg.to}
                                                        </div>
                                                        <div className="text-[8px] font-black text-gray-600 uppercase tracking-widest">
                                                            {new Date(msg.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">
                                                        {msg.subject}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Pane */}
                        <div className="lg:col-span-7">
                            <AnimatePresence mode="wait">
                                {selectedEmail ? (
                                    <motion.div
                                        key={selectedEmail.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-white/[0.02] rounded-[4rem] border border-white/10 p-12 space-y-10 relative overflow-hidden group shadow-3xl h-full"
                                    >
                                        <TacticalAura />
                                        <div className="relative z-10 space-y-8">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-yellow-400/10 rounded-3xl flex items-center justify-center text-yellow-400 border border-yellow-400/20">
                                                        <User size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest italic mb-1">Destinataire</p>
                                                        <h2 className="text-2xl font-[1000] text-white uppercase italic tracking-tighter">{selectedEmail.to}</h2>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest italic mb-1">Horodatage</p>
                                                    <div className="text-[10px] font-black text-white bg-white/5 px-4 py-2 rounded-xl border border-white/5 uppercase tracking-widest">
                                                        {new Date(selectedEmail.created_at).toLocaleString('fr-FR')}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                                                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest italic mb-2">Objet du signal</p>
                                                <h3 className="text-lg font-[1000] text-yellow-400 uppercase italic tracking-tighter leading-none">{selectedEmail.subject}</h3>
                                            </div>

                                            <div className="bg-black/40 p-10 rounded-[3rem] border border-white/5 min-h-[300px] relative group/msg shadow-inner">
                                                <p className="text-gray-400 text-lg font-bold leading-relaxed uppercase tracking-wider whitespace-pre-wrap relative z-10 text-left">
                                                    {selectedEmail.content}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 bg-white/[0.01] rounded-[4rem] border border-white/5 border-dashed relative overflow-hidden p-20">
                                        <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center text-gray-800 border border-white/5">
                                            <Inbox size={40} strokeWidth={1} />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-3xl font-[1000] text-gray-700 uppercase italic tracking-tighter">Archives Scellées</h3>
                                            <p className="text-gray-800 font-bold uppercase text-[10px] tracking-[0.5em] italic">Sélectionnez une transmission pour consulter son contenu</p>
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-12"
                    >
                        <div className="bg-white/[0.02] rounded-[4rem] border border-white/10 p-16 space-y-12 relative overflow-hidden group shadow-3xl">
                            <TacticalAura />

                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-16 h-16 bg-yellow-400 rounded-[2rem] flex items-center justify-center text-black shadow-2xl">
                                    <PenTool size={28} />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-[1000] text-white uppercase italic tracking-tighter leading-none">Nouveau Message</h2>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic border-l border-yellow-400/30 pl-4 mt-2">Rédaction d'un signal sécurisé</p>
                                </div>
                            </div>

                            <form onSubmit={handleSend} className="space-y-10 relative z-10">
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Destinataire (Email)</label>
                                        <div className="relative">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                            <input
                                                type="email"
                                                required
                                                value={formData.to}
                                                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 pl-14 pr-6 py-6 rounded-2xl text-white font-bold focus:outline-none focus:border-yellow-400 transition-all text-sm"
                                                placeholder="client@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Objet du message</label>
                                        <div className="relative">
                                            <Type className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 pl-14 pr-6 py-6 rounded-2xl text-white font-bold focus:outline-none focus:border-yellow-400 transition-all text-sm italic uppercase tracking-wider"
                                                placeholder="IMPORTANT: VOTRE COMMANDE MATO'S"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 text-left">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Contenu du signal</label>
                                    <textarea
                                        required
                                        rows={12}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 p-10 rounded-[3rem] text-white font-bold focus:outline-none focus:border-yellow-400 transition-all text-lg leading-relaxed resize-none text-left"
                                        placeholder="Rédigez votre message ici..."
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row gap-6 pt-4">
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="flex-1 bg-yellow-400 hover:bg-white text-black py-8 rounded-3xl font-[1000] uppercase text-xs tracking-[0.4em] transition-all transform hover:scale-[1.01] shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50"
                                    >
                                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={20} />}
                                        Transmettre le Signal
                                    </button>
                                    <button
                                        type="button"
                                        className="px-12 py-8 bg-white/5 border border-white/10 text-gray-500 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        Brouillon
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default function EmailManagementPage() {
    return (
        <Suspense fallback={
            <div className="py-40 flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Chargement du Terminal...</span>
            </div>
        }>
            <EmailManagementContent />
        </Suspense>
    );
}
