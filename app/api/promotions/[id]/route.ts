import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
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
        const promotion = await prisma.promotions.findUnique({
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
            original_price,
            discount,
            image_url,
            emoji,
            badge_text,
            badge_color,
            is_active,
            is_hot,
            tag,
            start_date,
            end_date,
            conditions,
            selection_rules
        } = body;

        const promotion = await prisma.promotions.update({
            where: { id },
            data: {
                name,
                description,
                price: price !== undefined ? (price ? parseFloat(price) : null) : undefined,
                original_price: original_price !== undefined ? (original_price ? parseFloat(original_price) : null) : undefined,
                discount: discount !== undefined ? (discount ? parseInt(discount) : null) : undefined,
                image_url: image_url,
                emoji,
                badge_text: badge_text,
                badge_color: badge_color,
                is_active: is_active,
                is_hot: is_hot,
                tag,
                start_date: start_date ? new Date(start_date) : (start_date === null ? null : undefined),
                end_date: end_date ? new Date(end_date) : (end_date === null ? null : undefined),
                conditions,
                selection_rules: selection_rules
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

        await prisma.promotions.delete({
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
