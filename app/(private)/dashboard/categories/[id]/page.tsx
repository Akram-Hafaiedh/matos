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
            <div className="w-full space-y-8 pb-32">
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
        <div className="w-full space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Tactical Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400/10 rounded-2xl flex items-center justify-center border border-yellow-400/20">
                            <Tag className="w-5 h-5 text-yellow-400" />
                        </div>
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic leading-none">System Architecture Registry</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none">
                        {isNew ? 'Nouveau' : 'Editer'} <span className="text-yellow-400">Classification</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/categories"
                            className="bg-white/[0.02] border border-white/5 px-6 py-3 rounded-2xl text-gray-500 hover:text-white transition-all flex items-center gap-2 text-[10px] font-[1000] uppercase tracking-widest italic"
                        >
                            <ArrowLeft size={14} />
                            Retour au Registre
                        </Link>
                        <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em]">Configuration des paramètres de taxonomie et indexation</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Primary Matrix: Data */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-white/[0.02] rounded-[4rem] p-10 border border-white/5 backdrop-blur-3xl shadow-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-full h-full bg-yellow-400/[0.01] pointer-events-none"></div>

                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-2 h-10 bg-yellow-400 rounded-full"></div>
                                    <h2 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter">Spec <span className="text-yellow-400">Générales</span></h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">
                                            Nom de la Catégorie
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="w-full bg-black/40 border border-white/5 text-white px-8 py-6 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-sm uppercase italic tracking-widest placeholder:text-gray-800 shadow-inner"
                                            placeholder="EX: BURGERS GOURMET"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">
                                            Indice d'Ordre
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.displayOrder}
                                            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-black/40 border border-white/5 text-white px-8 py-6 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-center text-sm placeholder:text-gray-800 shadow-inner"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-500/5 border border-red-500/20 text-red-400 p-8 rounded-[2.5rem] flex items-center gap-4 animate-in slide-in-from-top duration-500">
                                        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center shrink-0">
                                            <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                                        </div>
                                        <p className="text-[10px] font-[1000] uppercase tracking-widest italic">{error}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Visual Logic: Emoji Picker */}
                        <div className="bg-white/[0.02] rounded-[4rem] p-10 border border-white/5 backdrop-blur-3xl shadow-3xl space-y-8">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-2 h-10 bg-purple-500 rounded-full"></div>
                                <h2 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter">Icon <span className="text-purple-500">Protocol</span></h2>
                            </div>

                            <EmojiPicker
                                selected={formData.emoji}
                                onSelect={(emoji) => setFormData({ ...formData, emoji })}
                                label="Sélecteur d'Identité Visuelle"
                                description="Associez un glyphe distinctif pour la représentation systémique"
                                isAdmin={true}
                            />
                        </div>
                    </div>

                    {/* Secondary Matrix: Actions & Status */}
                    <div className="space-y-10">
                        <div className="bg-white/[0.02] rounded-[4rem] p-10 border border-white/5 backdrop-blur-3xl shadow-3xl space-y-8">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-2 h-10 bg-green-500 rounded-full"></div>
                                <h2 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter">Status <span className="text-green-500">Monitor</span></h2>
                            </div>

                            <div className="p-10 bg-black/40 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center gap-6 group">
                                <div className="w-24 h-24 bg-white/[0.02] rounded-[2.5rem] border border-white/5 flex items-center justify-center text-6xl group-hover:scale-110 group-hover:bg-yellow-400/10 group-hover:border-yellow-400/30 transition-all duration-500 shadow-2xl">
                                    {formData.emoji || <span className="text-gray-800 italic">?</span>}
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic">Aperçu Identitaire</p>
                                    <p className="text-white font-[1000] uppercase text-xs tracking-widest">{formData.name || 'SANS NOM'}</p>
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
                                href="/dashboard/categories"
                                className="w-full bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] text-gray-500 hover:text-white py-6 rounded-[2rem] font-[1000] uppercase text-[10px] tracking-[0.3em] italic transition-all flex items-center justify-center gap-4 active:scale-95 text-center"
                            >
                                Abandonner Opération
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
