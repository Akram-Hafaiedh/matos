// app/api/menu-items/[id]/route.ts
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Fetch single menu item
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
        const menuItem = await prisma.menu_items.findUnique({
            where: { id },
            include: {
                categories: true
            }
        });

        if (!menuItem) {
            return NextResponse.json({
                success: false,
                error: 'Produit introuvable'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            menuItem: {
                ...menuItem,
                imageUrl: (menuItem as any).image_url,
                displayOrder: (menuItem as any).display_order,
                categoryId: (menuItem as any).category_id,
                isActive: (menuItem as any).is_active
            }
        });
    } catch (error) {
        console.error('Error fetching menu item:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur serveur'
        }, { status: 500 });
    }
}

// PUT - Update menu item
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
            categoryId,
            image_url,
            ingredients,
            is_active,
            popular,
            bestseller,
            hot,
            discount
        } = body;

        const updateData: any = {
            name,
            description,
            price,
            image_url,
            is_active,
            popular,
            bestseller,
            hot,
            discount
        };

        if (categoryId) {
            updateData.categories = {
                connect: { id: parseInt(categoryId) }
            };
        }

        if (ingredients) {
            let ingredientsArray = ingredients;
            if (typeof ingredients === 'string') {
                ingredientsArray = ingredients.split(',').map((i: string) => i.trim());
            }
            updateData.ingredients = ingredientsArray;
        }

        const menuItem = await prisma.menu_items.update({
            where: { id },
            data: updateData,
            include: {
                categories: true
            }
        });

        return NextResponse.json({
            success: true,
            menuItem: {
                ...menuItem,
                imageUrl: (menuItem as any).image_url,
                displayOrder: (menuItem as any).display_order,
                categoryId: (menuItem as any).category_id,
                isActive: (menuItem as any).is_active
            }
        });

    } catch (error) {
        console.error('Error updating menu item:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la mise à jour'
        }, { status: 500 });
    }
}

// DELETE - Delete menu item
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

        await prisma.menu_items.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Produit supprimé'
        });

    } catch (error) {
        console.error('Error deleting menu item:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la suppression'
        }, { status: 500 });
    }
}
