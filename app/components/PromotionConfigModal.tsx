'use client';

import { useState, useEffect } from 'react';
import { X, Check, Loader2, Info, ArrowRight } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import Image from 'next/image';

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
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-3xl animate-scale-up relative">

                {/* Decorative background glow */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-400/10 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

                {/* Header */}
                <div className="p-8 pb-4 relative z-10 flex items-start justify-between">
                    <div>
                        <p className="text-yellow-400 font-black uppercase tracking-widest text-[10px] mb-2">Configuration requise</p>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">
                            Personnalisez <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">votre offre</span>
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-800 rounded-full text-gray-500 hover:text-white transition-all transform hover:rotate-90"
                    >
                        <X className="w-8 h-8" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto max-h-[60vh] space-y-10 scrollbar-hide relative z-10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative">
                                <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 animate-pulse"></div>
                                <Loader2 className="w-12 h-12 text-yellow-400 animate-spin relative z-10" />
                            </div>
                            <p className="text-gray-400 mt-4 text-sm font-bold uppercase tracking-widest">Chargement des options...</p>
                        </div>
                    ) : (
                        rules.map((rule: any, index: number) => (
                            <div key={rule.id} className="space-y-6 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <h3 className="text-lg font-black text-white flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-yellow-400 text-gray-900 flex items-center justify-center text-sm font-black shadow-lg shadow-yellow-400/20">
                                        {index + 1}
                                    </div>
                                    <span className="uppercase tracking-tight">{rule.label}</span>
                                </h3>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {categoryItems[rule.categoryId]?.map((item: MenuItem) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleSelect(rule.id, item)}
                                            className={`group relative p-3 rounded-2xl border transition-all duration-300 text-left overflow-hidden ${choices[rule.id]?.id === item.id
                                                ? 'bg-yellow-400 border-yellow-400 shadow-xl shadow-yellow-400/20 scale-[1.02]'
                                                : 'bg-gray-800/50 border-gray-700 hover:border-gray-500 hover:bg-gray-800'
                                                }`}
                                        >
                                            {choices[rule.id]?.id === item.id && (
                                                <div className="absolute top-2 right-2 z-20 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-yellow-400" />
                                                </div>
                                            )}

                                            <div className="relative z-10">
                                                <div className="text-sm font-black uppercase leading-tight mb-1 truncate transition-colors duration-300 ${choices[rule.id]?.id === item.id ? 'text-gray-900' : 'text-white'}`">
                                                    <span className={choices[rule.id]?.id === item.id ? 'text-gray-900' : 'text-white'}>
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <div className={`text-[10px] line-clamp-2 ${choices[rule.id]?.id === item.id ? 'text-gray-800 font-bold' : 'text-gray-500'}`}>
                                                    {Array.isArray(item.ingredients) ? item.ingredients.join(', ') : (item.ingredients || '')}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}

                    {rules.length === 0 && !loading && (
                        <div className="text-center py-12 bg-gray-800/30 rounded-3xl border border-dashed border-gray-700">
                            <Info className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-300 font-bold text-lg">Aucune configuration requise.</p>
                            <p className="text-gray-500 text-sm mt-1">Vous pouvez ajouter cette offre directement.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 bg-gray-900/80 backdrop-blur-xl border-t border-gray-800 flex gap-4 relative z-20">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-2xl transition uppercase tracking-widest text-xs"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!isComplete || loading}
                        className={`flex-[2] py-4 font-black rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide text-xs ${isComplete
                            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 hover:scale-[1.02] shadow-yellow-400/20'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                            }`}
                    >
                        <span>Confirmer & Ajouter</span>
                        {isComplete && <ArrowRight className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
