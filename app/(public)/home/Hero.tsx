'use client';

import { useState } from 'react';
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';

const HERO_SLIDES = [
    {
        id: 1,
        title: "The Ultimate Pizza",
        subtitle: "Artisanale",
        tagline: "Une immersion sensorielle au-delà de la gastronomie. Préparée avec une rigueur absolue.",
        image: "/margherita-hero.png",
        accent: "from-yellow-400 to-orange-600"
    },
    {
        id: 2,
        title: "Signature Wagyu Burger",
        subtitle: "Premium",
        tagline: "Le bœuf Wagyu d'exception, sublimé par des ingrédients soigneusement sélectionnés.",
        image: "/wagyu-hero.png",
        accent: "from-orange-400 to-red-600"
    },
    {
        id: 3,
        title: "Atelier Baguette",
        subtitle: "Tradition",
        tagline: "Le pain croustillant rencontre des garnitures gourmandes pour un plaisir authentique.",
        image: "/images/baguette_farcie.png",
        accent: "from-yellow-300 to-yellow-600"
    }
];

interface HeroProps {
    currentSlide: number;
    setCurrentSlide: (index: number) => void;
}

export default function Hero({ currentSlide, setCurrentSlide }: HeroProps) {
    const slide = HERO_SLIDES[currentSlide % HERO_SLIDES.length];

    return (
        <section className="relative h-screen min-h-[700px] overflow-hidden bg-transparent">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="h-full w-full flex flex-col lg:flex-row relative"
                >
                    {/* Left: Product (Asymmetric) */}
                    <div className="lg:w-[55%] h-[40%] lg:h-full relative overflow-hidden bg-[#050505]">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/[0.03] to-transparent"></div>
                        <motion.div
                            initial={{ scale: 1.3, rotate: -15, y: 100, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, y: 0, opacity: 1 }}
                            transition={{ duration: 1.2, ease: "circOut" }}
                            className="absolute inset-0 flex items-center justify-center p-12 md:p-24"
                        >
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                width={1000}
                                height={1000}
                                className="object-contain filter drop-shadow-[0_40px_100px_rgba(0,0,0,0.8)] scale-110 lg:scale-[1.6]"
                                priority
                            />
                        </motion.div>

                        {/* Visual Label */}
                        <div className="absolute top-12 left-12 md:top-32 md:left-24">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="flex flex-col gap-2"
                            >
                                <span className="text-yellow-400 font-black text-[10px] uppercase tracking-[0.8em] italic">{slide.subtitle}</span>
                                <div className="h-px w-24 bg-yellow-400/30"></div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right: Typography (Kinetic) */}
                    <div className="lg:w-[45%] h-[60%] lg:h-full flex flex-col justify-center p-8 md:p-24 space-y-12 relative z-10 bg-black">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-4"
                            >
                                <div className="w-12 h-1 bg-yellow-400 rounded-full"></div>
                                <span className="text-yellow-400 font-black uppercase text-[10px] tracking-[0.4em] italic">Mato's Elite Series</span>
                            </motion.div>

                            <h1 className="text-6xl md:text-9xl font-[1000] italic uppercase tracking-tighter leading-[0.8] text-white">
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="inline-block pr-[0.4em]"
                                >
                                    {slide.title.split(' ').slice(0, 2).join(' ')} <br />
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.9 }}
                                    className={`text-transparent bg-clip-text bg-gradient-to-b ${slide.accent} block pr-[0.4em]`}
                                >
                                    {slide.title.split(' ').slice(2).join(' ')}
                                </motion.span>
                            </h1>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.1 }}
                            className="text-gray-500 font-bold text-lg max-w-sm italic tracking-wide leading-relaxed"
                        >
                            {slide.tagline}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.3 }}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-8"
                        >
                            <Link href="/menu" className="bg-yellow-400 text-black px-16 py-8 rounded-[3rem] font-[1000] uppercase text-[14px] italic tracking-tight hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-yellow-400/40 flex items-center gap-4 group">
                                Explore Edition
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Border Accents */}
                    <div className="absolute top-0 bottom-0 left-[55%] w-px bg-white/5 hidden lg:block"></div>
                </motion.div>
            </AnimatePresence>

            {/* Slider Navigation Indicators */}
            <div className="absolute bottom-12 left-8 md:left-24 lg:left-[55%] lg:-translate-x-1/2 z-50 flex gap-4">
                {HERO_SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`group relative h-1.5 transition-all duration-500 rounded-full overflow-hidden ${i === (currentSlide % HERO_SLIDES.length) ? 'w-24 bg-white/20' : 'w-8 bg-white/5 hover:bg-white/10'}`}
                    >
                        {i === (currentSlide % HERO_SLIDES.length) && (
                            <motion.div
                                layoutId="active-bar"
                                className="absolute inset-0 bg-yellow-400"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Scroll Indicator (Refined) */}
            <div className="absolute bottom-12 right-12 z-30 hidden lg:flex flex-col items-center gap-6 group">
                <div className="[writing-mode:vertical-lr] text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] group-hover:text-yellow-400 transition-colors cursor-default">
                    Explore Mato's Spirit
                </div>
                <div className="w-px h-24 bg-gradient-to-b from-yellow-400 via-yellow-400/20 to-transparent relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 animate-scroll-indicator"></div>
                </div>
            </div>
        </section>
    );
}
