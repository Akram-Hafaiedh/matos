import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const menuItemId = searchParams.get('menuItemId');

    if (!menuItemId) {
        return NextResponse.json({ success: false, error: 'MenuItemId requis' }, { status: 400 });
    }

    try {
        const reviews = await prisma.review.findMany({
            where: { menuItemId: parseInt(menuItemId) },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const averageRating = reviews.length > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
            : 0;

        return NextResponse.json({ success: true, reviews, averageRating, totalReviews: reviews.length });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
        }

        const body = await request.json();
        const { menuItemId, rating, comment } = body;

        if (!menuItemId || !rating) {
            return NextResponse.json({ success: false, error: 'Données manquantes' }, { status: 400 });
        }

        // Check if user already reviewed this item
        const existingReview = await prisma.review.findFirst({
            where: {
                userId: (session.user as any).id,
                menuItemId: parseInt(menuItemId)
            }
        });

        if (existingReview) {
            const updatedReview = await prisma.review.update({
                where: { id: existingReview.id },
                data: { rating, comment }
            });
            return NextResponse.json({ success: true, review: updatedReview, message: 'Avis mis à jour' });
        }

        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                menuItemId: parseInt(menuItemId),
                userId: (session.user as any).id
            }
        });

        return NextResponse.json({ success: true, review });
    } catch (error) {
        console.error('Review Error:', error);
        return NextResponse.json({ success: false, error: 'Erreur lors de la publication' }, { status: 500 });
    }
}
