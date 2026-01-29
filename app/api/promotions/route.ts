import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Fetch all promotions
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const onlyActive = searchParams.get('active') === 'true';

        const where: any = {};
        if (onlyActive) {
            where.isActive = true;
            where.OR = [
                { endDate: null },
                { endDate: { gte: new Date() } }
            ];
        }

        const promotions = await prisma.promotion.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            promotions
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
