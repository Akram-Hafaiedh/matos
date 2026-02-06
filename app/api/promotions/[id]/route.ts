import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Fetch single promotion
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return NextResponse.json({ success: false, error: 'ID invalide' }, { status: 400 });
    }

    try {
        const promotion = await prisma.promotion.findUnique({
            where: { id }
        });

        if (!promotion) {
            return NextResponse.json({
                success: false,
                error: 'Promotion introuvable'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            promotion
        });

    } catch (error) {
        console.error('Error fetching promotion:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la récupération de la promotion'
        }, { status: 500 });
    }
}

// PUT - Update promotion
export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return NextResponse.json({ success: false, error: 'ID invalide' }, { status: 400 });
    }

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
            originalPrice,
            discount,
            imageUrl,
            emoji,
            badgeText,
            badgeColor,
            isActive,
            isHot,
            tag,
            startDate,
            endDate,
            conditions,
            selectionRules
        } = body;

        const promotion = await prisma.promotion.update({
            where: { id },
            data: {
                name,
                description,
                price: price !== undefined ? (price ? parseFloat(price) : null) : undefined,
                originalPrice: originalPrice !== undefined ? (originalPrice ? parseFloat(originalPrice) : null) : undefined,
                discount: discount !== undefined ? (discount ? parseInt(discount) : null) : undefined,
                imageUrl,
                emoji,
                badgeText,
                badgeColor,
                isActive,
                isHot,
                tag,
                startDate: startDate ? new Date(startDate) : (startDate === null ? null : undefined),
                endDate: endDate ? new Date(endDate) : (endDate === null ? null : undefined),
                conditions,
                selectionRules
            }
        });

        return NextResponse.json({
            success: true,
            promotion
        });

    } catch (error) {
        console.error('Error updating promotion:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la mise à jour de la promotion'
        }, { status: 500 });
    }
}

// DELETE - Delete promotion
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return NextResponse.json({ success: false, error: 'ID invalide' }, { status: 400 });
    }

    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
        }

        await prisma.promotion.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Promotion supprimée'
        });

    } catch (error) {
        console.error('Error deleting promotion:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la suppression de la promotion'
        }, { status: 500 });
    }
}
