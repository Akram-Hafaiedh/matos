'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Tag, Gift, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface Promotion {
    id: number;
    name: string;
    description: string;
    price: number | null;
    originalPrice: number | null;
    discount: number | null;
    imageUrl: string | null;
    emoji: string | null;
    badgeText: string | null;
    badgeColor: string | null;
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
}

export default function PromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            const res = await fetch('/api/promotions');
            const data = await res.json();
            if (data.success) {
                setPromotions(data.promotions);
            }
        } catch (error) {
            console.error('Error fetching promotions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) return;

        try {
            const res = await fetch(`/api/promotions/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (data.success) {
                setPromotions(promotions.filter(p => p.id !== id));
            } else {
                alert(data.error || 'Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting promotion:', error);
            alert('Erreur serveur lors de la suppression');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">
                        Gestion des <span className="text-yellow-400">Promotions</span>
                    </h1>
                    <p className="text-gray-400">Créez des offres spéciales et des bundles pour vos clients</p>
                </div>

                <Link
                    href="/dashboard/promotions/new"
                    className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition justify-center w-full md:w-auto"
                >
                    <Plus className="w-5 h-5" />
                    Nouvelle Promotion
                </Link>
            </div>

            {/* Content */}
            <div className="bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs font-black tracking-widest border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-5">Statut</th>
                                <th className="px-6 py-5">Promotion</th>
                                <th className="px-6 py-5">Prix / Réduction</th>
                                <th className="px-6 py-5">Validité</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {promotions.map((promo) => (
                                <tr key={promo.id} className="hover:bg-gray-750 transition group">
                                    <td className="px-6 py-5">
                                        {promo.isActive ? (
                                            <div className="flex items-center gap-2 text-green-400 font-bold text-xs uppercase tracking-tighter">
                                                <CheckCircle className="w-4 h-4" />
                                                Active
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-tighter">
                                                <XCircle className="w-4 h-4" />
                                                Inactive
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                                                {promo.emoji || '🎁'}
                                            </div>
                                            <div>
                                                <div className="font-black text-white text-lg group-hover:text-yellow-400 transition">{promo.name}</div>
                                                <div className="text-gray-400 text-sm line-clamp-1 max-w-xs">{promo.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            {promo.price ? (
                                                <span className="text-yellow-400 font-black text-lg">{promo.price.toFixed(1)} DT</span>
                                            ) : promo.discount ? (
                                                <span className="text-red-400 font-black text-lg">-{promo.discount}%</span>
                                            ) : (
                                                <span className="text-gray-500 font-bold">Gratuit / Voir</span>
                                            )}
                                            {promo.originalPrice && (
                                                <span className="text-gray-500 line-through text-xs font-bold">{promo.originalPrice.toFixed(1)} DT</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            {promo.endDate ? (
                                                <span>Jusqu'au {new Date(promo.endDate).toLocaleDateString()}</span>
                                            ) : (
                                                <span>Illimitée</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                                            <Link
                                                href={`/dashboard/promotions/${promo.id}`}
                                                className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition shadow-lg"
                                                title="Editer"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(promo.id)}
                                                className="p-3 bg-red-900/30 hover:bg-red-900/50 text-red-500 rounded-xl transition shadow-lg"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {promotions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-6">
                                            <div className="w-24 h-24 bg-gray-750 rounded-full flex items-center justify-center text-gray-600 border-2 border-dashed border-gray-700">
                                                <Gift className="w-12 h-12" />
                                            </div>
                                            <div>
                                                <h3 className="text-white font-black text-2xl mb-2">Aucune promotion active</h3>
                                                <p className="text-gray-400">Commencez par créer votre première offre commerciale.</p>
                                            </div>
                                            <Link
                                                href="/dashboard/promotions/new"
                                                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-3 rounded-xl font-bold transition shadow-xl"
                                            >
                                                Créer une promo
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
