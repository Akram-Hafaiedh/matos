'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Tag } from 'lucide-react';

export default function CategoryFormPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const router = useRouter();
    const isNew = params.id === 'new';

    const [formData, setFormData] = useState({
        name: '',
        emoji: '',
        displayOrder: 0
    });
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isNew) {
            fetchCategory();
        }
    }, [isNew]);

    const fetchCategory = async () => {
        try {
            // Since we don't have a specific GET by ID endpoint for categories (only list), 
            // we will fetch all and find the one we need, or we can rely on the list view.
            // Ideally we should have a GET /api/categories/[id], but standard /api/categories returns all.
            // For simplicity and since categories are few, we can filter client side or implement GET id.
            // Let's implement GET in the API or just use what we have.
            // Actually, I didn't implement GET by ID in the API, I only did PUT and DELETE.
            // I should have implemented GET in [id]/route.ts.
            // Let's implement fetch from all categories as a fallback or fix the API.
            // Fix: I will fetch all and find. It's safe for now.
            const res = await fetch('/api/categories');
            const data = await res.json();

            if (data.success) {
                const category = data.categories.find((c: any) => c.id.toString() === params.id);
                if (category) {
                    setFormData({
                        name: category.name,
                        emoji: category.emoji || '',
                        displayOrder: category.displayOrder || 0
                    });
                } else {
                    setError('Catégorie introuvable');
                }
            }
        } catch (error) {
            console.error('Error fetching category:', error);
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
            const url = isNew ? '/api/categories' : `/api/categories/${params.id}`;
            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                router.push('/dashboard/categories');
                router.refresh();
            } else {
                setError(data.error || 'Erreur lors de l\'enregistrement');
            }
        } catch (error) {
            console.error('Error saving category:', error);
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
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <Link
                    href="/dashboard/categories"
                    className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour aux catégories
                </Link>
                <h1 className="text-3xl font-black text-white">
                    {isNew ? 'Nouvelle Catégorie' : `Modifier ${formData.name}`}
                </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 space-y-6">

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-xl">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="col-span-2">
                        <label className="block text-gray-400 font-bold mb-2">Nom de la catégorie</label>
                        <div className="relative">
                            <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition"
                                placeholder="ex: Burgers, Boissons..."
                                required
                            />
                        </div>
                    </div>

                    {/* Emoji */}
                    <div>
                        <label className="block text-gray-400 font-bold mb-2">Emoji</label>
                        <input
                            type="text"
                            value={formData.emoji}
                            onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition text-2xl text-center"
                            placeholder="🍔"
                            maxLength={2}
                        />
                    </div>

                    {/* Order */}
                    <div>
                        <label className="block text-gray-400 font-bold mb-2">Ordre d'affichage</label>
                        <input
                            type="number"
                            value={formData.displayOrder}
                            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition"
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-4 border-t border-gray-700">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {isNew ? 'Créer la catégorie' : 'Enregistrer les modifications'}
                    </button>
                </div>
            </form>
        </div>
    );
}
