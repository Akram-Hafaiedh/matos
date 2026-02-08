import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const [totalItems, reviews] = await Promise.all([
            prisma.reviews.count(),
            prisma.reviews.findMany({
                include: {
                    users: {
                        select: {
                            name: true,
                            role: true,
                            image: true,
                        }
                    },
                    menu_items: {
                        select: {
                            name: true,
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                },
                skip,
                take: limit
            })
        ]);

        const formattedReviews = reviews.map(r => ({
            ...r,
            user: r.users,
            menu_item: r.menu_items,
        }));

        return NextResponse.json({
            success: true,
            reviews: formattedReviews,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, show_on_home: showOnHome } = body;

        const updatedReview = await prisma.reviews.update({
            where: { id },
            data: { show_on_home: showOnHome }
        });

        return NextResponse.json(updatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
