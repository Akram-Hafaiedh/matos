import React from 'react';
import { Flame, Percent, Gift, Clock, Star, ShoppingCart } from 'lucide-react';

export default function PromosPage() {
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
            hot: true
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
            badge: 'POPULAIRE'
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
            hot: true
        },
        {
            id: 4,
            title: 'Pizza + Boisson Offerte',
            emoji: '🍕',
            items: 'Toute pizza XL + 1 boisson au choix offerte',
            oldPrice: null,
            newPrice: 'Prix Pizza',
            discount: null,
            color: 'from-red-600 to-orange-600',
            badge: 'CADEAU',
            limitedTime: true
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
            weekdaysOnly: true
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
            hot: true
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
                    <h1 className="text-6xl md:text-7xl font-black text-white mb-4">
                        Nos <span className="text-yellow-400">Promotions</span>
                    </h1>
                    <p className="text-2xl text-gray-400">Des offres imbattables pour vous régaler!</p>
                </div>

                {/* Promo Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {promos.map(promo => (
                        <div
                            key={promo.id}
                            className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden border-4 border-gray-700 hover:border-yellow-400 transition transform hover:scale-105 shadow-2xl"
                        >
                            {/* Badge */}
                            <div className={`absolute top-6 right-6 bg-gradient-to-r ${promo.color} px-4 py-2 rounded-full z-10 shadow-lg`}>
                                <span className="text-white font-black text-sm flex items-center gap-1">
                                    {promo.hot && <Flame className="w-4 h-4" />}
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
                            <div className="p-8 pt-20">
                                <div className="text-7xl mb-6 text-center">{promo.emoji}</div>
                                <h3 className="text-4xl font-black text-white mb-4 text-center">{promo.title}</h3>
                                <p className="text-gray-300 text-lg mb-6 text-center leading-relaxed">{promo.items}</p>

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
                                <button className="w-full bg-yellow-400 text-gray-900 py-4 rounded-full font-black text-xl hover:bg-yellow-300 transition shadow-xl flex items-center justify-center gap-2">
                                    <ShoppingCart className="w-6 h-6" />
                                    Commander Maintenant
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Special Offers Banner */}
                <div className="bg-gradient-to-r from-purple-900 via-pink-800 to-red-900 rounded-3xl p-12 text-center border-4 border-yellow-400 shadow-2xl">
                    <Gift className="w-20 h-20 text-yellow-400 mx-auto mb-6 animate-bounce" />
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Programme de Fidélité
                    </h2>
                    <p className="text-2xl text-white mb-8">
                        Cumulez des points à chaque commande et débloquez des récompenses exclusives!
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                            <div className="text-4xl mb-4">⭐</div>
                            <h3 className="text-xl font-black text-white mb-2">Bronze</h3>
                            <p className="text-white">5% de réduction</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border-2 border-yellow-400">
                            <div className="text-4xl mb-4">🌟</div>
                            <h3 className="text-xl font-black text-white mb-2">Argent</h3>
                            <p className="text-white">10% de réduction</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                            <div className="text-4xl mb-4">💎</div>
                            <h3 className="text-xl font-black text-white mb-2">Or</h3>
                            <p className="text-white">15% de réduction</p>
                        </div>
                    </div>
                </div>

                {/* Terms */}
                <div className="mt-16 text-center">
                    <p className="text-gray-500 text-sm">
                        * Les offres ne sont pas cumulables. Valables uniquement sur présentation de cette page.
                        <br />
                        ** Les prix peuvent varier selon la disponibilité des produits.
                    </p>
                </div>
            </div>
        </div>
    );
}