import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import SingleItemContent from './SingleItemContent';

export const revalidate = 60; // Regenerate at most once per minute

// Pre-render the most popular items
export async function generateStaticParams() {
    const items = await prisma.menu_items.findMany({
        where: { is_active: true },
        select: { id: true },
        orderBy: [
            { popular: 'desc' },
            { bestseller: 'desc' }
        ],
        take: 20
    });

    return items.map((item) => ({
        id: item.id.toString(),
    }));
}

export default async function SingleItemPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id);

    if (isNaN(id)) return notFound();

    // Fetch item and reviews on segment load
    const [item, reviews] = await Promise.all([
        prisma.menu_items.findUnique({
            where: { id },
            include: { categories: true }
        }),
        prisma.reviews.findMany({
            where: { menu_item_id: id },
            include: { users: true },
            orderBy: { created_at: 'desc' }
        })
    ]);

    if (!item) return notFound();

    // Calculate rating/likes logic (Sync with API/Menu for consistency)
    const hasRealReviews = reviews.length > 0;
    const avgRating = hasRealReviews
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : (4.6 + (item.id % 5) * 0.1);

    const displayReviewCount = hasRealReviews
        ? reviews.length
        : (8 + (item.id % 12));

    // Get real like count
    const likeCountRaw = await prisma.menu_likes.count({
        where: { menu_item_id: id }
    });

    const displayLikeCount = likeCountRaw > 0
        ? likeCountRaw
        : (5 + (item.id % 10));

    // Format for client component
    const formattedItem = {
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
        rating: avgRating,
        reviewCount: displayReviewCount
    };

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <SingleItemContent
                initialItem={formattedItem as any}
                initialReviews={reviews}
                initialLiked={false} // Initially false for static rendering
                initialLikeCount={displayLikeCount}
            />
        </Suspense>
    );
}
