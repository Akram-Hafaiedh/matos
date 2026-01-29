// app/api/menu-items/route.ts
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Fetch all menu items
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const showInactive = searchParams.get('showInactive');

        const where: any = {};

        if (categoryId && categoryId !== 'all') {
            where.categoryId = parseInt(categoryId);
        }

        if (showInactive !== 'true') {
            where.isActive = true;
        }

        const menuItems = await prisma.menuItem.findMany({
            where,
            include: {
                category: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            menuItems
        });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la récupération du menu'
        }, { status: 500 });
    }
}

// POST - Create a new menu item
export async function POST(request: NextRequest) {
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
            imageUrl,
            ingredients,
            popular,
            bestseller,
            hot,
            discount
        } = body;

        // Validation
        if (!name || !price || !categoryId) {
            return NextResponse.json({
                success: false,
                error: 'Les champs obligatoires sont manquants (Nom, Prix, Catégorie)'
            }, { status: 400 });
        }

        // Handle ingredients array if it's a string (e.g. from FormData)
        let ingredientsArray = ingredients;
        if (typeof ingredients === 'string') {
            ingredientsArray = ingredients.split(',').map((i: string) => i.trim());
        }

        const menuItem = await prisma.menuItem.create({
            data: {
                name,
                description,
                price: price, // JSON object or number
                category: {
                    connect: { id: parseInt(categoryId) }
                },
                imageUrl,
                ingredients: ingredientsArray || [],
                popular: popular || false,
                bestseller: bestseller || false,
                hot: hot || false,
                discount: discount ? parseInt(discount) : null
            },
            include: {
                category: true
            }
        });

        return NextResponse.json({
            success: true,
            menuItem
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating menu item:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la création du produit'
        }, { status: 500 });
    }
}
