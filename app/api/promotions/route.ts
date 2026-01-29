import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
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
            where.isActive = true;
        } else if (status === 'inactive') {
            where.isActive = false;
        } else if (onlyActive) {
            where.isActive = true;
            where.OR = [
                { endDate: null },
                { endDate: { gte: new Date() } }
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
            prisma.promotion.count({ where }),
            prisma.promotion.findMany({
                where,
                orderBy: {
                    createdAt: 'desc'
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
            originalPrice,
            discount,
            imageUrl,
            emoji,
            badgeText,
            badgeColor,
            isActive,
            startDate,
            endDate,
            conditions,
            selectionRules
        } = body;

        if (!name) {
            return NextResponse.json({
                success: false,
                error: 'Le nom est requis'
            }, { status: 400 });
        }

        const promotion = await prisma.promotion.create({
            data: {
                name,
                description,
                price: price ? parseFloat(price) : null,
                originalPrice: originalPrice ? parseFloat(originalPrice) : null,
                discount: discount ? parseInt(discount) : null,
                imageUrl,
                emoji,
                badgeText,
                badgeColor,
                isActive: isActive !== undefined ? isActive : true,
                startDate: startDate ? new Date(startDate) : null,
                endDate: endDate ? new Date(endDate) : null,
                conditions,
                selectionRules
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
