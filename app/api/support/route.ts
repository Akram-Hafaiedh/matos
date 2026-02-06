// app/api/support/route.ts
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Fetch support tickets
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const status = searchParams.get('status'); // 'open', 'resolved', etc.
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const where: any = {};

        // If not admin, only show user's own tickets
        if ((session.user as any).role !== 'admin') {
            where.user_id = (session.user as any).id;
        }

        if (status && status !== 'all') {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { subject: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [totalItems, tickets] = await Promise.all([
            prisma.support_tickets.count({ where }),
            prisma.support_tickets.findMany({
                where,
                include: {
                    users: {
                        select: {
                            name: true,
                            email: true,
                            image: true
                        }
                    },
                    orders: {
                        select: {
                            order_number: true
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                },
                skip,
                take: limit
            })
        ]);

        return NextResponse.json({
            success: true,
            tickets,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        console.error('Error fetching support tickets:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la récupération des tickets'
        }, { status: 500 });
    }
}

// POST - Create a new support ticket
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // We allow guest tickets? Or only logged in users?
        // Let's allow guest tickets but link to user if logged in

        const body = await request.json();
        const { subject, description, orderId, priority } = body;

        if (!subject || !description) {
            return NextResponse.json({
                success: false,
                error: 'Le sujet et la description sont requis'
            }, { status: 400 });
        }

        const ticket = await prisma.support_tickets.create({
            data: {
                subject,
                description,
                order_id: orderId ? parseInt(orderId) : null,
                user_id: session?.user ? (session.user as any).id : null,
                priority: priority || 'medium',
                status: 'open',
                updated_at: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            ticket
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating support ticket:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la création du ticket'
        }, { status: 500 });
    }
}
