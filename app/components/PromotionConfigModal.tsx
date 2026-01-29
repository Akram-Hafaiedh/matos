'use client';

import { useState, useEffect } from 'react';
import { X, Check, Loader2, Info } from 'lucide-react';
import { MenuItem } from '@/types/menu';

interface PromotionConfigModalProps {
    promotion: any;
    onClose: () => void;
    onConfirm: (choices: any) => void;
}

export default function PromotionConfigModal({ promotion, onClose, onConfirm }: PromotionConfigModalProps) {
    const rules = promotion.selectionRules || [];
    const [choices, setChoices] = useState<any>({});
    const [categoryItems, setCategoryItems] = useState<Record<number, MenuItem[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllNeededCategories = async () => {
            const categoryIds = Array.from(new Set(rules
                .filter((r: any) => r.type === 'category')
                .map((r: any) => r.categoryId)
            ));

            try {
                const results = await Promise.all(categoryIds.map(async (id) => {
                    const res = await fetch(`/api/menu-items?categoryId=${id}`);
                    const data = await res.json();
                    return { id, items: data.menuItems || [] };
                }));

                const itemsMap: Record<number, MenuItem[]> = {};
                results.forEach(res => {
                    itemsMap[res.id as number] = res.items;
                });
                setCategoryItems(itemsMap);
            } catch (error) {
                console.error("Failed to fetch choice items", error);
            } finally {
                setLoading(false);
            }
        };

        if (rules.length > 0) {
            fetchAllNeededCategories();
        } else {
            setLoading(false);
        }
    }, [rules]);

    const handleSelect = (ruleId: string, item: MenuItem) => {
        setChoices((prev: any) => ({
            ...prev,
            [ruleId]: item
        }));
    };

    const isComplete = rules.every((rule: any) => choices[rule.id]);

    const handleConfirm = () => {
        if (isComplete) {
            onConfirm(choices);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 border-2 border-gray-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-scale-up">
                {/* Header */}
                <div className="p-6 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white">Configurer votre offre</h2>
                        <p className="text-yellow-400 font-bold">{promotion.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full text-gray-400 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[70vh] space-y-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-10 h-10 text-yellow-400 animate-spin mb-4" />
                            <p className="text-gray-400">Chargement des options...</p>
                        </div>
                    ) : (
                        rules.map((rule: any) => (
                            <div key={rule.id} className="space-y-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-yellow-400 text-gray-900 flex items-center justify-center text-sm font-black">
                                        {rules.indexOf(rule) + 1}
                                    </div>
                                    {rule.label}
                                </h3>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {categoryItems[rule.categoryId]?.map((item: MenuItem) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleSelect(rule.id, item)}
                                            className={`relative p-3 rounded-2xl border-2 transition text-left group ${choices[rule.id]?.id === item.id
                                                ? 'bg-yellow-400/10 border-yellow-400'
                                                : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                                }`}
                                        >
                                            {choices[rule.id]?.id === item.id && (
                                                <div className="absolute top-2 right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-gray-900" />
                                                </div>
                                            )}
                                            <div className="text-sm font-bold text-white line-clamp-1 group-hover:text-yellow-400 transition">
                                                {item.name}
                                            </div>
                                            <div className="text-[10px] text-gray-500 line-clamp-2 mt-1">
                                                {Array.isArray(item.ingredients) ? item.ingredients.join(', ') : (item.ingredients || '')}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}

                    {rules.length === 0 && !loading && (
                        <div className="text-center py-8">
                            <Info className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">Aucune configuration requise pour cette offre.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-800 border-t border-gray-700 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-2xl transition"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!isComplete || loading}
                        className={`flex-1 py-4 font-black rounded-2xl transition shadow-lg ${isComplete
                            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 shadow-yellow-400/20'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed border-2 border-gray-700'
                            }`}
                    >
                        Confirmer & Ajouter
                    </button>
                </div>
            </div>
        </div>
    );
}
