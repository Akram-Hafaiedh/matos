'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Tag, Rocket, Flame, Clock, Sparkles,
    Zap, ShoppingBag, ChevronRight, Timer,
    ArrowRight, Star, Shield, Gift, Target
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AmbientBackground from '@/components/AmbientBackground';
import SectionHeader from '@/components/SectionHeader';
import { useCart } from '@/app/cart/CartContext';
import SelectionModal from '@/components/SelectionModal';
import { useToast } from '@/app/context/ToastContext';

export default function PromosPage() {
    const { addToCart, setCartOpen } = useCart();
    const { toast } = useToast();
    const [promos, setPromos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState<any | null>(null);

    useEffect(() => {
        const fetchPromos = async () => {
            try {
                const res = await fetch('/api/promotions?active=true');
                const data = await res.json();
                if (data.success) {
                    // Map API data to UI requirements
                    const mappedPromos = data.promotions.map((p: any) => ({
                        id: p.id.toString(),
                        title: p.name,
                        badge: p.badgeText || 'SPECIAL',
                        desc: p.description,
                        price: p.price ? `${p.price.toFixed(1)} DT` : 'Varies',
                        oldPrice: p.originalPrice ? `${p.originalPrice.toFixed(1)} DT` : null,
                        image: p.imageUrl,
                        tag: p.tag,
                        isHot: p.isHot,
                        selectionRules: p.selectionRules ? (typeof p.selectionRules === 'string' ? JSON.parse(p.selectionRules) : p.selectionRules) : null,
                        rawItem: p // Keep raw to pass to cart
                    }));
                    setPromos(mappedPromos);
                }
            } catch (error) {
                console.error('Error fetching promos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPromos();
    }, []);

    const handleProfiter = (promo: any) => {
        if (promo.selectionRules && promo.selectionRules.length > 0) {
            setSelectedPromo(promo.rawItem);
            setIsModalOpen(true);
        } else {
            addToCart(promo.rawItem, 'promotion');
            toast.success(`${promo.title} ajouté au panier !`);
            setCartOpen(true);
        }
    };

    const handleConfirmSelection = (item: any, selectedSize?: string, choices?: any) => {
        addToCart(item, 'promotion', selectedSize, choices);
        setIsModalOpen(false);
        toast.success(`${item.name} ajouté au panier !`);
        setCartOpen(true);
    };

    return (
        <div className="min-h-screen bg-transparent text-white font-sans selection:bg-yellow-500/30 overflow-x-hidden pb-40">
            <AmbientBackground />

            {/* HERO / HEADER SECTION */}
            <section className="relative pt-40 pb-24 px-6 flex flex-col items-center text-center">
                <div className="space-y-12 relative z-10 w-full max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-yellow-400/5 border border-yellow-400/10 backdrop-blur-sm shadow-2xl"
                    >
                        <Tag className="w-4 h-4 text-yellow-500 animate-pulse" />
                        <span className="text-yellow-400 font-black text-[10px] uppercase tracking-[0.5em] italic">Contrats en Cours</span>
                    </motion.div>

                    <div className="relative group flex flex-col items-center">
                        <div className="absolute -inset-40 bg-yellow-400/5 blur-[160px] opacity-100 animate-pulse"></div>

                        <div className="relative bg-yellow-400 py-10 px-16 md:px-24 -rotate-1 hover:rotate-0 transition-all duration-700 shadow-[20px_20px_0_rgba(0,0,0,1)] border-4 border-black group overflow-hidden">
                            <h1 className="text-5xl md:text-[8rem] font-[1000] italic uppercase tracking-tighter text-black leading-none inline-block relative z-10 pr-[0.4em]">
                                PROMOS
                            </h1>
                        </div>
                    </div>

                    <p className="max-w-xl mx-auto text-gray-400 font-bold uppercase tracking-[0.2em] leading-relaxed text-xs italic py-6 opacity-60">
                        Saisissez les meilleures opportunités. Les deals du Syndicat <br /> sont limités dans le temps et dans l'espace.
                    </p>
                </div>
            </section>

            {/* PROMOS GRID */}
            <section className="max-w-7xl mx-auto px-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 space-y-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-yellow-400/20 blur-[30px] rounded-full animate-pulse"></div>
                            <Zap className="w-12 h-12 text-yellow-400 animate-spin relative z-10" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 italic animate-pulse">Extraction des Protocoles...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {promos.map((promo: any, idx: number) => (
                            <motion.div
                                key={promo.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                onMouseEnter={() => setHoveredId(promo.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className="group relative bg-[#0a0a0a] border border-white/5 rounded-[4rem] overflow-hidden p-10 hover:border-yellow-400/20 transition-all duration-700 h-full flex flex-col"
                            >
                                <div className="flex flex-col md:flex-row gap-10 h-full">
                                    <div className="md:w-1/2 relative">
                                        <div className="absolute -inset-10 bg-yellow-400/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <Image
                                            src={promo.image}
                                            alt={promo.title}
                                            width={400}
                                            height={400}
                                            className="object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-700 relative z-10"
                                        />
                                        {promo.isHot && (
                                            <div className="absolute top-0 left-0 bg-red-500 text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 z-20">
                                                <Flame className="w-3 h-3 animate-bounce" />
                                                Hot Deal
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:w-1/2 flex flex-col justify-between py-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-yellow-400 font-black text-[9px] uppercase tracking-widest italic">{promo.badge}</span>
                                                {promo.tag && (
                                                    <span className="bg-white/5 border border-white/5 px-3 py-1 rounded-full text-[8px] font-black text-yellow-400 uppercase tracking-widest group-hover:border-yellow-400/30 transition-colors">
                                                        {promo.tag}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-3xl font-[1000] italic uppercase tracking-tighter leading-none">{promo.title}</h3>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-relaxed opacity-60">{promo.desc}</p>
                                        </div>
                                        <div className="pt-8">
                                            <div className="flex items-end gap-3 mb-6">
                                                <span className="text-4xl font-[1000] italic text-yellow-400 leading-none">{promo.price}</span>
                                                {promo.oldPrice && (
                                                    <span className="text-xs font-black text-gray-700 line-through mb-1 uppercase italic">{promo.oldPrice}</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleProfiter(promo)}
                                                className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-yellow-400 transition-all group-hover:scale-[1.02]"
                                            >
                                                Profiter de l'offre
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* FOOTER CTA: SLANTED - SYNCED WITH LOYALTY */}
            <section className="relative mt-40">
                <div
                    className="absolute inset-0 z-0 bg-yellow-400 group"
                    style={{ clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0 100%)' }}
                >
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(black 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                </div>

                <div className="relative z-10 pt-48 pb-24 flex flex-col items-center text-center text-black px-6">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="space-y-12 max-w-4xl">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-black/10 bg-black/5 font-black uppercase italic text-[10px] tracking-widest">
                            <Shield className="w-4 h-4" />
                            Syndicate Protocol
                        </div>
                        <h2 className="text-5xl md:text-[7rem] font-[1000] uppercase italic tracking-tighter leading-[0.7]">
                            PLUS DE <span className="text-black">POINTS</span>. <br />
                            PLUS DE <span className="text-black">DROPS</span>.
                        </h2>
                        <p className="text-black font-black text-[10px] uppercase tracking-widest leading-relaxed max-w-xl opacity-60 italic">
                            Les membres du Syndicat débloquent des réductions cachées sur chaque commande. Votre fidélité est votre monnaie.
                        </p>

                        <div className="pt-6">
                            <Link href="/register" className="relative group overflow-hidden px-12 py-5 bg-black text-white font-[1000] uppercase italic tracking-widest rounded-full text-xs hover:scale-105 transition-all shadow-2xl inline-block">
                                <span className="relative z-10">Rejoindre l'Élite</span>
                                <div className="absolute inset-0 flex items-center justify-center bg-white text-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 font-black uppercase text-xs">Accès Immédiat</div>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <SelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={selectedPromo}
                onConfirm={handleConfirmSelection}
            />
        </div>
    );
}
