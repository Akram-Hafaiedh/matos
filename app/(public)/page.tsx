'use client';

import { useEffect, useState } from "react";
import { categories, menuItems } from '@/lib/data/menu';
import { MenuItem } from '@/types/menu';
import { useCart } from "../cart/CartContext";
import Hero from "./home/Hero";
import Favorites from "./home/Favorites";
import Promotions from "./home/Promotions";
import Fidelity from "./home/Fidelity";
import Reviews from "./home/Reviews";
import Localisation from "./home/Localisation";

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
    <main className="bg-black">
      <Hero slides={heroSlides} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
      <Favorites items={featuredItems} />
      <Promotions promos={promos} promoSlide={promoSlide} setPromoSlide={setPromoSlide} />
      <Fidelity />
      <Reviews />
      <Localisation mapVisible={mapVisible} settings={settings} />
    </main>
  );
}