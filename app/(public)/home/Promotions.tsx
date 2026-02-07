'use client';

import { ChevronRight, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "../../cart/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/SectionHeader";
import SelectionModal from "@/components/SelectionModal";

interface PromotionsProps {
    promos: any[];
    promoSlide?: number;
    onSlideChange?: (index: number) => void;
}

export default function Promotions({ promos, promoSlide: controlledSlide, onSlideChange }: PromotionsProps) {
    const { addToCart } = useCart();
    const [configPromo, setConfigPromo] = useState<any>(null);
    const [internalSlide, setInternalSlide] = useState(0);

    const isControlled = controlledSlide !== undefined;
    const activeSlideIndex = isControlled ? controlledSlide : internalSlide;

    useEffect(() => {
        if (isControlled || promos.length <= 1) return;
        const timer = setInterval(() => {
            setInternalSlide((prev) => (prev + 1) % promos.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [isControlled, promos.length]);

    const handleSlideChange = (index: number) => {
        if (onSlideChange) {
            onSlideChange(index);
        } else {
            setInternalSlide(index);
        }
    };

    const handleAddToCart = (promo: any) => {
        let rules = promo.selectionRules;
        if (typeof rules === 'string') {
            try { rules = JSON.parse(rules); } catch (e) { rules = []; }
        }

        if (rules && Array.isArray(rules) && rules.length > 0) {
            setConfigPromo({ ...promo, selectionRules: rules });
        } else {
            addToCart(promo, 'promotion');
        }
    };

    if (promos.length === 0) return null;

    const currentPromo = promos[activeSlideIndex % promos.length];

    return (
        <section className="py-12 md:py-16 bg-transparent relative overflow-hidden">


            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <SectionHeader
                    badge="Sélection Gourmet"
                    title={<>Nos <span className="text-yellow-400">Promos.</span></>}
                    description="Découvrez des saveurs d'exception à des prix privilégiés."
                    sideDescription={true}
                />

                {/* Main Card - More Compact min-h */}
                <div className="bg-[#080808] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-3xl relative min-h-[400px] md:h-[480px] flex items-center">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPromo.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full flex flex-col md:flex-row h-full"
                        >
                            {/* Left: Visual (Pizza/Image) */}
                            <div className="w-full md:w-[45%] relative bg-[#0c0c0c] flex items-center justify-center p-10 overflow-hidden group">
                                {/* Yellow Glow behind image */}
                                <div className="absolute inset-0 bg-yellow-400/[0.03] blur-[80px] group-hover:bg-yellow-400/[0.06] transition-all duration-700" />

                                {/* Badge - Compact & Fixed Logic */}
                                <div className="absolute top-6 left-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2 flex flex-col items-center z-20">
                                    <span className="text-[9px] font-black uppercase text-yellow-500/80 tracking-widest">Offre</span>
                                    <span className="text-lg font-[1000] text-white italic leading-none mt-1">
                                        {currentPromo.price
                                            ? `${currentPromo.price} DT`
                                            : (currentPromo.discount ? `-${currentPromo.discount}%` : 'SPECIAL')}
                                    </span>
                                </div>

                                <motion.div
                                    className="relative w-full h-[220px] md:h-full flex items-center justify-center"
                                    initial={{ scale: 0.8, rotate: -3 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.5, ease: "backOut" }}
                                >
                                    {currentPromo.imageUrl && (currentPromo.imageUrl.startsWith('http') || currentPromo.imageUrl.startsWith('/')) ? (
                                        <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                                            <Image
                                                src={currentPromo.imageUrl}
                                                alt={currentPromo.name}
                                                fill
                                                className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-[12rem] md:text-[18rem] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] leading-none select-none">
                                            {currentPromo.emoji || '🍕'}
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            {/* Right: Content */}
                            <div className="w-full md:w-[55%] p-10 md:p-14 flex flex-col justify-center bg-[#080808] relative">
                                {/* Decor */}
                                <div className="absolute top-8 left-8 flex items-center gap-2 opacity-60">
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-yellow-500" />)}
                                    </div>
                                    <span className="text-yellow-500 font-bold uppercase tracking-[0.2em] text-[8px]">Prestige Series</span>
                                </div>

                                <div className="space-y-4 mt-6 relative z-10 w-full">
                                    <h2 className="text-5xl md:text-7xl font-[1000] text-white uppercase italic leading-[0.85] tracking-tighter overflow-visible text-ellipsis pr-[0.4em] inline-block">
                                        {currentPromo.name}
                                    </h2>

                                    <div className="text-5xl md:text-7xl font-[1000] text-yellow-500 italic tracking-tighter scale-y-110 origin-left pr-[0.4em] overflow-visible">
                                        = {currentPromo.discount ? `-${currentPromo.discount}%` : 'SPECIAL'}
                                    </div>

                                    <p className="text-gray-400 font-bold text-sm md:text-base italic max-w-md border-l-2 border-white/10 pl-6 py-1 leading-relaxed">
                                        {currentPromo.description || "Une expérience gustative unique réservée à nos membres."}
                                    </p>
                                </div>

                                <div className="mt-8 flex flex-col sm:flex-row items-center gap-6">
                                    <button
                                        onClick={() => handleAddToCart(currentPromo)}
                                        className="bg-yellow-400 text-black px-10 py-4 rounded-xl font-[1000] uppercase text-[10px] tracking-[0.2em] hover:bg-white hover:scale-105 active:scale-95 transition-all w-full sm:w-auto flex items-center justify-center gap-2 group/btn"
                                    >
                                        En Profiter
                                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>

                                    <Link href="/promos" className="text-gray-500 font-black uppercase text-[9px] tracking-[0.3em] flex items-center gap-2 hover:text-white transition-colors group">
                                        VOIR TOUT <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Compact Pagination */}
                    <div className="absolute bottom-6 left-1/2 md:left-auto md:right-10 -translate-x-1/2 md:translate-x-0 flex gap-2 z-20">
                        {promos.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => handleSlideChange(i)}
                                className={`h-1 rounded-full transition-all duration-300 ${i === activeSlideIndex ? 'w-10 bg-yellow-400' : 'w-4 bg-white/10 hover:bg-white/20'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Selection Modal for Promotions */}
            <AnimatePresence>
                {configPromo && (
                    <SelectionModal
                        isOpen={!!configPromo}
                        onClose={() => setConfigPromo(null)}
                        item={configPromo}
                        onConfirm={(item, size, choices) => {
                            addToCart(item, 'promotion', size, choices);
                            setConfigPromo(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </section >
    );
}
