// app/(private)/dashboard/menu/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Trash2, X, Utensils, Loader2, FileImage, Activity, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';

interface Category {
    id: number;
    name: string;
    emoji: string;
}

export default function EditMenuItemPage() {
    const router = useRouter();
    const params = useParams();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
        ingredients: '',
        is_active: true,
        popular: false,
        bestseller: false,
        hot: false,
        discount: ''
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch categories and item details
                const [catsRes, itemRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch(`/api/menu-items/${params.id}`)
                ]);

                const catsData = await catsRes.json();
                const itemData = await itemRes.json();

                if (catsData.success) setCategories(catsData.categories);

                if (itemData.success) {
                    const item = itemData.menuItem;
                    setFormData({
                        name: item.name,
                        description: item.description || '',
                        price: typeof item.price === 'number' ? item.price : '', // Handle object price later if needed
                        category_id: item.category_id.toString(),
                        image_url: item.image_url || '',
                        ingredients: item.ingredients.join(', '), // formatting
                        is_active: item.is_active,
                        popular: item.popular,
                        bestseller: item.bestseller,
                        hot: item.hot,
                        discount: item.discount || ''
                    });
                } else {
                    alert('Produit introuvable');
                    router.push('/dashboard/menu');
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsFetching(false);
            }
        };

        loadData();
    }, [params.id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        setIsUploading(true);
        const file = e.target.files[0];

        try {
            const response = await fetch(
                `/api/upload?filename=${encodeURIComponent(file.name)}`,
                {
                    method: 'POST',
                    body: file,
                },
            );
            const newBlob = await response.json();
            if (newBlob.url) {
                setFormData(prev => ({ ...prev, image_url: newBlob.url }));
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Erreur lors de l\'upload');
        } finally {
            setIsUploading(false);
        }
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category_id: formData.category_id,
                image_url: formData.image_url,
                ingredients: formData.ingredients,
                is_active: formData.is_active,
                popular: formData.popular,
                bestseller: formData.bestseller,
                hot: formData.hot,
                discount: formData.discount ? parseInt(formData.discount) : null
            };

            const response = await fetch(`/api/menu-items/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                router.push('/dashboard/menu');
            } else {
                alert(result.error || 'Une erreur est survenue');
            }
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Erreur de connexion');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
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
                            <Utensils className="w-5 h-5 text-yellow-400" />
                        </div>
                        <span className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.4em] italic leading-none">Cuisine Intelligence System</span>
                    </div>
                    <h1 className="text-7xl font-[1000] text-white uppercase italic tracking-tighter leading-none">
                        Editer le <span className="text-yellow-400">Produit</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/menu"
                            className="bg-white/[0.02] border border-white/5 px-6 py-3 rounded-2xl text-gray-500 hover:text-white transition-all flex items-center gap-2 text-[10px] font-[1000] uppercase tracking-widest italic"
                        >
                            <ArrowLeft size={14} />
                            Retour à l'Inventaire
                        </Link>
                        <p className="text-gray-700 font-bold uppercase text-[10px] tracking-[0.5em]">Optimisation des paramètres de recette et actifs visuels</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Primary Matrix: Data & Ingredients */}
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
                                            Nom de la Recette
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/40 border border-white/5 text-white px-8 py-6 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-sm uppercase italic tracking-widest placeholder:text-gray-800 shadow-inner"
                                            placeholder="EX: PIZZA BUFFALA SUPREME"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center gap-3 text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">
                                            Classification
                                        </label>
                                        <select
                                            name="category_id"
                                            value={formData.category_id}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/40 border border-white/5 text-white px-8 py-6 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest shadow-inner appearance-none"
                                        >
                                            <option value="" className="bg-gray-900">Choisir Catégorie...</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id} className="bg-gray-900">
                                                    {cat.emoji} {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">
                                        Description Stratégique
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/5 text-white px-8 py-6 rounded-[2.5rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest placeholder:text-gray-800 min-h-[120px] resize-none shadow-inner"
                                        placeholder="Décrivez les attributs uniques de ce produit..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">
                                        Vecteur Ingrédients (Séparés par virgules)
                                    </label>
                                    <input
                                        type="text"
                                        name="ingredients"
                                        value={formData.ingredients}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/5 text-white px-8 py-6 rounded-[2rem] font-[1000] focus:outline-none focus:border-yellow-400/50 transition-all text-xs uppercase italic tracking-widest placeholder:text-gray-800 shadow-inner"
                                        placeholder="EX: TOMATE, MOZZARELLA, BASILIC..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Visual Asset Control */}
                        <div className="bg-white/[0.02] rounded-[4rem] p-10 border border-white/5 backdrop-blur-3xl shadow-3xl relative overflow-hidden group">
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-10 bg-purple-500 rounded-full"></div>
                                    <h2 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter">Asset <span className="text-purple-500">Visual</span></h2>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">Source de l'Actif (URL / Emoji)</label>
                                            <div className="flex gap-4">
                                                <input
                                                    type="text"
                                                    name="image_url"
                                                    value={formData.image_url}
                                                    onChange={handleChange}
                                                    className="flex-1 bg-black/40 border border-white/5 text-white px-8 py-5 rounded-[2rem] font-[1000] focus:outline-none focus:border-purple-500/50 transition-all text-[10px] italic placeholder:text-gray-800 shadow-inner"
                                                    placeholder="URL OU EMOJI..."
                                                />
                                                <div className="relative">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className={`h-full px-8 rounded-[2rem] font-[1000] uppercase text-[10px] tracking-widest flex items-center gap-3 transition-all border ${isUploading ? 'bg-gray-800 border-white/5' : 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 cursor-pointer'}`}
                                                    >
                                                        {isUploading ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : (
                                                            <>
                                                                <FileImage size={14} />
                                                                Upload
                                                            </>
                                                        )}
                                                    </label>
                                                    <input
                                                        id="file-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileUpload}
                                                        className="hidden"
                                                        disabled={isUploading}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative group/preview">
                                        <div className="w-full aspect-[16/9] bg-black/40 rounded-[3rem] border border-white/5 overflow-hidden relative flex items-center justify-center shadow-2xl">
                                            {formData.image_url ? (
                                                formData.image_url.length < 5 ? (
                                                    <span className="text-9xl">{formData.image_url}</span>
                                                ) : (
                                                    <img
                                                        src={formData.image_url}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/preview:scale-110"
                                                    />
                                                )
                                            ) : (
                                                <div className="text-gray-800 font-[1000] text-[10px] uppercase tracking-[0.5em] italic">Aperçu Manquant</div>
                                            )}
                                            {formData.image_url && (
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                                    className="absolute top-6 right-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl hover:bg-red-500/20 transition-all backdrop-blur-md opacity-0 group-hover/preview:opacity-100"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Matrix: Finance & Logic */}
                    <div className="space-y-10">
                        {/* Financial Analytics */}
                        <div className="bg-white/[0.02] rounded-[4rem] p-10 border border-white/5 backdrop-blur-3xl shadow-3xl space-y-8">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-2 h-10 bg-red-500 rounded-full"></div>
                                <h2 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter">Metric <span className="text-red-500">Finance</span></h2>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">Vecteur Prix Unitaire (DT)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/40 border border-white/5 text-white px-8 py-8 rounded-[2.5rem] font-[1000] text-4xl focus:outline-none focus:border-red-500/50 transition-all text-center placeholder:text-gray-800 shadow-inner"
                                            placeholder="0.0"
                                        />
                                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-800 font-black text-xs uppercase tracking-widest italic pointer-events-none">Dinar Tun</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-[1000] text-gray-500 uppercase tracking-[0.3em] italic ml-4">Ratio de Remise (%)</label>
                                    <input
                                        type="number"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/5 text-white px-8 py-5 rounded-[2rem] font-[1000] focus:outline-none focus:border-red-500/50 transition-all text-center placeholder:text-gray-800 shadow-inner"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Logic Switches */}
                        <div className="bg-white/[0.02] rounded-[4rem] p-10 border border-white/5 backdrop-blur-3xl shadow-3xl space-y-8">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-2 h-10 bg-green-500 rounded-full"></div>
                                <h2 className="text-3xl font-[1000] text-white uppercase italic tracking-tighter">System <span className="text-green-500">Status</span></h2>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center justify-between p-6 rounded-[2rem] bg-black/20 border border-white/5 cursor-pointer group transition-all hover:bg-black/30">
                                    <div className="flex items-center gap-4">
                                        <Activity className={`w-5 h-5 transition-colors ${formData.is_active ? 'text-green-500' : 'text-gray-700'}`} />
                                        <span className={`text-[10px] font-[1000] uppercase tracking-widest italic ${formData.is_active ? 'text-white' : 'text-gray-600'}`}>Visibilité Online</span>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${formData.is_active ? 'bg-green-500' : 'bg-gray-800'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${formData.is_active ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                    <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="hidden" />
                                </label>

                                <label className="flex items-center justify-between p-6 rounded-[2rem] bg-black/20 border border-white/5 cursor-pointer group transition-all hover:bg-black/30">
                                    <div className="flex items-center gap-4">
                                        <CheckCircle className={`w-5 h-5 transition-colors ${formData.popular ? 'text-yellow-400' : 'text-gray-700'}`} />
                                        <span className={`text-[10px] font-[1000] uppercase tracking-widest italic ${formData.popular ? 'text-white' : 'text-gray-600'}`}>Tendance Populaire</span>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${formData.popular ? 'bg-yellow-400' : 'bg-gray-800'}`}>
                                        <div className={`w-4 h-4 bg-black rounded-full transition-all duration-300 transform ${formData.popular ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                    <input type="checkbox" name="popular" checked={formData.popular} onChange={handleChange} className="hidden" />
                                </label>

                                <label className="flex items-center justify-between p-6 rounded-[2rem] bg-black/20 border border-white/5 cursor-pointer group transition-all hover:bg-black/30">
                                    <div className="flex items-center gap-4">
                                        <Zap className={`w-5 h-5 transition-colors ${formData.hot ? 'text-red-500' : 'text-gray-700'}`} />
                                        <span className={`text-[10px] font-[1000] uppercase tracking-widest italic ${formData.hot ? 'text-white' : 'text-gray-600'}`}>Vecteur Piquant</span>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${formData.hot ? 'bg-red-500' : 'bg-gray-800'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${formData.hot ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                    <input type="checkbox" name="hot" checked={formData.hot} onChange={handleChange} className="hidden" />
                                </label>
                            </div>
                        </div>

                        {/* Actions Matrix */}
                        <div className="bg-black/40 rounded-[3rem] p-4 flex flex-col gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-8 rounded-[2.5rem] font-[1000] uppercase text-[13px] tracking-[0.4em] italic transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-[0_20px_60px_rgba(250,204,21,0.2)] active:scale-95"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <Save size={20} strokeWidth={3} />
                                        Mise à Jour Système
                                    </>
                                )}
                            </button>
                            <Link
                                href="/dashboard/menu"
                                className="w-full bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] text-gray-500 hover:text-white py-6 rounded-[2rem] font-[1000] uppercase text-[10px] tracking-[0.3em] italic transition-all flex items-center justify-center gap-4 active:scale-95 text-center"
                            >
                                Annuler Opération
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
