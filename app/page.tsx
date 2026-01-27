'use client';

import { useEffect, useState } from "react";
import { ChevronRight, Clock, Flame, MapPin, Phone, Star } from "lucide-react";

export default function Home() {

  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      emoji: '🍕',
      title: 'Pizza Artisanale',
      subtitle: 'Pâte fraîche • Four traditionnel',
      color: 'from-red-600 via-red-500 to-orange-500',
      price: 'À partir de 10 DT'
    },
    {
      emoji: '🍔',
      title: 'Burgers Gourmands',
      subtitle: 'Pain maison • Viande premium',
      color: 'from-amber-600 via-yellow-500 to-yellow-400',
      price: 'À partir de 12 DT'
    },
    {
      emoji: '🌮',
      title: 'Tacos Généreux',
      subtitle: 'Viande grillée • Sauces maison',
      color: 'from-green-600 via-emerald-500 to-teal-400',
      price: 'À partir de 8 DT'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Hero Carousel */}
      <section className="relative overflow-hidden">
        <div className="relative h-screen">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <div className={`h-full bg-gradient-to-br ${slide.color} flex items-center justify-center relative`}>
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative z-10 text-center px-4 slide-up">
                  <div className="text-9xl mb-6 bounce-in hover-wiggle">{slide.emoji}</div>
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-4 drop-shadow-2xl tracking-tight">
                    {slide.title}
                  </h1>
                  <p className="text-2xl md:text-3xl text-white mb-4 font-bold">{slide.subtitle}</p>
                  <div className="inline-block bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-black text-2xl mb-8 shadow-2xl">
                    {slide.price}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="#menu" className="bg-white text-gray-900 px-10 py-5 rounded-full font-black text-xl hover:bg-yellow-400 transition transform hover:scale-105 shadow-2xl flex items-center justify-center gap-2">
                      Commander Maintenant <ChevronRight />
                    </a>
                    <a href="#promos" className="bg-gray-900 text-white px-10 py-5 rounded-full font-black text-xl hover:bg-gray-800 transition transform hover:scale-105 shadow-2xl border-2 border-white">
                      Voir les Promos
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-4 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-yellow-400 w-12' : 'bg-white/50 w-4'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Hot Deals Banner */}
      <section className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4 text-white">
            <Flame className="w-8 h-8 bounce-in" />
            <p className="text-2xl md:text-3xl font-black text-center">
              OFFRE SPÉCIALE : Double Box à -20% 🔥 Seulement Aujourd'hui!
            </p>
            <Flame className="w-8 h-8 bounce-in" />
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section id="menu" className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
              Les <span className="text-yellow-400">Favoris</span>
            </h2>
            <p className="text-xl text-gray-400">Les choix préférés de nos clients</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pizza Card */}
            <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-yellow-500/50 transition transform hover:scale-105 border-2 border-gray-700 hover:border-yellow-400">
              <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-black text-sm z-10 flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" /> BEST SELLER
              </div>
              <div className="h-64 bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
                <span className="text-9xl group-hover:scale-110 transition-transform hover-wiggle">🍕</span>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black text-white mb-2">Pizza Napolitaine</h3>
                <p className="text-gray-400 mb-4">Sauce tomate, mozzarella, anchois, câpres, olives</p>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-black text-yellow-400">13-18 DT</span>
                  <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-black hover:bg-yellow-300 transition">
                    Commander
                  </button>
                </div>
              </div>
            </div>

            {/* Burger Card */}
            <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-yellow-500/50 transition transform hover:scale-105 border-2 border-gray-700 hover:border-yellow-400">
              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-black text-sm z-10">
                POPULAIRE
              </div>
              <div className="h-64 bg-gradient-to-br from-amber-600 to-yellow-500 flex items-center justify-center">
                <span className="text-9xl group-hover:scale-110 transition-transform hover-wiggle">🍔</span>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black text-white mb-2">Crispy Chicken</h3>
                <p className="text-gray-400 mb-4">Poulet croustillant, sauce blanche, cheddar, salade</p>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-black text-yellow-400">12 DT</span>
                  <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-black hover:bg-yellow-300 transition">
                    Commander
                  </button>
                </div>
              </div>
            </div>

            {/* Tacos Card */}
            <div className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-yellow-500/50 transition transform hover:scale-105 border-2 border-gray-700 hover:border-yellow-400">
              <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full font-black text-sm z-10 flex items-center gap-1">
                <Flame className="w-4 h-4" /> HOT
              </div>
              <div className="h-64 bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center">
                <span className="text-9xl group-hover:scale-110 transition-transform hover-wiggle">🌮</span>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black text-white mb-2">Tacos Poulet Pané</h3>
                <p className="text-gray-400 mb-4">Poulet pané croustillant, frites, sauce fromagère</p>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-black text-yellow-400">8-14 DT</span>
                  <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-black hover:bg-yellow-300 transition">
                    Commander
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Mix Box Promo */}
      <section id="promos" className="py-20 px-4 bg-gradient-to-br from-purple-900 via-pink-800 to-red-900">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border-4 border-yellow-400 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-black text-lg mb-6 bounce-in">
                  🔥 OFFRE SPÉCIALE
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                  Family Box
                </h2>
                <p className="text-2xl text-white mb-6 font-bold">
                  2 crispy burger, 2 cheese burger, 2 tacos poulet, viande hachée, 8 wings, 8 tenders, riz vermicelles, frites, salade, 2 boissons
                </p>
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="text-4xl text-gray-400 line-through font-bold">85 DT</span>
                  <span className="text-7xl font-black text-yellow-400">68 DT</span>
                </div>
                <button className="bg-yellow-400 text-gray-900 px-12 py-6 rounded-full font-black text-2xl hover:bg-yellow-300 transition transform hover:scale-105 shadow-2xl">
                  Commandez Maintenant!
                </button>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-9xl bounce-in hover-wiggle">🎉</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black text-center text-white mb-16">
            Pourquoi <span className="text-yellow-400">Mato's</span>?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform shadow-lg shadow-yellow-500/50">
                🔥
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Fraîcheur</h3>
              <p className="text-gray-400">Ingrédients frais chaque jour</p>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform shadow-lg shadow-yellow-500/50">
                ⚡
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Rapidité</h3>
              <p className="text-gray-400">Service ultra rapide</p>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform shadow-lg shadow-yellow-500/50">
                💯
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Qualité</h3>
              <p className="text-gray-400">Produits premium</p>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform shadow-lg shadow-yellow-500/50">
                😋
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Saveur</h3>
              <p className="text-gray-400">Goût inoubliable</p>
            </div>
          </div>
        </div>
      </section>


      {/* Contact Preview */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black text-center text-white mb-16">
            Venez Nous Voir!
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-8 rounded-3xl text-center shadow-2xl transform hover:scale-105 transition">
              <MapPin className="w-16 h-16 text-gray-900 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-gray-900 mb-2">Adresse</h3>
              <p className="text-gray-900 font-bold text-lg">Tunis, Tunisie</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-8 rounded-3xl text-center shadow-2xl transform hover:scale-105 transition">
              <Phone className="w-16 h-16 text-gray-900 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-gray-900 mb-2">Téléphone</h3>
              <p className="text-gray-900 font-bold text-lg">+216 XX XXX XXX</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-8 rounded-3xl text-center shadow-2xl transform hover:scale-105 transition">
              <Clock className="w-16 h-16 text-gray-900 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-gray-900 mb-2">Horaires</h3>
              <p className="text-gray-900 font-bold text-lg">Tous les jours<br />11h - 23h</p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
