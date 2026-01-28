'use client';

import { Flame, Percent, Gift, Clock, Star, ShoppingCart, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../cart/CartContext';

export default function PromosPage() {
    const { addToCart } = useCart();

    const promos = [
        {
            id: 1,
            title: 'Family Box',
            emoji: '👨‍👩‍👧‍👦',
            items: '2 crispy burger, 2 cheese burger, 2 tacos poulet, viande hachée, 8 wings, 8 tenders, riz vermicelles, frites, salade, 2 boissons',
            oldPrice: 85,
            newPrice: 68,
            discount: 20,
            color: 'from-purple-600 to-pink-600',
            badge: 'FAMILLE',
            hot: true,
            icon: Users
        },
        {
            id: 2,
            title: 'Big Box',
            emoji: '🍔',
            items: '1 crispy burger, 1 cheese burger, 1 tacos poulet pané, 1 tacos viande hachée, 4 wings, 4 tenders, riz vermicelles, frites, salade, coco 1l',
            oldPrice: 55,
            newPrice: 44,
            discount: 20,
            color: 'from-orange-600 to-red-600',
            badge: 'POPULAIRE',
            icon: Star
        },
        {
            id: 3,
            title: 'Double Box',
            emoji: '🌮',
            items: '1 cheeseburger, 1 tacos poulet grillé, 3 wings, 3 tenders, frites',
            oldPrice: 40,
            newPrice: 32,
            discount: 20,
            color: 'from-green-600 to-teal-600',
            badge: 'DUO',
            hot: true,
            icon: Users
        },
        {
            id: 4,
            title: 'Pizza + Boisson Offerte',
            emoji: '🍕',
            items: 'Toute pizza XL ou XXL + 1 boisson au choix offerte',
            oldPrice: null,
            newPrice: 'Prix Pizza',
            discount: null,
            color: 'from-red-600 to-orange-600',
            badge: 'CADEAU',
            limitedTime: true,
            icon: Gift
        },
        {
            id: 5,
            title: 'Menu Étudiant',
            emoji: '🎓',
            items: '1 burger au choix, frites, boisson',
            oldPrice: 18,
            newPrice: 14,
            discount: 22,
            color: 'from-blue-600 to-cyan-600',
            badge: 'ÉTUDIANT',
            weekdaysOnly: true,
            icon: Zap
        },
        {
            id: 6,
            title: '2 Pizzas = -30%',
            emoji: '🍕🍕',
            items: 'Achetez 2 pizzas XL ou XXL et bénéficiez de -30% sur la 2ème',
            oldPrice: null,
            newPrice: '-30%',
            discount: 30,
            color: 'from-yellow-600 to-amber-600',
            badge: 'BEST DEAL',
            hot: true,
            icon: Flame
        }
    ];

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
                        <div className="text-4xl font-black text-white mb-2">-30%</div>
                        <p className="text-white font-bold">Économie maximale</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-600 to-amber-600 rounded-2xl p-6 text-center">
                        <Gift className="w-12 h-12 text-white mx-auto mb-3" />
                        <div className="text-4xl font-black text-white mb-2">6</div>
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

                                {/* Badge */}
                                <div className={`absolute top-6 right-6 bg-gradient-to-r ${promo.color} px-4 py-2 rounded-full z-10 shadow-lg`}>
                                    <span className="text-white font-black text-sm flex items-center gap-1">
                                        {promo.hot && <Flame className="w-4 h-4" />}
                                        <IconComponent className="w-4 h-4" />
                                        {promo.badge}
                                    </span>
                                </div>

                                {/* Discount Badge */}
                                {promo.discount && (
                                    <div className="absolute top-6 left-6 bg-red-600 text-white w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-2xl z-10 border-4 border-white">
                                        <span className="text-3xl font-black">-{promo.discount}%</span>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="relative p-8 pt-20">
                                    <div className="text-7xl mb-6 text-center">{promo.emoji}</div>
                                    <h3 className="text-4xl font-black text-white mb-4 text-center">{promo.title}</h3>
                                    <p className="text-gray-300 text-lg mb-6 text-center leading-relaxed min-h-[4rem]">{promo.items}</p>

                                    {/* Price */}
                                    <div className="flex items-center justify-center gap-6 mb-6">
                                        {promo.oldPrice && (
                                            <span className="text-3xl text-gray-500 line-through font-bold">{promo.oldPrice} DT</span>
                                        )}
                                        <span className="text-5xl font-black text-yellow-400">
                                            {typeof promo.newPrice === 'number' ? `${promo.newPrice} DT` : promo.newPrice}
                                        </span>
                                    </div>

                                    {/* Tags */}
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
                                    <Link
                                        href="/menu"
                                        className="block w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-4 rounded-full font-black text-xl transition shadow-xl text-center group-hover:scale-105 transform duration-200"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <ShoppingCart className="w-6 h-6" />
                                            Commander Maintenant
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Special Offers Banner */}
                <div className="bg-gradient-to-r from-purple-900 via-pink-800 to-red-900 rounded-3xl p-12 text-center border-4 border-yellow-400 shadow-2xl relative overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0">
                        <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-400/20 rounded-full blur-2xl animate-pulse delay-500"></div>
                    </div>

                    <div className="relative z-10">
                        <Gift className="w-20 h-20 text-yellow-400 mx-auto mb-6 animate-bounce" />
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                            Programme de Fidélité
                        </h2>
                        <p className="text-2xl text-white mb-8 max-w-3xl mx-auto">
                            Cumulez des points à chaque commande et débloquez des récompenses exclusives!
                        </p>

                        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/20 hover:border-yellow-400 transition">
                                <div className="text-4xl mb-4">⭐</div>
                                <h3 className="text-xl font-black text-white mb-2">Bronze</h3>
                                <p className="text-white text-sm mb-3">0-500 points</p>
                                <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-black">
                                    5% de réduction
                                </div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border-2 border-yellow-400 scale-105 hover:scale-110 transition">
                                <div className="text-4xl mb-4">🌟</div>
                                <h3 className="text-xl font-black text-white mb-2">Argent</h3>
                                <p className="text-white text-sm mb-3">501-1000 points</p>
                                <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-black">
                                    10% de réduction
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-white/20 hover:border-yellow-400 transition">
                                <div className="text-4xl mb-4">💎</div>
                                <h3 className="text-xl font-black text-white mb-2">Or</h3>
                                <p className="text-white text-sm mb-3">1001+ points</p>
                                <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-black">
                                    15% de réduction
                                </div>
                            </div>
                        </div>

                        <button className="mt-8 bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-10 py-4 rounded-full font-black text-xl transition transform hover:scale-105">
                            Rejoindre le Programme
                        </button>
                    </div>
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
        </div>
    );
}