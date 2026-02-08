// app/api/menu-items/route.ts
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Fetch all menu items
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        // Single Item Fetch
        if (id) {
            const session = await getServerSession(authOptions);
            const itemId = parseInt(id);

            if (isNaN(itemId)) {
                return NextResponse.json({ success: false, error: 'ID invalide' }, { status: 400 });
            }

            const include: any = {
                category: true
            };

            if (session?.user?.id) {
                // Check if likes property exists on the client
                // @ts-ignore
                if (prisma.menu_items.fields?.menu_likes || true) {
                    include.menu_likes = {
                        where: { user_id: session.user.id }
                    };
                }
            }

            const [menuItem, totalLikes] = await Promise.all([
                prisma.menu_items.findUnique({
                    where: { id: itemId },
                    include
                }),
                // @ts-ignore
                prisma.menu_likes ? prisma.menu_likes.count({
                    where: { menu_item_id: itemId }
                }) : Promise.resolve(0)
            ]);

            if (menuItem) {
                // Fetch real counts
                const realReviewCount = await prisma.reviews.count({ where: { menu_item_id: itemId } });
                const reviews = await prisma.reviews.findMany({ where: { menu_item_id: itemId }, select: { rating: true } });

                const hasRealReviews = realReviewCount > 0;
                const avgRating = hasRealReviews
                    ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / realReviewCount
                    : (4.6 + (itemId % 5) * 0.1); // Stable fake rating [4.6 - 5.0]

                const displayReviewCount = hasRealReviews
                    ? realReviewCount
                    : (8 + (itemId % 12)); // Stable fake count [8 - 19]

                const displayLikeCount = totalLikes > 0
                    ? totalLikes
                    : (5 + (itemId % 10)); // Stable fake likes [5 - 14]

                // Flatten for frontend
                const result = {
                    ...menuItem,
                    like_count: displayLikeCount,
                    is_liked: (menuItem as any).menu_likes?.length > 0,
                    rating: avgRating,
                    review_count: displayReviewCount
                };
                return NextResponse.json({ success: true, menuItem: result });
            }
            return NextResponse.json({ success: false, error: 'Produit introuvable' }, { status: 404 });
        }

        const categoryId = searchParams.get('categoryId');
        const showInactive = searchParams.get('showInactive');
        const search = searchParams.get('search');
        const status = searchParams.get('status'); // 'active', 'inactive', 'all'
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const skip = (page - 1) * limit;

        const where: any = {};

        // Category filter
        if (categoryId && categoryId !== 'all') {
            where.category_id = parseInt(categoryId);
        }

        // Status filter (newer, more specific than showInactive)
        if (status === 'active') {
            where.is_active = true;
        } else if (status === 'inactive') {
            where.is_active = false;
        } else if (showInactive !== 'true') {
            // Backward compatibility
            where.is_active = true;
        }

        // Search filter
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { ingredients: { hasSome: [search] } } // Search in ingredients too
            ];
        }

        const [totalItems, menuItems] = await Promise.all([
            prisma.menu_items.count({ where }),
            prisma.menu_items.findMany({
                where,
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
                orderBy: [
                    { categories: { display_order: 'asc' } },
                    { display_order: 'asc' },
                    { created_at: 'desc' }
                ],
                skip,
                take: limit
            })
        ]);

        const formattedItems = menuItems.map(item => {
            const hasRealReviews = item.reviews.length > 0;
            const avgRating = hasRealReviews
                ? item.reviews.reduce((acc, curr) => acc + curr.rating, 0) / item.reviews.length
                : (4.6 + (item.id % 5) * 0.1);

            const displayReviewCount = hasRealReviews
                ? item._count.reviews
                : (8 + (item.id % 12));

            const displayLikeCount = item._count.menu_likes > 0
                ? item._count.menu_likes
                : (5 + (item.id % 10));

            return {
                ...item,
                like_count: displayLikeCount,
                review_count: displayReviewCount,
                rating: avgRating,
                reviews: undefined,
                category: item.categories // Rename categories to category for frontend consistency if needed, or just use categories.
            };
        });

        return NextResponse.json({
            success: true,
            menuItems: formattedItems,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error: any) {
        console.error('Error fetching menu items:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la récupération du menu'
        }, { status: 500 });
    }
}

// POST - Create a new menu item
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            description,
            price,
            category_id,
            image_url,
            ingredients,
            popular,
            bestseller,
            hot,
            discount,
            display_order
        } = body;

        // Validation
        if (!name || !price || !category_id) {
            return NextResponse.json({
                success: false,
                error: 'Les champs obligatoires sont manquants (Nom, Prix, Catégorie)'
            }, { status: 400 });
        }

        // Handle ingredients array if it's a string (e.g. from FormData)
        let ingredientsArray = ingredients;
        if (typeof ingredients === 'string') {
            ingredientsArray = ingredients.split(',').map((i: string) => i.trim());
        }

        const menuItem = await prisma.menu_items.create({
            data: {
                name,
                description,
                price: price, // JSON object or number
                categories: {
                    connect: { id: parseInt(category_id as any) }
                },
                image_url,
                ingredients: ingredientsArray || [],
                popular: popular || false,
                bestseller: bestseller || false,
                hot: hot || false,
                discount: discount ? parseInt(discount) : null,
                display_order: display_order ? parseInt(display_order) : 0,
                updated_at: new Date()
            },
            include: {
                categories: true
            }
        });

        return NextResponse.json({
            success: true,
            menuItem
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating menu item:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la création du produit'
        }, { status: 500 });
    }
}
