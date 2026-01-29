'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Gift, Image as ImageIcon, Percent, Calendar, Info } from 'lucide-react';

export default function PromotionFormPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const router = useRouter();
    const isNew = params.id === 'new';

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        discount: '',
        imageUrl: '',
        emoji: '',
        badgeText: '',
        badgeColor: '#EAB308', // yellow-500
        isActive: true,
        startDate: '',
        endDate: '',
        conditions: '',
        selectionRules: '[]' // JSON string for the form
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
                    originalPrice: p.originalPrice?.toString() || '',
                    discount: p.discount?.toString() || '',
                    imageUrl: p.imageUrl || '',
                    emoji: p.emoji || '',
                    badgeText: p.badgeText || '',
                    badgeColor: p.badgeColor || '#EAB308',
                    isActive: p.isActive,
                    startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : '',
                    endDate: p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : '',
                    conditions: p.conditions || '',
                    selectionRules: p.selectionRules ? JSON.stringify(p.selectionRules, null, 2) : '[]'
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
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
                discount: formData.discount ? parseInt(formData.discount) : null,
                startDate: formData.startDate || null,
                endDate: formData.endDate || null,
                selectionRules: formData.selectionRules ? JSON.parse(formData.selectionRules) : []
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
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div>
                <Link
                    href="/dashboard/promotions"
                    className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour aux promotions
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-400/10 rounded-2xl flex items-center justify-center">
                        <Gift className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h1 className="text-3xl font-black text-white">
                        {isNew ? 'Nouvelle Promotion' : `Modifier ${formData.name}`}
                    </h1>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-xl">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 space-y-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Info className="w-5 h-5 text-yellow-400" />
                                Informations Générales
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 font-bold mb-2">Nom de l'offre</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition"
                                        placeholder="ex: Menu Duo Pizza, Offre Étudiant..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 font-bold mb-2">Description / Contenu</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition min-h-[120px]"
                                        placeholder="Décrivez ce que contient l'offre..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 font-bold mb-2">Emoji</label>
                                        <input
                                            type="text"
                                            value={formData.emoji}
                                            onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                                            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition text-2xl text-center"
                                            placeholder="🎁"
                                            maxLength={2}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 font-bold mb-2">Statut</label>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                            className={`w-full py-3 rounded-xl font-bold transition border-2 ${formData.isActive
                                                ? 'bg-green-500/10 border-green-500 text-green-500'
                                                : 'bg-gray-900 border-gray-700 text-gray-500'
                                                }`}
                                        >
                                            {formData.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 space-y-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                Validité & Conditions
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 font-bold mb-2">Date de début (optionnel)</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 font-bold mb-2">Date de fin (optionnel)</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400 font-bold mb-2">Conditions particulières</label>
                                <textarea
                                    value={formData.conditions}
                                    onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition min-h-[80px]"
                                    placeholder="ex: Valable uniquement le midi, Non cumulable..."
                                />
                            </div>
                        </div>

                        {/* Selection Rules */}
                        <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <ArrowLeft className="w-5 h-5 text-green-400 rotate-180" />
                                    Règles de Sélection
                                </h2>
                                <div className="text-xs text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-700">
                                    Format JSON
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm text-gray-400">
                                    Définissez les choix que l'utilisateur doit faire (ex: choisir une pizza parmi une catégorie).
                                </p>

                                <div className="p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl space-y-2">
                                    <p className="text-xs font-bold text-yellow-400 uppercase">Aide aux IDs de Catégories:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map(cat => (
                                            <span key={cat.id} className="text-[10px] bg-gray-900 text-gray-300 px-2 py-1 rounded border border-gray-700">
                                                {cat.name}: <span className="text-white font-bold">{cat.id}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <textarea
                                        value={formData.selectionRules}
                                        onChange={(e) => setFormData({ ...formData, selectionRules: e.target.value })}
                                        className="w-full bg-gray-900 text-green-400 font-mono text-sm px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition min-h-[150px]"
                                        placeholder='[ { "id": "choice1", "label": "Pizza 1", "type": "category", "categoryId": 1, "quantity": 1 } ]'
                                    />
                                    <p className="mt-2 text-[10px] text-gray-500 italic">
                                        Exemple: [ &#123; "id": "p1", "label": "Pizza au choix", "type": "category", "categoryId": 1, "quantity": 1 &#125; ]
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Side Info (Pricing & Visual) */}
                    <div className="space-y-6">
                        <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 space-y-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Percent className="w-5 h-5 text-red-400" />
                                Prix & Réduction
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 font-bold mb-2">Prix de l'offre (DT)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition"
                                        placeholder="0.0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 font-bold mb-2">Prix original (DT)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.originalPrice}
                                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                        className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition"
                                        placeholder="0.0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 font-bold mb-2">Réduction (%)</label>
                                    <input
                                        type="number"
                                        value={formData.discount}
                                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                        className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 space-y-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-purple-400" />
                                Visuel & Badge
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 font-bold mb-2">Lien de l'image</label>
                                    <input
                                        type="text"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition"
                                        placeholder="https://... ou /images/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 font-bold mb-2">Texte du Badge</label>
                                    <input
                                        type="text"
                                        value={formData.badgeText}
                                        onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                                        className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition"
                                        placeholder="NOUVEAU, DUO..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 font-bold mb-2">Couleur du Badge</label>
                                    <input
                                        type="color"
                                        value={formData.badgeColor}
                                        onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                                        className="w-full h-12 bg-gray-900 p-1 rounded-xl border border-gray-700 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 p-6 bg-gray-800 rounded-3xl border border-gray-700 shadow-2xl">
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/promotions')}
                        className="px-8 py-3 rounded-xl font-bold text-gray-400 hover:text-white transition"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-12 py-3 rounded-xl font-black flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-400/20"
                    >
                        {saving ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <Save className="w-6 h-6" />
                        )}
                        {isNew ? 'Créer la promotion' : 'Enregistrer les modifications'}
                    </button>
                </div>
            </form>
        </div>
    );
}
