// app/(public)/promos/page.tsx
'use client';

import { Flame, Percent, Gift, Clock, Star, ShoppingCart, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../../cart/CartContext';
import { useEffect, useState } from 'react';
import PromotionConfigModal from '@/app/components/PromotionConfigModal';

interface PromoItem {
    id: number;
    name: string;
    description: string;
    description_long?: string;
    price: any;
    originalPrice?: number;
    imageUrl: string;
    emoji: string;
    popular: boolean;
    bestseller: boolean;
    hot: boolean;
    discount: number;
    badgeText?: string;
    badgeColor?: string;
}

export default function PromosPage() {
    const { addToCart } = useCart();
    const [promos, setPromos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [configPromo, setConfigPromo] = useState<any>(null); // Promotion being configured

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
            // Assign UI properties based on promo characteristics
            const getColor = () => {
                if (promo.bestseller) return 'from-yellow-600 to-amber-600';
                if (promo.hot) return 'from-red-600 to-orange-600';
                if (promo.popular) return 'from-orange-600 to-red-600';
                return ['from-purple-600 to-pink-600', 'from-green-600 to-teal-600', 'from-blue-600 to-cyan-600'][index % 3];
            };

            const getBadge = () => {
                if (promo.bestseller) return 'BEST DEAL';
                if (promo.popular) return 'POPULAIRE';
                if (promo.hot) return 'DUO';
                if (promo.name.includes('Pizza')) return 'CADEAU';
                if (promo.name.includes('Étudiant')) return 'ÉTUDIANT';
                return 'PROMO';
            };

            const getIcon = () => {
                if (promo.name.includes('Family')) return Users;
                if (promo.name.includes('Pizza')) return Gift;
                if (promo.name.includes('Étudiant')) return Zap;
                return Flame;
            };

            return {
                ...promo,
                color: getColor(),
                badge: promo.badgeText || getBadge(),
                icon: getIcon(),
                limitedTime: promo.name.includes('Pizza + Boisson'),
                weekdaysOnly: promo.name.includes('Étudiant'),
                // Use description directly as it's already a string from seed
                displayDescription: promo.description
            };
        });
    }

    const handleAddToCart = (promo: any) => {
        console.log('Checking promo for rules:', promo.name, promo.selectionRules);

        // Handle case where selectionRules might be a string (defense-in-depth)
        let rules = promo.selectionRules;
        if (typeof rules === 'string') {
            try {
                rules = JSON.parse(rules);
            } catch (e) {
                rules = [];
            }
        }

        if (rules && Array.isArray(rules) && rules.length > 0) {
            console.log('Opening modal for:', promo.name);
            setConfigPromo({ ...promo, selectionRules: rules });
        } else {
            console.log('Adding directly to cart (no rules):', promo.name);
            addToCart(promo, 'promotion');
        }
    };

    const confirmPromotion = (choices: any) => {
        addToCart(configPromo, 'promotion', undefined, choices);
        setConfigPromo(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-20">
            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block bg-gradient-to-r from-red-600 to-orange-500 px-8 py-3 rounded-full mb-6 animate-pulse">
                        <span className="text-white font-black text-xl flex items-center gap-2">
                            <Flame className="w-6 h-6" />
                            OFFRES SPÉCIALES
                            <Flame className="w-6 h-6" />
                        </span>
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black text-white mb-4 animate-slide-up">
                        Nos <span className="text-yellow-400">Promotions</span>
                    </h1>
                    <p className="text-2xl text-gray-400">Des offres imbattables pour vous régaler!</p>
                </div>

                {/* Stats Bar */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-6 text-center">
                        <Percent className="w-12 h-12 text-white mx-auto mb-3" />
                        <div className="text-4xl font-black text-white mb-2">
                            -{Math.max(...promos.map(p => p.discount || 0))}%
                        </div>
                        <p className="text-white font-bold">Économie maximale</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-600 to-amber-600 rounded-2xl p-6 text-center">
                        <Gift className="w-12 h-12 text-white mx-auto mb-3" />
                        <div className="text-4xl font-black text-white mb-2">{promos.length}</div>
                        <p className="text-white font-bold">Offres actives</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 text-center">
                        <Clock className="w-12 h-12 text-white mx-auto mb-3" />
                        <div className="text-4xl font-black text-white mb-2">24/7</div>
                        <p className="text-white font-bold">Disponibles</p>
                    </div>
                </div>

                {/* Promo Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {promos.map(promo => {
                        const IconComponent = promo.icon;
                        return (
                            <div
                                key={promo.id}
                                className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden border-4 border-gray-700 hover:border-yellow-400 transition transform hover:scale-105 shadow-2xl group"
                            >
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
                                </div>

                                {/* Top Right Badge */}
                                <div className={`absolute top-6 right-6 bg-gradient-to-r ${promo.color} px-4 py-2 rounded-full z-10 shadow-lg`}>
                                    <span className="text-white font-black text-sm flex items-center gap-1">
                                        {promo.hot && <Flame className="w-4 h-4" />}
                                        <IconComponent className="w-4 h-4" />
                                        {promo.badge}
                                    </span>
                                </div>

                                {/* Top Left Discount Badge */}
                                {promo.discount && (
                                    <div className="absolute top-6 left-6 bg-red-600 text-white w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-2xl z-10 border-4 border-white">
                                        <span className="text-3xl font-black">-{promo.discount}%</span>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="relative p-8 pt-20">
                                    {/* Emoji/Image */}
                                    <div className="text-7xl mb-6 text-center">
                                        {promo.imageUrl && (promo.imageUrl.startsWith('http') || promo.imageUrl.startsWith('/')) ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={promo.imageUrl} alt={promo.name} className="h-24 w-24 object-contain mx-auto" />
                                        ) : (
                                            promo.emoji || promo.imageUrl || '🎁'
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-4xl font-black text-white mb-4 text-center">
                                        {promo.name}
                                    </h3>

                                    {/* Ingredients/Description */}
                                    <p className="text-gray-300 text-lg mb-6 text-center leading-relaxed min-h-[4rem]">
                                        {promo.displayDescription}
                                    </p>

                                    {/* Price Section */}
                                    <div className="flex items-center justify-center gap-6 mb-6">
                                        {/* Original Price (if exists) */}
                                        {promo.originalPrice && (
                                            <span className="text-3xl text-gray-500 line-through font-bold">
                                                {promo.originalPrice} DT
                                            </span>
                                        )}

                                        {/* Current Price or Discount */}
                                        <span className="text-5xl font-black text-yellow-400">
                                            {promo.price && promo.price !== 0
                                                ? `${typeof promo.price === 'number' ? promo.price : 'Sur Mesure'} DT`
                                                : promo.discount
                                                    ? `-${promo.discount}%`
                                                    : 'Voir Offre'
                                            }
                                        </span>
                                    </div>

                                    {/* Tags (Limited Time / Weekdays Only) */}
                                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                                        {promo.limitedTime && (
                                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                                <Clock className="w-4 h-4" /> Offre limitée
                                            </span>
                                        )}
                                        {promo.weekdaysOnly && (
                                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                Lun-Ven uniquement
                                            </span>
                                        )}
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => handleAddToCart(promo)}
                                        className="block w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-4 rounded-full font-black text-xl transition shadow-xl text-center group-hover:scale-105 transform duration-200"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <ShoppingCart className="w-6 h-6" />
                                            Ajouter au Panier
                                        </span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* How It Works */}
                <div className="mt-16 bg-gray-800 rounded-3xl p-12">
                    <h2 className="text-4xl font-black text-white text-center mb-12">
                        Comment ça <span className="text-yellow-400">Marche</span>?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl font-black text-gray-900 mx-auto mb-4 shadow-lg">
                                1
                            </div>
                            <h3 className="text-xl font-black text-white mb-2">Choisissez</h3>
                            <p className="text-gray-400">Sélectionnez votre offre préférée</p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl font-black text-gray-900 mx-auto mb-4 shadow-lg">
                                2
                            </div>
                            <h3 className="text-xl font-black text-white mb-2">Commandez</h3>
                            <p className="text-gray-400">Passez votre commande en ligne ou par téléphone</p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl font-black text-gray-900 mx-auto mb-4 shadow-lg">
                                3
                            </div>
                            <h3 className="text-xl font-black text-white mb-2">Profitez</h3>
                            <p className="text-gray-400">Récupérez et savourez votre repas!</p>
                        </div>
                    </div>
                </div>

                {/* Terms */}
                <div className="mt-16 text-center">
                    <div className="inline-block bg-gray-800 rounded-2xl p-8">
                        <p className="text-gray-400 text-sm max-w-3xl">
                            <span className="font-black text-white">Conditions:</span> Les offres ne sont pas cumulables entre elles.
                            Valables uniquement sur présentation de cette page en restaurant ou lors de la commande en ligne.
                            Les prix peuvent varier selon la disponibilité des produits.
                            Offre étudiant valable sur présentation d'une carte étudiante valide.
                        </p>
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
    );
}