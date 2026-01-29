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
        const search = searchParams.get('search');
        const status = searchParams.get('status'); // 'active', 'inactive', 'all'
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const skip = (page - 1) * limit;

        const where: any = {};

        // Category filter
        if (categoryId && categoryId !== 'all') {
            where.categoryId = parseInt(categoryId);
        }

        // Status filter (newer, more specific than showInactive)
        if (status === 'active') {
            where.isActive = true;
        } else if (status === 'inactive') {
            where.isActive = false;
        } else if (showInactive !== 'true') {
            // Backward compatibility
            where.isActive = true;
        }

        // Search filter
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { ingredients: { hasSome: [search] } } // Search in ingredients too
            ];
        }

        const [totalItems, menuItems] = await Promise.all([
            prisma.menuItem.count({ where }),
            prisma.menuItem.findMany({
                where,
                include: {
                    category: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            })
        ]);

        return NextResponse.json({
            success: true,
            menuItems,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                limit
            }
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
