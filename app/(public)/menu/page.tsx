import { prisma } from '@/lib/prisma';
import { Suspense } from 'react';
import MenuContent from './MenuContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Notre Carte",
    description: "Découvrez notre sélection de Pizzas artisanales, Burgers gourmets, Tacos et plats signature. Ingrédients frais et saveurs authentiques.",
    keywords: ["menu matos", "pizza tunis", "burger gourmet", "restaurant carthage", "tacos tunisie"]
};

export const revalidate = 60; // Regenerate at most once per minute

export default async function MenuPage() {
    // Fetch initial data on the server
    const [categories, rawItems] = await Promise.all([
        prisma.categories.findMany({
            where: { is_active: true },
            orderBy: { display_order: 'asc' }
        }),
        prisma.menu_items.findMany({
            where: { is_active: true },
            include: {
                categories: true,
                _count: {
                    select: {
                        menu_likes: true,
                        reviews: true
                    }
                },
                reviews: {
                    select: {
                        rating: true
                    }
                }
            },
            take: 8,
            orderBy: [
                { categories: { display_order: 'asc' } },
                { display_order: 'asc' },
                { created_at: 'desc' }
            ]
        })
    ]);

    // Format items for the UI (Replicating API logic for consistency)
    const initialItems = rawItems.map(item => {
        const realReviewCount = item._count.reviews;
        const avgRating = realReviewCount > 0
            ? item.reviews.reduce((acc, curr) => acc + curr.rating, 0) / realReviewCount
            : 0;

        const displayLikeCount = item._count.menu_likes;

        return {
            id: item.id,
            name: item.name,
            price: item.price as any,
            ingredients: item.ingredients.join(', ') || item.description,
            popular: item.popular,
            bestseller: item.bestseller,
            hot: item.hot,
            image: item.image_url || item.emoji || '🍽️',
            category: item.categories?.name || 'Général',
            discount: item.discount,
            displayOrder: item.display_order,
            likeCount: displayLikeCount,
            rating: avgRating,
            reviewCount: realReviewCount
        };
    });

    // Get total count for initial pagination
    const initialTotal = await prisma.menu_items.count({
        where: { is_active: true }
    });

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-400 rounded-full animate-spin"></div>
                    <p className="text-yellow-400 font-black uppercase text-xs tracking-[0.5em] animate-pulse">Chargement de la Carte</p>
                </div>
            </div>
        }>
            <MenuContent
                initialCategories={categories}
                initialItems={initialItems as any}
                initialTotal={initialTotal}
            />
        </Suspense>
    );
}
