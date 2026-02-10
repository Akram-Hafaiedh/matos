import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import SingleItemContent from './SingleItemContent';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const item = await prisma.menu_items.findUnique({
        where: { id: parseInt(id) },
        select: { name: true, ingredients: true, description: true }
    });

    if (!item) return { title: 'Produit non trouvé' };

    return {
        title: item.name,
        description: item.ingredients.length > 0
            ? `Découvrez notre ${item.name} préparé avec : ${item.ingredients.join(', ')}.`
            : item.description || `Découvrez le délice de notre ${item.name}.`,
    };
}

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

export default async function SingleItemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

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

    // Calculate rating/likes logic - Use real data only
    const hasRealReviews = reviews.length > 0;
    const avgRating = hasRealReviews
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    const displayReviewCount = reviews.length;

    // Get real like count
    const displayLikeCount = await prisma.menu_likes.count({
        where: { menu_item_id: id }
    });

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

    // Enrich reviews with user data and rank (consistent with home page)
    const formattedReviews = await Promise.all(reviews.map(async (review) => {
        const rank = await prisma.user.count({
            where: {
                loyalty_points: {
                    gt: review.users.loyalty_points || 0
                }
            }
        }) + 1;

        return {
            id: review.id,
            rating: review.rating,
            comment: review.comment,
            created_at: review.created_at,
            user: {
                name: review.users.name,
                image: review.users.image,
                role: review.users.role,
                rank,
                selectedBg: review.users.selected_bg,
                selectedFrame: review.users.selected_frame
            }
        };
    }));

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <SingleItemContent
                initialItem={formattedItem as any}
                initialReviews={formattedReviews}
                initialLiked={false} // Initially false for static rendering
                initialLikeCount={displayLikeCount}
            />
        </Suspense>
    );
}
