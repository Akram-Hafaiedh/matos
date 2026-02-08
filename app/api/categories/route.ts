// app/api/categories/route.ts
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Fetch all categories
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50'); // Larger limit for categories by default
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }

        const [totalItems, categories] = await Promise.all([
            prisma.categories.count({ where }),
            prisma.categories.findMany({
                where,
                orderBy: {
                    display_order: 'asc'
                },
                skip,
                take: limit
            })
        ]);

        return NextResponse.json({
            success: true,
            categories,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la récupération des catégories'
        }, { status: 500 });
    }
}

// POST - Create a new category
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
        const { name, emoji, display_order: displayOrder } = body;

        // Validation
        if (!name) {
            return NextResponse.json({
                success: false,
                error: 'Le nom est requis'
            }, { status: 400 });
        }

        const newOrder = displayOrder ? parseInt(displayOrder) : 0;

        // Shift existing categories if needed
        if (newOrder > 0) {
            await prisma.categories.updateMany({
                where: { display_order: { gte: newOrder } },
                data: { display_order: { increment: 1 } }
            });
        }

        const category = await prisma.categories.create({
            data: {
                name,
                emoji,
                display_order: newOrder
            }
        });

        return NextResponse.json({
            success: true,
            category
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la création de la catégorie'
        }, { status: 500 });
    }
}
