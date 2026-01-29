'use client';

import { useEffect, useState } from "react";
import { ChevronRight, Clock, MapPin, Phone, Star, ArrowRight, Gift } from "lucide-react";
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-900/50 rounded-[3rem] border border-gray-800 animate-pulse flex items-center justify-center">
      <div className="text-gray-700 font-black uppercase tracking-widest italic">Chargement de la Map...</div>
    </div>
  )
});
import Link from "next/link";
import Image from "next/image";

import { categories, menuItems } from '@/lib/data/menu';
import { MenuItem } from '@/types/menu';
import { useCart } from "../cart/CartContext";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [promoSlide, setPromoSlide] = useState(0);
  const [promos, setPromos] = useState<any[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await fetch('/api/promotions?active=true');
        const data = await res.json();
        if (data.success) setPromos(data.promotions);
      } catch (e) { console.error(e); }
    };
    fetchPromos();
  }, []);

  const heroSlides = categories
    .filter(cat => cat.showInHero)
    .map(cat => {
      const items = menuItems[cat.id as keyof typeof menuItems] as MenuItem[];
      const itemWithImage = items?.find(item => item.image.startsWith('/'));
      const minPrice = items ? Math.min(...items.map(i =>
        typeof i.price === 'number' ? i.price :
          typeof i.price === 'object' && i.price?.xl ? i.price.xl : 999
      )) : 0;

      return {
        image: itemWithImage?.image || '/images/default.png',
        title: cat.heroTitle || cat.name,
        subtitle: cat.heroSubtitle || '',
        color: cat.heroColor || 'from-gray-900/80 to-gray-800/80',
        price: `À partir de ${minPrice} DT`
      };
    });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (promos.length > 1) {
      const timer = setInterval(() => {
        setPromoSlide((prev) => (prev + 1) % promos.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [promos.length]);

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
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black">
        <div className="relative h-screen">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
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
                <div className={`absolute inset-0 bg-gradient-to-br ${slide.color}`}></div>
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center justify-center z-10 px-4">
                <div className="text-center space-y-8 max-w-5xl">
                  <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-yellow-400 text-gray-900 font-black text-sm uppercase tracking-widest shadow-2xl animate-bounce-slow">
                    {slide.price}
                  </div>
                  <h1 className="text-6xl md:text-[10rem] font-black text-white leading-none tracking-tighter drop-shadow-2xl italic">
                    {slide.title}
                  </h1>
                  <p className="text-2xl md:text-3xl text-white/70 font-bold max-w-2xl mx-auto line-clamp-2">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                    <Link
                      href="/menu"
                      className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-12 py-6 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-yellow-400/20 flex items-center justify-center gap-3 group active:scale-95"
                    >
                      Commander Maintenant
                      <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/promos"
                      className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 text-white px-12 py-6 rounded-2xl font-black text-xl transition-all shadow-2xl active:scale-95"
                    >
                      Nos Offres
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-yellow-400 w-16' : 'bg-white/20 w-4'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-32 px-4 bg-black relative">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="text-yellow-400 font-black uppercase text-sm tracking-[0.3em]">Menu Sélection</div>
            <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter">
              Les <span className="text-yellow-400">Favoris</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-gray-900/40 border-2 border-gray-800 rounded-[3rem] overflow-hidden backdrop-blur-3xl hover:border-yellow-400/30 transition-all duration-500 shadow-3xl"
              >
                <div className="absolute top-6 right-6 z-10">
                  {item.bestseller && (
                    <span className="bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full font-black text-[10px] uppercase shadow-xl ring-4 ring-black/20 tracking-widest">
                      TOP VENTE
                    </span>
                  )}
                </div>

                <div className="h-72 bg-gray-800 flex items-center justify-center overflow-hidden border-b-2 border-gray-800">
                  {item.image.startsWith('/') ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <span className="text-9xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 filter drop-shadow-2xl">
                      {item.image}
                    </span>
                  )}
                </div>

                <div className="p-10 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white italic group-hover:text-yellow-400 transition-colors">
                      {item.name}
                    </h3>
                    {item.ingredients && (
                      <p className="text-gray-500 font-bold text-sm line-clamp-2 leading-relaxed">{item.ingredients}</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                    <div className="text-3xl font-black text-white">
                      {item.price && typeof item.price === 'object' && 'xl' in item.price
                        ? item.price.xl
                        : typeof item.price === 'number'
                          ? item.price
                          : '8'}
                      <span className="text-sm text-yellow-400 ml-1">DT</span>
                    </div>
                    <Link
                      href="/menu"
                      className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-yellow-400/10 group-active:scale-95"
                    >
                      <ArrowRight className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-8">
            <Link
              href="/menu"
              className="inline-flex items-center gap-3 text-yellow-400 font-black uppercase text-sm tracking-[0.3em] hover:text-yellow-300 transition group"
            >
              Consulter le menu complet
              <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Refined Promos Slider Section */}
      <section className="py-24 px-4 bg-gray-950 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] -translate-y-1/2 -px-64 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink-600/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-gray-900 to-black p-1 md:p-1.5 rounded-[4rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
            <div className="bg-gradient-to-br from-purple-900/40 via-pink-900/20 to-gray-900/40 rounded-[3.8rem] overflow-hidden min-h-[500px] relative">

              {/* Slider Content */}
              {promos.length > 0 ? (
                promos.map((promo, index) => (
                  <div
                    key={promo.id}
                    className={`grid lg:grid-cols-2 lg:items-center transition-all duration-1000 absolute inset-0 ${index === promoSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  >
                    {/* Visual Side */}
                    <div className="relative h-[300px] md:h-[400px] lg:h-full flex items-center justify-center group">
                      <div className="text-[9rem] md:text-[12rem] lg:text-[14rem] filter drop-shadow-[0_0_30px_rgba(250,204,21,0.3)] animate-float transform group-hover:scale-110 transition-transform duration-700">
                        {promo.emoji || (promo.name.includes('Burger') ? '🍔' : '🍕')}
                      </div>
                      <div className="absolute top-1/4 right-1/4 bg-yellow-400 text-gray-900 px-4 py-1.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-black text-lg md:text-xl shadow-2xl rotate-12">
                        -{promo.discount || 20}%
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className="p-8 md:p-12 lg:p-20 flex flex-col justify-center space-y-4 md:space-y-6 lg:space-y-8 overflow-hidden">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-1 bg-yellow-400 rounded-full"></span>
                        <span className="text-yellow-400 font-black tracking-widest uppercase text-[10px] md:text-xs">Exclusivité Mato's</span>
                      </div>

                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none italic">
                        {promo.name.split(' ').slice(0, -1).join(' ')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 uppercase not-italic font-[1000]">
                          {promo.name.split(' ').slice(-1)}
                        </span>
                      </h2>

                      <div className="max-w-xl">
                        <p className="text-sm md:text-base lg:text-lg text-gray-400 font-bold leading-relaxed line-clamp-3 md:line-clamp-4">
                          {promo.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-6 md:gap-8 py-2">
                        <div className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter">
                          {promo.price || 68} <span className="text-lg text-yellow-400 uppercase">DT</span>
                        </div>
                        <div className="hidden sm:block h-10 w-1 bg-white/10 rounded-full"></div>
                        <Link
                          href="/promos"
                          className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-3 md:px-8 md:py-4 rounded-xl font-black text-base md:text-lg transition-all shadow-xl shadow-yellow-400/20 active:scale-95 flex items-center gap-2"
                        >
                          En profiter
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 font-bold">Chargement des offres...</div>
              )}

              {/* Slider Dots */}
              {promos.length > 1 && (
                <div className="absolute bottom-10 right-10 lg:right-20 flex gap-2">
                  {promos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPromoSlide(i)}
                      className={`h-2 rounded-full transition-all ${i === promoSlide ? 'bg-yellow-400 w-8' : 'bg-white/20 w-2'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Loyalty System Section */}
      <section className="py-32 px-4 bg-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 space-y-10">
              <div className="inline-flex items-center gap-3 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.2em]">
                Fidélité & Récompenses
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.9] italic tracking-tight">
                Gagnez du <br />
                <span className="text-yellow-400">Plaisir.</span>
              </h2>
              <p className="text-xl text-gray-500 font-bold leading-relaxed max-w-xl">
                Parce que vous méritez le meilleur, nous récompensons chaque dinar dépensé chez nous. Cumulez des points et transformez-les en festins.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pr-12">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-3xl">🎁</div>
                  <h3 className="text-white font-black text-xl">Bonus Inscription</h3>
                  <p className="text-gray-600 font-bold text-sm leading-relaxed">Commencez l'aventure avec 10 points offerts dès la validation du compte.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-3xl">💎</div>
                  <h3 className="text-white font-black text-xl">Statut VIP</h3>
                  <p className="text-gray-600 font-bold text-sm leading-relaxed">Débloquez des cadeaux exclusifs en gravissant nos échelons de fidélité.</p>
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href="/login"
                  className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-12 py-6 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-yellow-400/20 inline-flex items-center gap-4 group active:scale-95"
                >
                  Ouvrir mon compte
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="relative bg-gradient-to-br from-gray-900 to-black p-12 lg:p-16 rounded-[4rem] border-2 border-gray-800 shadow-3xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 blur-[100px]"></div>
                <div className="flex items-center justify-between mb-12">
                  <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center text-4xl shadow-2xl">😎</div>
                  <div className="text-right">
                    <div className="text-gray-600 text-xs font-black uppercase tracking-widest mb-1">Total Points</div>
                    <div className="text-5xl font-black text-white italic">1482</div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500">
                      <span>Palier Actuel</span>
                      <span className="text-yellow-400">Niveau Pro++</span>
                    </div>
                    <div className="h-4 bg-gray-950 rounded-full border border-gray-800 p-0.5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full w-4/5 shadow-[0_0_15px_rgba(250,204,21,0.4)]"></div>
                    </div>
                  </div>

                  <div className="p-8 bg-gray-950 rounded-[2.5rem] border border-gray-800 flex items-center gap-6 group/item hover:border-yellow-400/30 transition-colors">
                    <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-3xl group-hover/item:scale-110 transition-transform">🌮</div>
                    <div className="flex-1">
                      <h4 className="text-white font-black">Tacos Signature XL</h4>
                      <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">En cadeau !</p>
                    </div>
                    <div className="bg-green-500 inline-block px-4 py-1.5 rounded-full text-[10px] font-black text-gray-900 uppercase">Debloqué</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Pillars */}
      <section className="py-32 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            {[
              { emoji: '🍅', title: 'FRAÎCHEUR', desc: 'Produits livrés chaque matin' },
              { emoji: '🚂', title: 'RAPIDITÉ', desc: 'Prêt en moins de 15 minutes' },
              { emoji: '✨', title: 'QUALITÉ', desc: 'Recettes artisanales uniques' },
              { emoji: '🤘', title: 'AUDACE', desc: 'Des saveurs qui détonnent' }
            ].map((pillar, idx) => (
              <div key={idx} className="text-center space-y-6 group">
                <div className="w-24 h-24 bg-gray-900 border border-gray-800 rounded-[2.5rem] mx-auto flex items-center justify-center text-4xl group-hover:bg-yellow-400 group-hover:text-gray-900 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                  {pillar.emoji}
                </div>
                <div className="space-y-2">
                  <h3 className="text-white font-black text-xs tracking-[0.3em]">{pillar.title}</h3>
                  <p className="text-gray-500 font-bold text-sm px-6">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-32 px-4 bg-black relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-400/5 blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto space-y-20 relative z-10">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-1 bg-yellow-400 rounded-full"></div>
              <span className="text-yellow-400 font-black uppercase text-xs tracking-[0.4em]">Localisation</span>
              <div className="w-12 h-1 bg-yellow-400 rounded-full"></div>
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">
              Venez <span className="text-yellow-400">Nous Voir</span>
            </h2>
            <p className="text-gray-500 font-bold max-w-2xl mx-auto uppercase text-xs tracking-widest leading-relaxed">
              Le temple de la gourmandise vous attend à Carthage. <br className="hidden md:block" />
              Une ambiance unique pour une expérience culinaire inoubliable.
            </p>
          </div>

          <div className="w-full">
            <InteractiveMap />
          </div>
        </div>
      </section>
    </main>
  );
}