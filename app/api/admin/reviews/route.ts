import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        role: true,
                        image: true,
                    }
                },
                menuItem: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, showOnHome } = body;

        const updatedReview = await prisma.review.update({
            where: { id },
            data: { showOnHome }
        });

        return NextResponse.json(updatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
