import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                success: false,
                error: 'Non autorisé'
            }, { status: 401 });
        }

        const ticketId = parseInt(id);

        if (isNaN(ticketId)) {
            return NextResponse.json({
                success: false,
                error: 'ID de ticket invalide'
            }, { status: 400 });
        }

        const ticket = await prisma.support_tickets.findUnique({
            where: { id: ticketId },
            include: {
                ticket_messages: {
                    include: {
                        users: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    },
                    orderBy: {
                        created_at: 'asc'
                    }
                },
                users: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                },
                orders: {
                    select: {
                        order_number: true,
                        total_amount: true,
                        status: true
                    }
                }
            }
        });

        if (!ticket) {
            return NextResponse.json({
                success: false,
                error: 'Ticket non trouvé'
            }, { status: 404 });
        }

        // Security: Ensure only the ticket owner or an admin can see the ticket
        if ((session.user as any).role !== 'admin' && ticket.user_id !== (session.user as any).id) {
            return NextResponse.json({
                success: false,
                error: 'Accès non autorisé'
            }, { status: 403 });
        }

        return NextResponse.json({
            success: true,
            ticket
        });
    } catch (error) {
        console.error('Error fetching ticket details:', error);
        return NextResponse.json({
            success: false,
            error: 'Erreur lors de la récupération du ticket'
        }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Non autorisé' }, { status: 401 });
        }

        const body = await request.json();
        const { status } = body;

        const ticket = await prisma.support_tickets.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        return NextResponse.json({ success: true, ticket });
    } catch (error) {
        console.error('Error updating ticket status:', error);
        return NextResponse.json({ success: false, error: 'Erreur mise à jour status' }, { status: 500 });
    }
}
