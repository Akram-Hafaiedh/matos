'use client';

import { useEffect, useState } from "react";
import { ChevronRight, Clock, MapPin, Phone, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { menuItems } from '@/lib/data/menu';
import { MenuItem } from '@/types/menu';
import { useCart } from "./cart/CartContext";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart } = useCart();

  const heroSlides = [
    {
      image: '/images/pizza_sauce_rouge.png',
      fallbackEmoji: '🍕',
      title: 'Pizzas Artisanales',
      subtitle: 'Pâte fraîche • Ingrédients premium',
      color: 'from-red-900/80 via-orange-900/80 to-red-800/80',
      price: 'À partir de 10 DT'
    },
    {
      image: '/images/tacos.png',
      fallbackEmoji: '🌮',
      title: 'Tacos & Makloub',
      subtitle: 'Généreusement garnis • Sauces maison',
      color: 'from-amber-900/80 via-yellow-900/80 to-orange-800/80',
      price: 'À partir de 8 DT'
    },
    {
      image: '/images/plats.png',
      fallbackEmoji: '🍽️',
      title: 'Plats Savoureux',
      subtitle: 'Fait maison • Portions généreuses',
      color: 'from-green-900/80 via-emerald-900/80 to-teal-800/80',
      price: 'À partir de 5 DT'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Get actual bestsellers from menu data
  const getBestsellers = (): MenuItem[] => {
    const allItems = Object.values(menuItems).flat();
    return allItems.filter(item => item.bestseller).slice(0, 3);
  };

  // Get popular items if not enough bestsellers
  const getFeaturedItems = (): MenuItem[] => {
    const bestsellers = getBestsellers();
    if (bestsellers.length >= 3) return bestsellers;

    const allItems = Object.values(menuItems).flat();
    const popular = allItems.filter(item => item.popular);
    return [...bestsellers, ...popular].slice(0, 3);
  };

  const featuredItems = getFeaturedItems();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-950">
        <div className="relative h-screen">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
                {/* Dark overlay for text readability */}
                <div className={`absolute inset-0 bg-gradient-to-br ${slide.color}`}></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center justify-center z-10">
                <div className="text-center px-4 max-w-4xl">
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl tracking-tight">
                    {slide.title}
                  </h1>
                  <p className="text-2xl md:text-3xl text-white/90 mb-8 font-bold drop-shadow-lg">
                    {slide.subtitle}
                  </p>
                  <div className="inline-block bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-black text-2xl mb-10 shadow-2xl">
                    {slide.price}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/menu"
                      className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-10 py-5 rounded-full font-black text-xl transition transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2 group"
                    >
                      Commander Maintenant
                      <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/promos"
                      className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 py-5 rounded-full font-black text-xl transition transform hover:scale-105 shadow-2xl border-2 border-white"
                    >
                      Voir les Promos
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-yellow-400 w-12' : 'bg-white/50 w-3'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-gradient-to-r from-red-600 to-orange-500 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 text-white flex-wrap">
            <span className="text-2xl">🔥</span>
            <p className="text-lg md:text-2xl font-black text-center">
              FAMILY BOX à 68 DT • Économisez 17 DT!
            </p>
            <span className="text-2xl">🔥</span>
          </div>
        </div>
      </section>

      {/* Featured Items - Using Real Menu Data */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-yellow-400/20 text-yellow-400 px-6 py-2 rounded-full font-bold text-sm mb-6 border border-yellow-400/30">
              ⭐ NOS BEST-SELLERS
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
              Les <span className="text-yellow-400">Favoris</span>
            </h2>
            <p className="text-xl text-gray-400">Les choix préférés de nos clients</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-yellow-400/20 transition transform hover:scale-105 border-2 border-gray-700 hover:border-yellow-400"
              >
                {/* Badges */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  {item.bestseller && (
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full font-black text-xs flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3 fill-current" /> TOP
                    </span>
                  )}
                  {item.popular && (
                    <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-black text-xs">
                      🔥
                    </span>
                  )}
                </div>

                {/* Image */}
                <div className="h-56 bg-gray-700 flex items-center justify-center overflow-hidden">
                  {item.image.startsWith('/') ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <span className="text-8xl group-hover:scale-110 transition-transform duration-300">
                      {item.image}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-black text-white mb-2">{item.name}</h3>
                  {item.ingredients && (
                    <p className="text-gray-400 mb-4 text-sm line-clamp-2">{item.ingredients}</p>
                  )}

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">
                        {item.price && typeof item.price === 'object' && 'xl' in item.price ? 'À partir de' : 'Prix'}
                      </div>
                      <span className="text-2xl font-black text-yellow-400">
                        {item.price && typeof item.price === 'object' && 'xl' in item.price
                          ? `${item.price.xl} DT`
                          : typeof item.price === 'number'
                            ? `${item.price} DT`
                            : 'Voir menu'}
                      </span>
                    </div>
                    <Link
                      href="/menu"
                      className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-5 py-3 rounded-full font-black transition flex items-center gap-2 group"
                    >
                      Voir
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/menu"
              className="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-10 py-5 rounded-full font-black text-xl transition transform hover:scale-105 shadow-xl"
            >
              Voir tout le menu
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="py-20 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="p-12">
                <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-5 py-2 rounded-full font-black text-sm mb-6">
                  🔥 OFFRE SPÉCIALE
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Family Box
                </h2>
                <p className="text-lg text-white/90 mb-6 leading-relaxed">
                  Le menu parfait pour toute la famille • Plus de 10 personnes servies
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <div>
                    <div className="text-sm text-white/60 mb-1">Prix normal</div>
                    <span className="text-2xl text-white/60 line-through font-bold">85 DT</span>
                  </div>
                  <div className="h-10 w-px bg-white/20"></div>
                  <div>
                    <div className="text-sm text-yellow-400 mb-1">Prix promo</div>
                    <span className="text-5xl font-black text-yellow-400">68 DT</span>
                  </div>
                  <div className="bg-red-600 text-white px-3 py-2 rounded-full font-black">
                    -20%
                  </div>
                </div>
                <Link
                  href="/promos"
                  className="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-full font-black text-lg transition transform hover:scale-105"
                >
                  Voir toutes les promos
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="h-full min-h-[400px] relative">
                <div className="absolute inset-0 flex items-center justify-center text-9xl">
                  🎉
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center text-white mb-16">
            Pourquoi <span className="text-yellow-400">Mato's</span>?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { emoji: '🔥', title: 'Fraîcheur', desc: 'Ingrédients frais du jour' },
              { emoji: '⚡', title: 'Rapidité', desc: 'Service express' },
              { emoji: '💯', title: 'Qualité', desc: 'Produits premium' },
              { emoji: '😋', title: 'Saveur', desc: 'Goût authentique' }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-24 h-24 bg-yellow-400 rounded-2xl mx-auto mb-6 flex items-center justify-center text-5xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-xl">
                  {item.emoji}
                </div>
                <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center text-white mb-12">
            Venez Nous Voir!
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-8 rounded-2xl text-center hover:bg-gray-750 transition border-2 border-gray-700 hover:border-yellow-400">
              <MapPin className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-black text-white mb-2">Adresse</h3>
              <p className="text-gray-400">Tunis, Tunisie</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-2xl text-center hover:bg-gray-750 transition border-2 border-gray-700 hover:border-yellow-400">
              <Phone className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-black text-white mb-2">Téléphone</h3>
              <p className="text-gray-400">+216 XX XXX XXX</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-2xl text-center hover:bg-gray-750 transition border-2 border-gray-700 hover:border-yellow-400">
              <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-black text-white mb-2">Horaires</h3>
              <p className="text-gray-400">Tous les jours<br />11h - 23h</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}