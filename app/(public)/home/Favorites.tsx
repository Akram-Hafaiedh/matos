import { ArrowRight, ChevronRight, Star, Clock, Zap, Sparkles } from "lucide-react";
import SectionHeader from '@/components/SectionHeader';
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MenuItem } from "@/types/menu";

interface FavoritesProps {
    items: MenuItem[];
}

export default function Favorites({ items }: FavoritesProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const activeItem = items[activeIndex] || items[0];

    // Auto-cycle favorites every 8 seconds if not hovered
    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % Math.min(items.length, 5));
        }, 8000);
        return () => clearInterval(timer);
    }, [items.length, isHovered]);

    if (!items || items.length === 0) return null;

    const getPrice = (price: number | Record<string, number> | null | undefined) => {
        if (!price) return 0;
        if (typeof price === 'number') return price;
        return price.xl || price.normal || price[Object.keys(price)[0]] || 0;
    };

    return (
        <section
            className="py-32 bg-transparent relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <SectionHeader
                    badge="Le Savoir-Faire"
                    title={<>Nos <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-orange-600">Favoris.</span></>}
                    description="Une sélection exclusive de nos créations les plus iconiques, préparées avec une rigueur artisanale."
                    sideDescription={true}
                />

                {/* Immersive Focus Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[700px]">

                    {/* Main Showcase (Focus) */}
                    <div className="lg:col-span-8 relative group">
                        <div className="absolute inset-0 bg-gray-950/40 border-2 border-white/5 rounded-[4rem] overflow-hidden backdrop-blur-3xl transition-all duration-700 group-hover:border-yellow-400/20 shadow-3xl">

                            {/* Technical Scanline Effect */}
                            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-30">
                                <div className="w-full h-[200%] bg-gradient-to-b from-transparent via-yellow-400/[0.02] to-transparent animate-scanline"></div>
                            </div>

                            {/* Large Image Reveal */}
                            <div className="absolute inset-0 flex items-center justify-center p-12 md:p-20">
                                <div key={activeItem?.id} className="relative w-full h-full animate-in fade-in zoom-in duration-1000">
                                    {activeItem?.image && (activeItem.image.startsWith('/') || activeItem.image.startsWith('http')) ? (
                                        <Image
                                            src={activeItem.image}
                                            alt={activeItem.name || 'Product'}
                                            fill
                                            className="object-contain filter drop-shadow-[0_40px_100px_rgba(0,0,0,0.8)] transition-all duration-[2s] group-hover:scale-110 group-hover:rotate-1"
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[15rem] filter drop-shadow-2xl animate-float select-none">
                                            {activeItem?.image || '✨'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Floating Metadata */}
                            <div className="absolute top-12 left-12 z-30 space-y-4">
                                <div className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 animate-bounce-subtle">
                                    <Star className="w-3 h-3 fill-gray-900" />
                                    Signature Mato's
                                </div>
                            </div>

                            {/* Product Info Overlay */}
                            <div className="absolute bottom-12 left-12 right-12 z-30 flex flex-col md:flex-row md:items-end justify-between gap-8">
                                <div className="space-y-4 max-w-xl">
                                    <div className="text-yellow-400 font-black text-[10px] uppercase tracking-[0.5em] italic flex items-center gap-2">
                                        <Zap className="w-3 h-3" />
                                        Exclusivité Gastronomique
                                    </div>
                                    <h3 className="text-5xl md:text-7xl font-[1000] text-white italic tracking-tighter uppercase leading-[0.8] animate-in slide-in-from-left-8 duration-700 overflow-visible">
                                        <span className="inline-block pr-[0.4em] overflow-visible">{activeItem?.name?.split(' ')[0]}</span> <br />
                                        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 pr-[0.4em] overflow-visible">
                                            {activeItem?.name?.split(' ').slice(1).join(' ')}
                                        </span>
                                    </h3>
                                    <p className="text-gray-400/80 font-bold text-sm leading-relaxed italic line-clamp-2 max-w-md">
                                        {activeItem?.ingredients}
                                    </p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Prix Signature</div>
                                        <div className="text-5xl font-black text-white italic tracking-tighter">
                                            {getPrice(activeItem?.price)}
                                            <span className="text-xl text-yellow-400 not-italic ml-1">DT</span>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/menu/${activeItem?.id}`}
                                        className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all shadow-2xl shadow-yellow-400/20 hover:scale-110 active:scale-95 group/btn"
                                    >
                                        <ArrowRight className="w-8 h-8 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* interactive Sidebars / Thumbnails */}
                    <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 h-full">
                        <div className="flex items-center justify-between mb-4 px-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Découvrir aussi</h4>
                            <Sparkles className="w-4 h-4 text-yellow-400/40" />
                        </div>

                        {items.slice(0, 5).map((item, idx) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveIndex(idx)}
                                className={`group relative flex items-center gap-6 p-6 rounded-[2.5rem] border-2 transition-all duration-500 text-left overflow-hidden ${activeIndex === idx
                                    ? 'bg-yellow-400 border-yellow-400 shadow-2xl scale-[1.02]'
                                    : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05]'
                                    }`}
                            >
                                <div className={`relative w-20 h-16 md:w-24 md:h-20 rounded-2xl overflow-hidden transition-all duration-700 ${activeIndex === idx ? 'scale-110 rotate-2' : 'grayscale group-hover:grayscale-0'
                                    }`}>
                                    {item.image?.startsWith('/') ? (
                                        <Image src={item.image} alt={item.name || 'Product'} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl">{item.image}</div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h5 className={`font-black uppercase italic tracking-tighter text-lg truncate transition-colors duration-500 ${activeIndex === idx ? 'text-gray-900' : 'text-white group-hover:text-yellow-400'
                                        }`}>
                                        {item.name}
                                    </h5>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${activeIndex === idx ? 'text-gray-900/60' : 'text-gray-500'
                                            }`}>
                                            {getPrice(item.price)} DT
                                        </span>
                                        {activeIndex === idx && (
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3].map(s => (
                                                    <Star key={s} className="w-2 h-2 fill-gray-900 text-gray-900" />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {activeIndex === idx && (
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-2xl rounded-full -mr-16 -mt-16 animate-pulse"></div>
                                )}
                            </button>
                        ))}

                        {/* View All CTA in sidebar bottom */}
                        <Link
                            href="/menu"
                            className="mt-auto group flex items-center justify-between p-8 rounded-[2.5rem] border-2 border-dashed border-white/10 hover:border-yellow-400/40 transition-all duration-500 hover:bg-yellow-400/5 mt-4"
                        >
                            <span className="text-white font-black uppercase text-[10px] tracking-widest group-hover:text-yellow-400 transition-colors">
                                Explorer tout le menu
                            </span>
                            <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-yellow-400 transition-all group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
