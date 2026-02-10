import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
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

        // Fetch current state to check if order changed
        const currentCategory = await prisma.categories.findUnique({ where: { id } });
        if (!currentCategory) {
            return NextResponse.json({ success: false, error: 'Catégorie non trouvée' }, { status: 404 });
        }

        const newOrder = displayOrder ? parseInt(displayOrder) : 0;
        const oldOrder = currentCategory.display_order;

        if (newOrder !== oldOrder && newOrder > 0) {
            if (newOrder < oldOrder) {
                // Moving UP: Shift items between new and old orders DOWN
                await prisma.categories.updateMany({
                    where: {
                        display_order: { gte: newOrder, lt: oldOrder }
                    },
                    data: { display_order: { increment: 1 } }
                });
            } else {
                // Moving DOWN: Shift items between old and new orders UP
                await prisma.categories.updateMany({
                    where: {
                        display_order: { gt: oldOrder, lte: newOrder }
                    },
                    data: { display_order: { decrement: 1 } }
                });
            }
        }

        const category = await prisma.categories.update({
            where: { id },
            data: {
                name,
                emoji,
                display_order: newOrder
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
        const menuItemsCount = await prisma.menu_items.count({
            where: { category_id: id }
        });

        if (menuItemsCount > 0) {
            return NextResponse.json({
                success: false,
                error: `Impossible de supprimer cette catégorie car elle contient ${menuItemsCount} produits`
            }, { status: 400 });
        }

        await prisma.categories.delete({
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
