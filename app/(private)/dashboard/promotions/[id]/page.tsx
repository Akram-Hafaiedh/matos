'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Gift, Image as ImageIcon, Percent, Calendar, Info, Hash, Plus, Signal, Activity, Sparkles, Layers, ChevronRight } from 'lucide-react';

export default function PromotionFormPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const router = useRouter();
    const isNew = params.id === 'new';

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        original_price: '',
        discount: '',
        image_url: '',
        emoji: '',
        badge_text: '',
        badge_color: '#EAB308', // yellow-500
        is_active: true,
        is_hot: false,
        tag: '',
        start_date: '',
        end_date: '',
        conditions: '',
        selection_rules: '[]' // JSON string for the form
    });

    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
        if (!isNew) {
            fetchPromotion();
        }
    }, [isNew]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchPromotion = async () => {
        try {
            const res = await fetch(`/api/promotions/${params.id}`);
            const data = await res.json();

            if (data.success) {
                const p = data.promotion;
                setFormData({
                    name: p.name || '',
                    description: p.description || '',
                    price: p.price?.toString() || '',
                    original_price: p.original_price?.toString() || '',
                    discount: p.discount?.toString() || '',
                    image_url: p.image_url || '',
                    emoji: p.emoji || '',
                    badge_text: p.badge_text || '',
                    badge_color: p.badge_color || '#EAB308',
                    is_active: p.is_active,
                    is_hot: p.is_hot || false,
                    tag: p.tag || '',
                    start_date: p.start_date ? new Date(p.start_date).toISOString().split('T')[0] : '',
                    end_date: p.end_date ? new Date(p.end_date).toISOString().split('T')[0] : '',
                    conditions: p.conditions || '',
                    selection_rules: p.selection_rules ? JSON.stringify(p.selection_rules, null, 2) : '[]'
                });
            } else {
                setError('Promotion introuvable');
            }
        } catch (error) {
            console.error('Error fetching promotion:', error);
            setError('Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const url = isNew ? '/api/promotions' : `/api/promotions/${params.id}`;
            const method = isNew ? 'POST' : 'PUT';

            const payload = {
                ...formData,
                price: formData.price ? parseFloat(formData.price) : null,
                original_price: formData.original_price ? parseFloat(formData.original_price) : null,
                discount: formData.discount ? parseInt(formData.discount) : null,
                start_date: formData.start_date || null,
                end_date: formData.end_date || null,
                selection_rules: formData.selection_rules ? JSON.parse(formData.selection_rules) : []
            };

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                router.push('/dashboard/promotions');
                router.refresh();
            } else {
                setError(data.error || 'Erreur lors de l\'enregistrement');
            }
        } catch (error) {
            console.error('Error saving promotion:', error);
            setError('Erreur serveur');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Tactical Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400/10 rounded-2xl flex items-center justify-center border border-yellow-400/20">
                            <Gift className="w-5 h-5 text-yellow-400" />
                        </div>
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic leading-none">Intelligence Promotionnelle</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none">
                        {isNew ? 'Nouveau' : 'Editer'} <span className="text-yellow-400">Protocole</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/promotions"
                            className="bg-white/[0.02] border border-white/5 px-6 py-3 rounded-2xl text-gray-500 hover:text-white transition-all flex items-center gap-2 text-[10px] font-[1000] uppercase tracking-widest italic"
                        >
                            <ArrowLeft size={14} />
                            Retour au Registre
                        </Link>
                        <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em]">Configuration des paramètres d'offre stratégique</p>
                    </div>
                </div>
            </div>

            {/* Form Matrix */}
            <form onSubmit={handleSubmit} className="space-y-10">
                {error && (
                    <div className="bg-red-500/5 border border-red-500/20 text-red-400 p-8 rounded-[2.5rem] flex items-center gap-4 animate-in slide-in-from-top duration-500">
                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center shrink-0">
                            <Info className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-[1000] uppercase tracking-[0.2em] mb-1">Erreur de Système</p>
                            <p className="text-sm font-bold opacity-80 italic uppercase">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Primary Logistics */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-white/[0.02] rounded-[4rem] p-10 border border-white/5 backdrop-blur-3xl shadow-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-full h-full bg-yellow-400/[0.01] pointer-events-none"></div>

                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-2 h-10 bg-yellow-400 rounded-full"></div>
                                    <h2 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter">Paramètres <span className="text-yellow-400">Généraux</span></h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">
                                            <Hash size={12} className="text-yellow-400" />
                                            Identification de l'Offre
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-black/40 border border-white/5 text-white px-8 py-6 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest placeholder:text-gray-800 shadow-inner"
                                            placeholder="Ex: PROTOCOLE DUO PIZZA"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">
                                            <Plus size={12} className="text-yellow-400" />
                                            Configuration Visuelle (Emoji)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.emoji}
                                            onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                                            className="w-full bg-black/40 border border-white/5 text-white px-8 py-6 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-2xl text-center shadow-inner"
                                            placeholder="🎁"
                                            maxLength={2}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">
                                        <Signal size={12} className="text-yellow-400" />
                                        Briefing de l'Offre (Description)
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white px-8 py-6 rounded-[2.5rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest placeholder:text-gray-800 min-h-[160px] resize-none shadow-inner"
                                        placeholder="Décrivez les spécificités de ce protocole promotionnel..."
                                    />
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                        className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[2rem] font-[1000] uppercase text-[10px] tracking-[0.3em] italic transition-all border ${formData.is_active
                                            ? 'bg-green-500/10 border-green-500 text-green-400'
                                            : 'bg-black/20 border-white/5 text-gray-600'}`}
                                    >
                                        <Activity size={14} />
                                        {formData.is_active ? 'Opérationnel' : 'Offline'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, is_hot: !formData.is_hot })}
                                        className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[2rem] font-[1000] uppercase text-[10px] tracking-[0.3em] italic transition-all border ${formData.is_hot
                                            ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_40px_rgba(239,68,68,0.1)]'
                                            : 'bg-black/20 border-white/5 text-gray-600'}`}
                                    >
                                        <Sparkles size={14} />
                                        {formData.is_hot ? 'Protocole Critique 🔥' : 'Standard'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Rules Intelligence */}
                        <div className="bg-white/[0.02] rounded-[4rem] p-10 border border-white/5 backdrop-blur-3xl shadow-3xl relative overflow-hidden">
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-10 bg-green-500 rounded-full"></div>
                                        <h2 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter leading-none">Matrix <span className="text-green-500">Selection</span></h2>
                                    </div>
                                    <div className="px-5 py-2 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-[9px] font-[1000] uppercase tracking-widest italic leading-none">
                                        JSON System Logic
                                    </div>
                                </div>

                                <div className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] space-y-4">
                                    <div className="flex items-center gap-3 text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic">
                                        <Layers size={12} className="text-green-500" />
                                        Index des Catégories Disponibles
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {categories.map(cat => (
                                            <div key={cat.id} className="bg-white/[0.03] px-5 py-3 rounded-2xl border border-white/5 text-[10px] font-bold text-gray-400 group/cat transition-all hover:border-green-500/30">
                                                <span className="text-gray-600 group-hover/cat:text-green-500 transition-colors uppercase mr-2">{cat.name}:</span>
                                                <span className="text-white text-xs">{cat.id}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">
                                        Architecture des Règles (Format JSON)
                                    </label>
                                    <div className="relative group/json">
                                        <div className="absolute top-6 right-6 opacity-0 group-hover/json:opacity-100 transition-opacity pointer-events-none">
                                            <span className="text-[10px] font-black text-green-500/50 uppercase tracking-[0.2em]">Code Layer Access</span>
                                        </div>
                                        <textarea
                                            value={formData.selection_rules}
                                            onChange={(e) => setFormData({ ...formData, selection_rules: e.target.value })}
                                            className="w-full bg-black/60 border border-white/5 text-green-400 font-mono text-xs p-10 rounded-[3rem] focus:outline-none focus:border-green-500/50 transition-all min-h-[300px] shadow-2xl custom-scrollbar"
                                            placeholder='[ { "id": "p1", "label": "Pizza Selection", "type": "category", "categoryId": 1, "quantity": 1 } ]'
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] text-gray-700 font-bold uppercase tracking-[0.2em] italic ml-6">
                                        <ChevronRight size={10} className="text-green-500" />
                                        Structure correcte requise pour l'activation du wizard client.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Matrix */}
                    <div className="space-y-10">
                        {/* Financial Analytics */}
                        <div className="bg-white/[0.02] rounded-[4rem] p-10 border border-white/5 backdrop-blur-3xl shadow-3xl space-y-8">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-2 h-10 bg-red-500 rounded-full"></div>
                                <h2 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter">Metric <span className="text-red-500">Finance</span></h2>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">Vecteur Prix Final (DT)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white px-8 py-6 rounded-3xl font-[1000] text-2xl focus:outline-none focus:border-red-500/50 transition-all text-center placeholder:text-gray-800"
                                        placeholder="0.0"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">Réduction (%)</label>
                                        <input
                                            type="number"
                                            value={formData.discount}
                                            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                            className="w-full bg-black/40 border border-white/5 text-white px-8 py-5 rounded-2xl font-[1000] focus:outline-none focus:border-red-500/50 transition-all text-center"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">Prix de Base (DT)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.original_price}
                                            onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                            className="w-full bg-black/40 border border-white/5 text-white px-8 py-5 rounded-2xl font-[1000] focus:outline-none focus:border-red-500/50 transition-all text-center opacity-60 hover:opacity-100"
                                            placeholder="0.0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Asset Management */}
                        <div className="bg-white/[0.02] rounded-[4rem] p-10 border border-white/5 backdrop-blur-3xl shadow-3xl space-y-8">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-2 h-10 bg-purple-500 rounded-full"></div>
                                <h2 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter">Assets <span className="text-purple-500">Visual</span></h2>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">Source de l'Image</label>
                                    <input
                                        type="text"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white px-8 py-5 rounded-2xl font-[1000] focus:outline-none focus:border-purple-500/50 transition-all text-[10px] italic placeholder:text-gray-800"
                                        placeholder="URL DE L'ACTIF..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">Texte de Branding (Badge)</label>
                                    <input
                                        type="text"
                                        value={formData.badge_text}
                                        onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-white px-8 py-5 rounded-2xl font-[1000] focus:outline-none focus:border-purple-500/50 transition-all text-center uppercase italic"
                                        placeholder="NOUVEAU, DUO..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">Vecteur Couleur Badge</label>
                                    <div className="flex gap-4">
                                        <div
                                            className="w-16 h-16 rounded-2xl border-2 border-white/10 shadow-xl"
                                            style={{ backgroundColor: formData.badge_color }}
                                        ></div>
                                        <input
                                            type="color"
                                            value={formData.badge_color}
                                            onChange={(e) => setFormData({ ...formData, badge_color: e.target.value })}
                                            className="flex-1 h-16 bg-black/40 p-2 rounded-2xl border border-white/5 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">Tag Stratégique (Récompense)</label>
                                    <input
                                        type="text"
                                        value={formData.tag}
                                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 text-yellow-400 px-8 py-5 rounded-2xl font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-center uppercase italic"
                                        placeholder="EX: +50 M-TOKENS"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions Matrix */}
                        <div className="bg-black/40 rounded-[3rem] p-4 flex flex-col gap-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-8 rounded-[2.5rem] font-[1000] uppercase text-[13px] tracking-[0.4em] italic transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-[0_20px_60px_rgba(250,204,21,0.2)] active:scale-95"
                            >
                                {saving ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <Save size={20} strokeWidth={3} />
                                        Exécuter Sync
                                    </>
                                )}
                            </button>
                            <Link
                                href="/dashboard/promotions"
                                className="w-full bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] text-gray-500 hover:text-white py-6 rounded-[2rem] font-[1000] uppercase text-[10px] tracking-[0.3em] italic transition-all flex items-center justify-center gap-4 active:scale-95"
                            >
                                Abandonner le Protocole
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
