import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const reviews = await prisma.reviews.findMany({
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
