import { prisma } from '@/lib/prisma';
import Hero from "./home/Hero";
import Favorites from "./home/Favorites";
import Promotions from "./home/Promotions";
import Fidelity from "./home/Fidelity";
import Reviews from "./home/Reviews";
import Localisation from "./home/Localisation";
import FAQSection from "./home/FAQSection";

export const revalidate = 60; // Regenerate page at most every 60 seconds

export default async function HomePage() {
  // Fetch everything in parallel on the server
  const [settings, promotions, menuItems, rawReviews, heroSlides] = await Promise.all([
    prisma.global_settings.findFirst(),
    prisma.promotions.findMany({
      where: {
        is_active: true,
        OR: [
          { end_date: null },
          { end_date: { gte: new Date() } }
        ]
      },
      orderBy: { created_at: 'desc' }
    }),
    prisma.menu_items.findMany({
      where: { is_active: true },
      take: 100
    }),
    prisma.reviews.findMany({
      where: { show_on_home: true },
      include: {
        users: {
          select: {
            name: true,
            role: true,
            image: true,
            loyalty_points: true,
            selected_bg: true,
            selected_frame: true,
          }
        },
        menu_items: {
          select: {
            name: true,
          }
        }
      },
      take: 12,
      orderBy: { created_at: 'desc' }
    }),
    prisma.hero_slides.findMany({
      where: { is_active: true },
      orderBy: { order: 'asc' }
    })
  ]);

  // Format hero slides for the UI
  const formattedSlides = heroSlides.map(slide => ({
    id: slide.id,
    title: slide.title,
    subtitle: slide.subtitle,
    tagline: slide.tagline,
    image: slide.image_url,
    accent: slide.accent
  }));

  // Enrich reviews with ranks (server-side calculation)
  const reviews = await Promise.all(rawReviews.map(async (review) => {
    const rank = await prisma.user.count({
      where: {
        loyalty_points: {
          gt: review.users.loyalty_points || 0
        }
      }
    }) + 1;

    return {
      ...review,
      user: { ...review.users, rank },
      menuItem: review.menu_items
    };
  }));

  // Format promotions for the UI

  // Format promotions for the UI
  const formattedPromos = promotions.map(promo => ({
    ...promo,
    imageUrl: promo.image_url,
    selectionRules: promo.selection_rules,
    isActive: promo.is_active,
  }));

  // Format menu items and identify favorites/popular
  const realItems = menuItems.map((item: any) => ({
    ...item,
    image: item.image_url || '🍴',
    ingredients: item.description,
    price: item.price
  }));

  // Logic to identify display items (Favorites)
  const featuredItems = realItems.filter(item => item.bestseller).slice(0, 5);
  const displayItems = featuredItems.length > 0 ? featuredItems : realItems.filter(item => item.popular).slice(0, 5);
  const finalItems = displayItems.length > 0 ? displayItems : realItems.slice(0, 5);

  // Format settings
  const formattedSettings = settings ? {
    ...settings,
    googleMapsUrl: settings.google_maps_url
  } : null;

  return (
    <main className="bg-transparent">
      <Hero slides={formattedSlides as any} />
      <Favorites items={finalItems} />
      <Promotions promos={formattedPromos} />
      <Fidelity />
      <Reviews reviews={reviews} />
      <FAQSection />
      <div id="localisation-section">
        <Localisation settings={formattedSettings} />
      </div>
    </main>
  );
}