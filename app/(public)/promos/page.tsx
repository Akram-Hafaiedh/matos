// app/(public)/promos/page.tsx
'use client';

import {
    Flame,
    Percent,
    Gift,
    Clock,
    Star,
    ShoppingCart,
    Users,
    Zap,
    TrendingUp,
    Sparkles,
    ChevronRight,
    ArrowRight,
    Tag,
    Info
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../cart/CartContext';
import { useEffect, useState } from 'react';
import PromotionConfigModal from '@/app/components/PromotionConfigModal';

export default function PromosPage() {
    const { addToCart } = useCart();
    const [promos, setPromos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [configPromo, setConfigPromo] = useState<any>(null);

    useEffect(() => {
        const fetchPromos = async () => {
            try {
                const res = await fetch('/api/promotions?active=true');
                const data = await res.json();
                if (data.success) {
                    setPromos(processPromos(data.promotions));
                }
            } catch (error) {
                console.error("Failed to fetch promos", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPromos();
    }, []);

    const processPromos = (items: any[]) => {
        return items.map((promo, index) => {
            const getColor = () => {
                if (promo.bestseller) return 'from-yellow-400 to-orange-500';
                if (promo.hot) return 'from-red-500 to-rose-600';
                if (promo.popular) return 'from-indigo-500 to-purple-600';
                return ['from-emerald-400 to-teal-500', 'from-blue-500 to-indigo-600', 'from-pink-500 to-rose-600'][index % 3];
            };

            const getBadge = () => {
                if (promo.bestseller) return 'MEILLEURE VENTE';
                if (promo.popular) return 'TRÈS POPULAIRE';
                if (promo.hot) return 'OFFRE DUO';
                return 'OFFRE SPÉCIALE';
            };

            return {
                ...promo,
                uiColor: getColor(),
                uiBadge: promo.badgeText || getBadge(),
                displayDescription: promo.description
            };
        });
    }

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

    const confirmPromotion = (choices: any) => {
        addToCart(configPromo, 'promotion', undefined, choices);
        setConfigPromo(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-24 px-4 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-400/5 blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[130px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto space-y-24 relative z-10">
                {/* Header Section */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-sm font-black uppercase tracking-widest animate-fade-in">
                        <Flame className="w-4 h-4 animate-pulse" />
                        Le coin des bonnes affaires
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none animate-slide-up">
                        Nos <span className="text-yellow-400 italic">Promos</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-bold animate-fade-in delay-200">
                        Savourez vos plats préférés à prix réduits. Des offres exclusives conçues pour votre plaisir (et votre portefeuille).
                    </p>
                </div>

                {/* Promo Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {promos.map((promo, idx) => (
                        <div
                            key={promo.id}
                            className="group bg-gray-900/40 border border-gray-800 rounded-[3rem] overflow-hidden backdrop-blur-3xl hover:border-yellow-400/30 transition-all duration-500 flex flex-col h-full"
                        >
                            {/* Visual Header */}
                            <div className={`relative h-56 bg-gradient-to-br ${promo.uiColor} p-8 flex items-center justify-center overflow-hidden`}>
                                {/* Abstract Shapes */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>

                                {/* Emoji/Image Wrapper */}
                                <div className="relative z-10 text-8xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12 filter drop-shadow-2xl">
                                    {promo.imageUrl && (promo.imageUrl.startsWith('http') || promo.imageUrl.startsWith('/')) ? (
                                        <div className="w-32 h-32 relative">
                                            <Image
                                                src={promo.imageUrl}
                                                alt={promo.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    ) : (
                                        promo.emoji || '🎁'
                                    )}
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute top-6 right-6 bg-black/20 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                        {promo.uiBadge}
                                    </span>
                                </div>

                                {/* Discount Tag */}
                                {promo.discount && (
                                    <div className="absolute bottom-6 left-6 bg-white text-gray-900 px-4 py-2 rounded-2xl font-black shadow-xl shadow-black/20 transform -rotate-12">
                                        -{promo.discount}%
                                    </div>
                                )}
                            </div>

                            {/* Content Section */}
                            <div className="p-10 space-y-6 flex-grow flex flex-col">
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-black text-white group-hover:text-yellow-400 transition-colors">
                                        {promo.name}
                                    </h3>
                                    <p className="text-gray-500 font-bold leading-relaxed line-clamp-3">
                                        {promo.displayDescription}
                                    </p>
                                </div>

                                {/* Features / Constraints */}
                                <div className="flex flex-wrap gap-2">
                                    {promo.name.includes('Family') && (
                                        <span className="bg-white/5 border border-white/5 px-3 py-1 rounded-full text-[10px] font-black uppercase text-gray-400 flex items-center gap-1.5">
                                            <Users className="w-3 h-3" /> Idéal Famille
                                        </span>
                                    )}
                                    {promo.name.includes('Étudiant') && (
                                        <span className="bg-indigo-500/10 border border-indigo-500/10 px-3 py-1 rounded-full text-[10px] font-black uppercase text-indigo-400 flex items-center gap-1.5">
                                            <Zap className="w-3 h-3" /> Offre Étudiante
                                        </span>
                                    )}
                                    <span className="bg-yellow-400/5 border border-yellow-400/10 px-3 py-1 rounded-full text-[10px] font-black uppercase text-yellow-400 flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" /> Durée Limitée
                                    </span>
                                </div>

                                {/* Footer: Price & CTA */}
                                <div className="pt-6 border-t border-gray-800 flex items-center justify-between mt-auto">
                                    <div>
                                        {promo.originalPrice && (
                                            <div className="text-gray-600 line-through text-xs font-black">{promo.originalPrice} DT</div>
                                        )}
                                        <div className="text-3xl font-black text-white">
                                            {promo.price && promo.price !== 0
                                                ? `${promo.price} `
                                                : promo.discount ? 'Variable ' : 'Offre '}
                                            <span className="text-sm text-yellow-400">DT</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleAddToCart(promo)}
                                        className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-yellow-400/10 group-active:scale-95"
                                    >
                                        <ShoppingCart className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Deck */}
                <div className="grid md:grid-cols-2 gap-8 mt-24">
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-12 rounded-[3.5rem] relative overflow-hidden group">
                        <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-yellow-400/5 blur-[100px] border border-yellow-400/10 rounded-full group-hover:bg-yellow-400/10 transition-colors"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-16 h-16 bg-yellow-400 rounded-3xl flex items-center justify-center text-gray-900 shadow-2xl">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-black">Loyalty Rewards</h2>
                            <p className="text-gray-500 font-bold text-lg leading-relaxed">
                                Saviez-vous que chaque promotion vous rapporte également des points de fidélité ? Cumulez 1 point pour chaque dinar dépensé et profitez encore plus !
                            </p>
                            <Link href="/account" className="inline-flex items-center gap-2 text-yellow-400 font-black uppercase tracking-widest text-sm group/btn">
                                Mon solde points <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-12 rounded-[3.5rem] flex flex-col justify-center gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                                <Info className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                                <h4 className="font-black text-xl mb-1">Pas de cumul</h4>
                                <p className="text-gray-500 font-bold text-sm">Les promotions ne sont pas cumulables entre elles.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                                <Sparkles className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                                <h4 className="font-black text-xl mb-1">Qualité Garantie</h4>
                                <p className="text-gray-500 font-bold text-sm">Même prix réduit, même exigence de produits frais.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selection Modal */}
                {configPromo && (
                    <PromotionConfigModal
                        promotion={configPromo}
                        onClose={() => setConfigPromo(null)}
                        onConfirm={confirmPromotion}
                    />
                )}
            </div>
        </div>
    );
}