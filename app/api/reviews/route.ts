import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const homeOnly = searchParams.get('home') === 'true';
        const menuItemId = searchParams.get('menuItemId');

        const where: any = {};
        if (homeOnly) where.show_on_home = true;
        if (menuItemId) where.menu_item_id = parseInt(menuItemId);

        const reviews = await prisma.reviews.findMany({
            where,
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
            take: homeOnly ? 12 : 50,
            orderBy: {
                created_at: 'desc'
            }
        });

        // Simulation for empty item-specific reviews
        if (reviews.length === 0 && menuItemId) {
            const itemId = parseInt(menuItemId);
            const FAKE_MESSAGES = [
                "Une explosion de saveurs ! La qualité est vraiment au rendez-vous.",
                "Délicieux et copieux, je recommande vivement.",
                "La fraîcheur des produits se ressent à chaque bouchée. Un vrai régal !",
                "Vraiment top, le goût est authentique et les portions généreuses.",
                "Une de mes découvertes préférées à Carthage. Bravo à l'équipe !",
                "Excellent rapport qualité-prix, je reviendrai sans hésiter.",
                "Toujours aussi bon, c'est devenu mon rituel préféré.",
                "Les saveurs sont équilibrées et la présentation est soignée."
            ];

            const FAKE_NAMES = ["Yassine B.", "Sarra M.", "Ahmed K.", "Linda T.", "Mehdi L.", "Olfa G."];

            const simulatedReviews = [];
            const count = 3 + (itemId % 3); // 3 to 5 simulated reviews

            for (let i = 0; i < count; i++) {
                simulatedReviews.push({
                    id: `sim-${itemId}-${i}`,
                    rating: 5,
                    comment: FAKE_MESSAGES[(itemId + i) % FAKE_MESSAGES.length],
                    created_at: new Date(Date.now() - (i + 1) * 86400000 * (itemId % 5 + 1)).toISOString(),
                    user: {
                        name: FAKE_NAMES[(itemId + i) % FAKE_NAMES.length],
                        rank: 5 + (i * 2),
                        image: null,
                        role: 'customer'
                    },
                    menuItem: {
                        name: "Produit Mato's" // Fallback name for simulated reviews
                    }
                });
            }
            return NextResponse.json({ success: true, reviews: simulatedReviews });
        }

        // Calculate rank for each reviewer
        const enrichedReviews = [];
        for (const review of reviews) {
            const rank = await prisma.user.count({
                where: {
                    loyalty_points: {
                        gt: review.users.loyalty_points || 0
                    }
                }
            }) + 1;

            enrichedReviews.push({
                ...review,
                user: { ...review.users, rank },
                menuItem: review.menu_items // Alias for frontend compatibility
            });
        }

        return NextResponse.json({ success: true, reviews: enrichedReviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { menuItemId, userId, rating, comment } = body;

        if (!menuItemId || !userId || !rating) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const review = await prisma.reviews.create({
            data: {
                menu_item_id: parseInt(menuItemId),
                user_id: userId,
                rating,
                comment,
                show_on_home: rating >= 4 // Auto-feature high ratings
            },
            include: {
                users: {
                    select: {
                        name: true,
                        image: true,
                        loyalty_points: true,
                    }
                }
            }
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
