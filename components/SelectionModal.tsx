'use client';

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";

interface SelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
    onConfirm: (item: any, selectedSize?: string, choices?: any) => void;
}

interface SelectionRule {
    id: string;
    label: string;
    quantity: number;
    categoryId: number;
}

export default function SelectionModal({ isOpen, onClose, item, onConfirm }: SelectionModalProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [wizardSelections, setWizardSelections] = useState<Record<string, any[]>>({});
    const [stepItems, setStepItems] = useState<any[]>([]);
    const [isLoadingStep, setIsLoadingStep] = useState(false);

    // Initial item analysis
    const hasSelectionRules = item?.selectionRules && Array.isArray(item.selectionRules) && item.selectionRules.length > 0;
    const isMultiSize = item?.price && typeof item.price === 'object';

    // Reset state ONLY when item changes
    useEffect(() => {
        if (item) {
            // Reset Wizard State
            setCurrentStep(0);
            setWizardSelections({});

            // Reset Simple State
            if (isMultiSize) {
                const sizes = Object.keys(item.price);
                if (sizes.length > 0) setSelectedSize(sizes[0]);
            } else {
                setSelectedSize(null);
            }
        }
    }, [item, isMultiSize]);

    // Fetch Wizard Step Items
    useEffect(() => {
        if (!isOpen || !item || !hasSelectionRules) return;

        const currentRule = item.selectionRules[currentStep];
        if (currentRule?.categoryId) {
            const fetchStepItems = async () => {
                setIsLoadingStep(true);
                try {
                    const res = await fetch(`/api/menu-items?categoryId=${currentRule.categoryId}&limit=50&status=active`);
                    const data = await res.json();
                    if (data.success) {
                        setStepItems(data.menuItems);
                    }
                } catch (error) {
                    console.error("Failed to fetch step items", error);
                } finally {
                    setIsLoadingStep(false);
                }
            };
            fetchStepItems();
        }
    }, [isOpen, item, currentStep, hasSelectionRules]);

    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('selection-modal-open');
        } else {
            document.body.classList.remove('selection-modal-open');
        }
        return () => document.body.classList.remove('selection-modal-open');
    }, [isOpen]);



    // Helper: Handle Wizard Item Toggle
    const toggleWizardItem = (ruleId: string, maxQty: number, selectedItem: any) => {
        setWizardSelections(prev => {
            const current = prev[ruleId] || [];
            const isSelected = current.some((i: any) => i.id === selectedItem.id);

            if (isSelected) {
                return { ...prev, [ruleId]: current.filter((i: any) => i.id !== selectedItem.id) };
            } else {
                if (current.length >= maxQty) return prev; // Max reached
                return { ...prev, [ruleId]: [...current, selectedItem] };
            }
        });
    };

    // Helper: Wizard Navigation
    const handleNextStep = () => {
        if (currentStep < item.selectionRules.length - 1) {
            setCurrentStep(p => p + 1);
        } else {
            // Final Confirm
            onConfirm(item, undefined, wizardSelections);
            // Reset for next time
            setCurrentStep(0);
            setWizardSelections({});
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(p => p - 1);
        }
    };

    const currentRule = hasSelectionRules ? item.selectionRules[currentStep] : null;
    const currentSelections = currentRule ? (wizardSelections[currentRule.id] || []) : [];
    const isStepValid = currentRule ? currentSelections.length === currentRule.quantity : true;

    // Style constants
    const styles = {
        icon: <ShoppingBag className="w-8 h-8" />,
        bg: 'bg-yellow-400/10',
        border: 'border-yellow-400/30',
        text: 'text-yellow-400',
        button: 'bg-yellow-400 hover:bg-yellow-300 text-gray-900 shadow-yellow-400/20',
        glow: 'bg-yellow-400/5'
    };

    // Calculate selection total for the wizard
    const selectionTotal = useMemo(() => {
        let total = 0;
        Object.values(wizardSelections).forEach(items => {
            if (Array.isArray(items)) {
                items.forEach(item => {
                    if (item.price) {
                        if (typeof item.price === 'number') {
                            total += item.price;
                        } else if (typeof item.price === 'object') {
                            // If multi-size, take the XL or the first available price
                            total += item.price.xl || Object.values(item.price)[0] || 0;
                        }
                    }
                });
            }
        });
        return total;
    }, [wizardSelections]);

    if (!item) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className={`bg-[#0a0a0a] border border-white/10 w-full ${hasSelectionRules ? 'max-w-2xl' : 'max-w-lg'} rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden transition-all duration-500`}
                        style={{ borderColor: 'rgba(250,204,21,0.2)' }}
                    >
                        {/* Decorative Background */}
                        <div className={`absolute top-0 right-0 w-64 h-64 ${styles.glow} rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none`}></div>

                        {/* Close Button UI */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-gray-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full z-20"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative z-10 flex flex-col items-center text-center">

                            {/* Product Visual (Only for Simple Mode or Header of Wizard) */}
                            {!hasSelectionRules && (
                                <div className="mb-8 relative w-32 h-32 flex items-center justify-center">
                                    <div className={`absolute inset-0 ${styles.bg} blur-2xl rounded-full opacity-50`}></div>
                                    <motion.div
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="relative z-10"
                                    >
                                        {(item.image || item.imageUrl) && ((item.image || item.imageUrl).startsWith('/') || (item.image || item.imageUrl).startsWith('http')) ? (
                                            <Image
                                                src={item.image || item.imageUrl}
                                                alt={item.name}
                                                width={128}
                                                height={128}
                                                className="object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                                            />
                                        ) : (
                                            <span className="text-7xl filter drop-shadow-[0_10px_20px_rgba(250,204,21,0.2)]">{item.image || item.emoji || '🍽️'}</span>
                                        )}
                                    </motion.div>
                                </div>
                            )}

                            {/* Header */}
                            <div className="space-y-2 mb-8 w-full">
                                <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${styles.text} italic`}>
                                    {hasSelectionRules ? `Étape ${currentStep + 1} / ${item.selectionRules.length}` : (item.category?.name || item.category || 'Special')}
                                </span>
                                <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter leading-none text-white max-w-sm mx-auto">
                                    {hasSelectionRules ? currentRule?.label : item.name}
                                </h2>
                                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest px-4 line-clamp-2">
                                    {hasSelectionRules
                                        ? `Sélectionnez ${currentRule?.quantity} élément(s)`
                                        : (isMultiSize ? 'Sélectionnez votre format' : (item.description || item.ingredients || 'Délice Signature'))
                                    }
                                </p>
                            </div>

                            {/* --- WIZARD CONTENT --- */}
                            {/* --- WIZARD CONTENT --- */}
                            {hasSelectionRules ? (
                                <div className="w-full h-[500px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
                                    {isLoadingStep ? (
                                        <div className="h-full flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            {stepItems.map((stepItem: any) => {
                                                const isSelected = (wizardSelections[currentRule.id] || []).some((i: any) => i.id === stepItem.id);
                                                return (
                                                    <button
                                                        key={stepItem.id}
                                                        onClick={() => toggleWizardItem(currentRule.id, currentRule.quantity, stepItem)}
                                                        className={`group relative w-full h-[280px] rounded-[2.5rem] border transition-all duration-500 flex flex-col items-center overflow-hidden ${isSelected
                                                            ? 'bg-[#0a0a0a] border-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.15)]'
                                                            : 'bg-[#0a0a0a] border-white/[0.04] hover:border-yellow-400/20 hover:bg-[#0f0f0f]'
                                                            }`}
                                                    >
                                                        {/* Selection Indicator */}
                                                        <div className={`absolute top-4 right-4 z-20 transition-all duration-300 ${isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                                                            <div className="bg-yellow-400 text-black rounded-full p-2 shadow-xl">
                                                                <Check className="w-4 h-4" strokeWidth={4} />
                                                            </div>
                                                        </div>

                                                        {/* Image Section (Top 60%) */}
                                                        <div className="relative w-full h-[60%] bg-[#050505] flex items-center justify-center overflow-hidden p-6 group-hover:bg-[#080808] transition-colors">
                                                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                            <motion.div
                                                                className="relative w-full h-full flex items-center justify-center"
                                                                whileHover={{ scale: 1.1, rotate: 2 }}
                                                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                                            >
                                                                {(() => {
                                                                    const itemImage = stepItem.image || stepItem.imageUrl;
                                                                    const hasImageProtocol = itemImage && (itemImage.startsWith('/') || itemImage.startsWith('http'));

                                                                    return hasImageProtocol ? (
                                                                        <div className="relative w-32 h-32 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                                                                            <Image
                                                                                src={itemImage}
                                                                                alt={stepItem.name}
                                                                                fill
                                                                                className="object-contain"
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <span className="text-7xl filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                                                                            {itemImage || '🍽️'}
                                                                        </span>
                                                                    );
                                                                })()}
                                                            </motion.div>
                                                        </div>

                                                        {/* Content Section (Bottom 40%) */}
                                                        <div className="relative w-full h-[40%] bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
                                                            <h3 className={`text-sm md:text-base font-[1000] uppercase italic tracking-tighter text-center leading-[0.9] transition-colors duration-300 ${isSelected ? 'text-yellow-400' : 'text-white group-hover:text-yellow-400'}`}>
                                                                {stepItem.name}
                                                            </h3>
                                                            {(() => {
                                                                const price = stepItem.price;
                                                                if (!price) return null;
                                                                const displayPrice = typeof price === 'number' ? price : (price.xl || Object.values(price)[0] || 0);
                                                                if (displayPrice <= 0) return null;
                                                                return (
                                                                    <span className="mt-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                                        +{Number(displayPrice).toFixed(1)} DT
                                                                    </span>
                                                                );
                                                            })()}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* --- SIMPLE SELECTION CONTENT --- */
                                <div className="w-full space-y-6 mb-8">
                                    {isMultiSize ? (
                                        <div className="grid grid-cols-1 gap-3">
                                            {Object.entries(item.price as Record<string, number>).map(([size, price]) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`p-6 rounded-[2rem] border transition-all duration-300 flex items-center justify-between group/opt ${selectedSize === size
                                                        ? 'bg-[#0a0a0a] border-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.1)]'
                                                        : 'bg-[#0a0a0a] border-white/[0.04] hover:bg-[#0f0f0f] hover:border-yellow-400/20'
                                                        }`}
                                                >
                                                    <div className="flex flex-col items-start gap-1">
                                                        <span className={`text-lg font-[1000] uppercase italic tracking-tighter transition-colors ${selectedSize === size ? 'text-yellow-400' : 'text-white group-hover/opt:text-yellow-400'}`}>
                                                            Format {size.toUpperCase()}
                                                        </span>
                                                        <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Taille Standard</span>
                                                    </div>
                                                    <div className="text-xl font-[1000] italic tracking-tighter text-white">
                                                        {Number(price).toFixed(1)} <span className="text-sm text-gray-600 not-italic">DT</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-[#0a0a0a] rounded-[2rem] p-6 border border-white/[0.04] flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Prix Unique</span>
                                            <div className="text-3xl font-[1000] italic text-white tracking-tighter">
                                                {Number(item.price).toFixed(1)} <span className="text-lg text-gray-600 not-italic">DT</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Footer Actions */}
                            <div className="w-full flex gap-4 mt-auto">
                                {hasSelectionRules && currentStep > 0 ? (
                                    <button
                                        onClick={handlePrevStep}
                                        className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Retour
                                    </button>
                                ) : (
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest transition-all"
                                    >
                                        Annuler
                                    </button>
                                )}

                                <button
                                    onClick={hasSelectionRules ? handleNextStep : () => {
                                        onConfirm(item, selectedSize || undefined);
                                    }}
                                    disabled={hasSelectionRules && !isStepValid}
                                    className={`flex-[2] py-4 rounded-xl ${styles.button} font-black uppercase text-[10px] tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <span>{hasSelectionRules && currentStep < item.selectionRules.length - 1 ? 'Suivant' : 'Confirmer'}</span>
                                    {hasSelectionRules && currentStep < item.selectionRules.length - 1 ? (
                                        <ArrowRight className="w-4 h-4" />
                                    ) : (
                                        <div className="flex flex-col items-end">
                                            {item.discount && hasSelectionRules && (
                                                <span className="text-[8px] text-gray-500 line-through font-bold mb-0.5">
                                                    {selectionTotal.toFixed(1)} DT
                                                </span>
                                            )}
                                            <span className="text-xs bg-black/10 px-2 py-0.5 rounded-md flex items-center gap-2">
                                                {item.discount && (
                                                    <span className="text-yellow-400 font-black italic -ml-1">
                                                        -{item.discount}%
                                                    </span>
                                                )}
                                                <span>
                                                    {hasSelectionRules
                                                        ? (item.discount ? (selectionTotal * (1 - item.discount / 100)).toFixed(1) : selectionTotal.toFixed(1))
                                                        : (isMultiSize ? (item.price as any)[selectedSize!]?.toFixed(1) : Number(item.price || 0).toFixed(1))
                                                    }
                                                </span>
                                            </span>
                                        </div>
                                    )}
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
