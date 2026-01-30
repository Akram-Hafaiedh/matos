'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Tag } from 'lucide-react';
import EmojiPicker from '@/components/EmojiPicker';


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

    // ... loading state ... (will be kept from previous file or restored implicitly if contiguous) but since I'm replacing a large chunk I'll include it to be safe 
    // actually wait, this tool is REPLACEMENT. I should target the top import block down to the end of form rendering where I had the icon picker.
    // I can stick to targeting the imports and the emoji picker area separately or just rewrite the component since it's small.
    // Let's rewrite the imports and constant first, then the specific part of the form.

    // Wait, the "previous view" shows I have a lot of lucide imports. I'll replace the imports and constants first.


    if (loading) {
        return (
            <div className="max-w-2xl mx-auto space-y-8 pb-32">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link href="/dashboard/categories" className="text-gray-400 hover:text-yellow-400 transition flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" />
                        Retour aux catégories
                    </Link>
                </div>

                {/* Form */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 space-y-6 animate-pulse">
                    <div className="h-8 bg-gray-700 rounded w-3/4 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-1 h-12 bg-gray-700 rounded"></div>
                        <div className="h-12 bg-gray-700 rounded"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="h-12 bg-gray-700 rounded"></div>
                    </div>
                    <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700">
                        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                        <div className="grid grid-cols-5 gap-3">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-700 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-gray-700">
                        <div className="h-12 w-40 bg-gray-700 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-32">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/dashboard/categories" className="text-gray-400 hover:text-yellow-400 transition flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    Retour aux catégories
                </Link>
                <h1 className="text-3xl font-bold text-white">
                    {isNew ? 'Nouvelle catégorie' : 'Modifier la catégorie'}
                </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 space-y-6">

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-xl">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Name & Order Group */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-gray-400 font-bold mb-2">Nom de la catégorie</label>
                            <div className="relative">
                                <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition"
                                    placeholder="ex: Burgers"
                                    required
                                />
                            </div>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Emoji */}
                        <div>
                            <label className="block text-gray-400 font-bold mb-2">Emoji</label>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 flex items-center justify-center bg-gray-950 rounded-xl text-3xl border border-gray-700">
                                    {formData.emoji || <span className="text-gray-700 text-xl">?</span>}
                                </div>
                                <input
                                    type="text"
                                    value={formData.emoji}
                                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                                    className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-yellow-400 transition"
                                    placeholder="ex: 🍔"
                                    maxLength={2}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Emoji Picker */}
                    <EmojiPicker
                        selected={formData.emoji}
                        onSelect={(emoji) => setFormData({ ...formData, emoji })}
                        label="Choisir un Emoji"
                        description="Cliquez sur un emoji pour l'assigner à la catégorie."
                        isAdmin={true}
                    />

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
