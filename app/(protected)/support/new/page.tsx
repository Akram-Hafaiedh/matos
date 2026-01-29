'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LifeBuoy, Send, ArrowLeft, Loader2, AlertCircle, Package, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function NewTicketPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [formData, setFormData] = useState({ subject: '', description: '', orderId: '', priority: 'medium' });
    const [loading, setLoading] = useState(false);
    const [fetchingOrders, setFetchingOrders] = useState(true);

    useEffect(() => {
        fetch('/api/user/orders?limit=5').then(res => res.json()).then(data => {
            if (data.success) setOrders(data.orders);
            setFetchingOrders(false);
        }).catch(() => setFetchingOrders(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) router.push(`/support/${data.ticket.id}`);
            else alert(data.error);
        } catch (error) { alert('Erreur lors de la création'); } finally { setLoading(false); }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 shadow-2xl bg-gray-900/10 rounded-[4rem] border border-white/5 my-12">
            <Link href="/account" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition font-black uppercase text-xs tracking-[0.2em] mb-12 group px-8">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour
            </Link>

            <div className="space-y-12 px-8">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-1 bg-yellow-400 rounded-full"></div>
                    <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                        Ouvrir un <br /> <span className="text-yellow-400">Nouveau Ticket.</span>
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 pb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Sujet de la demande</label>
                            <input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-gray-900/50 border-2 border-gray-800 text-white px-6 py-4 rounded-2xl font-bold focus:border-yellow-400/50 outline-none transition-all" placeholder="Ex: Problème de livraison..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Priorité</label>
                            <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full bg-gray-900/50 border-2 border-gray-800 text-white px-6 py-4 rounded-2xl font-bold focus:border-yellow-400/50 outline-none transition-all appearance-none">
                                <option value="low">Faible</option>
                                <option value="medium">Moyenne</option>
                                <option value="high">Haute</option>
                                <option value="urgent">Urgent 🚩</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Commande concernée (Optionnel)</label>
                        <select value={formData.orderId} onChange={(e) => setFormData({ ...formData, orderId: e.target.value })} className="w-full bg-gray-900/50 border-2 border-gray-800 text-white px-6 py-4 rounded-2xl font-bold focus:border-yellow-400/50 outline-none transition-all appearance-none">
                            <option value="">Aucune commande spécifique</option>
                            {orders.map(order => (
                                <option key={order.id} value={order.id}>Commande #{order.orderNumber} - {order.totalAmount} DT</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Message détaillé</label>
                        <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={6} className="w-full bg-gray-900/50 border-2 border-gray-800 text-white px-6 py-4 rounded-[2rem] font-bold focus:border-yellow-400/50 outline-none transition-all resize-none" placeholder="Expliquez-nous votre situation..." />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-800 text-gray-900 py-5 rounded-[2rem] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                        {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />} Envoyer la demande
                    </button>
                </form>
            </div>
        </div>
    );
}
