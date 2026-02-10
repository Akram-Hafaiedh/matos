import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch all promotions
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const onlyActive = searchParams.get('active') === 'true';
        const search = searchParams.get('search');
        const status = searchParams.get('status'); // 'active', 'inactive', 'all'
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const skip = (page - 1) * limit;

        const where: any = {};

        // Status handling
        if (status === 'active') {
            where.is_active = true;
        } else if (status === 'inactive') {
            where.is_active = false;
        } else if (onlyActive) {
            where.is_active = true;
            where.OR = [
                { end_date: null },
                { end_date: { gte: new Date() } }
            ];
        }

        // Search handling
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [totalItems, promotions] = await Promise.all([
            prisma.promotions.count({ where }),
            prisma.promotions.findMany({
                where,
                orderBy: {
                    created_at: 'desc'
                },
                skip,
                take: limit
            })
        ]);

        return NextResponse.json({
            success: true,
            promotions,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error('Error fetching promotions:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la récupération des promotions'
        }, { status: 500 });
    }
}

// POST - Create a new promotion
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

        if (!name) {
            return NextResponse.json({
                success: false,
                error: 'Le nom est requis'
            }, { status: 400 });
        }

        const promotion = await prisma.promotions.create({
            data: {
                name,
                description,
                price: price ? parseFloat(price) : null,
                original_price: original_price ? parseFloat(original_price) : null,
                discount: discount ? parseInt(discount) : null,
                image_url,
                emoji,
                badge_text,
                badge_color,
                is_active: is_active !== undefined ? is_active : true,
                is_hot: is_hot !== undefined ? is_hot : false,
                tag,
                start_date: start_date ? new Date(start_date) : null,
                end_date: end_date ? new Date(end_date) : null,
                conditions,
                selection_rules
            }
        });

        return NextResponse.json({
            success: true,
            promotion
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating promotion:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la création de la promotion'
        }, { status: 500 });
    }
}
