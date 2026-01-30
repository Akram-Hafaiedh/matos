import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const homeOnly = searchParams.get('home') === 'true';

        const reviews = await prisma.review.findMany({
            where: homeOnly ? { showOnHome: true } : {},
            include: {
                user: {
                    select: {
                        name: true,
                        role: true,
                        image: true,
                        loyaltyPoints: true,
                        selectedBg: true,
                        selectedFrame: true,
                    }
                },
                menuItem: {
                    select: {
                        name: true,
                    }
                }
            },
            take: homeOnly ? 12 : 50,
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Calculate rank for each reviewer
        const enrichedReviews = await Promise.all(reviews.map(async (review) => {
            const rank = await prisma.user.count({
                where: {
                    loyaltyPoints: {
                        gt: review.user.loyaltyPoints || 0
                    }
                }
            }) + 1;
            return {
                ...review,
                user: { ...review.user, rank }
            };
        }));

        return NextResponse.json(enrichedReviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
