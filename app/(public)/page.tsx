'use client';

import { useEffect, useState } from "react";
import { ChevronRight, Clock, MapPin, Phone, Star, ArrowRight, Gift, Compass, Locate, Crosshair } from "lucide-react";
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
  const [mapVisible, setMapVisible] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data) setSettings(data);
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    fetchSettings();
  }, []);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMapVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('localisation-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
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
      <section className="relative h-screen min-h-[700px] overflow-hidden bg-black flex items-center justify-center">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
              }`}
          >
            {/* Cinematic Background */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover brightness-[0.4] contrast-[1.2] scale-105 group-hover:scale-110 transition-transform duration-[10000ms]"
                priority={index === 0}
                sizes="100vw"
              />
              {/* Dynamic Overlay Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>

              {/* Technical Aesthetic Overlays */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                <div className="absolute right-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
              </div>
            </div>

            {/* Content Container */}
            <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center z-20">
              <div className="space-y-12 text-center max-w-6xl">
                {/* Floating Tag */}
                <div className={`transition-all duration-1000 delay-300 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  <div className="inline-flex items-center gap-3 px-8 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                    <span className="text-yellow-400 font-black text-xs uppercase tracking-[0.4em]">{slide.price}</span>
                  </div>
                </div>

                {/* Hero Title */}
                <div className={`space-y-4 transition-all duration-1000 delay-500 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <h1 className="text-7xl md:text-[12rem] font-[1000] text-white leading-[0.85] tracking-[-0.05em] uppercase italic group">
                    <span className="block">{slide.title.split(' ')[0]}</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-orange-600 drop-shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                      {slide.title.split(' ').slice(1).join(' ')}
                    </span>
                  </h1>
                </div>

                {/* Subtitle with High-End Layout */}
                <div className={`flex flex-col md:flex-row items-center justify-center gap-8 transition-all duration-1000 delay-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="hidden md:block w-24 h-px bg-white/10"></div>
                  <p className="text-xl md:text-2xl text-gray-400 font-bold max-w-2xl uppercase tracking-widest leading-relaxed italic">
                    {slide.subtitle}
                  </p>
                  <div className="hidden md:block w-24 h-px bg-white/10"></div>
                </div>

                {/* Glassmorphism Actions */}
                <div className={`flex flex-col sm:flex-row gap-6 justify-center pt-12 transition-all duration-1000 delay-1000 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <Link
                    href="/menu"
                    className="relative group bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-16 py-8 rounded-[2rem] font-black text-xl transition-all shadow-[0_20px_40px_-15px_rgba(250,204,21,0.4)] active:scale-95 flex items-center justify-center gap-4 overflow-hidden"
                  >
                    <span className="relative z-10 uppercase tracking-tighter">Signature Menu</span>
                    <ChevronRight className="relative z-10 w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Link>

                  <Link
                    href="/promos"
                    className="group bg-white/5 backdrop-blur-3xl border-2 border-white/10 hover:border-yellow-400/50 text-white px-16 py-8 rounded-[2rem] font-black text-xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4"
                  >
                    <span className="uppercase tracking-tighter group-hover:text-yellow-400 transition-colors">Offres Limitées</span>
                    <Gift className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-all group-hover:scale-110" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Ambient Page Glows */}
        <div className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>

        {/* Cinematic Indicators */}
        <div className="absolute bottom-20 left-12 flex flex-col gap-6 z-30">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="group relative flex items-center gap-4"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className={`h-1.5 transition-all duration-700 rounded-full ${index === currentSlide ? 'bg-yellow-400 w-12' : 'bg-white/20 w-4 group-hover:bg-white/40'}`} />
              <span className={`text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-500 ${index === currentSlide ? 'text-yellow-400 translate-x-0 opacity-100' : 'text-white/0 -translate-x-4 opacity-0 pointer-events-none'}`}>
                0{index + 1}
              </span>
            </button>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 right-12 z-30 hidden lg:flex flex-col items-center gap-6 group">
          <div className="[writing-mode:vertical-lr] text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] group-hover:text-yellow-400 transition-colors cursor-default">
            Explore Mato's Spirit
          </div>
          <div className="w-px h-24 bg-gradient-to-b from-yellow-400 via-yellow-400/20 to-transparent relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-scroll-indicator"></div>
          </div>
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
      <section id="localisation-section" className="py-48 px-4 bg-black relative overflow-hidden">
        {/* Massive Pulsing Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-yellow-400/5 blur-[150px] pointer-events-none animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-orange-500/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-7xl mx-auto space-y-20 relative z-10">
          <div className={`text-center space-y-6 transition-all duration-1000 ${mapVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-1 bg-gradient-to-r from-transparent to-yellow-400 rounded-full"></div>
              <span className="text-yellow-400 font-black uppercase text-xs tracking-[0.4em] flex items-center gap-2">
                <Locate className="w-4 h-4 animate-pulse" />
                Localisation
              </span>
              <div className="w-12 h-1 bg-gradient-to-l from-transparent to-yellow-400 rounded-full"></div>
            </div>
            <h2 className="text-6xl md:text-9xl font-black text-white italic tracking-tighter uppercase leading-none">
              Venez <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-orange-600">Nous Voir</span>
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
              <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <Crosshair className="w-3 h-3 text-yellow-400" />
                {settings?.lat ? `${settings.lat.toFixed(4)}° N, ${settings.lng.toFixed(4)}° E` : "36.8391° N, 10.3200° E"}
              </span>
              <span className="hidden md:block w-20 h-px bg-white/10"></span>
              <span>{settings?.address ? `Retrouvez-nous à ${settings.address}` : "Retrouvez-nous au cœur de Carthage."}</span>
            </div>
          </div>
        </div>

        <div className={`w-full max-w-7xl mx-auto px-4 md:px-12 transition-all duration-1000 delay-300 relative z-10 ${mapVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="relative group">
            {/* Technical Decorative Elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 border-t-2 border-l-2 border-yellow-400/20 rounded-tl-[3.5rem] pointer-events-none group-hover:border-yellow-400/40 transition-colors"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 border-b-2 border-r-2 border-yellow-400/20 rounded-br-[3.5rem] pointer-events-none group-hover:border-yellow-400/40 transition-colors"></div>

            {/* Map Container with Glow */}
            <div className="relative rounded-[3.5rem] overflow-hidden border-2 border-white/5 bg-gray-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] group-hover:border-yellow-400/20 transition-all duration-500 group-hover:shadow-yellow-400/5">
              <div className="w-full relative z-10 transition-transform duration-700 group-hover:scale-[1.01]">
                <InteractiveMap />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}