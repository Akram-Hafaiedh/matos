// app/(public)/support/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    LifeBuoy,
    Send,
    MessageSquare,
    AlertCircle,
    CheckCircle2,
    Package,
    Phone,
    Mail,
    Clock,
    Loader2,
    Sparkles,
    ShieldCheck,
    MessageCircle,
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
    const { data: session, status: authStatus } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        orderId: '',
        priority: 'medium'
    });

    const isGuest = authStatus === 'unauthenticated';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isGuest) {
            router.push('/contact');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success) {
                setSuccess(true);
                setFormData({
                    subject: '',
                    description: '',
                    orderId: '',
                    priority: 'medium'
                });
            } else {
                alert(data.error || 'Erreur lors de la soumission');
            }
        } catch (error) {
            console.error('Support submission error:', error);
            alert('Erreur serveur. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    if (authStatus === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-24 px-4 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] -mr-64 -mt-64 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] -ml-64 -mb-64 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto space-y-24 relative z-10">
                {/* Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-sm font-black uppercase tracking-widest animate-fade-in">
                        <LifeBuoy className="w-4 h-4" />
                        Centre d'Assistance
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none animate-slide-up">
                        Besoin d'<span className="text-yellow-400">Aide ?</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-bold animate-fade-in delay-200">
                        Notre support client dédié est là pour répondre à toutes vos questions et résoudre vos problèmes en un temps record.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Card */}
                        <div className={`p-8 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:scale-[1.02] ${isGuest ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white' : 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900'}`}>
                            <div className="flex items-center justify-between mb-8">
                                <div className={`p-3 rounded-2xl ${isGuest ? 'bg-white/10' : 'bg-black/10'}`}>
                                    {isGuest ? <ShieldCheck className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
                                </div>
                                <Clock className={`w-6 h-6 ${isGuest ? 'opacity-40' : 'opacity-40'}`} />
                            </div>

                            {isGuest ? (
                                <>
                                    <h3 className="text-2xl font-black mb-3">Accès Membre Uniquement</h3>
                                    <p className="font-bold text-white/70 mb-8">
                                        La création de tickets de support prioritaire est réservée à nos clients enregistrés.
                                    </p>
                                    <Link href="/login" className="flex items-center justify-between bg-white text-indigo-600 p-5 rounded-2xl font-black transition hover:bg-gray-100 shadow-xl">
                                        <span>Se connecter</span>
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-black mb-3">Support Prioritaire Actif</h3>
                                    <p className="font-bold text-black/70 mb-8">
                                        Bonjour {session?.user?.name}, vous bénéficiez d'une file d'attente réduite pour toutes vos demandes.
                                    </p>
                                    <div className="bg-black/10 p-4 rounded-xl border border-black/5 flex items-center gap-3">
                                        <Package className="w-5 h-5" />
                                        <span className="text-sm font-black uppercase tracking-widest leading-none">ID Client: #MT{session?.user?.email?.length || '000'}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-3xl backdrop-blur-xl group hover:border-yellow-400/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-950 rounded-2xl flex items-center justify-center border border-gray-800 group-hover:rotate-6 transition-transform">
                                        <Phone className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Urgences Livraison</p>
                                        <p className="text-lg font-black">+216 71 888 888</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-3xl backdrop-blur-xl group hover:border-yellow-400/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-950 rounded-2xl flex items-center justify-center border border-gray-800 group-hover:rotate-6 transition-transform">
                                        <Clock className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Horaires d'écoute</p>
                                        <p className="text-lg font-black">7j/7 • 12h00 - 23h30</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-gray-900/40 border border-gray-800 p-10 md:p-12 rounded-[3.5rem] shadow-3xl backdrop-blur-3xl relative overflow-hidden">
                            {success ? (
                                <div className="py-20 text-center space-y-6 animate-fade-in">
                                    <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto text-4xl border border-green-500/30">
                                        ✓
                                    </div>
                                    <h3 className="text-3xl font-black">Ticket Ouvert !</h3>
                                    <p className="text-gray-500 font-bold max-w-sm mx-auto text-lg">
                                        Nous avons bien reçu votre demande. Vous recevrez une notification dès qu'un conseiller aura pris votre dossier en charge.
                                    </p>
                                    <button
                                        onClick={() => setSuccess(false)}
                                        className="inline-flex items-center gap-2 text-yellow-400 font-black uppercase text-sm tracking-widest hover:text-yellow-300 transition"
                                    >
                                        Ouvrir un autre ticket <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-black mb-10 flex items-center gap-4">
                                        <MessageCircle className="w-8 h-8 text-yellow-400" />
                                        Nouveau Ticket
                                    </h2>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-600 uppercase tracking-widest ml-1">Sujet</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                    className="w-full bg-gray-950 border border-gray-800 p-5 rounded-2xl focus:border-yellow-400 focus:outline-none transition-colors font-bold"
                                                    placeholder="Titre de votre demande"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-600 uppercase tracking-widest ml-1">N° Commande</label>
                                                <input
                                                    type="text"
                                                    value={formData.orderId}
                                                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                                                    className="w-full bg-gray-950 border border-gray-800 p-5 rounded-2xl focus:border-yellow-400 focus:outline-none transition-colors font-bold"
                                                    placeholder="ex: #1024"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-gray-600 uppercase tracking-widest ml-1">Priorité</label>
                                            <div className="flex flex-wrap gap-3">
                                                {['low', 'medium', 'high', 'urgent'].map((p) => (
                                                    <button
                                                        key={p}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, priority: p })}
                                                        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${formData.priority === p
                                                            ? 'bg-yellow-400 border-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/20 scale-105'
                                                            : 'bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-600'
                                                            }`}
                                                    >
                                                        {p === 'low' ? 'Faible' : p === 'medium' ? 'Normal' : p === 'high' ? 'Élevé' : 'Urgent'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-600 uppercase tracking-widest ml-1">Description</label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full bg-gray-950 border border-gray-800 p-5 rounded-2xl focus:border-yellow-400 focus:outline-none transition-colors font-bold resize-none"
                                                placeholder="Comment pouvons-nous vous aider ?"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-gray-900 py-6 rounded-2xl font-black text-xl transition-all transform hover:scale-[1.01] shadow-xl shadow-yellow-400/10 flex items-center justify-center gap-3 group"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <>
                                                    <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                    {isGuest ? 'Contacter le support public' : 'Ouvrir mon ticket'}
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
