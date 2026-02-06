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
import FAQSection from "./home/FAQSection";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [promoSlide, setPromoSlide] = useState(0);
  const [promos, setPromos] = useState<any[]>([]);
  const [mapVisible, setMapVisible] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [realItems, setRealItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, promosRes, menuRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/promotions?active=true'),
          fetch('/api/menu-items?limit=100&status=active')
        ]);

        const settingsData = await settingsRes.json();
        if (settingsData) setSettings(settingsData);

        const promosData = await promosRes.json();
        if (promosData.success) setPromos(promosData.promotions);

        const menuData = await menuRes.json();
        if (menuData.success) {
          setRealItems(menuData.menuItems.map((item: any) => ({
            ...item,
            image: item.imageUrl || '🍴',
            ingredients: item.description
          })));
        }
      } catch (error) {
        console.error("Error loading home page data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (promos.length > 1) {
      const timer = setInterval(() => {
        setPromoSlide((prev) => (prev + 1) % promos.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [promos.length]);

  // Get actual bestsellers from real items
  const featuredItems = realItems.filter(item => item.bestseller).slice(0, 5);
  const displayItems = featuredItems.length > 0 ? featuredItems : realItems.filter(item => item.popular).slice(0, 5);
  const finalItems = displayItems.length > 0 ? displayItems : realItems.slice(0, 5);

  return (
    <main className="bg-transparent">
      <Hero currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
      <Favorites items={finalItems} />
      <Promotions promos={promos} promoSlide={promoSlide} setPromoSlide={setPromoSlide} />
      <Fidelity />
      <Reviews />
      <FAQSection />
      <div id="localisation-section">
        <Localisation settings={settings} />
      </div>
    </main>
  );
}