'use client';

import { useState } from 'react';
import { X, Lock } from 'lucide-react';

export const FOOD_EMOJIS = [
    // Tier 0 (Bronze/Basic) - People & Basics
    { emoji: '👦', name: 'Garçon', tier: 0 }, { emoji: '👧', name: 'Fille', tier: 0 },
    { emoji: '🍔', name: 'Burger', tier: 0 }, { emoji: '🍕', name: 'Pizza', tier: 0 },
    { emoji: '🍟', name: 'Frites', tier: 0 }, { emoji: '🌭', name: 'Hot Dog', tier: 0 },
    { emoji: '🥪', name: 'Sandwich', tier: 0 }, { emoji: '🌮', name: 'Tacos', tier: 0 },
    { emoji: '🌯', name: 'Burrito', tier: 0 }, { emoji: '🥙', name: 'Kebab', tier: 0 },
    { emoji: '🍗', name: 'Poulet', tier: 0 }, { emoji: '🍖', name: 'Cotelette', tier: 0 },
    { emoji: '🥔', name: 'Pomme de terre', tier: 0 }, { emoji: '🧀', name: 'Fromage', tier: 0 },
    { emoji: '🥚', name: 'Oeuf', tier: 0 }, { emoji: '🍳', name: 'Oeuf plat', tier: 0 },

    // Tier 1 (Silver) - Healthy, Asian, Soups
    { emoji: '🥗', name: 'Salade', tier: 1 }, { emoji: '🥩', name: 'Viande', tier: 1 },
    { emoji: '🍲', name: 'Soupe', tier: 1 }, { emoji: '🥘', name: 'Plat', tier: 1 },
    { emoji: '🍱', name: 'Bento', tier: 1 }, { emoji: '🍘', name: 'Cracker', tier: 1 },
    { emoji: '🍙', name: 'Riz', tier: 1 }, { emoji: '🍛', name: 'Curry', tier: 1 },
    { emoji: '🍜', name: 'Nouilles', tier: 1 }, { emoji: '🍝', name: 'Pates', tier: 1 },
    { emoji: '🍠', name: 'Patate douce', tier: 1 }, { emoji: '🥒', name: 'Concombre', tier: 1 },

    // Tier 2 (Gold) - Sushi, Seafood, Desserts
    { emoji: '🍣', name: 'Sushi', tier: 2 }, { emoji: '🍤', name: 'Crevette', tier: 2 },
    { emoji: '🍥', name: 'Narutomaki', tier: 2 }, { emoji: '🍢', name: 'Brochette', tier: 2 },
    { emoji: '🍡', name: 'Dango', tier: 2 }, { emoji: '🥟', name: 'Dumpling', tier: 2 },
    { emoji: '🥠', name: 'Fortune Cookie', tier: 2 }, { emoji: '🍦', name: 'Glace', tier: 2 },
    { emoji: '🍧', name: 'Sorbet', tier: 2 }, { emoji: '🍨', name: 'Dessert glace', tier: 2 },
    { emoji: '🍩', name: 'Donut', tier: 2 }, { emoji: '🍪', name: 'Cookie', tier: 2 },
    { emoji: '🎂', name: 'Gateau', tier: 2 }, { emoji: '🍰', name: 'Part de gateau', tier: 2 },
    { emoji: '🧁', name: 'Cupcake', tier: 2 }, { emoji: '🥧', name: 'Tarte', tier: 2 },

    // Tier 3 (Platinum) - Premium, Drinks, Alcohol
    { emoji: '🍫', name: 'Chocolat', tier: 3 }, { emoji: '🍬', name: 'Bonbon', tier: 3 },
    { emoji: '🍭', name: 'Sucette', tier: 3 }, { emoji: '🍮', name: 'Flan', tier: 3 },
    { emoji: '🍯', name: 'Miel', tier: 3 }, { emoji: '🥛', name: 'Lait', tier: 3 },
    { emoji: '☕', name: 'Cafe', tier: 3 }, { emoji: '🍵', name: 'The', tier: 3 },
    { emoji: '🍶', name: 'Sake', tier: 3 }, { emoji: '🍾', name: 'Champagne', tier: 3 },
    { emoji: '🍷', name: 'Vin', tier: 3 }, { emoji: '🍸', name: 'Cocktail', tier: 3 },
    { emoji: '🍹', name: 'Boisson', tier: 3 }, { emoji: '🍺', name: 'Biere', tier: 3 },
    { emoji: '🍻', name: 'Bieres', tier: 3 }, { emoji: '🥂', name: 'Trinquons', tier: 3 },
    { emoji: '🥃', name: 'Whisky', tier: 3 }, { emoji: '🥤', name: 'Soda', tier: 3 },
    { emoji: '🧊', name: 'Glacons', tier: 3 }, { emoji: '🦴', name: 'Os', tier: 3 },
    { emoji: '🥯', name: 'Bagel', tier: 3 }, { emoji: '🥞', name: 'Pancakes', tier: 3 },
    { emoji: '🥓', name: 'Bacon', tier: 3 }, { emoji: '🧇', name: 'Gauffre', tier: 3 },
    { emoji: '🦪', name: 'Huitre', tier: 3 }, { emoji: '🐌', name: 'Escargot', tier: 3 }
];

interface EmojiPickerProps {
    selected: string;
    onSelect: (emoji: string) => void;
    label?: string;
    description?: string;
    allowClear?: boolean;
    userTierIndex?: number;
    loyaltyPoints?: number;
    isAdmin?: boolean;
}

export default function EmojiPicker({ selected, onSelect, label, description, allowClear = true, userTierIndex = 999, loyaltyPoints = 0, isAdmin = false }: EmojiPickerProps) {
    const isNewcomer = loyaltyPoints < 100;
    const newcomerAllowed = ['👦', '👧', '🍔', '🍕', '🍟', '🥪', '🌭', '🌮'];

    return (
        <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700">
            {label && <label className="block text-gray-400 font-bold mb-4">{label}</label>}

            <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
                {allowClear && (
                    <button
                        type="button"
                        onClick={() => onSelect('')}
                        className={`aspect-square rounded-xl flex items-center justify-center text-sm transition-all border border-dashed border-gray-600 hover:border-red-500 hover:text-red-500 ${!selected ? 'bg-white/5 border-white/20' : 'text-gray-500'}`}
                        title="Aucun"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                {FOOD_EMOJIS.map((item) => {
                    const effectiveTierIndex = isNewcomer ? 0 : userTierIndex;
                    const isTierLocked = item.tier > effectiveTierIndex;
                    const isNewcomerLocked = isNewcomer && item.tier === 0 && !newcomerAllowed.includes(item.emoji);
                    const isLocked = !isAdmin && (isTierLocked || isNewcomerLocked);

                    return (
                        <button
                            key={item.emoji}
                            type="button"
                            onClick={() => !isLocked && onSelect(item.emoji)}
                            disabled={isLocked}
                            className={`group relative aspect-square rounded-xl flex items-center justify-center text-2xl transition-all 
                                ${isLocked
                                    ? 'bg-gray-900/50 cursor-not-allowed border border-gray-800'
                                    : 'hover:scale-125 hover:z-10 bg-gray-800 text-white hover:bg-gray-700'
                                }
                                ${selected === item.emoji ? 'bg-yellow-400 text-black shadow-lg scale-110 z-10' : ''}
                            `}
                        >
                            <span className={`transition-all duration-300 ${isLocked ? 'filter grayscale opacity-60 scale-90' : 'group-hover:scale-110'}`}>
                                {item.emoji}
                            </span>

                            {isLocked && (
                                <div className="absolute top-1 right-1">
                                    <Lock className="w-3 h-3 text-gray-500/70" />
                                </div>
                            )}

                            {/* Tooltip */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 border border-gray-800 flex flex-col items-center">
                                <span>{item.name}</span>
                                {isNewcomerLocked && <span className="text-[9px] text-yellow-400">Atteignez le rang Bronze pour débloquer</span>}
                                {isTierLocked && !isNewcomerLocked && <span className="text-[9px] text-gray-400">Niveau {['Bronze', 'Silver', 'Gold', 'Platinum'][item.tier]} requis</span>}
                            </div>
                        </button>
                    );
                })}
            </div>
            {description && <p className="text-xs text-gray-500 mt-4">{description}</p>}
        </div>
    );
}
