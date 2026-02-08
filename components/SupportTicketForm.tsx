'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Loader2, AlertCircle, Package, Target, MessageSquare, Paperclip, X, FileIcon, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SupportTicketFormProps {
    initialSubject?: string;
    initialDescription?: string;
    initialOrderId?: string;
    initialPriority?: string;
    initialModule?: string;
    onSuccess?: (ticketId: number) => void;
    onCancel?: () => void;
    isModal?: boolean;
}

export default function SupportTicketForm({
    initialSubject = '',
    initialDescription = '',
    initialOrderId = '',
    initialPriority = 'medium',
    initialModule = 'general',
    onSuccess,
    onCancel,
    isModal = false
}: SupportTicketFormProps) {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        subject: initialSubject,
        description: initialDescription,
        orderId: initialOrderId,
        priority: initialPriority,
        module: initialModule
    });
    const [loading, setLoading] = useState(false);
    const [fetchingOrders, setFetchingOrders] = useState(true);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch('/api/user/orders?limit=10')
            .then(res => res.json())
            .then(data => {
                if (data.success) setOrders(data.orders);
                setFetchingOrders(false);
            })
            .catch(() => setFetchingOrders(false));
    }, []);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let uploadedAttachments: any[] = [];
            if (attachments.length > 0) {
                uploadedAttachments = await uploadFiles();
            }

            const res = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, attachments: uploadedAttachments })
            });
            const data = await res.json();
            if (data.success) {
                if (onSuccess) onSuccess(data.ticket.id);
                else router.push(`/account/tickets/${data.ticket.id}`);
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Erreur lors de la création');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8" onPaste={handlePaste}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1 italic flex items-center gap-2">
                        <MessageSquare size={12} className="text-yellow-400" />
                        Module de Service
                    </label>
                    <select
                        value={formData.module}
                        onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                        className="w-full bg-white/[0.03] border border-white/10 text-white px-6 py-4 rounded-xl font-bold focus:border-yellow-400/50 outline-none transition-all appearance-none cursor-pointer text-sm"
                    >
                        <option value="general">GÉNÉRAL</option>
                        <option value="orders">COMMANDES</option>
                        <option value="cart">PANIER</option>
                        <option value="loyalty">FIDÉLITÉ</option>
                        <option value="account">COMPTE</option>
                        <option value="notifications">NOTIFICATIONS</option>
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1 italic flex items-center gap-2">
                        <AlertCircle size={12} className="text-yellow-400" />
                        Niveau de Priorité
                    </label>
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full bg-white/[0.03] border border-white/10 text-white px-6 py-4 rounded-xl font-bold focus:border-yellow-400/50 outline-none transition-all appearance-none cursor-pointer text-sm"
                    >
                        <option value="low">PROCÉDURE FAIBLE</option>
                        <option value="medium">ALERTE STANDARD</option>
                        <option value="high">ALERTE CRITIQUE</option>
                        <option value="urgent">URGENCE ABSOLUE</option>
                    </select>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1 italic flex items-center gap-2">
                    <Target size={12} className="text-yellow-400" />
                    Sujet de la demande
                </label>
                <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 text-white px-6 py-4 rounded-xl font-bold focus:border-yellow-400/50 outline-none transition-all placeholder:text-gray-700 text-sm"
                    placeholder="Objet du signal..."
                />
            </div>

            {formData.module === 'orders' && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                >
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1 italic flex items-center gap-2">
                        <Package size={12} className="text-yellow-400" />
                        Commande Concernée
                    </label>
                    <select
                        value={formData.orderId}
                        onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                        className="w-full bg-white/[0.03] border border-white/10 text-white px-6 py-4 rounded-xl font-bold focus:border-yellow-400/50 outline-none transition-all appearance-none cursor-pointer text-sm"
                    >
                        <option value="">SÉLECTIONNER UNE COMMANDE</option>
                        {orders.map(order => (
                            <option key={order.id} value={order.id}>COMMANDE #{order.orderNumber} • {order.finalTotal} DT</option>
                        ))}
                    </select>
                </motion.div>
            )}

            <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1 italic flex items-center gap-2">
                    <MessageSquare size={12} className="text-yellow-400" />
                    Description du Problème
                </label>
                <div className="relative">
                    <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={isModal ? 4 : 6}
                        className="w-full bg-white/[0.03] border border-white/10 text-white px-6 py-5 rounded-2xl font-bold focus:border-yellow-400/50 outline-none transition-all resize-none placeholder:text-gray-700 leading-relaxed text-sm"
                        placeholder="Expliquez-nous la situation... (Collez vos images ici)"
                    />
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            multiple
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-10 h-10 bg-white/5 hover:bg-yellow-400 hover:text-black rounded-xl flex items-center justify-center border border-white/10 transition-all group/btn"
                        >
                            <Paperclip size={16} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Attachments Preview */}
                <AnimatePresence mode="popLayout">
                    {attachments.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-wrap gap-3 pt-2"
                        >
                            {attachments.map((file, idx) => (
                                <div key={idx} className="group relative">
                                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center">
                                        {file.type.startsWith('image/') ? (
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="preview"
                                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                            />
                                        ) : (
                                            <FileIcon className="text-gray-600 w-6 h-6" />
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeAttachment(idx)}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex gap-4 pt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all text-[10px] italic"
                    >
                        Annuler
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-[2] bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-800 text-gray-900 py-4 rounded-xl font-[1000] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 italic group shadow-lg shadow-yellow-400/10 text-[11px]"
                >
                    {loading || uploading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            {uploading ? 'TRANSFERT...' : 'ENVOI...'}
                        </>
                    ) : (
                        <>
                            <Send size={16} strokeWidth={3} />
                            Envoyer la Demande
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
