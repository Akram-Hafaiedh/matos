import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// PUT - Update a category
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
        const { name, emoji, displayOrder } = body;

        // Validation
        if (!name) {
            return NextResponse.json({
                success: false,
                error: 'Le nom est requis'
            }, { status: 400 });
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                emoji,
                displayOrder: displayOrder || 0
            }
        });

        return NextResponse.json({
            success: true,
            category
        });

    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la mise à jour de la catégorie'
        }, { status: 500 });
    }
}

// DELETE - Delete a category
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

        // Check if category has menu items
        const menuItemsCount = await prisma.menuItem.count({
            where: { categoryId: id }
        });

        if (menuItemsCount > 0) {
            return NextResponse.json({
                success: false,
                error: `Impossible de supprimer cette catégorie car elle contient ${menuItemsCount} produits`
            }, { status: 400 });
        }

        await prisma.category.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Catégorie supprimée'
        });

    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la suppression de la catégorie'
        }, { status: 500 });
    }
}
