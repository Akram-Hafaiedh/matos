// app/(private)/dashboard/menu/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Trash2, X } from 'lucide-react';
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
        categoryId: '',
        imageUrl: '',
        ingredients: '',
        isActive: true,
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
                        categoryId: item.categoryId.toString(),
                        imageUrl: item.imageUrl || '',
                        ingredients: item.ingredients.join(', '), // formatting
                        isActive: item.isActive,
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
                setFormData(prev => ({ ...prev, imageUrl: newBlob.url }));
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
                ...formData,
                price: parseFloat(formData.price),
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
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/menu"
                        className="p-2 bg-gray-800 rounded-xl text-gray-400 hover:text-white transition"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-white">
                            Editer <span className="text-yellow-400">Produit</span>
                        </h1>
                        <p className="text-gray-400">Modifier les détails du plat</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-3 gap-8">

                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 space-y-6">
                            <h2 className="text-xl font-bold text-white mb-4">Informations Générales</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-400 mb-2 text-sm font-bold ml-1">Nom du produit *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700"
                                        placeholder="Ex: Pizza 4 Fromages"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2 text-sm font-bold ml-1">Catégorie *</label>
                                    <select
                                        name="categoryId"
                                        required
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700"
                                    >
                                        <option value="">Choisir une catégorie...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.emoji} {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2 text-sm font-bold ml-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700 min-h-[100px]"
                                    placeholder="Description appétissante du plat..."
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2 text-sm font-bold ml-1">Image</label>
                                <div className="space-y-4">
                                    {formData.imageUrl && (
                                        <div className="relative h-48 w-full rounded-xl overflow-hidden bg-gray-900 border border-gray-700">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={formData.imageUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                                className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white hover:bg-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <input
                                            type="url"
                                            name="imageUrl"
                                            value={formData.imageUrl}
                                            onChange={handleChange}
                                            className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700"
                                            placeholder="URL de l'image ou emoji..."
                                        />
                                        <div className="relative">
                                            <label
                                                htmlFor="file-upload"
                                                className={`cursor-pointer px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition ${isUploading ? 'bg-gray-700 text-gray-400' : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600'}`}
                                            >
                                                {isUploading ? (
                                                    <span className="animate-spin text-yellow-400">⌛</span>
                                                ) : (
                                                    <span>📤 Upload</span>
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
                                    <p className="text-xs text-gray-500 ml-1">Collez une URL d'image, un emoji (ex: 🍔), ou uploadez une photo</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 space-y-6">
                            <h2 className="text-xl font-bold text-white mb-4">Détails</h2>

                            <div>
                                <label className="block text-gray-400 mb-2 text-sm font-bold ml-1">Ingrédients</label>
                                <input
                                    type="text"
                                    name="ingredients"
                                    value={formData.ingredients}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700"
                                    placeholder="Tomate, Mozzarella, Basilic... (séparés par des virgules)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-gray-800 rounded-2xl p-6 border-2 border-gray-700 space-y-6">
                            <h2 className="text-xl font-bold text-white mb-4">Prix & Options</h2>

                            <div>
                                <label className="block text-gray-400 mb-2 text-sm font-bold ml-1">Prix (DT) *</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="price"
                                        required
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900 text-white pl-4 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700 font-bold text-lg"
                                        placeholder="0.0"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">DT</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2 text-sm font-bold ml-1">Remise (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900 text-white pl-4 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-700">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-10 h-6 rounded-full border-2 flex items-center transition-all px-1 ${formData.isActive ? 'bg-green-500 border-green-500 justify-end' : 'bg-gray-700 border-gray-600 justify-start'}`}>
                                        <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                                    </div>
                                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="hidden" />
                                    <span className="text-gray-300 font-bold group-hover:text-white">Actif (Visible)</span>
                                </label>

                                <div className="w-full h-px bg-gray-700 my-2" />

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${formData.popular ? 'bg-yellow-400 border-yellow-400' : 'border-gray-600 group-hover:border-white'}`}>
                                        {formData.popular && <div className="w-3 h-3 bg-black rounded-sm" />}
                                    </div>
                                    <input type="checkbox" name="popular" checked={formData.popular} onChange={handleChange} className="hidden" />
                                    <span className="text-gray-300 font-bold group-hover:text-white">Populaire</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${formData.bestseller ? 'bg-yellow-400 border-yellow-400' : 'border-gray-600 group-hover:border-white'}`}>
                                        {formData.bestseller && <div className="w-3 h-3 bg-black rounded-sm" />}
                                    </div>
                                    <input type="checkbox" name="bestseller" checked={formData.bestseller} onChange={handleChange} className="hidden" />
                                    <span className="text-gray-300 font-bold group-hover:text-white">Best Seller</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${formData.hot ? 'bg-red-500 border-red-500' : 'border-gray-600 group-hover:border-white'}`}>
                                        {formData.hot && <div className="w-3 h-3 bg-white rounded-sm" />}
                                    </div>
                                    <input type="checkbox" name="hot" checked={formData.hot} onChange={handleChange} className="hidden" />
                                    <span className="text-gray-300 font-bold group-hover:text-white">Piquant / Hot</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black py-4 rounded-xl font-black text-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>Enregistrement...</>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Mettre à jour
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
